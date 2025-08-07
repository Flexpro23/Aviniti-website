/**
 * Service for interacting with Google's Gemini API
 */

'use client';

import { AIAnalysisResult, Feature } from '@/components/AIEstimate';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Update API key handling to be more flexible and secure
// Get the API key from environment variables if available
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Update the model options for more flexibility - using faster gemini-2.5-flash
export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

// Interface for the raw feature data returned by Gemini
interface RawFeature {
  name: string;
  description: string;
  purpose: string;
  costEstimate: string;
  timeEstimate: string;
}

// Interface for the raw analysis result returned by Gemini
interface RawAnalysisResult {
  appOverview: string;
  essentialFeatures: RawFeature[];
  enhancementFeatures: RawFeature[];
}

// Helper function to detect if text is Arabic
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

// Pricing guidelines for the AI to follow when generating estimates
const PRICING_SYSTEM_INSTRUCTION = `
Use the following pricing schedule to provide accurate app development estimates:

User Authentication & Authorization > Authentication (Email) - $200 (1 day)
User Authentication & Authorization > Authentication (Phone) - $200 (1 day)
User Authentication & Authorization > Authentication (Social Media) - $200 (1 day)
User Authentication & Authorization > Multi-Factor Authentication (2FA/MFA) - $200 (1 day)
User Authentication & Authorization > Biometric Authentication > Fingerprint, Face ID - $300 (2 days)
User Authentication & Authorization > Password Reset/Recovery Flows - $100 (1 day)

User Profiles & Personalization > Customizable Profiles > Avatars, Bios, Preferences - $250 (2 days)
User Profiles & Personalization > Personalized Content Recommendations - $450 (7 days)
User Profiles & Personalization > Dark/Light Mode Themes - $200 (1 day)
User Profiles & Personalization > Language Localization > Multi-Language Support - $350 (3 days)

Navigation & Information Architecture > Intuitive Navigation > Tab Bars, Menus - $250 (2 days)
Navigation & Information Architecture > Search & Filtering Functionality > Simple - $350 (4 days)
Navigation & Information Architecture > Search & Filtering Functionality > Advanced - $700 (7 days)
Navigation & Information Architecture > Breadcrumb Navigation - $200 (2 days)
Navigation & Information Architecture > Site Maps > Especially for complex apps - $500 (5 days)
Navigation & Information Architecture > Onboarding Tutorials & Guides - $200 (3 days)

Content Management > Text Formatting > Rich Text Editors - $300 (3 days)
Content Management > Image/Video Upload & Management - $200 (2 days)
Content Management > Support for various media formats - $200 (2 days)

Social Features > User-to-User Messaging > Direct Messaging, Group Chats - $700 (6 days)
Social Features > Social Media Integration > Sharing, Login with Social Accounts - $350 (4 days)
Social Features > Activity Feeds & Notifications - $600 (5 days)
Social Features > Commenting/Review Systems - $800 (9 days)
Social Features > Community Forums - $800 (9 days)
Social Features > In-App Groups/Communities - $500 (4 days)

Offline Functionality > Data Caching for Offline Access - $850 (7 days)
Offline Functionality > Offline Forms & Data Entry - $850 (7 days)

Location-Based Services > Geolocation Tracking > User Location, Geofencing - $800 (7 days)
Location-Based Services > Maps Integration > Google Maps - $1000 (12 days)
Location-Based Services > Address Autocompletion - $500 (3 days)

Communication & Engagement > Push Notifications > Basic - $550 (4 days)
Communication & Engagement > Push Notifications > Personalized - $1,000 (9 days)
Communication & Engagement > Push Notifications > Scheduled - $800 (7 days)
Communication & Engagement > Push Notifications > Transactional - $400 (3 days)
Communication & Engagement > In-App Messaging > General - $1,000 (8 days)
Communication & Engagement > In-App Messaging > Real-Time Chat Support - $800 (7 days)
Communication & Engagement > In-App Announcements & Updates - $350 (3 days)
Communication & Engagement > Customer Feedback Forms & Surveys - $500 (4 days)
Communication & Engagement > Email Integration > Basic Setup - $200 (1 day)
Communication & Engagement > Email Integration > Automated Email Campaigns - $700 (8 days)
Communication & Engagement > Email Integration > Transactional Emails - $300 (2 days)
Communication & Engagement > SMS Integration > Basic Setup - $750 (9 days)
Communication & Engagement > SMS Integration > SMS Verification Codes - $200 (3 days)
Communication & Engagement > SMS Integration > SMS Notifications - $700 (5 days)

E-commerce & Payments > E-commerce & Payments - $1,000 (8 days)
E-commerce & Payments > Product Catalogs & Listings > General - $300 (2 days)
E-commerce & Payments > Product Catalogs & Listings > Detailed Product Descriptions - $200 (3 days)
E-commerce & Payments > Product Catalogs & Listings > High-Quality Product Images & Videos - $500 (4 days)
E-commerce & Payments > Product Catalogs & Listings > Product Reviews & Ratings - $700 (5 days)
E-commerce & Payments > Product Catalogs & Listings > Inventory Management - $700 (8 days)
E-commerce & Payments > Product Catalogs & Listings > Product Filtering & Sorting - $950 (8 days)
E-commerce & Payments > Shopping Cart & Checkout > General - $400 (3 days)
E-commerce & Payments > Shopping Cart & Checkout > Secure Checkout Process - $800 (7 days)
E-commerce & Payments > Shopping Cart & Checkout > Multiple Payment Options - $550 (7 days)
E-commerce & Payments > Shopping Cart & Checkout > Shipping Options & Calculations - $200 (2 days)
E-commerce & Payments > Shopping Cart & Checkout > Order Tracking - $300 (4 days)
E-commerce & Payments > Shopping Cart & Checkout > Coupon Codes & Discounts - $500 (4 days)
E-commerce & Payments > Subscription Management > General - $650 (7 days)
E-commerce & Payments > Subscription Management > Recurring Billing - $500 (6 days)
E-commerce & Payments > Subscription Management > Subscription Tiers - $400 (5 days)
E-commerce & Payments > Subscription Management > Subscription Renewal Reminders - $200 (2 days)
E-commerce & Payments > In-App Purchase (IAP) Integration - $1,000 (10 days)

Data & Analytics > User Analytics > Tracking User Behavior - $800 (7 days)
Data & Analytics > Performance Monitoring > App Crash Reporting - $400 (3 days)
Data & Analytics > Performance Monitoring - $800 (7 days)
Data & Analytics > A/B Testing > Testing Different UI Elements & Features - $1000 (12 days)
Data & Analytics > A/B Testing > Measuring User Engagement & Conversion Rates - $850 (6 days)

Advanced Features > Augmented Reality (AR) Integration - $2,500 (20 days)
Advanced Features > Augmented Reality (AR) Integration > AR Product Visualization - $3,000 (25 days)
Advanced Features > Virtual Reality (VR) Integration - $2,500 (20 days)
Advanced Features > Secure Data Storage - $750 (5 days)
Advanced Features > Apple Watch App Development - $1000 (10 days)
Advanced Features > Android Wear App Development - $1000 (8 days)
Advanced Features > Health Data Integration > Apple HealthKit, Google Fit - $1500 (10 days)
Advanced Features > AI-Powered Features > Personalized Recommendations - $2,500 (20 days)
Advanced Features > AI-Powered Features > Custom LLM integration for specialized Chatbot functions - $1,500 (12 days)
Advanced Features > AI-Powered Features > AI Powered image editing - $3,500 (16 days)
Advanced Features > AI-Powered Features > Natural Language Processing (NLP) - $4,000 (20 days)

Platform-Specific Features > iOS > Haptic Feedback - $250 (3 days)
Deployment > Deployment (iOS) - $450 (14 days)
Deployment > Deployment (Android) - $350 (14 days)
Deployment > Deployment (Web) - $300 (14 days)

Ready-Made App Solutions > Delivery App Solution - $10,000 (35 days)
Ready-Made App Solutions > Kindergarten Management App Solution - $8,000 (35 days)
Ready-Made App Solutions > Hypermarket Management App Solution - $15,000 (35 days)
Ready-Made App Solutions > Office Management App Solutions - $8,000 (20 days)
Ready-Made App Solutions > Gym Management App Solutions - $25,000 (60 days)
Ready-Made App Solutions > Airbnb-Style Marketplace App Solutions - $15,000 (35 days)

UI/UX Design > Comprehensive Design - $500 (10 days)
UI/UX Design > User Research > User Interviews - $1,500 (20 days)
UI/UX Design > User Research > Surveys - $1,500 (20 days)
UI/UX Design > User Research > Usability Testing - $1,000 (5 days)
UI/UX Design > User Research > Competitor Analysis - $1,500 (10 days)

When providing estimates, format costs as strings with dollar signs (e.g., "$1,000") and time as strings with days (e.g., "7 days").
`;

