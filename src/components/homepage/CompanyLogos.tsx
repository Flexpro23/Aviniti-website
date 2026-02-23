'use client';

/**
 * Product Showcase Belt — "Built for Real Businesses"
 *
 * Two-row scrolling marquee of premium product cards:
 * - Frosted glass cards with category accent line
 * - Bronze cursor spotlight effect (desktop)
 * - Glowing category dots + hover shimmer
 * - Magnetic hover with lift + category glow
 * - Pause on hover, RTL-aware
 * - Mobile-optimized (compact cards, touch-friendly opacity)
 * - Reduced motion support
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';

// ─── Product Definitions ────────────────────────────────────────────

interface Product {
  key: string;
  category: 'ai' | 'health' | 'delivery' | 'education' | 'ecommerce' | 'lifestyle' | 'business';
}

/** Category colors — used for accent line, dot glow, and hover tint */
const CATEGORY_COLORS: Record<Product['category'], { main: string; glow: string }> = {
  ai:         { main: '#A78BFA', glow: 'rgba(167, 139, 250, 0.25)' },
  health:     { main: '#34D399', glow: 'rgba(52, 211, 153, 0.25)' },
  delivery:   { main: '#F97316', glow: 'rgba(249, 115, 22, 0.25)' },
  education:  { main: '#60A5FA', glow: 'rgba(96, 165, 250, 0.25)' },
  ecommerce:  { main: '#F472B6', glow: 'rgba(244, 114, 182, 0.25)' },
  lifestyle:  { main: '#FBBF24', glow: 'rgba(251, 191, 36, 0.25)' },
  business:   { main: '#C08460', glow: 'rgba(192, 132, 96, 0.30)' },
};

const PRODUCTS: Product[] = [
  { key: 'skinverse', category: 'ai' },
  { key: 'calibre', category: 'business' },
  { key: 'nay_nursery', category: 'education' },
  { key: 'secretary', category: 'business' },
  { key: 'hairvision', category: 'ai' },
  { key: 'wear_and_share', category: 'ecommerce' },
  { key: 'ai_cdss_dfu', category: 'health' },
  { key: 'pickleball', category: 'lifestyle' },
  { key: 'flex_pro', category: 'delivery' },
  { key: 'sensual', category: 'ai' },
  { key: 'nerd', category: 'education' },
];

const ROW_1 = PRODUCTS.slice(0, 6);
const ROW_2 = PRODUCTS.slice(6);
const ROW_1_ITEMS = [...ROW_1, ...ROW_1, ...ROW_1];
const ROW_2_ITEMS = [...ROW_2, ...ROW_2, ...ROW_2];

// ─── Main Component ─────────────────────────────────────────────────

export function CompanyLogos() {
  const t = useTranslations('home.product_belt');
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

  const canSpotlight = !prefersReducedMotion && !isTouchDevice;

  // Cursor spotlight tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canSpotlight) return;
      const el = spotlightRef.current;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!el || !rect) return;
      el.style.setProperty('--sx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--sy', `${e.clientY - rect.top}px`);
    },
    [canSpotlight]
  );

  return (
    <Section className="bg-navy-dark overflow-hidden">
      <Container>
        <ScrollReveal>
          <SectionHeading
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-12 md:mb-16"
          />
        </ScrollReveal>
      </Container>

      {/* Full-bleed marquee area with spotlight */}
      <div
        ref={sectionRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => canSpotlight && setSpotlightVisible(true)}
        onMouseLeave={() => setSpotlightVisible(false)}
        role="region"
        aria-label={t('aria_label')}
      >
        {/* Bronze cursor spotlight overlay */}
        {canSpotlight && (
          <div
            ref={spotlightRef}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(500px circle at var(--sx, -1000px) var(--sy, -1000px), rgba(192,132,96,0.12) 0%, rgba(192,132,96,0.04) 40%, transparent 70%)',
              opacity: spotlightVisible ? 1 : 0,
              transition: 'opacity 0.4s ease',
              willChange: 'background',
            }}
            aria-hidden="true"
          />
        )}

        {/* Gradient fade edges */}
        <div
          className="absolute inset-y-0 start-0 w-16 sm:w-24 md:w-36 z-20 pointer-events-none ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-[var(--color-navy-dark)] to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-y-0 end-0 w-16 sm:w-24 md:w-36 z-20 pointer-events-none ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-[var(--color-navy-dark)] to-transparent"
          aria-hidden="true"
        />

        <div className="space-y-4 md:space-y-5">
          <MarqueeRow
            items={ROW_1_ITEMS}
            direction={isRTL ? 'rtl' : 'ltr'}
            speed={50}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            rowIndex={1}
            uniqueCount={ROW_1.length}
            t={t}
          />
          <MarqueeRow
            items={ROW_2_ITEMS}
            direction={isRTL ? 'ltr' : 'rtl'}
            speed={42}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            rowIndex={2}
            uniqueCount={ROW_2.length}
            t={t}
          />
        </div>
      </div>
    </Section>
  );
}

// ─── Marquee Row ────────────────────────────────────────────────────

