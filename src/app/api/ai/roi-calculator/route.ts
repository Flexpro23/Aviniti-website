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
import { saveLeadToFirestore, saveAISubmission, type LeadData } from '@/lib/firebase/collections';
import { roiFormSchemaV2 } from '@/lib/utils/validators';
import { buildROIPromptV2 } from '@/lib/gemini/prompts';
import { roiResponseSchemaV2 } from '@/lib/gemini/schemas';
import type { ROICalculatorResponseV2 } from '@/types/api';
import { logServerError, logServerWarning, logServerInfo } from '@/lib/firebase/error-logging';

// Rate limiting configuration (reduced from 5 to 3/24hr for cost control)
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
const MAX_OUTPUT_TOKENS = 8192;
const TIMEOUT_MS = 60000; // 60 seconds
const MAX_AI_ATTEMPTS = 2;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 0. Body size check (mitigate payload DoS)
    const sizeError = checkRequestBodySize(request);
    if (sizeError) return sizeError;

    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = roiFormSchemaV2.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `roi-calculator:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    // Resolve locale early so we can use it for the rate-limit error message
    // before the full locale-dependent processing block below.
    const locale = validatedData.locale === 'ar' ? 'ar' : 'en';

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
    const inputText = validatedData.mode === 'standalone'
      ? validatedData.ideaDescription
      : validatedData.projectSummary || '';
    const inputLanguage = detectInputLanguage(inputText);

    // Sanitize free-text input for standalone mode; always sanitize projectName (from-estimate mode)
    const sanitizedData = validatedData.mode === 'standalone'
      ? { ...validatedData, ideaDescription: sanitizePromptInput(validatedData.ideaDescription, 2000) }
      : {
          ...validatedData,
          projectName: validatedData.projectName
            ? sanitizePromptInput(validatedData.projectName, 200)
            : validatedData.projectName,
        };

    const prompt = buildROIPromptV2(sanitizedData, inputLanguage);

    // 4. Call Gemini with retry on validation failure
    let validated: { success: true; data: ROICalculatorResponseV2 } | null = null;
    let lastError: string | undefined;

    for (let attempt = 0; attempt < MAX_AI_ATTEMPTS; attempt++) {
      if (attempt > 0) {
        logServerInfo('api/ai/roi-calculator', `Retry attempt ${attempt + 1}/${MAX_AI_ATTEMPTS}`, { attempt });
      }

      const result = await generateJsonContent<ROICalculatorResponseV2>(prompt, {
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        timeoutMs: TIMEOUT_MS,
      });

      if (!result.success || !result.data) {
        logServerWarning('roi-calculator-api', `Gemini call failed (attempt ${attempt + 1})`, { error: result.error || 'No data returned' });
        lastError = result.error || 'AI service returned no data';
        continue;
      }

      // Validate AI response against schema
      const parseResult = roiResponseSchemaV2.safeParse(result.data);
      if (!parseResult.success) {
        logServerWarning('roi-calculator-api', `Validation failed (attempt ${attempt + 1})`, { issues: parseResult.error.issues });
        lastError = `Validation: ${parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`;
        continue;
      }

      validated = { success: true, data: parseResult.data as unknown as ROICalculatorResponseV2 };
      break;
    }

    if (!validated) {
      logServerError('roi-calculator-api', `All ${MAX_AI_ATTEMPTS} attempts failed. Last error: ${lastError}`, undefined, { locale, inputLanguage });
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI service is temporarily unavailable. Please try again in a few minutes.',
        503
      );
    }

    const processingTimeMs = Date.now() - startTime;

    // 5. Save to Firestore (non-blocking — don't fail the request if save fails)
    try {
      const metadata = extractRequestMetadata(request);

      const leadData: Omit<LeadData, 'converted' | 'notes'> = {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
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
        response: validated.data as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      logServerWarning('roi-calculator-api', 'Failed to save to Firestore (non-fatal)', { error: saveError instanceof Error ? saveError.message : String(saveError) });
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
    logServerError('roi-calculator-api', 'Unexpected error in ROI calculator handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to calculate ROI. Please try again.',
      500
    );
  }
}
