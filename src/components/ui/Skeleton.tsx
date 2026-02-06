'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   SKELETON COMPONENT
   Animated loading placeholder with shimmer effect
   ============================================================ */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'card';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 w-full rounded',
      circle: 'rounded-full aspect-square',
      card: 'h-48 w-full rounded-lg',
    };

    return (
      <div
        ref={ref}
        className={cn('animate-pulse bg-slate-blue-light', variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
