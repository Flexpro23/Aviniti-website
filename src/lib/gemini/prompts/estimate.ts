import type { EstimateRequest } from '@/types/api';

/**
 * Build the Gemini prompt for the Get AI Estimate tool.
 *
 * Generates a detailed Project Blueprint based on user's description,
 * AI-generated questions/answers, and selected features.
 *
 * Temperature: 0.3 (precise, structured output)
 */
export function buildEstimatePromptV2(input: EstimateRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const language = input.locale === 'ar' ? 'Arabic' : 'English';

  const answeredQuestions = input.questions
    .map((q) => `- ${q.question}: ${input.answers[q.id] ? 'YES' : 'NO'}`)
    .join('\n');

  const features = input.selectedFeatures ?? [];

  const mustHaveFeatures = features
    .filter((f) => f.category === 'must-have')
    .map((f) => `- ${f.name}: ${f.description}`)
    .join('\n');

  const enhancementFeatures = features
    .filter((f) => f.category === 'enhancement')
    .map((f) => `- ${f.name}: ${f.description}`)
    .join('\n');

  const systemPrompt = `You are an expert software project estimator for Aviniti, an AI and app development company based in Amman, Jordan.

LANGUAGE RULE: Your ENTIRE output MUST be in ${language}. Every string value in the JSON — including project name, summary, phase descriptions, insights, tech stack items, and recommendations — MUST be in ${language}. This is determined by the user's chosen site language and is NON-NEGOTIABLE. Do NOT switch language based on input text. Do NOT mix languages.

You are generating a comprehensive "Project Blueprint" report for a potential client.

ESTIMATION GUIDELINES:
1. Give the project a creative, memorable name (2-4 words).
2. Write a 2-3 sentence project summary.
3. Generate realistic cost ranges in USD.
4. Break down into 5-7 phases: Discovery & Planning, UI/UX Design, Backend Development, Frontend Development, Testing & QA, Deployment & Launch (and optionally: AI/ML Integration if applicable).
5. Each phase must have a cost estimate and duration.
6. Total cost should align with the feature complexity:
   - Simple (3-5 basic features): $5,000-$15,000
   - Medium (6-10 features): $12,000-$30,000
   - Complex (10+ features or AI): $25,000-$60,000
   - Full Stack (multiple platforms): $40,000-$80,000+
7. Check if the project matches any of our Ready-Made Solutions:
   - Delivery App: $10,000 / 35 days
   - Kindergarten Management: $8,000 / 35 days
   - Hypermarket System: $15,000 / 35 days
   - Office Suite: $8,000 / 35 days
   - Gym Management: $25,000 / 60 days
   - Airbnb Clone: $15,000 / 35 days
   - Hair Transplant AI: $18,000 / 35 days
8. Suggest a recommended tech stack (3-6 technologies).
9. Generate 3-5 key insights covering risks, recommendations, and optimization opportunities.
10. Recommend approach: "custom", "ready-made", or "hybrid".
11. Generate 3 strategic insights (1 strength, 1 challenge, 1 recommendation).

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "projectName": "string",
  "projectSummary": "string",
  "estimatedCost": { "min": number, "max": number },
  "estimatedTimeline": {
    "weeks": number,
    "phases": [{ "phase": number, "name": "string", "description": "string", "cost": number, "duration": "string" }]
  },
  "approach": "custom" | "ready-made" | "hybrid",
  "matchedSolution": { "slug": "string", "name": "string", "startingPrice": number, "deploymentTimeline": "string", "featureMatchPercentage": number } | null,
  "techStack": ["string"],
  "keyInsights": ["string"],
  "strategicInsights": [{ "type": "strength" | "challenge" | "recommendation", "title": "string", "description": "string" }],
  "breakdown": [{ "phase": number, "name": "string", "description": "string", "cost": number, "duration": "string" }]
}`;

  const userPrompt = `PROJECT CONTEXT:
- Project Type: ${input.projectType}
- Client's Description: ${input.description}
- Clarifying Questions & Answers:
${answeredQuestions}
- Must-Have Features:
${mustHaveFeatures || 'None'}
- Enhancement Features:
${enhancementFeatures || 'None'}
- Output language: ${language}

Generate a detailed Project Blueprint with cost breakdown, timeline, tech stack, and recommendations.`;

  return { systemPrompt, userPrompt };
}
