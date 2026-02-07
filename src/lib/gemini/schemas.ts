// Zod schemas for validating Gemini AI responses
// Ensures type safety and catches malformed AI outputs

import { z } from 'zod';

// ============================================================
// Idea Lab Response Schema
// ============================================================

const matchedSolutionSchema = z.object({
  slug: z.string(),
  name: z.string(),
  startingPrice: z.number().positive(),
  deploymentTimeline: z.string(),
  featureMatchPercentage: z.number().min(0).max(100),
});

const ideaLabIdeaSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(500),
  features: z.array(z.string().min(1).max(100)).min(3).max(5),
  estimatedCost: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  estimatedTimeline: z.string().min(1).max(50),
  matchedSolution: matchedSolutionSchema.nullable(),
});

export const ideaLabResponseSchema = z.object({
  ideas: z.array(ideaLabIdeaSchema).min(5).max(6),
});

export type IdeaLabGeminiResponse = z.infer<typeof ideaLabResponseSchema>;

// ============================================================
// AI Analyzer Response Schema
// ============================================================

const analysisCategorySchema = z.object({
  score: z.number().min(0).max(100),
  analysis: z.string().min(50).max(2000),
  findings: z.array(z.string().min(10).max(300)).min(3).max(5),
});

const technicalAnalysisCategorySchema = analysisCategorySchema.extend({
  complexity: z.enum(['low', 'medium', 'high']),
  suggestedTechStack: z.array(z.string().min(2).max(50)).min(3).max(10),
  challenges: z.array(z.string().min(10).max(200)).min(2).max(5),
});

const recommendedRevenueModelSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(20).max(300),
  pros: z.array(z.string().min(5).max(200)).min(2).max(5),
  cons: z.array(z.string().min(5).max(200)).min(1).max(5),
});

const monetizationAnalysisCategorySchema = analysisCategorySchema.extend({
  revenueModels: z
    .array(recommendedRevenueModelSchema)
    .min(2)
    .max(3),
});

const competitorSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(300),
  type: z.enum(['direct', 'indirect', 'potential']),
});

const competitionAnalysisCategorySchema = analysisCategorySchema.extend({
  competitors: z.array(competitorSchema).min(3).max(5),
  intensity: z.enum(['low', 'moderate', 'high', 'very-high']),
});

export const analyzerResponseSchema = z.object({
  ideaName: z.string().min(3).max(100),
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(50).max(500),
  categories: z.object({
    market: analysisCategorySchema,
    technical: technicalAnalysisCategorySchema,
    monetization: monetizationAnalysisCategorySchema,
    competition: competitionAnalysisCategorySchema,
  }),
  recommendations: z.array(z.string().min(20).max(300)).min(3).max(5),
});

export type AnalyzerGeminiResponse = z.infer<typeof analyzerResponseSchema>;

// ============================================================
// Generate Features AI Response Schema (catalog-based)
// ============================================================

const catalogFeatureSelectionSchema = z.object({
  catalogId: z.string().min(1),
  reason: z.string().min(1).max(300),
});

export const generateFeaturesAISchema = z.object({
  mustHave: z.array(catalogFeatureSelectionSchema).min(3).max(15),
  enhancements: z.array(catalogFeatureSelectionSchema).min(1).max(10),
});

export type GenerateFeaturesAIResponse = z.infer<typeof generateFeaturesAISchema>;

// ============================================================
// Get AI Estimate Response Schema
// ============================================================

const estimatePhaseSchema = z.object({
  phase: z.number().int().positive(),
  name: z.string().min(3).max(100),
  description: z.string().min(20).max(300),
  cost: z.number().positive(),
  duration: z.string().min(3).max(50),
});

/** Phase schema for the new catalog-based flow (no cost field from AI) */
const estimatePhaseNoCostSchema = z.object({
  phase: z.number().int().positive(),
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(300),
  duration: z.string().min(3).max(50),
});

const strategicInsightSchema = z.object({
  type: z.enum(['strength', 'challenge', 'recommendation']),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
});

/** Legacy estimate response schema (AI provides costs) */
export const estimateResponseSchema = z.object({
  projectName: z.string().min(1).max(100).optional(),
  alternativeNames: z.array(z.string().min(1).max(50)).min(2).max(4).optional(),
  projectSummary: z.string().min(10).max(500).optional(),
  estimatedCost: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  estimatedTimeline: z.object({
    weeks: z.number().int().positive().max(52),
    phases: z.array(estimatePhaseSchema).min(5).max(7),
  }),
  approach: z.enum(['custom', 'ready-made', 'hybrid']),
  matchedSolution: matchedSolutionSchema.nullable(),
  techStack: z.array(z.string()).optional(),
  keyInsights: z.array(z.string().min(10).max(500)).min(3).max(5),
  strategicInsights: z.array(strategicInsightSchema).optional(),
  breakdown: z.array(estimatePhaseSchema).min(5).max(7),
});

