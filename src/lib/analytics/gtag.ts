export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID

// Ensure TypeScript knows about window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const reportConversion = () => {
  const conversionId = 'AW-17405911095/cJyWCLTK-4IbELfA5OtA'
  if (typeof window === 'undefined') {
    return
  }
  if (typeof window.gtag !== 'function') {
    console.warn('gtag function not found. Conversion not reported.')
    return
  }
  window.gtag('event', 'conversion', {
    send_to: conversionId,
  })
  // Optional debug log
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(`Conversion event sent to ${conversionId}`)
  }
}


