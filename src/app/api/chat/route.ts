import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  hashIP,
} from '@/lib/utils/api-helpers';
import { generateContent } from '@/lib/gemini/client';
import { saveChatMessage } from '@/lib/firebase/collections';
import { chatMessageSchema } from '@/lib/utils/validators';
import { buildChatbotSystemPrompt } from '@/lib/gemini/prompts';
import { logServerError } from '@/lib/firebase/error-logging';

// Rate limiting configuration
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour (session-based)
const TEMPERATURE = 0.7;
const TIMEOUT_MS = 15000; // 15 seconds

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = chatMessageSchema.parse(body);

    // 2. Rate limiting (per session)
    const clientIP = getClientIP(request);
    const rateLimitKey = `chat:${hashIP(clientIP)}:${validatedData.sessionId}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return createErrorResponse(
        'RATE_LIMITED',
        "You've reached the chat message limit for this session. Please book a call for a more in-depth conversation with our team.",
        429,
        { retryAfter }
      );
    }

    // 3. Build prompt with conversation history and call Gemini
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

    const systemPrompt = buildChatbotSystemPrompt({
      currentPage: validatedData.currentPage,
      locale,
      hasConverted: false,
    });

    // Build conversation context from last 10 message pairs (20 messages)
    const recentHistory = validatedData.conversationHistory.slice(-20);
    const conversationContext = recentHistory
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Avi'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

${conversationContext ? `CONVERSATION HISTORY:\n${conversationContext}\n\n` : ''}User: ${validatedData.message}

Avi:`;

    const result = await generateContent(fullPrompt, {
      temperature: TEMPERATURE,
      maxOutputTokens: 1024,
      timeoutMs: TIMEOUT_MS,
    });

    if (!result.success || !result.text) {
      return createErrorResponse(
        'AI_UNAVAILABLE',
        'Our AI assistant is temporarily unavailable. Please try again in a moment.',
        503
      );
    }

    // 4. Save chat messages to Firestore
    // Save user message
    await saveChatMessage(
      validatedData.sessionId,
      { role: 'user', content: validatedData.message },
      validatedData.currentPage,
      locale
    );

    // Save assistant response
    await saveChatMessage(
      validatedData.sessionId,
      { role: 'assistant', content: result.text },
      validatedData.currentPage,
      locale
    );

    // 5. Return success response
    const response = createSuccessResponse({
      reply: result.text,
    });

    // Copy rate limit headers to response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return createErrorResponse(
        'VALIDATION_ERROR',
        firstError.message,
        400
      );
    }

    // Log unexpected errors
    logServerError('chat-api', 'Unexpected error in chat handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to process your message. Please try again.',
      500
    );
  }
}
