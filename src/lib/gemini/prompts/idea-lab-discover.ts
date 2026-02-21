import type { Persona, Industry } from '@/types/api';

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
 * Build the Gemini prompt for the Idea Lab discover endpoint.
 *
 * Generates 5-7 simple, non-technical discovery questions that help
 * understand a regular person's daily life, work patterns, and pain points
 * so we can later generate personalized digital solution ideas.
 */
export function buildIdeaLabDiscoverPrompt(data: {
  persona: Persona;
  industry: Industry;
  locale: 'en' | 'ar';
  /** Detected or explicitly supplied language of the user's prior input */
  inputLanguage?: 'en' | 'ar';
}): string {
  const lang = data.locale === 'ar' ? 'ar' : 'en';
  const personaLabel = PERSONA_LABELS[data.persona][lang];
  const industryLabel = INDUSTRY_LABELS[data.industry][lang];
  // inputLanguage takes priority over locale so that question text always matches
  // the language the user is typing in, which is the same rule the generate
  // endpoint follows.
  const outputLang = data.inputLanguage || data.locale;
  const outputLanguage = outputLang === 'ar' ? 'Arabic' : 'English';

  return `You are a friendly discovery consultant for Aviniti, helping everyday people find opportunities where technology could improve their daily life or work. You are NOT talking to tech-savvy people or entrepreneurs — you are talking to regular people who may have never considered building an app or digital tool.

LANGUAGE: ALL your output MUST be in ${outputLanguage}. Every string value in the JSON — question text, options, placeholders, and the context summary — must be in ${outputLanguage}.

A visitor has told us:
- Who they are: ${personaLabel}
- Their area of work/interest: ${industryLabel}

YOUR TASK:
Generate 5-7 simple discovery questions to understand their daily life, routines, pain points, and opportunities. These questions will be shown one at a time in a step-by-step wizard.

QUESTION RULES:
1. Questions must be answerable by anyone — NO technical jargon, NO mention of apps, software, or technology.
2. Focus on understanding their DAILY LIFE:
   - What they do day-to-day
   - What tasks take the most time
   - What frustrates them
   - How they communicate with clients/customers/colleagues
   - How they track or manage things (schedules, inventory, data, money)
   - Whether they do repetitive manual work
3. Question types (mix them for variety):
   - "yes-no": Simple Yes or No answer. Use for quick screening (e.g., "Do you deal with customers face-to-face?")
   - "multiple-choice": 3-5 options to pick ONE. Use for understanding context (e.g., "How do you currently keep track of your appointments?" with options like "Paper notebook", "Spreadsheet", "I use an app", "I don't track them")
   - "single-line": Short free-text answer (1 line). Use sparingly — MAX 1 question of this type. (e.g., "In a few words, what is the one task you wish took less time?")
4. Include 2-3 yes-no questions, 2-3 multiple-choice questions, and AT MOST 1 single-line question.
5. Questions should be ordered from easiest/broadest to more specific.
6. Each question must feel conversational and friendly, not like a survey.
7. The questions should be tailored to the person's persona and industry — a gym owner gets different questions than a teacher or accountant.

CONTEXT SUMMARY:
Also generate a brief 1-2 sentence summary of what you understand about this person so far based on their persona and industry selection. This is shown to the user as "Here's what we know about you so far..."

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "questions": [
    {
      "id": "q1",
      "text": "string (the question text)",
      "type": "yes-no" | "multiple-choice" | "single-line",
      "options": ["string"] | undefined,
      "placeholder": "string" | undefined
    }
  ],
  "contextSummary": "string (1-2 sentence summary)"
}

EXAMPLES OF GOOD QUESTIONS (do NOT copy these verbatim — adapt to the persona and industry):
- "Do you spend time doing the same task over and over each week?" (yes-no)
- "How do you currently manage your schedule?" (multiple-choice: "Paper planner", "Phone calendar", "Spreadsheet", "I keep it in my head")
- "Do your customers ever have to wait because of manual processes?" (yes-no)
- "What part of your work do you wish was faster?" (single-line, placeholder: "e.g., scheduling, billing, communication...")
- "How do you share updates with your team or clients?" (multiple-choice: "Phone calls", "WhatsApp/Messages", "Email", "In person", "I don't regularly share updates")`;
}
