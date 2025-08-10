'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GoogleAnalytics = () => {
  const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GADS_ID) return
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return

    const queryString = searchParams?.toString?.() ?? ''
    const url = queryString ? `${pathname}?${queryString}` : pathname
    window.gtag('config', GADS_ID, {
      page_path: url,
    })
  }, [pathname, searchParams, GADS_ID])

  if (!GADS_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
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
  )
}

export default GoogleAnalytics


