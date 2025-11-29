import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';
import { PRICING_SCHEDULE } from '@/config/pricing';

// Use server-side environment variable for key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get model from env or default to the requested 2.5-flash
const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

// Rate limiter: 20 requests per minute per IP to prevent 429s during testing/demos
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

function sanitizeInput(input: string): string {
  // Remove potential control characters but keep standard text
  return input.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

// Pricing guidelines for the AI to follow
const PRICING_SYSTEM_INSTRUCTION = PRICING_SCHEDULE;


export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(NextResponse, 20, ip);
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }

    const { ideaDescription, selectedPlatforms, language = 'en' } = await request.json();

    if (!ideaDescription || ideaDescription.trim().length < 10) {
      const errorMessage = language === 'ar' 
        ? 'يرجى تقديم وصف مفصل لفكرة التطبيق'
        : 'Please provide a detailed app idea description';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const sanitizedIdea = sanitizeInput(ideaDescription);
    
    // Safety check for length after sanitization
    if (sanitizedIdea.length > 2000) {
       return NextResponse.json(
        { error: 'Input too long. Please limit to 2000 characters.' },
        { status: 400 }
      );
    }

    const responseLanguage = language === 'ar' ? 'Arabic' : 'English';
    
    // System instruction embedded in prompt
    const prompt = `
      You are an expert in mobile and web app development cost estimation.
      ${language === 'ar' ? "EXTREMELY IMPORTANT: The user wants a response in Arabic. You MUST respond ENTIRELY in Arabic language, including ALL feature names, descriptions, the app overview, and JSON property names. Do NOT translate any part of your response to English. The entire JSON structure must be in Arabic." : "Respond in English."}
      
      System: You are a venture capitalist and tech product strategist.
      Task: Analyze the app idea provided below and return ONLY a JSON object.
      Language: Output strictly in ${responseLanguage}.
      
      Your task is to analyze the user's app description VERY SPECIFICALLY and provide a COMPREHENSIVE feature breakdown.
      
      1. A personalized, detailed overview of THIS SPECIFIC app idea (4-6 sentences).
         - Do not use generic descriptions
         - Address the specific problem this particular app solves
         - Mention the specific target audience
         - Describe the business model
      
      2. A COMPREHENSIVE list of essential features (Aim for 12-20 features) necessary for a fully functional MVP.
         - ALWAYS include "UI/UX Design" ($500, 10 days).
         - ALWAYS include the deployment platforms selected: ${selectedPlatforms ? selectedPlatforms.join(', ') : 'iOS, Android, Web'}.
         - Select specific features from the pricing schedule below that match the app's needs.
         - DO NOT use generic names; use the specific names from the pricing schedule where possible.
      
      3. A STRONG list of enhancement features (Aim for 6-10 features) that would add significant value.
      
      ${PRICING_SYSTEM_INSTRUCTION}
      
      App Idea:
      """
      ${sanitizedIdea}
      """

      Required JSON Structure:
      {
        "appOverview": "Detailed analysis string...",
        "essentialFeatures": [
          {
            "name": "Feature Name",
            "description": "Specific description",
            "purpose": "Feature purpose",
            "costEstimate": "$X",
            "timeEstimate": "Y days"
          }
        ],
        "enhancementFeatures": [ ... ]
      }
    `;

    // Use the configured model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    console.log(`Analysing with model: ${MODEL_NAME}`);
    
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (apiError: any) {
      console.error('Gemini API call failed:', apiError);
      // Handle specific API errors if needed (e.g. quota exceeded)
      throw new Error(`Gemini API Error: ${apiError.message || 'Unknown error'}`);
    }
    
    const text = result.response.text();

    // Find JSON in the response
    // Improved regex to catch JSON even if wrapped in markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No valid JSON found in response:', text);
      throw new Error('No valid JSON found in the Gemini response');
    }

    const jsonString = jsonMatch[0];
    
    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw JSON String:', jsonString);
      // Attempt to clean common JSON errors (like trailing commas) could go here
      throw new Error('Failed to parse AI response as JSON');
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack:", error.stack);
    }
    const { language = 'en' } = await request.json().catch(() => ({ language: 'en' }));
    const errorMessage = language === 'ar' 
      ? 'فشل في تحليل الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.'
      : 'AI analysis failed. Please try again.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