export type EstimateGeminiResponse = z.infer<typeof estimateResponseSchema>;

/** New catalog-based estimate response schema (AI provides creative content only) */
export const estimateCreativeSchema = z.object({
  projectName: z.string().min(1).max(100),
  alternativeNames: z.array(z.string().min(1).max(50)).min(2).max(4).optional(),
  projectSummary: z.string().min(10).max(500),
  estimatedTimeline: z.object({
    weeks: z.number().int().positive().max(104),
    phases: z.array(estimatePhaseNoCostSchema).min(5).max(7),
  }),
  approach: z.enum(['custom', 'ready-made', 'hybrid']),
  matchedSolution: matchedSolutionSchema.nullable(),
  techStack: z.array(z.string()).min(2).max(8).optional(),
  keyInsights: z.array(z.string().min(10).max(500)).min(3).max(5),
  strategicInsights: z.array(strategicInsightSchema).min(2).max(4).optional(),
});

export type EstimateCreativeResponse = z.infer<typeof estimateCreativeSchema>;

// ============================================================
// ROI Calculator Response Schema
// ============================================================

const monthlyProjectionSchema = z.object({
  month: z.number().int().min(1).max(12),
  cumulativeSavings: z.number(),
  cumulativeCost: z.number().positive(),
  netROI: z.number(),
});

export const roiResponseSchema = z.object({
  annualROI: z.number(),
  paybackPeriodMonths: z.number().positive().max(60),
  roiPercentage: z.number(),
  breakdown: z.object({
    laborSavings: z.number().nonnegative(),
    errorReduction: z.number().nonnegative(),
    revenueIncrease: z.number().nonnegative(),
    timeRecovered: z.number().nonnegative(),
  }),
  yearlyProjection: z.array(monthlyProjectionSchema).length(12),
  costVsReturn: z.object({
    appCost: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
    }),
    year1Return: z.number().nonnegative(),
    year3Return: z.number().nonnegative(),
  }),
  aiInsight: z.string().min(50).max(1000),
});

export type ROIGeminiResponse = z.infer<typeof roiResponseSchema>;

// ============================================================
// Chat Response Schema
// ============================================================

const suggestedActionSchema = z.object({
  label: z.string().min(1).max(30),
  type: z.enum(['message', 'link', 'tool']),
  value: z.string().min(1).max(500),
});

const linkedContentSchema = z.object({
  type: z.enum(['solution', 'tool', 'page', 'external']),
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(100).optional(),
  url: z.string().min(1).max(500),
  metadata: z.string().max(200).optional(),
});

export const chatResponseSchema = z.object({
  reply: z.string().min(1).max(2000),
  suggestedActions: z.array(suggestedActionSchema).max(4).optional(),
  linkedContent: linkedContentSchema.optional(),
});

export type ChatGeminiResponse = z.infer<typeof chatResponseSchema>;

// ============================================================
// Validation Helper Functions
// ============================================================

/**
 * Validate and parse Idea Lab response from Gemini
 */
export function validateIdeaLabResponse(data: unknown): IdeaLabGeminiResponse {
  return ideaLabResponseSchema.parse(data);
}

/**
 * Validate and parse Analyzer response from Gemini
 */
export function validateAnalyzerResponse(
  data: unknown
): AnalyzerGeminiResponse {
  return analyzerResponseSchema.parse(data);
}

/**
 * Validate and parse Estimate response from Gemini
 */
export function validateEstimateResponse(
  data: unknown
): EstimateGeminiResponse {
  return estimateResponseSchema.parse(data);
}

/**
 * Validate and parse ROI Calculator response from Gemini
 */
export function validateROIResponse(data: unknown): ROIGeminiResponse {
  return roiResponseSchema.parse(data);
}

/**
 * Validate and parse Chat response from Gemini
 */
export function validateChatResponse(data: unknown): ChatGeminiResponse {
  return chatResponseSchema.parse(data);
}

/**
 * Safe validation that returns result with error instead of throwing
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        return `${issue.path.join('.')}: ${issue.message}`;
      });
      return {
        success: false,
        error: `Validation failed: ${issues.join(', ')}`,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}
