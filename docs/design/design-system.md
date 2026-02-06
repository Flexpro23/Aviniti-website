# Aviniti Design System
**Version:** 1.0
**Last Updated:** February 2026
**Theme:** Dark only
**Font:** Inter (Next.js font optimization)
**Framework:** Next.js + Tailwind CSS v4 + Framer Motion

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography Scale](#2-typography-scale)
3. [Spacing System](#3-spacing-system)
4. [Grid and Layout](#4-grid-and-layout)
5. [Shadows and Elevation](#5-shadows-and-elevation)
6. [Borders and Radius](#6-borders-and-radius)
7. [Component Design Tokens](#7-component-design-tokens)
8. [Iconography](#8-iconography)
9. [Animation and Motion](#9-animation-and-motion)
10. [Tailwind Configuration](#10-tailwind-configuration)

---

## 1. Color System

### 1.1 Core Palette

Every color below is provided with its hex value, HSL equivalent, and the Tailwind config key used throughout the codebase. All colors are tuned for dark-theme legibility.

#### Background Colors

| Token | Hex | HSL | Tailwind Key | Usage |
|-------|-----|-----|-------------|-------|
| Deep Navy | `#0F1419` | `210 27% 8%` | `navy` | Page background, root `<body>` fill |
| Slate Blue | `#1A2332` | `215 30% 15%` | `slate-blue` | Card backgrounds, sections with subtle elevation |
| Slate Blue Light | `#243044` | `215 30% 20%` | `slate-blue-light` | Borders, dividers, hover overlays, subtle surface lift |
| Slate Dark | `#0D1117` | `215 30% 7%` | `slate-dark` | Footer background, deeper surfaces, code blocks |

#### Accent Colors (Bronze Family)

| Token | Hex | HSL | Tailwind Key | Usage |
|-------|-----|-----|-------------|-------|
| Bronze | `#C08460` | `20 40% 56%` | `bronze` | Primary CTA buttons, links, active states, logo |
| Bronze Hover | `#A6714E` | `20 36% 48%` | `bronze-hover` | Button hover, pressed link state |
| Bronze Light | `#D4A583` | `20 42% 67%` | `bronze-light` | Secondary accents, tags, decorative borders |
| Bronze Muted | `#8B6344` | `20 35% 40%` | `bronze-muted` | Disabled bronze elements, background tints |
| Bronze Glow | `rgba(192, 132, 96, 0.15)` | -- | `bronze-glow` | Glow behind CTAs, focus rings |

#### Text Colors

| Token | Hex | HSL | Tailwind Key | Usage |
|-------|-----|-----|-------------|-------|
| White | `#FFFFFF` | `0 0% 100%` | `white` | Headings, primary emphasis, hero text |
| Off-White | `#F4F4F2` | `60 8% 96%` | `off-white` | Body text on dark backgrounds |
| Muted | `#9CA3AF` | `216 12% 65%` | `muted` | Secondary text, descriptions, captions |
| Muted Light | `#6B7280` | `220 9% 46%` | `muted-light` | Tertiary text, placeholders, disabled text |

#### Semantic / Status Colors

| Token | Hex | HSL | Tailwind Key | Usage |
|-------|-----|-----|-------------|-------|
| Success | `#34D399` | `160 64% 52%` | `success` | Positive feedback, completed steps, valid inputs |
| Success Dark | `#065F46` | `160 88% 20%` | `success-dark` | Success background tint |
| Warning | `#FBBF24` | `43 96% 56%` | `warning` | Caution messages, low-severity alerts |
| Warning Dark | `#78350F` | `28 79% 26%` | `warning-dark` | Warning background tint |
| Error | `#F87171` | `0 91% 71%` | `error` | Form errors, destructive actions, failures |
| Error Dark | `#7F1D1D` | `0 62% 30%` | `error-dark` | Error background tint |
| Info | `#60A5FA` | `217 91% 68%` | `info` | Informational banners, helper text |
| Info Dark | `#1E3A5F` | `215 52% 24%` | `info-dark` | Info background tint |

#### AI Tool Accent Colors

Each of the four AI tools has a unique accent that must stand out on dark backgrounds. Each accent includes a primary color, a darker shade for backgrounds, and a lighter shade for text on dark tinted surfaces.

| Tool | Primary | Dark BG Tint | Light Text | Tailwind Prefix |
|------|---------|-------------|------------|----------------|
| Idea Lab | `#F97316` (orange-500) | `#431407` (orange-950) | `#FDBA74` (orange-300) | `tool-orange` |
| AI Idea Analyzer | `#3B82F6` (blue-500) | `#172554` (blue-950) | `#93C5FD` (blue-300) | `tool-blue` |
| Get AI Estimate | `#22C55E` (green-500) | `#052E16` (green-950) | `#86EFAC` (green-300) | `tool-green` |
| AI ROI Calculator | `#A855F7` (purple-500) | `#3B0764` (purple-950) | `#D8B4FE` (purple-300) | `tool-purple` |

**Usage rule:** The primary accent is used for icons, progress indicators, and small highlights. The dark BG tint is used as the card or section background. The light text shade is used for labels and descriptions sitting on the dark tint. Never use the primary accent as a background fill -- it is too bright on dark surfaces.

### 1.2 Semantic Token Map

These aliases map design intent to specific palette values. Use these names in component code, never raw hex values.

```
/* Backgrounds */
--bg-primary:       #0F1419   /* navy - page root */
--bg-secondary:     #1A2332   /* slate-blue - elevated cards */
--bg-tertiary:      #243044   /* slate-blue-light - hover, overlays */
--bg-footer:        #0D1117   /* slate-dark */
--bg-overlay:       rgba(15, 20, 25, 0.80)  /* modals, drawers */

/* Surfaces (components sitting on backgrounds) */
--surface-card:     #1A2332
--surface-card-hover: #243044
--surface-input:    #1A2332
--surface-input-focus: #243044

/* Text */
--text-primary:     #FFFFFF   /* headings */
--text-secondary:   #F4F4F2   /* body */
--text-tertiary:    #9CA3AF   /* muted */
--text-disabled:    #6B7280   /* placeholder, disabled */

/* Borders */
--border-default:   #243044
--border-hover:     #374151
--border-focus:     #C08460   /* bronze ring on focus */
--border-error:     #F87171

/* Accent */
--accent-primary:   #C08460   /* bronze */
--accent-hover:     #A6714E
--accent-light:     #D4A583
--accent-muted:     #8B6344
```

### 1.3 Color Usage Rules

1. **Never use pure black (`#000000`) as a background.** The darkest value is Deep Navy `#0F1419`.
2. **Bronze is reserved for interactive elements.** Buttons, links, active tabs, focus rings. Do not use bronze for passive decoration or large background fills.
3. **Off-White for body copy, White for headings.** This subtle difference creates typographic hierarchy without additional weight.
4. **Muted text must only appear on dark backgrounds** where it meets the 4.5:1 contrast threshold.
5. **Status colors are functional only.** Do not use Success green as a decorative color; it signals positive outcomes exclusively.
6. **AI tool accents stay scoped.** Each accent only appears within its respective tool's UI -- never mixed with another tool's accent on the same screen.
7. **Gradients use brand colors only.** No arbitrary gradient stops.

### 1.4 Contrast Ratios (WCAG AA Compliance)

All ratios validated against the backgrounds they appear on.

| Foreground | Background | Ratio | Pass (AA) | Usage Context |
|-----------|-----------|-------|-----------|---------------|
| White `#FFFFFF` | Navy `#0F1419` | 17.4:1 | Yes | Headings on page background |
| Off-White `#F4F4F2` | Navy `#0F1419` | 16.1:1 | Yes | Body text on page background |
| Off-White `#F4F4F2` | Slate Blue `#1A2332` | 11.2:1 | Yes | Body text on cards |
| Muted `#9CA3AF` | Navy `#0F1419` | 7.3:1 | Yes | Secondary text on page background |
| Muted `#9CA3AF` | Slate Blue `#1A2332` | 5.1:1 | Yes | Secondary text on cards |
| Bronze `#C08460` | Navy `#0F1419` | 5.8:1 | Yes | Accent text on page background |
| Bronze `#C08460` | Slate Blue `#1A2332` | 4.1:1 | Yes (large text only) | Accent labels on cards (min 18px or 14px bold) |
| White `#FFFFFF` | Bronze `#C08460` | 3.0:1 | Yes (large text) | Button text -- buttons use min 16px bold |
| Navy `#0F1419` | Bronze `#C08460` | 5.8:1 | Yes | Alt button text on bronze background |
| Error `#F87171` | Navy `#0F1419` | 6.8:1 | Yes | Error messages |
| Success `#34D399` | Navy `#0F1419` | 9.3:1 | Yes | Success messages |

#### AI Tool Accent Contrast Ratios

The -400 shades are used for icon/label text on dark backgrounds. The -500 shades are used as button fill backgrounds with white or navy text.

**Tool accent text on Navy (for labels, icons, descriptions):**

| Foreground | Background | Ratio | Pass (AA) | Usage Context |
|-----------|-----------|-------|-----------|---------------|
| Orange-400 `#FB923C` | Navy `#0F1419` | 8.2:1 | Yes | Idea Lab labels, icons on dark bg |
| Blue-400 `#60A5FA` | Navy `#0F1419` | 7.3:1 | Yes | AI Analyzer labels, icons on dark bg |
| Green-400 `#4ADE80` | Navy `#0F1419` | 10.6:1 | Yes | Get Estimate labels, icons on dark bg |
| Purple-400 `#C084FC` | Navy `#0F1419` | 7.0:1 | Yes | ROI Calculator labels, icons on dark bg |

**White text on tool-colored button backgrounds:**

| Foreground | Background | Ratio | Pass (AA) | Recommendation |
|-----------|-----------|-------|-----------|----------------|
| White `#FFFFFF` | Orange-500 `#F97316` | 2.8:1 | Large text only (16px/600+) | Same rule as bronze: min `text-base font-semibold` |
| White `#FFFFFF` | Blue-500 `#3B82F6` | 3.7:1 | Yes (large text) | Passes AA for 16px/600+ text |
| White `#FFFFFF` | Green-500 `#22C55E` | 2.3:1 | **FAILS AA** | **Use navy text instead:** `bg-green-500 text-navy` |
| White `#FFFFFF` | Purple-500 `#A855F7` | 4.0:1 | Yes (large text) | Passes AA for 16px/600+ text |

**Navy text on tool-colored button backgrounds (accessible alternative):**

| Foreground | Background | Ratio | Pass (AA) | Usage Context |
|-----------|-----------|-------|-----------|---------------|
| Navy `#0F1419` | Orange-500 `#F97316` | 6.6:1 | Yes | Accessible text on orange buttons |
| Navy `#0F1419` | Blue-500 `#3B82F6` | 5.0:1 | Yes | Accessible text on blue buttons |
| Navy `#0F1419` | Green-500 `#22C55E` | 8.1:1 | Yes | **Required** for green buttons |
| Navy `#0F1419` | Purple-500 `#A855F7` | 4.7:1 | Yes | Accessible text on purple buttons |

**Important:** White text on Bronze buttons achieves a 3.0:1 ratio, which passes for large text (WCAG AA defines large text as 18px regular or 14px bold). All bronze buttons in this system use a minimum of 16px font-weight-600, qualifying as large text. For any smaller bronze UI element where white text would appear, use Deep Navy `#0F1419` as the text color instead.

**Bronze/Tool-Color Button Minimum Size Rule:** White text on bronze (`#C08460`) has a 3.0:1 contrast ratio. This passes WCAG AA only for large text (18px at weight 400, or 16px at weight 600+). **RULE: All bronze-background buttons MUST use minimum `text-base font-semibold` (16px, 600 weight).** For smaller text sizes, use navy text on bronze instead: `bg-bronze text-navy`. The same rule applies to all tool accent color buttons -- specifically:
- **Orange-500 buttons:** min `text-base font-semibold` for white text, or use `text-navy` for any size.
- **Blue-500 buttons:** min `text-base font-semibold` for white text, or use `text-navy` for any size.
- **Green-500 buttons:** **Always use `text-navy`** -- white text fails contrast at all sizes.
- **Purple-500 buttons:** min `text-base font-semibold` for white text, or use `text-navy` for any size.

### 1.5 Gradient Definitions

Gradients are used sparingly for hero sections, CTA backgrounds, and decorative elements.

| Name | CSS | Tailwind Class | Usage |
|------|-----|---------------|-------|
| Hero Fade | `linear-gradient(180deg, #0F1419 0%, #1A2332 100%)` | `bg-gradient-to-b from-navy to-slate-blue` | Hero section vertical transition |
| Bronze Shine | `linear-gradient(135deg, #C08460 0%, #D4A583 50%, #C08460 100%)` | `bg-gradient-to-br from-bronze via-bronze-light to-bronze` | Premium CTA shimmer |
| Card Glow | `radial-gradient(ellipse at top, rgba(192,132,96,0.08) 0%, transparent 70%)` | Custom utility `bg-card-glow` | Subtle glow at top of featured cards |
| Section Divider | `linear-gradient(90deg, transparent 0%, #243044 50%, transparent 100%)` | Custom utility `bg-divider-fade` | Horizontal rule replacement |
| Navy Vignette | `radial-gradient(ellipse at center, #1A2332 0%, #0F1419 70%)` | Custom utility `bg-vignette` | Centering attention on hero content |
| Tool Orange | `linear-gradient(135deg, #431407 0%, #1A2332 100%)` | `bg-gradient-to-br from-tool-orange-dark to-slate-blue` | Idea Lab card background |
| Tool Blue | `linear-gradient(135deg, #172554 0%, #1A2332 100%)` | `bg-gradient-to-br from-tool-blue-dark to-slate-blue` | AI Analyzer card background |
| Tool Green | `linear-gradient(135deg, #052E16 0%, #1A2332 100%)` | `bg-gradient-to-br from-tool-green-dark to-slate-blue` | Get Estimate card background |
| Tool Purple | `linear-gradient(135deg, #3B0764 0%, #1A2332 100%)` | `bg-gradient-to-br from-tool-purple-dark to-slate-blue` | ROI Calculator card background |

---

## 2. Typography Scale

### 2.1 Font Stack

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono',
             Menlo, Consolas, 'Liberation Mono', monospace;
```

**Inter** is loaded via `next/font/google` with the following subsets and weights:

```ts
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});
```

### 2.2 Type Scale

Base size: `16px` (1rem). Scale ratio: ~1.25 (Major Third).

| Token | Size (rem) | Size (px) | Line Height | Letter Spacing | Tailwind Class |
|-------|-----------|-----------|-------------|----------------|---------------|
| `xs` | 0.75 | 12 | 1.5 (18px) | 0.02em | `text-xs` |
| `sm` | 0.875 | 14 | 1.5 (21px) | 0.01em | `text-sm` |
| `base` | 1.0 | 16 | 1.625 (26px) | 0em | `text-base` |
| `lg` | 1.125 | 18 | 1.556 (28px) | -0.01em | `text-lg` |
| `xl` | 1.25 | 20 | 1.5 (30px) | -0.01em | `text-xl` |
| `2xl` | 1.5 | 24 | 1.333 (32px) | -0.015em | `text-2xl` |
| `3xl` | 1.875 | 30 | 1.267 (38px) | -0.02em | `text-3xl` |
| `4xl` | 2.25 | 36 | 1.222 (44px) | -0.02em | `text-4xl` |
| `5xl` | 3.0 | 48 | 1.167 (56px) | -0.025em | `text-5xl` |
| `6xl` | 3.75 | 60 | 1.1 (66px) | -0.025em | `text-6xl` |

### 2.3 Heading Styles

Headings use `clamp()` for fluid responsive scaling. The three values are: minimum (mobile), preferred (fluid), maximum (desktop).

| Element | Mobile | Desktop | Weight | Color | Tailwind Utility |
|---------|--------|---------|--------|-------|-----------------|
| **Display** | 36px | 72px | 800 | White | `text-display` |
| **H1** | 30px | 60px | 700 | White | `text-h1` |
| **H2** | 24px | 42px | 700 | White | `text-h2` |
| **H3** | 20px | 30px | 600 | White | `text-h3` |
| **H4** | 18px | 24px | 600 | White | `text-h4` |
| **H5** | 16px | 20px | 600 | Off-White | `text-h5` |
| **H6** | 14px | 16px | 600 | Off-White | `text-h6` |

**CSS `clamp()` definitions:**

```css
.text-display { font-size: clamp(2.25rem, 5vw + 1rem, 4.5rem); line-height: 1.1; letter-spacing: -0.03em; font-weight: 800; }
.text-h1      { font-size: clamp(1.875rem, 4vw + 0.5rem, 3.75rem); line-height: 1.1; letter-spacing: -0.025em; font-weight: 700; }
.text-h2      { font-size: clamp(1.5rem, 3vw + 0.25rem, 2.625rem); line-height: 1.2; letter-spacing: -0.02em; font-weight: 700; }
.text-h3      { font-size: clamp(1.25rem, 2vw + 0.25rem, 1.875rem); line-height: 1.267; letter-spacing: -0.015em; font-weight: 600; }
.text-h4      { font-size: clamp(1.125rem, 1.5vw + 0.25rem, 1.5rem); line-height: 1.333; letter-spacing: -0.01em; font-weight: 600; }
.text-h5      { font-size: clamp(1rem, 1vw + 0.25rem, 1.25rem); line-height: 1.4; letter-spacing: -0.01em; font-weight: 600; }
.text-h6      { font-size: clamp(0.875rem, 0.5vw + 0.5rem, 1rem); line-height: 1.5; letter-spacing: 0em; font-weight: 600; }
```

### 2.4 Body Text Styles

| Style | Size | Line Height | Weight | Color | Usage |
|-------|------|-------------|--------|-------|-------|
| Body Large | 18px / `text-lg` | 1.75 (32px) | 400 | Off-White | Hero descriptions, lead paragraphs |
| Body Base | 16px / `text-base` | 1.625 (26px) | 400 | Off-White | Default paragraph text |
| Body Small | 14px / `text-sm` | 1.5 (21px) | 400 | Muted | Captions, helper text, metadata |
| Body XS | 12px / `text-xs` | 1.5 (18px) | 400 | Muted | Legal text, timestamps |
| Body Medium | 16px / `text-base` | 1.625 | 500 | Off-White | Emphasized body text, labels |

### 2.5 Special Text Styles

| Style | CSS | Usage |
|-------|-----|-------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` | Above section headings (e.g., "OUR SERVICES") |
| Stat Number | `text-5xl font-extrabold text-white tabular-nums` | Animated counter numbers |
| Stat Label | `text-sm font-medium text-muted` | Below counter numbers |
| Blockquote | `text-lg italic text-off-white border-l-2 border-bronze pl-6` | Testimonial quotes |
| Code Inline | `font-mono text-sm bg-slate-blue-light px-1.5 py-0.5 rounded text-bronze-light` | Inline code snippets |
| Code Block | `font-mono text-sm bg-slate-dark p-4 rounded-lg text-off-white` | Multi-line code blocks |
| Link | `text-bronze underline-offset-4 hover:underline hover:text-bronze-light transition-colors` | Inline text links |
| Nav Link | `text-sm font-medium text-muted hover:text-white transition-colors` | Navigation items |

### 2.6 Responsive Typography Summary

| Breakpoint | Base Size | Heading Scale Factor |
|-----------|-----------|---------------------|
| Mobile (< 640px) | 16px | 1.0x (minimum clamp values) |
| Tablet (640-1023px) | 16px | ~1.15x (fluid mid-range) |
| Desktop (1024-1439px) | 16px | ~1.3x (approaches max) |
| Wide (1440px+) | 16px | 1.0x (maximum clamp values hit) |

The base font size never changes. Only headings and display text scale via `clamp()`. Body text remains fixed at `16px` across all breakpoints to maintain readability.

### 2.7 Arabic Font Stack

**Inter does not support Arabic glyphs.** Arabic text requires a dedicated Arabic font. The primary Arabic font is **Noto Sans Arabic** from Google Fonts, chosen because it harmonizes with Inter's geometric style and supports the full weight range (400-800).

**Full font stack (combined Latin + Arabic):**

```css
font-family: 'Inter', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif;
```

**Next.js font configuration for Arabic:**

```ts
// src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Latin font -- loaded for all locales
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

// Arabic font -- loaded only for Arabic locale
const notoSansArabic = localFont({
  src: [
    { path: '../fonts/NotoSansArabic-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/NotoSansArabic-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/NotoSansArabic-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/NotoSansArabic-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-arabic',
  display: 'swap',
});
```

**Tailwind font family configuration:**

```ts
fontFamily: {
  sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  arabic: ['var(--font-arabic)', 'var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
```

In the root layout, apply `font-arabic` class when `locale === 'ar'` and `font-sans` for English.

### 2.8 Arabic Typography Overrides

Arabic text has different visual characteristics than Latin text. The following adjustments ensure readability and visual balance when `dir="rtl"` is active.

**Line-height:** Arabic glyphs are more vertically compact with more intricate shapes. Multiply all Latin line-heights by **1.08** for Arabic:

| Latin Line-Height | Arabic Line-Height | Example |
|-------------------|-------------------|---------|
| 1.5 | 1.625 | `text-xs`, `text-sm` |
| 1.556 | 1.68 | `text-lg` |
| 1.625 | 1.75 | `text-base` (body) |
| 1.333 | 1.44 | `text-2xl` |
| 1.267 | 1.37 | `text-3xl` |
| 1.2 | 1.3 | `text-h2` |
| 1.1 | 1.2 | `text-h1`, `text-display` |

**Letter-spacing:** Arabic script uses connected cursive letterforms. Negative tracking disrupts ligatures and word connections. **Reset ALL letter-spacing to 0 for Arabic text:**

```css
[dir="rtl"] {
  letter-spacing: 0 !important;
}
```

This overrides the negative `letter-spacing` values used for Latin headings (e.g., `-0.02em`, `-0.025em`) which would break Arabic text rendering.

**Font-weight:** Arabic text at weight 400 appears visually thinner than Latin text at the same weight. Use **500** where Latin uses **400** for body text:

| Latin Weight | Arabic Weight | Usage |
|-------------|--------------|-------|
| 400 | 500 | Body text, descriptions, paragraphs |
| 500 | 500 | Emphasized body text (no change) |
| 600 | 600 | Headings, labels (no change) |
| 700 | 700 | Bold headings (no change) |

**CSS implementation:**

```css
@layer base {
  [dir="rtl"] {
    letter-spacing: 0 !important;
  }

  [dir="rtl"] body {
    font-weight: 500;
    line-height: 1.75;
  }

  [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3,
  [dir="rtl"] h4, [dir="rtl"] h5, [dir="rtl"] h6 {
    letter-spacing: 0;
  }
}
```

---

## 3. Spacing System

### 3.1 Base Unit

The spacing system is built on a **4px base unit**. All spacing values are multiples of 4.

### 3.2 Spacing Scale

| Token | Value | Tailwind | Usage Example |
|-------|-------|---------|---------------|
| `0` | 0px | `p-0`, `m-0` | Reset |
| `0.5` | 2px | `p-0.5` | Micro adjustments only |
| `1` | 4px | `p-1` | Icon-to-text gaps, tight inner padding |
| `1.5` | 6px | `p-1.5` | Badge padding, small element margins |
| `2` | 8px | `p-2` | Input inner padding (vertical), tight gaps |
| `2.5` | 10px | `p-2.5` | Small button vertical padding |
| `3` | 12px | `p-3` | Input horizontal padding, card inner gaps |
| `4` | 16px | `p-4` | Default card padding (mobile), form gaps |
| `5` | 20px | `p-5` | Card padding medium |
| `6` | 24px | `p-6` | Default card padding (desktop), section inner |
| `8` | 32px | `p-8` | Large card padding, modal padding |
| `10` | 40px | `p-10` | Section inner padding |
| `12` | 48px | `p-12` | Section vertical rhythm |
| `16` | 64px | `p-16` | Large section vertical padding (mobile) |
| `20` | 80px | `p-20` | Section vertical padding (desktop) |
| `24` | 96px | `p-24` | Hero section vertical padding |
| `32` | 128px | `p-32` | Extra-large section spacing |

### 3.3 Section Vertical Padding

Consistent vertical rhythm between major page sections.

| Section Type | Mobile (py) | Desktop (py) | Tailwind |
|-------------|-------------|-------------|---------|
| Hero | 64px / 80px | 96px / 128px | `py-16 md:py-24 lg:py-32` |
| Standard Section | 48px | 80px | `py-12 md:py-20` |
| Compact Section | 32px | 48px | `py-8 md:py-12` |
| CTA Banner | 48px | 64px | `py-12 md:py-16` |
| Footer | 48px top, 24px bottom | 64px top, 32px bottom | `pt-12 pb-6 md:pt-16 md:pb-8` |

**Hero Padding Exceptions:**
- **AI Tool pages** use asymmetric hero padding: `pt-24 pb-12 md:pt-32 md:pb-16` to reduce vertical space before the interactive form. This is intentional -- tool pages prioritize getting users to the form quickly.
- **Standard content pages** use symmetric hero padding: `py-16 md:py-24 lg:py-32` as shown in the table above.

### 3.4 Container Widths and Padding

| Breakpoint | Container Max-Width | Horizontal Padding | Tailwind |
|-----------|--------------------|--------------------|---------|
| Mobile (< 640px) | 100% | 16px per side | `px-4` |
| SM (640px+) | 640px | 24px per side | `sm:px-6` |
| MD (768px+) | 768px | 24px per side | `md:px-6` |
| LG (1024px+) | 1024px | 32px per side | `lg:px-8` |
| XL (1280px+) | 1200px | 32px per side | `xl:px-8` |
| 2XL (1536px+) | 1320px | 32px per side | `2xl:px-8` |

**Container class pattern:**
```html
<div class="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
```

For narrow content (blog posts, legal pages):
```html
<div class="mx-auto w-full max-w-[768px] px-4 sm:px-6">
```

### 3.5 Card Internal Padding

| Card Size | Padding | Tailwind |
|-----------|---------|---------|
| Compact | 16px | `p-4` |
| Default | 24px | `p-6` |
| Large | 32px | `p-8` |
| Responsive Default | 16px mobile, 24px desktop | `p-4 md:p-6` |

### 3.6 Gap Scales for Grids and Flex

| Context | Gap | Tailwind |
|---------|-----|---------|
| Icon + Text (inline) | 8px | `gap-2` |
| Form fields (stacked) | 16px | `gap-4` |
| Card grid | 24px | `gap-6` |
| Section elements (stacked) | 32px | `gap-8` |
| Major content blocks | 48px | `gap-12` |
| Navigation items | 32px | `gap-8` |
| Button group | 12px | `gap-3` |
| Tag/badge group | 8px | `gap-2` |

---

## 4. Grid and Layout

### 4.1 Breakpoints

| Name | Min-Width | Tailwind Prefix | Target |
|------|-----------|----------------|--------|
| Base | 0px | (none) | Small phones |
| SM | 640px | `sm:` | Large phones (landscape) |
| MD | 768px | `md:` | Tablets (portrait) |
| LG | 1024px | `lg:` | Tablets (landscape), small laptops |
| XL | 1280px | `xl:` | Standard desktops |
| 2XL | 1536px | `2xl:` | Wide monitors |

### 4.2 Grid System

The layout uses a **12-column CSS Grid** with a `24px` gutter.

```html
<!-- 12-column grid -->
<div class="grid grid-cols-12 gap-6">
  <div class="col-span-12 md:col-span-6 lg:col-span-4">...</div>
</div>
```

### 4.3 Common Card Grid Patterns

| Layout | Mobile | Tablet | Desktop | Wide | Tailwind |
|--------|--------|--------|---------|------|---------|
| 2-Column | 1 col | 2 col | 2 col | 2 col | `grid grid-cols-1 md:grid-cols-2 gap-6` |
| 3-Column | 1 col | 2 col | 3 col | 3 col | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| 4-Column | 1 col | 2 col | 3 col | 4 col | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` |
| 2-Column (uneven) | 1 col | 5/7 split | 5/7 split | 5/7 split | `grid grid-cols-12 gap-6` with `col-span-12 md:col-span-5` and `col-span-12 md:col-span-7` |
| Sidebar | stacked | stacked | 3/9 split | 3/9 split | `grid grid-cols-12 gap-8` with `col-span-12 lg:col-span-3` and `col-span-12 lg:col-span-9` |

### 4.4 Section Layout Patterns

**Full-Width Section:**
Background spans the viewport. Content is centered in a container.
```html
<section class="w-full bg-navy">
  <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 md:py-20">
    ...
  </div>
</section>
```

**Alternating Background Section:**
Alternate between `bg-navy` and `bg-slate-dark` (or `bg-slate-blue`) for visual rhythm between stacked sections.

**Split Section (Text + Visual):**
```html
<section class="w-full">
  <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-12 md:py-20">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div><!-- Text content --></div>
      <div><!-- Image / visual --></div>
    </div>
  </div>
</section>
```

**Centered Content Section:**
```html
<section class="w-full">
  <div class="mx-auto max-w-[768px] px-4 sm:px-6 py-12 md:py-20 text-center">
    ...
  </div>
</section>
```

---

## 5. Shadows and Elevation

All shadows are tuned for dark backgrounds. On dark themes, shadows manifest as deeper darkness below elements, plus an optional subtle light edge at the top.

### 5.1 Shadow Scale

| Token | CSS Value | Tailwind | Usage |
|-------|-----------|---------|-------|
| `shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` | `shadow-sm` | Subtle elevation: buttons, badges |
| `shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)` | `shadow-md` | Default card elevation |
| `shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)` | `shadow-lg` | Hovered cards, dropdowns |
| `shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)` | `shadow-xl` | Modals, overlays |
| `shadow-2xl` | `0 25px 50px -12px rgba(0, 0, 0, 0.6)` | `shadow-2xl` | High-prominence elements |

### 5.2 Card Shadow States

| State | Shadow | Additional Styles |
|-------|--------|-------------------|
| Default | `shadow-md` | -- |
| Hover | `shadow-lg` | `translate-y: -2px` |
| Active/Pressed | `shadow-sm` | `translate-y: 0` |
| Featured | `shadow-lg` + bronze glow | `ring-1 ring-bronze/20` |

### 5.3 Glow Effects

For accent elements that need to "pop" on dark backgrounds.

| Name | CSS | Usage |
|------|-----|-------|
| Bronze Glow | `0 0 20px rgba(192, 132, 96, 0.25), 0 0 40px rgba(192, 132, 96, 0.1)` | Featured CTA, hero button |
| Tool Orange Glow | `0 0 20px rgba(249, 115, 22, 0.2)` | Idea Lab active state |
| Tool Blue Glow | `0 0 20px rgba(59, 130, 246, 0.2)` | AI Analyzer active state |
| Tool Green Glow | `0 0 20px rgba(34, 197, 94, 0.2)` | Get Estimate active state |
| Tool Purple Glow | `0 0 20px rgba(168, 85, 247, 0.2)` | ROI Calculator active state |

Tailwind custom utilities for glows:
```css
.shadow-glow-bronze  { box-shadow: 0 0 20px rgba(192,132,96,0.25), 0 0 40px rgba(192,132,96,0.1); }
.shadow-glow-orange  { box-shadow: 0 0 20px rgba(249,115,22,0.2); }
.shadow-glow-blue    { box-shadow: 0 0 20px rgba(59,130,246,0.2); }
.shadow-glow-green   { box-shadow: 0 0 20px rgba(34,197,94,0.2); }
.shadow-glow-purple  { box-shadow: 0 0 20px rgba(168,85,247,0.2); }
```

### 5.4 Overlay Shadows

| Context | Background | Tailwind |
|---------|-----------|---------|
| Modal backdrop | `rgba(15, 20, 25, 0.80)` | `bg-navy/80 backdrop-blur-sm` |
| Mobile drawer backdrop | `rgba(15, 20, 25, 0.90)` | `bg-navy/90 backdrop-blur-md` |
| Dropdown menu | Uses `shadow-xl` on the menu itself | `shadow-xl` |
| Exit intent overlay | `rgba(15, 20, 25, 0.85)` | `bg-navy/85 backdrop-blur-sm` |

### 5.5 Z-Index Hierarchy

A complete z-index scale prevents stacking conflicts between floating elements, navigation, modals, and notifications. Every z-index used in the codebase MUST be assigned from this table. Do not use arbitrary z-index values.

| Z-Index | Tailwind Class | Element | Notes |
|---------|---------------|---------|-------|
| `z-10` | `z-10` | Dropdowns | Nav dropdowns, select menus, autocomplete |
| `z-20` | `z-20` | Sticky elements | Sticky table headers, sticky sidebars |
| `z-30` | `z-30` | Fixed elements | Secondary fixed UI (scroll-to-top button) |
| `z-40` | `z-40` | Floating widgets | WhatsApp button, Avi chatbot bubble |
| `z-45` | `z-[45]` | Floating widget expanded | Avi chat window (when open, above bubble) |
| `z-50` | `z-50` | Navigation | Navbar (fixed top), mobile drawer, tooltips |
| `z-60` | `z-[60]` | Overlays and modals | Exit intent popup, confirmation dialogs, modal backdrops |
| `z-70` | `z-[70]` | Reserved | Future use |
| `z-80` | `z-[80]` | Reserved | Future use |
| `z-90` | `z-[90]` | Reserved | Future use |
| `z-99` | `z-[99]` | Page progress bar | Thin progress indicator at very top of viewport |
| `z-100` | `z-[100]` | Toast notifications, skip-to-content | Highest layer: toasts, alert banners, skip-to-content link |

**Rules:**
1. The navbar sits at `z-50`. It must appear above floating widgets (`z-40`) but below modals (`z-60`).
2. The chatbot bubble uses `z-40`, but when the chat window expands it uses `z-45` to layer above the bubble but still below the navbar.
3. Modals and overlays (including the exit intent popup) use `z-60` with a backdrop at `z-60` as well (backdrop renders first in DOM order).
4. The page progress bar uses `z-99` -- it must sit above everything except toasts.
5. Toast notifications use `z-100` because they communicate critical feedback and must never be obscured.
6. The skip-to-content accessibility link uses `z-100` so it appears above all other content when focused.
7. Never introduce a z-index value not listed in this table without updating this specification first.

---

## 6. Borders and Radius

### 6.1 Border Colors and Widths

| Token | Value | Tailwind | Usage |
|-------|-------|---------|-------|
| Default border color | `#243044` | `border-slate-blue-light` | Card borders, dividers, input borders |
| Hover border color | `#374151` | `border-gray-700` | Input hover, card hover border |
| Focus border color | `#C08460` | `border-bronze` | Focus rings on inputs and interactive elements |
| Error border color | `#F87171` | `border-error` | Validation error state |
| Success border color | `#34D399` | `border-success` | Validated input |
| Default width | 1px | `border` | Standard borders |
| Emphasis width | 2px | `border-2` | Focus rings, active tabs |
| Decorative width | 4px | `border-4` | Left border on blockquotes |

### 6.2 Border Radius Scale

| Token | Value | Tailwind | Usage |
|-------|-------|---------|-------|
| `none` | 0px | `rounded-none` | Explicitly sharp corners |
| `sm` | 4px | `rounded-sm` | Badges, small tags |
| `md` | 6px | `rounded-md` | Inputs, small buttons |
| `DEFAULT` | 8px | `rounded` | Default for most elements |
| `lg` | 12px | `rounded-lg` | Cards, modals, large buttons |
| `xl` | 16px | `rounded-xl` | Featured cards, hero elements |
| `2xl` | 20px | `rounded-2xl` | App showcase cards, large modals |
| `full` | 9999px | `rounded-full` | Avatars, circular buttons, pills |

### 6.3 Component-Specific Radius Rules

| Component | Radius | Tailwind |
|-----------|--------|---------|
| Button (sm) | 6px | `rounded-md` |
| Button (md, lg) | 8px | `rounded-lg` |
| Card (default) | 12px | `rounded-lg` |
| Card (featured) | 16px | `rounded-xl` |
| Input / Select | 8px | `rounded-lg` |
| Badge / Tag | 4px | `rounded-sm` |
| Pill Badge | 9999px | `rounded-full` |
| Modal | 16px | `rounded-xl` |
| Bottom Sheet (mobile) | 20px top only | `rounded-t-2xl` |
| Tooltip | 8px | `rounded-lg` |
| Avatar | 9999px | `rounded-full` |
| Toast | 12px | `rounded-lg` |
| Progress Bar track | 9999px | `rounded-full` |
| Skeleton | 8px (matches element) | `rounded-lg` |
| Navigation dropdown | 12px | `rounded-lg` |

---

## 7. Component Design Tokens

### 7.1 Buttons

All buttons share: `font-weight: 600`, `font-family: Inter`, `cursor-pointer`, `transition-all duration-200`, `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy`.

#### Sizes

| Size | Height | Padding (H/V) | Font Size | Icon Size | Min Width | Tailwind |
|------|--------|---------------|-----------|-----------|-----------|---------|
| `sm` | 36px | 12px / 6px | 14px | 16px | 64px | `h-9 px-3 py-1.5 text-sm` |
| `md` | 44px | 20px / 10px | 16px | 20px | 80px | `h-11 px-5 py-2.5 text-base` |
| `lg` | 52px | 28px / 12px | 18px | 24px | 96px | `h-13 px-7 py-3 text-lg` |

#### Variants

**Primary (Bronze Fill)**

| State | Background | Text | Border | Shadow | Additional |
|-------|-----------|------|--------|--------|------------|
| Default | `#C08460` | `#FFFFFF` | none | `shadow-sm` | -- |
| Hover | `#A6714E` | `#FFFFFF` | none | `shadow-md` | `scale-[1.02]` |
| Active | `#8B6344` | `#FFFFFF` | none | `shadow-sm` | `scale-[0.98]` |
| Focus | `#C08460` | `#FFFFFF` | `ring-2 ring-bronze ring-offset-2 ring-offset-navy` | -- | -- |
| Disabled | `#8B6344` | `rgba(255,255,255,0.5)` | none | none | `opacity-50 cursor-not-allowed` |
| Loading | `#C08460` | hidden | none | `shadow-sm` | Spinner centered |

```html
<!-- Primary Button -->
<button class="h-11 px-5 py-2.5 bg-bronze text-white font-semibold rounded-lg shadow-sm
  hover:bg-bronze-hover hover:shadow-md hover:scale-[1.02]
  active:bg-bronze-muted active:scale-[0.98] active:shadow-sm
  focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-200">
  Get AI Estimate
</button>
```

**Secondary (Outline)**

| State | Background | Text | Border | Shadow |
|-------|-----------|------|--------|--------|
| Default | transparent | `#C08460` | `1px solid #C08460` | none |
| Hover | `rgba(192,132,96,0.1)` | `#D4A583` | `1px solid #D4A583` | none |
| Active | `rgba(192,132,96,0.15)` | `#C08460` | `1px solid #C08460` | none |
| Focus | transparent | `#C08460` | `ring-2 ring-bronze ring-offset-2 ring-offset-navy` | none |
| Disabled | transparent | `#8B6344` | `1px solid #8B6344` | none |

```html
<button class="h-11 px-5 py-2.5 bg-transparent text-bronze border border-bronze font-semibold rounded-lg
  hover:bg-bronze/10 hover:text-bronze-light hover:border-bronze-light
  active:bg-bronze/15
  focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-200">
  View Solutions
</button>
```

**Ghost**

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | transparent | `#F4F4F2` | none |
| Hover | `rgba(36, 48, 68, 0.6)` | `#FFFFFF` | none |
| Active | `rgba(36, 48, 68, 0.8)` | `#FFFFFF` | none |
| Disabled | transparent | `#6B7280` | none |

```html
<button class="h-11 px-5 py-2.5 bg-transparent text-off-white font-semibold rounded-lg
  hover:bg-slate-blue-light/60 hover:text-white
  active:bg-slate-blue-light/80
  focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all duration-200">
  Learn More
</button>
```

**Link Button**

| State | Style |
|-------|-------|
| Default | `text-bronze underline-offset-4` |
| Hover | `text-bronze-light underline` |
| Active | `text-bronze-hover` |
| Disabled | `text-muted-light no-underline` |

```html
<button class="text-bronze font-semibold underline-offset-4
  hover:underline hover:text-bronze-light
  active:text-bronze-hover
  disabled:text-muted-light disabled:no-underline
  transition-colors duration-200">
  Contact Us
</button>
```

**Icon Button**

Circular or square button for icon-only interactions (close, menu, etc.).

| Size | Dimensions | Icon Size | Radius |
|------|-----------|-----------|--------|
| sm | 32x32 | 16px | `rounded-lg` |
| md | 40x40 | 20px | `rounded-lg` |
| lg | 48x48 | 24px | `rounded-lg` |

```html
<button class="h-10 w-10 flex items-center justify-center rounded-lg
  bg-transparent text-muted
  hover:bg-slate-blue-light/60 hover:text-white
  focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
  transition-all duration-200"
  aria-label="Close menu">
  <XIcon class="h-5 w-5" />
</button>
```

#### Loading State

All buttons that trigger asynchronous actions (form submissions, AI generation, API calls) must support a loading state. This is used across all AI tool forms (e.g., "Generate Estimate" becomes "Generating...").

**Behavior:**
- The loading spinner replaces the button icon and/or text content.
- The button width is frozen: set `min-width` to the button's current `offsetWidth` before entering loading state. This prevents layout shift when text changes.
- `disabled` is applied to prevent double-submission.
- `cursor-wait` replaces `cursor-pointer`.
- `aria-busy="true"` is added for screen readers.
- The loading spinner uses `animate-spin` (see Loading Spinner component in section 7.15).

**Visual states:**

| Property | Normal | Loading |
|----------|--------|---------|
| Text | Visible | Hidden or replaced with loading text (e.g., "Generating...") |
| Icon | Visible | Replaced with spinner |
| Width | Auto | Frozen (`min-width` set to pre-loading width) |
| Pointer | `cursor-pointer` | `cursor-wait` |
| Interactivity | Enabled | `disabled`, `pointer-events-none` |
| Aria | -- | `aria-busy="true"` |
| Opacity | 1.0 | 0.9 (subtle dimming) |

**Example implementation:**

```tsx
<Button loading>Generating...</Button>
```

```html
<!-- Loading state (Primary Button) -->
<button
  class="h-11 px-5 py-2.5 bg-bronze text-white font-semibold rounded-lg shadow-sm
    opacity-90 cursor-wait pointer-events-none transition-all duration-200"
  disabled
  aria-busy="true"
  style="min-width: 180px;"
>
  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
  Generating...
</button>
```

**Tool-specific loading buttons:** When a tool uses its accent color for the primary button (e.g., `bg-orange-500` for Idea Lab), the loading spinner should be white. When the button uses an outline variant, the spinner should match the tool accent color.

---

### 7.2 Cards

All cards share: `bg-slate-blue`, `border border-slate-blue-light`, `rounded-lg`, `transition-all duration-300`.

#### Default Card

```
Background:     bg-slate-blue (#1A2332)
Border:         border border-slate-blue-light (#243044)
Radius:         rounded-lg (12px)
Padding:        p-6 (24px)
Shadow:         shadow-md
Hover:          shadow-lg, -translate-y-1, border-slate-blue-light/80
```

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-lg p-6 shadow-md
  hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
  <h3 class="text-xl font-semibold text-white mb-2">Card Title</h3>
  <p class="text-muted">Card description text goes here.</p>
</div>
```

#### Featured Card

Same as default, plus a bronze accent.

```
Border:         border border-bronze/30
Shadow:         shadow-lg
Top accent:     A 2px bronze line at the top via `border-t-2 border-t-bronze`
Hover:          shadow-glow-bronze
```

```html
<div class="bg-slate-blue border border-bronze/30 border-t-2 border-t-bronze rounded-lg p-6 shadow-lg
  hover:shadow-glow-bronze transition-all duration-300">
  ...
</div>
```

#### Service/Solution Card

```
Background:     bg-slate-blue
Icon area:      48x48 rounded-lg bg-bronze/10, icon in text-bronze
Title:          text-lg font-semibold text-white, mt-4
Description:    text-sm text-muted, mt-2
Link:           text-bronze text-sm font-medium, mt-4, with arrow icon
Hover:          Card lifts (-translate-y-1), icon area scales up slightly
```

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-lg p-6 shadow-md
  hover:shadow-lg hover:-translate-y-1 group transition-all duration-300">
  <div class="h-12 w-12 rounded-lg bg-bronze/10 flex items-center justify-center
    group-hover:scale-110 transition-transform duration-300">
    <IconComponent class="h-6 w-6 text-bronze" />
  </div>
  <h3 class="text-lg font-semibold text-white mt-4">AI Solutions</h3>
  <p class="text-sm text-muted mt-2">Intelligent apps that learn and adapt.</p>
  <a class="inline-flex items-center gap-1.5 text-bronze text-sm font-medium mt-4
    group-hover:gap-2.5 transition-all duration-200">
    Learn More <ArrowRight class="h-4 w-4" />
  </a>
</div>
```

#### AI Tool Card

Each tool card uses its unique accent color. The background is a gradient from the tool's dark tint to slate-blue.

```html
<!-- Example: Idea Lab (Orange) -->
<div class="bg-gradient-to-br from-tool-orange-dark to-slate-blue
  border border-orange-500/20 rounded-xl p-6 shadow-md
  hover:shadow-glow-orange hover:-translate-y-1 group transition-all duration-300">
  <div class="h-12 w-12 rounded-lg bg-orange-500/15 flex items-center justify-center">
    <LightbulbIcon class="h-6 w-6 text-orange-400" />
  </div>
  <h3 class="text-lg font-semibold text-white mt-4">Idea Lab</h3>
  <p class="text-sm text-orange-300/80 mt-2">Don't have an idea yet? We'll help you find one.</p>
  <button class="mt-4 h-9 px-4 bg-orange-500/15 text-orange-300 border border-orange-500/30
    rounded-lg text-sm font-medium hover:bg-orange-500/25 transition-colors duration-200">
    Start Discovery
  </button>
</div>
```

Repeat this pattern for Blue (AI Analyzer), Green (Get Estimate), and Purple (ROI Calculator), substituting the respective color values from the AI Tool Accent Colors table.

#### App Showcase Card

For displaying live apps in the portfolio.

```
Background:     bg-slate-blue
Layout:         Horizontal on desktop (image left, content right), stacked on mobile
App Icon:       64x64 rounded-2xl with shadow-md
App Name:       text-lg font-semibold text-white
Description:    text-sm text-muted
Store Buttons:  Inline flex, small pill buttons with store icons
Hover:          Card lifts, app icon scales slightly
```

#### Case Study Card

```
Background:     bg-slate-blue
Top:            Industry label badge (pill, bg-slate-blue-light, text-muted, text-xs uppercase)
Title:          text-xl font-semibold text-white, mt-3
Metric:         text-2xl font-bold text-bronze, mt-2
Excerpt:        text-sm text-muted, mt-2, line-clamp-2
CTA:            "Read Case Study" link in bronze, mt-4
Hover:          -translate-y-1, shadow-lg
```

#### Blog Post Card

```
Background:     bg-slate-blue
Image:          aspect-[16/9] rounded-t-lg overflow-hidden, object-cover, grayscale on default, color on hover
Category:       Pill badge, absolute top-left on image, bg-bronze/80 text-white text-xs px-2 py-0.5
Date:           text-xs text-muted, mt-4
Title:          text-lg font-semibold text-white, mt-1, line-clamp-2
Excerpt:        text-sm text-muted, mt-2, line-clamp-3
Hover:          Image desaturates to full color, card lifts
```

---

### 7.3 Form Inputs

All form inputs share: `font-family: Inter`, `transition-all duration-200`.

#### Text Input

| State | Background | Border | Text | Placeholder |
|-------|-----------|--------|------|-------------|
| Default | `#1A2332` | `#243044` | `#F4F4F2` | `#6B7280` |
| Hover | `#1A2332` | `#374151` | `#F4F4F2` | `#6B7280` |
| Focus | `#243044` | `#C08460` | `#FFFFFF` | `#9CA3AF` |
| Error | `#1A2332` | `#F87171` | `#F4F4F2` | `#6B7280` |
| Disabled | `#0F1419` | `#243044` | `#6B7280` | `#4B5563` |

```
Height:         44px (h-11)
Padding:        12px horizontal, 10px vertical (px-3 py-2.5)
Font Size:      16px (text-base) -- 16px prevents iOS zoom on focus
Border:         1px solid
Radius:         8px (rounded-lg)
```

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-off-white">Email Address</label>
  <input
    type="email"
    class="w-full h-11 px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg
      text-base text-off-white placeholder:text-muted-light
      hover:border-gray-700
      focus:bg-slate-blue-light focus:border-bronze focus:text-white focus:outline-none focus:ring-1 focus:ring-bronze
      disabled:bg-navy disabled:text-muted-light disabled:cursor-not-allowed
      transition-all duration-200"
    placeholder="you@example.com"
  />
  <!-- Error message (shown conditionally) -->
  <p class="text-sm text-error mt-1">Please enter a valid email address.</p>
</div>
```

#### Textarea

Same styling as text input, but with:
```
Min Height:     120px (min-h-[120px])
Padding:        12px (p-3)
Resize:         vertical only (resize-y)
```

#### Select

Same styling as text input, with a custom chevron icon on the right:
```
Appearance:     appearance-none
Right padding:  40px (pr-10) to accommodate chevron
Chevron:        Absolute positioned, text-muted, 20x20
```

#### Checkbox

```
Size:           20x20 (h-5 w-5)
Border:         2px solid #243044
Radius:         4px (rounded)
Checked:        bg-bronze, border-bronze, white checkmark
Focus:          ring-2 ring-bronze ring-offset-2 ring-offset-navy
Label:          text-sm text-off-white, ml-2
```

```html
<label class="flex items-center gap-2 cursor-pointer">
  <input type="checkbox"
    class="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent
      checked:bg-bronze checked:border-bronze
      focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
      transition-colors duration-200"
  />
  <span class="text-sm text-off-white">Also send via WhatsApp</span>
</label>
```

#### Radio Button

```
Size:           20x20 (h-5 w-5)
Border:         2px solid #243044
Radius:         rounded-full
Selected:       border-bronze, inner dot in bronze (6px)
Focus:          ring-2 ring-bronze ring-offset-2 ring-offset-navy
```

#### Slider / Range

```
Track:          h-2 bg-slate-blue-light rounded-full
Fill:           bg-bronze (left of thumb)
Thumb:          h-5 w-5 bg-bronze rounded-full shadow-md border-2 border-white
Hover:          Thumb scales to 1.2x
```

#### Phone Input

Uses a country code selector prefix with flag + code, followed by the phone number input. Same styling as text input. The country code selector is a compact dropdown on the left (w-24).

---

### 7.4 Navigation

#### Desktop Navigation Bar

```
Position:       fixed top-0, w-full, z-50
Height:         64px (h-16)
Background:     bg-navy/80 backdrop-blur-md (transparent blur on scroll)
Border:         border-b border-slate-blue-light/50 (visible after scroll)
Padding:        px-4 sm:px-6 lg:px-8
Layout:         flex items-center justify-between
Transition:     Background opacity transitions on scroll (200ms)
```

**Logo area:** Left-aligned, 120-140px wide logo mark.

**Nav links (center/right):** `text-sm font-medium text-muted hover:text-white transition-colors duration-200`. Active link: `text-white`.

**Idea Lab CTA in nav:** `bg-bronze/15 text-bronze px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-bronze/25`.

**Language switcher:** Compact dropdown, `text-sm text-muted`, globe icon prefix.

```html
<nav class="fixed top-0 w-full z-50 h-16 bg-navy/80 backdrop-blur-md border-b border-slate-blue-light/50
  transition-all duration-200">
  <div class="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
    <a href="/" class="flex-shrink-0">
      <!-- Logo -->
    </a>
    <div class="hidden lg:flex items-center gap-8">
      <a class="text-sm font-medium text-muted hover:text-white transition-colors">Home</a>
      <a class="text-sm font-medium text-muted hover:text-white transition-colors">Get AI Estimate</a>
      <a class="text-sm font-medium text-muted hover:text-white transition-colors">FAQ</a>
      <a class="text-sm font-medium text-muted hover:text-white transition-colors">Blog</a>
      <a class="text-sm font-medium bg-bronze/15 text-bronze px-3 py-1.5 rounded-lg
        hover:bg-bronze/25 transition-colors">Idea Lab</a>
    </div>
    <div class="flex items-center gap-3">
      <!-- Language switcher -->
      <!-- Mobile menu button (lg:hidden) -->
    </div>
  </div>
</nav>
```

#### Mobile Navigation Drawer

```
Trigger:        Hamburger icon button (top-right, lg:hidden)
Overlay:        bg-navy/90 backdrop-blur-md, full screen
Drawer:         Slides in from right, w-[300px] max-w-[80vw], bg-slate-blue
Close:          X button top-right of drawer
Links:          Stacked vertically, text-lg font-medium text-off-white py-3 border-b border-slate-blue-light
Active:         text-bronze
Animation:      Slide from right, 300ms ease-out. Overlay fades in 200ms.
```

#### Breadcrumbs

```
Text:           text-sm text-muted
Separator:      / or chevron icon, text-muted-light, mx-2
Current page:   text-off-white (not linked)
Links:          text-muted hover:text-bronze transition-colors
```

```html
<nav aria-label="Breadcrumb" class="flex items-center gap-2 text-sm">
  <a href="/" class="text-muted hover:text-bronze transition-colors">Home</a>
  <ChevronRight class="h-4 w-4 text-muted-light" />
  <a href="/solutions" class="text-muted hover:text-bronze transition-colors">Solutions</a>
  <ChevronRight class="h-4 w-4 text-muted-light" />
  <span class="text-off-white">Delivery App</span>
</nav>
```

---

### 7.5 Badges and Tags

#### Status Badge

```
Padding:        px-2 py-0.5
Font:           text-xs font-medium
Radius:         rounded-full (pill shape)
```

| Variant | Background | Text |
|---------|-----------|------|
| Default | `bg-slate-blue-light` | `text-muted` |
| Bronze | `bg-bronze/15` | `text-bronze-light` |
| Success | `bg-success-dark` | `text-success` |
| Warning | `bg-warning-dark` | `text-warning` |
| Error | `bg-error-dark` | `text-error` |
| Info | `bg-info-dark` | `text-info` |

```html
<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-bronze/15 text-bronze-light">
  Featured
</span>
```

#### Category Tag

```
Padding:        px-2.5 py-1
Font:           text-xs font-medium uppercase tracking-wide
Radius:         rounded-sm (4px)
Background:     bg-slate-blue-light
Text:           text-muted
Hover:          bg-slate-blue-light/80, text-off-white
```

#### Tech Stack Badge

```
Padding:        px-2 py-1
Font:           text-xs font-mono font-medium
Radius:         rounded (8px)
Background:     bg-slate-dark
Text:           text-muted
Border:         border border-slate-blue-light
```

---

### 7.6 Modal / Dialog

#### Standard Modal

```
Overlay:        bg-navy/80 backdrop-blur-sm, z-50
Container:      bg-slate-blue, rounded-xl, shadow-2xl, border border-slate-blue-light
Max Width:      max-w-lg (default), max-w-xl, max-w-2xl (variants)
Padding:        p-6 (body), px-6 py-4 (header/footer)
Header:         flex justify-between items-center, border-b border-slate-blue-light, pb-4
Title:          text-lg font-semibold text-white
Close button:   Icon button (X), top-right of header
Footer:         flex justify-end gap-3, border-t border-slate-blue-light, pt-4
Animation:      Overlay fade-in 200ms, modal scale from 95% to 100% + fade-in 200ms
Focus trap:     Required -- focus stays within modal until closed
```

```html
<!-- Modal -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-navy/80 backdrop-blur-sm" />
  <!-- Panel -->
  <div class="relative w-full max-w-lg bg-slate-blue border border-slate-blue-light rounded-xl shadow-2xl">
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-blue-light">
      <h2 class="text-lg font-semibold text-white">Modal Title</h2>
      <button class="h-8 w-8 flex items-center justify-center rounded-lg text-muted
        hover:bg-slate-blue-light hover:text-white transition-colors" aria-label="Close">
        <XIcon class="h-5 w-5" />
      </button>
    </div>
    <div class="px-6 py-4">
      <p class="text-off-white">Modal content here.</p>
    </div>
    <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-blue-light">
      <button class="...ghost-button-classes">Cancel</button>
      <button class="...primary-button-classes">Confirm</button>
    </div>
  </div>
</div>
```

#### Full-Screen Modal

Used for Idea Lab results, AI tool results on mobile.

```
Background:     bg-navy
Height:         100vh (or 100dvh for mobile)
Padding:        p-4 sm:p-6
Close:          Fixed top-right icon button
Content:        Scrollable with overflow-y-auto
Animation:      Slide up from bottom 300ms ease-out
```

#### Bottom Sheet (Mobile)

```
Position:       fixed bottom-0
Width:          100%
Max Height:     85vh
Background:     bg-slate-blue
Radius:         rounded-t-2xl
Handle:         w-10 h-1 bg-muted-light rounded-full mx-auto mt-3 (drag indicator)
Animation:      Slide up 300ms ease-out
Drag:           Swipe down to dismiss
```

---

### 7.7 Tabs

#### Horizontal Tabs

```
Container:      flex items-center gap-1, border-b border-slate-blue-light
Tab (inactive): px-4 py-2.5, text-sm font-medium text-muted, hover:text-off-white,
                border-b-2 border-transparent, transition-colors duration-200
Tab (active):   text-bronze, border-b-2 border-bronze
Tab with count: Append a badge: ml-2 inline-flex bg-slate-blue-light text-muted text-xs px-1.5 py-0.5 rounded-full
```

```html
<div class="flex items-center gap-1 border-b border-slate-blue-light">
  <button class="px-4 py-2.5 text-sm font-medium text-bronze border-b-2 border-bronze transition-colors">
    All
    <span class="ml-2 bg-bronze/15 text-bronze-light text-xs px-1.5 py-0.5 rounded-full">24</span>
  </button>
  <button class="px-4 py-2.5 text-sm font-medium text-muted border-b-2 border-transparent
    hover:text-off-white transition-colors">
    Healthcare
    <span class="ml-2 bg-slate-blue-light text-muted text-xs px-1.5 py-0.5 rounded-full">8</span>
  </button>
</div>
```

---

### 7.8 Accordion (FAQ Style)

```
Container:      divide-y divide-slate-blue-light
Item:           py-4 (first:pt-0, last:pb-0)
Trigger:        w-full flex justify-between items-center text-left
Question:       text-base font-medium text-off-white, group-hover:text-white
Chevron:        h-5 w-5 text-muted, rotate-180 when open, transition-transform duration-200
Answer:         text-sm text-muted, pt-2, max-h-0 overflow-hidden, animate open/close
Animation:      Height transition 300ms ease-in-out, opacity 200ms
```

```html
<div class="divide-y divide-slate-blue-light">
  <!-- Accordion Item (open state) -->
  <div class="py-4">
    <button class="w-full flex justify-between items-center text-left group">
      <span class="text-base font-medium text-off-white group-hover:text-white transition-colors">
        How long does it take to build an app?
      </span>
      <ChevronDown class="h-5 w-5 text-muted rotate-180 transition-transform duration-200" />
    </button>
    <div class="pt-2">
      <p class="text-sm text-muted leading-relaxed">
        Typical projects take 8-16 weeks depending on complexity...
      </p>
    </div>
  </div>
</div>
```

---

### 7.9 Progress

#### Stepper (Multi-Step Forms)

Used in Get AI Estimate, ROI Calculator, Idea Lab.

```
Layout:         flex items-center justify-between (horizontal)
Step circle:    h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold
  Completed:    bg-bronze text-white (checkmark icon)
  Current:      border-2 border-bronze bg-bronze/10 text-bronze
  Upcoming:     border-2 border-slate-blue-light bg-transparent text-muted
Connector:      h-0.5 flex-1 mx-2
  Completed:    bg-bronze
  Upcoming:     bg-slate-blue-light
Step label:     text-xs text-muted mt-2 (below circle), current: text-off-white
```

```html
<div class="flex items-center w-full">
  <!-- Step 1 - Completed -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full bg-bronze flex items-center justify-center">
      <CheckIcon class="h-5 w-5 text-white" />
    </div>
    <span class="text-xs text-muted mt-2">Project Type</span>
  </div>
  <!-- Connector -->
  <div class="h-0.5 flex-1 mx-2 bg-bronze" />
  <!-- Step 2 - Current -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-bronze bg-bronze/10
      flex items-center justify-center text-sm font-semibold text-bronze">2</div>
    <span class="text-xs text-off-white mt-2">Features</span>
  </div>
  <!-- Connector -->
  <div class="h-0.5 flex-1 mx-2 bg-slate-blue-light" />
  <!-- Step 3 - Upcoming -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-slate-blue-light
      flex items-center justify-center text-sm font-semibold text-muted">3</div>
    <span class="text-xs text-muted mt-2">Timeline</span>
  </div>
</div>
```

#### Progress Bar

```
Track:          h-2 w-full bg-slate-blue-light rounded-full
Fill:           h-full bg-bronze rounded-full transition-all duration-500 ease-out
Label:          text-sm text-muted, flex justify-between above bar
Percentage:     text-sm font-medium text-off-white
```

```html
<div>
  <div class="flex justify-between mb-1.5">
    <span class="text-sm text-muted">Progress</span>
    <span class="text-sm font-medium text-off-white">60%</span>
  </div>
  <div class="h-2 w-full bg-slate-blue-light rounded-full overflow-hidden">
    <div class="h-full bg-bronze rounded-full transition-all duration-500 ease-out" style="width: 60%"></div>
  </div>
</div>
```

#### Circular Progress

Used in AI tool results (e.g., idea viability score).

```
Size:           96px (h-24 w-24) or 128px (h-32 w-32)
Track:          stroke-slate-blue-light, stroke-width: 6
Fill:           stroke-bronze, stroke-width: 6, stroke-linecap: round
Center text:    text-2xl font-bold text-white (the percentage)
Label:          text-xs text-muted below the circle
Animation:      Stroke-dashoffset transition 1s ease-out on mount
```

---

### 7.10 Toast / Notification

```
Position:       fixed top-4 right-4 (desktop) or fixed bottom-4 left-4 right-4 (mobile)
Z-index:        z-[100]
Width:          max-w-sm (384px)
Background:     bg-slate-blue
Border:         border border-slate-blue-light
Radius:         rounded-lg
Shadow:         shadow-xl
Padding:        p-4
Layout:         flex items-start gap-3
Animation:      Slide in from right (desktop) or up from bottom (mobile), 300ms ease-out
Auto-dismiss:   5000ms default, with shrinking progress bar at bottom
```

| Variant | Icon Color | Left Accent |
|---------|-----------|-------------|
| Success | `text-success` | `border-l-4 border-l-success` |
| Error | `text-error` | `border-l-4 border-l-error` |
| Warning | `text-warning` | `border-l-4 border-l-warning` |
| Info | `text-info` | `border-l-4 border-l-info` |

```html
<div class="fixed top-4 right-4 z-[100] max-w-sm w-full bg-slate-blue border border-slate-blue-light
  border-l-4 border-l-success rounded-lg shadow-xl p-4 flex items-start gap-3"
  role="alert">
  <CheckCircleIcon class="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
  <div class="flex-1">
    <p class="text-sm font-medium text-white">Estimate sent!</p>
    <p class="text-sm text-muted mt-0.5">Check your email for the full breakdown.</p>
  </div>
  <button class="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded text-muted
    hover:text-white transition-colors" aria-label="Dismiss">
    <XIcon class="h-4 w-4" />
  </button>
</div>
```

---

### 7.11 Tooltip

```
Background:     bg-slate-dark (#0D1117)
Text:           text-xs text-off-white
Padding:        px-2.5 py-1.5
Radius:         rounded-lg
Shadow:         shadow-lg
Max Width:      max-w-[200px]
Arrow:          6px CSS triangle matching bg-slate-dark
Animation:      Fade in + slight translateY, 150ms
Delay:          200ms show, 0ms hide
Z-index:        z-50
```

```html
<div class="relative group">
  <button>Hover me</button>
  <div role="tooltip"
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    bg-slate-dark text-xs text-off-white px-2.5 py-1.5 rounded-lg shadow-lg
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-all duration-150 whitespace-nowrap z-50">
    Tooltip content
    <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
      border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-dark" />
  </div>
</div>
```

---

### 7.12 Avatar (Chatbot "Avi" / "Vanity")

The chatbot avatar appears in the floating chat bubble and within message threads.

```
Sizes:
  sm: h-8 w-8 (32px) -- in chat message list
  md: h-10 w-10 (40px) -- in chat header
  lg: h-14 w-14 (56px) -- floating bubble

Shape:          rounded-full
Background:     bg-gradient-to-br from-bronze to-bronze-hover
Border:         ring-2 ring-navy (when on dark backgrounds)
Icon:           White "V" letter or stylized AI sparkle icon, centered
Pulse:          On first load, a pulsing ring animation (ring-bronze/50) to draw attention
Online dot:     h-3 w-3 rounded-full bg-success, absolute bottom-0 right-0, border-2 border-navy
```

```html
<!-- Floating chat bubble -->
<button class="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full
  bg-gradient-to-br from-bronze to-bronze-hover
  shadow-lg shadow-bronze/25 flex items-center justify-center
  hover:scale-110 active:scale-95 transition-transform duration-200"
  aria-label="Open chat with Vanity">
  <SparklesIcon class="h-7 w-7 text-white" />
  <!-- Pulse ring (first visit only) -->
  <span class="absolute inset-0 rounded-full animate-ping bg-bronze/30" />
  <!-- Online indicator -->
  <span class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-navy" />
</button>
```

---

### 7.13 Divider

#### Horizontal Divider (Default)

```html
<hr class="border-t border-slate-blue-light" />
```

#### Divider with Text

```html
<div class="flex items-center gap-4">
  <div class="flex-1 h-px bg-slate-blue-light" />
  <span class="text-xs text-muted uppercase tracking-widest">or</span>
  <div class="flex-1 h-px bg-slate-blue-light" />
</div>
```

#### Decorative Gradient Divider

```html
<div class="h-px bg-gradient-to-r from-transparent via-slate-blue-light to-transparent" />
```

---

### 7.14 Skeleton Loading Placeholder

Skeletons mimic the shape of the content they replace. They use a pulsing animation on a dark surface.

```
Background:     bg-slate-blue-light
Animation:      animate-pulse (Tailwind default: 2s ease-in-out infinite)
Radius:         Matches the element being replaced
```

```html
<!-- Skeleton: Card -->
<div class="bg-slate-blue border border-slate-blue-light rounded-lg p-6 space-y-4">
  <!-- Icon placeholder -->
  <div class="h-12 w-12 rounded-lg bg-slate-blue-light animate-pulse" />
  <!-- Title placeholder -->
  <div class="h-5 w-3/4 rounded bg-slate-blue-light animate-pulse" />
  <!-- Description placeholders -->
  <div class="space-y-2">
    <div class="h-3 w-full rounded bg-slate-blue-light animate-pulse" />
    <div class="h-3 w-5/6 rounded bg-slate-blue-light animate-pulse" />
  </div>
  <!-- Button placeholder -->
  <div class="h-9 w-28 rounded-lg bg-slate-blue-light animate-pulse" />
</div>

<!-- Skeleton: Text line -->
<div class="h-4 w-full rounded bg-slate-blue-light animate-pulse" />

<!-- Skeleton: Avatar -->
<div class="h-10 w-10 rounded-full bg-slate-blue-light animate-pulse" />

<!-- Skeleton: Image -->
<div class="aspect-video w-full rounded-lg bg-slate-blue-light animate-pulse" />
```

---

### 7.15 Loading Spinner

An animated SVG spinner used in loading buttons, inline loading indicators, and page-level loading states.

**Anatomy:** A circular SVG with a gap in the stroke, rotating continuously via `animate-spin`.

#### Sizes

| Size | Dimensions | Tailwind | Usage |
|------|-----------|---------|-------|
| `sm` | 16x16 | `h-4 w-4` | Inline in small buttons, badges |
| `md` | 20x20 | `h-5 w-5` | Default button loading state |
| `lg` | 24x24 | `h-6 w-6` | Standalone loading indicators, page-level |

#### Color Variants

| Variant | Color | Tailwind | Usage |
|---------|-------|---------|-------|
| Bronze (default) | `#C08460` | `text-bronze` | Default spinner on dark backgrounds |
| White | `#FFFFFF` | `text-white` | Spinner inside colored buttons (bronze, tool accents) |
| Orange | `#F97316` | `text-orange-500` | Idea Lab loading states |
| Blue | `#3B82F6` | `text-blue-500` | AI Analyzer loading states |
| Green | `#22C55E` | `text-green-500` | Get Estimate loading states |
| Purple | `#A855F7` | `text-purple-500` | ROI Calculator loading states |

#### SVG Template

```html
<svg
  class="animate-spin h-5 w-5 text-bronze"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  aria-label="Loading"
  role="status"
>
  <circle
    class="opacity-25"
    cx="12" cy="12" r="10"
    stroke="currentColor"
    stroke-width="4"
  />
  <path
    class="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
  />
</svg>
```

**Accessibility:** Always include `aria-label="Loading"` and `role="status"` on the spinner SVG. When used inside a button, the button itself should have `aria-busy="true"` and the spinner can use `aria-hidden="true"` since the button label already communicates the loading state.

**Animation:** Uses Tailwind's built-in `animate-spin` utility, which applies `animation: spin 1s linear infinite`.

---

### 7.16 Empty State

A centered layout pattern used when a page section or component has no content to display. Common uses include: "No results found" in search, "Start by filling out the form" for direct-URL tool access, and empty list states.

#### Layout

```
Container:      flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12
Icon:           h-12 w-12 (48px) text-muted mb-4
Heading:        text-h4 text-white mb-2
Description:    text-base text-muted mb-6
CTA (optional): Primary or secondary button
```

#### Example

```html
<div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
  <!-- Icon -->
  <div class="h-12 w-12 rounded-full bg-slate-blue-light flex items-center justify-center mb-4">
    <SearchIcon class="h-6 w-6 text-muted" />
  </div>
  <!-- Heading -->
  <h3 class="text-h4 text-white mb-2">No results found</h3>
  <!-- Description -->
  <p class="text-base text-muted mb-6">
    Try adjusting your search criteria or browse our solutions catalog.
  </p>
  <!-- CTA (optional) -->
  <button class="h-11 px-5 py-2.5 bg-bronze text-white font-semibold rounded-lg shadow-sm
    hover:bg-bronze-hover hover:shadow-md hover:scale-[1.02]
    transition-all duration-200">
    Browse Solutions
  </button>
</div>
```

#### Variants

| Context | Icon | Heading | Description | CTA |
|---------|------|---------|-------------|-----|
| No search results | `SearchIcon` | "No results found" | "Try adjusting your search criteria." | "Clear filters" (ghost) |
| Empty form state (direct URL) | `ClipboardIcon` | "Start by filling out the form" | "Answer a few questions to get your AI-powered estimate." | "Begin" (primary) |
| Empty list | `InboxIcon` | "Nothing here yet" | "Content will appear here once available." | -- |
| Error loading | `AlertTriangleIcon` | "Something went wrong" | "We couldn't load this content. Please try again." | "Retry" (primary) |

**Spacing:** The empty state container uses `py-12` to provide breathing room. When placed inside a card, the card's own padding (`p-6`) is sufficient and the empty state can reduce to `py-8`.

---

## 8. Iconography

### 8.1 Icon Library

**Primary library:** [Lucide Icons](https://lucide.dev) (open-source, MIT license).

**Why Lucide:**
- Clean, consistent 24px grid design
- Outlined style matches the modern/premium brand aesthetic
- Excellent tree-shaking with `lucide-react` (only imports used icons)
- Active maintenance and comprehensive set (1000+ icons)
- `1.5px` stroke width feels balanced on dark backgrounds

**Installation:**
```bash
npm install lucide-react
```

### 8.2 Icon Sizes

| Token | Size | Stroke | Tailwind | Usage |
|-------|------|--------|---------|-------|
| `sm` | 16px | 1.5px | `h-4 w-4` | Inline with small text, badges, breadcrumbs |
| `md` | 20px | 1.5px | `h-5 w-5` | Inline with body text, buttons, nav items |
| `lg` | 24px | 1.5px | `h-6 w-6` | Standalone icons, card icons, form icons |
| `xl` | 32px | 1.5px | `h-8 w-8` | Feature icons in cards |
| `2xl` | 48px | 1.5px | `h-12 w-12` | Hero feature icons, empty states |

### 8.3 Icon Color Rules

| Context | Color | Tailwind |
|---------|-------|---------|
| Default (on dark bg) | `#9CA3AF` | `text-muted` |
| Interactive (in buttons) | Inherit from button text | (inherits) |
| Accent / highlight | `#C08460` | `text-bronze` |
| On bronze background | `#FFFFFF` | `text-white` |
| Disabled | `#6B7280` | `text-muted-light` |
| Status: success | `#34D399` | `text-success` |
| Status: error | `#F87171` | `text-error` |
| Status: warning | `#FBBF24` | `text-warning` |
| Status: info | `#60A5FA` | `text-info` |
| Tool: Idea Lab | `#F97316` | `text-orange-500` |
| Tool: AI Analyzer | `#3B82F6` | `text-blue-500` |
| Tool: Get Estimate | `#22C55E` | `text-green-500` |
| Tool: ROI Calculator | `#A855F7` | `text-purple-500` |

### 8.4 Icon Usage Guidelines

1. **Always pair icons with text labels** in navigation and buttons. Icon-only buttons require `aria-label`.
2. **Decorative icons** (next to headings, in cards) use `aria-hidden="true"` to hide from screen readers.
3. **Maintain consistent icon size** within the same component type. Do not mix `h-5` and `h-6` icons in the same button row.
4. **Do not colorize icons arbitrarily.** Follow the color rules above. Icons should never compete with text for attention.

---

## 9. Animation and Motion

### 9.1 Timing Guidelines

| Duration | Usage | Tailwind |
|----------|-------|---------|
| 100ms | Micro-interactions (opacity, color change) | `duration-100` |
| 150ms | Button state changes, tooltip show/hide | `duration-150` |
| 200ms | Focus rings, hover effects, small transitions | `duration-200` |
| 300ms | Card hover lift, tab switching, nav transitions | `duration-300` |
| 500ms | Page section fade-in, modal enter, progress bar | `duration-500` |
| 700ms | Hero element stagger, complex reveals | `duration-700` |
| 1000ms | Counter animations, circular progress fill | `duration-1000` |

### 9.2 Easing Functions

| Name | CSS | Tailwind | Usage |
|------|-----|---------|-------|
| Default | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-in-out` | Most transitions |
| Enter | `cubic-bezier(0, 0, 0.2, 1)` | `ease-out` | Elements appearing (modals, toasts) |
| Exit | `cubic-bezier(0.4, 0, 1, 1)` | `ease-in` | Elements disappearing |
| Spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Custom | Playful bounce (counters, CTA attention) |

### 9.3 Framer Motion Presets

Define these as reusable motion variants:

```ts
// motion/variants.ts

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] },
  },
};

export const slideUp = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};
```

### 9.4 Scroll-Triggered Animations

Use Framer Motion's `whileInView` with `viewport={{ once: true, margin: '-10%' }}` for scroll reveals:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10%' }}
  variants={fadeInUp}
>
  <SectionContent />
</motion.div>
```

**Staggered grid items:**
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10%' }}
  variants={staggerContainer}
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={fadeInUp}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

### 9.5 Counter Animation

For trust indicator numbers (apps delivered, countries served, etc.):

```tsx
// Use framer-motion's useMotionValue + useTransform + animate
// Target: count from 0 to final value over 1.5s with easeOut
// Trigger: when scrolled into view (IntersectionObserver or whileInView)
// Format: Use Intl.NumberFormat for locale-aware number display
// Suffix: Append "+", "%", etc. after the number
```

### 9.6 Reduced Motion

Always respect `prefers-reduced-motion`. Wrap all Framer Motion with:

```tsx
const prefersReducedMotion = useReducedMotion();

// In variants, check:
const fadeInUp = {
  hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: prefersReducedMotion ? 0 : 0.5 },
  },
};
```

Also add the CSS fallback:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 9.7 Specific Component Animations

| Component | Animation | Duration | Easing |
|-----------|-----------|----------|--------|
| Card hover | `translateY(-4px)` + shadow increase | 300ms | ease-in-out |
| Button hover | `scale(1.02)` + color shift | 200ms | ease-in-out |
| Button press | `scale(0.98)` | 100ms | ease-out |
| Nav link underline | Width grows from center | 200ms | ease-out |
| Modal enter | Scale 95% to 100% + fade | 200ms | ease-out |
| Modal exit | Scale 100% to 95% + fade | 150ms | ease-in |
| Drawer enter | Slide from right | 300ms | ease-out |
| Drawer exit | Slide to right | 200ms | ease-in |
| Toast enter | Slide from right + fade (desktop) | 300ms | ease-out |
| Toast exit | Fade out + slide right | 200ms | ease-in |
| Accordion expand | Height auto + fade content | 300ms | ease-in-out |
| Tab switch | Underline slides to active tab | 200ms | ease-in-out |
| Chatbot expand | Scale from bottom-right origin | 300ms | spring |
| Chatbot message | Slide up + fade | 200ms | ease-out |
| Counter | Count up with easeOut | 1500ms | ease-out |
| Skeleton pulse | Opacity 0.5 to 1.0 loop | 2000ms | ease-in-out |
| Hero float | Subtle Y oscillation (parallax) | 6000ms | sine loop |
| Page section enter | Fade up from 20px below | 500ms | ease-out |
| Exit intent modal | Background fade + modal slide up | 300ms | ease-out |

---

## 10. Tailwind Configuration

Below is the complete Tailwind configuration extension object. This should be placed in `tailwind.config.ts` (or merged into an existing one). It implements every token defined in this design system.

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── COLORS ───────────────────────────────────────────
      colors: {
        // Backgrounds
        navy: '#0F1419',
        'slate-blue': '#1A2332',
        'slate-blue-light': '#243044',
        'slate-dark': '#0D1117',

        // Bronze Accent Family
        bronze: {
          DEFAULT: '#C08460',
          hover: '#A6714E',
          light: '#D4A583',
          muted: '#8B6344',
          glow: 'rgba(192, 132, 96, 0.15)',
        },

        // Text
        'off-white': '#F4F4F2',
        muted: {
          DEFAULT: '#9CA3AF',
          light: '#6B7280',
        },

        // Semantic / Status
        success: {
          DEFAULT: '#34D399',
          dark: '#065F46',
        },
        warning: {
          DEFAULT: '#FBBF24',
          dark: '#78350F',
        },
        error: {
          DEFAULT: '#F87171',
          dark: '#7F1D1D',
        },
        info: {
          DEFAULT: '#60A5FA',
          dark: '#1E3A5F',
        },

        // AI Tool Accents
        'tool-orange': {
          DEFAULT: '#F97316',
          dark: '#431407',
          light: '#FDBA74',
        },
        'tool-blue': {
          DEFAULT: '#3B82F6',
          dark: '#172554',
          light: '#93C5FD',
        },
        'tool-green': {
          DEFAULT: '#22C55E',
          dark: '#052E16',
          light: '#86EFAC',
        },
        'tool-purple': {
          DEFAULT: '#A855F7',
          dark: '#3B0764',
          light: '#D8B4FE',
        },
      },

      // ─── FONT FAMILY ─────────────────────────────────────
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
      },

      // ─── FONT SIZE ───────────────────────────────────────
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.625', letterSpacing: '0em' }],
        lg: ['1.125rem', { lineHeight: '1.556', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.333', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.267', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.222', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.167', letterSpacing: '-0.025em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        // Fluid heading utilities (use via @apply or className)
        display: [
          'clamp(2.25rem, 5vw + 1rem, 4.5rem)',
          { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' },
        ],
        h1: [
          'clamp(1.875rem, 4vw + 0.5rem, 3.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' },
        ],
        h2: [
          'clamp(1.5rem, 3vw + 0.25rem, 2.625rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h3: [
          'clamp(1.25rem, 2vw + 0.25rem, 1.875rem)',
          { lineHeight: '1.267', letterSpacing: '-0.015em', fontWeight: '600' },
        ],
        h4: [
          'clamp(1.125rem, 1.5vw + 0.25rem, 1.5rem)',
          { lineHeight: '1.333', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        h5: [
          'clamp(1rem, 1vw + 0.25rem, 1.25rem)',
          { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        h6: [
          'clamp(0.875rem, 0.5vw + 0.5rem, 1rem)',
          { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '600' },
        ],
      },

      // ─── SPACING ─────────────────────────────────────────
      // Tailwind's default spacing scale is fine (4px base).
      // Adding custom named spacings for section rhythm.
      spacing: {
        13: '3.25rem', // 52px - lg button height
        15: '3.75rem', // 60px
        18: '4.5rem',  // 72px
        22: '5.5rem',  // 88px
        26: '6.5rem',  // 104px
        30: '7.5rem',  // 120px
        34: '8.5rem',  // 136px
        38: '9.5rem',  // 152px
      },

      // ─── MAX WIDTH ───────────────────────────────────────
      maxWidth: {
        container: '1320px',
        'container-sm': '1200px',
        narrow: '768px',
        'form-lg': '640px',
        'form-md': '480px',
      },

      // ─── BORDER RADIUS ───────────────────────────────────
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '6px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },

      // ─── BOX SHADOW ──────────────────────────────────────
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        // Glow effects
        'glow-bronze': '0 0 20px rgba(192, 132, 96, 0.25), 0 0 40px rgba(192, 132, 96, 0.1)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.2)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.2)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.2)',
      },

      // ─── BACKDROP BLUR ───────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ─── ANIMATION ───────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(192, 132, 96, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(192, 132, 96, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // ─── TRANSITION TIMING ───────────────────────────────
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ─── Z-INDEX ─────────────────────────────────────────
      zIndex: {
        nav: '40',
        'chat-bubble': '40',
        'chat-window': '45',
        modal: '50',
        'modal-backdrop': '49',
        toast: '100',
        tooltip: '50',
      },
    },
  },
  plugins: [
    // Add @tailwindcss/forms for better default form styling (optional)
    // require('@tailwindcss/forms'),
  ],
};

export default config;
```

### 10.1 Global CSS (globals.css)

Place this in your global stylesheet alongside Tailwind imports:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Root variables for non-Tailwind usage */
  :root {
    --color-navy: #0F1419;
    --color-slate-blue: #1A2332;
    --color-slate-blue-light: #243044;
    --color-slate-dark: #0D1117;
    --color-bronze: #C08460;
    --color-bronze-hover: #A6714E;
    --color-bronze-light: #D4A583;
    --color-off-white: #F4F4F2;
    --color-muted: #9CA3AF;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-navy text-off-white font-sans;
  }

  /* Selection highlight */
  ::selection {
    @apply bg-bronze/30 text-white;
  }

  /* Focus visible for keyboard navigation */
  :focus-visible {
    @apply outline-none ring-2 ring-bronze ring-offset-2 ring-offset-navy;
  }

  /* Scrollbar styling (Webkit) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    @apply bg-navy;
  }
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-blue-light rounded-full;
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-light;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  /* Container utility */
  .container-main {
    @apply mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8;
  }

  .container-narrow {
    @apply mx-auto w-full max-w-[768px] px-4 sm:px-6;
  }

  /* Section label (e.g., "OUR SERVICES" above headings) */
  .section-label {
    @apply text-sm font-semibold uppercase tracking-[0.1em] text-bronze;
  }

  /* Card base */
  .card {
    @apply bg-slate-blue border border-slate-blue-light rounded-lg p-6 shadow-md
      hover:shadow-lg hover:-translate-y-1 transition-all duration-300;
  }

  .card-featured {
    @apply bg-slate-blue border border-bronze/30 border-t-2 border-t-bronze rounded-lg p-6 shadow-lg
      hover:shadow-glow-bronze transition-all duration-300;
  }

  /* Gradient divider */
  .divider-gradient {
    @apply h-px bg-gradient-to-r from-transparent via-slate-blue-light to-transparent;
  }
}

@layer utilities {
  /* Custom background utilities */
  .bg-card-glow {
    background: radial-gradient(ellipse at top, rgba(192,132,96,0.08) 0%, transparent 70%);
  }

  .bg-divider-fade {
    background: linear-gradient(90deg, transparent 0%, #243044 50%, transparent 100%);
  }

  .bg-vignette {
    background: radial-gradient(ellipse at center, #1A2332 0%, #0F1419 70%);
  }

  /* Tabular numbers for stats */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Text balance for headings */
  .text-balance {
    text-wrap: balance;
  }

  /* Line clamp utilities (if not using @tailwindcss/line-clamp) */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

---

## Appendix A: Quick Reference Cheatsheet

### Backgrounds
```
Page background:        bg-navy
Card / elevated:        bg-slate-blue
Subtle surface:         bg-slate-blue-light
Footer / deep:          bg-slate-dark
Overlay:                bg-navy/80 backdrop-blur-sm
```

### Text
```
Heading:                text-white font-bold
Body:                   text-off-white
Secondary:              text-muted
Disabled/placeholder:   text-muted-light
Accent:                 text-bronze
Link:                   text-bronze hover:text-bronze-light
```

### Buttons
```
Primary:    bg-bronze text-white hover:bg-bronze-hover rounded-lg
Secondary:  bg-transparent text-bronze border border-bronze hover:bg-bronze/10 rounded-lg
Ghost:      bg-transparent text-off-white hover:bg-slate-blue-light/60 rounded-lg
```

### Cards
```
Default:    bg-slate-blue border border-slate-blue-light rounded-lg p-6 shadow-md
Featured:   bg-slate-blue border border-bronze/30 border-t-2 border-t-bronze rounded-lg p-6 shadow-lg
```

### Focus
```
All interactive:  focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy
```

### Section Structure
```html
<section class="w-full bg-navy">
  <div class="container-main py-12 md:py-20">
    <p class="section-label">SECTION LABEL</p>
    <h2 class="text-h2 text-white mt-3 text-balance">Section Heading</h2>
    <p class="text-lg text-muted mt-4 max-w-2xl">Section description.</p>
    <!-- Content grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      ...
    </div>
  </div>
</section>
```

---

## Appendix B: Accessibility Checklist

Every component built using this design system must satisfy:

- [ ] Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space, Escape)
- [ ] Focus states are visible (bronze focus ring, 2px, offset 2px)
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Icons have `aria-hidden="true"` when decorative, `aria-label` when functional
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages are programmatically associated (`aria-describedby`)
- [ ] Modals trap focus and return focus on close
- [ ] Reduced motion is respected (`prefers-reduced-motion`)
- [ ] Content is navigable with screen readers (semantic HTML, ARIA landmarks)
- [ ] Heading hierarchy is sequential (h1 > h2 > h3, no skipping)
- [ ] Language is declared on `<html>` (`lang="en"` or `lang="ar"`)
- [ ] RTL layout works correctly for Arabic content

---

## Appendix C: File Structure Recommendation

```
src/
  styles/
    globals.css              # Tailwind imports + base/component/utility layers
  lib/
    motion/
      variants.ts            # Framer Motion reusable variants
  components/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Select.tsx
      Checkbox.tsx
      Radio.tsx
      Badge.tsx
      Modal.tsx
      Tabs.tsx
      Accordion.tsx
      Progress.tsx
      Stepper.tsx
      Toast.tsx
      Tooltip.tsx
      Avatar.tsx
      Divider.tsx
      Skeleton.tsx
      Spinner.tsx
      EmptyState.tsx
    layout/
      Navbar.tsx
      MobileDrawer.tsx
      Footer.tsx
      Container.tsx
      Section.tsx
      Breadcrumbs.tsx
    sections/
      Hero.tsx
      TrustIndicators.tsx
      ServicesOverview.tsx
      AIToolsSpotlight.tsx
      SolutionsPreview.tsx
      AppShowcase.tsx
      WhyChooseUs.tsx
      CaseStudiesPreview.tsx
      FinalCTA.tsx
    chat/
      ChatBubble.tsx
      ChatWindow.tsx
      ChatMessage.tsx
  tailwind.config.ts         # Full config from Section 10
```

---

**End of Design System v1.0**

This document is the single source of truth for the Aviniti website. Every color, spacing value, typography style, and component specification above must be followed exactly. Deviations require updating this document first, then the implementation.


---

## 11. Print Styles

### 11.1 Purpose

Certain pages on the Aviniti website need to be print-friendly for users who want to save or share physical copies. Print styles optimize the experience by removing interactive elements, adjusting colors for readability, and reformatting layouts for paper.

### 11.2 Pages Requiring Print Optimization

The following pages should include print-specific CSS:

1. **Legal Pages:** Privacy Policy, Terms of Service
2. **AI Tool Results:** Get AI Estimate results, ROI Calculator results, AI Idea Analyzer results, Idea Lab results
3. **Blog Posts:** Individual blog post pages
4. **Case Studies:** Individual case study pages
5. **Solution Detail Pages** (Optional, lower priority)

Pages that **do NOT** need print optimization:
- Homepage
- Navigation/catalog pages (Solutions index, Blog index)
- Interactive tool input forms (only the results pages need print styles)
- About page
- Contact page

### 11.3 General Print Rules

Apply these styles globally within a `@media print {}` block:

#### Hide Interactive and Navigation Elements

```css
@media print {
  /* Hide navigation and interactive UI */
  nav,
  header[role="banner"],
  footer[role="contentinfo"],
  .mobile-drawer,
  .navbar,
  .breadcrumbs,

  /* Hide floating widgets */
  .chatbot-bubble,
  .chatbot-window,
  .whatsapp-float-button,
  .scroll-to-top,
  .exit-intent-modal,

  /* Hide CTAs and interactive elements on printed pages */
  button:not(.print-keep),
  .cta-section,
  .newsletter-signup,
  form,

  /* Hide animations and decorative elements */
  .animated-counter,
  video,
  iframe:not(.print-keep) {
    display: none !important;
  }
}
```

**Exception:** Add `.print-keep` class to elements that should remain visible in print (e.g., a "Print" button itself can be hidden, but critical content buttons should stay if they provide context).

#### Page Layout

```css
@media print {
  * {
    /* Prevent page breaks inside elements */
    page-break-inside: avoid;
    break-inside: avoid;
  }

  body {
    /* Remove background color (save ink) */
    background: white !important;
    color: black !important;
    margin: 0;
    padding: 0;
  }

  /* Full-width containers for print */
  .container,
  .max-w-screen-xl,
  .max-w-7xl,
  main {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Page breaks for major sections */
  section {
    page-break-before: auto;
    page-break-after: auto;
  }

  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  p, li {
    orphans: 3;
    widows: 3;
  }
}
```

### 11.4 Typography Adjustments

Printed text requires different typography for readability on paper.

```css
@media print {
  /* Use black text on white background */
  body {
    font-family: Georgia, 'Times New Roman', serif !important;
    font-size: 12pt !important;
    line-height: 1.6 !important;
    color: #000 !important;
  }

  /* Headings in sans-serif for hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Arial', 'Helvetica', sans-serif !important;
    color: #000 !important;
    font-weight: bold !important;
  }

  h1 {
    font-size: 24pt !important;
    margin-bottom: 12pt !important;
  }

  h2 {
    font-size: 18pt !important;
    margin-top: 16pt !important;
    margin-bottom: 8pt !important;
  }

  h3 {
    font-size: 14pt !important;
    margin-top: 12pt !important;
    margin-bottom: 6pt !important;
  }

  h4, h5, h6 {
    font-size: 12pt !important;
    margin-top: 10pt !important;
    margin-bottom: 4pt !important;
  }

  p {
    margin-bottom: 8pt !important;
  }

  /* Code blocks */
  code, pre {
    font-family: 'Courier New', monospace !important;
    font-size: 10pt !important;
    background: #f5f5f5 !important;
    border: 1px solid #ccc !important;
    padding: 4pt !important;
  }

  /* Lists */
  ul, ol {
    margin-left: 20pt !important;
  }

  li {
    margin-bottom: 4pt !important;
  }

  /* Tables */
  table {
    border-collapse: collapse !important;
    width: 100% !important;
    margin-bottom: 12pt !important;
  }

  th, td {
    border: 1px solid #000 !important;
    padding: 6pt !important;
    text-align: left !important;
  }

  th {
    background: #e0e0e0 !important;
    font-weight: bold !important;
  }
}
```

### 11.5 Logo and Branding

Show the Aviniti logo at the top of printed pages for brand identity.

```css
@media print {
  /* Print header with logo */
  .print-header {
    display: block !important;
    text-align: center;
    margin-bottom: 20pt;
    padding-bottom: 10pt;
    border-bottom: 2px solid #000;
  }

  .print-logo {
    display: inline-block !important;
    max-width: 150pt;
    height: auto;
    /* Use dark/black version of logo for print */
    filter: grayscale(100%) contrast(1.2);
  }
}
```

**Implementation:** Add a hidden print header to pages that need it:

```html
<div class="print-header hidden print:block">
  <img src="/logo-dark.png" alt="Aviniti" class="print-logo" />
  <p class="text-sm text-gray-600">aviniti.com | Your Ideas, Our Reality</p>
</div>
```

### 11.6 Link URL Display

Show URLs after hyperlinks so readers know where links point.

```css
@media print {
  /* Display link URLs in parentheses after the link text */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 9pt;
    color: #666;
    word-wrap: break-word;
  }

  /* Don't show URLs for internal anchor links */
  a[href^="#"]:after,
  a[href^="javascript:"]:after {
    content: "";
  }

  /* Make links black (not blue) */
  a {
    color: #000 !important;
    text-decoration: underline !important;
  }
}
```

### 11.7 Page-Specific Print Rules

#### Legal Pages (Privacy Policy, Terms of Service)

```css
@media print {
  /* Legal page formatting */
  .legal-page h1 {
    text-align: center;
    border-bottom: 2px solid #000;
    padding-bottom: 10pt;
    margin-bottom: 20pt;
  }

  .legal-page h2 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 4pt;
  }

  .legal-page ol,
  .legal-page ul {
    margin-left: 30pt;
  }

  /* Add page numbers to footer for legal docs */
  @page {
    margin: 1in;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 9pt;
      color: #666;
    }
  }
}
```

#### AI Tool Results Pages

```css
@media print {
  /* Format AI tool results for print */
  .ai-results-container {
    display: block !important;
  }

  /* Results summary box */
  .results-summary {
    border: 2px solid #000 !important;
    padding: 12pt !important;
    margin-bottom: 16pt !important;
    background: #f9f9f9 !important;
  }

  /* Format tables with borders */
  .results-table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  .results-table th,
  .results-table td {
    border: 1px solid #333 !important;
    padding: 6pt !important;
  }

  /* Remove animations from charts/visualizations */
  .chart-container svg,
  .chart-container canvas {
    animation: none !important;
    transition: none !important;
  }

  /* ROI Calculator specific */
  .roi-breakdown-card {
    border: 1px solid #ccc !important;
    padding: 10pt !important;
    margin-bottom: 12pt !important;
    background: white !important;
  }

  /* Estimate results specific */
  .estimate-breakdown {
    border-left: 4px solid #000 !important;
    padding-left: 10pt !important;
    margin-bottom: 12pt !important;
  }
}
```

#### Blog Posts

```css
@media print {
  /* Blog post formatting */
  .blog-post-header {
    text-align: center;
    margin-bottom: 20pt;
  }

  .blog-post-title {
    font-size: 22pt !important;
    margin-bottom: 6pt !important;
  }

  .blog-post-meta {
    font-size: 10pt !important;
    color: #666 !important;
    margin-bottom: 16pt !important;
  }

  .blog-post-content img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid;
    margin: 12pt 0 !important;
  }

  .blog-post-content blockquote {
    border-left: 4px solid #ccc !important;
    padding-left: 12pt !important;
    margin: 12pt 0 !important;
    font-style: italic !important;
  }

  /* Hide related posts and comments sections */
  .related-posts,
  .comments-section,
  .blog-sidebar {
    display: none !important;
  }
}
```

#### Case Studies

```css
@media print {
  /* Case study formatting */
  .case-study-hero {
    text-align: center;
    margin-bottom: 20pt;
    border-bottom: 2px solid #000;
    padding-bottom: 12pt;
  }

  .case-study-metrics {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 12pt !important;
    margin-bottom: 16pt !important;
    page-break-inside: avoid;
  }

  .metric-card {
    border: 1px solid #ccc !important;
    padding: 8pt !important;
    text-align: center !important;
    background: #f5f5f5 !important;
  }

  .case-study-section {
    margin-bottom: 20pt;
    page-break-inside: avoid;
  }

  .case-study-section h2 {
    background: #e0e0e0 !important;
    padding: 6pt !important;
    margin-bottom: 8pt !important;
  }
}
```

### 11.8 Page Break Rules

Control where pages break to maintain readability.

```css
@media print {
  /* Prevent page breaks after headings */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }

  /* Prevent page breaks inside key elements */
  blockquote,
  table,
  pre,
  .metric-card,
  .results-summary,
  .case-study-metrics {
    page-break-inside: avoid;
  }

  /* Force page breaks before major sections if desired */
  .section-with-page-break {
    page-break-before: always;
  }

  /* Avoid widows and orphans */
  p, li {
    orphans: 3;
    widows: 3;
  }
}
```

### 11.9 Images and Media

```css
@media print {
  /* Images */
  img {
    max-width: 100% !important;
    height: auto !important;
    page-break-inside: avoid;
    display: block;
    margin: 8pt auto;
  }

  /* Remove lazy loading attributes for print */
  img[loading="lazy"] {
    loading: eager !important;
  }

  /* Hide background images (save ink) */
  * {
    background-image: none !important;
  }

  /* Exception: Keep product images, logos, essential visuals */
  .print-keep-image {
    background-image: inherit !important;
  }

  /* Videos and iframes (hide or show placeholder) */
  video,
  iframe:not(.print-keep) {
    display: none !important;
  }
}
```

### 11.10 Shadows and Effects

Remove shadows and visual effects to save ink and improve clarity.

```css
@media print {
  * {
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    opacity: 1 !important;
  }

  /* Remove rounded corners (optional, depends on preference) */
  * {
    border-radius: 0 !important;
  }
}
```

### 11.11 Print-Specific Utility Classes

Add these Tailwind utilities for conditional print display:

```css
@media print {
  .print\:hidden {
    display: none !important;
  }

  .print\:block {
    display: block !important;
  }

  .print\:inline-block {
    display: inline-block !important;
  }

  .print\:table {
    display: table !important;
  }

  .print\:table-row {
    display: table-row !important;
  }

  .print\:table-cell {
    display: table-cell !important;
  }

  /* Page break utilities */
  .print\:break-before {
    page-break-before: always !important;
  }

  .print\:break-after {
    page-break-after: always !important;
  }

  .print\:break-inside-avoid {
    page-break-inside: avoid !important;
  }
}
```

**Usage in HTML:**

```html
<!-- Hide on print -->
<button class="print:hidden">Get Estimate</button>

