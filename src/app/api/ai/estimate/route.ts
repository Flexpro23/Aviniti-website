import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  extractRequestMetadata,
  hashIP,
  sanitizePromptInput,
  sanitizeSourceContext,
  checkRequestBodySize,
  detectInputLanguage,
  getLocalizedRateLimitMessage,
} from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { saveLeadToFirestore, saveAISubmission } from '@/lib/firebase/collections';
import { estimateFormSchema } from '@/lib/utils/validators';
import { buildEstimatePrompt } from '@/lib/gemini/prompts';
import { estimateCreativeSchema } from '@/lib/gemini/schemas';
import { getFeatureById } from '@/lib/data/feature-catalog';
import { calculateEstimate, distributeAcrossPhases, PHASE_COST_RATIOS } from '@/lib/pricing/calculator';
import type { EstimateResponse, EstimatePhase } from '@/types/api';
import { logServerError, logServerWarning } from '@/lib/firebase/error-logging';

// Rate limiting configuration (reduced from 5 to 3/24hr for cost control)
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours
const TEMPERATURE = 0.3;
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
    const validatedData = estimateFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `estimate:${hashIP(clientIP)}`;
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

    // 3. Compute deterministic pricing from catalog (validate feature IDs exist)
    const featureIds: string[] = validatedData.selectedFeatureIds
      ?? (validatedData.selectedFeatures ?? []).map((f) => f.id);

    const invalidIds = featureIds.filter((id) => !getFeatureById(id));
    if (invalidIds.length > 0) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        `Invalid feature IDs: ${invalidIds.slice(0, 5).join(', ')}${invalidIds.length > 5 ? '...' : ''}`,
        400
      );
    }

    const pricing = calculateEstimate(featureIds);

    // 4. Sanitize input and build prompt for creative content (AI does NOT set costs)
    const sanitizedDescription = sanitizePromptInput(validatedData.description, 2000);
    const inputLanguage = detectInputLanguage(validatedData.description);

    // Extract and sanitize optional sourceContext (prevents prompt injection from cross-tool context)
    const rawSourceContext = body.sourceContext as {
      source: 'analyzer';
      ideaName: string;
      overallScore: number;
      complexity?: string;
      suggestedTechStack?: string[];
      challenges?: string[];
      recommendations?: string[];
    } | undefined;
    const sourceContext = sanitizeSourceContext(rawSourceContext);

    const prompt = buildEstimatePrompt({
      projectType: validatedData.projectType,
      description: sanitizedDescription,
      answers: validatedData.answers,
      questions: validatedData.questions,
      selectedFeatureIds: featureIds,
      totalCost: pricing.total,
      totalTimelineDays: pricing.totalTimelineDays,
      locale,
      inputLanguage,
      sourceContext,
    });

    const result = await generateJsonContent(prompt, {
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

    // 5. Validate AI creative response
    const aiParsed = estimateCreativeSchema.safeParse(result.data);
    if (!aiParsed.success) {
      logServerWarning('estimate-api', 'Invalid AI response', { error: aiParsed.error.message });
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Received an incomplete response. Please try again.',
        503
      );
    }

    const aiData = aiParsed.data;

    // 6. Distribute costs across AI-defined phases using fixed ratios
    const phaseCosts = distributeAcrossPhases(pricing.total);
    const phaseRatioKeys = Object.keys(PHASE_COST_RATIOS);

    const phases: EstimatePhase[] = aiData.estimatedTimeline.phases.map((p, i) => ({
      phase: p.phase,
      name: p.name,
      description: p.description,
      cost: phaseCosts[phaseRatioKeys[i]] ?? Math.round(pricing.total / aiData.estimatedTimeline.phases.length),
      duration: p.duration,
    }));

    // 7. Build final response (merging deterministic pricing + AI creative)
    const estimateResponse: EstimateResponse = {
      projectName: aiData.projectName,
      alternativeNames: aiData.alternativeNames,
      projectSummary: aiData.projectSummary,
      estimatedCost: {
        min: pricing.total,
        max: pricing.total,
        currency: 'USD',
      },
      estimatedTimeline: {
        weeks: aiData.estimatedTimeline.weeks,
        phases,
      },
      approach: aiData.approach,
      matchedSolution: aiData.matchedSolution,
      techStack: aiData.techStack ?? [],
      keyInsights: aiData.keyInsights,
      strategicInsights: aiData.strategicInsights ?? [],
      breakdown: phases,
      pricing,
    };

    const processingTimeMs = Date.now() - startTime;

    // 8. Save to Firestore (non-blocking)
    try {
      const metadata = extractRequestMetadata(request);

      const leadId = await saveLeadToFirestore({
        email: validatedData.email || null,
        name: validatedData.name,
        phone: validatedData.phone,
        whatsapp: validatedData.whatsapp,
        source: 'estimate',
        locale: locale,
        projectType: validatedData.projectType,
        features: featureIds,
        description: validatedData.description,
        metadata: {
          ...metadata,
          ipCountry: undefined,
        },
      });

      await saveAISubmission({
        tool: 'estimate',
        leadId,
        request: {
          projectType: validatedData.projectType,
          description: validatedData.description,
          selectedFeatureIds: featureIds,
          answers: validatedData.answers,
          pricing: {
            subtotal: pricing.subtotal,
            designSurcharge: pricing.designSurcharge,
            bundleDiscount: pricing.bundleDiscount,
            total: pricing.total,
          },
        },
        response: estimateResponse as unknown as Record<string, unknown>,
        processingTimeMs,
        model: 'gemini-3-flash-preview',
        locale: locale,
        status: 'completed',
      });
    } catch (saveError) {
      logServerWarning('estimate-api', 'Failed to save to Firestore (non-fatal)', { error: saveError instanceof Error ? saveError.message : String(saveError) });
    }

    // 9. Return success response
    const response = createSuccessResponse(estimateResponse);

    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return createErrorResponse(
        'VALIDATION_ERROR',
        firstError.message,
        400
      );
    }

    logServerError('estimate-api', 'Unexpected error in estimate handler', error);

    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate estimate. Please try again.',
      500
    );
  }
}
