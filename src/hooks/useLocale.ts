'use client';

import { useLocale as useNextIntlLocale } from 'next-intl';
import type { Locale, Direction } from '@/types/common';

/**
 * Get current locale and text direction
 * Wrapper around next-intl's useLocale with direction calculation
 *
 * @returns Locale and direction
 *
 * @example
 * const { locale, direction, isRTL } = useLocale();
 *
 * return (
 *   <div dir={direction} className={isRTL ? 'text-right' : 'text-left'}>
 *     {content}
 *   </div>
 * );
 */
export function useLocale(): {
  locale: Locale;
  direction: Direction;
  isRTL: boolean;
} {
  const locale = useNextIntlLocale() as Locale;

  // Calculate direction based on locale
  const direction: Direction = locale === 'ar' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  return {
    locale,
    direction,
    isRTL,
  };
}
