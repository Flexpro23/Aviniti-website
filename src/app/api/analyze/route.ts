import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PRIMARY_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

const getSystemPrompt = (language: string) => `You are an expert in mobile and web app development cost estimation.
Your task is to analyze user input and provide:
1. A concise overview of the app idea.
2. A list of core features necessary for a functional version of the app.
3. A list of suggested features that could add value, with a short description explaining how each feature adds value.

Please respond in ${language === 'ar' ? 'Arabic' : 'English'}.

If a feature requested by the user is not in your knowledge base, respond with 'N/A'.

Please format your response exactly as follows:
Overview: [A concise summary of the app idea]

Core Features:
- [Feature 1]
- [Feature 2]
...

Suggested Features:
- [Feature Name 1]: [Brief description of value add]
- [Feature Name 2]: [Brief description of value add]
...`;

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    const { description, answers, language = 'en' } = await request.json();

    const systemPrompt = getSystemPrompt(language);
    const prompt = `${systemPrompt}

Analyze this app idea:

Description: ${description}

Problem Areas: ${answers.problem.join(', ')}
Target Audience: ${answers.targetAudience.join(', ')}
Key Features: ${answers.keyFeatures.join(', ')}
Market Research: ${answers.competitors}
Platforms: ${answers.platforms.join(', ')}
Integrations: ${answers.integrations.join(', ')}`;

    let modelName = PRIMARY_MODEL;
    let model = genAI.getGenerativeModel({ model: modelName });
    let result;

    try {
       console.log(`Analysing (analyze) with model: ${modelName}`);
       result = await model.generateContent(prompt);
    } catch (apiError: any) {
       console.error(`Gemini API call failed with ${modelName}:`, apiError);
       
       if (modelName !== FALLBACK_MODEL) {
         console.log(`Attempting fallback to ${FALLBACK_MODEL}...`);
         modelName = FALLBACK_MODEL;
         model = genAI.getGenerativeModel({ model: modelName });
         try {
           result = await model.generateContent(prompt);
           console.log(`Fallback to ${FALLBACK_MODEL} successful`);
         } catch (fallbackError: any) {
            console.error(`Fallback model ${FALLBACK_MODEL} also failed:`, fallbackError);
            throw new Error(`Gemini API Error: ${apiError.message || 'Unknown error'}`);
         }
       } else {
         throw new Error(`Gemini API Error: ${apiError.message || 'Unknown error'}`);
       }
    }

    const text = result.response.text();

    // Parse the response
    const overviewMatch = text.match(/Overview:\s*(.*?)(?=\n\nCore Features:)/s);
    const coreFeaturesMatch = text.match(/Core Features:\s*(.*?)(?=\n\nSuggested Features:)/s);
    const suggestedFeaturesMatch = text.match(/Suggested Features:\s*(.*?)$/s);

    const overview = overviewMatch ? overviewMatch[1].trim() : "N/A";
    const coreFeatures = coreFeaturesMatch 
      ? coreFeaturesMatch[1]
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.startsWith('-'))
          .map(item => item.slice(1).trim())
      : [];

    const suggestedFeatures = suggestedFeaturesMatch
      ? suggestedFeaturesMatch[1]
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.startsWith('-'))
          .map(item => {
            const [name, ...descParts] = item.slice(1).trim().split(':');
            return {
              name: name.trim(),
              description: descParts.join(':').trim()
            };
          })
      : [];

    return NextResponse.json({
      overview,
      coreFeatures,
      suggestedFeatures
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Log more details
    if (error instanceof Error) {
       console.error("Error message:", error.message);
    }
    
    const { language = 'en' } = await request.json().catch(() => ({ language: 'en' }));
    const errorMessage = language === 'ar' 
      ? 'فشل في تحليل الذكاء الاصطناعي'
      : 'AI analysis failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
