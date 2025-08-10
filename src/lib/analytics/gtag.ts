export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const reportConversion = () => {
  // Kept for backwards compatibility; delegate to new utility
  try {
    // Dynamically import new utility to avoid circular deps
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../gtag') as { reportConversion: () => void }
    mod.reportConversion()
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Failed to delegate reportConversion to src/lib/gtag.ts', e)
    }
  }
}


