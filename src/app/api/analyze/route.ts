import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const systemPrompt = `You are an expert in mobile and web app development cost estimation.
Your task is to analyze user input and provide:
1. A concise overview of the app idea.
2. A list of core features necessary for a functional version of the app.
3. A list of suggested features that could add value, with a short description explaining how each feature adds value.

[Feature pricing data omitted for brevity]

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
    const { description, answers } = await request.json();

    const prompt = `${systemPrompt}

Analyze this app idea:

Description: ${description}

Problem Areas: ${answers.problem.join(', ')}
Target Audience: ${answers.targetAudience.join(', ')}
Key Features: ${answers.keyFeatures.join(', ')}
Market Research: ${answers.competitors}
Platforms: ${answers.platforms.join(', ')}
Integrations: ${answers.integrations.join(', ')}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
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
    return NextResponse.json(
      { error: 'AI analysis failed' },
      { status: 500 }
    );
  }
} 