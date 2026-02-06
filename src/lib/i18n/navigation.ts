import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Export localized navigation helpers from next-intl
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

/**
 * Create a localized href for a given path
 * @param locale - The target locale ('en' or 'ar')
 * @param path - The path without locale prefix (e.g., '/get-estimate')
 * @returns Localized path (e.g., '/ar/get-estimate')
 */
export function createLocalizedHref(locale: string, path: string): string {
  // Remove leading slash if present for consistency
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${cleanPath}`;
}
