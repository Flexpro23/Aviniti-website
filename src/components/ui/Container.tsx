'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   CONTAINER COMPONENT
   Centered content wrapper with responsive padding
   ============================================================ */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', ...props }, ref) => {
    const sizeStyles = {
      default: 'max-w-[1320px]',
      narrow: 'max-w-[768px]',
    };

    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';
