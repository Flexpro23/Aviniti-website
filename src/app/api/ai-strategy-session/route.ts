import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/lib/firebase-admin';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface RequestBody {
  userInput: string;
  messages: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { userInput, messages } = body;

    if (!userInput || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    const geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyBOWp_3aq4U15lW2U0aOH3EzuC3E1akFao';
    
    console.log('API Key check:', {
      hasKey: !!geminiApiKey,
      keyLength: geminiApiKey?.length,
      keyStart: geminiApiKey?.substring(0, 10) + '...',
      isDefault: geminiApiKey === 'your_api_key_here',
      isEmpty: geminiApiKey === ''
    });
    
    if (!geminiApiKey || geminiApiKey === 'your_api_key_here' || geminiApiKey === '') {
      // Return a demo response when API key is not configured
      const demoResponses = [
        "Hello! I'm excited to help you discover your perfect app idea. What interests you most - are you passionate about solving a specific problem, or do you have a particular industry in mind?",
        "That's fascinating! I can see you're thinking about user experience. What kind of people would benefit most from this solution? Understanding your target audience is key to building something truly valuable.",
        "Great insight! Now let's think about the business side. How do you envision this app generating value? Are you thinking subscription model, one-time purchase, or perhaps a marketplace approach?",
        "Excellent strategic thinking! Based on what you've shared, I see real potential here. What's the biggest challenge you think you'll face in bringing this idea to life?",
        "You're asking the right questions! That's actually a common concern, and there are several proven approaches to address it. What's your biggest strength - technical skills, business acumen, or domain expertise?"
      ];
      
      const responseIndex = Math.min(messages.length, demoResponses.length - 1);
      const response = demoResponses[responseIndex];
      
      return NextResponse.json({ response });
    }

    // Build conversation context for Gemini
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }]
    }));

    // Create the intelligent system prompt for the Aviniti Ideation Engine (proactive behavior)
    const systemPrompt = `You are the 'Aviniti Ideation Engine,' a world-class AI business strategist specializing in mobile and web app development. Your goal is to help users brainstorm and refine app ideas through a natural, collaborative conversation.

Key Rules:
1. Your tone is professional, encouraging, and insightful - like a trusted business consultant
2. After every user message, first provide a brief, valuable insight (2-3 sentences), then ask one clear, probing follow-up question to gather more information
3. Focus on understanding the user's goals, pain points, and market opportunities
4. Keep your responses concise and conversational (4-6 sentences total)
5. Adapt your approach based on whether the user has an idea or wants to explore
6. Proactive Idea Generation Rule: After you have gathered at least two key pieces of information (for example, their industry and a core problem), your next response MUST generate 1-2 initial, high-level app ideas. After presenting these ideas, you MUST ask the user if they'd like to explore these further or continue brainstorming for more options.
7. Final Output Trigger Rule: If the user's message includes phrases like "generate the final ideas", "show me the opportunities", or "let's see the report", you must stop the conversational loop and reply with exactly: "Of course. I'm now compiling the detailed Project Blueprints for you. Please give me a moment...".

Your expertise areas:
- Market analysis and opportunity identification
- User experience and target audience analysis
- Business model and monetization strategies
- Technical feasibility and development considerations
- Competitive landscape and differentiation opportunities

Current conversation stage: ${messages.length === 1 ? 'Initial exploration' : 'Deep dive'}

Respond naturally as if you're having a strategic brainstorming session with a potential client.`;

    // Generate AI response using the real Gemini API
    console.log('Attempting to call Gemini API...');
    console.log('API Key available:', !!geminiApiKey);
    console.log('Conversation history length:', conversationHistory.length);
    
    try {
      // Detect explicit final output trigger from the user before calling the chat model
      const finalTriggerRegex = /(generate the final ideas|show me the opportunities|let's see the report)/i;
      const userRequestedFinal = finalTriggerRegex.test(userInput);

      // Create a new model instance with the provided API key
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const modelInstance = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Create a chat session with the conversation history
      const chat = modelInstance.startChat({
        history: conversationHistory,
      });

      // Send the system prompt and user input
      const prompt = `${systemPrompt}\n\nUser: ${userInput}`;
      const result = await chat.sendMessage(prompt);
      let response = result.response.text();

      // If the model replies with the exact confirmation, generate final Opportunity Carousel JSON using Pro model
      if (response.trim() === "Of course. I'm now compiling the detailed Project Blueprints for you. Please give me a moment...") {
        // Generate the structured final ideas using a more capable model
        const proModel = genAI.getGenerativeModel({ model: 'gemini-2.0-pro-exp-02-05' });
        
        const finalPrompt = `You are generating the final Opportunity Carousel (Project Blueprints) as structured JSON for an app ideation session.
The JSON must strictly follow this schema:
{
  "opportunities": [
    {
      "title": string,
      "oneLine": string,
      "targetUsers": string[],
      "coreValue": string,
      "keyFeatures": string[],
      "businessModel": string,
      "differentiators": string[],
      "riskNotes": string
    }
  ]
}

Use the conversation history below as context. Produce only JSON with no extra text.`;

        const finalContext = conversationHistory.map(h => `${h.role.toUpperCase()}: ${h.parts.map(p => p.text).join(' ')}`).join('\n');
        const finalResult = await proModel.generateContent(`${finalPrompt}\n\nCONTEXT:\n${finalContext}`);
        const finalJson = finalResult.response.text();

        try {
          // Parse the JSON response
          const opportunitiesData = JSON.parse(finalJson);
          
          // Save each opportunity to Firestore with unique IDs
          const savedOpportunities = [];
          for (const opportunity of opportunitiesData.opportunities) {
            const opportunityId = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const opportunityWithId = {
              id: opportunityId,
              ...opportunity,
              createdAt: new Date(),
              conversationContext: finalContext
            };
            
            // Save to Firestore
            await db.collection('opportunities').doc(opportunityId).set(opportunityWithId);
            savedOpportunities.push(opportunityWithId);
          }

          // Return the confirmation and the saved opportunities with IDs
          return NextResponse.json({ 
            response, 
            final: true, 
            opportunities: savedOpportunities 
          });
        } catch (parseError) {
          console.error('Error parsing or saving opportunities:', parseError);
          // Fallback: return the raw JSON if parsing fails
          return NextResponse.json({ 
            response, 
            final: true, 
            opportunities: finalJson 
          });
        }
      }

      if (!response) {
        throw new Error('Empty response from Gemini API');
      }

      console.log('Gemini API response received successfully');
      return NextResponse.json({ response });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // Fallback to demo response if Gemini API fails
      const demoResponses = [
        "Hello! I'm excited to help you discover your perfect app idea. What interests you most - are you passionate about solving a specific problem, or do you have a particular industry in mind?",
        "That's fascinating! I can see you're thinking about user experience. What kind of people would benefit most from this solution? Understanding your target audience is key to building something truly valuable.",
        "Great insight! Now let's think about the business side. How do you envision this app generating value? Are you thinking subscription model, one-time purchase, or perhaps a marketplace approach?",
        "Excellent strategic thinking! Based on what you've shared, I see real potential here. What's the biggest challenge you think you'll face in bringing this idea to life?",
        "You're asking the right questions! That's actually a common concern, and there are several proven approaches to address it. What's your biggest strength - technical skills, business acumen, or domain expertise?"
      ];
      
      const responseIndex = Math.min(messages.length, demoResponses.length - 1);
      const response = demoResponses[responseIndex];
      
            return NextResponse.json({ response });
    }

  } catch (error) {
    console.error('Error in AI strategy session:', error);
    
    // Return a helpful error message to the user
    const errorMessage = "I apologize, but I'm having trouble processing your request right now. This might be due to a temporary issue with our AI service. Please try again in a moment, or feel free to rephrase your question.";
    
    return NextResponse.json({ response: errorMessage });
  }
}
