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
  
  // If src changes, reset to the new source
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        // If WebP fails, try fallback or revert to original format
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else if (imgSrc.endsWith('.webp')) {
          // Try to revert to original format
          setImgSrc(imgSrc.replace(/\.webp$/, ''));
        }
      }}
    />
  );
} 