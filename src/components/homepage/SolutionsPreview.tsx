'use client';

/**
 * Solutions Preview Section
 *
 * Showcases ready-made solutions with pricing and delivery time.
 * Features a grid of solution cards with a "View All" CTA.
 */

import { useTranslations } from 'next-intl';
import { Truck, GraduationCap, ShoppingCart, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { Link } from '@/lib/i18n/navigation';
import { solutions } from '@/lib/data/solutions';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  Truck: <Truck className="w-8 h-8" />,
  GraduationCap: <GraduationCap className="w-8 h-8" />,
  ShoppingCart: <ShoppingCart className="w-8 h-8" />,
};

export function SolutionsPreview() {
  const t = useTranslations('home.solutions');
  const st = useTranslations('solutions');

  // Show first 3 solutions
  const previewSolutions = solutions.slice(0, 3);

  return (
    <Section className="bg-navy">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {previewSolutions.map((solution) => (
            <motion.div key={solution.slug} variants={fadeInUp}>
              <Card hover className="h-full flex flex-col">
                <CardHeader className="space-y-4 flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-bronze/10 flex items-center justify-center text-bronze">
                    {iconMap[solution.icon] || <Truck className="w-8 h-8" />}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl">{st(solution.nameKey)}</CardTitle>

                  {/* Description */}
                  <CardDescription className="leading-relaxed">
                    {st(solution.descriptionKey)}
                  </CardDescription>

                  {/* Pricing & Timeline */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="default" size="sm">
                      {t('starting_from')} ${solution.startingPrice.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {solution.timelineDays} {t('delivery')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardFooter>
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href={`/solutions/${solution.slug}`}>
                      {t('learn_more')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/solutions">
                {t('view_all')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
