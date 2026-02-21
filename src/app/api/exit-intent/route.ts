import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { checkRateLimit, getClientIP, setRateLimitHeaders } from '@/lib/utils/rate-limit';
import {
  createErrorResponse,
  createSuccessResponse,
  hashIP,
} from '@/lib/utils/api-helpers';
import { saveLeadToFirestore, saveExitIntentCapture } from '@/lib/firebase/collections';
import { exitIntentFormSchema } from '@/lib/utils/validators';
import { logServerError } from '@/lib/firebase/error-logging';

// Rate limiting configuration
const RATE_LIMIT = 1;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour (session-based per IP)

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = exitIntentFormSchema.parse(body);

    // 2. Rate limiting (1 per session per IP)
    const clientIP = getClientIP(request);
    const rateLimitKey = `exit-intent:${hashIP(clientIP)}`;
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT, RATE_LIMIT_WINDOW);

    // Set rate limit headers
    const headers = new Headers();
    setRateLimitHeaders(headers, rateLimitResult);

    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'RATE_LIMITED',
        'Exit intent already captured for this session.',
        429
      );
    }

    // 3. Save to Firestore
    const locale = (body.locale === 'ar' ? 'ar' : 'en') as 'en' | 'ar';
    let leadId = '';

    // Save lead if phone or email is provided
    if (validatedData.phone) {
      leadId = await saveLeadToFirestore({
        phone: validatedData.phone,
        name: '',
        email: validatedData.email || null,
        whatsapp: false,
        source: 'exit-intent',
        locale: locale,
        projectType: validatedData.projectType,
        metadata: {
          ipCountry: undefined,
        },
      });
    } else if (validatedData.email) {
      leadId = await saveLeadToFirestore({
        phone: '',
        name: '',
        email: validatedData.email,
        whatsapp: false,
        source: 'exit-intent',
        locale: locale,
        projectType: validatedData.projectType,
        metadata: {
          ipCountry: undefined,
        },
      });
    }

    // Save exit intent capture
    await saveExitIntentCapture({
      leadId: leadId || 'anonymous',
      variant: validatedData.variant,
      email: validatedData.email || undefined,
      phone: validatedData.phone || undefined,
      projectType: validatedData.projectType || null,
      page: validatedData.sourcePage,
    });

    // 4. Return success response
    const response = createSuccessResponse({
      captured: true,
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
    logServerError('exit-intent-api', 'Unexpected error in exit intent handler', error);

    // Return generic error
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to capture exit intent. Please try again.',
      500
    );
  }
}
