
/**
 * Service for interacting with Google's Gemini API via server-side proxy
 */

'use client';

import { AIAnalysisResult, Feature } from '@/types/report';

// Constants
export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Analyzes an app description using the server-side API
 * @param description The user's app description
 * @param apiKey Optional API key (Ignored now as we use server-side key)
 * @param selectedPlatforms Optional array of platform IDs selected by the user
 * @param language Language code ('en' or 'ar')
 * @returns A promise that resolves to the analysis result
 */
export const analyzeAppWithGemini = async (
  appDescription: string,
  apiKey?: string,
  selectedPlatforms?: string[],
  language: string = 'en'
): Promise<AIAnalysisResult> => {
  try {
    console.log('Analyzing app via server API...');
    
    const response = await fetch('/api/analyze-idea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ideaDescription: appDescription,
        selectedPlatforms,
        language
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result = await response.json();
    
    // Process the result to match the frontend types if needed
    // The API should return { appOverview, essentialFeatures, enhancementFeatures }
    // We just need to add IDs and selection state
    
    return {
      appOverview: result.appOverview,
      essentialFeatures: result.essentialFeatures.map((f: any) => ({
        ...f,
        isSelected: true,
        category: 'Essential',
        id: `essential-${Math.random().toString(36).substr(2, 9)}`
      })),
      enhancementFeatures: result.enhancementFeatures.map((f: any) => ({
        ...f,
        isSelected: false,
        category: 'Enhancement',
        id: `enhancement-${Math.random().toString(36).substr(2, 9)}`
      }))
    };

  } catch (error) {
    console.error('Error analyzing app with Gemini API:', error);
    throw error;
  }
}

/**
 * Generates a mock analysis result when the API is unavailable
 */
export function generateMockAnalysis(appDescription: string, selectedPlatforms?: string[]): AIAnalysisResult {
  // This is a mock implementation that returns hardcoded data for testing or when the API is unavailable
  console.log('Using mock analysis as fallback');
  
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
      category: "Deployment",
      isSelected: true
  }));

  const mockFeatures: Array<Feature> = [
    {
      id: "essential-1",
      name: "UI/UX Design",
      description: "Comprehensive application design with user research and wireframes",
      purpose: "Design",
      costEstimate: "$500",
      timeEstimate: "10 days",
      category: "Design",
      isSelected: true
    },
    {
      id: "essential-2",
      name: "Authentication (Email)",
      description: "Secure user authentication using email and password",
      purpose: "Security",
      costEstimate: "$200",
      timeEstimate: "1 day",
      category: "Security",
      isSelected: true
    },
    {
      id: "essential-3",
      name: "Authentication (Social Media)",
      description: "Login using social media accounts",
      purpose: "User Experience",
      costEstimate: "$200",
      timeEstimate: "1 day",
      category: "Security",
      isSelected: true
    },
    ...deploymentFeatures,
    {
      id: `essential-${deploymentFeatures.length + 4}`,
      name: "User Profiles & Personalization",
      description: "Customizable user profiles with preferences",
      purpose: "User Experience",
      costEstimate: "$250",
      timeEstimate: "2 days",
      category: "User Experience",
      isSelected: true
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
      category: "Engagement",
      isSelected: false
    },
    {
      id: "enhancement-2",
      name: "Analytics Integration",
      description: "Track user behavior and app performance",
      purpose: "Insights",
      costEstimate: "$800",
      timeEstimate: "7 days",
      category: "Analytics",
      isSelected: false
    },
    {
      id: "enhancement-3",
      name: "Offline Mode",
      description: "Basic functionality when offline",
      purpose: "User Experience",
      costEstimate: "$850",
      timeEstimate: "7 days",
      category: "Offline",
      isSelected: false
    },
    {
      id: "enhancement-4",
      name: "In-App Purchases",
      description: "Monetization through premium features",
      purpose: "Revenue",
      costEstimate: "$1,000",
      timeEstimate: "10 days",
      category: "Monetization",
      isSelected: false
    }
  ];

  const mockOverview = appDescription;

  return {
    appOverview: mockOverview,
    essentialFeatures: mockFeatures,
    enhancementFeatures: mockEnhancementFeatures
  };
}

/**
 * Test function to verify the Gemini API connection
 */
export const testGeminiApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  // We can't test the server-side key from here directly without an endpoint,
  // but we can try a minimal call to our API
  try {
    const response = await fetch('/api/analyze-idea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaDescription: "Test connection", language: "en" })
    });
    
    if (response.ok) {
      return { success: true, message: "API connection successful" };
    } else {
      return { success: false, message: `API connection failed: ${response.status}` };
    }
  } catch (e) {
    return { success: false, message: "API connection failed (Network)" };
  }
};

/**
 * Enhanced function to generate executive dashboard data using Gemini AI via server
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
    console.log('Generating executive dashboard via server API...');
    const response = await fetch('/api/generate-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appDescription,
        selectedFeatures,
        totalCost,
        totalMinTime,
        totalMaxTime
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
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
