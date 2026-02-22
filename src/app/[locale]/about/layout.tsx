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
  const t = await getTranslations({ locale, namespace: 'about' });

  const title = t('meta.title');
  const description = t('meta.description');
  const ogTitle = t('meta.og_title');
  const ogDescription = t('meta.og_description');

  return {
    title,
    description,
    alternates: getAlternateLinks('/about'),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&type=page&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDescription)}&type=page&locale=${locale}`],
    },
  };
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
