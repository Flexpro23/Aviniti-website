// Simple in-memory rate limiter
// For production, consider using Redis or Upstash for distributed rate limiting

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit records
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup old records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier for the rate limit (typically IP address or session ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No record or record expired - create new one
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: new Date(resetAt),
      limit,
    };
  }

  // Record exists and is valid
  if (record.count < limit) {
    // Within limit - increment counter
    record.count++;
    rateLimitStore.set(identifier, record);

    return {
      allowed: true,
      remaining: limit - record.count,
      resetAt: new Date(record.resetAt),
      limit,
    };
  }

  // Limit exceeded
  return {
    allowed: false,
    remaining: 0,
    resetAt: new Date(record.resetAt),
    limit,
  };
}

/**
 * Get client IP address from request
 * Handles various proxy headers
 */
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'fastly-client-ip', // Fastly
    'x-client-ip',
    'x-cluster-client-ip',
    'forwarded',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first
      const ip = value.split(',')[0].trim();
      if (ip) return ip;
    }
  }

  // Fallback to a default (should not happen in production)
  return 'unknown';
}

/**
 * Set rate limit headers on response
 */
export function setRateLimitHeaders(
  headers: Headers,
  result: RateLimitResult
): void {
  headers.set('X-RateLimit-Limit', result.limit.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set(
    'X-RateLimit-Reset',
    Math.floor(result.resetAt.getTime() / 1000).toString()
  );

  if (!result.allowed) {
    const retryAfter = Math.ceil(
      (result.resetAt.getTime() - Date.now()) / 1000
    );
    headers.set('Retry-After', retryAfter.toString());
  }
}
