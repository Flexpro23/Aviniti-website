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
import { POST } from '../ai/analyze-idea/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

const mockAIData = {
  summary: 'Great idea',
  questions: [{ id: 'q1', question: 'Who?', context: 'audience' }],
};

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/ai/analyze-idea', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  projectType: 'mobile',
  description: 'A food delivery app for restaurants in Amman',
};

// ── Tests ──

describe('POST /api/ai/analyze-idea', () => {
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
      data: mockAIData,
      text: JSON.stringify(mockAIData),
    });
  });

  it('returns 200 with AI data for valid request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.summary).toBe('Great idea');
    expect(json.data.questions).toHaveLength(1);
  });

  it('returns 400 when description is too short (9 chars)', async () => {
    const res = await POST(makeRequest({ ...validBody, description: 'Too short' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when projectType is invalid', async () => {
    const res = await POST(makeRequest({ ...validBody, projectType: 'blockchain' }));
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

  it('returns 503 when generateJsonContent fails (no retry — single attempt only)', async () => {
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
    // Route does NOT retry — exactly one attempt
    expect(mockGenerateJsonContent).toHaveBeenCalledTimes(1);
  });

  it('accepts all valid projectType values', async () => {
    const validTypes = ['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const;

    for (const projectType of validTypes) {
      mockGenerateJsonContent.mockResolvedValue({
        success: true,
        data: mockAIData,
        text: JSON.stringify(mockAIData),
      });

      const res = await POST(makeRequest({ ...validBody, projectType }));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    }

    expect(mockGenerateJsonContent).toHaveBeenCalledTimes(validTypes.length);
  });
});
