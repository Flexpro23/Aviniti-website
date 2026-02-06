'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   BADGE COMPONENT
   Small status/label indicator with variant support
   ============================================================ */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'tool';
  size?: 'sm' | 'md';
  toolColor?: 'orange' | 'blue' | 'green' | 'purple';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', toolColor, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-sm transition-colors';

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    const variantStyles = {
      default: 'bg-bronze/10 text-bronze border border-bronze/20',
      outline: 'bg-transparent text-bronze border border-bronze',
      tool: toolColor
        ? {
            orange: 'bg-tool-orange-dark border border-tool-orange/30 text-tool-orange-light',
            blue: 'bg-tool-blue-dark border border-tool-blue/30 text-tool-blue-light',
            green: 'bg-tool-green-dark border border-tool-green/30 text-tool-green-light',
            purple: 'bg-tool-purple-dark border border-tool-purple/30 text-tool-purple-light',
          }[toolColor]
        : 'bg-bronze/10 text-bronze border border-bronze/20',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
