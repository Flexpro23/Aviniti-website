// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks (must be hoisted before imports that pull in the mocked modules) ──

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-123'),
  saveContactSubmission: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 2,
    resetAt: new Date(Date.now() + 60_000),
    limit: 3,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../contact/route';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { saveLeadToFirestore } from '@/lib/firebase/collections';

// ── Helpers ──

function makeRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  name: 'Ali Odat',
  phone: '+962790685302',
  topic: 'project',
  message: 'I need a mobile app built for my business.',
  whatsapp: false,
};

// ── Tests ──

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Re-apply default mock implementations after clearAllMocks resets them
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date(Date.now() + 60_000),
      limit: 3,
    });
    vi.mocked(saveLeadToFirestore).mockResolvedValue('lead-123');
  });

  it('returns 200 with ticketId and English message for valid EN request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.ticketId).toMatch(/^AVN-[A-Z0-9]{6}$/);
    expect(json.data.message).toContain('Thank you');
  });

  it('returns 200 with Arabic message when locale="ar" is provided in body', async () => {
    const res = await POST(makeRequest({ ...validBody, locale: 'ar' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.message).toContain('شكراً');
  });

  it('returns 400 when name is missing', async () => {
    const { name: _omit, ...bodyWithoutName } = validBody;
    const res = await POST(makeRequest(bodyWithoutName));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when message is too short (< 10 chars)', async () => {
    const res = await POST(makeRequest({ ...validBody, message: 'Hi' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when topic is invalid', async () => {
    const res = await POST(makeRequest({ ...validBody, topic: 'unknown-topic' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 429 when rate limited', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 3,
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toBeDefined();
  });

  it('returns 500 when saveLeadToFirestore throws', async () => {
    vi.mocked(saveLeadToFirestore).mockRejectedValueOnce(new Error('Firestore unavailable'));

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBeDefined();
  });

  it('ticketId matches /^AVN-[A-Z0-9]{6}$/', async () => {
    const results = await Promise.all(
      Array.from({ length: 10 }, () => POST(makeRequest(validBody)))
    );

    for (const res of results) {
      const json = await res.json();
      expect(json.data.ticketId).toMatch(/^AVN-[A-Z0-9]{6}$/);
    }
  });
});
