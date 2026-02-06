/**
 * i18n Formatters for numbers, currency, dates, and percentages
 * Uses the Intl API for locale-aware formatting
 */

import type { Locale } from './routing';

// Use Western Arabic numerals for consistency with tech-savvy audience
const NUMBER_LOCALE_MAP: Record<Locale, string> = {
  en: 'en-US',
  ar: 'ar-u-nu-latn', // Western numerals in Arabic context
};

const DATE_LOCALE_MAP: Record<Locale, string> = {
  en: 'en-US',
  ar: 'ar-JO',
};

/**
 * Format a number with locale-aware formatting
 */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE_MAP[locale]).format(value);
}

/**
 * Format currency with locale-aware formatting
 * Supports USD, JOD, AED, SAR
 */
export function formatCurrency(
  value: number,
  currency: 'USD' | 'JOD' | 'AED' | 'SAR',
  locale: Locale
): string {
  return new Intl.NumberFormat(NUMBER_LOCALE_MAP[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

type DateStyle = 'short' | 'medium' | 'long' | 'full';

/**
 * Format a date with locale-aware formatting
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale,
  style: DateStyle = 'medium'
): string {
  const dateObject = typeof date === 'object' ? date : new Date(date);

  const options: Intl.DateTimeFormatOptions = (() => {
    switch (style) {
      case 'short':
        return {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        };
      case 'medium':
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
      case 'long':
        return {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
      case 'full':
        return {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
      default:
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
    }
  })();

  return new Intl.DateTimeFormat(DATE_LOCALE_MAP[locale], options).format(
    dateObject
  );
}

/**
 * Format a percentage with locale-aware formatting
 */
export function formatPercent(value: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE_MAP[locale], {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Format a time duration in a human-readable format
 */
export function formatDuration(
  weeks: number,
  locale: Locale
): string {
  if (locale === 'ar') {
    if (weeks === 1) return 'أسبوع واحد';
    if (weeks === 2) return 'أسبوعان';
    if (weeks >= 3 && weeks <= 10) return `${weeks} أسابيع`;
    return `${weeks} أسبوعًا`;
  }

  if (weeks === 1) return '1 week';
  return `${weeks} weeks`;
}

/**
 * Format a number range (e.g., cost estimates)
 */
export function formatNumberRange(
  min: number,
  max: number,
  locale: Locale,
  currency?: 'USD' | 'JOD' | 'AED' | 'SAR'
): string {
  if (currency) {
    const minFormatted = formatCurrency(min, currency, locale);
    const maxFormatted = formatCurrency(max, currency, locale);
    return `${minFormatted} - ${maxFormatted}`;
  }

  const minFormatted = formatNumber(min, locale);
  const maxFormatted = formatNumber(max, locale);

  return locale === 'ar'
    ? `${minFormatted} - ${maxFormatted}`
    : `${minFormatted} - ${maxFormatted}`;
}
