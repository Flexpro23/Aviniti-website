'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/lib/motion/variants';

/* ============================================================
   BUTTON COMPONENT
   Most critical UI primitive - supports all button variants
   ============================================================ */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  toolColor?: 'orange' | 'blue' | 'green' | 'purple';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      toolColor,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const t = useTranslations('common');
    const defaultLoadingText = loadingText ?? t('ui.loading_text');
    const Comp = asChild ? Slot : 'button';

    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-50 disabled:cursor-not-allowed';

    // Size variants
    const sizeStyles = {
      sm: 'h-9 px-3 py-1.5 text-sm min-w-[64px]',
      md: 'h-11 px-5 py-2.5 text-base min-w-[80px]',
      lg: 'h-13 px-7 py-3 text-lg min-w-[96px]',
    };

    // Variant styles
    const variantStyles = {
      primary: toolColor
        ? {
            orange:
              'bg-tool-orange/60 text-off-white shadow-sm hover:bg-tool-orange/80 hover:shadow-md active:shadow-sm',
            blue: 'bg-tool-blue/60 text-off-white shadow-sm hover:bg-tool-blue/80 hover:shadow-md active:shadow-sm',
            green:
              'bg-tool-green/60 text-off-white shadow-sm hover:bg-tool-green/80 hover:shadow-md active:shadow-sm',
            purple:
              'bg-tool-purple/60 text-off-white shadow-sm hover:bg-tool-purple/80 hover:shadow-md active:shadow-sm',
          }[toolColor]
        : 'bg-bronze text-white shadow-sm hover:bg-bronze-hover hover:shadow-md active:bg-bronze-muted active:shadow-sm',
      secondary:
        'bg-transparent text-bronze border border-bronze hover:bg-bronze/10 hover:text-bronze-light hover:border-bronze-light active:bg-bronze/15',
      ghost:
        'bg-transparent text-off-white hover:bg-slate-blue-light/60 hover:text-white active:bg-slate-blue-light/80',
      link: 'bg-transparent text-bronze underline-offset-4 hover:underline hover:text-bronze-light active:text-bronze-hover px-0 min-w-0',
      icon: 'bg-transparent text-muted hover:text-white hover:bg-slate-blue-light/60 active:bg-slate-blue-light/80 min-w-0 aspect-square p-0',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const content = (
      <>
        {isLoading ? (
          <>
            <Loader2 className={cn('animate-spin', iconSizes[size])} aria-hidden="true" />
            <span className="sr-only">{defaultLoadingText}</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn('inline-flex', iconSizes[size])} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn('inline-flex', iconSizes[size])} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </>
    );

    if (asChild) {
      // When asChild, pass children directly to Slot (not wrapped in fragment)
      // Slot needs a single child element to merge className onto
      return (
        <Comp
          ref={ref}
          className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
          aria-busy={isLoading}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        disabled={disabled || isLoading}
        variants={buttonVariants}
        initial="idle"
        whileHover={!disabled && !isLoading ? 'hover' : undefined}
        whileTap={!disabled && !isLoading ? 'tap' : undefined}
        aria-busy={isLoading}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
