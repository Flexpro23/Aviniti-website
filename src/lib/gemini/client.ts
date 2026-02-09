// Google Gemini AI client initialization and helper functions
// Server-only - API key must never be exposed to client

import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure this file is only used server-side
if (typeof window !== 'undefined') {
  throw new Error(
    'Gemini client can only be used on the server. Do not import this file in client components.'
  );
}

// Lazy-initialize the Gemini client to avoid build-time errors
let _geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (_geminiClient) return _geminiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY environment variable is not set. Cannot initialize Gemini client.'
    );
  }

  _geminiClient = new GoogleGenerativeAI(apiKey);
  return _geminiClient;
}

// ============================================================
// Types
// ============================================================

export interface GenerateContentOptions {
  /** Model temperature (0.0-1.0). Higher = more creative. Default: 0.7 */
  temperature?: number;
  /** Enable JSON mode (forces structured JSON output). Default: false */
  jsonMode?: boolean;
  /** Maximum output tokens. Default: 4096 */
  maxOutputTokens?: number;
  /** Number of retry attempts on failure. Default: 2 */
  maxRetries?: number;
  /** Timeout in milliseconds. Default: 30000 (30s) */
  timeoutMs?: number;
}

export interface GenerateContentResult {
  /** The generated text content */
  text: string;
  /** Processing time in milliseconds */
  processingTimeMs: number;
  /** Whether the response was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

// ============================================================
// Configuration
// ============================================================

const DEFAULT_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3-flash-preview';
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_OUTPUT_TOKENS = 4096;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_TIMEOUT_MS = 30000;

// Retry configuration with exponential backoff
const RETRY_CONFIG = {
  baseDelayMs: 1000,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
  jitterMs: 500,
  retryableStatuses: [429, 500, 502, 503],
};

// ============================================================
// Helper Functions
// ============================================================

/**
 * Calculate delay for exponential backoff with jitter
 */
function calculateRetryDelay(attemptNumber: number): number {
  const exponentialDelay = Math.min(
    RETRY_CONFIG.baseDelayMs *
      Math.pow(RETRY_CONFIG.backoffMultiplier, attemptNumber),
    RETRY_CONFIG.maxDelayMs
  );

  // Add random jitter to prevent thundering herd
  const jitter = Math.random() * RETRY_CONFIG.jitterMs;

  return exponentialDelay + jitter;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // Check for network errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('econnreset') ||
      errorMessage.includes('enotfound')
    ) {
      return true;
    }

    // Check for rate limiting or service unavailable
    if (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('503') ||
      errorMessage.includes('429')
    ) {
      return true;
    }
  }

  return false;
}

// ============================================================
// Main Function
// ============================================================

/**
 * Generate content using Gemini AI with retry logic and error handling
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options
 * @returns Generated content result
 *
 * @example
 * ```ts
 * const result = await generateContent(
 *   "Generate 5 creative app ideas",
 *   { temperature: 0.8, jsonMode: true }
 * );
 *
 * if (result.success) {
 *   console.log(result.text);
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export async function generateContent(
  prompt: string,
  options: GenerateContentOptions = {}
): Promise<GenerateContentResult> {
  const {
    temperature = DEFAULT_TEMPERATURE,
    jsonMode = false,
    maxOutputTokens = DEFAULT_MAX_OUTPUT_TOKENS,
    maxRetries = DEFAULT_MAX_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const startTime = Date.now();
  let lastError: Error | null = null;

  // Get the model
  const model = getGeminiClient().getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(jsonMode && { responseMimeType: 'application/json' }),
    },
  });

  // Attempt generation with retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      // Generate content
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Request timeout'));
          });
        }),
      ]);

      clearTimeout(timeoutId);

      // Extract text from response
      const response = result.response;
      const text = response.text();

      if (!text) {
        throw new Error('Empty response from Gemini');
      }

      const processingTimeMs = Date.now() - startTime;

      return {
        text,
        processingTimeMs,
        success: true,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const shouldRetry = attempt < maxRetries && isRetryableError(error);

      if (!shouldRetry) {
        break;
      }

      // Calculate delay and wait before retrying
      const delay = calculateRetryDelay(attempt);
      await sleep(delay);
    }
  }

  // All retries failed
  const processingTimeMs = Date.now() - startTime;
  console.error('[Gemini Client] All retries failed:', lastError?.message);

  return {
    text: '',
    processingTimeMs,
    success: false,
    error: lastError?.message || 'Unknown error occurred',
  };
}

/**
 * Generate JSON content using Gemini AI
 * Convenience wrapper around generateContent with jsonMode enabled
 *
 * @param prompt - The prompt to send to Gemini
 * @param options - Generation options (jsonMode is forced to true)
 * @returns Generated JSON content result
 */
/**
 * Attempt to extract valid JSON from a string that might be wrapped
 * in markdown code fences or contain leading/trailing noise.
 */
function extractJson(raw: string): string {
  // 1. Try as-is first
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return trimmed;
  }

  // 2. Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  // 3. Find the first { or [ and match to the last } or ]
  const firstBrace = trimmed.indexOf('{');
  const firstBracket = trimmed.indexOf('[');
  const start =
    firstBrace === -1
      ? firstBracket
      : firstBracket === -1
        ? firstBrace
        : Math.min(firstBrace, firstBracket);

  if (start !== -1) {
    const closingChar = trimmed[start] === '{' ? '}' : ']';
    const lastClose = trimmed.lastIndexOf(closingChar);
    if (lastClose > start) {
      return trimmed.slice(start, lastClose + 1);
    }
  }

  // 4. Return as-is as a last resort
  return trimmed;
}

export async function generateJsonContent<T = unknown>(
  prompt: string,
  options: Omit<GenerateContentOptions, 'jsonMode'> = {}
): Promise<GenerateContentResult & { data?: T }> {
  const result = await generateContent(prompt, {
    ...options,
    jsonMode: true,
  });

  if (result.success && result.text) {
    try {
      const cleaned = extractJson(result.text);
      const data = JSON.parse(cleaned) as T;
      return {
        ...result,
        data,
      };
    } catch (parseError) {
      console.error(
        '[Gemini Client] JSON parse failed. Raw text (first 500 chars):',
        result.text.slice(0, 500)
      );
      return {
        ...result,
        success: false,
        error: 'Failed to parse JSON response from Gemini',
      };
    }
  }

  return result;
}
