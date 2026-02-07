/**
 * AI Thinking State - Premium Processing Animation
 *
 * A sophisticated AI processing animation featuring:
 * - Morphing equalizer bars with organic breathing motion
 * - Subtle glow and shimmer effects
 * - 4-phase progression with smooth crossfades
 * - Horizontal progress indicator
 * - Accessible, RTL-compatible, reduced-motion support
 *
 * Design: Steve Jobs-quality premium animation (Apple/Linear/Stripe aesthetic)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { fadeIn } from '@/lib/motion/variants';
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
    gradient: 'rgba(154, 106, 60, 0.05)',
  },
  blue: {
    primary: '#5A7A9B',
    light: '#7E9AB5',
    dark: '#141A22',
    gradient: 'rgba(90, 122, 155, 0.05)',
  },
  green: {
    primary: '#4A7E62',
    light: '#6F9E82',
    dark: '#121C17',
    gradient: 'rgba(74, 126, 98, 0.05)',
  },
  purple: {
    primary: '#7A5E96',
    light: '#9B83B2',
    dark: '#18131F',
    gradient: 'rgba(122, 94, 150, 0.05)',
  },
};

const defaultMessages = [
  'Understanding your requirements...',
  'Analyzing market data...',
  'Building your personalized report...',
  'Finalizing recommendations...',
];

export function AIThinkingState({
  toolColor,
  messages = defaultMessages,
  hideProgress = false,
  className,
}: AIThinkingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const colors = toolColorMap[toolColor];

  useEffect(() => {
    const totalPhases = messages.length;
    const phaseTimers: NodeJS.Timeout[] = [];

    for (let i = 1; i < totalPhases; i++) {
      const timer = setTimeout(() => {
        setPhaseIndex(i);
      }, i * 4000);
      phaseTimers.push(timer);
    }

    return () => {
      phaseTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [messages.length]);

  return (
    <div className={cn('py-16 flex flex-col items-center justify-center', className)}>
      {/* Morphing Bars Container */}
      <div className="relative mb-10" style={{ width: 80, height: 80 }}>
        {/* 5 Equalizer Bars */}
        <div className="flex items-center justify-center h-full gap-[2px]">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="rounded-full"
              style={{
                width: 4,
                backgroundColor: colors.primary,
                boxShadow: `0 0 15px ${colors.primary}30`,
              }}
              initial={{ height: 20 }}
              animate={{
                height: [
                  20,
                  index === 1 ? 60 : index === 3 ? 55 : 40,
                  20,
                  index === 2 ? 60 : index === 0 ? 50 : 35,
                  20,
                ],
              }}
              transition={{
                duration: 2.5 + index * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.15,
              }}
            />
          ))}
        </div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-[2px] h-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.light}80, transparent)`,
              filter: 'blur(2px)',
            }}
            animate={{
              x: [0, 80, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </motion.div>
      </div>

      {!hideProgress && (
        <>
          {/* Horizontal Progress Line */}
          <div className="relative w-full max-w-[240px] h-[2px] mb-8">
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#243044' }}
            />
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ backgroundColor: colors.primary }}
              initial={{ width: '0%' }}
              animate={{
                width: `${((phaseIndex + 1) / messages.length) * 100}%`,
              }}
              transition={{
                duration: 1,
                ease: easing.easeOut,
              }}
            />
          </div>
        </>
      )}

      {/* Phase Messages */}
      <div className="relative h-8 flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-base text-muted font-medium text-center absolute"
          >
            {messages[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {!hideProgress && (
        <>
          {/* Phase Indicators (Dots) */}
          <div className="flex items-center gap-2">
            {messages.map((_, index) => (
              <motion.div
                key={index}
                className="rounded-full transition-all duration-300"
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor:
                    index <= phaseIndex ? colors.primary : '#243044',
                }}
                initial={{ scale: 0 }}
                animate={{
                  scale: index === phaseIndex ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  scale: {
                    duration: 0.6,
                    repeat: index === phaseIndex ? Infinity : 0,
                    ease: 'easeInOut',
                  },
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Accessibility */}
      <span className="sr-only" role="status" aria-live="polite">
        {messages[phaseIndex]}
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
