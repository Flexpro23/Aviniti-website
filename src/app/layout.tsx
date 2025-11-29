import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'Aviniti - AI & App Development Company | Your Ideas, Our Reality',
    template: '%s | Aviniti'
  },
  description: 'Aviniti is a leading AI and app development company specializing in custom software solutions, mobile apps, and AI integration. Transform your ideas into reality with our expert team.',
  keywords: [
    'AI app development',
    'mobile app development',
    'custom software solutions',
    'AI integration',
    'web development',
    'software company',
    'app development services',
    'AI development company'
  ],
  authors: [{ name: 'Aviniti Team' }],
  creator: 'Aviniti',
  publisher: 'Aviniti',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aviniti.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aviniti.app',
    title: 'Aviniti - AI & App Development Company | Your Ideas, Our Reality',
    description: 'Aviniti is a leading AI and app development company specializing in custom software solutions, mobile apps, and AI integration.',
    siteName: 'Aviniti',
    images: [
      {
        url: '/justLogo.png',
        width: 1200,
        height: 630,
        alt: 'Aviniti - AI & App Development Company',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aviniti - AI & App Development Company | Your Ideas, Our Reality',
    description: 'Aviniti is a leading AI and app development company specializing in custom software solutions, mobile apps, and AI integration.',
    images: ['/justLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Google Ads */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=AW-17405911095`}
              strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-17405911095');
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* Structured Data */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              'name': 'Aviniti',
              'description': 'Aviniti is a dynamic AI and app development company specializing in custom software solutions, mobile apps, and AI integration.',
              'url': 'https://aviniti.app',
              'logo': 'https://aviniti.app/justLogo.png',
              'serviceType': ['AI Development', 'App Development', 'Software Solutions'],
              'areaServed': 'Worldwide',
              'sameAs': [
                'https://linkedin.com/company/aviniti',
                'https://twitter.com/aviniti'
              ]
            })
          }}
        />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
