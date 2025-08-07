import './globals.css'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
    <html suppressHydrationWarning lang="en">
      <head>
        <meta name="google-site-verification" content="lJLyXN8_uDjPPnfHtb9J8tyt5ktEpkeIjFpuQcv2xvA" />
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
        
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '931338648950378');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=931338648950378&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/justLogo.png" type="image/png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/company-logos/flex-pro.webp" as="image" type="image/webp" />
        <link rel="preload" href="/hero/hero-image.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
} 