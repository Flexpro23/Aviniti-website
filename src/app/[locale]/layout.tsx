import type { ReactNode } from 'react';
import { Inter, Plus_Jakarta_Sans, Cairo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/lib/i18n/routing';
import { LocaleUpdater } from '@/components/layout/LocaleUpdater';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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
      <body className="bg-navy text-off-white antialiased">
        <div className={`${inter.variable} ${plusJakartaSans.variable} ${cairo.variable} font-sans`}>
          <NextIntlClientProvider messages={messages}>
            <LocaleUpdater />
            <Navbar />
            <div className="pt-16">
              {children}
            </div>
            <Footer />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
