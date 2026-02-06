'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   SECTION COMPONENT
   Full-width section wrapper with background variants
   ============================================================ */

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'navy' | 'navy-dark' | 'slate-blue';
  padding?: 'default' | 'compact' | 'hero';
  as?: 'section' | 'div' | 'article';
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'navy', padding = 'default', as: Component = 'section', ...props }, ref) => {
    const backgroundStyles = {
      navy: 'bg-navy',
      'navy-dark': 'bg-navy-dark',
      'slate-blue': 'bg-slate-blue',
    };

    const paddingStyles = {
      default: 'py-12 md:py-20',
      compact: 'py-8 md:py-12',
      hero: 'py-16 md:py-24 lg:py-32',
    };

    return (
      <Component
        ref={ref as any}
        className={cn('w-full', backgroundStyles[background], paddingStyles[padding], className)}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';
