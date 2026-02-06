'use client';

import * as React from 'react';
import { Toaster as Sonner } from 'sonner';

/* ============================================================
   TOAST COMPONENT
   Pre-configured Sonner wrapper with dark theme
   ============================================================ */

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-slate-dark group-[.toaster]:text-off-white group-[.toaster]:border-slate-blue-light group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-muted',
          actionButton: 'group-[.toast]:bg-bronze group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-slate-blue-light group-[.toast]:text-off-white',
          success: 'group-[.toast]:border-success/30',
          error: 'group-[.toast]:border-error/30',
          warning: 'group-[.toast]:border-warning/30',
          info: 'group-[.toast]:border-info/30',
        },
      }}
      {...props}
    />
  );
};
