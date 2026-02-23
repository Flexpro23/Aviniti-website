// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──

vi.mock('@/lib/gemini/client', () => ({
  generateJsonContent: vi.fn(),
}));

vi.mock('@/lib/gemini/prompts', () => ({
  buildAnalyzeIdeaPrompt: vi.fn().mockReturnValue('mock analyze prompt'),
  buildEstimatePrompt: vi.fn().mockReturnValue('mock estimate prompt'),
  buildChatbotSystemPrompt: vi.fn().mockReturnValue('mock chatbot prompt'),
  buildAnalyzerPrompt: vi.fn().mockReturnValue('mock analyzer prompt'),
  buildROIPromptV2: vi.fn().mockReturnValue('mock roi prompt'),
  buildGenerateFeaturesPrompt: vi.fn().mockReturnValue('mock features prompt'),
}));

vi.mock('@/lib/gemini/schemas', () => ({
  generateFeaturesAISchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        mustHave: [
          { catalogId: 'auth-email-password', reason: 'Core authentication needed' },
        ],
        enhancements: [
          { catalogId: 'unknown-feature-xyz', reason: 'Nice to have' },
        ],
      },
    }),
  },
}));

vi.mock('@/lib/data/feature-catalog', () => ({
  getFeatureById: vi.fn((id: string) =>
    id === 'auth-email-password'
      ? { id: 'auth-email-password', name: 'Email Auth', price: 400, timelineDays: 3 }
      : null
  ),
  buildCompressedCatalog: vi.fn().mockReturnValue('catalog-string'),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
  logServerWarning: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 14,
    resetAt: new Date(Date.now() + 60 * 60 * 1000),
    limit: 15,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../ai/generate-features/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { generateFeaturesAISchema } from '@/lib/gemini/schemas';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

const mockAISchemaData = {
  mustHave: [
    { catalogId: 'auth-email-password', reason: 'Core authentication needed' },
  ],
  enhancements: [
    { catalogId: 'unknown-feature-xyz', reason: 'Nice to have' },
  ],
};

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/ai/generate-features', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  projectType: 'mobile',
  description: 'A food delivery app for restaurants',
  answers: { q1: true, q2: false },
  questions: [{ id: 'q1', question: 'Real-time tracking?', context: 'GPS tracking' }],
};

// ── Tests ──

describe('POST /api/ai/generate-features', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 14,
      resetAt: new Date(Date.now() + 60 * 60 * 1000),
      limit: 15,
    });

    mockGenerateJsonContent.mockResolvedValue({
      success: true,
      data: mockAISchemaData,
      text: JSON.stringify(mockAISchemaData),
    });

    vi.mocked(generateFeaturesAISchema.safeParse).mockReturnValue({
      success: true,
      data: mockAISchemaData,
    });
  });

  it('returns 200 with mustHave, enhancements, catalogMatchCount for valid request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.mustHave).toBeDefined();
    expect(json.data.enhancements).toBeDefined();
    expect(typeof json.data.catalogMatchCount).toBe('number');
  });

  it('returns 400 when description is too short (9 chars)', async () => {
    const res = await POST(makeRequest({ ...validBody, description: 'Too short' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when questions array is empty', async () => {
    const res = await POST(makeRequest({ ...validBody, questions: [] }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 60 * 60 * 1000),
      limit: 15,
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('RATE_LIMITED');
  });

  it('returns 503 when generateJsonContent fails', async () => {
    mockGenerateJsonContent.mockResolvedValue({
      success: false,
      text: '',
      error: 'Gemini API error',
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  it('returns 503 when generateFeaturesAISchema.safeParse returns success:false', async () => {
    vi.mocked(generateFeaturesAISchema.safeParse).mockReturnValue({
      success: false,
      error: {
        message: 'Invalid AI response structure',
        issues: [{ path: ['mustHave'], message: 'Required' }],
      },
    } as ReturnType<typeof generateFeaturesAISchema.safeParse>);

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  it('unknown catalogId features get fallback data with price:0; known IDs count toward catalogMatchCount', async () => {
    // AI returns one known ID (auth-email-password) and one unknown (unknown-feature-xyz)
    // getFeatureById mock returns null for unknown-feature-xyz → fallback with price:0
    // catalogMatchCount should be 1 (only the known feature matched)

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    // catalogMatchCount counts only catalog-matched features
    expect(json.data.catalogMatchCount).toBe(1);

    // Known feature (auth-email-password) gets real catalog price
    expect(json.data.mustHave[0].price).toBe(400);

    // Unknown feature (unknown-feature-xyz) gets fallback price of 0
    expect(json.data.enhancements[0].price).toBe(0);
  });
});
