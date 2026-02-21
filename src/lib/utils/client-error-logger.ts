// Client-side error logger using Firebase Analytics
// This utility is imported by client components to track errors via custom events

import { trackEvent } from './analytics';

/**
 * Log a client-side error via Firebase Analytics
 * Fires a 'client_error' custom event
 *
 * @param source - Source identifier (e.g., 'IdeaLabForm', 'EstimateCalculator')
 * @param message - Error message
 * @param error - Optional error object
 * @param metadata - Optional metadata object
 *
 * @example
 * try {
 *   await submitForm();
 * } catch (error) {
 *   logClientError('IdeaLabForm', 'Form submission failed', error, { formId: 'idea-lab' });
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

  // Extract error details
  const errorName = error instanceof Error ? error.name : undefined;
  const errorStack =
    error instanceof Error ? error.stack?.substring(0, 200) : undefined;

  // Build event parameters
  const eventParams: Record<string, string | number | boolean> = {
    source,
    message,
  };

  // Add error-specific fields if available
  if (errorName) {
    eventParams.error_name = errorName;
  }
  if (errorStack) {
    eventParams.error_stack = errorStack;
  }

  // Add metadata fields
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        eventParams[key] = value;
      }
    });
  }

  // Fire analytics event
  trackEvent('client_error', eventParams);

  // Also log to console in development for better DX
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${source}]`, message, error, metadata);
  }
}

/**
 * Log a client-side warning via Firebase Analytics
 * Fires a 'client_warning' custom event
 *
 * @param source - Source identifier
 * @param message - Warning message
 * @param metadata - Optional metadata object
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

  // Build event parameters
  const eventParams: Record<string, string | number | boolean> = {
    source,
    message,
  };

  // Add metadata fields
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        eventParams[key] = value;
      }
    });
  }

  // Fire analytics event
  trackEvent('client_warning', eventParams);

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${source}]`, message, metadata);
  }
}
