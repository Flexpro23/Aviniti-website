/**
 * AI Thinking State
 *
 * 3-phase loading animation shown during API call.
 * Phase messages crossfade:
 * - "Submitting..." (0-1s)
 * - "Analyzing..." (1-2s)
 * - "Generating..." (2s+)
 *
 * Shows spinning ring with tool accent color.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { fadeIn } from '@/lib/motion/variants';

interface AIThinkingStateProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  messages?: [string, string, string];
}

const colorClasses = {
  orange: 'text-tool-orange',
  blue: 'text-tool-blue',
  green: 'text-tool-green',
  purple: 'text-tool-purple',
};

const defaultMessages: [string, string, string] = [
  'Submitting your request...',
  'Analyzing with AI...',
  'Generating results...',
];

export function AIThinkingState({
  toolColor,
  messages = defaultMessages,
}: AIThinkingStateProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const phase1Timer = setTimeout(() => setPhaseIndex(1), 1000);
    const phase2Timer = setTimeout(() => setPhaseIndex(2), 2000);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
    };
  }, []);

  return (
    <div className="py-12 flex flex-col items-center justify-center">
      {/* Spinning Ring */}
      <div className="relative h-16 w-16 mb-6">
        <Loader2
          className={cn('h-16 w-16 animate-spin', colorClasses[toolColor])}
          aria-hidden="true"
        />
      </div>

      {/* Phase Messages */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phaseIndex}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="text-base text-muted font-medium"
        >
          {messages[phaseIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 mt-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'h-2 w-2 rounded-full',
              'transition-all duration-300',
              index === phaseIndex
                ? colorClasses[toolColor]
                : 'bg-slate-blue-light'
            )}
          />
        ))}
      </div>

      {/* Accessibility */}
      <span className="sr-only" role="status" aria-live="polite">
        {messages[phaseIndex]}
      </span>
    </div>
  );
}
