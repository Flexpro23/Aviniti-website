'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    fbq?: (
      command: 'track',
      event: string,
      params?: { [key: string]: any }
    ) => void
    _fbq?: unknown
  }
}

const MetaPixel = () => {
  const [loaded, setLoaded] = useState(false)
  const pathname = usePathname()
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '931338648950378'

  useEffect(() => {
    if (!FB_PIXEL_ID) {
      // eslint-disable-next-line no-console
      console.warn('Meta Pixel ID is not configured.')
      return
    }
    setLoaded(true)
  }, [FB_PIXEL_ID])

  // Track PageView on route change
  useEffect(() => {
    if (loaded && typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [pathname, loaded])

  if (!FB_PIXEL_ID) {
    return null
  }

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

export default MetaPixel


