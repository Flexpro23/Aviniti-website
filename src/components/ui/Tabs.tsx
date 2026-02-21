'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   TABS COMPONENT
   Using Radix UI with animated bronze underline
   ============================================================ */

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-lg bg-slate-blue-light p-1 text-muted',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium',
      'transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:text-white data-[state=active]:bg-slate-blue',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/* Alternative: Underline Tab Style with Framer Motion */
export const TabsListUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('flex items-center border-b border-slate-blue-light', className)}
    {...props}
  />
));
TabsListUnderline.displayName = 'TabsListUnderline';

export const TabsTriggerUnderline = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { layoutId?: string }
>(({ className, layoutId = 'activeTab', ...props }, ref) => {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);

  // Observe data-state attribute changes to track selection (not just focus)
  React.useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const update = () => setIsActive(node.getAttribute('data-state') === 'active');
    update();

    const observer = new MutationObserver(update);
    observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
    return () => observer.disconnect();
  }, []);

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      }}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
        'disabled:pointer-events-none disabled:opacity-50',
        'text-muted hover:text-white',
        'data-[state=active]:text-white',
        className
      )}
      {...props}
    >
      {props.children}
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute bottom-0 inset-x-0 h-0.5 bg-bronze"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTriggerUnderline.displayName = 'TabsTriggerUnderline';
