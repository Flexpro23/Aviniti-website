'use client';

/**
 * Company Logos Section — Interactive Typography Marquee
 *
 * Two-row scrolling marquee of styled company names with:
 * - Unique typographic treatment per company
 * - Bronze cursor spotlight reveal effect
 * - Magnetic hover with scale + glow
 * - Pause on hover
 * - Mobile/touch friendly (higher base opacity)
 * - Reduced motion support
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';

// ─── Company Typography Definitions ──────────────────────────────────

interface CompanyStyle {
  name: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform: 'uppercase' | 'lowercase' | 'none';
  fontSize: string;
  fontSizeLg: string;
  fontStyle?: 'italic' | 'normal';
  fontFamily?: string;
  textDecoration?: string;
}

const COMPANIES: CompanyStyle[] = [
  {
    name: 'FlexPro Fitness',
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontSize: '1.5rem',
    fontSizeLg: '1.875rem',
  },
  {
    name: 'SecretaryApp',
    fontWeight: 300,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    fontSize: '1.25rem',
    fontSizeLg: '1.5rem',
  },
  {
    name: 'FarmHouse Delivery',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textTransform: 'none',
    fontSize: '1.5rem',
    fontSizeLg: '1.875rem',
    fontStyle: 'italic',
  },
  {
    name: "Let's Play",
    fontWeight: 800,
    letterSpacing: '0.05em',
    textTransform: 'none',
    fontSize: '1.875rem',
    fontSizeLg: '2.25rem',
  },
  {
    name: 'Nay Nursery',
    fontWeight: 500,
    letterSpacing: '0.3em',
    textTransform: 'lowercase',
    fontSize: '1.25rem',
    fontSizeLg: '1.5rem',
  },
  {
    name: 'SkinVerse',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontSize: '1.5rem',
    fontSizeLg: '1.875rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  {
    name: 'WearShare',
    fontWeight: 400,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontSize: '1.25rem',
    fontSizeLg: '1.5rem',
    textDecoration: 'underline',
  },
];

const ROW_1 = COMPANIES.slice(0, 4);
const ROW_2 = COMPANIES.slice(3, 7);
const ROW_1_ITEMS = [...ROW_1, ...ROW_1, ...ROW_1];
const ROW_2_ITEMS = [...ROW_2, ...ROW_2, ...ROW_2];

// ─── Main Component ──────────────────────────────────────────────────

export function CompanyLogos() {
  const t = useTranslations('home.company_logos');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [spotlightVisible, setSpotlightVisible] = useState(false);

  // Detect touch device
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(hover: none)');
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Cursor tracking — update CSS custom properties directly (no re-renders)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isTouchDevice) return;
      const el = spotlightRef.current;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!el || !rect) return;
      el.style.setProperty('--sx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--sy', `${e.clientY - rect.top}px`);
    },
    [prefersReducedMotion, isTouchDevice]
  );

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion && !isTouchDevice) setSpotlightVisible(true);
  }, [prefersReducedMotion, isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    setSpotlightVisible(false);
  }, []);

  const baseOpacity = prefersReducedMotion ? 1 : isTouchDevice ? 0.4 : 0.15;

  return (
    <Section className="bg-navy-dark overflow-hidden">
      <Container>
        <ScrollReveal>
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </ScrollReveal>
      </Container>

      {/* Full-bleed marquee area */}
      <div
        ref={sectionRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label={t('aria_label')}
      >
        {/* Bronze cursor spotlight — single GPU-composited div */}
        {!prefersReducedMotion && !isTouchDevice && (
          <div
            ref={spotlightRef}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(600px circle at var(--sx, -1000px) var(--sy, -1000px), rgba(192,132,96,0.15) 0%, rgba(192,132,96,0.05) 40%, transparent 70%)',
              opacity: spotlightVisible ? 1 : 0,
              transition: 'opacity 0.4s ease',
              willChange: 'background',
            }}
            aria-hidden="true"
          />
        )}

        <div className="space-y-6 lg:space-y-10">
          <MarqueeRow
            items={ROW_1_ITEMS}
            direction={isRTL ? "rtl" : "ltr"}
            speed={35}
            baseOpacity={baseOpacity}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            rowIndex={1}
            uniqueCount={ROW_1.length}
          />
          <MarqueeRow
            items={ROW_2_ITEMS}
            direction={isRTL ? "ltr" : "rtl"}
            speed={28}
            baseOpacity={baseOpacity}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            rowIndex={2}
            uniqueCount={ROW_2.length}
          />
        </div>
      </div>
    </Section>
  );
}

