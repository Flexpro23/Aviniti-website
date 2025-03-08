import './globals.css'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Aviniti - AI & App Development Services | Your Ideas, Our Reality',
  description: 'Aviniti is a dynamic software and AI app development company in Amman, Jordan. We specialize in custom AI solutions, mobile apps, and web development for businesses.',
  keywords: 'AI app development, software development, mobile app development, web development, AI solutions, Amman Jordan, custom software',
  verification: {
    other: {
      'msvalidate.01': '91B0C67DCCBBDB8F54D6E11EE8F18F25',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Aviniti - AI & App Development Services | Your Ideas, Our Reality',
    description: 'Aviniti is a dynamic software and AI app development company in Amman, Jordan. We specialize in custom AI solutions, mobile apps, and web development for businesses.',
    url: 'https://aviniti.app',
    siteName: 'Aviniti',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aviniti - AI & App Development Services',
    description: 'Custom AI solutions and app development services for businesses',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Aviniti',
              url: 'https://aviniti.app',
              logo: 'https://aviniti.app/logo.svg',
              description: 'Aviniti is a dynamic software and AI app development company in Amman, Jordan. We specialize in custom AI solutions, mobile apps, and web development for businesses.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Amman',
                addressRegion: 'Amman',
                addressCountry: 'Jordan'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'info@aviniti.app'
              },
              sameAs: [
                'https://www.linkedin.com/company/aviniti',
                'https://twitter.com/aviniti'
              ],
              offers: {
                '@type': 'AggregateOffer',
                offers: [
                  {
                    '@type': 'Offer',
                    name: 'AI App Development',
                    description: 'Custom AI-powered application development services'
                  },
                  {
                    '@type': 'Offer',
                    name: 'Mobile App Development',
                    description: 'Native and cross-platform mobile application development'
                  },
                  {
                    '@type': 'Offer',
                    name: 'Web Development',
                    description: 'Responsive and modern web application development'
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
} 