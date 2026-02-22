'use client';

/**
 * Why Aviniti Section — Premium conversion-focused objection handling
 *
 * Addresses 4 real fears a potential client has when choosing a dev partner.
 * Each card leads with a bold animated stat counter + glowing accent.
 *
 * Visual features:
 * - Frosted glass cards with inner shimmer that follows cursor
 * - Category-colored top accent line with glow
 * - Animated stat counter on scroll
 * - Icon with soft glow pulse
 * - Bronze spotlight across the grid (desktop)
 * - Staggered entrance animations
 * - Mobile: clean layout, no GPU-heavy effects
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Network, ScanEye, Calculator, LifeBuoy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';

// ─── Reason Definitions ─────────────────────────────────────────────

interface Reason {
  Icon: LucideIcon;
  statKey: string;
  titleKey: string;
  descKey: string;
  accentColor: string;
  accentGlow: string;
}

const REASONS: Reason[] = [
  {
    Icon: Network,          // Interconnected systems / ecosystem
    statKey: 'reason_1_stat',
    titleKey: 'reason_1_title',
    descKey: 'reason_1_desc',
    accentColor: '#C08460',
    accentGlow: 'rgba(192, 132, 96, 0.25)',
  },
  {
    Icon: ScanEye,          // Computer vision / AI that sees and analyzes
    statKey: 'reason_2_stat',
    titleKey: 'reason_2_title',
    descKey: 'reason_2_desc',
    accentColor: '#A78BFA',
    accentGlow: 'rgba(167, 139, 250, 0.25)',
  },
  {
    Icon: Calculator,       // Pricing / cost estimation
    statKey: 'reason_3_stat',
    titleKey: 'reason_3_title',
    descKey: 'reason_3_desc',
    accentColor: '#34D399',
    accentGlow: 'rgba(52, 211, 153, 0.25)',
  },
  {
    Icon: LifeBuoy,           // Ongoing support / we're here for you
    statKey: 'reason_4_stat',
    titleKey: 'reason_4_title',
    descKey: 'reason_4_desc',
    accentColor: '#60A5FA',
    accentGlow: 'rgba(96, 165, 250, 0.25)',
  },
];

// ─── Main Component ─────────────────────────────────────────────────

export function WhyChooseUs() {
  const t = useTranslations('home.why_choose');
  const prefersReducedMotion = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [spotlightVisible, setSpotlightVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none)');
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const canSpotlight = !prefersReducedMotion && !isTouchDevice;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canSpotlight) return;
      const el = spotlightRef.current;
      const rect = gridRef.current?.getBoundingClientRect();
      if (!el || !rect) return;
      el.style.setProperty('--gx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--gy', `${e.clientY - rect.top}px`);
    },
    [canSpotlight]
  );

  return (
    <Section className="bg-navy" aria-labelledby="why-choose-heading">
      <Container>
        <ScrollReveal>
          <SectionHeading
            id="why-choose-heading"
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        {/* Grid with spotlight */}
        <div
          ref={gridRef}
          className="relative max-w-5xl mx-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => canSpotlight && setSpotlightVisible(true)}
          onMouseLeave={() => setSpotlightVisible(false)}
        >
          {/* Bronze spotlight overlay */}
          {canSpotlight && (
            <div
              ref={spotlightRef}
              className="absolute inset-0 z-10 pointer-events-none rounded-2xl"
              style={{
                background:
                  'radial-gradient(400px circle at var(--gx, -500px) var(--gy, -500px), rgba(192,132,96,0.08) 0%, transparent 70%)',
                opacity: spotlightVisible ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
              aria-hidden="true"
            />
          )}

          <motion.div
            variants={staggerContainer(0.15, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
          >
            {REASONS.map((reason, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <ReasonCard
                  reason={reason}
                  t={t}
                  canInteract={canSpotlight}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Button
            asChild
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
          >
            <Link href="/get-estimate">{t('cta')}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

// ─── Reason Card ────────────────────────────────────────────────────

interface ReasonCardProps {
  reason: Reason;
  t: ReturnType<typeof useTranslations>;
  canInteract: boolean;
  prefersReducedMotion: boolean;
}

function ReasonCard({ reason, t, canInteract, prefersReducedMotion }: ReasonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [shimmerPos, setShimmerPos] = useState({ x: 0, y: 0 });

  // Track mouse for inner shimmer
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canInteract) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setShimmerPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      });
    },
    [canInteract]
  );

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const { Icon, accentColor, accentGlow } = reason;

  return (
    <div
      ref={cardRef}
      className="relative h-full rounded-xl overflow-hidden cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        cancelAnimationFrame(rafRef.current);
      }}
      style={{
        backgroundColor: isHovered
          ? 'rgba(255, 255, 255, 0.04)'
          : 'rgba(255, 255, 255, 0.015)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: isHovered
          ? `${accentColor}35`
          : 'rgba(255, 255, 255, 0.06)',
        transform: canInteract
          ? isHovered
            ? 'translateY(-4px)'
            : 'translateY(0)'
          : undefined,
        boxShadow: isHovered
          ? `0 12px 40px ${accentGlow}, 0 0 0 1px ${accentColor}10, inset 0 1px 0 rgba(255,255,255,0.06)`
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: canInteract ? 'transform, box-shadow' : undefined,
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent 5%, ${accentColor} 30%, ${accentColor} 70%, transparent 95%)`,
          opacity: isHovered ? 1 : 0.2,
          boxShadow: isHovered ? `0 0 12px ${accentGlow}` : 'none',
        }}
        aria-hidden="true"
      />

      {/* Inner shimmer following cursor */}
      {canInteract && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(250px circle at ${shimmerPos.x}px ${shimmerPos.y}px, ${accentGlow} 0%, transparent 70%)`,
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card content */}
      <div className="relative z-[2] p-6 md:p-8">
        {/* Top row: glowing icon + stat */}
        <div className="flex items-start justify-between mb-6">
          {/* Icon with glow */}
          <div className="relative">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-400"
              style={{
                backgroundColor: `${accentColor}15`,
                boxShadow: isHovered
                  ? `0 0 20px ${accentGlow}, 0 0 40px ${accentColor}10`
                  : 'none',
              }}
            >
              <Icon
                className="w-6 h-6 transition-colors duration-300"
                style={{ color: isHovered ? accentColor : '#C08460' }}
                aria-hidden="true"
              />
            </div>
            {/* Subtle pulse ring behind icon on hover */}
            {isHovered && canInteract && (
              <span
                className="absolute -inset-1 rounded-lg animate-ping"
                style={{
                  backgroundColor: accentColor,
                  opacity: 0.08,
                  animationDuration: '2.5s',
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {/* Stat — large and bold */}
          <StatDisplay
            text={t(reason.statKey)}
            color={accentColor}
            glow={accentGlow}
            isHovered={isHovered}
            canInteract={canInteract}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Title */}
        <h3
          className="text-lg md:text-xl font-semibold mb-3 transition-colors duration-300"
          style={{
            color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {t(reason.titleKey)}
        </h3>

        {/* Description */}
        <p
          className="text-sm md:text-[0.9rem] leading-relaxed transition-colors duration-300"
          style={{
            color: isHovered
              ? 'rgba(255, 255, 255, 0.55)'
              : 'rgba(255, 255, 255, 0.35)',
          }}
        >
          {t(reason.descKey)}
        </p>
      </div>
    </div>
  );
}

// ─── Animated Stat Display ──────────────────────────────────────────

interface StatDisplayProps {
  text: string;
  color: string;
  glow: string;
  isHovered: boolean;
  canInteract: boolean;
  prefersReducedMotion: boolean;
}

function StatDisplay({ text, color, glow, isHovered, canInteract, prefersReducedMotion }: StatDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayText, setDisplayText] = useState(text);

  // Animate the numeric part on first view
  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      setDisplayText(text);
      return;
    }

    // Extract the number from the stat (e.g., "25 apps" → 25)
    const match = text.match(/(\d+)/);
    if (!match) {
      setDisplayText(text);
      return;
    }

    const target = parseInt(match[1], 10);
    const prefix = text.slice(0, match.index);
    const suffix = text.slice((match.index || 0) + match[0].length);
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplayText(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, text, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className="text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300"
      style={{
        color: isHovered && canInteract ? color : `${color}CC`,
        textShadow: isHovered && canInteract
          ? `0 0 20px ${glow}, 0 0 40px ${color}15`
          : 'none',
      }}
    >
      {displayText}
    </span>
  );
}
