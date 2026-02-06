// Shared helper functions for API routes

import { NextResponse } from 'next/server';
import type { ApiErrorResponse, ErrorCode } from '@/types/api';
import crypto from 'crypto';

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
 * Sanitize user input (trim whitespace, limit length)
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  let sanitized = input.trim();
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}
