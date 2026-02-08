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
import { saveLeadToFirestore, saveAISubmission, type LeadData } from '@/lib/firebase/collections';
import { roiFormSchemaV2 } from '@/lib/utils/validators';
import { buildROIPromptV2 } from '@/lib/gemini/prompts';
import type { ROICalculatorResponseV2 } from '@/types/api';

// Rate limiting configuration
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
const MAX_OUTPUT_TOKENS = 8192;
const TIMEOUT_MS = 60000; // 60 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = roiFormSchemaV2.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `roi-calculator:${hashIP(clientIP)}`;
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
        "You've used ROI Calculator 5 times today. Come back tomorrow for more free calculations, or book a call for a detailed ROI analysis.",
        429,
        { retryAfter }
      );
    }

    // 3. Build prompt and call Gemini
    const locale = validatedData.locale === 'ar' ? 'ar' : 'en';
    const prompt = buildROIPromptV2(validatedData);

    const result = await generateJsonContent<ROICalculatorResponseV2>(prompt, {
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
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

      const leadData: Omit<LeadData, 'converted' | 'notes'> = {
        email: validatedData.email,
        whatsapp: validatedData.whatsapp ?? false,
        source: 'roi-calculator' as const,
        locale: locale,
        metadata: {
          ...metadata,
          ipCountry: undefined,
        },
      };

      const leadId = await saveLeadToFirestore(leadData);

      const submissionRequest: Record<string, unknown> = validatedData.mode === 'from-estimate'
        ? {
            mode: 'from-estimate',
            projectName: validatedData.projectName,
            projectType: validatedData.projectType,
            estimatedCost: validatedData.estimatedCost,
            estimatedTimeline: validatedData.estimatedTimeline,
            approach: validatedData.approach,
            targetMarket: validatedData.targetMarket,
          }
        : {
            mode: 'standalone',
            ideaDescription: validatedData.ideaDescription,
            targetMarket: validatedData.targetMarket,
            budgetRange: validatedData.budgetRange,
          };

      await saveAISubmission({
        tool: 'roi-calculator',
        leadId,
        request: submissionRequest,
        response: result.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      console.error('[ROI Calculator API] Failed to save to Firestore (non-fatal):', saveError);
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
    console.error('[ROI Calculator API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to calculate ROI. Please try again.',
      500
    );
  }
}
