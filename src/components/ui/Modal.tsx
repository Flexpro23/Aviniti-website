'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { modalVariants, backdropVariants, bottomSheetVariants } from '@/lib/motion/variants';

/* ============================================================
   MODAL (DIALOG) COMPONENT
   Desktop: center scale-in | Mobile: bottom sheet slide-up
   ============================================================ */

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export const ModalPortal = ({ children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <AnimatePresence>{children}</AnimatePresence>
  </DialogPrimitive.Portal>
);
ModalPortal.displayName = DialogPrimitive.Portal.displayName;

export const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    asChild
    className={cn('fixed inset-0 z-[60] bg-navy/80 backdrop-blur-sm', className)}
    {...props}
  >
    <motion.div variants={backdropVariants} initial="hidden" animate="visible" exit="exit" />
  </DialogPrimitive.Overlay>
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  mobileSheet?: boolean;
  /** Required for i18n: pass a translated close label (e.g. t('ui.close_label')) */
  closeLabel: string;
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, mobileSheet = true, closeLabel, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      asChild
      className={cn(
        'fixed z-[60] bg-slate-blue border border-slate-blue-light shadow-xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze',
        mobileSheet
          ? 'inset-x-0 bottom-0 rounded-t-2xl p-6 md:start-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:rounded-xl'
          : 'start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg rounded-xl p-6',
        className
      )}
      {...props}
    >
      <motion.div
        variants={mobileSheet ? bottomSheetVariants : modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={mobileSheet ? 'max-h-[85vh] overflow-y-auto' : undefined}
      >
        {children}
        <DialogPrimitive.Close className="absolute end-4 top-4 h-10 w-10 flex items-center justify-center rounded-sm opacity-70 ring-offset-navy transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-bronze focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">{closeLabel}</span>
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-start', className)} {...props} />
);
ModalHeader.displayName = 'ModalHeader';

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2', className)}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-white leading-none tracking-tight', className)}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted', className)} {...props} />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;
