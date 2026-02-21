'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   DIVIDER COMPONENT
   Section divider with fade gradient
   ============================================================ */

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'solid' | 'gradient';
  withText?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, variant = 'gradient', withText, ...props }, ref) => {
    if (withText) {
      return (
        <div className={cn('flex items-center gap-4 my-4', className)}>
          <div className="flex-1 h-px bg-slate-blue-light" />
          <span className="text-xs text-muted uppercase tracking-widest">{withText}</span>
          <div className="flex-1 h-px bg-slate-blue-light" />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'border-0 my-4',
          variant === 'solid'
            ? 'h-px bg-slate-blue-light'
            : 'h-px bg-gradient-to-r from-transparent via-slate-blue-light to-transparent rtl:bg-gradient-to-l',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
