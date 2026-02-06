/**
 * Section Label
 *
 * Uppercase bronze label text above section headings.
 * Consistent styling for all section intros.
 */

import { cn } from '@/lib/utils/cn';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-sm font-semibold tracking-widest text-bronze uppercase',
        className
      )}
    >
      {children}
    </p>
  );
}
