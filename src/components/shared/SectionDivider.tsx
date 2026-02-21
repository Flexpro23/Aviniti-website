'use client';

import { cn } from '@/lib/utils/cn';

/**
 * SectionDivider - Visual separator between homepage sections
 *
 * Variants:
 * - `gradient`: Subtle vertical gradient fade (default) — adds breathing room
 * - `glow`: Bronze accent line with soft glow — strong visual break
 * - `line`: Contained bronze gradient line — minimal but effective
 */

interface SectionDividerProps {
  variant?: 'gradient' | 'glow' | 'line';
  className?: string;
}

export function SectionDivider({ variant = 'gradient', className }: SectionDividerProps) {
  if (variant === 'line') {
    return (
      <div className={cn('w-full', className)} aria-hidden="true">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === 'glow') {
    return (
      <div className={cn('relative h-px w-full overflow-hidden', className)} aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bronze/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bronze/10 to-transparent blur-sm" />
      </div>
    );
  }

  // gradient (default) — subtle vertical fade that adds visual breathing room
  return (
    <div className={cn('relative h-16 w-full overflow-hidden', className)} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
    </div>
  );
}
