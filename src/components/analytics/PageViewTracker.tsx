'use client';

/**
 * PageViewTracker
 *
 * Logs a `page_view` event to Firebase Analytics whenever the pathname
 * changes (handles Next.js App Router SPA navigation).
 *
 * Must be rendered inside a <Suspense> boundary because useSearchParams()
 * requires it in Next.js App Router.
 *
 * Non-rendering component — returns null.
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { trackPageView } from '@/lib/analytics';

function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  useEffect(() => {
    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    trackPageView({
      page_path: fullPath,
      page_title: typeof document !== 'undefined' ? document.title : '',
      locale,
    });
  }, [pathname, searchParams, locale]);

  return null;
}

// Export a Suspense-wrapped version to satisfy Next.js App Router requirements
import { Suspense } from 'react';

export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
