// Rate limiter with Upstash Redis for production, in-memory fallback for local dev
// Production: Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env
// Local: Uses in-memory Map (resets on cold start — acceptable for dev)

import { Ratelimit, type Duration } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

// In-memory fallback for when Upstash is not configured (local dev)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const inMemoryStore = new Map<string, RateLimitRecord>();

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of inMemoryStore.entries()) {
    if (now > record.resetAt) inMemoryStore.delete(key);
  }
}, 5 * 60 * 1000);

function checkRateLimitInMemory(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    inMemoryStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt: new Date(resetAt), limit };
  }

  if (record.count < limit) {
    record.count++;
    inMemoryStore.set(identifier, record);
    return { allowed: true, remaining: limit - record.count, resetAt: new Date(record.resetAt), limit };
  }

  return { allowed: false, remaining: 0, resetAt: new Date(record.resetAt), limit };
}

// Cache of Upstash limiters per (limit, window) — each route may use different limits
const limiterCache = new Map<string, Ratelimit>();
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  try {
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch {
    return null;
  }
}

function getOrCreateLimiter(limit: number, windowMs: number): Ratelimit | null {
  const cacheKey = `${limit}:${windowMs}`;
  const cached = limiterCache.get(cacheKey);
  if (cached) return cached;

  const redis = getRedisClient();
  if (!redis) return null;

  // Upstash window format: "10 s", "1 h", "24 h"
  const windowSec = Math.ceil(windowMs / 1000);
  const windowStr = (windowSec >= 3600 ? `${Math.ceil(windowSec / 3600)} h` : `${windowSec} s`) as Duration;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, windowStr),
    analytics: false,
  });
  limiterCache.set(cacheKey, limiter);
  return limiter;
}

/**
 * Check if a request is within rate limits.
 * Uses Upstash Redis in production (when env vars set), in-memory fallback otherwise.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const limiter = getOrCreateLimiter(limit, windowMs);

  if (!limiter) {
    return checkRateLimitInMemory(identifier, limit, windowMs);
  }

  try {
    const { success, remaining, reset } = await limiter.limit(identifier);
    return {
      allowed: success,
      remaining,
      resetAt: new Date(reset),
      limit,
    };
  } catch (err) {
    console.warn('[RateLimit] Redis error, falling back to in-memory:', err);
    return checkRateLimitInMemory(identifier, limit, windowMs);
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'x-client-ip',
    'x-cluster-client-ip',
    'forwarded',
  ];
  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      const ip = value.split(',')[0].trim();
      if (ip) return ip;
    }
  }
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
