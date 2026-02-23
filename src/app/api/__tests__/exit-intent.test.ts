// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-456'),
  saveExitIntentCapture: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 0,
    resetAt: new Date(Date.now() + 3_600_000),
    limit: 1,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../exit-intent/route';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { saveLeadToFirestore, saveExitIntentCapture } from '@/lib/firebase/collections';

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/exit-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// Minimal valid body — only required fields
const minimalBody = {
  variant: 'A',
  sourcePage: '/en',
};

// ── Tests ──

describe('POST /api/exit-intent', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 0,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 1,
    });
    vi.mocked(saveLeadToFirestore).mockResolvedValue('lead-456');
    vi.mocked(saveExitIntentCapture).mockResolvedValue(undefined);
  });

  it('returns 200 with captured:true for a variant-only submission (no email or phone)', async () => {
    const res = await POST(makeRequest(minimalBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.captured).toBe(true);
  });

  it('calls saveLeadToFirestore when phone is provided', async () => {
    await POST(makeRequest({ ...minimalBody, phone: '+962790685302' }));

    expect(saveLeadToFirestore).toHaveBeenCalledOnce();
    expect(saveLeadToFirestore).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+962790685302', source: 'exit-intent' })
    );
  });

  it('calls saveLeadToFirestore when only email is provided (no phone)', async () => {
    await POST(makeRequest({ ...minimalBody, email: 'visitor@example.com' }));

    expect(saveLeadToFirestore).toHaveBeenCalledOnce();
    expect(saveLeadToFirestore).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'visitor@example.com', source: 'exit-intent' })
    );
  });

  it('does NOT call saveLeadToFirestore when neither email nor phone is provided', async () => {
    await POST(makeRequest(minimalBody));

    expect(saveLeadToFirestore).not.toHaveBeenCalled();
    // But the capture itself is still saved
    expect(saveExitIntentCapture).toHaveBeenCalledOnce();
  });

  it('returns 429 when rate limited', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 1,
    });

    const res = await POST(makeRequest(minimalBody));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toBeDefined();
  });

  it('returns 400 for an invalid variant value (Z is not in A-E)', async () => {
    const res = await POST(makeRequest({ ...minimalBody, variant: 'Z' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 400 for an invalid email format', async () => {
    const res = await POST(makeRequest({ ...minimalBody, email: 'not-an-email' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });
});
