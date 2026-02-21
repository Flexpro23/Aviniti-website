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

  const title = meta.idea_lab.title;
  const description = meta.idea_lab.description;
  const altLocale = locale === 'ar' ? 'en' : 'ar';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/idea-lab`,
      siteName: 'Aviniti',
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/idea-lab`,
      languages: {
        [locale]: `${SITE_URL}/${locale}/idea-lab`,
        [altLocale]: `${SITE_URL}/${altLocale}/idea-lab`,
      },
    },
  };
}

export default async function IdeaLabLayout({
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
