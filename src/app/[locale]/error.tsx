/**
 * Error Boundary
 *
 * Catches and displays errors that occur during rendering.
 * Must be a client component to use error boundary features.
 */

'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    // Log the error to error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-[60vh] flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-h3 text-white mb-4">{t('generic.title')}</h1>

        {/* Description */}
        <p className="text-base text-muted mb-2">{t('generic.description')}</p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-start">
            <summary className="text-sm text-muted-light cursor-pointer hover:text-muted">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-muted-light bg-slate-blue-light/20 rounded-lg p-3 overflow-x-auto">
              {error.message}
            </pre>
          </details>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Button onClick={() => reset()} size="lg">
            {t('generic.cta.try_again')}
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href="/">{t('generic.cta.home')}</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
