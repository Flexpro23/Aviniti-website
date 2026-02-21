/**
 * Breadcrumbs Navigation
 *
 * Auto-generates breadcrumb trail from pathname.
 * Supports i18n with translated segment names.
 *
 * Includes structured data for SEO.
 */

'use client';

import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage: boolean;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');

  // Don't show breadcrumbs on homepage.
  // usePathname from next/navigation includes the locale prefix (e.g. /en, /ar),
  // so we must check against the locale-prefixed root as well as bare '/'.
  if (pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`) {
    return null;
  }

  // Generate breadcrumb items from pathname, skipping locale prefix
  const allSegments = pathname.split('/').filter(Boolean);
  const locales = ['en', 'ar'];
  const pathSegments = allSegments.filter((s) => !locales.includes(s));

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t('nav.home'),
      href: '/',
      isCurrentPage: false,
    },
  ];

  // Known segment-to-translation-key mapping
  const segmentKeys: Record<string, string> = {
    about: 'footer.aboutUs',
    solutions: 'nav.solutions',
    'case-studies': 'nav.case_studies',
    blog: 'nav.blog',
    faq: 'nav.faq',
    contact: 'nav.contact',
    'idea-lab': 'nav.idea_lab',
    'ai-analyzer': 'nav.ai_analyzer',
    'get-estimate': 'nav.get_estimate',
    'roi-calculator': 'nav.roi_calculator',
    'privacy-policy': 'footer.privacyPolicy',
    'terms-of-service': 'footer.termsOfService',
  };

  // Build breadcrumb path progressively
  let accumulatedPath = '';
  pathSegments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    const translationKey = segmentKeys[segment];
    const label = translationKey
      ? t(translationKey)
      : segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

    breadcrumbItems.push({
      label,
      href: isLast ? undefined : accumulatedPath,
      isCurrentPage: isLast,
    });
  });

  // Generate JSON-LD structured data.
  // The homepage breadcrumb item (href '/') maps to /${locale}, all others
  // already contain locale-relative paths that become /${locale}${item.href}.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && {
        item:
          item.href === '/'
            ? `https://aviniti.app/${locale}`
            : `https://aviniti.app/${locale}${item.href}`,
      }),
    })),
  };

  return (
    <>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label={t('accessibility.breadcrumb')} className="pt-4 pb-2">
        <ol className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
          {breadcrumbItems.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-muted-light rtl:rotate-180"
                  aria-hidden="true"
                />
              )}
              {item.isCurrentPage ? (
                <span className="text-off-white" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href!}
                  className="text-muted hover:text-bronze transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-sm"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
