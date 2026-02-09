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
import { ideaLabGenerateSchema } from '@/lib/utils/validators';
import { buildIdeaLabPrompt } from '@/lib/gemini/prompts/idea-lab';
import { ideaLabResponseSchema } from '@/lib/gemini/schemas';
import type { IdeaLabResponse } from '@/types/api';

// Rate limiting configuration — 6 per 24h to allow discover + generate + 2 refreshes + buffer
const RATE_LIMIT = 6;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.7;
const TIMEOUT_MS = 45000; // 45 seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = ideaLabGenerateSchema.parse(body);

    // 2. Rate limiting (shared key with discover endpoint)
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
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const prompt = buildIdeaLabPrompt({
      persona: validatedData.persona,
      industry: validatedData.industry,
      discoveryAnswers: validatedData.discoveryAnswers,
      locale,
      previousIdeaNames: validatedData.previousIdeaNames,
    });

    const MAX_AI_ATTEMPTS = 2;
    let validated: { success: true; data: IdeaLabResponse } | null = null;
    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        console.log(`[Idea Lab Generate] Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`);
      }

      const result = await generateJsonContent<IdeaLabResponse>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: 8192,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        console.error(
          `[Idea Lab Generate] Gemini call failed (attempt ${attempt + 1}):`,
          result.error || 'No data returned'
        );
        lastError = result.error || 'AI service returned no data';
        continue;
      }

      // 4. Validate AI response
      const parseResult = ideaLabResponseSchema.safeParse(result.data);
      if (!parseResult.success) {
        console.error(
          `[Idea Lab Generate] Validation failed (attempt ${attempt + 1}):`,
          JSON.stringify(parseResult.error.issues, null, 2)
        );
        lastError = `Validation: ${parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`;
        continue;
      }

      validated = { success: true, data: parseResult.data as unknown as IdeaLabResponse };
      break;
    }

    if (!validated) {
      console.error(`[Idea Lab Generate] All ${MAX_AI_ATTEMPTS} attempts failed. Last error:`, lastError);
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI service is temporarily unavailable. Please try again in a few minutes.',
        503
      );
    }

    const processingTimeMs = Date.now() - startTime;

    // 5. Save to Firestore (non-blocking)
    try {
      const metadata = extractRequestMetadata(request);

      const leadId = await saveLeadToFirestore({
        email: validatedData.email,
        phone: validatedData.phone || null,
        whatsapp: validatedData.whatsapp,
        source: 'idea-lab',
        locale: locale,
        metadata: {
          ...metadata,
          ipCountry: undefined,
        },
      });

      await saveAISubmission({
        tool: 'idea-lab',
        leadId,
        request: {
          persona: validatedData.persona,
          industry: validatedData.industry,
          discoveryAnswers: validatedData.discoveryAnswers,
        },
        response: validated.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      console.error('[Idea Lab API] Failed to save to Firestore (non-fatal):', saveError);
    }

    // 6. Return success response
    const response = createSuccessResponse(validated.data);

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
