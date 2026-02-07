'use client';

import { motion } from 'framer-motion';
import { DollarSign, Clock, Lightbulb } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function EstimateHeroVisual() {
  const t = useTranslations('get_estimate.hero_visual');

  const cards = [
    {
      icon: DollarSign,
      label: t('cost'),
      value: t('cost_range'),
      color: 'text-bronze-light',
      bg: 'bg-bronze/15',
    },
    {
      icon: Clock,
      label: t('timeline'),
      value: t('timeline_range'),
      color: 'text-tool-blue-light',
      bg: 'bg-tool-blue/15',
    },
    {
      icon: Lightbulb,
      label: t('insights'),
      value: t('insights_count'),
      color: 'text-tool-purple-light',
      bg: 'bg-tool-purple/15',
    },
  ];

  return (
    <div className="hidden md:flex items-end justify-center gap-4 mt-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isCenter = i === 1;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: isCenter ? -4 : 0 }}
            transition={{
              delay: 0.3 + i * 0.15,
              duration: 0.5,
              ease: 'easeOut',
            }}
            className="glass rounded-xl px-5 py-4 text-center min-w-[160px]"
          >
            <div className={`mx-auto mb-2 h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center`}>
              <Icon className={`h-4.5 w-4.5 ${card.color}`} />
            </div>
            <p className="text-xs text-muted mb-0.5">{card.label}</p>
            <p className="text-sm font-semibold text-white">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
