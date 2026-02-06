import type { EstimateRequest } from '@/types/api';

/**
 * Build the Gemini prompt for the Get AI Estimate tool.
 *
 * Generates a detailed project cost and timeline estimate based on
 * project type, features, and timeline preference.
 *
 * Temperature: 0.3 (precise, structured output)
 */
export function buildEstimatePrompt(input: EstimateRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const language = input.locale === 'ar' ? 'Arabic' : 'English';

  const systemPrompt = `You are an expert software project estimator for Aviniti, an AI and app development company based in Amman, Jordan.

Given the following project requirements, generate a detailed project estimate.

ESTIMATION GUIDELINES:
1. Generate realistic cost ranges in USD.
2. Break down into 5-7 phases: Discovery & Planning, UI/UX Design, Backend Development, Frontend Development, Testing & QA, Deployment & Launch (and optionally: AI/ML Integration if applicable).
3. Each phase must have a cost estimate and duration.
4. Total cost should align with the feature complexity:
   - Simple (1-3 basic features): $5,000-$15,000
   - Medium (4-8 features): $12,000-$30,000
   - Complex (8+ features or AI): $25,000-$60,000
   - Full Stack (multiple platforms): $40,000-$80,000+
5. Timeline should respect the user's preference:
   - ASAP: Compress phases, higher cost (rush premium ~20%)
   - Standard: Normal pacing
   - Flexible: Can optimize for cost savings
   - Not Sure: Recommend standard approach
6. Check if the project matches any of our Ready-Made Solutions:
   - Delivery App: $10,000 / 35 days
   - Kindergarten Management: $8,000 / 35 days
   - Hypermarket System: $15,000 / 35 days
   - Office Suite: $8,000 / 35 days
   - Gym Management: $25,000 / 60 days
   - Airbnb Clone: $15,000 / 35 days
   - Hair Transplant AI: $18,000 / 35 days
7. Generate 3-5 key insights covering risks, recommendations, and optimization opportunities.
8. Recommend approach: "custom" (fully custom build), "ready-made" (a Ready-Made Solution covers >80% of features), or "hybrid" (Ready-Made base with custom additions).

Respond in ${language}.

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "estimatedCost": { "min": number, "max": number },
  "estimatedTimeline": {
    "weeks": number,
    "phases": [
      {
        "phase": number,
        "name": "string",
        "description": "string",
        "cost": number,
        "duration": "string"
      }
    ]
  },
  "approach": "custom" | "ready-made" | "hybrid",
  "matchedSolution": {
    "slug": "string",
    "name": "string",
    "startingPrice": number,
    "deploymentTimeline": "string",
    "featureMatchPercentage": number
  } | null,
  "keyInsights": ["string"],
  "breakdown": [
    {
      "phase": number,
      "name": "string",
      "description": "string",
      "cost": number,
      "duration": "string"
    }
  ]
}`;

  const featuresStr = input.features.join(', ');
  const customFeaturesStr = input.customFeatures?.join(', ') || 'None';

  const userPrompt = `PROJECT REQUIREMENTS:
- Project Type: ${input.projectType}
- Selected Features: ${featuresStr}
- Custom Features: ${customFeaturesStr}
- Timeline Preference: ${input.timeline}
- Project Description: ${input.description || 'Not provided'}
- Language: ${language}

Generate a detailed project estimate with cost breakdown, timeline, and recommendations.`;

  return { systemPrompt, userPrompt };
}
