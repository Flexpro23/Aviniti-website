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
import { getAdminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

// Rate limiting configuration: 3 subscription attempts per IP per hour
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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
        getLocalizedRateLimitMessage(locale),
        429,
        { retryAfter }
      );
    }

    // 3. Persist the subscription to Firestore
    const db = getAdminDb();
    const normalizedEmail = validatedData.email.toLowerCase();

    // Check for duplicate subscription
    const existingDoc = await db
      .collection('newsletter_subscribers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existingDoc.empty) {
      // Already subscribed, return 201 anyway to be user-friendly
      const message =
        locale === 'ar'
          ? 'شكراً لاشتراكك! ستتلقى آخر المستجدات والأخبار قريباً.'
          : "You're subscribed! You'll receive our latest updates and news soon.";

      const response = NextResponse.json(
        { success: true, data: { subscribed: true, message, alreadySubscribed: true } },
        { status: 201, headers }
      );
      return response;
    }

    // Add new subscriber
    try {
      await db.collection('newsletter_subscribers').add({
        email: normalizedEmail,
        locale,
        subscribedAt: Timestamp.now(),
        source: 'website',
      });
    } catch (writeError) {
      logServerError('newsletter-api', 'Firestore write failed', writeError);
      return createErrorResponse(
        'INTERNAL_ERROR',
        'Subscription service temporarily unavailable. Please try again later.',
        503
      );
    }

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
