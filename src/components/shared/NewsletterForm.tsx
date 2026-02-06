/**
 * Newsletter Form
 *
 * Email input + subscribe button inline.
 * Shows success/error states with toast notifications.
 */

'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

export function NewsletterForm() {
  const t = useTranslations('common');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement newsletter API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading || isSuccess}
          className={cn(
            'flex-1 h-11 px-4 rounded-lg',
            'bg-slate-blue border border-slate-blue-light',
            'text-sm text-off-white placeholder:text-muted-light',
            'focus:border-bronze focus:ring-1 focus:ring-bronze',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Email address"
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
          aria-label="Subscribe to newsletter"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span className="sr-only">Subscribing...</span>
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Subscribed!
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