/**
 * Analyzes an app description using Gemini's generative AI
 * @param description The user's app description
 * @param apiKey Optional API key to use instead of the default
 * @param selectedPlatforms Optional array of platform IDs selected by the user
 * @returns A promise that resolves to the analysis result
 */
export const analyzeAppWithGemini = async (
  appDescription: string,
  apiKey?: string,
  selectedPlatforms?: string[],
  language?: string
): Promise<AIAnalysisResult> => {
  try {
    console.log('Analyzing app with Gemini...');
    console.log('Selected platforms:', selectedPlatforms || []);
    
    // Use provided API key or fallback to environment variable
    const key = apiKey || GEMINI_API_KEY;
    
    if (!key || key.trim() === '') {
      console.error('No Gemini API key provided');
      throw new Error('API key is required. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
    }
    
    // Initialize with the key
    const tempGenAI = new GoogleGenerativeAI(key);
    const tempModel = tempGenAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Determine the response language
    const isArabic = language === 'ar' || containsArabic(appDescription);
    console.log('Language parameter:', language);
    console.log('Response language determined:', isArabic ? 'Arabic' : 'English');

    // Create language-specific instruction
    const languageInstruction = isArabic 
      ? "EXTREMELY IMPORTANT: The user wants a response in Arabic. You MUST respond ENTIRELY in Arabic language, including ALL feature names, descriptions, the app overview, and JSON property names. Do NOT translate any part of your response to English. The entire JSON structure must be in Arabic."
      : "Respond in English.";

    const prompt = `
You are an expert in mobile and web app development cost estimation.
${languageInstruction}

Your task is to analyze the user's app description VERY SPECIFICALLY and provide:

1. A personalized, detailed overview of THIS SPECIFIC app idea (4-6 sentences).
   - Do not use generic descriptions
   - Address the specific problem this particular app solves
   - Mention the specific target audience for this exact app
   - Describe the business model relevant to this specific concept
   - Highlight any technical challenges unique to this app

2. Exactly 4-6 essential features necessary for THIS app based on the user's description.
   - ALWAYS include "UI/UX Design" as an essential feature, as all apps require design (use $500 for 10 days)
   - ALWAYS include the deployment platforms selected by the user (${selectedPlatforms ? selectedPlatforms.join(', ') : 'iOS, Android, Web'})
   - Include appropriate authentication options (Email, Phone, Social Media) based on the app requirements, each at $200
   - Select remaining features that directly address the core functionality described
   - DO NOT use generic features unless they're truly essential

3. 3-5 enhancement features that would add value specifically to THIS app.
   - Choose enhancements that align with the specific app concept
   - Consider features that would enhance user engagement or monetization

EXTREMELY IMPORTANT: You MUST use the EXACT prices and timeframes from the pricing schedule I provided in the system instructions. For example:
- Authentication (Email) should be $200 (1 day)
- Authentication (Phone) should be $200 (1 day)
- Authentication (Social Media) should be $200 (1 day)
- Search & Filtering (Advanced) should be $700 (7 days)
- UI/UX Design should use the appropriate pricing from the UI/UX Design section
- Deployment (iOS) should be $450 (14 days)
- Deployment (Android) should be $350 (14 days)
- Deployment (Web) should be $300 (14 days)

The app description is:
${appDescription}

Format your response as valid JSON with the following structure:
{
  "appOverview": "Detailed 4-6 sentence analysis of THIS SPECIFIC app concept, including problems solved, target audience, business model, and technical complexity. This should NOT be a list of features but a comprehensive analysis.",
  "essentialFeatures": [
    {
      "name": "Feature Name",
      "description": "Feature description",
      "purpose": "Feature purpose/function",
      "costEstimate": "$X",
      "timeEstimate": "Y days"
    }
  ],
  "enhancementFeatures": [
    {
      "name": "Feature Name",
      "description": "Feature description",
      "purpose": "Feature purpose/function",
      "costEstimate": "$X",
      "timeEstimate": "Y days"
    }
  ]
}

${isArabic ? "تذكر أن الاستجابة بأكملها يجب أن تكون باللغة العربية، بما في ذلك جميع أسماء الميزات والأوصاف ونظرة عامة على التطبيق. لا تترجم أي جزء من استجابتك إلى اللغة الإنجليزية." : ""}
The JSON must be properly formatted, so I can parse it. 
REFER EXACTLY to the pricing schedule in the system instructions - do not invent your own prices.
`;

    console.log('Sending request to Gemini API...');
    console.log('Using model:', GEMINI_MODEL);
    console.log('Language mode:', isArabic ? 'Arabic' : 'English');

    // Create a chat session
    const chat = tempModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: PRICING_SYSTEM_INSTRUCTION }],
        },
        {
          role: "model",
          parts: [{ text: isArabic 
            ? "سأستخدم جدول الأسعار هذا لتقدير تكاليف تطوير التطبيقات." 
            : "I'll use these pricing guidelines for estimating app development costs." }],
        }
      ],
    });

    // Generate content
    const result = await chat.sendMessage(prompt);
    const textResponse = result.response.text();
    
    if (!textResponse) {
      console.error('Empty response from Gemini API');
      throw new Error('Empty response from Gemini API');
    }

    console.log('Received response from Gemini API');
    
    // Log a preview of the response
    console.log('Gemini response preview:', textResponse.substring(0, 200) + '...');

    // Find JSON in the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No valid JSON found in response:', textResponse);
      throw new Error('No valid JSON found in the Gemini response');
    }

    const jsonString = jsonMatch[0];
    console.log('Parsed JSON from response');
    
    try {
      const result = JSON.parse(jsonString) as {
        appOverview: string;
        essentialFeatures: Omit<Feature, 'id' | 'selected'>[];
        enhancementFeatures: Omit<Feature, 'id' | 'selected'>[];
      };

      console.log('Successfully analyzed app with Gemini');
      
      return {
        appOverview: result.appOverview,
        essentialFeatures: result.essentialFeatures.map(f => ({
          ...f,
          selected: true, // Default all essential features to selected
          id: `essential-${Math.random().toString(36).substr(2, 9)}`
        })),
        enhancementFeatures: result.enhancementFeatures.map(f => ({
          ...f,
          selected: false, // Default all enhancement features to not selected
          id: `enhancement-${Math.random().toString(36).substr(2, 9)}`
        }))
      };
    } catch (parseError) {
      console.error('Error parsing JSON from Gemini response:', parseError);
      console.error('JSON string that failed to parse:', jsonString);
      throw new Error('Failed to parse JSON from Gemini response');
    }
  } catch (error) {
    console.error('Error analyzing app with Gemini:', error);
    throw error;
  }
}

