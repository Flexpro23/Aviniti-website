import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  extractRequestMetadata,
  hashIP,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { saveLeadToFirestore, saveAISubmission } from '@/lib/firebase/collections';
import { ideaLabFormSchema } from '@/lib/utils/validators';
import { buildIdeaLabPrompt } from '@/lib/gemini/prompts';
import type { IdeaLabResponse } from '@/types/api';

// Rate limiting configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.7;
const TIMEOUT_MS = 45000; // 45 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = ideaLabFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `idea-lab:${hashIP(clientIP)}`;
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return createErrorResponse(
        'RATE_LIMITED',
        "You've used Idea Lab 3 times today. Come back tomorrow for 3 more free sessions, or book a call for unlimited brainstorming.",
        429,
        { retryAfter }
      );
    }

    // 3. Build prompt and call Gemini
    const locale = ((body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar');
    const prompt = buildIdeaLabPrompt({
      background: validatedData.background,
      industry: validatedData.industry,
      problem: validatedData.problem,
      locale,
      existingIdeas: validatedData.existingIdeas,
    });

    const result = await generateJsonContent<IdeaLabResponse>(prompt, {
      temperature: TEMPERATURE,
      maxOutputTokens: 4096,
      timeoutMs: TIMEOUT_MS,
    });

    if (!result.success || !result.data) {
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI service is temporarily unavailable. Please try again in a few minutes.',
        503
      );
    }

    const processingTimeMs = Date.now() - startTime;

    // 4. Save to Firestore (non-blocking — don't fail the request if save fails)
    try {
      const metadata = extractRequestMetadata(request);

      const leadId = await saveLeadToFirestore({
        email: validatedData.email,
        phone: validatedData.phone || null,
        whatsapp: validatedData.whatsapp,
        source: 'idea-lab',
        locale: locale,
        background: validatedData.background,
        industry: validatedData.industry,
        problem: validatedData.problem,
        metadata: {
          ...metadata,
          ipCountry: undefined,
        },
      });

      await saveAISubmission({
        tool: 'idea-lab',
        leadId,
        request: {
          background: validatedData.background,
          industry: validatedData.industry,
          problem: validatedData.problem,
        },
        response: result.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      console.error('[Idea Lab API] Failed to save to Firestore (non-fatal):', saveError);
    }

    // 5. Return success response
    const response = createSuccessResponse(result.data);

    // Copy rate limit headers to response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return createErrorResponse(
        'VALIDATION_ERROR',
        firstError.message,
        400
      );
    }

    // Log unexpected errors
    console.error('[Idea Lab API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate ideas. Please try again.',
      500
    );
  }
}
