// Core shared types for the Aviniti website

/** Supported locale codes */
export type Locale = 'en' | 'ar';

/** Text direction derived from locale */
export type Direction = 'ltr' | 'rtl';

/** The four AI tool identifiers */
export type ToolSlug = 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';

/** Accent color names for AI tools (mapped in Tailwind config) */
export type ToolAccentColor = 'orange' | 'blue' | 'green' | 'purple';

/** Mapping from tool slug to accent color */
export const TOOL_COLORS: Record<ToolSlug, ToolAccentColor> = {
  'idea-lab': 'orange',
  'ai-analyzer': 'blue',
  'get-estimate': 'green',
  'roi-calculator': 'purple',
};

/** Next.js page props for locale-scoped routes */
export interface LocalePageProps {
  params: Promise<{ locale: Locale }>;
}

/** Next.js page props for locale + slug routes */
export interface SlugPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}
