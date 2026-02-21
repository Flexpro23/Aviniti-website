import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  extractRequestMetadata,
  hashIP,
  sanitizePromptInput,
  detectInputLanguage,
  getLocalizedRateLimitMessage,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { saveLeadToFirestore, saveAISubmission } from '@/lib/firebase/collections';
import { analyzerFormSchema } from '@/lib/utils/validators';
import { buildAnalyzerPrompt } from '@/lib/gemini/prompts';
import { analyzerResponseSchema } from '@/lib/gemini/schemas';
import type { AnalyzerResponse } from '@/types/api';

// Rate limiting configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
const TIMEOUT_MS = 60000; // 60 seconds
const MAX_AI_ATTEMPTS = 2;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = analyzerFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `analyzer:${hashIP(clientIP)}`;
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

    // 3. Sanitize user input and detect language
    const sanitizedIdea = sanitizePromptInput(validatedData.idea, 2000);
    const inputLanguage = detectInputLanguage(validatedData.idea);

    const prompt = buildAnalyzerPrompt({
      idea: sanitizedIdea,
      targetAudience: validatedData.targetAudience,
      industry: validatedData.industry,
      revenueModel: validatedData.revenueModel,
      locale,
      inputLanguage,
    });

    // 4. Call Gemini with retry on validation failure
    let validated: { success: true; data: AnalyzerResponse } | null = null;
    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        console.log(`[Analyzer API] Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`);
      }

      const result = await generateJsonContent<AnalyzerResponse>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: 4096,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        console.error(
          `[Analyzer API] Gemini call failed (attempt ${attempt + 1}):`,
          result.error || 'No data returned'
        );
        lastError = result.error || 'AI service returned no data';
        continue;
      }

      // Validate AI response against schema
      const parseResult = analyzerResponseSchema.safeParse(result.data);
      if (!parseResult.success) {
        console.error(
          `[Analyzer API] Validation failed (attempt ${attempt + 1}):`,
          JSON.stringify(parseResult.error.issues, null, 2)
        );
        lastError = `Validation: ${parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`;
        continue;
      }

      validated = { success: true, data: parseResult.data as unknown as AnalyzerResponse };
      break;
    }

    if (!validated) {
      console.error(`[Analyzer API] All ${MAX_AI_ATTEMPTS} attempts failed. Last error:`, lastError);
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
        response: validated.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      console.error('[Analyzer API] Failed to save to Firestore (non-fatal):', saveError);
    }

    // 5. Return success response
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
    console.error('[Analyzer API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to analyze your idea. Please try again.',
      500
    );
  }
}
