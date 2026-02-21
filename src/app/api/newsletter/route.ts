import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  hashIP,
  getLocalizedRateLimitMessage,
} from '@/lib/utils/api-helpers';
import { emailSchema } from '@/lib/utils/validators';
import { logServerError } from '@/lib/firebase/error-logging';

// Rate limiting configuration: 3 subscription attempts per IP per hour
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// In-memory subscriber store
// TODO: Replace with Firestore collection once Firebase integration is complete
const subscriberStore = new Set<string>();

const newsletterSchema = z.object({
  email: emailSchema,
  locale: z.enum(['en', 'ar']).optional().default('en'),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);
    const locale = validatedData.locale;

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `newsletter:${hashIP(clientIP)}`;
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
      );
      return createErrorResponse(
        'RATE_LIMITED',
        getLocalizedRateLimitMessage(locale),
        429,
        { retryAfter }
      );
    }

    // 3. Persist the subscription
    subscriberStore.add(validatedData.email.toLowerCase());

    // 4. Return 201 Created on success
    const message =
      locale === 'ar'
        ? 'شكراً لاشتراكك! ستتلقى آخر المستجدات والأخبار قريباً.'
        : "You're subscribed! You'll receive our latest updates and news soon.";

    const response = NextResponse.json(
      { success: true, data: { subscribed: true, message } },
      { status: 201, headers }
    );

    return response;
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return createErrorResponse('VALIDATION_ERROR', firstError.message, 400);
    }

    // Log unexpected errors
    logServerError('newsletter-api', 'Unexpected error in newsletter handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to subscribe. Please try again.',
      500
    );
  }
}
