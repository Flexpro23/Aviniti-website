/**
 * OG Image Generation Route
 *
 * Generates branded Open Graph images for all pages.
 * Uses Next.js ImageResponse with Aviniti's design system.
 *
 * Usage:
 *   /api/og?title=Your+Page+Title&description=Short+description&type=page
 *
 * Parameters:
 *   title       — Main headline (required)
 *   description — Subtitle / excerpt (optional)
 *   type        — 'page' | 'blog' | 'solution' | 'tool' (optional, affects badge label)
 *   locale      — 'en' | 'ar' (optional, affects direction)
 *
 * Output: 1200×630 PNG
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Brand colours
const NAVY = '#0A1628';
const NAVY_LIGHT = '#0F1E35';
const BRONZE = '#C08460';
const BRONZE_DIM = 'rgba(192,132,96,0.15)';
const WHITE = '#FFFFFF';
const OFF_WHITE = '#E8E6E1';
const MUTED = '#8B9CB8';

const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog',
  solution: 'Ready-Made Solution',
  tool: 'AI Tool',
  page: 'Aviniti',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') ?? 'Your Ideas, Our Reality';
  const description = searchParams.get('description') ?? 'App Development & AI Solutions from Amman, Jordan.';
  const type = searchParams.get('type') ?? 'page';
  const locale = searchParams.get('locale') ?? 'en';
  const isRTL = locale === 'ar';

  const badgeLabel = TYPE_LABELS[type] ?? 'Aviniti';

  // Truncate long strings for layout safety
  const safeTitle = title.length > 70 ? title.slice(0, 68) + '…' : title;
  const safeDesc = description.length > 130 ? description.slice(0, 128) + '…' : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: NAVY,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {/* Background radial glow — top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,132,96,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Background radial glow — bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,40,80,0.6) 0%, transparent 70%)',
          }}
        />

        {/* Grid dot pattern (subtle) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top bronze accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent 0%, ${BRONZE} 30%, ${BRONZE} 70%, transparent 100%)`,
          }}
        />

        {/* Content wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 72px',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Top row: Badge + Logo wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 32,
                backgroundColor: BRONZE_DIM,
                border: `1px solid rgba(192,132,96,0.35)`,
              }}
            >
              {/* Sparkle dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: BRONZE,
                }}
              />
              <span
                style={{
                  color: BRONZE,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {badgeLabel}
              </span>
            </div>

            {/* Aviniti wordmark */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Logo icon (stylised A) */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: BRONZE_DIM,
                  border: `1px solid rgba(192,132,96,0.4)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 800,
                  color: BRONZE,
                  letterSpacing: '-0.02em',
                }}
              >
                A
              </div>
              <span
                style={{
                  color: WHITE,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                Aviniti
              </span>
            </div>
          </div>

          {/* Middle: Title + Description */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              maxWidth: 860,
            }}
          >
            {/* Decorative left-border line */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 5,
                  borderRadius: 4,
                  backgroundColor: BRONZE,
                  alignSelf: 'stretch',
                  flexShrink: 0,
                  minHeight: 48,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <span
                  style={{
                    color: WHITE,
                    fontSize: safeTitle.length > 50 ? 46 : 54,
                    fontWeight: 800,
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {safeTitle}
                </span>
                {safeDesc && (
                  <span
                    style={{
                      color: MUTED,
                      fontSize: 22,
                      lineHeight: 1.5,
                      fontWeight: 400,
                    }}
                  >
                    {safeDesc}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row: URL + Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Site URL */}
            <span
              style={{
                color: MUTED,
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
            >
              www.aviniti.app
            </span>

            {/* Tagline pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 22px',
                borderRadius: 32,
                backgroundColor: NAVY_LIGHT,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ color: OFF_WHITE, fontSize: 17, fontWeight: 500 }}>
                Your Ideas, Our Reality
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
