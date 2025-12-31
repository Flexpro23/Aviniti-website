import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import rateLimit from '@/lib/rate-limit';
import { PRICING_SCHEDULE } from '@/config/pricing';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(NextResponse, 5, ip);
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { appDescription, selectedFeatures, totalCost, totalMinTime, totalMaxTime, language = 'en' } = await request.json();

    const featureList = selectedFeatures.map((f: any) => `- ${f.name}: ${f.description} (${f.costEstimate})`).join('\n');
    
    const prompt = `
      As a senior technology consultant and venture strategist, create a comprehensive executive dashboard analysis for this app development project.
      
      App Description: "${appDescription}"
      
      Selected Features:
      ${featureList}
      
      Total Cost: $${totalCost.toLocaleString()}
      Development Time: ${totalMinTime}-${totalMaxTime} days
      
      For your cost breakdown, use the following pricing schedule as a reference to ensure realistic allocations:
      ${PRICING_SCHEDULE}

      Please provide a JSON response with the following structure:
      {
        "appOverview": "A strategic 2-3 sentence summary focusing on business value and market positioning",
        "successPotentialScores": {
          "innovation": [1-10 score],
          "marketViability": [1-10 score], 
          "monetization": [1-10 score],
          "technicalFeasibility": [1-10 score]
        },
        "strategicAnalysis": {
          "strengths": "2-3 sentences highlighting key competitive advantages",
          "challenges": "2-3 sentences identifying main risks and mitigation strategies", 
          "recommendedMonetization": "2-3 sentences with specific revenue model recommendations"
        },
        "costBreakdown": {
          "UI/UX Design": [dollar amount],
          "Core Development": [dollar amount],
          "Quality Assurance": [dollar amount],
          "Infrastructure & Deployment": [dollar amount],
          "Project Management": [dollar amount]
        },
        "timelinePhases": [
          {
            "phase": "Discovery & Design",
            "duration": "Weeks 1-2", 
            "description": "User research, wireframing, and UI/UX design"
          },
          {
            "phase": "Core Development",
            "duration": "Weeks 3-6",
            "description": "Feature implementation and backend development"  
          },
          {
            "phase": "Testing & Launch",
            "duration": "Weeks 7-8",
            "description": "Quality assurance, deployment, and market launch"
          }
        ],
        "marketComparison": "2-3 sentences comparing this solution to existing market alternatives",
        "complexityAnalysis": "2-3 sentences assessing technical complexity and development risks"
      }

      Ensure all dollar amounts in costBreakdown sum to approximately $${totalCost}.
      Base success scores on real market analysis principles.
      Provide actionable strategic insights suitable for C-level executives.
      ${language === 'ar' ? "RESPONSE MUST BE IN ARABIC." : ""}
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Gemini response');
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));

  } catch (error) {
    console.error('Error generating dashboard:', error);
    return NextResponse.json({ error: 'Failed to generate dashboard' }, { status: 500 });
  }
}