/**
 * Generates a mock analysis result when the API is unavailable
 * @param appDescription The app description text
 * @param selectedPlatforms Optional array of selected platform IDs
 * @returns A mock analysis result
 */
export function generateMockAnalysis(appDescription: string, selectedPlatforms?: string[]): AIAnalysisResult {
  // This is a mock implementation that returns hardcoded data for testing or when the API is unavailable
  console.log('Using mock analysis as fallback');
  console.log('Mock selected platforms:', selectedPlatforms || []);
  
  // Map platform IDs to their corresponding deployment feature names and costs
  const platformMap: Record<string, {name: string, description: string, cost: number}> = {
    'ios': { name: "Deployment (iOS)", description: "App store submission and deployment process for iOS", cost: 450 },
    'android': { name: "Deployment (Android)", description: "Google Play store submission and deployment process", cost: 350 },
    'web': { name: "Deployment (Web)", description: "Web hosting and deployment process", cost: 300 }
  };
  
  // Create deployment features based on selected platforms or default to iOS and Android
  const deploymentFeatures = (selectedPlatforms && selectedPlatforms.length > 0 
    ? selectedPlatforms 
    : ['ios', 'android']).map((platform, index) => ({
      id: `essential-${4 + index}`,
      name: platformMap[platform]?.name || `Deployment (${platform})`,
      description: platformMap[platform]?.description || `Deployment for ${platform} platform`,
      purpose: "Launch",
      costEstimate: `$${platformMap[platform]?.cost || 200}`,
      timeEstimate: "14 days",
      selected: true
  }));

  const mockFeatures: Array<Feature> = [
    {
      id: "essential-1",
      name: "UI/UX Design",
      description: "Comprehensive application design with user research and wireframes",
      purpose: "Design",
      costEstimate: "$500",
      timeEstimate: "10 days",
      selected: true
    },
    {
      id: "essential-2",
      name: "Authentication (Email)",
      description: "Secure user authentication using email and password",
      purpose: "Security",
      costEstimate: "$200",
      timeEstimate: "1 day",
      selected: true
    },
    {
      id: "essential-3",
      name: "Authentication (Social Media)",
      description: "Login using social media accounts",
      purpose: "User Experience",
      costEstimate: "$200",
      timeEstimate: "1 day",
      selected: true
    },
    // Replace the static deployment features with the dynamic ones from selected platforms
    ...deploymentFeatures,
    {
      id: `essential-${deploymentFeatures.length + 4}`,
      name: "User Profiles & Personalization",
      description: "Customizable user profiles with preferences",
      purpose: "User Experience",
      costEstimate: "$250",
      timeEstimate: "2 days",
      selected: true
    },
  ];

  const mockEnhancementFeatures: Array<Feature> = [
    {
      id: "enhancement-1",
      name: "Push Notifications",
      description: "Real-time alerts and notifications for users",
      purpose: "Engagement",
      costEstimate: "$550",
      timeEstimate: "4 days",
      selected: false
    },
    {
      id: "enhancement-2",
      name: "Analytics Integration",
      description: "Track user behavior and app performance",
      purpose: "Insights",
      costEstimate: "$800",
      timeEstimate: "7 days",
      selected: false
    },
    {
      id: "enhancement-3",
      name: "Offline Mode",
      description: "Basic functionality when offline",
      purpose: "User Experience",
      costEstimate: "$850",
      timeEstimate: "7 days",
      selected: false
    },
    {
      id: "enhancement-4",
      name: "In-App Purchases",
      description: "Monetization through premium features",
      purpose: "Revenue",
      costEstimate: "$1,000",
      timeEstimate: "10 days",
      selected: false
    }
  ];

  // Create a mock overview based on the app description or use a fallback message
  const mockOverview = appDescription 
    ? `[MOCK DATA] Your app idea appears to be about ${appDescription.substring(0, 40)}... This is a mock analysis that would normally be generated using AI based on your complete description. The mock includes updated pricing for authentication methods ($200 each) and platform deployment options ($200 each).` 
    : "[MOCK DATA] This is a placeholder analysis. In a real scenario, our AI would analyze your app description and provide detailed insights.";

  return {
    appOverview: mockOverview,
    essentialFeatures: mockFeatures,
    enhancementFeatures: mockEnhancementFeatures
  };
}

