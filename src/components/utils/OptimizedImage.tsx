'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  style,
  onClick,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle loading state
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Handle error state
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate optimized src for different formats
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a Next.js optimized image, return as is
    if (originalSrc.startsWith('/_next/image')) {
      return originalSrc;
    }
    
    // For local images, let Next.js handle optimization
    if (originalSrc.startsWith('/')) {
      return originalSrc;
    }
    
    // For external images, return as is (they should be optimized externally)
    return originalSrc;
  };

  // Fallback image for errors
  const fallbackSrc = '/placeholder-image.webp';

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style
        }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
          }}
        />
      )}
      
      <Image
        src={getOptimizedSrc(src)}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        style={{
          objectFit: fill ? 'cover' : 'contain',
        }}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

// Hook for intersection observer to implement lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '50px', // Start loading 50px before the element is visible
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Lazy image component using intersection observer
export function LazyImage(props: OptimizedImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(imageRef);

  return (
    <div ref={imageRef}>
      {isVisible ? (
        <OptimizedImage {...props} />
      ) : (
        <div 
          className={`bg-gray-200 animate-pulse ${props.className || ''}`}
          style={{
            width: props.fill ? '100%' : props.width,
            height: props.fill ? '100%' : props.height,
            ...props.style
          }}
        />
      )}
    </div>
  );
}
