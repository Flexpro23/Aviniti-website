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
import { estimateFormSchema } from '@/lib/utils/validators';
import { buildEstimatePrompt } from '@/lib/gemini/prompts';
import type { EstimateResponse } from '@/types/api';

// Rate limiting configuration
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
const TIMEOUT_MS = 45000; // 45 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = estimateFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `estimate:${hashIP(clientIP)}`;
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
        "You've used Get AI Estimate 5 times today. Come back tomorrow for more free estimates, or book a call for a detailed consultation.",
        429,
        { retryAfter }
      );
    }

    // 3. Build prompt and call Gemini
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const prompt = buildEstimatePrompt({
      projectType: validatedData.projectType,
      features: validatedData.features,
      customFeatures: validatedData.customFeatures,
      timeline: validatedData.timeline,
      description: validatedData.description,
      locale,
    });

    const result = await generateJsonContent<EstimateResponse>(prompt, {
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

    // 4. Save to Firestore
    const metadata = extractRequestMetadata(request);

    // Save lead
    const leadId = await saveLeadToFirestore({
      email: validatedData.email,
      name: validatedData.name,
      company: validatedData.company || null,
      phone: validatedData.phone || null,
      whatsapp: validatedData.whatsapp,
      source: 'estimate',
      locale: locale,
      projectType: validatedData.projectType,
      features: validatedData.features,
      customFeatures: validatedData.customFeatures,
      timeline: validatedData.timeline,
      description: validatedData.description,
      metadata: {
        ...metadata,
        ipCountry: undefined,
      },
    });

    // Save AI submission
    await saveAISubmission({
      tool: 'estimate',
      leadId,
      request: {
        projectType: validatedData.projectType,
        features: validatedData.features,
        customFeatures: validatedData.customFeatures,
        timeline: validatedData.timeline,
        description: validatedData.description,
      },
      response: result.data as unknown as Record<string, unknown>,
      processingTimeMs,
      model: 'gemini-1.5-flash',
      locale: locale,
      status: 'completed',
    });

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
    console.error('[Estimate API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate estimate. Please try again.',
      500
    );
  }
}