/**
 * Test function to verify the Gemini API key is working
 * @returns A promise that resolves to a boolean indicating success
 */
export const testGeminiApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.error('No Gemini API key provided');
      return {
        success: false,
        message: 'API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.',
      };
    }
    
    console.log(`Testing connection to Gemini API with model: ${GEMINI_MODEL}`);
    
    // Create a minimal prompt to test the API
    const prompt = "Hello, please respond with 'API is working' if you can read this message.";
    
    // Use the model instance configured above
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log(`Gemini API test response: ${text}`);
    
    return {
      success: true,
      message: `API is working with model ${GEMINI_MODEL}`,
    };
  } catch (error) {
    console.error("Error testing Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `API connection failed: ${errorMessage}`,
    };
  }
};

/**
 * Enhanced function to generate executive dashboard data using Gemini AI
 * @param appDescription - The user's app description
 * @param selectedFeatures - Array of selected features
 * @param totalCost - Calculated total cost
 * @param totalMinTime - Minimum development time
 * @param totalMaxTime - Maximum development time
 * @returns Promise with comprehensive dashboard data
 */
export const generateExecutiveDashboard = async (
  appDescription: string,
  selectedFeatures: any[],
  totalCost: number,
  totalMinTime: number,
  totalMaxTime: number
): Promise<any> => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.warn('No Gemini API key - using fallback data for executive dashboard');
      return generateFallbackDashboard(appDescription, selectedFeatures, totalCost, totalMinTime, totalMaxTime);
    }

    const featureList = selectedFeatures.map(f => `- ${f.name}: ${f.description} (${f.costEstimate})`).join('\n');
    
    const prompt = `
      As a senior technology consultant and venture strategist, create a comprehensive executive dashboard analysis for this app development project.
      
      App Description: "${appDescription}"
      
      Selected Features:
      ${featureList}
      
      Total Cost: $${totalCost.toLocaleString()}
      Development Time: ${totalMinTime}-${totalMaxTime} days
      
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
    `;

    console.log('Generating executive dashboard with Gemini...');
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No valid JSON found in Gemini response, using fallback');
      return generateFallbackDashboard(appDescription, selectedFeatures, totalCost, totalMinTime, totalMaxTime);
    }

    const dashboardData = JSON.parse(jsonMatch[0]);
    console.log('Successfully generated executive dashboard data');
    return dashboardData;

  } catch (error) {
    console.error('Error generating executive dashboard:', error);
    return generateFallbackDashboard(appDescription, selectedFeatures, totalCost, totalMinTime, totalMaxTime);
  }
};

