/**
 * Service for interacting with Google's Gemini API
 */

'use client';

import { AIAnalysisResult, Feature } from '@/components/AIEstimate';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Update API key handling to be more flexible and secure
// Get the API key from environment variables if available
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Update the model options for more flexibility
export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-1.5-flash';

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

// Pricing guidelines for the AI to follow when generating estimates
const PRICING_SYSTEM_INSTRUCTION = `
Use the following pricing schedule to provide accurate app development estimates:

User Authentication & Authorization > Secure Login/Registration > Email, Phone, Social Media - $200 (1 day)
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
Deployment > Deployment to Platform - $500 (14 days)

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
 * @returns A promise that resolves to the analysis result
 */
export const analyzeAppWithGemini = async (
  appDescription: string,
  apiKey?: string
): Promise<AIAnalysisResult> => {
  try {
    console.log(`Using Gemini model: ${GEMINI_MODEL}`);
    
    // Use the provided API key if given, otherwise use the default from environment or hardcoded
    const genAI = new GoogleGenerativeAI(apiKey || GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const prompt = `
You are an expert in mobile and web app development cost estimation.
Your task is to analyze the user's app description VERY SPECIFICALLY and provide:

1. A personalized, detailed overview of THIS SPECIFIC app idea (4-6 sentences).
   - Do not use generic descriptions
   - Address the specific problem this particular app solves
   - Mention the specific target audience for this exact app
   - Describe the business model relevant to this specific concept
   - Highlight any technical challenges unique to this app

2. Exactly 4-6 essential features necessary for THIS app based on the user's description.
   - ALWAYS include "UI/UX Design" as an essential feature, as all apps require design (use $500 for 10 days)
   - ALWAYS include "Deployment to Platform" as an essential feature
   - Include core authentication or user management features if appropriate
   - Select remaining features that directly address the core functionality described
   - DO NOT use generic features unless they're truly essential

3. 3-5 enhancement features that would add value specifically to THIS app.
   - Choose enhancements that align with the specific app concept
   - Consider features that would enhance user engagement or monetization

EXTREMELY IMPORTANT: You MUST use the EXACT prices and timeframes from the pricing schedule I provided in the system instructions. For example:
- User Authentication should be $200 (1 day)
- Search & Filtering (Advanced) should be $700 (7 days)
- UI/UX Design should use the appropriate pricing from the UI/UX Design section
- Deployment to Platform should be $500 (14 days)

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

The JSON must be properly formatted, so I can parse it. 
REFER EXACTLY to the pricing schedule in the system instructions - do not invent your own prices.
`;

    console.log('Sending request to Gemini API...');
    console.log('Using model:', GEMINI_MODEL);

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: PRICING_SYSTEM_INSTRUCTION }],
        },
        {
          role: "model",
          parts: [{ text: "I'll use these pricing guidelines for estimating app development costs." }],
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

// Fallback function in case the API fails
export function generateMockAnalysis(appDescription: string): AIAnalysisResult {
  console.log('Using mock analysis as fallback');
  
  // Create a clear mock data indicator that will display in the UI
  const mockDataIndicator = "[MOCK DATA] ";
  
  // Return a mock analysis with placeholder data
  return {
    appOverview: mockDataIndicator + "Your mobile marketplace application aims to bridge the gap between local service providers and consumers who need reliable services in their area. By creating a trusted platform for discovery, booking, and reviews, you're solving the significant problem of finding dependable local services that many consumers face. The app targets urban professionals seeking services and small local businesses looking to expand their customer base, operating on a commission-based revenue model where you take a percentage of each successful transaction. Implementation challenges include building a robust review system that establishes trust, integrating secure payment processing, and developing an intuitive matching algorithm that connects users with the most relevant service providers.",
    essentialFeatures: [
      {
        id: "essential-1",
        name: "User Authentication",
        description: "Secure login and registration system with email and social media options",
        purpose: "Authentication",
        costEstimate: "$200",
        timeEstimate: "1 day",
        selected: true
      },
      {
        id: "essential-2",
        name: "Search & Filtering (Advanced)",
        description: "Advanced search with multiple filter options and sorting capabilities",
        purpose: "Core Functionality",
        costEstimate: "$700",
        timeEstimate: "7 days",
        selected: true
      },
      {
        id: "essential-3",
        name: "UI/UX Design",
        description: "Complete user interface design with usability testing",
        purpose: "User Experience",
        costEstimate: "$500",
        timeEstimate: "10 days",
        selected: true
      },
      {
        id: "essential-4",
        name: "Deployment to Platform",
        description: "App store submission and deployment process",
        purpose: "Launch",
        costEstimate: "$500",
        timeEstimate: "14 days",
        selected: true
      },
      {
        id: "essential-5",
        name: "Activity Feeds & Notifications",
        description: "Real-time updates and notifications for user activities",
        purpose: "User Engagement",
        costEstimate: "$600",
        timeEstimate: "5 days",
        selected: true
      }
    ],
    enhancementFeatures: [
      {
        id: "enhancement-1",
        name: "Data Analytics",
        description: "Tracking user behavior and app performance",
        purpose: "Business Intelligence",
        costEstimate: "$800",
        timeEstimate: "7 days",
        selected: false
      },
      {
        id: "enhancement-2",
        name: "Social Media Integration",
        description: "Integration with social media platforms for content sharing",
        purpose: "Marketing",
        costEstimate: "$350",
        timeEstimate: "4 days",
        selected: false
      },
      {
        id: "enhancement-3",
        name: "Multi-language Support",
        description: "Interface translation to multiple languages",
        purpose: "Accessibility",
        costEstimate: "$350",
        timeEstimate: "3 days",
        selected: false
      }
    ]
  };
}

/**
 * Test function to verify the Gemini API key is working
 * @returns A promise that resolves to a boolean indicating success
 */
export const testGeminiApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
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