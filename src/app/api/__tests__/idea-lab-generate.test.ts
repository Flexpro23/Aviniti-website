// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

// ── Mocks ──
// vi.mock factories are hoisted to the top of the file by Vitest's transform.
// Any variables referenced inside a factory MUST be defined inside it (no
// references to top-level let/const that are initialised after the hoist point).

vi.mock('@/lib/gemini/client', () => ({
  generateJsonContent: vi.fn(),
}));

vi.mock('@/lib/gemini/prompts/idea-lab', () => ({
  buildIdeaLabPrompt: vi.fn().mockReturnValue('mock idea-lab prompt'),
}));

vi.mock('@/lib/gemini/schemas', () => ({
  ideaLabResponseSchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        ideaName: 'OrderFlow',
        tagline: 'Streamline every order, delight every customer',
        elevator_pitch:
          'OrderFlow is an AI-powered restaurant order management platform that reduces wait times by 40% through intelligent routing and real-time kitchen coordination.',
        targetUsers: [
          { segment: 'Restaurant Owners', description: 'Owners managing 1-5 locations', size: 'medium' },
          { segment: 'Kitchen Staff', description: 'Cooks and expeditors needing clarity', size: 'large' },
        ],
        features: [
          { name: 'Smart Order Routing', description: 'AI assigns orders to optimal stations', priority: 'must-have', complexity: 'medium' },
          { name: 'Real-time Dashboard', description: 'Live view of all active orders', priority: 'must-have', complexity: 'low' },
        ],
        benefits: ['40% faster order fulfillment', 'Reduced kitchen errors by 60%'],
        impactMetrics: [
          { metric: 'Order Processing Time', value: '-40%', description: 'Faster throughput per order' },
        ],
        nextSteps: [
          { step: 1, action: 'Define MVP feature set', timeframe: 'Week 1', description: 'Focus on core routing logic' },
          { step: 2, action: 'Design kitchen display mockups', timeframe: 'Week 2', description: 'Validate with chef interviews' },
        ],
      },
    }),
  },
}));

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-idea-1'),
  saveAISubmission: vi.fn().mockResolvedValue(undefined),
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
    resetAt: new Date(Date.now() + 86_400_000),
    limit: 6,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../ai/idea-lab/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { ideaLabResponseSchema } from '@/lib/gemini/schemas';
import { saveLeadToFirestore } from '@/lib/firebase/collections';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockSaveLeadToFirestore = vi.mocked(saveLeadToFirestore);

// ── Helper: build a valid POST request ──
function makeRequest(body: Record<string, unknown>, extraHeaders: Record<string, string> = {}): NextRequest {
  return new Request('http://localhost/api/ai/idea-lab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  persona: 'small-business',
  industry: 'food-restaurant',
  discoveryAnswers: [
    { questionId: 'q1', questionText: 'What problem do you solve?', answer: 'Managing orders efficiently' },
    { questionId: 'q2', questionText: 'Who is your target user?', answer: 'Restaurant owners and managers' },
    { questionId: 'q3', questionText: 'What is unique about your idea?', answer: 'AI-powered order routing and delivery optimization' },
  ],
  name: 'Ali Odat',
  phone: '+962790685302',
  whatsapp: false,
  locale: 'en',
};

describe('POST /api/ai/idea-lab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default successful mocks after clearAllMocks resets them
    mockGenerateJsonContent.mockResolvedValue({
      success: true,
      data: { ideaName: 'OrderFlow' },
    });
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 5,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 6,
    });
    (ideaLabResponseSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
      data: {
        ideaName: 'OrderFlow',
        tagline: 'Streamline every order, delight every customer',
        elevator_pitch: 'AI-powered restaurant order management platform.',
        targetUsers: [],
        features: [],
        benefits: ['40% faster order fulfillment'],
        impactMetrics: [],
        nextSteps: [],
      },
    });
    mockSaveLeadToFirestore.mockResolvedValue('lead-idea-1');
  });

  // ── Test 1: Happy path ──
  it('returns 200 with idea data for a valid request', async () => {
    const req = makeRequest(validBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      ideaName: expect.any(String),
      tagline: expect.any(String),
    });
  });

  // ── Test 2: Payload too large ──
  it('returns 413 when content-length exceeds 100 KiB', async () => {
    const req = makeRequest(validBody, { 'content-length': String(101 * 1024) });
    const res = await POST(req);

    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  // ── Test 3: discoveryAnswers has fewer than 3 items ──
  it('returns 400 when discoveryAnswers has fewer than 3 items', async () => {
    const req = makeRequest({
      ...validBody,
      discoveryAnswers: [
        { questionId: 'q1', questionText: 'What problem?', answer: 'Managing orders' },
        { questionId: 'q2', questionText: 'Who is your user?', answer: 'Restaurant owners' },
      ],
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 4: name missing ──
  it('returns 400 when name is missing from the request body', async () => {
    const { name: _omitted, ...bodyWithoutName } = validBody;
    const req = makeRequest(bodyWithoutName);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 5: Rate limited ──
  it('returns 429 when the rate limit is exceeded', async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 6,
    });

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('RATE_LIMITED');
  });

  // ── Test 6: AI service fails ──
  it('returns 503 when generateJsonContent returns success:false', async () => {
    // Route has MAX_AI_ATTEMPTS=2 — fail all attempts
    mockGenerateJsonContent.mockResolvedValue({
      success: false,
      error: 'Gemini service unavailable',
      data: undefined,
    });

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  // ── Test 7: AI response schema validation fails ──
  it('returns 503 when ideaLabResponseSchema.safeParse returns success:false', async () => {
    (ideaLabResponseSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
      success: false,
      error: {
        message: 'Missing required field: ideaName',
        issues: [{ path: ['ideaName'], message: 'Required' }],
      },
    });

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  // ── Test 8: Firestore save failure is non-blocking ──
  it('returns 200 even when Firestore save throws', async () => {
    mockSaveLeadToFirestore.mockRejectedValueOnce(new Error('Firestore write failed'));

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
