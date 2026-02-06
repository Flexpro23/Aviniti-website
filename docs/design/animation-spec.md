# Aviniti Animation & Interaction Specification

**Version:** 1.0
**Last Updated:** February 2026
**Status:** Implementation-Ready
**Framework:** Next.js 14+ App Router / Framer Motion 11+ / Tailwind CSS v4
**Design System Reference:** `design-system.md` Section 9

---

## Table of Contents

1. [Animation Philosophy](#1-animation-philosophy)
2. [Design System Token Reference](#2-design-system-token-reference)
3. [Page Transition System](#3-page-transition-system)
4. [Scroll-Triggered Animations](#4-scroll-triggered-animations)
5. [Micro-Interactions](#5-micro-interactions)
6. [AI Tool Specific Animations](#6-ai-tool-specific-animations)
7. [Chatbot "Avi" Animations](#7-chatbot-avi-animations)
8. [Exit Intent Popup Animation](#8-exit-intent-popup-animation)
9. [Loading & Skeleton States](#9-loading--skeleton-states)
10. [Parallax & Decorative Motion](#10-parallax--decorative-motion)
11. [Performance Budget](#11-performance-budget)
12. [Reduced Motion Fallbacks](#12-reduced-motion-fallbacks)
13. [Framer Motion Code Patterns](#13-framer-motion-code-patterns)
14. [Page-by-Page Animation Map](#14-page-by-page-animation-map)

---

## 1. Animation Philosophy

### 1.1 Guiding Principle: "Polished but Not Heavy"

The Aviniti website uses motion as a **communication tool**, not decoration. Every animation must answer at least one of these questions for the user:

- **Where am I?** Page transitions and scroll reveals orient the user within the site hierarchy.
- **What happened?** State changes on buttons, forms, and interactive elements confirm that the system received input.
- **What should I look at?** Stagger sequences and entrance animations direct attention through a deliberate reading order.
- **Is something happening?** Loading states, progress indicators, and AI processing animations communicate that work is underway.

If an animation does not serve one of these purposes, it does not belong.

### 1.2 Calibration Level

This is **not** Apple-level theatrical motion where scroll position controls 3D transforms and entire scenes unfold over thousands of pixels. It is also **not** a minimal "instant-swap" approach where everything appears immediately.

The target calibration is:

- **Entrance animations** that take 400-600ms with ease-out easing. Fast enough that a returning visitor never feels delayed, slow enough that a first-time visitor perceives intentional craft.
- **Micro-interactions** that respond within 100-200ms. The user must never wait for an animation to complete before the interface is usable.
- **Stagger sequences** that add 60-100ms per item. A group of 4 cards reveals in roughly 0.8 seconds total. A group of 8 items reveals in roughly 1.2 seconds total. Never longer than 1.5 seconds for any complete stagger sequence.
- **No scroll-jacking.** The user controls scroll velocity at all times. Animations are triggered by scroll position but never impede scroll behavior.
- **No autoplay video.** No full-screen transitions that block content. No animation gates that force the user to wait.

### 1.3 Motion Hierarchy

Animations are categorized by their importance to comprehension:

| Tier | Category | Purpose | Can Be Disabled? |
|------|----------|---------|-----------------|
| 1 | State feedback | Button press, form validation, loading | No -- these communicate system status |
| 2 | Content reveals | Scroll-triggered fade-in, staggers | Yes -- content appears instantly instead |
| 3 | Delight | Card hover lift, counter roll-up, float | Yes -- static fallback |
| 4 | Decorative | Parallax, gradient shifts, mouse-follow | Yes -- completely removed |

When `prefers-reduced-motion: reduce` is active, Tiers 2-4 are disabled. Tier 1 animations are simplified to opacity-only transitions at 0ms duration.

---

## 2. Design System Token Reference

All animations reference the tokens defined in `design-system.md` Section 9. This section consolidates them for quick lookup during implementation.

### 2.1 Duration Tokens

```ts
// lib/motion/tokens.ts

export const duration = {
  instant: 0.1,    // 100ms - micro-interactions (opacity, color)
  fast: 0.15,      // 150ms - button states, tooltip show/hide
  normal: 0.2,     // 200ms - focus rings, hover effects, small transitions
  moderate: 0.3,   // 300ms - card hover lift, tab switching, nav transitions
  slow: 0.5,       // 500ms - section fade-in, modal enter, progress bar
  slower: 0.7,     // 700ms - hero element stagger, complex reveals
  slowest: 1.0,    // 1000ms - counter animations, circular progress fill
  counter: 1.5,    // 1500ms - full counter roll-up
  float: 6.0,      // 6000ms - decorative float loop
  skeleton: 2.0,   // 2000ms - skeleton pulse cycle
} as const;
```

### 2.2 Easing Tokens

```ts
// lib/motion/tokens.ts (continued)

export const easing = {
  /** Most transitions -- smooth in-out */
  default: [0.4, 0, 0.2, 1] as const,

  /** Elements appearing -- fast start, gentle stop (modals, toasts, scroll reveals) */
  enter: [0, 0, 0.2, 1] as const,

  /** Elements disappearing -- gentle start, fast finish */
  exit: [0.4, 0, 1, 1] as const,

  /** Playful overshoot -- counters, CTA attention, chatbot bounce */
  spring: [0.34, 1.56, 0.64, 1] as const,

  /** Homepage design spec ease-out-expo -- hero choreography */
  expoOut: [0.16, 1, 0.3, 1] as const,
} as const;

/**
 * Framer Motion spring configuration equivalents.
 * Use these for physics-based animations where cubic-bezier
 * does not provide enough organic feel.
 */
export const springConfig = {
  /** Snappy response for UI elements */
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },

  /** Gentle settle for modals and panels */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 24 },

  /** Bouncy for attention-grabbing elements */
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
} as const;
```

### 2.3 Spacing Tokens for Motion

These values define how far elements travel during entrance animations. They reference the design system's 4px base unit.

```ts
export const motionDistance = {
  /** Subtle shift -- badges, subheadlines */
  sm: 10,   // 10px

  /** Standard entrance -- cards, sections, body elements */
  md: 20,   // 20px

  /** Dramatic entrance -- hero device, large panels */
  lg: 30,   // 30px

  /** Slide animations -- drawers, toasts, modals on mobile */
  full: '100%',
} as const;
```

---

## 3. Page Transition System

### 3.1 Architecture: Next.js App Router Compatible

Page transitions use Framer Motion's `AnimatePresence` within a shared layout component. Because Next.js App Router uses React Server Components by default, the transition wrapper must be a client component that wraps page content.

```
src/
  app/
    layout.tsx              # Root layout (Server Component)
    template.tsx            # Page transition wrapper (Client Component)
    page.tsx                # Homepage
    get-estimate/
      page.tsx
    idea-lab/
      page.tsx
    ...
```

### 3.2 Page Transition Variant

Every page transition uses a consistent fade + subtle vertical shift. No horizontal slides, no scale transforms -- these feel heavy for page-level motion and conflict with browser back/forward gestures.

```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';
import { duration, easing } from '@/lib/motion/tokens';

const pageTransition = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.moderate,
      ease: easing.enter,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: duration.normal,
      ease: easing.exit,
    },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}
```

### 3.3 Layout Persistence

The following elements persist across page transitions and do **not** re-animate:

| Element | Behavior |
|---------|----------|
| Navigation bar | Remains fixed. No re-animation on route change. |
| Footer | Remains static. Appears after page content fades in. |
| Chatbot bubble | Persists in bottom-right. No re-mount. |
| WhatsApp button | Persists in bottom-left. No re-mount. |

These elements live in `app/layout.tsx` (outside the `template.tsx` transition wrapper) so they are not affected by `AnimatePresence`.

### 3.4 Shared Element Transitions

Shared element transitions (where an element appears to move from one page to another) are used in exactly one scenario:

**AI Tool Cards to AI Tool Pages.** When a user clicks an AI Tool card on the homepage (e.g., "Idea Lab"), the card's accent color and icon conceptually carry forward to the tool page hero. This is achieved with `layoutId` in Framer Motion:

```tsx
// On homepage AI Tools section
<motion.div layoutId={`tool-card-${tool.id}`}>
  <ToolCard {...tool} />
</motion.div>

// On individual tool page hero
<motion.div layoutId={`tool-card-${tool.id}`}>
  <ToolPageHero {...tool} />
</motion.div>
```

**Implementation note:** Shared layout animations require both components to be mounted simultaneously during the transition. This works with `AnimatePresence mode="wait"` in the template. If performance is a concern on lower-end devices, degrade gracefully to a standard page fade.

### 3.5 Loading States During Navigation

When navigating between pages, the following loading strategy applies:

| Scenario | Loading Pattern |
|----------|----------------|
| Fast navigation (< 300ms) | No loading indicator. Page fades in directly. |
| Moderate navigation (300ms - 1s) | Top progress bar (thin bronze line, 2px, slides from left to right at top of viewport). |
| Slow navigation (> 1s) | Top progress bar + skeleton screen for destination page content. |

```tsx
// components/layout/NavigationProgress.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Implementation uses Next.js router events or
  // React.useTransition to detect navigation state

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-bronze origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.7 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: 2, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.3, delay: 0.1 },
          }}
        />
      )}
    </AnimatePresence>
  );
}
```

---

## 4. Scroll-Triggered Animations

### 4.1 Core Mechanism

All scroll-triggered animations use Framer Motion's `whileInView` with `viewport={{ once: true }}`. The `once: true` flag is critical -- animations play exactly once and never replay on scroll-back. This prevents the distracting "flickering" effect of elements re-animating as the user scrolls up and down.

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10%' }}
  variants={fadeInUp}
>
  <Content />
</motion.div>
```

### 4.2 Viewport Thresholds

The `margin` parameter on `viewport` controls when the animation triggers relative to the viewport edge. Negative margins mean the element must be further inside the viewport before triggering.

| Section Type | Viewport Margin | Rationale |
|-------------|----------------|-----------|
| Standard sections (Services, Why Choose, etc.) | `-10%` | Triggers when 10% of the element has entered the viewport. Feels natural. |
| Grid/card sections (AI Tools, Apps, Solutions) | `-10%` | Same threshold, but the stagger container itself triggers, not individual cards. |
| Final CTA | `-15%` | Slightly higher threshold. The CTA should be prominently visible before its "breathing in" scale animation starts. |
| Trust Indicators (counter section) | `-5%` | Triggers earlier because counters need time to roll up while the section is in view. |
| Hero | N/A | Triggers on page load, not scroll. |
| Footer | N/A | No scroll animation. Appears instantly. |

### 4.3 Section Reveal Strategy

Every section follows the same choreographic pattern:

1. **Section heading group** (label + title + subtitle) fades in first as a single unit.
2. **Content elements** (cards, grid items, etc.) stagger in after a short delay.
3. **Section CTA** (if present) fades in last.

This creates a top-down reading flow: context first, details second, action third.

### 4.4 Stagger Patterns

#### Linear Stagger (Default)
Items animate one after another in DOM order. Used for most grids and lists.

```
Item 1:  |====|
Item 2:    |====|
Item 3:      |====|
Item 4:        |====|
```

**Timing:** 80-100ms between items. Total stagger for 4 items: 240-300ms.

#### Z-Pattern Stagger
Items animate in reading order for 2-column grids: top-left, top-right, bottom-left, bottom-right. Used for AI Tools Spotlight and Why Choose sections.

```
Card 1 (TL):  |====|
Card 2 (TR):    |====|
Card 3 (BL):      |====|
Card 4 (BR):        |====|
```

**Timing:** 80ms between items.

#### Wave Stagger
Items animate left-to-right per row, then top-to-bottom per row. Used for the 4x2 Live Apps grid.

```
Row 1: C1 |====|  C2  |====|  C3   |====|  C4    |====|
Row 2: C5   |====|  C6  |====|  C7   |====|  C8    |====|
```

**Timing:** 60ms between items within a row, 120ms between rows.

### 4.5 Section-by-Section Animation Schedule

This table defines every scroll-triggered animation on the homepage. All other pages follow the same patterns adapted to their content.

| Section | Trigger | Elements | Variant | Stagger | Delay After Trigger |
|---------|---------|----------|---------|---------|-------------------|
| **Trust Indicators** | Scroll, `-5%` | Counter numbers | `countUp` (custom) | 100ms | 0ms |
| | | Trust badges | `fadeIn` | 80ms | 200ms |
| **Services Overview** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | 4 service cards | `fadeInUp` | 80ms | 100ms |
| **AI Tools Spotlight** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | 4 tool cards | `fadeInUp` | 80ms | 200ms |
| **Ready-Made Solutions** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | Solution cards | `slideInRight` | 80ms | 200ms |
| | | "View All" button | `fadeIn` | -- | 500ms |
| **Live Apps Showcase** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | 8 app cards | `fadeInUp` | 60ms (wave) | 100ms |
| **Why Choose Aviniti** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | 4 differentiator cards | `fadeInUp` | 80ms | 100ms |
| **Case Studies** | Scroll, `-10%` | Heading group | `fadeInUp` | -- | 0ms |
| | | 3 case study cards | `fadeInUp` | 100ms | 200ms |
| | | "View All" button | `fadeIn` | -- | 600ms |
| **Final CTA** | Scroll, `-15%` | Inner container | `scaleIn` (0.97 to 1) | -- | 0ms |
| | | Headline | `fadeInUp` | -- | 200ms |
| | | Subheadline | `fadeInUp` | -- | 350ms |
| | | Primary CTA | `fadeInUp` | -- | 500ms |
| | | Secondary CTA | `fadeInUp` | -- | 600ms |
| | | WhatsApp link | `fadeIn` | -- | 700ms |
| **Footer** | None | All elements | Instant | -- | -- |

---

## 5. Micro-Interactions

### 5.1 Button Hover / Press / Loading

Buttons are the most frequently interacted-with elements. Their animation must feel immediate and tactile.

```tsx
// components/ui/Button.tsx (animation props)

const buttonVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: [0, 0, 0.2, 1] },
  },
};
```

**Hover state (desktop only):**
- `scale(1.02)` -- barely perceptible growth, creates a sense of "lift"
- Background color shifts from `bronze` to `bronze-hover` (`#C08460` to `#A6714E`)
- `translateY(-1px)` on primary buttons
- Box shadow transitions to `glow-bronze` (`0 0 20px rgba(192, 132, 96, 0.25)`)
- Arrow icons within CTA buttons translate `3px` right
- Duration: `200ms`, Easing: `ease-in-out`

**Press state:**
- `scale(0.98)` -- subtle compression
- Background darkens slightly beyond hover
- `translateY(0)` -- removes any hover lift
- Duration: `100ms`, Easing: `ease-out`

**Loading state:**
- Button width freezes at current width (prevents layout shift)
- Text replaced with a spinner (16px, `currentColor`, 600ms rotation cycle)
- `opacity: 0.85` on the button
- `pointer-events: none` prevents double-clicks
- Spinner animates with CSS `animation: spin 0.6s linear infinite`

```tsx
// Loading state implementation
<motion.button
  disabled={isLoading}
  whileHover={isLoading ? undefined : 'hover'}
  whileTap={isLoading ? undefined : 'tap'}
  variants={buttonVariants}
  className="relative"
  style={isLoading ? { width: buttonWidth } : undefined}
>
  <span className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
    {children}
  </span>
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Spinner size={16} />
    </span>
  )}
</motion.button>
```

### 5.2 Card Hover Lift + Shadow

All cards (service cards, tool cards, solution cards, app cards, case study cards, differentiator cards) share a consistent hover treatment.

```tsx
// Base card hover animation
const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};
```

**Card hover behavior by type:**

| Card Type | Lift | Shadow Change | Additional Effect |
|-----------|------|---------------|-------------------|
| Service Card | `y: -4px` | `md` to `lg` | Icon scales to `1.05` |
| AI Tool Card | `y: -4px` | `md` to `lg` | Accent gradient intensifies (6% to 12% opacity), border tints to accent color at 30% |
| Solution Card | `y: -4px` | `md` to `lg` | None |
| App Card | `y: -4px` | `md` to `lg` | App icon scales to `1.08` |
| Case Study Card | `y: -4px` | `md` to `lg` | Metric highlight background intensifies |
| Differentiator Card | `y: -4px` | `md` to `lg` | None |

Duration: `300ms`. Easing: `ease-in-out`. All transitions use `transform` and `box-shadow` only (GPU-accelerated).

### 5.3 Form Input Focus / Validation

Form inputs appear on: Get AI Estimate, Idea Lab, AI Idea Analyzer, AI ROI Calculator, Contact, Exit Intent popups, and Chatbot.

**Focus animation:**
- Border color transitions from `#243044` to `#C08460` (bronze focus ring)
- Background shifts from `#1A2332` to `#243044`
- A subtle `box-shadow: 0 0 0 3px rgba(192, 132, 96, 0.15)` appears (bronze glow ring)
- Label floats upward if using floating labels (translateY -24px, scale 0.85, color changes to bronze)
- Duration: `200ms`, Easing: `ease-out`

**Validation - Error:**
- Border color transitions to `error` (`#F87171`)
- `box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15)` (red glow)
- Error message appears below input: `fadeInUp` from 8px, opacity 0 to 1, duration `200ms`
- Input shakes horizontally: `translateX` sequence `[0, -6, 6, -4, 4, 0]` over `400ms`

```tsx
// Error shake animation
const inputShake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4, ease: 'easeInOut' },
};

// Trigger programmatically:
// controls.start(inputShake)
```

**Validation - Success:**
- Border color transitions to `success` (`#34D399`)
- `box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.15)`
- A small checkmark icon fades in at the right edge of the input: `scaleIn` from `scale(0)` to `scale(1)`, duration `200ms`, with spring easing

### 5.4 Tab Switching Underline Slide

Used on: FAQ page (category tabs), Solutions catalog (filter tabs), Blog (category tabs).

The active tab has a bronze underline indicator (`2px` height, `border-radius: 1px`). When switching tabs, the underline slides horizontally from the previously active tab to the newly active tab.

```tsx
// components/ui/Tabs.tsx

import { motion } from 'framer-motion';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="relative flex gap-1 border-b border-slate-blue-light">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-3 text-sm font-medium transition-colors duration-200
            ${activeTab === tab.id ? 'text-white' : 'text-muted hover:text-off-white'}`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-bronze rounded-full"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

**Behavior:**
- Underline slides to new tab: `200ms`, `ease-in-out`
- Tab text color transitions: `200ms`
- Tab content below crossfades: `150ms` fade out, `200ms` fade in (total `350ms`)

### 5.5 Accordion Expand / Collapse

Used on: FAQ page, Footer (mobile), potentially Solution detail pages.

```tsx
// components/ui/Accordion.tsx

import { motion, AnimatePresence } from 'framer-motion';

const accordionContent = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.15 },
    },
  },
};
```

**Behavior:**
- Chevron icon rotates `180deg`: `200ms`, `ease-in-out`
- Content height animates from `0` to `auto`: `300ms`, `ease-in-out`
- Content opacity fades in after height begins: `200ms`, `100ms` delay
- On collapse, opacity fades out first, then height shrinks
- Only one accordion item open at a time (single-open mode for FAQ)

### 5.6 Modal Enter / Exit

Used on: Exit intent popups, image lightboxes, confirmation dialogs.

```tsx
// components/ui/Modal.tsx

const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Desktop: scale-in from center
const modalContentDesktop = {
  initial: { opacity: 0, scale: 0.95, y: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
  },
};

// Mobile: slide-up from bottom
const modalContentMobile = {
  initial: { opacity: 0, y: '100%' },
  animate: {
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

**Behavior:**
- Backdrop fades from `transparent` to `rgba(15, 20, 25, 0.80)` (`--bg-overlay`): `200ms`
- Desktop modal: `scale(0.95)` to `scale(1)` + opacity: `200ms`, `ease-out`
- Mobile modal: slides up from bottom: `300ms`, `ease-out`
- Exit is faster than enter (150-200ms vs 200-300ms)
- Focus is trapped within the modal
- `Escape` key dismisses

### 5.7 Toast Slide-In / Out

Used for: form submission confirmations, error notifications, clipboard copy feedback.

```tsx
// components/ui/Toast.tsx

const toastVariants = {
  initial: { opacity: 0, x: 60, y: 0 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};
```

**Behavior:**
- Position: fixed top-right on desktop, fixed top-center on mobile (below nav)
- Slides in from right + fade: `300ms`, `ease-out`
- Auto-dismiss after `5000ms`
- Slides out to right + fade: `200ms`, `ease-in`
- Stacks vertically if multiple toasts. New toast pushes existing ones down with `layout` animation.
- z-index: `100` (highest in the system per design-system.md)

### 5.8 Navigation Link Hover Underline

Desktop navigation links in the navbar use an underline that grows from center on hover.

```tsx
// components/layout/NavLink.tsx

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative px-3 py-2 text-sm font-medium text-muted hover:text-off-white transition-colors duration-200">
      {children}
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-bronze rounded-full transition-all duration-200 ease-out group-hover:left-0 group-hover:w-full" />
    </Link>
  );
}
```

**Behavior:**
- Underline width grows from `0%` to `100%`, expanding from center: `200ms`, `ease-out`
- Text color shifts from `muted` (`#9CA3AF`) to `off-white` (`#F4F4F2`): `200ms`
- Active page link has a persistent bronze underline (no animation, static indicator)

### 5.9 Mobile Drawer Open / Close

The mobile navigation drawer slides in from the right side of the screen.

```tsx
// components/layout/MobileDrawer.tsx

const drawerBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const drawerPanel = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

const drawerNavItems = {
  initial: { opacity: 0, x: 20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  }),
};
```

**Behavior:**
- Backdrop fades in: `200ms`
- Panel slides from right: `300ms`, `ease-out`
- Nav items stagger in: `50ms` between items, starting `100ms` after panel begins
- Close: panel slides right `200ms`, `ease-in`; backdrop fades `150ms`
- Hamburger icon morphs to X: CSS transition on `transform: rotate`, `300ms`
- Body scroll is locked while drawer is open

### 5.10 Stepper Progress Animation

Used on: Get AI Estimate (4 steps), Idea Lab (5 steps), AI ROI Calculator (6 steps).

```tsx
// components/ui/Stepper.tsx

// Progress bar fills between steps
const stepperProgress = {
  initial: { scaleX: 0 },
  animate: (progress: number) => ({
    scaleX: progress, // 0 to 1
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

// Step indicator circle
const stepCircle = {
  inactive: {
    scale: 1,
    backgroundColor: '#1A2332',
    borderColor: '#243044',
  },
  active: {
    scale: 1.1,
    backgroundColor: '#C08460',
    borderColor: '#C08460',
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }, // spring
  },
  complete: {
    scale: 1,
    backgroundColor: '#C08460',
    borderColor: '#C08460',
    transition: { duration: 0.2 },
  },
};
```

**Behavior:**
- Progress bar is a horizontal line connecting step circles
- When advancing to next step: progress bar `scaleX` animates from current to next fraction: `500ms`, `ease-in-out`
- Active step circle scales up with spring easing and fills with bronze
- Completed step circles show a checkmark icon that `scaleIn`s: `200ms`
- Step labels below circles transition color from muted to white when active

### 5.11 Counter Number Animation (Stats)

Used on: Trust Indicators (50+, 12+, 98%, 2x), Case Study metrics (40%, 3x, 25%), AI ROI Calculator results.

```tsx
// hooks/useCountUp.ts (see Section 13 for full implementation)

// Animation spec:
// - Duration: 1500ms (duration.counter)
// - Easing: ease-out (fast start, deceleration as it approaches target)
// - Trigger: whileInView, once
// - Format: Intl.NumberFormat for locale-aware display
// - Suffix: "+", "%", "x" rendered in bronze (#C08460)
```

**Behavior:**
- Number counts from `0` to target value over `1500ms`
- Uses `requestAnimationFrame` for smooth 60fps updates
- Easing: deceleration curve (fast at start, slow at finish). The number "rushes" to about 80% of the target in the first 500ms, then gently settles over the remaining 1000ms.
- Suffix characters ("+", "%", "x") are static, rendered in bronze. They do not animate.
- The number uses `font-variant-numeric: tabular-nums` (the `.tabular-nums` utility) to prevent width fluctuation during counting.

### 5.12 Badge Pulse / Glow Effects

Used on: "AI-Powered App Development" badge in Hero, Chatbot notification dot, WhatsApp button.

```tsx
// Pulse-glow animation (CSS keyframe, defined in Tailwind config)
// animate-pulse-glow: pulseGlow 2s ease-in-out infinite

// Framer Motion equivalent for controlled triggering:
const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 15px rgba(192, 132, 96, 0.2)',
      '0 0 30px rgba(192, 132, 96, 0.4)',
      '0 0 15px rgba(192, 132, 96, 0.2)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

**Badge types:**

| Badge | Animation | Trigger |
|-------|-----------|---------|
| Hero tagline badge | No continuous animation. Static after entrance fade-in. | -- |
| Chatbot unread dot | `pulseGlow` with tool accent color, continuous until clicked | On new message |
| WhatsApp button | Subtle `scale` pulse from `1` to `1.05` and back, `2s` cycle | On first visit, stops after 3 cycles |
| "New" badges (if any) | `pulseGlow` in bronze, continuous | While visible |

---

## 6. AI Tool Specific Animations

### 6.1 Form Step Transitions (Multi-Step Forms)

All four AI tools (Idea Lab, AI Idea Analyzer, Get AI Estimate, AI ROI Calculator) use multi-step form flows. Steps transition with a horizontal slide.

```tsx
// components/tools/StepTransition.tsx

import { motion, AnimatePresence } from 'framer-motion';

type Direction = 'forward' | 'backward';

const stepVariants = {
  enter: (direction: Direction) => ({
    x: direction === 'forward' ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  exit: (direction: Direction) => ({
    x: direction === 'forward' ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

interface StepTransitionProps {
  stepKey: string;
  direction: Direction;
  children: React.ReactNode;
}

export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Behavior:**
- Forward navigation: current step slides left + fades out (`200ms`), new step slides in from right + fades in (`300ms`)
- Backward navigation: current step slides right, new step slides in from left (reversed direction)
- Stepper progress bar updates simultaneously (see Section 5.10)
- Form field values are preserved in parent state (no data loss on back navigation)

### 6.2 AI "Thinking" State (3-Phase)

After the user submits their input and before results appear, a three-phase loading sequence communicates that real AI processing is happening. This is critical for perceived value -- if results appear instantly, users may not trust the depth of analysis.

**Phase 1: Submitted (0-500ms)**
```
"Submitting your information..."
[brief fade transition]
```

**Phase 2: Processing (500ms-3000ms)**
```
"Our AI is analyzing your inputs..."
[animated processing visualization]
[rotating analysis dots or progress ring]
```

**Phase 3: Generating (3000ms-completion)**
```
"Generating your personalized results..."
[progress indicator approaching completion]
```

```tsx
// components/tools/AIThinkingState.tsx

const phases = [
  { message: 'Submitting your information...', icon: 'upload' },
  { message: 'Our AI is analyzing your inputs...', icon: 'brain' },
  { message: 'Generating your personalized results...', icon: 'sparkles' },
];

const phaseTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Processing visualization: a circular progress ring
const processingRing = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: 1,
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Animated dots (three dots that pulse in sequence)
const thinkingDot = {
  animate: (i: number) => ({
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.8,
      delay: i * 0.15,
      ease: 'easeInOut',
    },
  }),
};
```

**Visual treatment:**
- Center of viewport (or center of form area)
- Tool's accent color for the processing ring and dots
- Dark background (`#1A2332`) card with `16px` radius
- Phase message text: `off-white`, `18px/500`
- Messages crossfade with `AnimatePresence`
- Processing ring: SVG circle, `stroke` in tool accent color, `strokeDasharray` animated
- Minimum display time: `3000ms` (even if API responds faster, to maintain perceived depth)

### 6.3 Results Reveal Animation (Staggered Sections)

When AI results are ready, they reveal in a staggered sequence. This prevents information overload and guides the user through the results in a deliberate order.

```tsx
// components/tools/ResultsReveal.tsx

const resultsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const resultSection = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};
```

**Reveal order per tool:**

**Idea Lab Results:**
1. Heading "Here Are Your Personalized App Ideas" -- `fadeInUp`, `0ms`
2. Idea cards (5-6) -- stagger `150ms` each, `fadeInUp`
3. Bottom CTA -- `fadeIn`, after all ideas visible

**AI Idea Analyzer Results:**
1. Overall Score/Rating gauge -- `fadeIn` + gauge fill animation (see 6.5)
2. Market Potential section -- `fadeInUp`, `150ms` delay
3. Technical Feasibility section -- `fadeInUp`, `300ms` delay
4. Monetization Strategies -- `fadeInUp`, `450ms` delay
5. Competition Overview -- `fadeInUp`, `600ms` delay
6. CTA: "Get a Detailed Estimate" -- `fadeIn`, `750ms` delay

**Get AI Estimate Results:**
1. Cost range headline -- `fadeInUp` + counter animation, `0ms`
2. Timeline estimate -- `fadeInUp`, `150ms`
3. Breakdown by feature/phase -- stagger `100ms` each, `fadeInUp`
4. Recommended approach -- `fadeInUp`, after breakdown
5. CTA row -- `fadeIn`, last

**AI ROI Calculator Results:**
1. Total Annual ROI (hero number) -- `fadeIn` + counter animation, `0ms`
2. Dashboard metrics grid -- stagger `100ms`, `fadeInUp`
3. Breakdown sections -- stagger `150ms`, `fadeInUp`
4. Comparison visual -- `fadeInUp` + chart animation (see 6.4)
5. Key Insight (AI summary) -- `fadeIn` with slight delay
6. CTA row -- `fadeIn`, last

### 6.4 Chart / Graph Animations (ROI Calculator)

The ROI Calculator results include comparison visuals and potential bar/line charts.

**Bar Chart Animation:**
```tsx
const barVariant = {
  hidden: { scaleY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0, 0, 0.2, 1],
    },
  }),
};

// Bars grow from bottom (transform-origin: bottom)
// <motion.rect style={{ originY: 1 }} variants={barVariant} custom={index} />
```

**Comparison Visual (Cost vs Return):**
- Two horizontal bars side by side
- "Cost of App" bar fills in tool accent color: `scaleX` from `0` to target width, `600ms`
- "Annual Return" bar fills in `success` green, slightly delayed: `scaleX` from `0` to target width, `600ms`, `200ms` delay
- ROI percentage counter animates: `1500ms` count-up

**Donut/Gauge Chart (for scores):**
```tsx
const gaugeVariant = {
  hidden: {
    pathLength: 0,
  },
  visible: {
    pathLength: 0.75, // or whatever the score percentage is
    transition: {
      duration: 1.0,
      ease: [0, 0, 0.2, 1],
      delay: 0.3,
    },
  },
};
```

### 6.5 Score Gauge Animation (AI Analyzer)

The AI Idea Analyzer displays an overall viability score as a circular gauge.

```tsx
// components/tools/ScoreGauge.tsx

interface ScoreGaugeProps {
  score: number; // 0-100
  color: string; // tool accent color
}

// SVG circle gauge
// - Radius: 60px, stroke-width: 8px
// - Background track: #243044
// - Score arc: tool accent color
// - Center: score number with countUp animation

const gaugeArc = {
  hidden: { pathLength: 0 },
  visible: (score: number) => ({
    pathLength: score / 100,
    transition: {
      duration: 1.0,
      ease: [0, 0, 0.2, 1],
      delay: 0.2,
    },
  }),
};

// Score number counts up simultaneously
// Uses useCountUp hook with duration 1000ms, starting at delay 200ms
```

**Behavior:**
- Track circle appears immediately (static, `#243044`)
- Score arc draws clockwise from 12-o'clock position: `1000ms`, `ease-out`
- Center score number counts from `0` to final score: `1000ms`, starts `200ms` after arc begins
- Score label below ("Excellent", "Good", "Needs Work") fades in after arc completes

---

## 7. Chatbot "Avi" Animations

The chatbot (referred to as "Vanity" or "Avi") is a persistent floating element in the bottom-right corner. Its animations must be noticeable enough to draw first-time visitor attention without being annoying.

### 7.1 Bubble Bounce on First Appearance

On first page load (first-time visitors only), the chatbot bubble appears after a `3000ms` delay. This ensures the visitor has had time to register the page content before the chatbot demands attention.

```tsx
// components/chat/ChatBubble.tsx

const bubbleEntrance = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
      delay: 3.0, // 3 second delay
    },
  },
};

// After entrance, a single "attention bounce"
const attentionBounce = {
  y: [0, -12, 0, -6, 0],
  transition: {
    duration: 0.8,
    ease: 'easeInOut',
    delay: 3.8, // 800ms after entrance completes
  },
};
```

**Sequence:**
1. Page loads. Chatbot bubble is hidden.
2. At `3000ms`: bubble scales in from `0` to `1` with spring easing (bouncy overshoot).
3. At `3800ms`: bubble bounces once (up 12px, back to 0, up 6px, back to 0) to draw the eye.
4. At `4600ms`: bubble settles. A small tooltip fades in above: "Need help? Chat with Avi" -- disappears after `5000ms`.
5. On subsequent visits (returning visitors): bubble appears immediately at page load with a simple `fadeIn` (`300ms`), no bounce, no tooltip.

### 7.2 Expand / Collapse Transition

When the user clicks the chatbot bubble, the chat window expands from the bubble's position (bottom-right origin).

```tsx
// components/chat/ChatWindow.tsx

const chatWindowVariants = {
  collapsed: {
    opacity: 0,
    scale: 0,
    originX: 1,  // right
    originY: 1,  // bottom
  },
  expanded: {
    opacity: 1,
    scale: 1,
    originX: 1,
    originY: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      // Spring easing as specified in design-system.md Section 9.7
    },
  },
};
```

**Behavior:**
- Origin: bottom-right corner (aligns with bubble position)
- Expand: `scale(0)` to `scale(1)` with spring easing: ~`300ms`
- Chat window size: `380px` wide x `520px` tall on desktop, full-width x `70vh` on mobile
- During expand, bubble morphs into the window's bottom-right corner (or fades out as window fades in)
- Collapse: `scale(1)` to `scale(0)` at same origin: `200ms`, `ease-in`
- z-index: `45` (chat-window, per design-system.md)

### 7.3 Message Typing Indicator

When "Avi" is composing a response, three dots pulse in sequence.

```tsx
// components/chat/TypingIndicator.tsx

const typingDot = {
  animate: (i: number) => ({
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.6,
      delay: i * 0.15,
      ease: 'easeInOut',
    },
  }),
};

// Three dots, 6px diameter each, #9CA3AF color
// Contained in a message bubble with #243044 background
// Bubble itself slides up + fades in (same as regular message)
```

### 7.4 New Message Slide-Up

Each new message (user or AI) slides up from the bottom of the chat window and fades in.

```tsx
// components/chat/ChatMessage.tsx

const messageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
  },
};

// User messages: aligned right, bronze-tinted background
// AI messages: aligned left, slate-blue background
// Both use the same entrance animation
```

**Behavior:**
- New message slides up from `16px` below: `200ms`, `ease-out`
- Chat window auto-scrolls to bottom with smooth scroll: `300ms`
- Quick reply buttons (if present) stagger in below the message: `50ms` between buttons

### 7.5 Minimize / Restore

When the user clicks the minimize button (or the X), the chat window shrinks back to the bubble.

- **Minimize:** `scale(1)` to `scale(0)` at bottom-right origin, `200ms`, `ease-in`
- **Restore:** `scale(0)` to `scale(1)`, spring easing, `300ms`
- If the user has unread messages while minimized, the bubble shows a notification dot with `pulseGlow` animation in bronze

---

## 8. Exit Intent Popup Animation

### 8.1 Trigger Conditions

The exit intent popup appears when the system detects the user is about to leave. Animation must be quick enough to catch the user's attention but not feel aggressive.

### 8.2 Desktop Animation (Scale-In)

```tsx
// components/overlays/ExitIntentModal.tsx

const exitIntentBackdrop = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const exitIntentModalDesktop = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1], // ease-out (enter easing)
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1], // ease-in (exit easing)
    },
  },
};
```

### 8.3 Mobile Animation (Slide-Up from Bottom)

```tsx
const exitIntentModalMobile = {
  initial: { opacity: 0, y: '100%' },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};
```

### 8.4 Content Choreography

After the modal container appears, internal content staggers in:

| Element | Delay | Duration | Animation |
|---------|-------|----------|-----------|
| Headline | 100ms | 300ms | `fadeInUp` (10px) |
| Subheadline | 200ms | 300ms | `fadeInUp` (10px) |
| Visual (ebook, icon) | 250ms | 400ms | `scaleIn` (0.9 to 1) |
| Form / CTA | 350ms | 300ms | `fadeInUp` (10px) |
| Dismiss link | 450ms | 200ms | `fadeIn` |

### 8.5 Dismiss Animation

- Click outside modal: backdrop and modal exit simultaneously
- Click X button: modal exits, then backdrop
- Click "No thanks": same as X button
- Duration: `200ms` exit for both

---

## 9. Loading & Skeleton States

### 9.1 Page-Level Skeleton Screens

When a page is loading (e.g., navigating to a tool page, loading blog content), a skeleton screen provides visual structure before content appears.

```tsx
// components/ui/Skeleton.tsx

// Skeleton pulse: opacity oscillates between 0.5 and 1.0
// Duration: 2000ms per cycle, ease-in-out, infinite

const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2.0,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
```

**Skeleton shapes:**
- Text lines: rounded rectangles, `h-4` for body, `h-6` for headings, `rounded-md`
- Card placeholders: full card shape with `bg-slate-blue-light`, `rounded-lg`
- Image placeholders: aspect-ratio-correct rectangles with `bg-slate-blue-light`
- Avatar placeholders: circles, `rounded-full`
- All skeleton elements use background color `#243044` (slate-blue-light)

**Page skeletons per page type:**

| Page | Skeleton Structure |
|------|-------------------|
| Homepage | Hero text + device placeholder, section heading + card grid placeholders |
| AI Tool page | Tool header + form step placeholder |
| Blog index | Featured post card + grid of post cards |
| Blog post | Title bar + body text lines + sidebar |
| FAQ | Heading + accordion item placeholders |
| Case study | Hero bar + content blocks |

### 9.2 Component-Level Loading States

Individual components within a loaded page may still be fetching data (e.g., app store ratings, blog post counts).

- Use skeleton pulse inline where the dynamic data will appear
- Maintain the exact dimensions of the final content to prevent layout shift (CLS)
- Skeleton transitions to real content with a `150ms` crossfade

### 9.3 Image Lazy Load with Blur-Up

All images below the fold use a blur-up loading technique.

```tsx
// components/ui/LazyImage.tsx
// Uses Next.js Image component with placeholder="blur"

// For dynamic images (not known at build time):
// 1. Server generates a tiny (10px wide) base64 placeholder
// 2. Placeholder is displayed with CSS filter: blur(20px) and scale(1.1)
// 3. When full image loads:
//    - Placeholder blur transitions to blur(0): 500ms, ease-out
//    - Scale transitions from 1.1 to 1.0: 500ms, ease-out
//    - Full image opacity transitions from 0 to 1: 300ms

const imageReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
};
```

**Applied to:**
- App icons in Live Apps Showcase
- Solution card images
- Blog post featured images
- Case study graphics
- Device mockup screenshots (hero carousel -- first image is preloaded, subsequent images use blur-up)

### 9.4 Progressive Content Loading

For long pages with many sections, content below the fold is loaded progressively:

1. **Above-fold content** (hero, trust indicators): loaded immediately, no skeleton
2. **Near-fold content** (services, AI tools): pre-rendered in HTML (SSR), animations trigger on scroll
3. **Far-fold content** (case studies, final CTA, footer): pre-rendered but images lazy-loaded
4. **Dynamic content** (blog posts, app store data): fetched client-side with skeleton placeholders

---

## 10. Parallax & Decorative Motion

### 10.1 Hero Background Subtle Parallax

The hero section has a radial gradient glow behind the device mockup. This glow shifts very subtly as the user scrolls, creating a sense of depth.

```tsx
// components/sections/Hero.tsx (parallax glow)

import { useScroll, useTransform, motion } from 'framer-motion';

function HeroParallaxGlow() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        y,
        opacity,
        background: 'radial-gradient(ellipse at 70% 50%, rgba(192, 132, 96, 0.06) 0%, transparent 60%)',
      }}
      aria-hidden="true"
    />
  );
}
```

**Behavior:**
- The glow translates upward at 6% of scroll speed (30px over 500px of scroll)
- Opacity fades to 0 over the first 400px of scroll
- This is GPU-accelerated (`transform` + `opacity` only)
- Completely invisible on mobile (performance optimization)
- Removed when `prefers-reduced-motion: reduce` is active

### 10.2 Floating Decorative Elements

The hero's floating code snippet cards bob gently in a continuous oscillation.

```tsx
// components/sections/FloatingSnippet.tsx

interface FloatingSnippetProps {
  delay: number; // offset in seconds (0, 1, 2 for the three snippets)
}

const floatAnimation = {
  animate: (delay: number) => ({
    y: [0, -6, 0, -6, 0],
    transition: {
      duration: 6,        // 6000ms full cycle (design-system.md: float duration)
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  }),
};

// Each snippet is offset by 1 second:
// Snippet 1 (top-right):     delay: 0
// Snippet 2 (left-middle):   delay: 1
// Snippet 3 (bottom-right):  delay: 2
```

**Constraints:**
- Y-axis oscillation only: `6px` amplitude
- Duration: `6000ms` per cycle (matches `duration.float` / `animate-float` in Tailwind config)
- Easing: sinusoidal (approximated with `ease-in-out`)
- Desktop and tablet only. Hidden on mobile (per homepage-design.md: "Code snippets: hidden entirely" on mobile).
- Removed when `prefers-reduced-motion: reduce` is active

### 10.3 Gradient Mesh Animation

There is no gradient mesh animation in the Aviniti design. The brand uses flat gradients (Hero Fade, Bronze Shine, Card Glow, Section Divider) that are all static. Animated gradient meshes would conflict with the "polished but not heavy" philosophy and add unnecessary GPU load.

### 10.4 Mouse-Follow Effects

Mouse-follow effects are **not included** in the base implementation. They violate the "polished but not heavy" calibration level for this project. The visual returns do not justify the complexity and performance cost.

**Exception:** If a future phase requires interactive data visualizations (e.g., an animated globe showing countries served), mouse-follow may be introduced in a scoped, isolated manner. This must be documented as a separate specification.

---

## 11. Performance Budget

### 11.1 Animation Performance Rules

| Rule | Specification |
|------|---------------|
| **GPU-only properties** | All animations MUST use only `transform` and `opacity`. Never animate `height`, `width`, `margin`, `padding`, `top`, `left`, `right`, `bottom`, `border`, `background-color` via JavaScript. CSS transitions on `background-color` and `border-color` are acceptable for hover states (these are composited efficiently by browsers). |
| **Max concurrent animations** | No more than **8** simultaneous Framer Motion animations at any given time. A stagger sequence of 8 items counts as 8 concurrent animations at its peak. |
| **will-change** | Applied only to elements about to animate. Removed after animation completes. Never set `will-change: transform` on static elements. Framer Motion handles this automatically for its animated elements. |
| **requestAnimationFrame** | All custom animations (counter roll-up, gauge fill) must use `requestAnimationFrame`, never `setInterval` or `setTimeout`. |
| **IntersectionObserver cleanup** | Disconnect observers after scroll-triggered animations fire (since they use `once: true`). This prevents memory leaks on long browsing sessions. |

### 11.2 Framer Motion Bundle Budget

| Metric | Target |
|--------|--------|
| `framer-motion` bundle size (gzipped) | < 35KB (tree-shaken, only importing used features) |
| `framer-motion` features to import | `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useMotionValue`, `useInView`, `useReducedMotion` |
| Features to avoid importing | `Reorder`, `LayoutGroup` (unless shared element transitions are confirmed), `useDragControls` |

**Tree-shaking strategy:**
```tsx
// CORRECT: named imports only
import { motion, AnimatePresence, useInView } from 'framer-motion';

// WRONG: barrel import
import * as framerMotion from 'framer-motion';
```

### 11.3 Frame Rate Targets

| Context | Target FPS | Minimum Acceptable |
|---------|------------|-------------------|
| Scroll-triggered reveals | 60fps | 30fps |
| Card hover transitions | 60fps | 45fps |
| Counter animations | 60fps | 30fps |
| Page transitions | 60fps | 45fps |
| Parallax glow | 60fps | 30fps |
| Chatbot expand/collapse | 60fps | 45fps |

### 11.4 Animation Audit Checklist

Before deploying any page, verify:

- [ ] No animation triggers layout recalculation (check DevTools Performance tab)
- [ ] No animation uses `height: auto` without Framer Motion's `layout` optimization
- [ ] No `will-change` is set on more than 4 elements simultaneously
- [ ] Skeleton pulse uses CSS animation (not Framer Motion) to reduce JS overhead
- [ ] Image lazy load does not cause CLS > 0.05
- [ ] Counter animation does not block main thread (uses `requestAnimationFrame`)
- [ ] All `IntersectionObserver` instances disconnect after trigger
- [ ] Mobile devices: no parallax, no floating elements, max 4 concurrent animations

---

## 12. Reduced Motion Fallbacks

### 12.1 Detection Strategy

The site detects `prefers-reduced-motion: reduce` at two levels:

**Level 1: CSS (global fallback)**
```css
/* In globals.css, already defined in design-system.md */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Level 2: Framer Motion (component-level control)**
```tsx
import { useReducedMotion } from 'framer-motion';

// In every animated component:
const prefersReducedMotion = useReducedMotion();
```

### 12.2 Fallback Behavior by Animation Category

| Animation Category | Normal Behavior | Reduced Motion Fallback |
|-------------------|-----------------|------------------------|
| **Page transitions** | Fade + y shift, 300ms | Instant swap (0ms transition) |
| **Scroll reveals** | Fade + translateY(20px), 500ms | Instant visibility (opacity 0 to 1, 0ms). No translateY. |
| **Stagger sequences** | Items animate 80-100ms apart | All items appear simultaneously |
| **Card hover lift** | translateY(-4px), shadow change | Background color change only, no movement |
| **Button hover** | scale(1.02), color shift | Color shift only, no scale |
| **Button press** | scale(0.98) | Color shift only, no scale |
| **Counter roll-up** | Count from 0 over 1500ms | Final value displayed immediately |
| **Tab underline slide** | Underline slides horizontally | Underline appears instantly on new tab |
| **Accordion expand** | Height animation 300ms | Instant height change |
| **Modal enter/exit** | Scale + fade, 200-300ms | Instant show/hide |
| **Toast slide** | Slide from right, 300ms | Instant appear/disappear |
| **Mobile drawer** | Slide from right, 300ms | Instant show/hide |
| **Chatbot bounce** | Spring entrance + bounce | Instant appear, no bounce |
| **Chatbot expand** | Scale from origin, spring | Instant show/hide |
| **Typing indicator** | Dots bouncing | Static dots (no animation) |
| **Floating snippets** | Continuous bob, 6s cycle | Static position, no movement |
| **Parallax glow** | Scroll-linked transform | Static, no scroll effect |
| **Exit intent modal** | Scale/slide in, 300ms | Instant appear |
| **Skeleton pulse** | Opacity oscillation, 2s | Static gray background (no pulse) |
| **Image blur-up** | Blur(20px) to blur(0), 500ms | Instant swap from placeholder to image |
| **Score gauge** | Arc draws over 1000ms | Arc appears at final position instantly |
| **Chart bars** | Scale from 0 over 600ms | Bars appear at full height instantly |
| **Stepper progress** | Bar fills over 500ms | Bar jumps to new position |
| **Processing ring** | Rotating dash, infinite | Static progress indicator (spinner replaced with text "Processing...") |

### 12.3 Implementation Pattern

```tsx
// hooks/useAnimationVariants.ts

import { useReducedMotion } from 'framer-motion';

export function useAnimationVariants() {
  const prefersReducedMotion = useReducedMotion();

  const fadeInUp = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
        },
      };

  const staggerContainer = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
          },
        },
      };

  return { fadeInUp, staggerContainer };
}
```

---

## 13. Framer Motion Code Patterns

### 13.1 Reusable Variant Objects

```tsx
// lib/motion/variants.ts

import { Variants } from 'framer-motion';
import { duration, easing } from './tokens';

// ─── ENTRANCE VARIANTS ──────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: easing.enter },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.enter },
  },
};

export const fadeInUpSmall: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
};

export const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slower, ease: easing.expoOut },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
};

export const scaleInSubtle: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: easing.expoOut },
  },
};

// ─── EXIT VARIANTS ────────────────────────────────────────

export const slideUp: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.moderate, ease: easing.enter },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: duration.normal, ease: easing.exit },
  },
};

