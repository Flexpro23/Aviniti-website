export const maxDuration = 60;

import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import { createErrorResponse, createSuccessResponse, hashIP, sanitizePromptInput, detectInputLanguage, getLocalizedRateLimitMessage } from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { analyzeIdeaSchema } from '@/lib/utils/validators';
import { buildAnalyzeIdeaPrompt } from '@/lib/gemini/prompts';
import type { AnalyzeIdeaResponse } from '@/types/api';
import { logServerError } from '@/lib/firebase/error-logging';

const RATE_LIMIT = 15;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const TEMPERATURE = 0.5;
const TIMEOUT_MS = 30000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = analyzeIdeaSchema.parse(body);

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `analyze-idea:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    // Resolve locale early so we can use it for the rate-limit error message
    // before the full locale-dependent processing block below.
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        getLocalizedRateLimitMessage(locale),
        429
      );
    }
    const sanitizedDescription = sanitizePromptInput(validatedData.description, 2000);
    const inputLanguage = detectInputLanguage(validatedData.description);

    const prompt = buildAnalyzeIdeaPrompt({
      projectType: validatedData.projectType,
      description: sanitizedDescription,
      locale,
      inputLanguage,
    });

    const result = await generateJsonContent<AnalyzeIdeaResponse>(prompt, {
      temperature: TEMPERATURE,
      maxOutputTokens: 2048,
      timeoutMs: TIMEOUT_MS,
    });

    if (!result.success || !result.data) {
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI service is temporarily unavailable. Please try again in a few minutes.',
        503
      );
    }

    const response = createSuccessResponse(result.data);
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse('VALIDATION_ERROR', error.issues[0].message, 400);
    }

    logServerError('analyze-idea-api', 'Unexpected error in analyze idea handler', error);
    return createErrorResponse('INTERNAL_ERROR', 'Failed to analyze idea. Please try again.', 500);
  }
}
