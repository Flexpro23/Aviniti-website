'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DiscoveryProgressProps {
  /** Total number of questions */
  totalQuestions: number;
  /** Number of questions answered so far */
  answeredCount: number;
  /** Whether the discovery phase is active */
  isActive: boolean;
}

// Building block configurations — each block represents a question answered
const BLOCK_CONFIGS = [
  { width: 'w-16', height: 'h-4', x: 0, delay: 0 },
  { width: 'w-12', height: 'h-4', x: 4, delay: 0.1 },
  { width: 'w-14', height: 'h-4', x: 1, delay: 0.15 },
  { width: 'w-10', height: 'h-4', x: 6, delay: 0.2 },
  { width: 'w-16', height: 'h-4', x: 0, delay: 0.1 },
  { width: 'w-12', height: 'h-4', x: 3, delay: 0.25 },
  { width: 'w-14', height: 'h-4', x: 2, delay: 0.15 },
];

/**
 * DiscoveryProgress — Animated building blocks that grow with each answered question.
 *
 * Shows a stack of blocks building upward as users progress through the discovery
 * questions. Provides visual momentum and a sense of investment without feeling
 * like a progress bar.
 */
export function DiscoveryProgress({
  totalQuestions,
  answeredCount,
  isActive,
}: DiscoveryProgressProps) {
  const t = useTranslations('idea_lab');

  if (!isActive) return null;

  const progressPercent = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Building blocks visualization */}
      <div
        className="relative flex flex-col-reverse items-center gap-1 min-h-[48px]"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-label={t('discovery_progress_title')}
      >
        <AnimatePresence mode="popLayout">
          {BLOCK_CONFIGS.slice(0, answeredCount).map((block, index) => (
            <motion.div
              key={`block-${index}`}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 20,
                delay: block.delay,
              }}
              className={`${block.width} ${block.height} rounded-sm`}
              style={{
                marginInlineStart: `${block.x * 4}px`,
                background: `linear-gradient(135deg, rgba(234, 179, 127, ${0.3 + (index * 0.1)}) 0%, rgba(154, 106, 60, ${0.4 + (index * 0.08)}) 100%)`,
                boxShadow: index === answeredCount - 1
                  ? '0 0 12px rgba(234, 179, 127, 0.3)'
                  : 'none',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Pulse on the top block when a new one is added */}
        {answeredCount > 0 && (
          <motion.div
            key={`pulse-${answeredCount}`}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-0 w-16 h-4 rounded-sm bg-tool-orange/20"
          />
        )}
      </div>

      {/* Text indicator */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>{t('discovery_progress_answered', { count: answeredCount })}</span>
        <div className="h-1 w-16 bg-slate-blue-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-tool-orange/60 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
