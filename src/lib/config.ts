/**
 * Centralized site configuration
 * Single source of truth for values used across the codebase
 */

/** Canonical site URL — resolves env var at runtime, falls back to production domain */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aviniti.app';

/** Brand name — never transliterated, always English */
export const BRAND_NAME = 'Aviniti';

/** Brand tagline */
export const BRAND_TAGLINE_EN = 'Your Ideas, Our Reality';
export const BRAND_TAGLINE_AR = 'أفكارك، واقعنا';

/** Default contact email */
export const CONTACT_EMAIL = 'aliodat@aviniti.app';

/** Logo URL for structured data */
export const LOGO_URL = `${SITE_URL}/images/logo.png`;
