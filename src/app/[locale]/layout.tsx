import type { ReactNode } from 'react';
import { Inter, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';
import { LocaleUpdater } from '@/components/layout/LocaleUpdater';
import { SkipToContent } from '@/components/layout/SkipToContent';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { getHomepageSchema } from '@/components/seo/structured-data';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Pin the locale for this request — ensures all server components
  // and the NextIntlClientProvider receive the correct locale's messages.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={getHomepageSchema(locale)} />
      </head>
      <body className="bg-navy text-off-white antialiased">
        <div className={`${inter.variable} ${plusJakartaSans.variable} ${cairo.variable} ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
          <NextIntlClientProvider messages={messages}>
            <LocaleUpdater />
            <AnalyticsProvider />
            <PageViewTracker />
            <SkipToContent />
            <Navbar />
            <main id="main-content" className="pt-16">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
