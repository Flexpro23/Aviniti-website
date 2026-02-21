import type { Persona, Industry, DiscoveryAnswer } from '@/types/api';

const PERSONA_LABELS: Record<Persona, { en: string; ar: string }> = {
  'small-business': {
    en: 'Small business owner / entrepreneur',
    ar: 'صاحب عمل صغير / رائد أعمال',
  },
  professional: {
    en: 'Working professional / employee',
    ar: 'موظف / محترف',
  },
  creative: {
    en: 'Creative professional / freelancer',
    ar: 'مبدع / مستقل',
  },
  student: {
    en: 'Student / researcher',
    ar: 'طالب / باحث',
  },
  hobby: {
    en: 'Hobbyist / passionate about a personal interest',
    ar: 'هاوٍ / شغوف باهتمام شخصي',
  },
  manager: {
    en: 'Team lead / department manager',
    ar: 'قائد فريق / مدير قسم',
  },
};

const INDUSTRY_LABELS: Record<Industry, { en: string; ar: string }> = {
  'health-wellness': { en: 'Health & Wellness', ar: 'الصحة والعافية' },
  'finance-banking': { en: 'Finance & Banking', ar: 'المالية والبنوك' },
  'education-learning': { en: 'Education & Learning', ar: 'التعليم والتعلم' },
  'ecommerce-retail': { en: 'E-commerce & Retail', ar: 'التجارة الإلكترونية والتجزئة' },
  'logistics-delivery': { en: 'Logistics & Delivery', ar: 'الخدمات اللوجستية والتوصيل' },
  'entertainment-media': { en: 'Entertainment & Media', ar: 'الترفيه والإعلام' },
  'travel-hospitality': { en: 'Travel & Hospitality', ar: 'السفر والضيافة' },
  'real-estate': { en: 'Real Estate', ar: 'العقارات' },
  'food-restaurant': { en: 'Food & Restaurant', ar: 'الطعام والمطاعم' },
  'social-community': { en: 'Social & Community', ar: 'التواصل الاجتماعي والمجتمع' },
  other: { en: 'Other', ar: 'أخرى' },
};

/**
 * Build the Gemini prompt for the Idea Lab generate endpoint.
 *
 * Takes the full discovery profile (persona + industry + Q&A answers)
 * and generates 3-4 benefit-focused digital solution ideas with
 * features, impact metrics, social proof, and before/after workflows.
 *
 * Temperature: 0.7 (creative output)
 */
