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

vi.mock('@/lib/gemini/prompts', () => ({
  buildROIPromptV2: vi.fn().mockReturnValue('mock roi prompt'),
}));

vi.mock('@/lib/gemini/schemas', () => ({
  roiResponseSchemaV2: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        executiveSummary: 'Strong ROI potential with clear payback period within the first year.',
        roiProjection: { year1: 150, year3: 420, paybackMonths: 8 },
        automationSavings: {
          annualHours: 2000,
          annualCost: 40000,
          fiveYearValue: 200000,
        },
        revenueOpportunity: {
          monthlyRevenue: 15000,
          annualRevenue: 180000,
          assumptions: ['10% market penetration', '500 monthly active users'],
        },
        competitiveAdvantage: 'First mover advantage in Amman market',
        riskAssessment: {
          level: 'medium',
          factors: ['Market adoption pace', 'Competition from regional players'],
        },
        recommendation: 'Proceed with phased development starting with MVP',
        keyMetrics: [{ label: 'Break-even', value: '8 months', icon: 'clock' }],
        strategicInsights: [],
      },
    }),
  },
}));

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-roi-1'),
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
    remaining: 2,
    resetAt: new Date(Date.now() + 86_400_000),
    limit: 3,
  }),
  getClientIP: vi.fn().mockReturnValue('127.0.0.1'),
  setRateLimitHeaders: vi.fn(),
}));

// ── Subject under test ──
import { POST } from '../ai/roi-calculator/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { roiResponseSchemaV2 } from '@/lib/gemini/schemas';
import { saveLeadToFirestore } from '@/lib/firebase/collections';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockSaveLeadToFirestore = vi.mocked(saveLeadToFirestore);

// ── Helper: build a valid POST request ──
function makeRequest(body: Record<string, unknown>, extraHeaders: Record<string, string> = {}): NextRequest {
  return new Request('http://localhost/api/ai/roi-calculator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validStandaloneBody = {
  mode: 'standalone',
  ideaDescription: 'A food delivery app for restaurants in Amman Jordan connecting customers with local restaurants',
  targetMarket: 'mena',
  name: 'Ali Odat',
  phone: '+962790685302',
  whatsapp: false,
  locale: 'en',
};

const validFromEstimateBody = {
  mode: 'from-estimate',
  projectName: 'DeliveryPro',
  projectSummary: 'A delivery management platform',
  projectType: 'mobile',
  estimatedCost: { min: 10000, max: 15000 },
  estimatedTimeline: { weeks: 12 },
  approach: 'custom',
  features: ['auth-email-password'],
  techStack: ['React Native'],
  strategicInsights: [],
  matchedSolution: null,
  targetMarket: 'mena',
  name: 'Ali Odat',
  phone: '+962790685302',
  whatsapp: false,
  locale: 'en',
};

describe('POST /api/ai/roi-calculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default successful mocks after clearAllMocks resets them
    mockGenerateJsonContent.mockResolvedValue({
      success: true,
      data: { executiveSummary: 'Strong ROI potential' },
    });
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
    });
    (roiResponseSchemaV2.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
      data: {
        executiveSummary: 'Strong ROI potential with clear payback period within the first year.',
        roiProjection: { year1: 150, year3: 420, paybackMonths: 8 },
        automationSavings: { annualHours: 2000, annualCost: 40000, fiveYearValue: 200000 },
        revenueOpportunity: { monthlyRevenue: 15000, annualRevenue: 180000, assumptions: [] },
        competitiveAdvantage: 'First mover advantage in Amman market',
        riskAssessment: { level: 'medium', factors: [] },
        recommendation: 'Proceed with phased development starting with MVP',
        keyMetrics: [],
        strategicInsights: [],
      },
    });
    mockSaveLeadToFirestore.mockResolvedValue('lead-roi-1');
  });

  // ── Test 1: Happy path — standalone mode ──
  it('returns 200 for a valid standalone mode request', async () => {
    const req = makeRequest(validStandaloneBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      executiveSummary: expect.any(String),
      roiProjection: expect.objectContaining({ year1: expect.any(Number) }),
    });
  });

  // ── Test 2: Happy path — from-estimate mode ──
  it('returns 200 for a valid from-estimate mode request', async () => {
    const req = makeRequest(validFromEstimateBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      executiveSummary: expect.any(String),
    });
  });

  // ── Test 3: Payload too large ──
  it('returns 413 when content-length exceeds 100 KiB', async () => {
    const req = makeRequest(validStandaloneBody, { 'content-length': String(101 * 1024) });
    const res = await POST(req);

    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  // ── Test 4: Standalone mode — ideaDescription missing ──
  it('returns 400 when mode is standalone and ideaDescription is missing', async () => {
    const { ideaDescription: _omitted, ...bodyWithoutIdea } = validStandaloneBody;
    const req = makeRequest(bodyWithoutIdea);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 5: Standalone mode — ideaDescription too short ──
  it('returns 400 when mode is standalone and ideaDescription is fewer than 20 characters', async () => {
    const req = makeRequest({ ...validStandaloneBody, ideaDescription: 'Too short' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 6: mode field missing entirely ──
  it('returns 400 when the mode field is missing from the request body', async () => {
    const { mode: _omitted, ...bodyWithoutMode } = validStandaloneBody;
    const req = makeRequest(bodyWithoutMode);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 7: Rate limited ──
  it('returns 429 when the rate limit is exceeded', async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
    });

    const req = makeRequest(validStandaloneBody);
    const res = await POST(req);

    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('RATE_LIMITED');
  });

  // ── Test 8: AI service fails on all retries ──
  it('returns 503 when generateJsonContent returns success:false after all retries', async () => {
    // Route has MAX_AI_ATTEMPTS=2 — fail all attempts
    mockGenerateJsonContent.mockResolvedValue({
      success: false,
      error: 'Gemini service unavailable',
      data: undefined,
    });

    const req = makeRequest(validStandaloneBody);
    const res = await POST(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  // ── Test 9: AI response schema validation fails on all retries ──
  it('returns 503 when roiResponseSchemaV2.safeParse returns success:false after all retries', async () => {
    (roiResponseSchemaV2.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
      success: false,
      error: {
        message: 'Missing required field: roiProjection',
        issues: [{ path: ['roiProjection'], message: 'Required' }],
      },
    });

    const req = makeRequest(validStandaloneBody);
    const res = await POST(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  // ── Test 10: Firestore save failure is non-blocking ──
  it('returns 200 even when Firestore save throws', async () => {
    mockSaveLeadToFirestore.mockRejectedValueOnce(new Error('Firestore quota exceeded'));

    const req = makeRequest(validStandaloneBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
