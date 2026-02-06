/**
 * Skip to Content Link
 *
 * Accessibility feature: visually hidden until focused with Tab key.
 * Allows keyboard users to bypass navigation and jump to main content.
 *
 * Must be first focusable element in document flow.
 */

'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

export function SkipToContent() {
  const t = useTranslations('common');

  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'fixed z-[100] top-2 start-2',
        'bg-bronze text-white',
        'px-4 py-2 rounded-lg',
        'text-sm font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy',
        'transition-all duration-150'
      )}
    >
      {t('accessibility.skip_to_content')}
    </a>
  );
}
