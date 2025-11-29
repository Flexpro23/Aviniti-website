import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';
import { PRICING_SCHEDULE } from '@/config/pricing';

export const maxDuration = 60; // Set timeout to 60 seconds for Vercel
export const dynamic = 'force-dynamic';

// Use server-side environment variable for key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get model from env or default to the requested 2.5-flash
const PRIMARY_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

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
    
    // Simplified and optimized prompt to reduce token count and processing time
    const prompt = `
      Role: Expert App Cost Estimator.
      Task: Analyze app idea and return strictly JSON.
      Language: ${responseLanguage} only.
      
      Input: "${sanitizedIdea}"
      Platforms: ${selectedPlatforms ? selectedPlatforms.join(', ') : 'iOS, Android, Web'}
      
      Output Format (JSON Only):
      {
        "appOverview": "Specific 3-4 sentence analysis (problem, audience, business model).",
        "essentialFeatures": [
          {"name": "Feature Name", "description": "Brief desc", "purpose": "Why needed", "costEstimate": "$X", "timeEstimate": "Y days"}
        ],
        "enhancementFeatures": [
          {"name": "Feature Name", "description": "Brief desc", "purpose": "Value add", "costEstimate": "$X", "timeEstimate": "Y days"}
        ]
      }
      
      Requirements:
      1. 12-18 essential features (Must include UI/UX Design ($500, 10d) & selected deployments).
      2. 5-8 enhancement features.
      3. Use realistic pricing.
      4. NO markdown, NO conversational text.
    `;

    // Try primary model first
    let modelName = PRIMARY_MODEL;
    let model = genAI.getGenerativeModel({ model: modelName });
    
    console.log(`Analysing with model: ${modelName}`);
    
    let result;
    try {
      // Add timeout for the API call itself
      const apiCallPromise = model.generateContent(prompt);
      // Race against a timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI Generation Timeout')), 55000)
      );
      
      result = await Promise.race([apiCallPromise, timeoutPromise]) as any;
      
    } catch (apiError: any) {
      console.error(`Gemini API call failed with ${modelName}:`, apiError);
      
      // If fallback is different and primary failed, try fallback
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
    
    // Try to recover the language for the error message
    let language = 'en';
    try {
       // Note: Cloning request might fail if already read
       // We can default to en in worst case
    } catch {
       // Ignore
    }

    const errorMessage = language === 'ar' 
      ? 'فشل في تحليل الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.'
      : 'AI analysis failed. Please try again.';
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
