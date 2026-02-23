// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──

vi.mock('@/lib/gemini/client', () => ({
  generateContent: vi.fn().mockResolvedValue({
    success: true,
    text: 'Hello! We offer AI development services.',
    processingTimeMs: 200,
  }),
  generateJsonContent: vi.fn(), // not used by chat but mock to avoid import errors
}));

vi.mock('@/lib/gemini/prompts', () => ({
  buildChatbotSystemPrompt: vi.fn().mockReturnValue("You are Avi, Aviniti's AI assistant."),
  buildAnalyzeIdeaPrompt: vi.fn(),
  buildEstimatePrompt: vi.fn(),
  buildAnalyzerPrompt: vi.fn(),
  buildROIPromptV2: vi.fn(),
  buildGenerateFeaturesPrompt: vi.fn(),
}));

vi.mock('@/lib/firebase/collections', () => ({
  saveChatMessage: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
  logServerWarning: vi.fn(),
}));

vi.mock('@/lib/utils/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 29,
    resetAt: new Date(Date.now() + 60 * 60 * 1000),
    limit: 30,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../chat/route';
import { generateContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { saveChatMessage } from '@/lib/firebase/collections';

const mockGenerateContent = vi.mocked(generateContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);

// ── Helpers ──

function makeRequest(body: unknown): NextRequest {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  message: 'What services do you offer?',
  conversationHistory: [],
  currentPage: '/en/contact',
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
};

// ── Tests ──

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 29,
      resetAt: new Date(Date.now() + 60 * 60 * 1000),
      limit: 30,
    });

    mockGenerateContent.mockResolvedValue({
      success: true,
      text: 'Hello! We offer AI development services.',
      processingTimeMs: 200,
    });

    vi.mocked(saveChatMessage).mockResolvedValue(undefined);
  });

  it('returns 200 with { reply } for valid request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(typeof json.data.reply).toBe('string');
    expect(json.data.reply).toBe('Hello! We offer AI development services.');
  });

  it('returns 400 when message is empty string', async () => {
    const res = await POST(makeRequest({ ...validBody, message: '' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when sessionId is not a valid UUID', async () => {
    const res = await POST(makeRequest({ ...validBody, sessionId: 'not-a-uuid' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when conversationHistory has more than 20 items', async () => {
    const oversizedHistory = Array.from({ length: 21 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
      timestamp: new Date().toISOString(),
    }));

    const res = await POST(makeRequest({ ...validBody, conversationHistory: oversizedHistory }));
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
      limit: 30,
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('RATE_LIMITED');
  });

  it('returns 503 when generateContent fails', async () => {
    mockGenerateContent.mockResolvedValue({
      success: false,
      text: '',
      processingTimeMs: 1000,
      error: 'Gemini API error',
    });

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  it('calls saveChatMessage twice — once for user message, once for assistant response', async () => {
    await POST(makeRequest(validBody));

    expect(vi.mocked(saveChatMessage)).toHaveBeenCalledTimes(2);

    // First call: user message
    expect(vi.mocked(saveChatMessage)).toHaveBeenNthCalledWith(
      1,
      validBody.sessionId,
      expect.objectContaining({ role: 'user' }),
      validBody.currentPage,
      expect.any(String)
    );

    // Second call: assistant response
    expect(vi.mocked(saveChatMessage)).toHaveBeenNthCalledWith(
      2,
      validBody.sessionId,
      expect.objectContaining({ role: 'assistant' }),
      validBody.currentPage,
      expect.any(String)
    );
  });
});
