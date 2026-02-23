// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──

vi.mock('@/lib/gemini/client', () => ({
  generateJsonContent: vi.fn(),
}));

vi.mock('@/lib/gemini/prompts/idea-lab-discover', () => ({
  buildIdeaLabDiscoverPrompt: vi.fn().mockReturnValue('mock discover prompt'),
}));

vi.mock('@/lib/gemini/schemas', () => ({
  ideaLabDiscoverResponseSchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        questions: [
          { id: 'q1', question: 'What problem does your idea solve?', context: 'Understanding core value' },
          { id: 'q2', question: 'Who is your primary customer?', context: 'Target market' },
          { id: 'q3', question: 'How will you make money?', context: 'Revenue model' },
        ],
      },
    }),
  },
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
  logServerWarning: vi.fn(),
  logServerInfo: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 5,
    resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    limit: 6,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../ai/idea-lab/discover/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { ideaLabDiscoverResponseSchema } from '@/lib/gemini/schemas';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

const mockDiscoverData = {
  questions: [
    { id: 'q1', question: 'What problem does your idea solve?', context: 'Understanding core value' },
    { id: 'q2', question: 'Who is your primary customer?', context: 'Target market' },
    { id: 'q3', question: 'How will you make money?', context: 'Revenue model' },
  ],
};

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/ai/idea-lab/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  persona: 'small-business',
  industry: 'food-restaurant',
  locale: 'en',
};

// ── Tests ──

describe('POST /api/ai/idea-lab/discover', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 5,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      limit: 6,
    });

    mockGenerateJsonContent.mockResolvedValue({
      success: true,
      text: JSON.stringify(mockDiscoverData),
      processingTimeMs: 400,
      data: mockDiscoverData,
    });

    vi.mocked(ideaLabDiscoverResponseSchema.safeParse).mockReturnValue({
      success: true,
      data: mockDiscoverData,
    });
  });

  it('returns 200 with discovery questions for valid request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.questions).toHaveLength(3);
    expect(json.data.questions[0].id).toBe('q1');
  });

  it('returns 200 for locale=ar (Arabic locale)', async () => {
    const res = await POST(makeRequest({ ...validBody, locale: 'ar' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.questions).toBeDefined();
  });

  it('returns 400 when persona is missing', async () => {
    const { persona: _persona, ...bodyWithoutPersona } = validBody;
    const res = await POST(makeRequest(bodyWithoutPersona));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when industry is invalid enum value', async () => {
    const res = await POST(makeRequest({ ...validBody, industry: 'not-a-valid-industry' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      limit: 6,
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('RATE_LIMITED');
  });

  it('returns 503 when generateJsonContent fails after all retries', async () => {
    mockGenerateJsonContent.mockResolvedValue({
      success: false,
      text: '',
      processingTimeMs: 1000,
      error: 'AI service unavailable',
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
    // Route retries MAX_AI_ATTEMPTS (2) times before giving up
    expect(mockGenerateJsonContent).toHaveBeenCalledTimes(2);
  });

  it('returns 503 when schema validation fails after all retries', async () => {
    vi.mocked(ideaLabDiscoverResponseSchema.safeParse).mockReturnValue({
      success: false,
      error: {
        issues: [{ path: ['questions'], message: 'Required' }],
      },
    } as ReturnType<typeof ideaLabDiscoverResponseSchema.safeParse>);

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
    // Route retries MAX_AI_ATTEMPTS (2) times before giving up
    expect(mockGenerateJsonContent).toHaveBeenCalledTimes(2);
  });
});
