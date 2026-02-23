/**
 * Newsletter Form
 *
 * Email input + subscribe button inline.
 * Shows success/error states with toast notifications.
 */

'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { trackNewsletterSubscribed } from '@/lib/analytics';

export function NewsletterForm() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const message =
          json?.error?.message ?? t('newsletter.subscribe_error');
        setError(message);
        return;
      }

      setIsSuccess(true);
      setEmail('');
      trackNewsletterSubscribed(locale);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      setError(t('newsletter.subscribe_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex gap-2">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
          placeholder={t('newsletter.email_placeholder')}
          required
          disabled={isLoading || isSuccess}
          className={cn(
            'flex-1 h-11 px-4 rounded-lg',
            'bg-slate-blue border border-slate-blue-light',
            'text-sm text-off-white placeholder:text-muted-light',
            'focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label={t('newsletter.email_aria')}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess || !email}
          className={cn(
            'h-11 px-5 rounded-lg',
            'flex items-center justify-center gap-2',
            'font-semibold text-sm',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isSuccess
              ? 'bg-success text-white'
              : 'bg-bronze text-white hover:bg-bronze-hover'
          )}
          aria-label={t('newsletter.subscribe_aria')}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">{t('newsletter.subscribing')}</span>
            </>
          ) : isSuccess ? (
            <span aria-live="polite" className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" aria-hidden="true" />
              {t('newsletter.subscribed')}
            </span>
          ) : (
            <>
              {t('newsletter.subscribe')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-error mt-2" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
