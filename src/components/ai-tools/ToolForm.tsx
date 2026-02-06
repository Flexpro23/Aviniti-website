/**
 * Tool Form Container
 *
 * Multi-step form container that manages step state.
 * Renders Stepper component + current step content.
 *
 * Props:
 * - totalSteps: Total number of steps
 * - currentStep: Current active step (1-indexed)
 * - onStepChange: Callback when step changes
 * - toolColor: Accent color for stepper
 * - children: Step content
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ToolFormProps {
  totalSteps: number;
  currentStep: number;
  onStepChange?: (step: number) => void;
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  orange: 'bg-tool-orange',
  blue: 'bg-tool-blue',
  green: 'bg-tool-green',
  purple: 'bg-tool-purple',
};

export function ToolForm({
  totalSteps,
  currentStep,
  toolColor,
  children,
  className,
}: ToolFormProps) {
  return (
    <div className={cn('max-w-3xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={cn(
                  'h-10 w-10 rounded-full',
                  'flex items-center justify-center',
                  'text-sm font-semibold',
                  'transition-all duration-300',
                  step < currentStep
                    ? `${colorClasses[toolColor]} text-white`
                    : step === currentStep
                    ? `${colorClasses[toolColor]} text-white ring-4 ring-${toolColor}/20`
                    : 'bg-slate-blue-light text-muted'
                )}
              >
                {step}
              </div>

              {/* Connector Line */}
              {step < totalSteps && (
                <div
                  className={cn(
                    'flex-1 h-1 mx-2',
                    'transition-all duration-300',
                    step < currentStep
                      ? colorClasses[toolColor]
                      : 'bg-slate-blue-light'
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Label */}
        <p className="text-sm text-muted text-center mt-4">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Form Content */}
      <div className="bg-slate-blue rounded-xl p-6 md:p-8 border border-slate-blue-light">
        {children}
      </div>
    </div>
  );
}
