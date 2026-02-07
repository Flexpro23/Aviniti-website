/**
 * Processing State - Full-page premium processing experience
 * Used in Get Estimate tool when generating the blueprint
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  DollarSign,
  Clock,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { AIThinkingState } from './AIThinkingState';

interface ProcessingStateProps {
  featureCount: number;
  messages?: string[];
  onCancel?: () => void;
}

export function ProcessingState({ featureCount, messages, onCancel }: ProcessingStateProps) {
  const [processingPhase, setProcessingPhase] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const phaseTimers = [
      setTimeout(() => setProcessingPhase(1), 5000),
      setTimeout(() => setProcessingPhase(2), 10000),
      setTimeout(() => setProcessingPhase(3), 15000),
    ];
    return () => phaseTimers.forEach(clearTimeout);
  }, []);

  // Show cancel link after 3 seconds
  useEffect(() => {
    if (onCancel) {
      const timer = setTimeout(() => setShowCancel(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [onCancel]);

  const defaultMessages = [
    'Understanding your project scope...',
    'Calculating costs & timeline...',
    'Matching with our solution catalog...',
    'Generating your comprehensive blueprint...',
  ];

  const processingMessages = messages || defaultMessages;

  return (
    <main className="min-h-screen bg-navy relative overflow-hidden flex items-center justify-center">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large radial gradient pulse — bronze warmth */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          animate={{
            opacity: [0.04, 0.1, 0.04],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'radial-gradient(circle, rgba(192,132,96,0.25) 0%, transparent 70%)' }}
        />
        {/* Secondary offset gradient — blue accent */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          animate={{
            opacity: [0.02, 0.06, 0.02],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ background: 'radial-gradient(circle, rgba(90,122,155,0.2) 0%, transparent 70%)' }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(192,132,96,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,96,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-bronze/40"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bronze/10 border border-bronze/20 text-bronze-light text-xs font-medium uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            AI Processing
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Building Your Project Blueprint
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm text-muted mb-10"
        >
          Our AI is analyzing {featureCount} features across your project
        </motion.p>

        {/* Premium morphing bars animation */}
        <AIThinkingState toolColor="orange" messages={processingMessages} hideProgress />

        {/* Overall progress bar - smooth 20s fill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 mb-10 max-w-sm mx-auto"
        >
          <div className="relative w-full h-[2px] rounded-full bg-slate-blue-light/30">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-bronze shadow-[0_0_8px_rgba(192,132,96,0.4)]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 20,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>

        {/* Processing steps indicator - sequential activation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto"
        >
          {[
            { icon: Brain, label: 'Scope Analysis', phase: 0 },
            { icon: DollarSign, label: 'Cost Estimation', phase: 1 },
            { icon: Clock, label: 'Timeline Planning', phase: 2 },
            { icon: Code2, label: 'Tech Stack', phase: 3 },
          ].map((item, i) => {
            const isActive = processingPhase === item.phase;
            const isCompleted = processingPhase > item.phase;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.3 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-500 ${
                  isActive
                    ? 'bg-bronze/15 border-2 border-bronze shadow-[0_0_15px_rgba(192,132,96,0.3)]'
                    : isCompleted
                    ? 'bg-slate-blue-light/40 border border-bronze/30'
                    : 'bg-slate-blue-light/30 border border-bronze/10'
                }`}
              >
                <item.icon
                  className={`h-3.5 w-3.5 transition-colors duration-500 ${
                    isActive ? 'text-bronze' : isCompleted ? 'text-bronze-light/80' : 'text-bronze-light/70'
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-500 ${
                    isActive ? 'text-bronze-light font-semibold' : 'text-muted'
                  }`}
                >
                  {item.label}
                </span>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="ml-auto"
                  >
                    <CheckCircle2 className="h-3 w-3 text-bronze-light" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cancel link */}
        {onCancel && showCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={onCancel}
              className="text-sm text-muted hover:text-off-white underline underline-offset-4 transition-colors duration-200"
            >
              Cancel and go back
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