export function buildIdeaLabPrompt(data: {
  persona: Persona;
  industry: Industry;
  discoveryAnswers: DiscoveryAnswer[];
  locale: 'en' | 'ar';
  previousIdeaNames?: string[];
  inputLanguage?: 'en' | 'ar';
}): string {
  const lang = data.locale === 'ar' ? 'ar' : 'en';
  const personaLabel = PERSONA_LABELS[data.persona][lang];
  const industryLabel = INDUSTRY_LABELS[data.industry][lang];
  const outputLang = data.inputLanguage || data.locale;
  const outputLanguage = outputLang === 'ar' ? 'Arabic' : 'English';

  const answersText = data.discoveryAnswers
    .map((a) => `Q: ${a.questionText}\nA: ${a.answer}`)
    .join('\n\n');

  const exclusionBlock = data.previousIdeaNames?.length
    ? `\nIMPORTANT — PREVIOUSLY SUGGESTED IDEAS (DO NOT REPEAT):\nThe user has already seen these ideas and wants fresh alternatives. Do NOT generate any idea with these names or similar concepts:\n${data.previousIdeaNames.map((n) => `- "${n}"`).join('\n')}\n\nGenerate completely DIFFERENT ideas that explore OTHER aspects of their situation, workflow, or industry. Think creatively and suggest solutions they haven't seen yet.\n`
    : '';

  return `You are a creative product strategist for Aviniti, an AI and app development company. Your specialty is explaining technology solutions in plain, benefit-focused language that regular people (not tech-savvy) can understand and get excited about.

LANGUAGE: ALL your output MUST be in ${outputLanguage}. Every string value in the JSON must be in ${outputLanguage}. The output language MUST match ${outputLanguage} regardless of the language the user answered in.

DISCOVERY PROFILE:
- Who they are: ${personaLabel}
- Their area: ${industryLabel}

DISCOVERY ANSWERS:
${answersText}
${exclusionBlock}
YOUR TASK:
Based on everything above, generate exactly 3-4 personalized digital solution ideas that would genuinely improve this person's life or work. These ideas should feel like "aha moments" — things they never knew were possible.

IDEA RULES:
1. Each idea MUST be directly tied to something the person said in their answers — not generic.
2. NO technical jargon. Speak in benefits, not features. Say "Save 5 hours a week on scheduling" not "Automated calendar sync with API integration".
3. Each idea needs ALL of these fields:
   - "name": A catchy, memorable name (2-4 words)
   - "tagline": One sentence that captures the main benefit (max 15 words)
   - "benefits": 2-3 specific benefit statements that relate to their answers (e.g., "No more manual scheduling — your clients book themselves", "Get paid faster with automatic invoicing")
   - "description": A 3-4 sentence description explaining what this solution would do. Be specific about HOW it would help this particular person based on their answers. Paint a picture of their improved daily life.
   - "features": 4-6 key capabilities this solution would include, written in plain language. Each feature should clearly describe what the user gets, not technical specs. (e.g., "Smart scheduling that learns your busiest hours", "Automatic payment reminders sent to clients", "Dashboard showing your daily performance at a glance")
   - "impactMetrics": 2-3 specific, measurable impact statements. Use realistic numbers. (e.g., "Save 5-10 hours per week on admin tasks", "Reduce no-shows by up to 60%", "Increase repeat customers by 25-40%"). Make these relevant to their specific role and industry.
   - "howItWorks": A clear 3-4 step explanation of how this would fit into their daily routine. Write it as a mini-story: "First, you open the app and see your day planned out. Then, clients get automatic reminders 24 hours before their appointment. When they arrive, check-in is instant. At the end of the day, your reports are already generated."
   - "workflowBefore": A 1-2 sentence description of how they currently do things (based on their answers). Start with "Currently, you..." or "Right now, you..."
   - "workflowAfter": A 1-2 sentence description of how things would be with this solution. Start with "With [solution name], you..." or "Imagine..."
   - "socialProof": A realistic, relatable sentence about someone in a similar situation who benefited from a similar solution. Use MENA-region examples. Be specific with location, role, and outcome. (e.g., "A physiotherapist in Amman built something similar and now manages 200+ patients effortlessly")
   - "tag": Exactly ONE tag per idea. Across all ideas, use EACH of these tags exactly once (if 3 ideas, pick the 3 most relevant):
     * "easiest-to-start" — The simplest idea to implement, fastest to see results
     * "biggest-impact" — The idea with the highest potential to transform their work/life
     * "most-innovative" — The most creative/unexpected idea

4. Ideas should be diverse — cover different aspects of what the person described.
5. At least one idea should be simple (something they could start with quickly).
6. Do NOT include any cost estimates, timelines, tech stack, or technical details. Those are handled by other tools.
7. Make each idea feel substantial and well-thought-out — the user should feel that real analysis went into their answers.

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "ideas": [
    {
      "id": "idea-1",
      "name": "string",
      "tagline": "string",
      "benefits": ["string", "string"],
      "description": "string",
      "features": ["string", "string", "string", "string"],
      "impactMetrics": ["string", "string"],
      "howItWorks": "string",
      "workflowBefore": "string",
      "workflowAfter": "string",
      "socialProof": "string",
      "tag": "easiest-to-start" | "biggest-impact" | "most-innovative"
    }
  ]
}`;
}
