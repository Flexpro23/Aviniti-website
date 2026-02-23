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
  buildEstimatePrompt: vi.fn().mockReturnValue('mock prompt'),
}));

// estimateCreativeSchema mock with inline data (no top-level variable reference — hoisting rule)
vi.mock('@/lib/gemini/schemas', () => ({
  estimateCreativeSchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        projectName: 'DeliveryPro',
        alternativeNames: ['QuickDeliver'],
        projectSummary: 'A delivery management platform',
        estimatedTimeline: {
          weeks: 12,
          phases: [
            { phase: 1, name: 'Discovery', description: 'Planning', duration: '2 weeks' },
            { phase: 2, name: 'Design', description: 'UI/UX', duration: '2 weeks' },
            { phase: 3, name: 'Backend', description: 'API development', duration: '4 weeks' },
            { phase: 4, name: 'Frontend', description: 'UI implementation', duration: '3 weeks' },
            { phase: 5, name: 'Testing', description: 'QA and launch', duration: '1 week' },
          ],
        },
        approach: 'custom',
        techStack: ['React Native', 'Node.js'],
        keyInsights: ['Good market', 'Scalable'],
        strategicInsights: [],
        matchedSolution: null,
      },
    }),
  },
}));

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-est-1'),
  saveAISubmission: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
  logServerWarning: vi.fn(),
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

// Mock feature catalog — auth-email-password is valid, others return null
vi.mock('@/lib/data/feature-catalog', () => ({
  getFeatureById: vi.fn((id: string) =>
    id === 'auth-email-password'
      ? { id: 'auth-email-password', name: 'Email Auth', price: 400, timelineDays: 3, categoryId: 'auth', complexity: 'Low' }
      : null
  ),
  buildCompressedCatalog: vi.fn().mockReturnValue('catalog'),
  FEATURE_CATALOG: [],
}));

// Mock the pricing calculator so tests are deterministic
vi.mock('@/lib/pricing/calculator', () => ({
  calculateEstimate: vi.fn().mockReturnValue({
    features: [
      { catalogId: 'auth-email-password', name: 'auth-email-password', categoryId: 'auth', price: 400, timelineDays: 3, complexity: 'Low' },
    ],
    subtotal: 400,
    designSurcharge: 80,
    bundleDiscount: 0,
    bundleDiscountPercent: 0,
    total: 480,
    totalTimelineDays: 3,
    currency: 'USD',
  }),
  distributeAcrossPhases: vi.fn().mockReturnValue({
    discovery: 38,
    design: 72,
    backend: 144,
    frontend: 120,
    testing: 58,
    launch: 48,
  }),
  PHASE_COST_RATIOS: {
    discovery: 0.08,
    design: 0.15,
    backend: 0.30,
    frontend: 0.25,
    testing: 0.12,
    launch: 0.10,
  },
}));

// ── Subject under test ──
import { POST } from '../ai/estimate/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { estimateCreativeSchema } from '@/lib/gemini/schemas';
import { saveLeadToFirestore } from '@/lib/firebase/collections';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockEstimateCreativeSchema = vi.mocked(estimateCreativeSchema);
const mockSaveLeadToFirestore = vi.mocked(saveLeadToFirestore);

// ── Helper: build a valid POST request ──
function makeRequest(body: Record<string, unknown>, extraHeaders: Record<string, string> = {}): NextRequest {
  return new Request('http://localhost/api/ai/estimate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  projectType: 'mobile',
  description: 'A delivery management app for restaurants',
  answers: { q1: true, q2: false },
  questions: [{ id: 'q1', question: 'Does it need real-time tracking?', context: 'GPS' }],
  selectedFeatureIds: ['auth-email-password'],
  name: 'Ali Odat',
  phone: '+962790685302',
  whatsapp: false,
};

describe('POST /api/ai/estimate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default successful mocks after clearAllMocks resets them
    mockGenerateJsonContent.mockResolvedValue({ success: true, data: { projectName: 'DeliveryPro' } });
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
    });
    (estimateCreativeSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
      data: {
        projectName: 'DeliveryPro',
        alternativeNames: ['QuickDeliver'],
        projectSummary: 'A delivery management platform',
        estimatedTimeline: {
          weeks: 12,
          phases: [
            { phase: 1, name: 'Discovery', description: 'Planning', duration: '2 weeks' },
            { phase: 2, name: 'Design', description: 'UI/UX', duration: '2 weeks' },
            { phase: 3, name: 'Backend', description: 'API development', duration: '4 weeks' },
            { phase: 4, name: 'Frontend', description: 'UI implementation', duration: '3 weeks' },
            { phase: 5, name: 'Testing', description: 'QA and launch', duration: '1 week' },
          ],
        },
        approach: 'custom',
        techStack: ['React Native', 'Node.js'],
        keyInsights: ['Good market', 'Scalable'],
        strategicInsights: [],
        matchedSolution: null,
      },
    });
    mockSaveLeadToFirestore.mockResolvedValue('lead-est-1');
  });

  // ── Test 1: Happy path ──
  it('returns 200 with merged estimate response for a valid request', async () => {
    const req = makeRequest(validBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      projectName: 'DeliveryPro',
      projectSummary: 'A delivery management platform',
      estimatedCost: expect.objectContaining({ currency: 'USD' }),
      estimatedTimeline: expect.objectContaining({ weeks: 12 }),
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

  // ── Test 3: Description too short ──
  it('returns 400 when description is fewer than 10 characters', async () => {
    const req = makeRequest({ ...validBody, description: 'Short' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  // ── Test 4: Invalid feature ID ──
  it('returns 400 when selectedFeatureIds contains an unknown feature ID', async () => {
    const req = makeRequest({ ...validBody, selectedFeatureIds: ['invalid-feature-xyz'] });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
    expect(json.error.message).toContain('invalid-feature-xyz');
  });

  // ── Test 5: Rate limited ──
  it('returns 429 when the rate limit is exceeded', async () => {
    mockCheckRateLimit.mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
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
    mockGenerateJsonContent.mockResolvedValueOnce({
      success: false,
      error: 'Gemini unavailable',
      data: undefined,
    });

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
  });

  // ── Test 7: AI response fails schema validation ──
  it('returns 503 when estimateCreativeSchema.safeParse returns success:false', async () => {
    (estimateCreativeSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      success: false,
      error: { message: 'Missing required field: projectName', issues: [] },
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
    mockSaveLeadToFirestore.mockRejectedValueOnce(new Error('Firestore connection refused'));

    const req = makeRequest(validBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  // ── Test 9: Pricing data is present and deterministic ──
  it('response includes pricing data with estimatedCost.min equal to estimatedCost.max', async () => {
    const req = makeRequest(validBody);
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    const { estimatedCost } = json.data;
    expect(typeof estimatedCost.min).toBe('number');
    expect(typeof estimatedCost.max).toBe('number');
    // Deterministic pricing: min and max are the same calculated total
    expect(estimatedCost.min).toBe(estimatedCost.max);
  });
});