export const fadeOut: Variants = {
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.exit },
  },
};

// ─── CONTAINER VARIANTS (for stagger) ──────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerWave: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// ─── HERO-SPECIFIC VARIANTS ────────────────────────────────

export const heroHeadline: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // expoOut
    },
  }),
};

export const heroBadge: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const heroDevice: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const heroCodeSnippet: Variants = {
  hidden: (fromLeft: boolean) => ({
    opacity: 0,
    x: fromLeft ? -20 : 20,
  }),
  visible: (fromLeft: boolean) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.8 + (fromLeft ? 0.1 : 0),
      duration: 0.4,
      ease: easing.enter,
    },
  }),
};

// ─── CTA SECTION VARIANT ──────────────────────────────────

export const ctaContainer: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
```

### 13.2 Custom Hooks

#### `useScrollReveal`

Wraps the common pattern of `initial="hidden" whileInView="visible" viewport={{ once: true }}` with configurable margin and variants.

```tsx
// hooks/useScrollReveal.ts

import { useReducedMotion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { fadeInUp } from '@/lib/motion/variants';

interface ScrollRevealOptions {
  variants?: Variants;
  margin?: string;
  once?: boolean;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    variants = fadeInUp,
    margin = '-10%',
    once = true,
  } = options;

  const prefersReducedMotion = useReducedMotion();

  const reducedVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  };

  return {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once, margin },
    variants: prefersReducedMotion ? reducedVariants : variants,
  } as const;
}
```

**Usage:**
```tsx
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { fadeInUp } from '@/lib/motion/variants';

