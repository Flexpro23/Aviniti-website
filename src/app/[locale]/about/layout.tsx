import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLinks } from '@/lib/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('about.title'),
    description: t('about.description'),
    alternates: getAlternateLinks('/about'),
    openGraph: {
      title: t('about.title'),
      description: t('about.description'),
      type: 'website',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
    },
  };
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