interface MarqueeRowProps {
  items: Product[];
  direction: 'ltr' | 'rtl';
  speed: number;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  rowIndex: number;
  uniqueCount: number;
  t: ReturnType<typeof useTranslations>;
}

function MarqueeRow({
  items,
  direction,
  speed,
  prefersReducedMotion,
  isTouchDevice,
  rowIndex,
  uniqueCount,
  t,
}: MarqueeRowProps) {
  const [rowHovered, setRowHovered] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-stretch gap-3 md:gap-4 py-1"
        style={{
          animation: prefersReducedMotion
            ? 'none'
            : `${direction === 'ltr' ? 'marquee-ltr' : 'marquee-rtl'} ${speed}s linear infinite`,
          animationPlayState: rowHovered && !prefersReducedMotion ? 'paused' : 'running',
          willChange: 'transform',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        onMouseEnter={() => setRowHovered(true)}
        onMouseLeave={() => setRowHovered(false)}
      >
        {items.map((product, index) => (
          <ProductCard
            key={`row${rowIndex}-${index}`}
            product={product}
            ariaHidden={index >= uniqueCount}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Product Card ───────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  ariaHidden: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  t: ReturnType<typeof useTranslations>;
}

function ProductCard({
  product,
  ariaHidden,
  prefersReducedMotion,
  isTouchDevice,
  t,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [shimmerPos, setShimmerPos] = useState({ x: 0, y: 0 });

  const colors = CATEGORY_COLORS[product.category];
  const canInteract = !prefersReducedMotion && !isTouchDevice;

  // Track mouse position for shimmer/highlight effect inside card
  const handleCardMouseMove = useCallback(
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

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={() => {
        setIsHovered(false);
        cancelAnimationFrame(rafRef.current);
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-xl overflow-hidden cursor-default w-[220px] sm:w-[250px] md:w-[280px]"
        style={{
          /* Glass card base */
          backgroundColor: isHovered
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: isHovered
            ? `${colors.main}40`
            : 'rgba(255, 255, 255, 0.06)',
          transform: canInteract
            ? isHovered
              ? 'translateY(-3px) scale(1.02)'
              : 'translateY(0) scale(1)'
            : undefined,
          boxShadow: isHovered
            ? `0 8px 32px ${colors.glow}, 0 0 0 1px ${colors.main}15, inset 0 1px 0 rgba(255,255,255,0.06)`
            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: canInteract ? 'transform, box-shadow' : undefined,
        }}
      >
        {/* Category accent line at top */}
        <div
          className="h-[2px] w-full transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${colors.main} 30%, ${colors.main} 70%, transparent 100%)`,
            opacity: isHovered ? 1 : 0.3,
          }}
          aria-hidden="true"
        />

        {/* Shimmer / inner glow that follows mouse (desktop) */}
        {canInteract && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(200px circle at ${shimmerPos.x}px ${shimmerPos.y}px, ${colors.glow} 0%, transparent 70%)`,
              opacity: 0.6,
              transition: 'opacity 0.2s ease',
            }}
            aria-hidden="true"
          />
        )}

        {/* Card content */}
        <div className="relative z-[1] px-4 py-3 md:px-5 md:py-4">
          {/* Top row: glowing dot + product name */}
          <div className="flex items-center gap-2.5 mb-2">
            {/* Glowing category dot */}
            <span
              className="relative w-2.5 h-2.5 rounded-full flex-shrink-0"
              aria-hidden="true"
            >
              <span
                className="absolute inset-0 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: colors.main,
                  boxShadow: isHovered
                    ? `0 0 8px ${colors.main}, 0 0 16px ${colors.glow}`
                    : 'none',
                }}
              />
              {/* Pulse ring on hover */}
              {isHovered && canInteract && (
                <span
                  className="absolute -inset-1 rounded-full animate-ping"
                  style={{
                    backgroundColor: colors.main,
                    opacity: 0.2,
                    animationDuration: '2s',
                  }}
                />
              )}
            </span>

            {/* Product name */}
            <span
              className="font-semibold text-sm md:text-[0.95rem] tracking-wide truncate transition-all duration-300"
              style={{
                color: isHovered ? '#D4A583' : 'rgba(255, 255, 255, 0.85)',
                textShadow: isHovered
                  ? '0 0 20px rgba(192, 132, 96, 0.3)'
                  : 'none',
              }}
              dir="ltr"
            >
              {t(`products.${product.key}.name`)}
            </span>
          </div>

          {/* Description — 2 lines max */}
          <p
            className="text-xs md:text-[0.8rem] leading-relaxed line-clamp-2 transition-colors duration-300"
            style={{
              color: isHovered
                ? 'rgba(255, 255, 255, 0.55)'
                : 'rgba(255, 255, 255, 0.3)',
            }}
          >
            {t(`products.${product.key}.desc`)}
          </p>

          {/* Category label */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <span
              className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest transition-all duration-300"
              style={{
                color: isHovered ? colors.main : 'rgba(255, 255, 255, 0.15)',
                textShadow: isHovered
                  ? `0 0 12px ${colors.glow}`
                  : 'none',
              }}
            >
              {t(`categories.${product.category}`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
