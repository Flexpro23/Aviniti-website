import './globals.css'
// Accessibility CSS moved to public and loaded non-blocking
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import MetaPixel from '@/components/analytics/MetaPixel'
import PerformanceMonitor from '@/components/utils/PerformanceMonitor'
import LoadStylesheet from '@/components/utils/LoadStylesheet'
import fs from 'fs'
import path from 'path'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

// Read critical CSS for inlining
const criticalCSS = fs.readFileSync(
  path.join(process.cwd(), 'src/app/critical.css'),
  'utf8'
)

export const metadata: Metadata = {
  metadataBase: new URL('https://aviniti.app'),
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
  const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Inline critical CSS to reduce render-blocking */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* Preload critical resources (keep to a minimum) */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
         {/* Preconnect/DNS-prefetch for external domains */}
         <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://region1.google-analytics.com" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://firebase.googleapis.com" crossOrigin="anonymous" />
         <link rel="preconnect" href="https://firebaseinstallations.googleapis.com" crossOrigin="anonymous" />
         <link rel="dns-prefetch" href="//connect.facebook.net" />
         <link rel="dns-prefetch" href="//www.googletagmanager.com" />
         <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        <meta name="google-site-verification" content="lJLyXN8_uDjPPnfHtb9J8tyt5ktEpkeIjFpuQcv2xvA" />
        
        {/* Structured data - load with high priority */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
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
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/justLogo.png" type="image/png" />
        {/* Accessibility stylesheet will be injected client-side to avoid render blocking */}
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        
        {/* Defer non-critical scripts */}
         {/* Google Ads/Analytics - load lazily to reduce main-thread contention */}
        {GADS_ID && (
          <>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} 
                  gtag('js', new Date());
                  gtag('config', '${GADS_ID}');
                `,
              }}
            />
          </>
        )}
        {/* Load Meta Pixel via dedicated component (lazy) to avoid duplication */}
        <MetaPixel />
        <LoadStylesheet href="/css/accessibility.css" />
        <PerformanceMonitor />
      </body>
    </html>
  )
} 