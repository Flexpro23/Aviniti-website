// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 9,
    resetAt: new Date(Date.now() + 3_600_000),
    limit: 10,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../revalidate/route';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { revalidatePath } from 'next/cache';

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const VALID_SECRET = 'test-secret';

// ── Tests ──

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.REVALIDATE_SECRET = VALID_SECRET;

    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 9,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 10,
    });
  });

  it('returns 200 with revalidated:true when the secret matches', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, type: 'blog' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.revalidated).toBe(true);
    expect(json.paths).toContain('/en/blog');
    expect(json.paths).toContain('/ar/blog');
    expect(json.timestamp).toBeDefined();
  });

  it('returns 401 when the secret does not match', async () => {
    const res = await POST(makeRequest({ secret: 'wrong-secret', type: 'blog' }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBeDefined();
  });

  it('returns 401 when REVALIDATE_SECRET env var is not set', async () => {
    delete process.env.REVALIDATE_SECRET;

    const res = await POST(makeRequest({ secret: VALID_SECRET, type: 'blog' }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when the type field is missing', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when type is not "blog"', async () => {
    const res = await POST(makeRequest({ secret: VALID_SECRET, type: 'page' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('revalidates slug-specific paths when a slug is provided', async () => {
    const slug = 'how-ai-transforms-startups';
    const res = await POST(makeRequest({ secret: VALID_SECRET, type: 'blog', slug }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith(`/en/blog/${slug}`);
    expect(revalidatePath).toHaveBeenCalledWith(`/ar/blog/${slug}`);
    expect(json.paths).toContain(`/en/blog/${slug}`);
  });

  it('returns 429 when rate limited', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 10,
    });

    const res = await POST(makeRequest({ secret: VALID_SECRET, type: 'blog' }));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toBeDefined();
  });
});
