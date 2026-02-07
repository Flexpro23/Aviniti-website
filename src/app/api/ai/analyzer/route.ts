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
import { analyzerFormSchema } from '@/lib/utils/validators';
import { buildAnalyzerPrompt } from '@/lib/gemini/prompts';
import type { AnalyzerResponse } from '@/types/api';

// Rate limiting configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
const TIMEOUT_MS = 60000; // 60 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = analyzerFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `analyzer:${hashIP(clientIP)}`;
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
        "You've used AI Analyzer 3 times today. Come back tomorrow for 3 more free sessions, or book a call for unlimited analysis.",
        429,
        { retryAfter }
      );
    }

    // 3. Build prompt and call Gemini
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const prompt = buildAnalyzerPrompt({
      idea: validatedData.idea,
      targetAudience: validatedData.targetAudience,
      industry: validatedData.industry,
      revenueModel: validatedData.revenueModel,
      locale,
    });

    const result = await generateJsonContent<AnalyzerResponse>(prompt, {
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
        source: 'analyzer',
        locale: locale,
        idea: validatedData.idea,
        targetAudience: validatedData.targetAudience,
        industry: validatedData.industry,
        metadata: {
          ...metadata,
          ipCountry: undefined,
        },
      });

      await saveAISubmission({
        tool: 'analyzer',
        leadId,
        request: {
          idea: validatedData.idea,
          targetAudience: validatedData.targetAudience,
          industry: validatedData.industry,
          revenueModel: validatedData.revenueModel,
        },
        response: result.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      console.error('[Analyzer API] Failed to save to Firestore (non-fatal):', saveError);
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
    console.error('[Analyzer API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to analyze your idea. Please try again.',
      500
    );
  }
}
