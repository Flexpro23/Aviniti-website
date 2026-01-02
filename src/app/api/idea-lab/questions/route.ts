import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure route segment options
export const maxDuration = 60; // Allow up to 60 seconds for API processing
export const dynamic = 'force-dynamic';

interface UserAnswer {
  questionId: string;
  answer: string | string[];
}

interface RequestBody {
  answers: UserAnswer[];
  language: 'en' | 'ar';
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { answers, language } = body;

    if (!answers || answers.length < 3) {
      return NextResponse.json(
        { error: 'Need at least 3 answers to generate follow-up questions' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || '';
    const isArabic = language === 'ar';

    // Extract the first 3 answers
    const background = answers.find(a => a.questionId === 'background')?.answer as string || '';
    const industry = answers.find(a => a.questionId === 'industry')?.answer as string || '';
    const problem = answers.find(a => a.questionId === 'problem')?.answer as string || '';

    // If no API key, return fallback questions
    if (!geminiApiKey || geminiApiKey === 'your_api_key_here' || geminiApiKey === '') {
      return NextResponse.json({
        questions: getFallbackQuestions(isArabic)
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

      const prompt = `You are helping design a personalized questionnaire for an app ideation session.

USER CONTEXT:
- Background: ${background}
- Industry of Interest: ${industry}
- Problem/Opportunity they described: ${problem}

Generate exactly 3-4 follow-up questions that will help us better understand their vision and needs.
The questions should:
1. Dig deeper into their specific use case
2. Understand their target users better
3. Clarify technical requirements (platforms, features)
4. Understand the urgency/priority

IMPORTANT: Questions must be in ${isArabic ? 'Arabic' : 'English'}.

Return as JSON array with this exact structure:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Question in ${isArabic ? 'Arabic' : 'English'}",
      "questionAr": "السؤال بالعربية",
      "type": "choice" | "multiChoice" | "text",
      "options": [
        { "value": "option1", "label": "Label in English", "labelAr": "التسمية بالعربية" }
      ],
      "placeholder": "Placeholder for text type (English)",
      "placeholderAr": "Placeholder بالعربية",
      "isAIGenerated": true
    }
  ]
}

Generate 3-4 relevant questions. Return ONLY valid JSON.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse the JSON response
      let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Ensure all questions have isAIGenerated flag
      const questions = parsedResponse.questions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `ai_q_${Date.now()}_${index}`,
        isAIGenerated: true
      }));

      return NextResponse.json({ questions });

    } catch (aiError) {
      console.error('AI generation error:', aiError);
      return NextResponse.json({
        questions: getFallbackQuestions(isArabic)
      });
    }

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

function getFallbackQuestions(isArabic: boolean) {
  return [
    {
      id: 'target',
      question: isArabic ? "من سيكون المستخدمون الأساسيون لحلك؟" : "Who would be the primary users of your solution?",
      questionAr: "من سيكون المستخدمون الأساسيون لحلك؟",
      type: 'multiChoice',
      options: [
        { value: 'consumers', label: 'Individual Consumers (B2C)', labelAr: 'المستهلكين الأفراد' },
        { value: 'businesses', label: 'Businesses (B2B)', labelAr: 'الشركات' },
        { value: 'enterprise', label: 'Enterprise / Large Companies', labelAr: 'المؤسسات الكبيرة' },
        { value: 'students', label: 'Students / Educational', labelAr: 'الطلاب / التعليم' }
      ],
      isAIGenerated: true
    },
    {
      id: 'platform',
      question: isArabic ? "ما هي المنصات التي تريد استهدافها؟" : "What platforms would you like to target?",
      questionAr: "ما هي المنصات التي تريد استهدافها؟",
      type: 'multiChoice',
      options: [
        { value: 'ios', label: 'iOS (iPhone/iPad)', labelAr: 'iOS (آيفون/آيباد)' },
        { value: 'android', label: 'Android', labelAr: 'أندرويد' },
        { value: 'web', label: 'Web Application', labelAr: 'تطبيق ويب' },
        { value: 'all', label: 'All Platforms', labelAr: 'جميع المنصات' }
      ],
      isAIGenerated: true
    },
    {
      id: 'urgency',
      question: isArabic ? "ما مدى إلحاح هذه المشكلة للمستخدمين المستهدفين؟" : "How urgent is this problem for your target users?",
      questionAr: "ما مدى إلحاح هذه المشكلة للمستخدمين المستهدفين؟",
      type: 'choice',
      options: [
        { value: 'critical', label: 'Critical - they need a solution now', labelAr: 'حرج - يحتاجون حلاً الآن' },
        { value: 'important', label: 'Important - would significantly help', labelAr: 'مهم - سيساعد بشكل كبير' },
        { value: 'nice', label: 'Nice to have - would improve their life', labelAr: 'مفيد - سيحسن حياتهم' }
      ],
      isAIGenerated: true
    }
  ];
}
