/**
 * Section Heading
 *
 * Composite component: label + title + optional subtitle.
 * Provides consistent section intro structure.
 */

import { cn } from '@/lib/utils/cn';
import { SectionLabel } from './SectionLabel';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
  /** Optional id for the heading (used for aria-labelledby on section) */
  id?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className,
  id,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-start';

  return (
    <div className={cn(alignClass, className)}>
      {label && (
        <SectionLabel className={align === 'center' ? 'justify-center' : ''}>
          {label}
        </SectionLabel>
      )}
      <h2 id={id} className="text-h2 text-white mt-3">{title}</h2>
      {subtitle && <p className={cn('text-lg text-muted mt-4 max-w-2xl leading-relaxed', align === 'center' && 'mx-auto')}>{subtitle}</p>}
      {/* Decorative accent */}
      <div className={cn(
        'mt-6 h-0.5 w-12 rounded-full bg-bronze',
        align === 'center' ? 'mx-auto' : ''
      )} aria-hidden="true" />
    </div>
  );
}
