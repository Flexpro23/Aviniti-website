"use client"
import React, { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    try {
      if ('performance' in window) {
        const timing = window.performance.timing as PerformanceTiming
        // Simple first paint-ish metric
        const domContentLoadedMs = timing.domContentLoadedEventEnd - timing.navigationStart
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('[Perf] DCL ~', domContentLoadedMs, 'ms')
        }
      }
    } catch {}
  }, [])

  return null
}


