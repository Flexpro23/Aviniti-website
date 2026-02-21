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
    title: t('blog.title'),
    description: t('blog.description'),
    alternates: getAlternateLinks('/blog'),
    openGraph: { title: t('blog.title'), description: t('blog.description'), locale },
  };
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
