import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import { createErrorResponse, createSuccessResponse, hashIP, sanitizePromptInput, detectInputLanguage } from '@/lib/utils/api-helpers';
import { generateJsonContent } from '@/lib/gemini/client';
import { generateFeaturesSchema } from '@/lib/utils/validators';
import { buildGenerateFeaturesPrompt } from '@/lib/gemini/prompts';
import { generateFeaturesAISchema } from '@/lib/gemini/schemas';
import { buildCompressedCatalog, getFeatureById } from '@/lib/data/feature-catalog';
import type { GenerateFeaturesResponse, AIFeature } from '@/types/api';

const RATE_LIMIT = 15;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const TEMPERATURE = 0.4;
const TIMEOUT_MS = 30000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = generateFeaturesSchema.parse(body);

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `generate-features:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        'Too many requests. Please wait a moment before trying again.',
        429
      );
    }

    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    const sanitizedDescription = sanitizePromptInput(validatedData.description, 2000);
    const inputLanguage = detectInputLanguage(validatedData.description);
    const compressedCatalog = buildCompressedCatalog();

    const prompt = buildGenerateFeaturesPrompt({
      projectType: validatedData.projectType,
      description: sanitizedDescription,
      answers: validatedData.answers,
      questions: validatedData.questions,
      locale,
      compressedCatalog,
      inputLanguage,
    });

    const result = await generateJsonContent(prompt, {
      temperature: TEMPERATURE,
      maxOutputTokens: 3072,
      timeoutMs: TIMEOUT_MS,
    });

    if (!result.success || !result.data) {
      console.error('[Generate Features API] AI generation failed:', result.error || 'Unknown error');
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI service is temporarily unavailable. Please try again in a few moments.',
        503,
        { suggestion: 'This is usually a temporary issue. Please retry your request.' }
      );
    }

    // Validate the AI response against our schema
    const aiParsed = generateFeaturesAISchema.safeParse(result.data);
    if (!aiParsed.success) {
      console.error('[Generate Features API] Invalid AI response structure:', aiParsed.error.message);
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Received an incomplete response. Please try again.',
        503,
        { suggestion: 'Please retry your request.' }
      );
    }

    // Enrich AI selections with catalog data (prices, timeline, etc.)
    let catalogMatchCount = 0;

    function enrichFeatures(
      selections: { catalogId: string; reason: string }[],
      category: 'must-have' | 'enhancement'
    ): AIFeature[] {
      const results: AIFeature[] = [];
      for (const [idx, sel] of selections.entries()) {
        const catalogFeature = getFeatureById(sel.catalogId);
        if (!catalogFeature) {
          console.warn(`[Generate Features API] Unknown catalogId: ${sel.catalogId}`);
          results.push({
            id: `${category === 'must-have' ? 'mh' : 'en'}-${idx + 1}`,
            name: sel.catalogId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            description: sel.reason,
            category,
            catalogId: sel.catalogId,
            price: 0,
            timelineDays: 0,
            costImpact: 'low',
            timeImpact: 'low',
            reason: sel.reason,
          });
          continue;
        }
        catalogMatchCount++;
        results.push({
          id: `${category === 'must-have' ? 'mh' : 'en'}-${idx + 1}`,
          name: catalogFeature.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          description: sel.reason,
          category,
          catalogId: catalogFeature.id,
          price: catalogFeature.price,
          timelineDays: catalogFeature.timelineDays,
          costImpact: catalogFeature.price >= 1000 ? 'high' : catalogFeature.price >= 500 ? 'medium' : 'low',
          timeImpact: catalogFeature.timelineDays >= 7 ? 'high' : catalogFeature.timelineDays >= 4 ? 'medium' : 'low',
          reason: sel.reason,
        });
      }
      return results;
    }

    const responseData: GenerateFeaturesResponse = {
      mustHave: enrichFeatures(aiParsed.data.mustHave, 'must-have'),
      enhancements: enrichFeatures(aiParsed.data.enhancements, 'enhancement'),
      catalogMatchCount,
    };

    const response = createSuccessResponse(responseData);
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return createErrorResponse('VALIDATION_ERROR', error.issues[0].message, 400);
    }

    console.error('[Generate Features API] Error:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Failed to generate features. Please try again.', 500);
  }
}