function ServicesSection() {
  const reveal = useScrollReveal({ variants: fadeInUp });

  return (
    <motion.section {...reveal}>
      <SectionContent />
    </motion.section>
  );
}
```

#### `useStaggerChildren`

Provides stagger container props and child item props as a pair.

```tsx
// hooks/useStaggerChildren.ts

import { useReducedMotion, Variants } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';

interface StaggerOptions {
  containerVariants?: Variants;
  childVariants?: Variants;
  margin?: string;
}

export function useStaggerChildren(options: StaggerOptions = {}) {
  const {
    containerVariants = staggerContainer,
    childVariants = fadeInUp,
    margin = '-10%',
  } = options;

  const prefersReducedMotion = useReducedMotion();

  const reducedContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  };

  const reducedChild: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  };

  return {
    container: {
      initial: 'hidden' as const,
      whileInView: 'visible' as const,
      viewport: { once: true, margin },
      variants: prefersReducedMotion ? reducedContainer : containerVariants,
    },
    child: {
      variants: prefersReducedMotion ? reducedChild : childVariants,
    },
  };
}
```

**Usage:**
```tsx
function AIToolsGrid({ tools }: { tools: Tool[] }) {
  const { container, child } = useStaggerChildren();

  return (
    <motion.div {...container} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {tools.map((tool) => (
        <motion.div key={tool.id} {...child}>
          <ToolCard {...tool} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

#### `useCountUp`

Animates a number from 0 to a target value when the element enters the viewport.

```tsx
// hooks/useCountUp.ts

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpOptions {
  end: number;
  duration?: number;  // in ms, default 1500
  decimals?: number;  // decimal places, default 0
  prefix?: string;    // e.g., "$"
  suffix?: string;    // e.g., "+", "%", "x"
}

export function useCountUp({
  end,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
}: CountUpOptions) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    // Reduced motion: show final value immediately
    if (prefersReducedMotion) {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(end);
      setDisplayValue(`${prefix}${formatted}${suffix}`);
      return;
    }

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out deceleration curve
      // Fast at start, slows as it approaches target
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = easedProgress * end;

      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(Math.round(currentValue * Math.pow(10, decimals)) / Math.pow(10, decimals));

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, end, duration, decimals, prefix, suffix, prefersReducedMotion]);

  return { ref, displayValue };
}
```

**Usage:**
```tsx
function TrustMetric({ value, suffix, label }: MetricProps) {
  const { ref, displayValue } = useCountUp({
    end: value,
    suffix,
    duration: 1500,
  });

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="text-5xl font-bold text-white tabular-nums"
        aria-live="polite"
      >
        {displayValue}
      </span>
      <p className="text-sm font-medium uppercase tracking-widest text-muted mt-2">
        {label}
      </p>
    </div>
  );
}

// <TrustMetric value={50} suffix="+" label="Apps Delivered" />
// <TrustMetric value={98} suffix="%" label="Client Satisfaction" />
```

### 13.3 AnimatePresence Patterns

#### Route-Level AnimatePresence

```tsx
// app/layout.tsx
'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Navbar />
        <AnimatePresence mode="wait">
          <main key={pathname}>
            {children}
          </main>
        </AnimatePresence>
        <Footer />
        <ChatBubble />
      </body>
    </html>
  );
}
```

**Note:** In Next.js App Router, AnimatePresence at the layout level requires careful handling. The `template.tsx` approach (Section 3.2) is the recommended pattern because `layout.tsx` does not re-render on route changes. If AnimatePresence is placed in `layout.tsx`, use `usePathname()` as the key to force re-renders.

#### Component-Level AnimatePresence

Used for: modals, toasts, drawers, chat window, accordion content, form step transitions.

```tsx
// Pattern: mode="wait" for sequential enter/exit
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="modal"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={modalContentDesktop}
    >
      <ModalContent />
    </motion.div>
  )}
</AnimatePresence>

// Pattern: mode="popLayout" for stacking (toasts)
<AnimatePresence mode="popLayout">
  {toasts.map((toast) => (
    <motion.div
      key={toast.id}
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Toast {...toast} />
    </motion.div>
  ))}
</AnimatePresence>
```

### 13.4 Complete Section Animation Example

This demonstrates a full section implementation combining scroll reveal, stagger, and card hover:

```tsx
// components/sections/ServicesOverview.tsx
'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useStaggerChildren } from '@/hooks/useStaggerChildren';
import { fadeInUp } from '@/lib/motion/variants';

const services = [
  { icon: 'brain', title: 'AI Solutions', description: '...' },
  { icon: 'smartphone', title: 'Mobile Apps', description: '...' },
  { icon: 'globe', title: 'Web Development', description: '...' },
  { icon: 'cloud', title: 'Cloud Solutions', description: '...' },
];

const cardHoverVariants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)',
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.4)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

export function ServicesOverview() {
  const headingReveal = useScrollReveal({ variants: fadeInUp });
  const { container, child } = useStaggerChildren();

  return (
    <section className="w-full bg-navy py-12 md:py-20">
      <div className="container-main">
        {/* Heading group */}
        <motion.div {...headingReveal} className="text-center max-w-xl mx-auto mb-12">
          <p className="section-label">Our Services</p>
          <h2 className="text-h2 text-white mt-3 text-balance">What We Build</h2>
          <p className="text-lg text-muted mt-4">
            End-to-end solutions powered by AI and modern engineering.
          </p>
        </motion.div>

        {/* Cards grid with stagger */}
        <motion.div
          {...container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              {...child}
              variants={{
                ...child.variants,
                ...cardHoverVariants,
              }}
              initial="hidden"
              whileHover="hover"
              animate="rest"
              className="bg-slate-blue border border-slate-blue-light rounded-lg p-8"
            >
              <ServiceIcon name={service.icon} />
              <h3 className="text-xl font-semibold text-off-white mt-5">
                {service.title}
              </h3>
              <p className="text-base text-muted mt-3 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

---

## 14. Page-by-Page Animation Map

This section provides a quick reference for every page in the project, listing which animation patterns apply.

### 14.1 Homepage

Covered exhaustively in Sections 4.5 (scroll schedule) and the homepage-design.md spec. Summary:

| Section | Hero | Trust | Services | AI Tools | Solutions | Apps | Why Choose | Cases | Final CTA | Footer |
|---------|------|-------|----------|----------|-----------|------|------------|-------|-----------|--------|
| Trigger | Load | Scroll | Scroll | Scroll | Scroll | Scroll | Scroll | Scroll | Scroll | None |
| Pattern | Choreographed | Counter + fade | Stagger 4 | Stagger 4 (Z) | Stagger 4 (slide-right) | Wave 8 | Stagger 4 | Stagger 3 | Scale-in + sequence | Instant |

### 14.2 Get AI Estimate

| Section | Animation |
|---------|-----------|
| Page hero/intro | `fadeInUp` on load (not scroll -- it is above the fold) |
| Stepper | Progress bar fill (see 5.10) |
| Form steps | Horizontal slide transition (see 6.1) |
| Option cards (project type, features) | Stagger `fadeInUp`, 80ms |
| Email capture step | `fadeInUp` |
| AI thinking state | 3-phase loading (see 6.2) |
| Results reveal | Staggered sections (see 6.3) |
| Download/CTA buttons | `fadeIn` after results |

### 14.3 Idea Lab

| Section | Animation |
|---------|-----------|
| Page hero/intro | `fadeInUp` on load |
| "Start Discovery" CTA | `fadeInUp`, 200ms delay |
| Question steps (3) | Horizontal slide transition |
| Option buttons | Stagger `fadeInUp`, 60ms |
| Email capture | `fadeInUp` |
| AI thinking state | 3-phase loading |
| Idea cards (5-6) | Stagger `fadeInUp`, 150ms |
| Individual idea expand | Accordion expand (see 5.5) |

### 14.4 AI Idea Analyzer

| Section | Animation |
|---------|-----------|
| Page hero/intro | `fadeInUp` on load |
| Text area input | Focus animation (see 5.3) |
| Email capture | `fadeInUp` |
| AI thinking state | 3-phase loading |
| Score gauge | Arc draw + counter (see 6.5) |
| Analysis sections (5) | Stagger `fadeInUp`, 150ms |
| CTA | `fadeIn` after sections |

### 14.5 AI ROI Calculator

| Section | Animation |
|---------|-----------|
| Page hero/intro | `fadeInUp` on load |
| Stepper (6 steps) | Progress bar fill |
| Form steps | Horizontal slide transition |
| Slider inputs | Real-time value feedback (no animation on slide, number updates instantly) |
| AI thinking state | 3-phase loading |
| ROI dashboard metrics | Counter roll-up, stagger 100ms |
| Chart visualizations | Bar/gauge animations (see 6.4) |
| Comparison visual | Dual bar fill + ROI counter |
| Key Insight | `fadeIn`, slight delay |
| CTAs | `fadeIn` after insight |

### 14.6 Ready-Made Solutions (Catalog)

| Section | Animation |
|---------|-----------|
| Page hero | `fadeInUp` on load |
| Filter tabs | Tab underline slide (see 5.4) |
| Solution grid | Stagger `fadeInUp`, 80ms. Re-staggers when filter changes (AnimatePresence with layout). |
| Individual solution card hover | Card lift + shadow (see 5.2) |

### 14.7 Case Studies (Index)

| Section | Animation |
|---------|-----------|
| Page hero | `fadeInUp` on load |
| Filter tabs (industry) | Tab underline slide |
| Case study cards | Stagger `fadeInUp`, 100ms |
| Card hover | Lift + shadow + metric highlight intensify |

### 14.8 Individual Case Study

| Section | Animation |
|---------|-----------|
| Hero metrics bar | Counter roll-up on load, stagger 100ms |
| Content sections (Challenge, Solution, Results) | Scroll-triggered `fadeInUp` |
| Before/after comparison | `fadeInUp` |
| Key takeaways list | Stagger `fadeInUpSmall`, 60ms |
| CTA section | `scaleInSubtle` (same pattern as homepage Final CTA) |

### 14.9 Blog Index

| Section | Animation |
|---------|-----------|
| Featured post card | `fadeInUp` on load |
| Post grid | Stagger `fadeInUp`, 80ms |
| Pagination | No animation (instant swap) |
| Category filter | Tab underline slide |

### 14.10 Blog Post

| Section | Animation |
|---------|-----------|
| Title + meta | `fadeInUp` on load |
| Featured image | Blur-up lazy load (see 9.3) |
| Article body | No animation (instant render for readability) |
| Related posts grid | Scroll-triggered stagger `fadeInUp` |
| CTA section | Scroll-triggered `fadeInUp` |

### 14.11 FAQ

| Section | Animation |
|---------|-----------|
| Page hero | `fadeInUp` on load |
| Category tabs | Tab underline slide |
| Accordion items | Expand/collapse (see 5.5) |
| Search results | `AnimatePresence` with `fadeIn` for filtering |

### 14.12 Contact

| Section | Animation |
|---------|-----------|
| Page content (two-column) | `fadeInUp` on load, left column first, right column 100ms delay |
| Form inputs | Focus/validation animations (see 5.3) |
| Submit button | Loading state (see 5.1) |
| Success message | `scaleIn` replacing form |
| Calendly embed | Lazy load with skeleton |

### 14.13 Privacy Policy / Terms of Service

| Section | Animation |
|---------|-----------|
| All content | No animation. Instant render. Legal pages must be immediately readable with zero motion. |

---

## Appendix A: Animation Quick Reference Card

For developer convenience, this table maps every animation name to its tokens.

| Animation Name | Duration | Easing | Y Distance | X Distance | Scale |
|---------------|----------|--------|------------|------------|-------|
| `fadeIn` | 500ms | enter | -- | -- | -- |
| `fadeInUp` | 500ms | enter | 20px | -- | -- |
| `fadeInUpSmall` | 300ms | enter | 10px | -- | -- |
| `fadeInUpLarge` | 700ms | expoOut | 30px | -- | -- |
| `slideInRight` | 300ms | enter | -- | 30px | -- |
| `slideInLeft` | 300ms | enter | -- | -30px | -- |
| `scaleIn` | 300ms | enter | -- | -- | 0.95 |
| `scaleInSubtle` | 500ms | expoOut | -- | -- | 0.97 |
| `slideUp` | 300ms | enter | 100% | -- | -- |
| `cardHover` | 300ms | default | -4px | -- | -- |
| `buttonHover` | 200ms | default | -- | -- | 1.02 |
| `buttonTap` | 100ms | enter | -- | -- | 0.98 |
| `counterRollUp` | 1500ms | easeOut (cubic) | -- | -- | -- |
| `tabUnderline` | 200ms | default | -- | layout | -- |
| `accordionExpand` | 300ms | default | -- | -- | -- |
| `modalEnter` | 200ms | enter | -- | -- | 0.95 |
| `modalExit` | 150ms | exit | -- | -- | 0.95 |
| `drawerEnter` | 300ms | enter | -- | 100% | -- |
| `drawerExit` | 200ms | exit | -- | 100% | -- |
| `toastEnter` | 300ms | enter | -- | 60px | -- |
| `toastExit` | 200ms | exit | -- | 40px | -- |
| `chatbotExpand` | 300ms | spring | -- | -- | 0 to 1 |
| `chatbotCollapse` | 200ms | exit | -- | -- | 1 to 0 |
| `exitModalDesktop` | 300ms | enter | 20px | -- | 0.9 |
| `exitModalMobile` | 300ms | enter | 100% | -- | -- |
| `skeletonPulse` | 2000ms | default | -- | -- | -- |
| `floatBob` | 6000ms | sinusoidal | 6px | -- | -- |
| `pulseGlow` | 2000ms | default | -- | -- | -- |
| `heroSequence` | ~1400ms total | expoOut | varies | varies | varies |

---

## Appendix B: File Structure

```
src/
  lib/
    motion/
      tokens.ts              # Duration, easing, spring config, distance tokens
      variants.ts            # All reusable Framer Motion variant objects
  hooks/
    useScrollReveal.ts       # Scroll-triggered animation wrapper
    useStaggerChildren.ts    # Container + child stagger pair
    useCountUp.ts            # Number counter animation
    useAnimationVariants.ts  # Reduced-motion-aware variant provider
  components/
    ui/
      Button.tsx             # Hover/press/loading animations
      Tabs.tsx               # Underline slide animation
      Accordion.tsx          # Expand/collapse animation
      Modal.tsx              # Enter/exit animations (desktop + mobile)
      Toast.tsx              # Slide-in/out animations
      Skeleton.tsx           # Pulse animation
      Stepper.tsx            # Progress fill animation
    layout/
      Navbar.tsx             # Nav link hover underline
      MobileDrawer.tsx       # Slide-in/out drawer
      NavigationProgress.tsx # Top progress bar during navigation
    sections/
      Hero.tsx               # Choreographed entrance sequence
      TrustIndicators.tsx    # Counter roll-up animations
      ServicesOverview.tsx    # Stagger card grid
      AIToolsSpotlight.tsx   # Stagger with accent effects
      ReadyMadeSolutions.tsx # Slide-right stagger
      LiveAppsShowcase.tsx   # Wave stagger grid
      WhyChooseUs.tsx        # Stagger card grid
      CaseStudiesPreview.tsx # Stagger with metric highlights
      FinalCTA.tsx           # Scale-in container + content sequence
    chat/
      ChatBubble.tsx         # Bounce entrance, pulse notification
      ChatWindow.tsx         # Scale expand/collapse
      ChatMessage.tsx        # Slide-up entrance
      TypingIndicator.tsx    # Dot bounce sequence
    tools/
      StepTransition.tsx     # Form step slide animation
      AIThinkingState.tsx    # 3-phase processing animation
      ResultsReveal.tsx      # Staggered results display
      ScoreGauge.tsx         # Circular gauge arc animation
    overlays/
      ExitIntentModal.tsx    # Scale-in / slide-up animation
  app/
    template.tsx             # Page transition wrapper
    layout.tsx               # Persistent elements (nav, footer, chat)
  styles/
    globals.css              # Reduced motion CSS fallback
```

---

## Appendix C: Implementation Checklist

Before marking animation implementation complete for any page, verify every item:

### Global
- [ ] `prefers-reduced-motion` CSS fallback is in `globals.css`
- [ ] `useReducedMotion` is called in every animated component
- [ ] Framer Motion is tree-shaken (named imports only)
- [ ] `framer-motion` gzipped size is under 35KB
- [ ] Page transition wrapper (`template.tsx`) is in place
- [ ] Navigation progress bar is implemented
- [ ] All scroll-triggered animations use `once: true`

### Per Page
- [ ] Hero animations follow choreography table exactly
- [ ] Scroll-triggered sections use correct viewport margin
- [ ] Stagger timing matches specification (60-100ms per item)
- [ ] Card hover uses `transform` and `box-shadow` only
- [ ] Counter animations use `requestAnimationFrame`
- [ ] Counter elements have `tabular-nums` and `aria-live="polite"`
- [ ] No CLS from animation (elements have explicit dimensions)
- [ ] Skeleton screens match final content dimensions
- [ ] Images below fold use blur-up lazy loading
- [ ] Floating elements are hidden on mobile
- [ ] Parallax is disabled on mobile

### Accessibility
- [ ] All motion respects `prefers-reduced-motion`
- [ ] Focus trap works in modals and drawers
- [ ] Tab order is logical after all animations complete
- [ ] Screen readers announce counter final values
- [ ] Decorative animated elements have `aria-hidden="true"`
- [ ] No animation flashes more than 3 times per second

### Performance
- [ ] DevTools Performance panel shows no layout thrashing during animations
- [ ] All animations maintain 60fps on mid-range devices
- [ ] No `will-change` left on static elements
- [ ] IntersectionObservers disconnect after firing
- [ ] Max 8 concurrent Framer Motion instances at peak

---

**End of Animation & Interaction Specification v1.0**

This document is the definitive animation authority for the Aviniti website. All motion implementation must reference these patterns and tokens. Deviations require updating this document first, then the code.
