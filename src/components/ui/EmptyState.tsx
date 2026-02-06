'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button, ButtonProps } from './Button';

/* ============================================================
   EMPTY STATE COMPONENT
   Centered placeholder with icon, heading, description, CTA
   ============================================================ */

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  heading: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonProps['variant'];
  };
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, heading, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12',
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="h-12 w-12 rounded-full bg-slate-blue-light flex items-center justify-center mb-4 text-muted">
          {icon}
        </div>

        {/* Heading */}
        <h3 className="heading-h4 text-white mb-2">{heading}</h3>

        {/* Description */}
        {description && <p className="text-base text-muted mb-6">{description}</p>}

        {/* Optional CTA */}
        {action && (
          <Button variant={action.variant || 'primary'} onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
