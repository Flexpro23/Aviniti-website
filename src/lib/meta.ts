// src/lib/meta.ts

declare global {
  interface Window {
    fbq?: (
      command: 'track',
      event: string,
      params?: { [key: string]: any }
    ) => void
  }
}

export const reportMetaLeadConversion = (): void => {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') {
    // eslint-disable-next-line no-console
    console.warn('Meta Pixel (fbq) is not available. Conversion not reported.')
    return
  }

  window.fbq('track', 'Lead')

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('Meta Pixel "Lead" event sent.')
  }
}


