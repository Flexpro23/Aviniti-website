'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Image component that attempts to load WebP format first,
 * but falls back to original format if WebP is not supported or fails to load
 */
export default function ImageWithFallback({
  src,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [error, setError] = useState<boolean>(false);
  
  // If src changes, reset to the new source
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  // Handle the error silently to prevent console errors
  const handleImageError = () => {
    // If already using the fallback, don't try again
    if (error) return;
    
    setError(true);
    
    // If WebP fails, try fallback or revert to original format
    if (fallbackSrc) {
      console.log(`Falling back to: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
    } else if (imgSrc.endsWith('.webp')) {
      // Try to revert to original format
      const originalSrc = imgSrc.replace(/\.webp$/, '');
      console.log(`Falling back to original format: ${originalSrc}`);
      setImgSrc(originalSrc);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={handleImageError}
    />
  );
} 