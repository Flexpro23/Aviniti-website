import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  extractRequestMetadata,
  hashIP,
  sanitizePromptInput,
  checkRequestBodySize,
  detectInputLanguage,
  getLocalizedRateLimitMessage,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { saveLeadToFirestore, saveAISubmission } from '@/lib/firebase/collections';
import { ideaLabGenerateSchema } from '@/lib/utils/validators';
import { buildIdeaLabPrompt } from '@/lib/gemini/prompts/idea-lab';
import { ideaLabResponseSchema } from '@/lib/gemini/schemas';
import type { IdeaLabResponse } from '@/types/api';
import { logServerError, logServerWarning, logServerInfo } from '@/lib/firebase/error-logging';

// Rate limiting configuration — 6 per 24h to allow discover + generate + 2 refreshes + buffer
const RATE_LIMIT = 6;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.7;
const TIMEOUT_MS = 45000; // 45 seconds

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 0. Body size check (mitigate payload DoS)
    const sizeError = checkRequestBodySize(request);
    if (sizeError) return sizeError;

    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = ideaLabGenerateSchema.parse(body);

    // 2. Rate limiting (shared key with discover endpoint)
    const clientIP = getClientIP(request);
    const rateLimitKey = `idea-lab:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    // Resolve locale early so we can use it for the rate-limit error message
    // before the full locale-dependent processing block below.
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return createErrorResponse(
        'RATE_LIMITED',
        getLocalizedRateLimitMessage(locale),
        429,
        { retryAfter }
      );
    }

    // 3. Sanitize discovery answers and detect language
    const sanitizedAnswers = validatedData.discoveryAnswers.map(a => ({
      ...a,
      answer: sanitizePromptInput(a.answer, 500),
    }));
    const allAnswerText = validatedData.discoveryAnswers.map(a => a.answer).join(' ');
    const inputLanguage = detectInputLanguage(allAnswerText);

    const prompt = buildIdeaLabPrompt({
      persona: validatedData.persona,
      industry: validatedData.industry,
      discoveryAnswers: sanitizedAnswers,
      locale,
      previousIdeaNames: validatedData.previousIdeaNames,
      inputLanguage,
    });

    const MAX_AI_ATTEMPTS = 2;
    let validated: { success: true; data: IdeaLabResponse } | null = null;
    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        logServerInfo('api/ai/idea-lab', `Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`, { attempt });
      }

      const result = await generateJsonContent<IdeaLabResponse>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: 8192,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        logServerWarning('idea-lab-api', `Gemini call failed (attempt ${attempt + 1})`, { error: result.error || 'No data returned' });
        lastError = result.error || 'AI service returned no data';
        continue;
      }

      // 4. Validate AI response
      const parseResult = ideaLabResponseSchema.safeParse(result.data);
      if (!parseResult.success) {
        logServerWarning('idea-lab-api', `Validation failed (attempt ${attempt + 1})`, { issues: parseResult.error.issues });
        lastError = `Validation: ${parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`;
        continue;
      }

      validated = { success: true, data: parseResult.data as unknown as IdeaLabResponse };
      break;
    }

    if (!validated) {
      logServerError('idea-lab-api', `All ${MAX_AI_ATTEMPTS} attempts failed. Last error: ${lastError}`, undefined, { locale, inputLanguage });
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
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
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
      logServerWarning('idea-lab-api', 'Failed to save to Firestore (non-fatal)', { error: saveError instanceof Error ? saveError.message : String(saveError) });
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
    logServerError('idea-lab-api', 'Unexpected error in idea lab handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate ideas. Please try again.',
      500
    );
  }
}
