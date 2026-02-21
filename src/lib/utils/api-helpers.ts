// Shared helper functions for API routes

import { NextResponse } from 'next/server';
import type { ApiErrorResponse, ErrorCode } from '@/types/api';
import crypto from 'crypto';
import enErrors from '../../../messages/en/errors.json';
import arErrors from '../../../messages/ar/errors.json';

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  options?: {
    retryAfter?: number;
    suggestion?: string;
  }
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(options?.retryAfter && { retryAfter: options.retryAfter }),
        ...(options?.suggestion && { suggestion: options.suggestion }),
      },
    },
    { status }
  );
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): NextResponse {
  return NextResponse.json({
    success: true,
    data,
  });
}

/**
 * Hash IP address for privacy-compliant storage
 * Uses SHA-256 to create a deterministic but non-reversible hash
 */
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Generate a unique ticket ID
 * Format: AVN-XXXXXX (6 random alphanumeric characters)
 */
export function generateTicketId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar-looking chars
  let id = 'AVN-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Extract metadata from request for analytics
 */
export function extractRequestMetadata(request: Request) {
  const userAgent = request.headers.get('user-agent') || undefined;
  const referrer = request.headers.get('referer') || undefined;

  // Extract UTM parameters from referer URL if present
  let utmSource: string | undefined;
  let utmMedium: string | undefined;
  let utmCampaign: string | undefined;

  if (referrer) {
    try {
      const url = new URL(referrer);
      utmSource = url.searchParams.get('utm_source') || undefined;
      utmMedium = url.searchParams.get('utm_medium') || undefined;
      utmCampaign = url.searchParams.get('utm_campaign') || undefined;
    } catch {
      // Invalid URL, ignore
    }
  }

  return {
    userAgent,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

/**
 * Get the current locale from request
 * Falls back to 'en' if not specified
 */
export function getLocaleFromRequest(locale?: string): 'en' | 'ar' {
  if (locale === 'ar') return 'ar';
  return 'en';
}

/**
 * Detect the language of user input text.
 * Returns 'ar' if Arabic characters make up > 30% of alphabetic chars, else 'en'.
 */
export function detectInputLanguage(text: string): 'en' | 'ar' {
  if (!text || text.trim().length === 0) return 'en';

  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
  const latinPattern = /[a-zA-Z]/g;

  const arabicMatches = text.match(arabicPattern);
  const latinMatches = text.match(latinPattern);

  const arabicCount = arabicMatches ? arabicMatches.length : 0;
  const latinCount = latinMatches ? latinMatches.length : 0;
  const totalAlpha = arabicCount + latinCount;

  if (totalAlpha === 0) return 'en';
  return arabicCount / totalAlpha > 0.3 ? 'ar' : 'en';
}

/**
 * Sanitize simple user input (trim and optionally truncate).
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  let result = input.trim();
  if (maxLength !== undefined && result.length > maxLength) {
    result = result.substring(0, maxLength);
  }
  return result;
}

/**
 * Sanitize user input before inserting into AI prompts.
 * Strips common prompt injection patterns and enforces length limits.
 */
export function sanitizePromptInput(input: string, maxLength: number = 2000): string {
  let sanitized = input.trim();

  // Remove common prompt injection patterns
  sanitized = sanitized
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[SYSTEM\]/gi, '')
    .replace(/\[INSTRUCTIONS?\]/gi, '')
    .replace(/\[IGNORE\]/gi, '')
    .replace(/\[ASSISTANT\]/gi, '')
    .replace(/\[USER\]/gi, '')
    .replace(/<\/?system>/gi, '')
    .replace(/<\/?instructions?>/gi, '')
    .replace(/<\/?prompt>/gi, '');

  // Escape angle brackets to prevent XML/HTML injection in prompts
  sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Return the localized rate-limit error message for a given locale.
 * API routes cannot use the next-intl useTranslations hook, so we load the
 * JSON translation files directly.  Falls back to the English message when the
 * locale is not 'ar', and falls back to a hard-coded string when the key is
 * absent (should never happen in practice).
 */
export function getLocalizedRateLimitMessage(locale: string): string {
  const messages = locale === 'ar' ? arErrors : enErrors;
  return messages.api?.rate_limit ?? 'Too many requests. Please try again later.';
}
