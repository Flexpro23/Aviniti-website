import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configure route segment options
export const maxDuration = 60; // Allow up to 60 seconds for API processing
export const dynamic = 'force-dynamic';

interface UserAnswer {
  questionId: string;
  answer: string | string[];
}

interface GeneratedIdea {
  id: string;
  title: string;
  oneLiner: string;
  description: string;
  targetUsers: string[];
  keyFeatures: string[];
  estimatedCost: {
    min: number;
    max: number;
  };
  estimatedTimeline: {
    min: number;
    max: number;
    unit: 'days' | 'weeks' | 'months';
  };
  complexity: 'simple' | 'moderate' | 'complex';
  platforms: string[];
  businessModel: string;
  differentiators: string[];
  marketPotential: 'low' | 'medium' | 'high';
  techStack: string[];
}

interface RequestBody {
  answers: UserAnswer[];
  language: 'en' | 'ar';
  regenerate?: boolean;
  existingIdeas?: string[];
}

// Helper function to detect Arabic text
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

// Generate mock ideas for demo/fallback - returns 3 ideas without cost/time
function generateMockIdeas(answers: UserAnswer[], language: 'en' | 'ar'): Omit<GeneratedIdea, 'estimatedCost' | 'estimatedTimeline'>[] {
  const isArabic = language === 'ar';
  const platformAnswer = answers.find(a => a.questionId === 'platform')?.answer as string[] || ['web', 'ios'];
  
  const mockIdeas = [
    {
      id: `idea_${Date.now()}_1`,
      title: isArabic ? 'تطبيق إدارة المهام الذكي' : 'Smart Task Manager',
      oneLiner: isArabic 
        ? 'تطبيق يستخدم الذكاء الاصطناعي لتنظيم مهامك وزيادة إنتاجيتك'
        : 'AI-powered app that organizes your tasks and boosts productivity',
      description: isArabic
        ? 'تطبيق متكامل لإدارة المهام يستخدم الذكاء الاصطناعي لتحليل عاداتك وتقديم توصيات مخصصة'
        : 'A comprehensive task management app that uses AI to analyze your habits and provide personalized recommendations',
      targetUsers: isArabic 
        ? ['رواد الأعمال', 'الموظفين', 'الطلاب']
        : ['Entrepreneurs', 'Professionals', 'Students'],
      keyFeatures: isArabic
        ? ['جدولة ذكية', 'تذكيرات مخصصة', 'تحليل الإنتاجية', 'تكامل التقويم', 'التعاون الجماعي']
        : ['Smart scheduling', 'Custom reminders', 'Productivity analytics', 'Calendar integration', 'Team collaboration'],
      complexity: 'moderate' as const,
      platforms: platformAnswer as string[],
      businessModel: isArabic ? 'اشتراك شهري + نسخة مجانية محدودة' : 'Monthly subscription + Freemium tier',
      differentiators: isArabic
        ? ['توصيات ذكية', 'واجهة سهلة', 'دعم عربي كامل']
        : ['AI recommendations', 'Intuitive UI', 'Smart automation'],
      marketPotential: 'high' as const,
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'OpenAI API']
    },
    {
      id: `idea_${Date.now()}_2`,
      title: isArabic ? 'منصة التعلم التفاعلي' : 'Interactive Learning Platform',
      oneLiner: isArabic
        ? 'منصة تعليمية تفاعلية تجعل التعلم ممتعًا وفعالًا'
        : 'An engaging educational platform that makes learning fun and effective',
      description: isArabic
        ? 'منصة تعليمية متكاملة تستخدم الألعاب والتفاعل لتقديم محتوى تعليمي جذاب'
        : 'A comprehensive educational platform using gamification and interactivity to deliver engaging content',
      targetUsers: isArabic
        ? ['الطلاب', 'المعلمين', 'المؤسسات التعليمية']
        : ['Students', 'Teachers', 'Educational institutions'],
      keyFeatures: isArabic
        ? ['دروس تفاعلية', 'اختبارات ذكية', 'تتبع التقدم', 'شهادات معتمدة', 'مجتمع تعليمي']
        : ['Interactive lessons', 'Smart quizzes', 'Progress tracking', 'Certificates', 'Learning community'],
      complexity: 'complex' as const,
      platforms: platformAnswer as string[],
      businessModel: isArabic ? 'اشتراك مؤسسي + دورات فردية' : 'Enterprise subscription + Individual courses',
      differentiators: isArabic
        ? ['محتوى عربي أصيل', 'تعلم باللعب', 'تحليلات متقدمة']
        : ['Gamified learning', 'AI tutoring', 'Real-time analytics'],
      marketPotential: 'high' as const,
      techStack: ['Next.js', 'Python', 'MongoDB', 'AWS']
    },
    {
      id: `idea_${Date.now()}_3`,
      title: isArabic ? 'تطبيق الحجوزات الموحد' : 'Universal Booking App',
      oneLiner: isArabic
        ? 'منصة واحدة لجميع حجوزاتك - مطاعم، صالونات، ملاعب'
        : 'One platform for all your bookings - restaurants, salons, sports courts',
      description: isArabic
        ? 'تطبيق يجمع جميع أنواع الحجوزات في مكان واحد مع تأكيد فوري'
        : 'An app that consolidates all types of bookings in one place with instant confirmation',
      targetUsers: isArabic
        ? ['المستهلكين', 'أصحاب الأعمال', 'مدراء المرافق']
        : ['Consumers', 'Business owners', 'Facility managers'],
      keyFeatures: isArabic
        ? ['حجز فوري', 'مدفوعات آمنة', 'تذكيرات', 'تقييمات', 'عروض خاصة']
        : ['Instant booking', 'Secure payments', 'Reminders', 'Reviews', 'Special offers'],
      complexity: 'moderate' as const,
      platforms: platformAnswer as string[],
      businessModel: isArabic ? 'عمولة على الحجوزات + اشتراكات للأعمال' : 'Commission per booking + Business subscriptions',
      differentiators: isArabic
        ? ['حجز موحد', 'برنامج ولاء', 'دعم محلي']
        : ['Unified platform', 'Loyalty program', 'Local support'],
      marketPotential: 'high' as const,
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Stripe']
    }
  ];

  return mockIdeas;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { answers, language, regenerate, existingIdeas } = body;

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || '';
    const isArabic = language === 'ar';

    // If no API key, return mock ideas
    if (!geminiApiKey || geminiApiKey === 'your_api_key_here' || geminiApiKey === '') {
      const ideas = generateMockIdeas(answers, language);
      return NextResponse.json({ ideas });
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      // Format answers for the prompt
      const formattedAnswers = answers.map(a => {
        const answer = Array.isArray(a.answer) ? a.answer.join(', ') : a.answer;
        return `${a.questionId}: ${answer}`;
      }).join('\n');

      const existingIdeasPrompt = regenerate && existingIdeas?.length 
        ? `\n\nIMPORTANT: The user has already seen these ideas and wants NEW ones. Do NOT repeat any of these: ${existingIdeas.join(', ')}`
        : '';

      const prompt = `You are an expert app strategist and business consultant. Based on the user's answers below, generate exactly 3 unique and innovative app ideas.

USER ANSWERS:
${formattedAnswers}
${existingIdeasPrompt}

REQUIREMENTS:
1. Each idea must be realistic and achievable
2. Ideas should be tailored to the user's background, industry, and preferences
3. Consider the target platforms specified by the user
4. Include creative but practical business models
5. All content must be in ${isArabic ? 'Arabic' : 'English'}
6. Focus on quality over quantity - each idea should be well-thought-out

RESPONSE FORMAT (JSON):
Return a valid JSON object with this exact structure:
{
  "ideas": [
    {
      "id": "unique_id_string",
      "title": "App Name",
      "oneLiner": "One sentence description",
      "description": "2-3 sentence detailed description",
      "targetUsers": ["User type 1", "User type 2", "User type 3"],
      "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
      "complexity": "simple" | "moderate" | "complex",
      "platforms": ["ios", "android", "web"],
      "businessModel": "Description of how the app makes money",
      "differentiators": ["Unique selling point 1", "USP 2", "USP 3"],
      "marketPotential": "low" | "medium" | "high",
      "techStack": ["Technology 1", "Technology 2", "Technology 3"]
    }
  ]
}

Generate exactly 3 unique ideas. Return ONLY valid JSON, no additional text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Parse the JSON response
      // Remove markdown code blocks if present
      let cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Parse JSON
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Add unique IDs if not present
      const ideas = parsedResponse.ideas.map((idea: any, index: number) => ({
        ...idea,
        id: idea.id || `idea_${Date.now()}_${index + 1}`
      }));

      return NextResponse.json({ ideas });

    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // Fallback to mock ideas
      const ideas = generateMockIdeas(answers, language);
      return NextResponse.json({ ideas });
    }

  } catch (error) {
    console.error('Error in idea lab:', error);
    return NextResponse.json(
      { error: 'Failed to generate ideas. Please try again.' },
      { status: 500 }
    );
  }
}
