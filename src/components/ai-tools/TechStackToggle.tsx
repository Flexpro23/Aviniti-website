'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Code2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TechStackToggleProps {
  techStack: string[];
}

export function TechStackToggle({ techStack }: TechStackToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('get_estimate.results');

  return (
    <div className="rounded-xl border border-slate-blue-light bg-slate-blue/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-slate-blue-light/20 transition-colors duration-200"
      >
        <div className="h-8 w-8 rounded-lg bg-tool-blue/15 flex items-center justify-center flex-shrink-0">
          <Code2 className="h-5 w-5 text-tool-blue-light" />
        </div>
        <span className="flex-1 text-base font-semibold text-white">
          {t('tech_stack_summary', { count: techStack.length })}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-slate-blue-light/60 text-off-white text-sm border border-slate-blue-light"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
