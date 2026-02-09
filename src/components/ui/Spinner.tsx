'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   SPINNER COMPONENT
   SVG spinning loader with size and color variants
   ============================================================ */

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg';
  toolColor?: 'orange' | 'blue' | 'green' | 'purple';
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', toolColor, ...props }, ref) => {
    const t = useTranslations('common');
    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const colorStyles = toolColor
      ? {
          orange: 'text-tool-orange',
          blue: 'text-tool-blue',
          green: 'text-tool-green',
          purple: 'text-tool-purple',
        }[toolColor]
      : 'text-bronze';

    return (
      <svg
        ref={ref}
        className={cn('animate-spin', sizeStyles[size], colorStyles, className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label={t('ui.loading_aria')}
        role="status"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    );
  }
);

Spinner.displayName = 'Spinner';
