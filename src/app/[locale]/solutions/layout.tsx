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
    title: t('solutions.title'),
    description: t('solutions.description'),
    alternates: getAlternateLinks('/solutions'),
    openGraph: { title: t('solutions.title'), description: t('solutions.description'), locale },
  };
}

export default function SolutionsLayout({ children }: { children: ReactNode }) {
  return children;
}
