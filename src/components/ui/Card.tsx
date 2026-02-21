'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { cardHover } from '@/lib/motion/variants';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';

/* ============================================================
   CARD COMPONENT
   Versatile card container with variant support
   ============================================================ */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'tool';
  toolColor?: 'orange' | 'blue' | 'green' | 'purple';
  hover?: boolean;
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', toolColor, hover = false, children, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const baseStyles = 'rounded-lg p-6 transition-all duration-300';

    const variantStyles = {
      default: 'bg-slate-blue border border-slate-blue-light shadow-md',
      featured:
        'bg-slate-blue border border-bronze/30 border-t-2 border-t-bronze shadow-lg hover:shadow-glow-bronze',
      tool: toolColor
        ? {
            orange: 'bg-gradient-to-br from-tool-orange-dark/40 to-navy-light border border-tool-orange/8',
            blue: 'bg-gradient-to-br from-tool-blue-dark/40 to-navy-light border border-tool-blue/8',
            green: 'bg-gradient-to-br from-tool-green-dark/40 to-navy-light border border-tool-green/8',
            purple:
              'bg-gradient-to-br from-tool-purple-dark/40 to-navy-light border border-tool-purple/8',
          }[toolColor]
        : 'bg-slate-blue border border-slate-blue-light',
    };

    if (hover) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseStyles, variantStyles[variant], className)}
          variants={cardHover}
          initial="rest"
          whileHover={prefersReducedMotion ? undefined : "hover"}
          {...(props as Omit<
            React.ComponentPropsWithoutRef<'div'>,
            'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
          >)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* ============================================================
   CARD SUBCOMPONENTS
   Composable card parts for flexible layouts
   ============================================================ */

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('heading-h4 leading-none tracking-tight', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';
