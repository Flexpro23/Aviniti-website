import { describe, it, expect } from 'vitest';
import { getClientIP, setRateLimitHeaders } from '../rate-limit';
import type { RateLimitResult } from '../rate-limit';

// ============================================================
// Helpers
// ============================================================

function makeRequest(headers: Record<string, string> = {}): Request {
  const h = new Headers(headers);
  return new Request('https://example.com/api/test', { method: 'POST', headers: h });
}

function makeAllowedResult(overrides: Partial<RateLimitResult> = {}): RateLimitResult {
  return {
    allowed: true,
    remaining: 9,
    limit: 10,
    resetAt: new Date(Date.now() + 60_000),
    ...overrides,
  };
}

function makeBlockedResult(overrides: Partial<RateLimitResult> = {}): RateLimitResult {
  return {
    allowed: false,
    remaining: 0,
    limit: 10,
    resetAt: new Date(Date.now() + 30_000),
    ...overrides,
  };
}

// ============================================================
// getClientIP
// ============================================================

describe('getClientIP', () => {
  it('returns x-real-ip when set', () => {
    const request = makeRequest({ 'x-real-ip': '1.2.3.4' });
    expect(getClientIP(request)).toBe('1.2.3.4');
  });

  it('returns the first IP from a comma-separated x-forwarded-for header', () => {
    const request = makeRequest({ 'x-forwarded-for': '10.0.0.1, 172.16.0.1, 192.168.0.1' });
    expect(getClientIP(request)).toBe('10.0.0.1');
  });

  it('returns cf-connecting-ip when set', () => {
    const request = makeRequest({ 'cf-connecting-ip': '5.6.7.8' });
    expect(getClientIP(request)).toBe('5.6.7.8');
  });

  it('returns fastly-client-ip when set', () => {
    const request = makeRequest({ 'fastly-client-ip': '9.10.11.12' });
    expect(getClientIP(request)).toBe('9.10.11.12');
  });

  it('returns x-client-ip when set', () => {
    const request = makeRequest({ 'x-client-ip': '13.14.15.16' });
    expect(getClientIP(request)).toBe('13.14.15.16');
  });

  it('returns x-cluster-client-ip when set', () => {
    const request = makeRequest({ 'x-cluster-client-ip': '17.18.19.20' });
    expect(getClientIP(request)).toBe('17.18.19.20');
  });

  it('returns the forwarded header value (first segment)', () => {
    const request = makeRequest({ 'forwarded': '21.22.23.24, 25.26.27.28' });
    expect(getClientIP(request)).toBe('21.22.23.24');
  });

  it('returns "unknown" when no IP headers are set', () => {
    const request = makeRequest({});
    expect(getClientIP(request)).toBe('unknown');
  });

  it('trims whitespace from the extracted IP', () => {
    // x-forwarded-for with extra spaces around the first IP
    const request = makeRequest({ 'x-forwarded-for': '  192.0.2.1  , 203.0.113.5' });
    expect(getClientIP(request)).toBe('192.0.2.1');
  });

  it('prefers x-real-ip over x-forwarded-for when both are present', () => {
    // x-real-ip appears first in the header priority list
    const request = makeRequest({
      'x-real-ip': '1.1.1.1',
      'x-forwarded-for': '2.2.2.2, 3.3.3.3',
    });
    expect(getClientIP(request)).toBe('1.1.1.1');
  });

  it('falls through to the next header when the first is absent', () => {
    // x-real-ip absent, x-forwarded-for present → should return x-forwarded-for value
    const request = makeRequest({ 'x-forwarded-for': '4.4.4.4' });
    expect(getClientIP(request)).toBe('4.4.4.4');
  });
});

// ============================================================
// setRateLimitHeaders
// ============================================================

describe('setRateLimitHeaders', () => {
  it('sets X-RateLimit-Limit header when allowed', () => {
    const headers = new Headers();
    const result = makeAllowedResult({ limit: 10 });
    setRateLimitHeaders(headers, result);
    expect(headers.get('X-RateLimit-Limit')).toBe('10');
  });

  it('sets X-RateLimit-Remaining header when allowed', () => {
    const headers = new Headers();
    const result = makeAllowedResult({ remaining: 7 });
    setRateLimitHeaders(headers, result);
    expect(headers.get('X-RateLimit-Remaining')).toBe('7');
  });

  it('sets X-RateLimit-Reset header as a Unix timestamp in seconds', () => {
    const resetAt = new Date(1_700_000_000_000); // fixed ms timestamp
    const headers = new Headers();
    setRateLimitHeaders(headers, makeAllowedResult({ resetAt }));
    const expected = Math.floor(resetAt.getTime() / 1000).toString();
    expect(headers.get('X-RateLimit-Reset')).toBe(expected);
  });

  it('sets all 3 standard rate-limit headers when the request is allowed', () => {
    const headers = new Headers();
    setRateLimitHeaders(headers, makeAllowedResult());
    expect(headers.get('X-RateLimit-Limit')).not.toBeNull();
    expect(headers.get('X-RateLimit-Remaining')).not.toBeNull();
    expect(headers.get('X-RateLimit-Reset')).not.toBeNull();
  });

  it('does NOT set Retry-After header when the request is allowed', () => {
    const headers = new Headers();
    setRateLimitHeaders(headers, makeAllowedResult());
    expect(headers.get('Retry-After')).toBeNull();
  });

  it('sets Retry-After header when the request is not allowed', () => {
    const headers = new Headers();
    const resetAt = new Date(Date.now() + 45_000); // resets in 45 seconds
    setRateLimitHeaders(headers, makeBlockedResult({ resetAt }));
    const retryAfter = headers.get('Retry-After');
    expect(retryAfter).not.toBeNull();
    const seconds = parseInt(retryAfter!, 10);
    expect(seconds).toBeGreaterThan(0);
    expect(seconds).toBeLessThanOrEqual(45);
  });

  it('sets all 4 headers (including Retry-After) when the request is blocked', () => {
    const headers = new Headers();
    setRateLimitHeaders(headers, makeBlockedResult());
    expect(headers.get('X-RateLimit-Limit')).not.toBeNull();
    expect(headers.get('X-RateLimit-Remaining')).not.toBeNull();
    expect(headers.get('X-RateLimit-Reset')).not.toBeNull();
    expect(headers.get('Retry-After')).not.toBeNull();
  });

  it('sets X-RateLimit-Remaining to "0" when blocked', () => {
    const headers = new Headers();
    setRateLimitHeaders(headers, makeBlockedResult({ remaining: 0 }));
    expect(headers.get('X-RateLimit-Remaining')).toBe('0');
  });

  it('sets Retry-After as a positive integer string when blocked', () => {
    const headers = new Headers();
    const resetAt = new Date(Date.now() + 60_000);
    setRateLimitHeaders(headers, makeBlockedResult({ resetAt }));
    const retryAfter = headers.get('Retry-After');
    expect(retryAfter).toMatch(/^\d+$/);
    expect(parseInt(retryAfter!, 10)).toBeGreaterThan(0);
  });
});
