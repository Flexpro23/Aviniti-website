import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * SECURE GEMINI API PROXY
 * 
 * This endpoint proxies all Gemini API calls through the server,
 * keeping the API key secure and never exposing it to the client.
 * 
 * Security features:
 * - API key only accessible server-side
 * - Rate limiting ready
 * - Request validation
 * - Error handling without exposing internals
 */

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - userLimit.count };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, model = 'gemini-2.0-flash', systemInstruction } = body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.length > 100000) {
      return NextResponse.json(
        { error: 'Prompt too long. Maximum 100,000 characters.' },
        { status: 400 }
      );
    }

    // Get API key from environment (SERVER-SIDE ONLY)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelInstance = genAI.getGenerativeModel({ 
      model,
      ...(systemInstruction && { systemInstruction })
    });

    // Generate content
    console.log(`[Gemini Proxy] Generating content with model: ${model}`);
    const result = await modelInstance.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Return successful response with rate limit headers
    return NextResponse.json(
      { 
        text,
        model,
        success: true 
      },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        }
      }
    );

  } catch (error: any) {
    console.error('[Gemini Proxy] Error:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Authentication failed. Please contact support.' },
        { status: 401 }
      );
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Generic error response (don't expose internal details)
    return NextResponse.json(
      { error: 'An error occurred processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    service: 'gemini-proxy',
    configured: hasApiKey,
    timestamp: new Date().toISOString()
  });
}
