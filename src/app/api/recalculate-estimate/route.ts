import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: Request) {
  try {
    // Validate request body
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { selectedFeatures, initialAnalysis, currentResults } = await request.json();

    // Validate required fields
    if (!selectedFeatures || !Array.isArray(selectedFeatures)) {
      return NextResponse.json(
        { error: 'Selected features must be an array' },
        { status: 400 }
      );
    }

    if (!initialAnalysis || typeof initialAnalysis !== 'object') {
      return NextResponse.json(
        { error: 'Initial analysis data is required' },
        { status: 400 }
      );
    }

    if (!currentResults || typeof currentResults !== 'object') {
      return NextResponse.json(
        { error: 'Current results data is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,  // Reduced max tokens to avoid truncation
      },
    });

    // Prepare the prompt for Gemini - More concise prompt
    const prompt = `As a software project estimator, analyze these project details and provide a concise project analysis. Return ONLY valid JSON.

Initial Analysis Summary:
${JSON.stringify({
  userDetails: initialAnalysis.userDetails,
  projectType: initialAnalysis.projectType,
  mainRequirements: initialAnalysis.mainRequirements
}, null, 2)}

Selected Features Summary:
${JSON.stringify(selectedFeatures.map(f => f.name), null, 2)}

Required JSON Structure:
{
  "overview": {
    "recommendedTeamSize": "string (keep under 50 chars)",
    "totalEstimatedTime": "string (keep under 30 chars)",
    "totalEstimatedCost": "string (keep under 30 chars)",
    "keyMilestones": ["string (keep each under 100 chars)"],
    "projectRisks": ["string (keep each under 50 chars)"],
    "technicalStack": ["string (keep each under 30 chars)"],
    "developmentApproach": "string (keep under 100 chars)",
    "qualityAssurance": "string (keep under 100 chars)",
    "maintenancePlan": "string (keep under 100 chars)"
  },
  "requestedFeatures": [
    {
      "name": "string (keep under 30 chars)",
      "description": "string (keep under 100 chars)",
      "estimatedTime": "string (keep under 20 chars)",
      "estimatedCost": "string (keep under 20 chars)"
    }
  ],
  "suggestedFeatures": [
    {
      "name": "string (keep under 30 chars)",
      "description": "string (keep under 100 chars)",
      "estimatedTime": "string (keep under 20 chars)",
      "estimatedCost": "string (keep under 20 chars)"
    }
  ],
  "technicalRecommendations": [
    {
      "category": "string (keep under 30 chars)",
      "recommendations": ["string (keep each under 80 chars)"]
    }
  ],
  "challenges": [
    {
      "category": "string (keep under 30 chars)",
      "description": "string (keep under 80 chars)",
      "mitigation": "string (keep under 80 chars)"
    }
  ]
}`;

    console.log('Sending prompt to Gemini:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);

    // Try to extract JSON from the response with better error handling
    try {
      // First, try to parse the response directly
      let analysisResults = JSON.parse(text);

      // If parsing succeeds, validate the structure
      if (!analysisResults.overview || !analysisResults.requestedFeatures) {
        throw new Error('Missing required fields in response structure');
      }

      // Initialize arrays if they're missing
      analysisResults = {
        overview: {
          ...analysisResults.overview,
          keyMilestones: analysisResults.overview.keyMilestones || [],
          projectRisks: analysisResults.overview.projectRisks || [],
          technicalStack: analysisResults.overview.technicalStack || []
        },
        requestedFeatures: analysisResults.requestedFeatures || [],
        suggestedFeatures: analysisResults.suggestedFeatures || [],
        technicalRecommendations: analysisResults.technicalRecommendations || [],
        challenges: analysisResults.challenges || []
      };

      return NextResponse.json(analysisResults);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Try to extract JSON if direct parsing fails
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { 
            error: 'Invalid response format from AI model',
            details: 'No valid JSON found in response',
            rawResponse: text.substring(0, 500) // First 500 chars for debugging
          },
          { status: 500 }
        );
      }

      // Try parsing the extracted JSON
      try {
        const analysisResults = JSON.parse(jsonMatch[0]);
        return NextResponse.json(analysisResults);
      } catch (extractError) {
        return NextResponse.json(
          { 
            error: 'Failed to parse estimation results',
            details: extractError instanceof Error ? extractError.message : 'Unknown parsing error',
            rawResponse: text.substring(0, 500)
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error in recalculate-estimate:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process the estimation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 