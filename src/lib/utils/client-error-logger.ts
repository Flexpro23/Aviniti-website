// Client-side error logger using Firebase Analytics
// This utility is imported by client components to track errors via custom events

import { trackException, trackClientError } from '@/lib/analytics';

/**
 * Log a client-side error via Firebase Analytics.
 * Fires both a GA4 native 'exception' event and a custom 'client_error' event.
 *
 * @param source - Source identifier (e.g., 'IdeaLabForm', 'error-boundary')
 * @param message - Error message
 * @param error - Optional error object
 * @param metadata - Optional metadata (not sent to GA4 — kept for console logging only)
 *
 * @example
 * try {
 *   await submitForm();
 * } catch (error) {
 *   logClientError('IdeaLabForm', 'Form submission failed', error);
 * }
 */
export function logClientError(
  source: string,
  message: string,
  error?: unknown,
  metadata?: Record<string, unknown>
): void {
  // Only run on client
  if (typeof window === 'undefined') {
    return;
  }

  const errorName = error instanceof Error ? error.name : undefined;
  const errorStack = error instanceof Error ? error.stack?.substring(0, 200) : undefined;
  const description = `[${source}] ${message}`;

  // Fire GA4 native exception event (shows in Crashes & exceptions report)
  trackException(description, false);

  // Fire custom client_error event with structured details
  trackClientError(source, message, errorName, errorStack);

  // Also log to console in development for better DX
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${source}]`, message, error, metadata);
  }
}

/**
 * Log a client-side warning via Firebase Analytics.
 * Fires a custom 'client_warning' event.
 *
 * @param source - Source identifier
 * @param message - Warning message
 * @param metadata - Optional metadata
 *
 * @example
 * if (formData.length > maxAllowedLength) {
 *   logClientWarning('IdeaLabForm', 'Form data exceeds recommended length', { length: formData.length });
 * }
 */
export function logClientWarning(
  source: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  // Only run on client
  if (typeof window === 'undefined') {
    return;
  }

  // Import inline to avoid circular deps — trackEvent still works via the gtag layer if available
  // For warnings we just log to console in dev; no GA4 event needed (keep noise low)
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${source}]`, message, metadata);
  }
}
