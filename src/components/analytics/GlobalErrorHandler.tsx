'use client';

/**
 * GlobalErrorHandler
 *
 * Registers window-level error and unhandled promise rejection listeners.
 * Captures JavaScript errors that occur outside React's error boundary
 * (e.g. event handlers, async callbacks, third-party scripts).
 *
 * Reports to Firebase Analytics via logClientError — which fires both
 * the GA4 native `exception` event and a custom `client_error` event.
 *
 * Must be mounted once at the root layout level.
 */

import { useEffect } from 'react';
import { logClientError } from '@/lib/utils/client-error-logger';

export function GlobalErrorHandler() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      const message = event.message ?? 'Unknown error';
      const source = event.filename
        ? `global:${event.filename.split('/').pop() ?? 'unknown'}`
        : 'global:window.onerror';

      logClientError(source, message, event.error);
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
          ? reason
          : 'Unhandled promise rejection';

      logClientError('global:unhandledrejection', message, reason instanceof Error ? reason : undefined);
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
