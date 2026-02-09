import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  hashIP,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { ideaLabDiscoverSchema } from '@/lib/utils/validators';
import { buildIdeaLabDiscoverPrompt } from '@/lib/gemini/prompts/idea-lab-discover';
import { ideaLabDiscoverResponseSchema } from '@/lib/gemini/schemas';
import type { IdeaLabDiscoverResponse } from '@/types/api';

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

    // 3. Build prompt and call Gemini (with retry on validation failure)
    const prompt = buildIdeaLabDiscoverPrompt({
      persona: validatedData.persona,
      industry: validatedData.industry,
      locale: validatedData.locale,
    });

    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        console.log(`[Idea Lab Discover] Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`);
      }

      const result = await generateJsonContent<IdeaLabDiscoverResponse>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: 2048,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        console.error(
          `[Idea Lab Discover] Gemini call failed (attempt ${attempt + 1}):`,
          result.error || 'No data returned'
        );
        lastError = result.error || 'AI service returned no data';
        continue; // try again
      }

      // 4. Validate AI response
      const validated = ideaLabDiscoverResponseSchema.safeParse(result.data);
      if (!validated.success) {
        console.error(
          `[Idea Lab Discover] Validation failed (attempt ${attempt + 1}):`,
          JSON.stringify(validated.error.issues, null, 2)
        );
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
    console.error(`[Idea Lab Discover] All ${MAX_AI_ATTEMPTS} attempts failed. Last error:`, lastError);
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
    console.error('[Idea Lab Discover] Unexpected error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate discovery questions. Please try again.',
      500
    );
  }
}
