import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Enhanced response cleaning function
const cleanResponse = (text: string): string => {
  console.log('Starting response cleaning process...');
  let cleaned = text.trim();
  
  // Log original text (truncated for readability)
  console.log('Original text:', cleaned.substring(0, 100) + '...');
  
  // Remove markdown code block syntax
  if (cleaned.includes('```')) {
    console.log('Detected markdown code blocks, cleaning...');
    // Remove all variations of code block starts
    cleaned = cleaned.replace(/```(?:json|javascript|js|typescript|ts)?\n/g, '');
    // Remove code block ends
    cleaned = cleaned.replace(/\n```/g, '');
    console.log('Removed code block syntax');
  }

  // Remove any remaining markdown formatting
  cleaned = cleaned
    // Remove bold/italic markers
    .replace(/\*\*|\*|__/g, '')
    // Remove inline code markers
    .replace(/`/g, '')
    // Remove any HTML tags that might be present
    .replace(/<[^>]*>/g, '')
    // Remove any extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Log cleaned text (truncated for readability)
  console.log('Cleaned text:', cleaned.substring(0, 100) + '...');
  
  return cleaned;
};

export async function POST(request: Request) {
  try {
    // Validate API key first
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key is not configured');
      return NextResponse.json(
        { error: 'API configuration error: Missing API key' },
        { status: 500 }
      );
    }

    // Parse request body
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format: Failed to parse request body' },
        { status: 400 }
      );
    }

    // Validate request data
    const { userDetails, ideaDetails, questionnaireAnswers } = data;
    if (!userDetails || !ideaDetails || !questionnaireAnswers) {
      console.error('Missing required fields in request:', { userDetails, ideaDetails, questionnaireAnswers });
      return NextResponse.json(
        { error: 'Invalid request format: Missing required fields' },
        { status: 400 }
      );
    }

    // Create the model with specific configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 65536,
      },
    });

    // Construct the prompt
    const prompt = `
      You are an AI project analyzer for Aviniti, a software development company. Your task is to analyze the following project requirements and provide a detailed analysis in JSON format.

      User Details:
      - Name: ${userDetails.fullName}
      - Company: ${userDetails.companyName || 'N/A'}
      - Contact: ${userDetails.phoneNumber}, ${userDetails.emailAddress}

      Project Description:
      ${ideaDetails.description}
      ${ideaDetails.transcribedText ? `\nTranscribed Audio Description:\n${ideaDetails.transcribedText}` : ''}

      Questionnaire Responses:
      - Target Audience: ${questionnaireAnswers.targetAudience.join(', ')}
      - Platform Type: ${questionnaireAnswers.platformType}
      - Development Timeline: ${questionnaireAnswers.developmentTimeline}
      - Budget Range: ${questionnaireAnswers.budget}
      - Key Features Needed: ${questionnaireAnswers.keyFeatures.join(', ')}
      - Monetization Strategy: ${questionnaireAnswers.monetizationStrategy.join(', ')}
      - Competitors: ${questionnaireAnswers.competitorNames || 'N/A'}
      - Security Requirements: ${questionnaireAnswers.securityRequirements.join(', ')}
      - Scalability Needs: ${questionnaireAnswers.scalabilityNeeds}
      - Integration Requirements: ${questionnaireAnswers.integrationRequirements.join(', ')}
      - Customization Level: ${questionnaireAnswers.customization}
      - Maintenance Support: ${questionnaireAnswers.maintenanceSupport.join(', ')}

      Based on the above information, provide a comprehensive analysis in the following JSON format. Be specific with time estimates and costs, and ensure all values are realistic and properly formatted:

      {
        "requestedFeatures": [
          {
            "name": "Feature name",
            "description": "Detailed feature description",
            "estimatedTime": "X days",
            "estimatedCost": "$Y,YYY USD"
          }
        ],
        "suggestedFeatures": [
          {
            "name": "Feature name",
            "description": "Detailed feature description",
            "estimatedTime": "X days",
            "estimatedCost": "$Y,YYY USD",
            "justification": "Clear business justification"
          }
        ],
        "technicalRecommendations": [
          {
            "category": "Category name",
            "recommendations": [
              "Specific technical recommendation",
              "Another specific recommendation"
            ]
          }
        ],
        "challenges": [
          {
            "challenge": "Specific challenge description",
            "mitigation": "Detailed mitigation strategy"
          }
        ],
        "overview": {
          "totalEstimatedTime": "X months",
          "totalEstimatedCost": "$XXX,XXX USD",
          "recommendedTeamSize": "X developers",
          "keyMilestones": [
            "Specific milestone with timeframe",
            "Another specific milestone"
          ]
        }
      }

      Ensure all cost estimates are realistic and include development, testing, and deployment costs. Time estimates should account for planning, development, testing, and deployment phases.
    `;

    try {
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      
      // Check if result is valid
      if (!result || !result.response) {
        const error = {
          error: 'Analysis failed: Invalid Gemini response',
          details: 'The AI model returned an invalid response object',
          received: result,
          timestamp: new Date().toISOString()
        };
        console.error('Invalid Gemini response:', error);
        return NextResponse.json(error, { status: 500 });
      }

      const response = await result.response;
      
      // Check if response has text method
      if (!response || typeof response.text !== 'function') {
        const error = {
          error: 'Analysis failed: Invalid response format',
          details: 'The AI model response is missing required methods',
          received: response,
          timestamp: new Date().toISOString()
        };
        console.error('Invalid response format:', error);
        return NextResponse.json(error, { status: 500 });
      }

      const text = response.text();

      // Log the raw response for debugging
      console.log('Raw Gemini Response:', text);

      // Validate response is not empty
      if (!text || text.trim() === '') {
        const error = {
          error: 'Analysis failed: Received empty response from AI model',
          details: 'The AI model returned an empty response',
          timestamp: new Date().toISOString()
        };
        console.error('Empty response error:', error);
        return NextResponse.json(error, { status: 500 });
      }

      try {
        // Clean and parse the response
        const cleanedText = cleanResponse(text);
        
        let analysis;
        try {
          analysis = JSON.parse(cleanedText);
          console.log('Successfully parsed JSON response');
        } catch (parseError: unknown) {
          // If parsing fails, try to extract JSON from the text
          console.log('Initial JSON parsing failed, attempting to extract JSON...');
          
          // Look for JSON-like structure
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            console.log('Found JSON-like structure, attempting to parse...');
            try {
              analysis = JSON.parse(jsonMatch[0]);
              console.log('Successfully parsed extracted JSON');
            } catch (extractError: unknown) {
              const errorMessage = extractError instanceof Error ? extractError.message : 'Unknown error';
              throw new Error(`Failed to parse extracted JSON: ${errorMessage}`);
            }
          } else {
            const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
            throw new Error(`Failed to parse response: ${errorMessage}`);
          }
        }

        // Validate the response structure with detailed logging
        console.log('Validating response structure...');
        
        const validateField = (obj: any, field: string): boolean => {
          const hasField = obj && obj[field] !== undefined;
          console.log(`Validating field '${field}':`, hasField ? 'Present' : 'Missing');
          return hasField;
        };

        if (!validateField(analysis, 'requestedFeatures') || !validateField(analysis, 'overview')) {
          const error = {
            error: 'Analysis failed: Invalid response structure',
            details: 'The AI response is missing required fields',
            received: analysis,
            missingFields: [
              !analysis.requestedFeatures && 'requestedFeatures',
              !analysis.overview && 'overview'
            ].filter(Boolean),
            timestamp: new Date().toISOString()
          };
          console.error('Invalid structure error:', error);
          return NextResponse.json(error, { status: 500 });
        }

        // Validate required fields in overview with detailed logging
        console.log('Validating overview fields...');
        const requiredOverviewFields = ['totalEstimatedTime', 'totalEstimatedCost', 'recommendedTeamSize', 'keyMilestones'];
        const missingFields = requiredOverviewFields.filter(field => !validateField(analysis.overview, field));
        
        if (missingFields.length > 0) {
          const error = {
            error: 'Analysis failed: Incomplete overview data',
            details: `Missing required fields in overview: ${missingFields.join(', ')}`,
            received: analysis.overview,
            missingFields,
            timestamp: new Date().toISOString()
          };
          console.error('Missing fields error:', error);
          return NextResponse.json(error, { status: 500 });
        }

        // Log successful response
        console.log('Analysis validation successful, returning response');
        return NextResponse.json(analysis);
      } catch (parseError) {
        const error = {
          error: 'Analysis failed: Invalid JSON response',
          details: 'The AI response could not be parsed as JSON',
          rawResponse: text.substring(0, 500), // Include first 500 chars of raw response
          cleanedResponse: cleanResponse(text).substring(0, 500), // Include cleaned version for debugging
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error',
          timestamp: new Date().toISOString()
        };
        console.error('Parse error:', error);
        return NextResponse.json(error, { status: 500 });
      }
    } catch (geminiError: any) {
      const error = {
        error: 'Analysis failed: AI model error',
        details: geminiError instanceof Error ? geminiError.message : 'Unknown error occurred',
        errorType: geminiError.constructor.name,
        timestamp: new Date().toISOString()
      };
      console.error('Gemini API error:', error);
      return NextResponse.json(error, { status: 500 });
    }
  } catch (error: any) {
    const errorResponse = {
      error: 'Analysis failed: Unexpected error',
      details: error instanceof Error ? error.message : 'An unknown error occurred',
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    };
    console.error('Unexpected error:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
} 