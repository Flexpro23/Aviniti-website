import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  hashIP,
  getLocalizedRateLimitMessage,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { ideaLabDiscoverSchema } from '@/lib/utils/validators';
import { buildIdeaLabDiscoverPrompt } from '@/lib/gemini/prompts/idea-lab-discover';
import { ideaLabDiscoverResponseSchema } from '@/lib/gemini/schemas';
import type { IdeaLabDiscoverResponse } from '@/types/api';
import { logServerError, logServerWarning, logServerInfo } from '@/lib/firebase/error-logging';

// Rate limiting configuration — shared with generate endpoint (6 per 24h for refreshes)
const RATE_LIMIT = 6;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.5;
const TIMEOUT_MS = 45000; // 45 seconds (Arabic responses can take longer)
const MAX_AI_ATTEMPTS = 2; // Retry once if validation fails

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = ideaLabDiscoverSchema.parse(body);

    // 2. Rate limiting (shared key with generate endpoint)
    const clientIP = getClientIP(request);
    const rateLimitKey = `idea-lab:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return createErrorResponse(
        'RATE_LIMITED',
        getLocalizedRateLimitMessage(validatedData.locale),
        429,
        { retryAfter }
      );
    }

    // 3. Resolve output language and build prompt (with retry on validation failure)
    // The discover step has no free-text body to analyse yet, so we cannot
    // run detectInputLanguage() on actual user input here. Instead we accept
    // an explicit `inputLanguage` from the client (e.g. carried forward from a
    // prior session) and let the prompt builder fall back to `locale` when it
    // is absent. This is the same contract as the generate endpoint.
    const prompt = buildIdeaLabDiscoverPrompt({
      persona: validatedData.persona,
      industry: validatedData.industry,
      locale: validatedData.locale,
      inputLanguage: validatedData.inputLanguage,
    });

    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        logServerInfo('api/ai/idea-lab/discover', `Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`, { attempt });
      }

      const result = await generateJsonContent<IdeaLabDiscoverResponse>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: 2048,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        logServerWarning('idea-lab-discover-api', `Gemini call failed (attempt ${attempt + 1})`, { error: result.error || 'No data returned' });
        lastError = result.error || 'AI service returned no data';
        continue; // try again
      }

      // 4. Validate AI response
      const validated = ideaLabDiscoverResponseSchema.safeParse(result.data);
      if (!validated.success) {
        logServerWarning('idea-lab-discover-api', `Validation failed (attempt ${attempt + 1})`, { issues: validated.error.issues });
        lastError = `Validation: ${validated.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`;
        continue; // try again
      }

      // 5. Return success response
      const response = createSuccessResponse(validated.data);
      headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // All attempts failed
    logServerError('idea-lab-discover-api', `All ${MAX_AI_ATTEMPTS} attempts failed. Last error: ${lastError}`);
    return createErrorResponse(
      'AI_UNAVAILABLE',
      'Our AI service is temporarily unavailable. Please try again in a few minutes.',
      503
    );
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
    logServerError('idea-lab-discover-api', 'Unexpected error in discover handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate discovery questions. Please try again.',
      500
    );
  }
}
