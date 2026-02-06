/**
 * Global Loading State
 *
 * Displays a full-page loading spinner with subtle animation.
 * Used as fallback while pages are loading.
 */

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="h-10 w-10 text-bronze animate-spin"
          aria-hidden="true"
        />
        <span className="text-sm text-muted">Loading...</span>
      </div>
    </div>
  );
}