/**
 * Fallback function for executive dashboard when Gemini API is unavailable
 */
function generateFallbackDashboard(
  appDescription: string,
  selectedFeatures: any[],
  totalCost: number,
  totalMinTime: number,
  totalMaxTime: number
): any {
  return {
    appOverview: `Strategic mobile application focusing on ${appDescription.substring(0, 50)}... This solution addresses key market needs with modern technology stack and user-centric design.`,
    successPotentialScores: {
      innovation: 7,
      marketViability: 8,
      monetization: 7,
      technicalFeasibility: 8
    },
    strategicAnalysis: {
      strengths: "Strong feature set with proven market demand. Modern technology choices ensure scalability and maintainability for long-term success.",
      challenges: "Competitive market requires differentiated positioning. User acquisition costs and retention strategies will be critical for sustainable growth.",
      recommendedMonetization: "Freemium model recommended with core features free and premium tiers for advanced functionality. Consider subscription model for recurring revenue."
    },
    costBreakdown: {
      "UI/UX Design": Math.round(totalCost * 0.2),
      "Core Development": Math.round(totalCost * 0.45),
      "Quality Assurance": Math.round(totalCost * 0.15),
      "Infrastructure & Deployment": Math.round(totalCost * 0.1),
      "Project Management": Math.round(totalCost * 0.1)
    },
    timelinePhases: [
      {
        phase: "Discovery & Design",
        duration: "Weeks 1-2",
        description: "User research, competitive analysis, wireframing, and UI/UX design"
      },
      {
        phase: "Core Development", 
        duration: `Weeks 3-${Math.ceil(totalMinTime / 7) + 2}`,
        description: "Feature implementation, backend development, and API integration"
      },
      {
        phase: "Testing & Launch",
        duration: "Final 1-2 weeks", 
        description: "Quality assurance, performance optimization, and market deployment"
      }
    ],
    marketComparison: "Competitively positioned with modern features and technology stack. Differentiation through user experience and specific feature combinations provides market advantage.",
    complexityAnalysis: `${totalCost > 15000 ? 'High' : totalCost > 8000 ? 'Medium' : 'Low'} complexity project requiring ${selectedFeatures.length > 8 ? 'experienced' : 'intermediate'} development expertise. Technical risks are manageable with proper architecture and testing.`
  };
} 