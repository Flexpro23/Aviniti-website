'use client';

/**
 * AI Tools Spotlight Section
 *
 * Highlights the 4 AI-powered tools with distinctive color accents.
 * Each tool card features a unique color theme.
 */

import { useTranslations } from 'next-intl';
import { Lightbulb, Sparkles, Calculator, TrendingUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

type ToolColor = 'orange' | 'blue' | 'green' | 'purple';

interface AITool {
  slug: string;
  icon: React.ReactNode;
  color: ToolColor;
  href: string;
}

export function AIToolsSpotlight() {
  const t = useTranslations('home.ai_tools');

  const tools: AITool[] = [
    {
      slug: 'idea-lab',
      icon: <Lightbulb className="w-8 h-8" />,
      color: 'orange',
      href: '/idea-lab',
    },
    {
      slug: 'ai-analyzer',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'blue',
      href: '/ai-analyzer',
    },
    {
      slug: 'get-estimate',
      icon: <Calculator className="w-8 h-8" />,
      color: 'green',
      href: '/get-estimate',
    },
    {
      slug: 'roi-calculator',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'purple',
      href: '/roi-calculator',
    },
  ];

  return (
    <Section className="bg-navy-dark">
      <Container>
        <ScrollReveal>
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <motion.div
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.slug} variants={fadeInUp}>
              <Card
                variant="tool"
                toolColor={tool.color}
                hover
                className="h-full transition-all duration-300 hover:glass-light"
              >
                <CardHeader className="space-y-4">
                  {/* Icon with tool color */}
                  <div
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center
                      ${tool.color === 'orange' ? 'bg-tool-orange/20 text-tool-orange' : ''}
                      ${tool.color === 'blue' ? 'bg-tool-blue/20 text-tool-blue' : ''}
                      ${tool.color === 'green' ? 'bg-tool-green/20 text-tool-green' : ''}
                      ${tool.color === 'purple' ? 'bg-tool-purple/20 text-tool-purple' : ''}
                    `}
                  >
                    {tool.icon}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl">{t(`${tool.slug}.name`)}</CardTitle>

                  {/* Description */}
                  <CardDescription className="leading-relaxed">
                    {t(`${tool.slug}.description`)}
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button asChild variant="primary" toolColor={tool.color} size="md" className="w-full">
                    <Link href={tool.href}>{t(`${tool.slug}.cta`)}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
