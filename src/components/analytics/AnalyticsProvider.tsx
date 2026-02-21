'use client';

/**
 * AnalyticsProvider
 *
 * Eagerly initializes Firebase Analytics when the component mounts (client-side only).
 * Must be placed inside a client boundary in the root layout.
 *
 * This is a non-rendering component — it returns null.
 */

import { useEffect } from 'react';
import { getFirebaseAnalytics } from '@/lib/firebase/client';

export function AnalyticsProvider() {
  useEffect(() => {
    // Initialize analytics on mount (fire-and-forget)
    void getFirebaseAnalytics();
  }, []);

  return null;
}