<!-- Show only on print -->
<div class="hidden print:block">
  <p>Generated on: {date}</p>
  <p>For more information, visit aviniti.com</p>
</div>

<!-- Avoid page breaks inside this element -->
<div class="print:break-inside-avoid">
  ...
</div>
```

### 11.12 Implementation Checklist

For each page type requiring print optimization:

- [ ] Add `.print-header` with logo and site URL
- [ ] Hide navigation, footer, chatbot, WhatsApp button with `print:hidden`
- [ ] Add print-specific CSS in `@media print {}` block
- [ ] Test print preview in Chrome, Firefox, Safari
- [ ] Verify page breaks occur in logical places
- [ ] Ensure all tables and data are visible and readable
- [ ] Check that URLs are displayed after links (legal pages, blog posts)
- [ ] Confirm no unnecessary color backgrounds (save ink)
- [ ] Validate heading hierarchy and typography on printed page
- [ ] Add "Print this page" button with `onClick={window.print()}`

### 11.13 Browser Print Dialog

Add a "Print" button to pages that need it:

```tsx
// Print button component
export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 h-11 px-5 py-2.5
        bg-slate-blue border border-slate-blue-light rounded-lg
        text-base text-off-white font-semibold
        hover:bg-slate-blue-light transition-all duration-200
        print:hidden"
      aria-label="Print this page"
    >
      <PrinterIcon className="h-5 w-5" />
      Print this page
    </button>
  );
}
```

Place this button prominently on:
- Legal pages (top-right of content)
- AI tool results pages (below the results summary)
- Blog posts (at the end of the article)
- Case studies (at the end of the page)

---

