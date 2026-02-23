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
  buildAnalyzerPrompt: vi.fn().mockReturnValue('mock prompt'),
}));

// The mock data is inlined inside the factory so it is available at hoist time.
vi.mock('@/lib/gemini/schemas', () => {
  const data = {
    ideaName: 'Test App',
    overallScore: 85,
    summary:
      'A great idea with strong market potential and clear monetization paths for the target audience.',
    categories: {
      market: {
        score: 80,
        analysis:
          'Good market opportunity with significant demand in the target segment and room for differentiation.',
        findings: ['Large addressable market', 'Growing demand trend'],
      },
      technical: {
        score: 90,
        analysis:
          'Technically feasible with modern stack choices and reasonable complexity for the required feature set.',
        findings: ['Well-understood technology', 'Proven architecture patterns'],
        complexity: 'medium',
        suggestedTechStack: ['React Native', 'Node.js'],
        challenges: ['Scalability at high load', 'Real-time sync requirements'],
      },
      monetization: {
        score: 75,
        analysis:
          'Strong revenue potential with multiple viable monetization models suitable for this type of application.',
        findings: ['Subscription model fits well', 'Enterprise tier possible'],
        revenueModels: [
          {
            name: 'Subscription',
            description: 'Monthly recurring revenue from users who pay for ongoing access.',
            pros: ['Predictable revenue', 'Scales with users'],
            cons: ['Churn risk'],
          },
          {
            name: 'Freemium',
            description:
              'Free tier to grow user base, premium tier for power users and businesses.',
            pros: ['Low barrier to entry', 'Viral growth potential'],
            cons: ['Conversion challenge'],
          },
        ],
      },
      competition: {
        score: 70,
        analysis:
          'Competitive landscape is moderate with several established players but meaningful gaps remain to exploit.',
        findings: ['No dominant single player', 'Fragmented market'],
        competitors: [
          {
            name: 'CompetitorA',
            description: 'A direct competitor in this space.',
            type: 'direct',
          },
          {
            name: 'CompetitorB',
            description: 'An indirect competitor with overlapping features.',
            type: 'indirect',
          },
          {
            name: 'CompetitorC',
            description: 'A potential future competitor entering the market.',
            type: 'potential',
          },
        ],
        intensity: 'moderate',
      },
    },
    recommendations: [
      'Focus on a narrow initial target segment before expanding to the broader market.',
      'Build a strong feedback loop with early adopters to iterate quickly on the product.',
      'Differentiate through superior UX and customer support rather than on features alone.',
    ],
  };
  return {
    analyzerResponseSchema: {
      safeParse: vi.fn().mockReturnValue({ success: true, data }),
    },
  };
});

