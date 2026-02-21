import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { JourneyTracker } from '@/components/ai-tools/JourneyTracker';

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

  const title = meta.ai_analyzer.title;
  const description = meta.ai_analyzer.description;
  const altLocale = locale === 'ar' ? 'en' : 'ar';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/ai-analyzer`,
      siteName: 'Aviniti',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/ai-analyzer`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/ai-analyzer`,
        [altLocale]: `${SITE_URL}/${altLocale}/ai-analyzer`,
      },
    },
  };
}

export default async function AIAnalyzerLayout({
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
      <JourneyTracker currentTool="ai-analyzer" />
      {children}
    </>
  );
}
