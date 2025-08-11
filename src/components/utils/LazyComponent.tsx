'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { useState, useEffect, useRef } from 'react';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Lazy component wrapper
export default function LazyComponent({ 
  component, 
  fallback = <DefaultFallback />, 
  props = {} 
}: LazyComponentProps) {
  const LazyLoadedComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyLoadedComponent {...props} />
    </Suspense>
  );
}

// Predefined lazy components for common use cases
export const LazyAIEstimateModal = lazy(() => import('../AIEstimate/AIEstimateModal'));
export const LazyContactPopup = lazy(() => import('../ContactPopup'));
export const LazyPDFBlueprint = lazy(() => import('../AIEstimate/PDFBlueprint'));
export const LazyCostBreakdownChart = lazy(() => import('../AIEstimate/CostBreakdownChart'));
export const LazyTimelineVisualization = lazy(() => import('../AIEstimate/TimelineVisualization'));

// Hook for conditional loading based on user interaction
export function useLazyLoad(shouldLoad: boolean, component: () => Promise<{ default: ComponentType<any> }>) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (shouldLoad && !Component) {
      setIsLoading(true);
      component()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((error) => {
          console.error('Failed to load component:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [shouldLoad, Component, component]);

  return { Component, isLoading };
}

// Intersection observer hook for lazy loading
export function useIntersectionLazyLoad<T extends Element>(
  ref: React.RefObject<T>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Start loading 100px before element is visible
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Lazy load component when it comes into view
export function LazyLoadOnIntersection({ 
  component, 
  fallback = <DefaultFallback />, 
  props = {},
  threshold = 0.1 
}: LazyComponentProps & { threshold?: number }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionLazyLoad(containerRef, { threshold });

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <LazyComponent component={component} fallback={fallback} props={props} />
      ) : (
        fallback
      )}
    </div>
  );
}

// Preload component without rendering
export function preloadComponent(component: () => Promise<{ default: ComponentType<any> }>) {
  return component();
}

// Batch preload multiple components
export function preloadComponents(components: Array<() => Promise<{ default: ComponentType<any> }>>) {
  return Promise.all(components.map(preloadComponent));
}
