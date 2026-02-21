'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   AVATAR COMPONENT
   Circular image container with fallback initials
   ============================================================ */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  bronzeBorder?: boolean;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', bronzeBorder = false, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    const sizeStyles = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    const showFallback = !src || imgError;
    const initials = fallback || alt
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-slate-blue-light',
          sizeStyles[size],
          bronzeBorder && 'ring-2 ring-bronze ring-offset-2 ring-offset-navy',
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span className="font-semibold text-off-white select-none">{initials}</span>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
