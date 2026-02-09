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
 * - stepLabels: Optional labels for each step
 * - stepIcons: Optional icon components for each step
 * - children: Step content
 */

'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface ToolFormProps {
  totalSteps: number;
  currentStep: number;
  onStepChange?: (step: number) => void;
  onStepClick?: (step: number) => void;
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  stepLabels?: string[];
  stepIcons?: React.ElementType[];
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  orange: 'bg-tool-orange',
  blue: 'bg-tool-blue',
  green: 'bg-tool-green',
  purple: 'bg-tool-purple',
};

const textColorClasses = {
  orange: 'text-tool-orange-light',
  blue: 'text-tool-blue-light',
  green: 'text-tool-green-light',
  purple: 'text-tool-purple-light',
};

export function ToolForm({
  totalSteps,
  currentStep,
  onStepClick,
  toolColor,
  stepLabels,
  stepIcons,
  children,
  className,
}: ToolFormProps) {
  const t = useTranslations('common');
  return (
    <div className={cn('max-w-3xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {/* Desktop Stepper (md+) */}
      <div className="hidden md:block mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const StepIcon = stepIcons?.[step - 1];
            return (
              <div key={step} className="flex items-center flex-1">
                {/* Step Circle + Label */}
                <div className="flex flex-col items-center gap-1.5">
                  {step < currentStep ? (
                    <button
                      onClick={() => onStepClick?.(step)}
                      className={cn(
                        'h-10 w-10 rounded-full',
                        'flex items-center justify-center',
                        'text-sm font-semibold',
                        'transition-all duration-300',
                        colorClasses[toolColor],
                        'text-white cursor-pointer',
                        'hover:ring-2',
                        toolColor === 'orange' && 'hover:ring-bronze/30',
                        toolColor === 'blue' && 'hover:ring-tool-blue/30',
                        toolColor === 'green' && 'hover:ring-tool-green/30',
                        toolColor === 'purple' && 'hover:ring-tool-purple/30',
                        'hover:scale-105'
                      )}
                      aria-label={`Go back to step ${step}${stepLabels?.[step - 1] ? `: ${stepLabels[step - 1]}` : ''}`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  ) : (
                    <div
                      className={cn(
                        'h-10 w-10 rounded-full',
                        'flex items-center justify-center',
                        'text-sm font-semibold',
                        'transition-all duration-300',
                        step === currentStep
                          ? `${colorClasses[toolColor]} text-white ring-4 ring-${toolColor}/20`
                          : 'bg-slate-blue-light text-muted'
                      )}
                    >
                      {StepIcon ? (
                        <StepIcon className="h-4.5 w-4.5" />
                      ) : (
                        step
                      )}
                    </div>
                  )}
                  {stepLabels?.[step - 1] && (
                    <span
                      className={cn(
                        'text-xs font-medium transition-colors duration-300 whitespace-nowrap',
                        step === currentStep
                          ? textColorClasses[toolColor]
                          : 'text-muted'
                      )}
                    >
                      {stepLabels[step - 1]}
                    </span>
                  )}
                </div>

                {/* Connector Line */}
                {step < totalSteps && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-2 mt-[-1.25rem]',
                      'transition-all duration-300',
                      step < currentStep
                        ? colorClasses[toolColor]
                        : 'bg-slate-blue-light'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar (<md) */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={cn('text-sm font-medium', textColorClasses[toolColor])}>
            {stepLabels?.[currentStep - 1] || t('tool_form.step_fallback', { step: currentStep })}
          </span>
          <span className="text-xs text-muted">
            {currentStep}/{totalSteps}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-blue-light rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              colorClasses[toolColor]
            )}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-slate-blue rounded-xl p-6 md:p-8 border border-slate-blue-light">
        {children}
      </div>
    </div>
  );
}
