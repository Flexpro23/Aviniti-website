/**
 * AI Thinking State - Premium Processing Animation
 *
 * A polished AI processing animation featuring:
 * - Morphing equalizer bars with organic breathing motion
 * - Concentric pulse rings for depth
 * - 2-phase progression with smooth crossfades
 * - Horizontal progress indicator
 * - Accessible, RTL-compatible, reduced-motion support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { easing } from '@/lib/motion/tokens';

interface AIThinkingStateProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  messages?: string[];
  hideProgress?: boolean;
  className?: string;
}

const toolColorMap = {
  orange: {
    primary: '#9A6A3C',
    light: '#B8936A',
    dark: '#1C1611',
    glow: 'rgba(154, 106, 60, 0.12)',
    ring: 'rgba(154, 106, 60, 0.06)',
  },
  blue: {
    primary: '#5A7A9B',
    light: '#7E9AB5',
    dark: '#141A22',
    glow: 'rgba(90, 122, 155, 0.12)',
    ring: 'rgba(90, 122, 155, 0.06)',
  },
  green: {
    primary: '#4A7E62',
    light: '#6F9E82',
    dark: '#121C17',
    glow: 'rgba(74, 126, 98, 0.12)',
    ring: 'rgba(74, 126, 98, 0.06)',
  },
  purple: {
    primary: '#7A5E96',
    light: '#9B83B2',
    dark: '#18131F',
    glow: 'rgba(122, 94, 150, 0.12)',
    ring: 'rgba(122, 94, 150, 0.06)',
  },
};

export function AIThinkingState({
  toolColor,
  messages,
  hideProgress = false,
  className,
}: AIThinkingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const colors = toolColorMap[toolColor];

  const processingMessages = messages || ['Analyzing...', 'Almost ready...'];

  useEffect(() => {
    const totalPhases = processingMessages.length;
    const interval = totalPhases <= 2 ? 5000 : 4000;
    const phaseTimers: NodeJS.Timeout[] = [];

    for (let i = 1; i < totalPhases; i++) {
      const timer = setTimeout(() => {
        setPhaseIndex(i);
      }, i * interval);
      phaseTimers.push(timer);
    }

    return () => {
      phaseTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [processingMessages.length]);

  return (
    <div className={cn('py-20 flex flex-col items-center justify-center', className)}>

      {/* Central Animation Container */}
      <div className="relative mb-12" style={{ width: 120, height: 120 }}>

        {/* Outer Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${colors.primary}15` }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Inner Pulse Ring */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{ border: `1px solid ${colors.primary}20` }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.8,
          }}
        />

        {/* Glow Backdrop */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: colors.glow }}
        />

        {/* Equalizer Bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="rounded-full"
              style={{
                width: 5,
                backgroundColor: colors.primary,
                boxShadow: `0 0 12px ${colors.primary}40`,
              }}
              initial={{ height: 16 }}
              animate={{
                height: [
                  16,
                  index === 1 ? 52 : index === 3 ? 48 : index === 2 ? 56 : 36,
                  16,
                  index === 2 ? 52 : index === 0 ? 44 : index === 4 ? 40 : 30,
                  16,
                ],
              }}
              transition={{
                duration: 2.2 + index * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.12,
              }}
            />
          ))}
        </div>

        {/* Subtle Shimmer Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-[2px] h-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.light}60, transparent)`,
              filter: 'blur(3px)',
            }}
            animate={{ x: [0, 120, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          />
        </motion.div>
      </div>

      {!hideProgress && (
        /* Horizontal Progress Bar */
        <div className="relative w-full max-w-[200px] h-[2px] mb-8">
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: '#1e2d40' }}
          />
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              backgroundColor: colors.primary,
              boxShadow: `0 0 8px ${colors.primary}50`,
            }}
            initial={{ width: '0%' }}
            animate={{
              width: `${((phaseIndex + 1) / processingMessages.length) * 100}%`,
            }}
            transition={{
              duration: 1.2,
              ease: easing.easeOut,
            }}
          />
        </div>
      )}

      {/* Phase Message — single line with generous height */}
      <div className="relative w-full max-w-xs min-h-[56px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-sm sm:text-base text-muted font-medium text-center leading-relaxed px-4"
          >
            {processingMessages[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {!hideProgress && processingMessages.length > 1 && (
        /* Phase Dots */
        <div className="flex items-center gap-2 mt-4">
          {processingMessages.map((_, index) => (
            <motion.div
              key={index}
              className="rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor:
                  index <= phaseIndex ? colors.primary : '#1e2d40',
              }}
              animate={{
                scale: index === phaseIndex ? [1, 1.4, 1] : 1,
              }}
              transition={{
                scale: {
                  duration: 1,
                  repeat: index === phaseIndex ? Infinity : 0,
                  ease: 'easeInOut',
                },
              }}
            />
          ))}
        </div>
      )}

      {/* Accessibility */}
      <span className="sr-only" role="status" aria-live="polite">
        {processingMessages[phaseIndex]}
      </span>

      {/* Reduced Motion Fallback */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
