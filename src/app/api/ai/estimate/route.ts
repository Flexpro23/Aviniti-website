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
import { estimateCreativeSchema } from '@/lib/gemini/schemas';
import { calculateEstimate, distributeAcrossPhases, PHASE_COST_RATIOS } from '@/lib/pricing/calculator';
import type { EstimateResponse, EstimatePhase } from '@/types/api';

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

    // 3. Compute deterministic pricing from catalog
    const featureIds: string[] = validatedData.selectedFeatureIds
      ?? (validatedData.selectedFeatures ?? []).map((f) => f.id);

    const pricing = calculateEstimate(featureIds);

    // 4. Build prompt for creative content (AI does NOT set costs)
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const prompt = buildEstimatePrompt({
      projectType: validatedData.projectType,
      description: validatedData.description,
      answers: validatedData.answers,
      questions: validatedData.questions,
      selectedFeatureIds: featureIds,
      totalCost: pricing.total,
      totalTimelineDays: pricing.totalTimelineDays,
      locale,
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
      console.error('[Estimate API] Invalid AI response:', aiParsed.error.message);
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
      console.error('[Estimate API] Failed to save to Firestore (non-fatal):', saveError);
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

    console.error('[Estimate API] Error:', error);

    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to generate estimate. Please try again.',
      500
    );
  }
}