vi.mock('@/lib/firebase/collections', () => ({
  saveLeadToFirestore: vi.fn().mockResolvedValue('lead-789'),
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
import { POST } from '../ai/analyzer/route';
import { generateJsonContent } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/utils/rate-limit';
import { analyzerResponseSchema } from '@/lib/gemini/schemas';
import { saveLeadToFirestore } from '@/lib/firebase/collections';

const mockGenerateJsonContent = vi.mocked(generateJsonContent);
const mockCheckRateLimit = vi.mocked(checkRateLimit);
const mockSaveLeadToFirestore = vi.mocked(saveLeadToFirestore);

// ── Snapshot of the mock AI data (mirrors what the factory uses) ──
const mockAnalyzerData = {
  ideaName: 'Test App',
  overallScore: 85,
  summary:
    'A great idea with strong market potential and clear monetization paths for the target audience.',
  categories: {
    market: {
      score: 80,
      analysis:
        'Good market opportunity with significant demand in the target segment and room for differentiation.',
      findings: ['Large addressable market', 'Growing demand trend'],
    },
    technical: {
      score: 90,
      analysis:
        'Technically feasible with modern stack choices and reasonable complexity for the required feature set.',
      findings: ['Well-understood technology', 'Proven architecture patterns'],
      complexity: 'medium',
      suggestedTechStack: ['React Native', 'Node.js'],
      challenges: ['Scalability at high load', 'Real-time sync requirements'],
    },
    monetization: {
      score: 75,
      analysis:
        'Strong revenue potential with multiple viable monetization models suitable for this type of application.',
      findings: ['Subscription model fits well', 'Enterprise tier possible'],
      revenueModels: [
        {
          name: 'Subscription',
          description: 'Monthly recurring revenue from users who pay for ongoing access.',
          pros: ['Predictable revenue', 'Scales with users'],
          cons: ['Churn risk'],
        },
        {
          name: 'Freemium',
          description: 'Free tier to grow user base, premium tier for power users and businesses.',
          pros: ['Low barrier to entry', 'Viral growth potential'],
          cons: ['Conversion challenge'],
        },
      ],
    },
    competition: {
      score: 70,
      analysis:
        'Competitive landscape is moderate with several established players but meaningful gaps remain to exploit.',
      findings: ['No dominant single player', 'Fragmented market'],
      competitors: [
        { name: 'CompetitorA', description: 'A direct competitor in this space.', type: 'direct' },
        {
          name: 'CompetitorB',
          description: 'An indirect competitor with overlapping features.',
          type: 'indirect',
        },
        {
          name: 'CompetitorC',
          description: 'A potential future competitor entering the market.',
          type: 'potential',
        },
      ],
      intensity: 'moderate',
    },
  },
  recommendations: [
    'Focus on a narrow initial target segment before expanding to the broader market.',
    'Build a strong feedback loop with early adopters to iterate quickly on the product.',
    'Differentiate through superior UX and customer support rather than on features alone.',
  ],
};

// ── Helpers ──

function makeRequest(body: unknown, contentLength?: number): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (contentLength !== undefined) headers['content-length'] = String(contentLength);
  return new Request('http://localhost/api/ai/analyzer', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  idea: 'I want to build a delivery management platform that helps restaurants manage orders efficiently and reduce delivery times.',
  name: 'Ali Odat',
  phone: '+962790685302',
  whatsapp: false,
};

// ── Tests ──

describe('POST /api/ai/analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Restore defaults after clearAllMocks
    mockCheckRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 2,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
    });

    mockGenerateJsonContent.mockResolvedValue({
      success: true,
      text: JSON.stringify(mockAnalyzerData),
      processingTimeMs: 500,
      data: mockAnalyzerData,
    });

    vi.mocked(analyzerResponseSchema.safeParse).mockReturnValue({
      success: true,
      data: mockAnalyzerData,
    });

    mockSaveLeadToFirestore.mockResolvedValue('lead-789');
  });

  it('returns 200 with AI analysis data for valid request', async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.ideaName).toBe('Test App');
    expect(json.data.overallScore).toBe(85);
  });

  it('returns 413 when content-length header exceeds 100KB', async () => {
    const res = await POST(makeRequest(validBody, 100 * 1024 + 1));
    const json = await res.json();

    expect(res.status).toBe(413);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('returns 400 when idea is too short (fewer than 30 chars)', async () => {
    const res = await POST(makeRequest({ ...validBody, idea: 'Too short' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when name is missing', async () => {
    const { name: _name, ...bodyWithoutName } = validBody;
    const res = await POST(makeRequest(bodyWithoutName));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 429 when rate limited', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 86_400_000),
      limit: 3,
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

  it('returns 503 when analyzerResponseSchema validation fails after all retries', async () => {
    vi.mocked(analyzerResponseSchema.safeParse).mockReturnValue({
      success: false,
      // Provide a minimal ZodError-like shape that the route can iterate
      error: {
        issues: [{ path: ['ideaName'], message: 'Required' }],
      },
    } as ReturnType<typeof analyzerResponseSchema.safeParse>);

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(503);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('AI_UNAVAILABLE');
    // Route retries MAX_AI_ATTEMPTS (2) times before giving up
    expect(mockGenerateJsonContent).toHaveBeenCalledTimes(2);
  });

  it('still returns 200 when Firestore save throws (non-blocking)', async () => {
    mockSaveLeadToFirestore.mockRejectedValue(new Error('Firestore unavailable'));

    const res = await POST(makeRequest(validBody));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.ideaName).toBe('Test App');
  });
});
