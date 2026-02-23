// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Hoisted mock state ──
// vi.mock factories are hoisted before variable declarations, so all shared
// mock functions must be created with vi.hoisted() to avoid TDZ errors.

const { mockAdd, mockGet, mockLimit, mockWhere, mockCollection } = vi.hoisted(() => {
  const mockAdd = vi.fn().mockResolvedValue({ id: 'sub-123' });
  const mockGet = vi.fn().mockResolvedValue({ empty: true, docs: [] });
  const mockLimit = vi.fn().mockReturnValue({ get: mockGet });
  const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
  const mockCollection = vi.fn().mockReturnValue({ where: mockWhere, add: mockAdd });
  return { mockAdd, mockGet, mockLimit, mockWhere, mockCollection };
});

// ── Mocks ──

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 2,
    resetAt: new Date(Date.now() + 3_600_000),
    limit: 3,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => ({
  Timestamp: { now: () => ({ seconds: Date.now() / 1000 }) },
}));

vi.mock('@/lib/firebase/admin', () => ({
  getAdminDb: vi.fn().mockReturnValue({ collection: mockCollection }),
}));

// ── Subject under test ──
import { POST } from '../newsletter/route';
import { checkRateLimit } from '@/lib/utils/rate-limit';

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// ── Tests ──

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Restore default mock implementations after clearAllMocks resets them
    vi.mocked(checkRateLimit).mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date(Date.now() + 3_600_000),
      limit: 3,
    });
    mockAdd.mockResolvedValue({ id: 'sub-123' });
    mockGet.mockResolvedValue({ empty: true, docs: [] });
    mockLimit.mockReturnValue({ get: mockGet });
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockCollection.mockReturnValue({ where: mockWhere, add: mockAdd });
  });

  it('returns 201 with subscribed:true for a valid email', async () => {
    const res = await POST(makeRequest({ email: 'user@example.com' }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.subscribed).toBe(true);
    expect(json.data.alreadySubscribed).toBeUndefined();
  });

  it('returns 201 with alreadySubscribed:true if email is already in the DB', async () => {
    // Simulate a non-empty Firestore query result
    mockGet.mockResolvedValueOnce({ empty: false, docs: [{ id: 'existing-doc' }] });

    const res = await POST(makeRequest({ email: 'existing@example.com' }));
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.alreadySubscribed).toBe(true);
    // Should NOT have written a new document
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid email address', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when email is missing from the request body', async () => {
    const res = await POST(makeRequest({}));
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

    const res = await POST(makeRequest({ email: 'user@example.com' }));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toBeDefined();
  });

  it('normalizes email to lowercase before storing it', async () => {
    await POST(makeRequest({ email: 'User@EXAMPLE.COM' }));

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'user@example.com' })
    );
  });
});
