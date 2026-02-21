import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aviniti.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const meta =
    locale === 'ar'
      ? await import('../../../../messages/ar/meta.json')
      : await import('../../../../messages/en/meta.json');

  const title = meta.roi_calculator.title;
  const description = meta.roi_calculator.description;
  const altLocale = locale === 'ar' ? 'en' : 'ar';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/roi-calculator`,
      siteName: 'Aviniti',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/roi-calculator`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/roi-calculator`,
        [altLocale]: `${SITE_URL}/${altLocale}/roi-calculator`,
      },
    },
  };
}

export default async function ROICalculatorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
