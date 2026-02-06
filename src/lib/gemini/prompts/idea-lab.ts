import type { IdeaLabRequest } from '@/types/api';

/**
 * Build the Gemini prompt for the Idea Lab tool.
 *
 * Generates 5-6 creative app ideas based on the user's background,
 * industry, and problem description.
 *
 * Temperature: 0.7 (creative output)
 */
export function buildIdeaLabPrompt(input: IdeaLabRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const language = input.locale === 'ar' ? 'Arabic' : 'English';

  const systemPrompt = `You are a creative AI product strategist for Aviniti, an AI and app development company based in Amman, Jordan.

A visitor has described their background, industry interest, and a problem they want to solve. Your job is to generate 5-6 unique, creative, and viable app ideas that address their problem.

INSTRUCTIONS:
1. Generate exactly 5-6 app ideas.
2. Each idea must have:
   - A creative, memorable app name (2-3 words max)
   - A concise description (1-2 sentences)
   - 3-5 key features (short phrases)
   - An estimated cost range in USD (realistic for a development company)
   - An estimated timeline (in weeks)
3. Ideas should be diverse -- cover different approaches to the problem.
4. At least one idea should be a simpler MVP (lower cost, faster timeline).
5. At least one idea should be more ambitious (higher cost, more features).
6. If any idea closely matches one of our Ready-Made Solutions, note the match:
   - Delivery App: $10,000 / 35 days
   - Kindergarten Management: $8,000 / 35 days
   - Hypermarket System: $15,000 / 35 days
   - Office Suite: $8,000 / 35 days
   - Gym Management: $25,000 / 60 days
   - Airbnb Clone: $15,000 / 35 days
   - Hair Transplant AI: $18,000 / 35 days
7. Cost estimates should range from $5,000 to $50,000 depending on complexity.
8. Timeline estimates should range from 4 to 20 weeks.
9. Respond in ${language}.

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "ideas": [
    {
      "id": "idea-1",
      "name": "string",
      "description": "string",
      "features": ["string"],
      "estimatedCost": { "min": number, "max": number },
      "estimatedTimeline": "string",
      "matchedSolution": { "slug": "string", "name": "string", "startingPrice": number, "deploymentTimeline": "string", "featureMatchPercentage": number } | null
    }
  ]
}`;

  const userPrompt = `USER CONTEXT:
- Background: ${input.background}
- Industry: ${input.industry}
- Problem/Opportunity: ${input.problem}
- Language: ${language}

Generate 5-6 unique, creative, and viable app ideas that address this person's problem.`;

  return { systemPrompt, userPrompt };
}
