import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  extractRequestMetadata,
  hashIP,
  generateTicketId,
} from '@/lib/utils/api-helpers';
import { saveLeadToFirestore, saveContactSubmission } from '@/lib/firebase/collections';
import { contactFormSchema } from '@/lib/utils/validators';

// Rate limiting configuration
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitKey = `contact:${hashIP(clientIP)}`;
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
        "You've submitted multiple contact requests recently. Please wait before submitting again, or reach out via WhatsApp for immediate assistance.",
        429,
        { retryAfter }
      );
    }

    // 3. Generate ticket ID
    const ticketId = generateTicketId();
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

    // 4. Save to Firestore
    const metadata = extractRequestMetadata(request);

    // Save lead
    const leadId = await saveLeadToFirestore({
      email: validatedData.email,
      name: validatedData.name,
      company: validatedData.company || null,
      phone: validatedData.phone || null,
      countryCode: validatedData.countryCode || null,
      whatsapp: validatedData.whatsapp,
      source: 'contact',
      locale: locale,
      metadata: {
        ...metadata,
        ipCountry: undefined,
      },
    });

    // Save contact submission
    await saveContactSubmission({
      leadId,
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company || null,
      phone: validatedData.phone || null,
      countryCode: validatedData.countryCode || 'JO',
      topic: validatedData.topic,
      message: validatedData.message,
      whatsapp: validatedData.whatsapp,
    });

    // 5. Return success response
    const response = createSuccessResponse({
      ticketId,
      message: locale === 'ar'
        ? `شكراً لتواصلك! رقم التذكرة الخاص بك هو ${ticketId}. سنرد عليك خلال 24 ساعة.`
        : `Thank you for reaching out! Your ticket ID is ${ticketId}. We'll get back to you within 24 hours.`,
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
    console.error('[Contact API] Error:', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to submit your message. Please try again.',
      500
    );
  }
}
