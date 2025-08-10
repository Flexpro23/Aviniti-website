// src/lib/gtag.ts

// Define a type for the window.gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      params: { [key: string]: string }
    ) => void
  }
}

// The specific conversion event ID provided by Google Ads
const CONVERSION_EVENT_ID = 'AW-17405911095/cJyWCLTK-4IbELfA5OtA'

export const reportConversion = (): void => {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') {
    // eslint-disable-next-line no-console
    console.warn('Google Tag (gtag.js) is not available. Conversion not reported.')
    return
  }

  window.gtag('event', 'conversion', {
    send_to: CONVERSION_EVENT_ID,
  })

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`Conversion event sent to ${CONVERSION_EVENT_ID}`)
  }
}


