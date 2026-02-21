'use client';

/**
 * AI Tools Spotlight Section
 *
 * Highlights the 4 AI-powered tools with distinctive color accents.
 * Features a bento grid layout with Idea Lab as the featured starting point.
 * Includes step indicators, badges, time estimates, and flow connectors.
 */

import { useTranslations } from 'next-intl';
import { Lightbulb, Sparkles, Calculator, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';
import { motion } from 'framer-motion';

type ToolColor = 'orange' | 'blue' | 'green' | 'purple';

interface AITool {
  slug: string;
  icon: React.ReactNode;
  color: ToolColor;
  href: string;
  step: number;
}

export function AIToolsSpotlight() {
  const t = useTranslations('home.ai_tools');
  const prefersReducedMotion = usePrefersReducedMotion();

  const tools: AITool[] = [
    {
      slug: 'idea-lab',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'orange',
      href: '/idea-lab',
      step: 1,
    },
    {
      slug: 'ai-analyzer',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'blue',
      href: '/ai-analyzer',
      step: 2,
    },
    {
      slug: 'get-estimate',
      icon: <Calculator className="w-8 h-8" />,
      color: 'green',
      href: '/get-estimate',
      step: 3,
    },
    {
      slug: 'roi-calculator',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'purple',
      href: '/roi-calculator',
      step: 4,
    },
  ];

  const getColorClasses = (color: ToolColor) => {
    const colors = {
      orange: {
        bg: 'bg-tool-orange/20',
        text: 'text-tool-orange',
        gradient: 'from-tool-orange/40 via-tool-orange/20 to-transparent',
        border: 'border-tool-orange/40',
        glow: 'shadow-[0_0_20px_rgba(255,152,0,0.3)]',
      },
      blue: {
        bg: 'bg-tool-blue/20',
        text: 'text-tool-blue',
        gradient: 'from-tool-blue/40 via-tool-blue/20 to-transparent',
        border: 'border-tool-blue/40',
        glow: 'shadow-[0_0_20px_rgba(33,150,243,0.3)]',
      },
      green: {
        bg: 'bg-tool-green/20',
        text: 'text-tool-green',
        gradient: 'from-tool-green/40 via-tool-green/20 to-transparent',
        border: 'border-tool-green/40',
        glow: 'shadow-[0_0_20px_rgba(76,175,80,0.3)]',
      },
      purple: {
        bg: 'bg-tool-purple/20',
        text: 'text-tool-purple',
        gradient: 'from-tool-purple/40 via-tool-purple/20 to-transparent',
        border: 'border-tool-purple/40',
        glow: 'shadow-[0_0_20px_rgba(156,39,176,0.3)]',
      },
    };
    return colors[color];
  };

  return (
    <Section className="bg-navy-dark" aria-labelledby="ai-tools-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="ai-tools-heading"
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        {/* Journey Flow Bar */}
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-12 flex-wrap">
            {tools.map((tool, index) => {
              const colorClasses = getColorClasses(tool.color);
              return (
                <div key={tool.slug} className="flex items-center gap-3">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full
                        ${colorClasses.bg} ${colorClasses.text}
                        border ${colorClasses.border}
                        font-bold text-sm
                      `}
                    >
                      {tool.step}
                    </div>
                    <span className="text-sm text-off-white/80 hidden sm:inline">
                      {t(`${tool.slug}.name`)}
                    </span>
                  </div>
                  {/* Arrow connector (not for last item) */}
                  {index < tools.length - 1 && (
                    <ChevronRight className={`h-4 w-4 ${colorClasses.text} opacity-50 rtl:rotate-180`} />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tools.map((tool, index) => {
            const colorClasses = getColorClasses(tool.color);
            const isFirst = tool.slug === 'idea-lab';
            const isLast = tool.slug === 'roi-calculator';
            const isWide = isFirst || isLast;

            return (
              <motion.div
                key={tool.slug}
                variants={fadeInUp}
                className={`
                  relative group
                  ${isWide ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Card with animated gradient border on hover */}
                <div className="relative group/cardwrapper h-full">
                  {/* Gradient border glow - appears on hover */}
                  <div
                    className={`
                      absolute -inset-[2px] rounded-lg opacity-0 group-hover/cardwrapper:opacity-100
                      transition-opacity duration-300 pointer-events-none blur-[2px]
                      ${
                        tool.color === 'orange'
                          ? 'bg-gradient-to-r from-tool-orange/60 via-tool-orange/40 to-tool-orange/20'
                          : tool.color === 'blue'
                            ? 'bg-gradient-to-r from-tool-blue/60 via-tool-blue/40 to-tool-blue/20'
                            : tool.color === 'green'
                              ? 'bg-gradient-to-r from-tool-green/60 via-tool-green/40 to-tool-green/20'
                              : 'bg-gradient-to-r from-tool-purple/60 via-tool-purple/40 to-tool-purple/20'
                      }
                    `}
                  />
                  <Card
                    variant="tool"
                    toolColor={tool.color}
                    hover
                    className={`
                      h-full transition-all duration-300 hover:glass-light relative overflow-hidden
                      flex flex-col
                      ${
                        tool.color === 'orange'
                          ? 'group-hover/cardwrapper:shadow-[0_0_20px_rgba(255,152,0,0.3)] group-hover/cardwrapper:border-tool-orange/30'
                          : tool.color === 'blue'
                            ? 'group-hover/cardwrapper:shadow-[0_0_20px_rgba(33,150,243,0.3)] group-hover/cardwrapper:border-tool-blue/30'
                            : tool.color === 'green'
                              ? 'group-hover/cardwrapper:shadow-[0_0_20px_rgba(76,175,80,0.3)] group-hover/cardwrapper:border-tool-green/30'
                              : 'group-hover/cardwrapper:shadow-[0_0_20px_rgba(156,39,176,0.3)] group-hover/cardwrapper:border-tool-purple/30'
                      }
                    `}
                  >
                    {/* Step number indicator */}
                    <div className="absolute top-4 end-4 flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted/60">
                        {t('step_label')}
                      </span>
                      <span
                        className={`
                          text-sm font-bold tabular-nums
                          ${colorClasses.text}
                        `}
                      >
                        {String(tool.step).padStart(2, '0')}
                      </span>
                    </div>

                    {/* "Start Here" badge for Idea Lab */}
                    {isFirst && (
                      <div className="absolute top-4 start-4 z-10">
                        <Badge variant="tool" toolColor={tool.color} size="sm" className="rounded-full">
                          {t(`${tool.slug}.badge`)}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="space-y-4 pt-12 flex-1">
                      {/* Icon with radial gradient background and pulse animation */}
                      <div className="relative">
                        {/* Radial gradient background */}
                        <div
                          className={`
                            absolute inset-0 rounded-xl blur-xl opacity-30
                            ${colorClasses.bg}
                            animate-pulse motion-reduce:animate-none
                          `}
                          style={{
                            width: '80px',
                            height: '80px',
                            transform: 'translate(-10px, -10px)',
                          }}
                        />
                        {/* Icon container */}
                        <motion.div
                          className={`
                            relative w-14 h-14 rounded-xl flex items-center justify-center
                            ${colorClasses.bg} ${colorClasses.text}
                            border ${colorClasses.border}
                          `}
                          whileHover={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 0.4,
                            ease: 'easeInOut',
                          }}
                        >
                          {tool.icon}
                        </motion.div>
                      </div>

                      {/* Title */}
                      <CardTitle className="text-xl">{t(`${tool.slug}.name`)}</CardTitle>

                      {/* Description */}
                      <CardDescription className="leading-relaxed">
                        {t(`${tool.slug}.description`)}
                      </CardDescription>

                      {/* Time estimate */}
                      <div className="pt-2">
                        <span className="text-xs text-muted/70">
                          {t(`${tool.slug}.time`)}
                        </span>
                      </div>
                    </CardHeader>

                    <CardFooter>
                      <Button
                        asChild
                        variant="primary"
                        toolColor={tool.color}
                        size="md"
                        className={isWide ? 'w-full md:w-auto md:min-w-[200px]' : 'w-full'}
                      >
                        <Link href={tool.href}>{t(`${tool.slug}.cta`)}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
