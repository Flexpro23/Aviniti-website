import type { ReactNode } from 'react';
import { Metadata } from 'next';
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
    title: t('case_studies.title'),
    description: t('case_studies.description'),
    alternates: getAlternateLinks('/case-studies'),
    openGraph: { title: t('case_studies.title'), description: t('case_studies.description'), locale },
  };
}

export default function CaseStudiesLayout({ children }: { children: ReactNode }) {
  return children;
}
