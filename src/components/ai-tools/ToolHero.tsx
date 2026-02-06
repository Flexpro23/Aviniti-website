/**
 * Tool Hero Section
 *
 * Hero section for AI tool pages with accent color theming.
 * Displays tool name, description, and CTA.
 *
 * Props:
 * - toolSlug: Identifier for tool (idea-lab, ai-analyzer, etc.)
 * - title: Tool name
 * - description: Tool description
 * - ctaText: CTA button text
 * - toolColor: Accent color (orange, blue, green, purple)
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { cn } from '@/lib/utils/cn';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ToolHeroProps {
  toolSlug: string;
  title: string;
  description: string;
  ctaText: string;
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  onCTAClick?: () => void;
}

const colorClasses = {
  orange: 'text-tool-orange',
  blue: 'text-tool-blue',
  green: 'text-tool-green',
  purple: 'text-tool-purple',
};

export function ToolHero({
  title,
  description,
  ctaText,
  toolColor,
  onCTAClick,
}: ToolHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16">
      <motion.div
        variants={prefersReducedMotion ? {} : staggerContainer(0, 0.1)}
        initial="hidden"
        animate="visible"
        className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Label */}
        <motion.div variants={fadeInUp}>
          <SectionLabel className={cn('justify-center', colorClasses[toolColor])}>
            AI Tool
          </SectionLabel>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={fadeInUp} className="text-h1 text-white mt-4">
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-lg text-muted mt-6 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-8">
          <Button
            size="lg"
            toolColor={toolColor}
            rightIcon={<ArrowRight />}
            onClick={onCTAClick}
          >
            {ctaText}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
