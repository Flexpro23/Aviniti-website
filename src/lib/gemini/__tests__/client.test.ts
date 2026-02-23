// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Strategy ──
// client.ts has a module-level `_geminiClient` singleton.  Once the module is
// loaded the singleton is created from the FIRST `new GoogleGenerativeAI()` call
// and cached.  Subsequent tests reuse the same instance — so we can't swap the
// constructor between tests.
//
// Solution: the factory always returns an object whose `generateContent` method
// is a SHARED spy (`mockGenerateContent`).  Each test resets that spy's
// behaviour via `.mockReset()` + `.mockResolvedValueOnce(...)`.  The constructor
// itself only needs to run once.

const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
  // Must be declared with `function` so `new GoogleGenerativeAI()` works.
  GoogleGenerativeAI: vi.fn(function () {
    return {
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    };
  }),
}));

vi.mock('@/lib/firebase/error-logging', () => ({
  logServerError: vi.fn(),
  logServerWarning: vi.fn(),
}));

// ── Subject under test ──
import { generateJsonContent } from '../client';

// ── Setup ──

beforeEach(() => {
  mockGenerateContent.mockReset();
  process.env.GEMINI_API_KEY = 'test-api-key';
});

// ── Tests ──

describe('generateJsonContent', () => {
  it('returns parsed data when AI returns a plain JSON string', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '{"key": "value"}' },
    });

    const result = await generateJsonContent('prompt');

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ key: 'value' });
  });

  it('returns parsed data when AI returns JSON wrapped in markdown fences', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '```json\n{"key": "value"}\n```' },
    });

    const result = await generateJsonContent('prompt');

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ key: 'value' });
  });

  it('returns parsed data when AI returns JSON with leading prose', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'Here is the result: {"key": "value"}' },
    });

    const result = await generateJsonContent('prompt');

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ key: 'value' });
  });

  it('returns success:false when AI returns non-parseable text', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => 'Not valid JSON at all' },
    });

    const result = await generateJsonContent('prompt', { maxRetries: 0 });

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeDefined();
  });

  it('returns success:false when AI returns empty text', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      response: { text: () => '' },
    });

    const result = await generateJsonContent('prompt', { maxRetries: 0 });

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
  });

  it('returns success:false when the API call throws an error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API failure'));

    const result = await generateJsonContent('prompt', { maxRetries: 0 });

    expect(result.success).toBe(false);
    expect(result.error).toContain('API failure');
  });

  it('retries on network errors and succeeds on second attempt', async () => {
    mockGenerateContent
      // First call: retryable network error triggers a retry
      .mockRejectedValueOnce(new Error('network timeout'))
      // Second call: success
      .mockResolvedValueOnce({ response: { text: () => '{"retried": true}' } });

    // maxRetries:1 — one retry is allowed after the initial attempt
    const result = await generateJsonContent('prompt', { maxRetries: 1 });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ retried: true });
    // Initial attempt + 1 retry = 2 calls
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });
});
