'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   STEPPER COMPONENT
   Multi-step form indicator (horizontal and vertical)
   ============================================================ */

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, orientation = 'horizontal', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
        role="list"
        aria-label="Progress"
        {...props}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  'flex items-center gap-3',
                  orientation === 'vertical' && 'pb-8 last:pb-0'
                )}
                role="listitem"
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold text-sm transition-colors duration-200',
                    isCompleted && 'bg-bronze border-bronze text-white',
                    isActive && 'border-bronze text-bronze bg-navy',
                    !isCompleted && !isActive && 'border-slate-blue-light text-muted bg-navy'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>

                {/* Step Label */}
                <div className={cn('flex flex-col', orientation === 'vertical' && 'flex-1')}>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isActive && 'text-white',
                      isCompleted && 'text-off-white',
                      !isActive && !isCompleted && 'text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-xs text-muted mt-0.5">{step.description}</span>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'bg-slate-blue-light transition-colors duration-200',
                    orientation === 'horizontal'
                      ? 'h-0.5 flex-1 mx-2'
                      : 'w-0.5 h-full ms-5 -mt-8 mb-0',
                    isCompleted && 'bg-bronze'
                  )}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
