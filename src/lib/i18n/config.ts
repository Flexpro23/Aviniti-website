/**
 * i18n configuration constants
 * Defines supported locales and their configurations
 */

import type { Locale } from './routing';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'ar'] as const;
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleConfig {
  /** Locale code */
  code: Locale;
  /** English name of the language */
  name: string;
  /** Native name of the language */
  nativeName: string;
  /** Text direction */
  dir: 'ltr' | 'rtl';
  /** Tailwind font family class */
  fontFamily: string;
  /** Locale string for date formatting */
  dateFormat: string;
  /** Locale string for number formatting */
  numberFormat: string;
  /** Default currency for this locale */
  currencyDefault: 'USD' | 'JOD' | 'AED' | 'SAR';
}

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontFamily: 'font-sans',
    dateFormat: 'en-US',
    numberFormat: 'en-US',
    currencyDefault: 'USD',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontFamily: 'font-arabic',
    dateFormat: 'ar-JO',
    numberFormat: 'ar-u-nu-latn', // Western numerals for tech audience
    currencyDefault: 'JOD',
  },
};

/**
 * Get locale configuration
 */
export function getLocaleConfig(locale: Locale): LocaleConfig {
  return LOCALE_CONFIGS[locale];
}

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Generate hreflang alternate links for SEO
 * @param pathname - The current pathname (e.g., "/solutions", "/blog/my-post")
 * @returns Alternates object for Next.js metadata
 */
export function getAlternateLinks(pathname: string = '') {
  const baseUrl = 'https://www.aviniti.app';
  // Ensure pathname starts with / if it's not empty
  const normalizedPath = pathname && !pathname.startsWith('/') ? `/${pathname}` : pathname;

  return {
    canonical: `${baseUrl}/en${normalizedPath}`,
    languages: {
      'en': `${baseUrl}/en${normalizedPath}`,
      'ar': `${baseUrl}/ar${normalizedPath}`,
      'x-default': `${baseUrl}/en${normalizedPath}`,
    },
  };
}
