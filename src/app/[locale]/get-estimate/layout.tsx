import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { JourneyTracker } from '@/components/ai-tools/JourneyTracker';
import { SITE_URL } from '@/lib/config';

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

  const title = meta.get_estimate.title;
  const description = meta.get_estimate.description;
  const altLocale = locale === 'ar' ? 'en' : 'ar';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/get-estimate`,
      siteName: 'Aviniti',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/get-estimate`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/get-estimate`,
        [altLocale]: `${SITE_URL}/${altLocale}/get-estimate`,
      },
    },
  };
}

export default async function GetEstimateLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <JourneyTracker currentTool="get-estimate" />
      {children}
    </>
  );
}
