'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  FCP?: number;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and if web vitals is available
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return;
    }

    // Track Core Web Vitals
    const trackWebVitals = async () => {
      try {
        // Import web-vitals dynamically to reduce bundle size
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

        // Track Cumulative Layout Shift (CLS)
        getCLS((metric) => {
          console.log('CLS:', metric.value);
          sendToAnalytics('CLS', metric.value);
        });

        // Track First Input Delay (FID)
        getFID((metric) => {
          console.log('FID:', metric.value);
          sendToAnalytics('FID', metric.value);
        });

        // Track First Contentful Paint (FCP)
        getFCP((metric) => {
          console.log('FCP:', metric.value);
          sendToAnalytics('FCP', metric.value);
        });

        // Track Largest Contentful Paint (LCP)
        getLCP((metric) => {
          console.log('LCP:', metric.value);
          sendToAnalytics('LCP', metric.value);
        });

        // Track Time to First Byte (TTFB)
        getTTFB((metric) => {
          console.log('TTFB:', metric.value);
          sendToAnalytics('TTFB', metric.value);
        });
      } catch (error) {
        console.warn('Web Vitals not available:', error);
      }
    };

    // Track additional performance metrics
    const trackAdditionalMetrics = () => {
      // Track page load time
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
          console.log('Page Load Time:', pageLoadTime);
          sendToAnalytics('PageLoadTime', pageLoadTime);
        }
      }

      // Track resource loading
      if ('performance' in window) {
        const resources = performance.getEntriesByType('resource');
        const totalResourceSize = resources.reduce((total, resource) => {
          return total + (resource.transferSize || 0);
        }, 0);
        console.log('Total Resource Size:', totalResourceSize);
        sendToAnalytics('TotalResourceSize', totalResourceSize);
      }
    };

    // Send metrics to analytics
    const sendToAnalytics = (metricName: string, value: number) => {
      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metricName,
          value: Math.round(value),
          non_interaction: true,
        });
      }

      // Send to custom analytics endpoint
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: metricName,
          value: value,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch((error) => {
        console.warn('Failed to send performance metrics:', error);
      });
    };

    // Track performance when page is fully loaded
    if (document.readyState === 'complete') {
      trackWebVitals();
      trackAdditionalMetrics();
    } else {
      window.addEventListener('load', () => {
        trackWebVitals();
        trackAdditionalMetrics();
      });
    }

    // Track performance on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible again, track performance
        setTimeout(() => {
          trackAdditionalMetrics();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook for tracking custom performance metrics
export function usePerformanceTracking() {
  const trackCustomMetric = (name: string, value: number, category = 'Custom') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'custom_performance', {
        event_category: category,
        event_label: name,
        value: Math.round(value),
        non_interaction: true,
      });
    }
  };

  const trackUserInteraction = (action: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_interaction', {
        event_category: 'User Interaction',
        event_label: action,
        value: value ? Math.round(value) : undefined,
      });
    }
  };

  return { trackCustomMetric, trackUserInteraction };
}