// ─── Marquee Row ─────────────────────────────────────────────────────

interface MarqueeRowProps {
  items: CompanyStyle[];
  direction: 'ltr' | 'rtl';
  speed: number;
  baseOpacity: number;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  rowIndex: number;
  uniqueCount: number;
}

function MarqueeRow({
  items,
  direction,
  speed,
  baseOpacity,
  prefersReducedMotion,
  isTouchDevice,
  rowIndex,
  uniqueCount,
}: MarqueeRowProps) {
  const [rowHovered, setRowHovered] = useState(false);

  return (
    <div className="relative">
      {/* Gradient fade edges */}
      <div
        className="absolute inset-y-0 start-0 w-24 sm:w-32 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #0F1419 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 end-0 w-24 sm:w-32 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #0F1419 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div
        className="flex items-center gap-10 sm:gap-14 lg:gap-20 py-4"
        style={{
          animation: prefersReducedMotion
            ? 'none'
            : `${direction === 'ltr' ? 'marquee-ltr' : 'marquee-rtl'} ${speed}s linear infinite`,
          animationPlayState: rowHovered && !prefersReducedMotion ? 'paused' : 'running',
        }}
        onMouseEnter={() => setRowHovered(true)}
        onMouseLeave={() => setRowHovered(false)}
      >
        {items.map((company, index) => (
          <CompanyName
            key={`row${rowIndex}-${index}`}
            company={company}
            baseOpacity={baseOpacity}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            ariaHidden={index >= uniqueCount}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Company Name with Magnetic Hover ────────────────────────────────

interface CompanyNameProps {
  company: CompanyStyle;
  baseOpacity: number;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  ariaHidden: boolean;
}

function CompanyName({
  company,
  baseOpacity,
  prefersReducedMotion,
  isTouchDevice,
  ariaHidden,
}: CompanyNameProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const canInteract = !prefersReducedMotion && !isTouchDevice;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (!canInteract) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMagneticOffset({
        x: (e.clientX - cx) * 0.25,
        y: (e.clientY - cy) * 0.25,
      });
    },
    [canInteract]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  // Determine responsive font size via CSS clamp
  const fontSize = `clamp(${company.fontSize}, 2.5vw, ${company.fontSizeLg})`;

  return (
    <span
      ref={ref}
      dir="ltr"
      aria-hidden={ariaHidden || undefined}
      className="flex-shrink-0 cursor-default select-none whitespace-nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        fontWeight: company.fontWeight,
        letterSpacing: company.letterSpacing,
        textTransform: company.textTransform,
        fontSize,
        fontStyle: company.fontStyle || 'normal',
        fontFamily: company.fontFamily || 'inherit',
        textDecorationLine: company.textDecoration || 'none',
        textDecorationColor: isHovered ? '#D4A583' : 'rgba(255,255,255,0.3)',
        textUnderlineOffset: '6px',
        color: isHovered && canInteract
          ? '#D4A583'
          : `rgba(255, 255, 255, ${baseOpacity})`,
        filter: canInteract
          ? isHovered
            ? 'blur(0px)'
            : 'blur(0.5px)'
          : 'none',
        textShadow: isHovered && canInteract
          ? '0 0 30px rgba(192, 132, 96, 0.4), 0 0 60px rgba(192, 132, 96, 0.15)'
          : 'none',
        transform: canInteract
          ? `translate(${magneticOffset.x}px, ${magneticOffset.y}px) scale(${isHovered ? 1.08 : 1})`
          : undefined,
        transition:
          'color 0.3s ease, filter 0.3s ease, text-shadow 0.3s ease, transform 0.2s ease-out, text-decoration-color 0.3s ease',
        willChange: canInteract ? 'transform' : undefined,
      }}
    >
      {company.name}
    </span>
  );
}
