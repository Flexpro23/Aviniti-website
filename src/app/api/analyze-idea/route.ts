import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { ideaDescription, language = 'en' } = await request.json();

    if (!ideaDescription || ideaDescription.trim().length < 50) {
      const errorMessage = language === 'ar' 
        ? 'يرجى تقديم وصف مفصل لفكرة التطبيق (50 حرفًا على الأقل)'
        : 'Please provide a detailed app idea description (minimum 50 characters)';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const responseLanguage = language === 'ar' ? 'Arabic' : 'English';
    const prompt = `
      As a venture capitalist and tech product strategist, analyze the following app idea.
      Your response MUST be in a valid JSON format. Do not include any text before or after the JSON object.
      Please provide your analysis in ${responseLanguage}.

      The idea is: "${ideaDescription}"

      Your analysis should include the following keys:
      1. "innovationScore": A number between 1 and 10, where 1 is a direct copy of an existing app and 10 is a groundbreaking new concept.
      2. "marketViabilityScore": A number between 1 and 10, assessing the potential user base and market demand.
      3. "monetizationScore": A number between 1 and 10, rating the potential for revenue generation.
      4. "technicalFeasibilityScore": A number between 1 and 10, where 1 is extremely complex (requiring years of R&D) and 10 is straightforward to build with existing technology.
      5. "strengths": A short paragraph (2-3 sentences) detailing the strongest aspects of the idea.
      6. "challenges": A short paragraph (2-3 sentences) identifying the biggest potential hurdles or weaknesses.
      7. "recommendedMonetization": A short paragraph (2-3 sentences) suggesting the most suitable business model (e.g., Subscription, Freemium, Ads, One-time purchase).

      Example JSON structure:
      {
        "innovationScore": 8,
        "marketViabilityScore": 7,
        "monetizationScore": 9,
        "technicalFeasibilityScore": 8,
        "strengths": "This idea targets a highly engaged niche community with clear needs. The potential for user-generated content could lead to strong organic growth.",
        "challenges": "The main challenge will be user acquisition in a crowded market. A strong, unique feature set will be essential to stand out from existing competitors.",
        "recommendedMonetization": "A freemium model is highly recommended. Core features should be free to build a user base, with advanced analytics and community tools available via a premium subscription."
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No valid JSON found in response:', text);
      throw new Error('No valid JSON found in the Gemini response');
    }

    const jsonString = jsonMatch[0];
    const analysisResult = JSON.parse(jsonString);

    // Validate the response structure
    const requiredFields = ['innovationScore', 'marketViabilityScore', 'monetizationScore', 'technicalFeasibilityScore', 'strengths', 'challenges', 'recommendedMonetization'];
    const missingFields = requiredFields.filter(field => !(field in analysisResult));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Gemini API Error:", error);
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