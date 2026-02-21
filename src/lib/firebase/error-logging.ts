// Server-side error logger for Firestore
// IMPORTANT: Only use this in server-side code and API routes

import { getAdminDb } from './admin';

/**
 * Severity level for error logs
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Error log entry structure
 */
export interface ErrorLogEntry {
  source: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  environment: string;
}

/**
 * Get the error_logs collection
 */
export function getErrorLogsCollection() {
  const db = getAdminDb();
  return db.collection('error_logs');
}

/**
 * Log a server error to Firestore
 * Non-blocking operation - fire and forget
 *
 * @param source - Source identifier (e.g., 'api/ai/analyzer', 'cron/daily-cleanup')
 * @param message - Error message
 * @param error - Optional error object
 * @param metadata - Optional metadata object
 *
 * @example
 * try {
 *   await processData();
 * } catch (error) {
 *   logServerError('api/process', 'Failed to process data', error, { userId: user.id });
 * }
 */
export function logServerError(
  source: string,
  message: string,
  error?: unknown,
  metadata?: Record<string, unknown>
): void {
  const stack = error instanceof Error ? error.stack : undefined;

  const errorLogEntry: ErrorLogEntry = {
    source,
    severity: 'error',
    message,
    stack,
    metadata,
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'unknown',
  };

  // Write to Firestore non-blocking
  getErrorLogsCollection()
    .add(errorLogEntry)
    .catch((err) => {
      // If Firestore write fails, log to console as fallback
      if (process.env.NODE_ENV === 'development') {
        console.error('[Error Logger Fallback]', err);
      }
    });

  // Also log to console in development for better DX
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${source}]`, message, error, metadata);
  }
}

/**
 * Log a server warning to Firestore
 * Non-blocking operation - fire and forget
 *
 * @param source - Source identifier
 * @param message - Warning message
 * @param metadata - Optional metadata object
 *
 * @example
 * if (processingTime > 5000) {
 *   logServerWarning('api/estimate', 'Slow processing detected', { processingTime });
 * }
 */
export function logServerWarning(
  source: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const warningLogEntry: ErrorLogEntry = {
    source,
    severity: 'warning',
    message,
    metadata,
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'unknown',
  };

  // Write to Firestore non-blocking
  getErrorLogsCollection()
    .add(warningLogEntry)
    .catch((err) => {
      // If Firestore write fails, log to console as fallback
      if (process.env.NODE_ENV === 'development') {
        console.error('[Error Logger Fallback]', err);
      }
    });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[${source}]`, message, metadata);
  }
}

/**
 * Log server info to Firestore
 * Non-blocking operation - fire and forget
 *
 * @param source - Source identifier
 * @param message - Info message
 * @param metadata - Optional metadata object
 *
 * @example
 * logServerInfo('cron/daily-cleanup', 'Cleanup job started', { itemsToProcess: 150 });
 */
export function logServerInfo(
  source: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const infoLogEntry: ErrorLogEntry = {
    source,
    severity: 'info',
    message,
    metadata,
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'unknown',
  };

  // Write to Firestore non-blocking
  getErrorLogsCollection()
    .add(infoLogEntry)
    .catch((err) => {
      // If Firestore write fails, log to console as fallback
      if (process.env.NODE_ENV === 'development') {
        console.error('[Error Logger Fallback]', err);
      }
    });

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.info(`[${source}]`, message, metadata);
  }
}
