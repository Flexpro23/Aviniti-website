# Aviniti Homepage Design Specification

**Version:** 1.0
**Date:** February 2026
**Author:** A-IDO (Apple-Level Intelligent Design Officer)
**Stack:** Next.js 14+ / Tailwind CSS / Framer Motion / Inter
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Global Design Foundations](#1-global-design-foundations)
2. [Section 1: Hero (PRIORITY)](#2-section-1-hero)
3. [Section 2: Trust Indicators](#3-section-2-trust-indicators)
4. [Section 3: Services Overview](#4-section-3-services-overview)
5. [Section 4: AI Tools Spotlight (PRIORITY)](#5-section-4-ai-tools-spotlight)
6. [Section 5: Ready-Made Solutions Preview](#6-section-5-ready-made-solutions-preview)
7. [Section 6: Live Apps Showcase](#7-section-6-live-apps-showcase)
8. [Section 7: Why Choose Aviniti](#8-section-7-why-choose-aviniti)
9. [Section 8: Case Studies Preview](#9-section-8-case-studies-preview)
10. [Section 9: Final CTA (PRIORITY)](#10-section-9-final-cta)
11. [Section 10: Footer](#11-section-10-footer)
12. [Cross-Section Animation Choreography](#12-cross-section-animation-choreography)
13. [Performance Budget](#13-performance-budget)
14. [Accessibility Checklist](#14-accessibility-checklist)

---

## 1. Global Design Foundations

### 1.1 Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0F1419` | Page background, hero background |
| `--bg-card` | `#1A2332` | Card surfaces, elevated containers |
| `--bg-card-hover` | `#1E2940` | Card hover state background |
| `--border-subtle` | `#243044` | Card borders, dividers |
| `--accent-bronze` | `#C08460` | Primary CTAs, accent highlights, active states |
| `--accent-bronze-hover` | `#A6714E` | CTA hover state |
| `--accent-bronze-light` | `#D4A583` | Secondary accents, decorative elements |
| `--text-primary` | `#F4F4F2` | Headlines, primary body text |
| `--text-secondary` | `#9CA3AF` | Descriptions, supporting text, labels |
| `--text-white` | `#FFFFFF` | Maximum emphasis headlines |

AI Tools Spotlight accent colors (Section 4 only):

| Token | Hex | Tool |
|-------|-----|------|
| `--tool-orange` | `#F59E0B` | Idea Lab |
| `--tool-blue` | `#3B82F6` | AI Idea Analyzer |
| `--tool-green` | `#10B981` | Get AI Estimate |
| `--tool-purple` | `#8B5CF6` | AI ROI Calculator |

### 1.2 Typography Scale (Inter)

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|---------|---------------|---------------|--------|-------------|----------------|
| Hero H1 | 64px / 4rem | 36px / 2.25rem | 800 (ExtraBold) | 1.1 | -0.02em |
| Section H2 | 44px / 2.75rem | 28px / 1.75rem | 700 (Bold) | 1.2 | -0.01em |
| Card H3 | 22px / 1.375rem | 18px / 1.125rem | 600 (SemiBold) | 1.3 | 0 |
| Body Large | 20px / 1.25rem | 16px / 1rem | 400 (Regular) | 1.6 | 0 |
| Body | 16px / 1rem | 15px / 0.9375rem | 400 (Regular) | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 13px / 0.8125rem | 400 (Regular) | 1.5 | 0 |
| Label/Badge | 12px / 0.75rem | 12px / 0.75rem | 500 (Medium) | 1.4 | 0.05em |
| Button | 16px / 1rem | 15px / 0.9375rem | 600 (SemiBold) | 1 | 0.01em |

### 1.3 Spacing System

Base unit: 4px. All spacing uses multiples.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Inline icon gaps |
| `--space-sm` | 8px | Tight element gaps |
| `--space-md` | 16px | Standard element gaps, card padding internal |
| `--space-lg` | 24px | Card padding, group gaps |
| `--space-xl` | 32px | Section internal gaps |
| `--space-2xl` | 48px | Between element groups |
| `--space-3xl` | 64px | Between sections (mobile) |
| `--space-4xl` | 96px | Between sections (tablet) |
| `--space-5xl` | 120px | Between sections (desktop) |

### 1.4 Container

- Max width: `1280px` (80rem)
- Horizontal padding: `24px` mobile, `32px` tablet, `0` desktop (centered)
- Centered with `margin: 0 auto`

### 1.5 Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 12px |
| Cards | 16px |
| Input Fields | 12px |
| Badges/Tags | 8px |
| App Icons | 20px |
| Full Round | 9999px (pills) |

### 1.6 Elevation (Shadows)

All shadows use a dark navy tint to maintain the dark theme depth.

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 16px rgba(0, 0, 0, 0.4)` | Cards resting state |
| `--shadow-lg` | `0 8px 32px rgba(0, 0, 0, 0.5)` | Cards hover state |
| `--shadow-xl` | `0 16px 48px rgba(0, 0, 0, 0.6)` | Hero device, modals |
| `--shadow-glow` | `0 0 24px rgba(192, 132, 96, 0.15)` | Bronze accent glow on CTAs |

### 1.7 Motion Principles

- **Duration:** Quick: 200ms, Standard: 300ms, Emphasis: 500ms, Dramatic: 800ms
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for entrances; `cubic-bezier(0.4, 0, 0.2, 1)` for standard
- **Scroll-triggered animations:** Use `IntersectionObserver` with threshold `0.2`. Elements animate once, not on every scroll pass.
- **Stagger:** 80ms between siblings in a list/grid
- **Reduced motion:** All animations respect `prefers-reduced-motion: reduce`. Replace motion with instant opacity transitions.

### 1.8 Button System

**Primary (Bronze Filled)**
- Background: `#C08460`
- Text: `#FFFFFF`
- Padding: `16px 32px`
- Border-radius: `12px`
- Hover: Background shifts to `#A6714E`, subtle `translateY(-1px)`, shadow increases to `--shadow-glow`
- Active: `translateY(0)`, background `#96634A`
- Min height: `48px` (meets 44px touch target requirement)
- Font: 16px/600 Inter

**Secondary (Outline)**
- Background: `transparent`
- Border: `1.5px solid #C08460`
- Text: `#C08460`
- Padding: `16px 32px`
- Border-radius: `12px`
- Hover: Background fills to `rgba(192, 132, 96, 0.1)`, border brightens to `#D4A583`
- Min height: `48px`

**Tertiary (Text Link)**
- Background: `transparent`
- Text: `#9CA3AF`
- Padding: `8px 0`
- Hover: Text shifts to `#F4F4F2`, subtle underline slides in from left
- No min-height constraint but maintain 44px tap area via padding on mobile

---

## 2. Section 1: Hero

**Priority Level: CRITICAL -- This is the first impression. Five seconds to convert or lose the visitor.**

### 2.1 Emotional Intent

The hero must make the visitor feel: "These people are serious. They are experts. They can build what I need. I want to work with them." It must convey premium AI expertise while remaining approachable -- not cold or corporate. The bronze warmth against the deep navy creates a feeling of sophisticated confidence, like walking into a high-end tech studio.

### 2.2 Conversion Psychology

The three-CTA hierarchy addresses three visitor mindsets simultaneously:
- **"Get Instant AI Estimate"** (primary bronze) -- catches the ready-to-buy visitor who already knows what they want. This is the money button.
- **"Ready-Made Solutions"** (outline) -- catches the explorer who wants to see products before committing. Lower commitment ask.
- **"Contact Us"** (text link) -- catches the traditional business buyer who wants human connection first.

The animated device mockup serves as instant credibility: "We build real apps. Here is proof." The floating code snippets signal technical depth without requiring the visitor to read them.

### 2.3 Layout

```
+------------------------------------------------------------------+
|                        Navigation Bar                             |
+------------------------------------------------------------------+
|                                                                    |
|  max-w-1280px, centered                                           |
|                                                                    |
|  +---------------------------+  +-----------------------------+   |
|  |                           |  |                             |   |
|  |  [Tagline badge]          |  |    +-------------------+    |   |
|  |                           |  |    |                   |    |   |
|  |  HEADLINE                 |  |    |   Phone Mockup    |    |   |
|  |  (max 3 lines)            |  |    |   with App UI     |    |   |
|  |                           |  |    |                   |    |   |
|  |  Subheadline              |  |    |   Floating code   |    |   |
|  |  (2 lines max)            |  |    |   snippets        |    |   |
|  |                           |  |    |   around device   |    |   |
|  |  [Primary CTA]            |  |    |                   |    |   |
|  |  [Secondary CTA]          |  |    +-------------------+    |   |
|  |  Contact Us link          |  |                             |   |
|  |                           |  |                             |   |
|  +---------------------------+  +-----------------------------+   |
|         ~55% width                      ~45% width                |
|                                                                    |
+------------------------------------------------------------------+
```

Desktop: Two-column layout. Left column (55%) holds all text and CTAs, vertically centered. Right column (45%) holds the device mockup composition, vertically centered.

Tablet (640-1024px): Same two-column layout but tighter. Left column 50%, right column 50%. Typography scales down. Device mockup scales down proportionally.

Mobile (< 640px): Single column, stacked. Text content comes first (full width). Device mockup sits below at approximately 70% width, centered. CTA buttons stack full-width.

### 2.4 Content Hierarchy (Visual Weight Distribution)

1. **Headline** (Weight: 40%) -- The single most dominant element. Pure white `#FFFFFF`, 64px/800 weight. This is the gravitational center of the hero.
2. **Device Mockup** (Weight: 25%) -- The eye moves from headline to the visual proof. The animation draws peripheral attention.
3. **Primary CTA** (Weight: 20%) -- Bronze button creates the strongest color contrast point. The eye cannot miss it.
4. **Subheadline** (Weight: 10%) -- Supports the headline. Muted text `#9CA3AF`, 20px/400.
5. **Secondary CTAs** (Weight: 5%) -- Available but not competing. Outline and text treatments recede visually.

### 2.5 Visual Description

**Background:** The full-width hero sits on the base `#0F1419` navy. A subtle radial gradient emanates from the center-right area (behind the device mockup): `radial-gradient(ellipse at 70% 50%, rgba(192, 132, 96, 0.06) 0%, transparent 60%)`. This creates a barely-perceptible warm glow that adds depth without being obvious. There is no hard-edged shape -- just atmospheric light.

**Tagline Badge:** Above the headline, a small pill-shaped badge reads "AI-Powered App Development". It has a subtle border of `rgba(192, 132, 96, 0.3)`, background `rgba(192, 132, 96, 0.08)`, bronze text `#C08460`, 12px/500 Inter, uppercase, letter-spacing 0.05em. Padding: 6px 16px. Border-radius: 9999px.

**Headline:**
```
We Build Intelligent
Apps That Transform
Your Business
```
Three lines on desktop. Pure white `#FFFFFF`. 64px/800 Inter. Line-height 1.1. The word "Intelligent" carries a subtle bronze underline decoration -- a 2px line in `#C08460` that sits 4px below the baseline of that word only, with rounded caps. This draws the eye to the differentiator.

**Subheadline:**
```
From AI-powered ideas to live apps in the store.
Custom solutions for businesses ready to lead.
```
Two lines. Color: `#9CA3AF`. 20px/400 Inter. Line-height 1.6. Margin-top: 24px below headline.

**Primary CTA Button:** "Get Instant AI Estimate" -- full bronze button as specified in the button system. An arrow icon (right-pointing chevron, 16px) sits to the right of the text with 8px gap. The arrow subtly translates 3px right on hover. Margin-top: 40px below subheadline.

**Secondary CTA Button:** "Ready-Made Solutions" -- outline button as specified. Sits to the right of the primary CTA on desktop (16px gap). On mobile, stacks below (12px gap), full width.

**Contact Link:** "Contact Us" -- tertiary text link. Color `#9CA3AF`. Sits below the button row with 16px margin-top. A right-arrow icon (12px) follows the text. On hover, text shifts to `#F4F4F2`.

**Device Mockup Composition:**

The centerpiece is a smartphone frame (approximately 280px wide x 560px tall on desktop) rendered as a clean device outline with rounded corners (40px radius) and a subtle `#243044` bezel. The screen displays a cycling carousel of actual Aviniti app screenshots (SkinVerse, Caliber OS, HairVision Pro). Each screenshot fills the device screen area and crossfades every 4 seconds with a 600ms transition.

Around the device, three floating code snippet cards hover at different positions:

- **Top-right of device:** A small card (180px x 60px) with `#1A2332` background, 12px radius, showing a line of syntax-highlighted code: `const ai = await analyze(data)` in monospace font (JetBrains Mono or system mono), 12px. Colors: purple for `const`, white for `ai`, bronze for `analyze`.

- **Left-middle of device:** A card (160px x 50px) showing `<AppStore rating={4.9} />` with JSX syntax highlighting. Slightly rotated (-3 degrees).

- **Bottom-right of device:** A card (150px x 50px) showing `deploy: success` with a small green dot indicator. Slightly rotated (2 degrees).

Each floating card has a gentle bobbing animation (translateY oscillating 6px, duration 3s, sinusoidal easing). The three cards are offset in their animation cycles by 1 second each, creating an organic floating field rather than synchronized movement.

The device itself has a very subtle shadow: `0 20px 60px rgba(0, 0, 0, 0.5)`.

### 2.6 Animation Sequence (Choreography)

All timings are from page load. The sequence creates a "reveal" moment -- content materializes with purpose.

| Order | Element | Animation | Delay | Duration | Easing |
|-------|---------|-----------|-------|----------|--------|
| 1 | Tagline badge | Fade in + translateY(10px to 0) | 0ms | 500ms | ease-out-expo |
| 2 | Headline line 1 | Fade in + translateY(20px to 0) | 150ms | 600ms | ease-out-expo |
| 3 | Headline line 2 | Fade in + translateY(20px to 0) | 250ms | 600ms | ease-out-expo |
| 4 | Headline line 3 | Fade in + translateY(20px to 0) | 350ms | 600ms | ease-out-expo |
| 5 | Bronze underline on "Intelligent" | Width scales from 0% to 100% (left to right) | 600ms | 400ms | ease-out |
| 6 | Subheadline | Fade in + translateY(10px to 0) | 500ms | 500ms | ease-out-expo |
| 7 | Primary CTA | Fade in + translateY(10px to 0) | 650ms | 400ms | ease-out-expo |
| 8 | Secondary CTA | Fade in + translateY(10px to 0) | 750ms | 400ms | ease-out-expo |
| 9 | Contact link | Fade in | 850ms | 300ms | ease-out |
| 10 | Device mockup | Fade in + translateY(30px to 0) + scale(0.95 to 1) | 300ms | 700ms | ease-out-expo |
| 11 | Code snippet 1 | Fade in + translateX(20px to 0) | 800ms | 400ms | ease-out |
| 12 | Code snippet 2 | Fade in + translateX(-20px to 0) | 900ms | 400ms | ease-out |
| 13 | Code snippet 3 | Fade in + translateX(20px to 0) | 1000ms | 400ms | ease-out |
| 14 | Floating bob begins | Continuous oscillation on all snippets | 1200ms | Infinite | sinusoidal |

**Total reveal time: ~1.4 seconds.** Fast enough to feel snappy, slow enough to feel crafted.

### 2.7 Visual Flow (Eye Path)

The eye enters at the tagline badge (small, bronze, top-left of content area) and is immediately pulled down to the headline by its massive weight. The word "Intelligent" with its bronze underline holds attention. The eye then sweeps right to the device mockup (motion attracts peripheral vision). It registers "real apps" and returns left to the subheadline for context. Finally, the eye drops to the bronze CTA -- the warmest, most saturated element on the page. The bronze button against navy creates the highest chroma contrast in the entire hero, making it impossible to overlook.

### 2.8 Responsive Behavior

**Desktop (> 1024px):**
- Two columns: 55% / 45%
- Section padding: 120px top (accounts for sticky nav), 96px bottom
- Headline: 64px
- Device mockup: 280px wide

**Tablet (640 - 1024px):**
- Two columns: 50% / 50%
- Section padding: 96px top, 80px bottom
- Headline: 44px
- Device mockup: 220px wide
- Code snippets: scale down proportionally, reduce to 2 snippets (hide bottom-right)

**Mobile (< 640px):**
- Single column, stacked
- Section padding: 80px top, 64px bottom
- Headline: 36px
- Content centered (text-center)
- Device mockup: 200px wide, centered, margin-top 48px
- Code snippets: hidden entirely (they are too small to read and create clutter)
- CTA buttons: full width, stacked vertically with 12px gap
- Contact link: centered below buttons

### 2.9 Interactions

- **Primary CTA hover:** Background deepens to `#A6714E`, arrow icon shifts 3px right, subtle glow shadow appears
- **Secondary CTA hover:** Background fills with `rgba(192, 132, 96, 0.1)`, border brightens
- **Contact link hover:** Text color transitions to `#F4F4F2`, underline slides in from left (width 0 to 100%, 200ms)
- **Device mockup:** App screenshots auto-cycle every 4s. No user interaction required. On hover (desktop), cycling pauses.
- **Code snippets hover:** No interaction -- they are decorative. This is intentional; interactable decorative elements create confusion.

### 2.10 Component Mapping

| Element | Component | Props |
|---------|-----------|-------|
| Tagline badge | `<Badge variant="accent" />` | text, icon (optional) |
| Headline | `<Heading level={1} />` | children, className |
| Subheadline | `<Text variant="large" color="secondary" />` | children |
| Primary CTA | `<Button variant="primary" size="lg" />` | label, href, icon |
| Secondary CTA | `<Button variant="outline" size="lg" />` | label, href |
| Contact link | `<TextLink />` | label, href, icon |
| Device mockup | `<DeviceMockup />` | screenshots[], interval |
| Code snippets | `<FloatingSnippet />` | code, position, rotation |

### 2.11 Exact Copy

**Badge:** "AI-Powered App Development"

**Headline:** "We Build Intelligent Apps That Transform Your Business"

**Subheadline:** "From AI-powered ideas to live apps in the store. Custom solutions for businesses ready to lead."

**Primary CTA:** "Get Instant AI Estimate"

**Secondary CTA:** "Ready-Made Solutions"

**Tertiary Link:** "Contact Us"

---

## 3. Section 2: Trust Indicators

### 3.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|  +----------+   +----------+   +----------+   +----------+       |
|  |   50+    |   |   12+    |   |   98%    |   |   2x     |       |
|  | Apps     |   | Countries|   | Client   |   | Faster   |       |
|  | Delivered|   | Served   |   | Satisf.  |   | Delivery |       |
|  +----------+   +----------+   +----------+   +----------+       |
|                                                                    |
|      [SSL Secured]  [GDPR Compliant]  [NDA Available]             |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width band. Background: `#0F1419` (same as hero, creating visual continuity -- no hard break between hero and trust). Top padding: 0 (flows from hero). Bottom padding: 64px.

Container: max-width 1280px, centered.

**Metrics Row:** Four metrics in a horizontal row, evenly distributed. On desktop: flexbox with `justify-content: space-between` within the container. Each metric is a vertical stack: large number on top, label below.

**Trust Badges Row:** Centered below the metrics row with 40px gap. Three inline badges in a horizontal row with 32px gap between them.

### 3.2 Content Hierarchy

1. **Metric numbers** (Weight: 60%) -- Large, white, bold. These are the anchor.
2. **Metric labels** (Weight: 25%) -- Secondary text, smaller, describes what the number means.
3. **Trust badges** (Weight: 15%) -- Small, subtle, present but not demanding attention.

### 3.3 Visual Description

**Metric Numbers:** `#FFFFFF`, 48px/700 Inter on desktop, 32px on mobile. The "+" suffix is rendered in bronze `#C08460` to add visual interest. The "%" symbol for satisfaction is also bronze. Each number animates upward from 0 to its final value when scrolled into view (count-up animation, 2 second duration, ease-out deceleration -- fast at start, slowing as it approaches the target).

**Metric Labels:** `#9CA3AF`, 14px/500 Inter. Uppercase. Letter-spacing 0.05em. Placed 8px below the number.

Metrics to display:
- "50+" / "Apps Delivered"
- "12+" / "Countries Served"
- "98%" / "Client Satisfaction"
- "2x" / "Faster Delivery"

**Trust Badges:** Each badge is a horizontal inline-flex element. A small icon (16px, `#9CA3AF`) sits left, followed by the text label in 13px/500 Inter, `#9CA3AF`. No background, no border -- just icon + text, understated. A subtle divider line (`#243044`, 1px, 20px tall) separates each badge.

Trust badges:
- Shield icon + "SSL Secured"
- Lock icon + "GDPR Compliant"
- Document icon + "NDA Available"

### 3.4 Responsive Behavior

**Desktop (> 1024px):** Four metrics in one row. Three badges in one row below.

**Tablet (640 - 1024px):** Four metrics in one row (tighter spacing). Badges in one row.

**Mobile (< 640px):** Metrics arranged in a 2x2 grid (2 columns, 2 rows). 24px gap between grid items. Each metric is centered within its grid cell. Badges wrap into a single column or remain in one row if space permits (flex-wrap).

### 3.5 Interactions

- **Counter animation:** Triggers once when the metrics row enters the viewport (threshold 0.3). Uses `requestAnimationFrame` for smooth 60fps counting. Easing: decelerate curve. Duration: 2 seconds.
- **No hover states** on metrics or badges. These are informational elements, not interactive. Adding hover states would falsely suggest clickability.

### 3.6 Component Mapping

| Element | Component |
|---------|-----------|
| Metric | `<AnimatedCounter value={50} suffix="+" label="Apps Delivered" />` |
| Badge | `<TrustBadge icon="shield" label="SSL Secured" />` |
| Section | `<TrustIndicators metrics={[...]} badges={[...]} />` |

### 3.7 Exact Copy

**Metrics:**
- "50+" / "Apps Delivered"
- "12+" / "Countries Served"
- "98%" / "Client Satisfaction"
- "2x" / "Faster Delivery"

**Badges:**
- "SSL Secured"
- "GDPR Compliant"
- "NDA Available"

---

## 4. Section 3: Services Overview

### 4.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|                       What We Build                                |
|               Subtitle text centered below                         |
|                                                                    |
|  +-------------+  +-------------+  +-------------+  +-----------+ |
|  |   [icon]    |  |   [icon]    |  |   [icon]    |  |  [icon]   | |
|  |             |  |             |  |             |  |           | |
|  |  AI         |  |  Mobile     |  |  Web        |  |  Cloud    | |
|  |  Solutions  |  |  Apps       |  |  Development|  |  Solutions| |
|  |             |  |             |  |             |  |           | |
|  |  Description|  |  Description|  |  Description|  | Descript. | |
|  |             |  |             |  |             |  |           | |
|  +-------------+  +-------------+  +-------------+  +-----------+ |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#0F1419`. Section padding: 120px top and bottom on desktop.

Container: max-width 1280px, centered.

Heading group: centered, max-width 600px.

Cards grid: 4 columns on desktop, equal width, 24px gap.

### 4.2 Content Hierarchy

1. **Section headline** (Weight: 25%) -- Establishes context. "What We Build"
2. **Card icons** (Weight: 20%) -- Visual anchors that enable scanning.
3. **Card titles** (Weight: 35%) -- The primary information. What each service is.
4. **Card descriptions** (Weight: 20%) -- Supporting detail.

### 4.3 Visual Description

**Section Headline:** "What We Build" -- `#FFFFFF`, 44px/700 Inter. Centered. Below it, a subheadline: "End-to-end solutions powered by AI and modern engineering." `#9CA3AF`, 18px/400 Inter. Centered. Max-width 520px. Margin-top 16px.

**Service Cards:** Each card is a rectangle with `#1A2332` background, `1px solid #243044` border, 16px border-radius. Padding: 32px. Height: auto (content-determined), but all four cards are equal height via CSS grid `align-items: stretch`.

**Card Icon:** A 48px x 48px icon area at the top of each card. The icon is rendered as a simple line icon in bronze `#C08460`. Alternatively, the icon sits inside a 56px x 56px rounded square (12px radius) with background `rgba(192, 132, 96, 0.1)` and the icon centered within it in bronze. This creates a warm, branded icon treatment.

**Card Title:** `#F4F4F2`, 22px/600 Inter. Margin-top: 20px below icon.

**Card Description:** `#9CA3AF`, 15px/400 Inter. Line-height 1.6. Margin-top: 12px below title.

The four cards:

1. **AI Solutions**
   - Icon: Brain/neural network icon
   - Title: "AI Solutions"
   - Description: "Intelligent applications that learn, adapt, and deliver results. From computer vision to natural language processing."

2. **Mobile Apps**
   - Icon: Smartphone icon
   - Title: "Mobile Apps"
   - Description: "Native and cross-platform apps for iOS and Android. Beautiful interfaces, flawless performance."

3. **Web Development**
   - Icon: Globe/browser icon
   - Title: "Web Development"
   - Description: "Scalable web platforms and applications built with modern frameworks. Fast, responsive, reliable."

4. **Cloud Solutions**
   - Icon: Cloud icon
   - Title: "Cloud Solutions"
   - Description: "Infrastructure that grows with your business. Secure, scalable, always available."

### 4.4 Responsive Behavior

**Desktop (> 1024px):** 4 columns in a row. 24px gap.

**Tablet (640 - 1024px):** 2 columns, 2 rows. 20px gap.

**Mobile (< 640px):** Single column, stacked. 16px gap. Cards at full width. Optionally, cards can use a horizontal layout (icon left, text right) on mobile to save vertical space -- but only if legibility is preserved.

### 4.5 Interactions

- **Cards on hover (desktop):** Card background shifts to `#1E2940`. Card lifts `translateY(-4px)`. Shadow increases from `--shadow-md` to `--shadow-lg`. Transition: 300ms ease-out. The icon within the card subtly scales to 1.05.
- **Scroll entrance:** Cards fade in and slide up (translateY 20px to 0) with 80ms stagger. Duration 500ms.
- **Cards are not clickable links.** They are informational. Adding a link would need a clear destination (there is no individual services page in Phase 1). If a "Learn More" link is added later, it should be an explicit text link within the card, not making the entire card a link target.

### 4.6 Component Mapping

| Element | Component |
|---------|-----------|
| Section | `<SectionWrapper bg="primary" padding="xl" />` |
| Heading group | `<SectionHeader title="..." subtitle="..." align="center" />` |
| Card | `<ServiceCard icon={...} title="..." description="..." />` |
| Grid | `<Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="lg" />` |

### 4.7 Exact Copy

**Headline:** "What We Build"

**Subheadline:** "End-to-end solutions powered by AI and modern engineering."

**Card 1:** "AI Solutions" / "Intelligent applications that learn, adapt, and deliver results. From computer vision to natural language processing."

**Card 2:** "Mobile Apps" / "Native and cross-platform apps for iOS and Android. Beautiful interfaces, flawless performance."

**Card 3:** "Web Development" / "Scalable web platforms and applications built with modern frameworks. Fast, responsive, reliable."

**Card 4:** "Cloud Solutions" / "Infrastructure that grows with your business. Secure, scalable, always available."

---

## 5. Section 4: AI Tools Spotlight

**Priority Level: CRITICAL -- This section is the conversion engine. Each tool card is an entry point into the lead funnel.**

### 5.1 Emotional Intent

The visitor should feel: "This company gives me powerful tools for free. They are generous, confident, and capable. These tools are so good that I trust them to build my app." The four tools address the visitor at every stage of their decision journey. Together, they create a sense of completeness -- no matter where you are in your thinking, there is a tool for you.

The unique accent colors per tool create visual distinction and make each tool feel like its own product. This is deliberate: it signals that Aviniti does not just build one thing -- they build a suite of intelligent tools.

### 5.2 Conversion Psychology

The four tools map to the buyer's journey:

1. **Idea Lab (Orange)** -- Top of funnel. "I do not even know what I want." Lowest commitment. Exploratory. The warm orange color invites creativity and openness.
2. **AI Idea Analyzer (Blue)** -- Middle of funnel. "I have a concept, is it viable?" The blue signals analytical rigor and trust.
3. **Get AI Estimate (Green)** -- Bottom of funnel. "I am ready, what does it cost?" The green signals go/proceed/money -- action-oriented.
4. **AI ROI Calculator (Purple)** -- Justification. "Is this worth the investment?" The purple signals wisdom and strategic thinking.

This layout means the visitor self-selects based on their readiness, and every selection leads into the funnel. There is no dead end.

### 5.3 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|              AI-Powered Tools to Get You Started                   |
|         Subtitle text centered, max-width 600px                    |
|                                                                    |
|  +-------------------------------+  +---------------------------+  |
|  |  [Orange dot]                 |  |  [Blue dot]               |  |
|  |                               |  |                           |  |
|  |  Idea Lab                     |  |  AI Idea Analyzer         |  |
|  |                               |  |                           |  |
|  |  "Don't have an idea yet?     |  |  "Have an idea?           |  |
|  |   We'll help you find one."   |  |   Let's validate it."    |  |
|  |                               |  |                           |  |
|  |  [Try Idea Lab ->]            |  |  [Analyze Your Idea ->]   |  |
|  |                               |  |                           |  |
|  +-------------------------------+  +---------------------------+  |
|                                                                    |
|  +-------------------------------+  +---------------------------+  |
|  |  [Green dot]                  |  |  [Purple dot]             |  |
|  |                               |  |                           |  |
|  |  Get AI Estimate              |  |  AI ROI Calculator        |  |
|  |                               |  |                           |  |
|  |  "Ready to build?             |  |  "See how much an app     |  |
|  |   Get your quote."            |  |   could save you."       |  |
|  |                               |  |                           |  |
|  |  [Get Estimate ->]            |  |  [Calculate ROI ->]       |  |
|  |                               |  |                           |  |
|  +-------------------------------+  +---------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: slightly differentiated from the base -- use `#0D1117` (a shade darker) or apply a very subtle top gradient from `#0F1419` to `#0D1117` over 200px to create a sense of entering a new zone. Section padding: 120px top and bottom.

Container: max-width 1280px, centered.

Cards grid: 2x2 on desktop. 24px gap.

### 5.4 Content Hierarchy

1. **Section headline** (Weight: 15%) -- Context setter.
2. **Tool titles** (Weight: 30%) -- "Idea Lab", "AI Idea Analyzer", etc. The primary scan targets.
3. **Tool descriptions** (Weight: 25%) -- The persuasive copy. Must be concise and action-oriented.
4. **CTA links** (Weight: 20%) -- The conversion point. Must be clearly tappable.
5. **Accent color indicators** (Weight: 10%) -- Visual differentiation.

### 5.5 Visual Description

**Section Headline:** "AI-Powered Tools to Get You Started" -- `#FFFFFF`, 44px/700 Inter. Centered.

**Subheadline:** "Free, intelligent tools that help you go from idea to app." -- `#9CA3AF`, 18px/400 Inter. Centered. Max-width 520px. Margin-top 16px.

**Tool Cards:**

Each card is a large rectangle with `#1A2332` background, `1px solid #243044` border, 16px border-radius. Padding: 36px (generous -- these cards need breathing room).

Each card has a distinctive accent treatment:

**Accent Indicator:** A small colored dot (8px diameter, border-radius 50%) sits in the top-left of the card, followed by a subtle horizontal line (40px wide, 2px tall) in the same accent color at 30% opacity. This creates a minimal but distinctive color signal. The entire top-left corner of the card also has a very subtle gradient overlay: `linear-gradient(135deg, rgba([accent], 0.06) 0%, transparent 40%)`. This tints the card corner almost imperceptibly, creating a warm pool of color.

**Icon:** Each tool has a 40px icon rendered in the tool's accent color. The icon sits below the accent indicator with 20px margin.

- Idea Lab: Lightbulb icon (orange `#F59E0B`)
- AI Idea Analyzer: Magnifying glass with sparkle icon (blue `#3B82F6`)
- Get AI Estimate: Calculator/receipt icon (green `#10B981`)
- AI ROI Calculator: Chart/trending-up icon (purple `#8B5CF6`)

**Tool Title:** `#F4F4F2`, 24px/600 Inter. Margin-top: 16px below icon.

**Tool Description:** `#9CA3AF`, 16px/400 Inter. Line-height 1.6. Margin-top: 12px. This is the one-line pitch. It must be conversational and human.

**CTA Link:** The tool's accent color, 15px/600 Inter. Margin-top: 24px. Format: "Try Idea Lab" with a right-arrow icon (14px) and 6px gap. No button shape -- this is a text-style CTA with the accent color. On hover: text brightens (lighter shade of accent), arrow shifts 4px right. The entire card is also a click target (the card itself is an anchor element wrapping the entire card content).

**Card hover state:** On hover, the accent gradient in the top-left corner intensifies from 6% to 12% opacity. The card border shifts from `#243044` to the accent color at 30% opacity. The card lifts `translateY(-4px)` with shadow increase. Transition: 300ms.

### 5.6 Animation Sequence

**Scroll entrance (triggered at 0.2 intersection threshold):**

| Order | Element | Animation | Delay | Duration |
|-------|---------|-----------|-------|----------|
| 1 | Section headline | Fade in + translateY(20px to 0) | 0ms | 500ms |
| 2 | Subheadline | Fade in + translateY(10px to 0) | 100ms | 400ms |
| 3 | Card 1 (Idea Lab) | Fade in + translateY(20px to 0) | 200ms | 500ms |
| 4 | Card 2 (Analyzer) | Fade in + translateY(20px to 0) | 280ms | 500ms |
| 5 | Card 3 (Estimate) | Fade in + translateY(20px to 0) | 360ms | 500ms |
| 6 | Card 4 (ROI) | Fade in + translateY(20px to 0) | 440ms | 500ms |

The stagger creates a wave effect: top-left, top-right, bottom-left, bottom-right. Z-pattern reading order.

### 5.7 Visual Flow (Eye Path)

The eye enters at the section headline (centered), drops to the subheadline, then moves to the top-left card (Idea Lab -- the most exploratory, lowest-commitment tool). The four colored accent dots create a visual rhythm that encourages scanning all four cards in Z-pattern order: top-left, top-right, bottom-left, bottom-right. Each card's CTA link in its accent color acts as a micro-focal point that the eye catches as it scans.

### 5.8 Responsive Behavior

**Desktop (> 1024px):** 2x2 grid. 24px gap. Cards are equal height (CSS grid stretch).

**Tablet (640 - 1024px):** 2x2 grid. 20px gap. Card padding reduces to 28px.

**Mobile (< 640px):** Single column, stacked. 16px gap. Card padding: 24px. Cards at full width. The accent gradient effect is maintained. Cards stack in funnel order: Idea Lab first (top-of-funnel), then Analyzer, Estimate, ROI (bottom-of-funnel). This respects the buyer journey even in a scrolling context.

### 5.9 Interactions

- **Entire card is clickable:** Each card links to its respective tool page. The cursor changes to pointer on hover.
- **Card hover (desktop):** Background subtly shifts, border takes on accent color tint, card lifts, shadow deepens. Arrow in CTA shifts right.
- **Card focus (keyboard):** Focus ring in the card's accent color (2px solid, 2px offset). This ensures each card has a unique, identifiable focus indicator.
- **Card active/pressed:** Card translates back to Y(0), background darkens slightly, providing tactile feedback.

### 5.10 Component Mapping

| Element | Component |
|---------|-----------|
| Section | `<SectionWrapper bg="darker" padding="xl" />` |
| Heading group | `<SectionHeader title="..." subtitle="..." align="center" />` |
| Tool card | `<ToolCard icon={...} title="..." description="..." cta="..." href="..." accentColor="orange" />` |
| Grid | `<Grid cols={{ base: 1, sm: 2 }} gap="lg" />` |

### 5.11 Exact Copy

**Headline:** "AI-Powered Tools to Get You Started"

**Subheadline:** "Free, intelligent tools that help you go from idea to app."

**Card 1 (Orange):**
- Title: "Idea Lab"
- Description: "Don't have an idea yet? We'll help you find one."
- CTA: "Try Idea Lab"

**Card 2 (Blue):**
- Title: "AI Idea Analyzer"
- Description: "Have an idea? Let's validate it."
- CTA: "Analyze Your Idea"

**Card 3 (Green):**
- Title: "Get AI Estimate"
- Description: "Ready to build? Get your quote."
- CTA: "Get Estimate"

**Card 4 (Purple):**
- Title: "AI ROI Calculator"
- Description: "See how much an app could save you."
- CTA: "Calculate ROI"

---

## 6. Section 5: Ready-Made Solutions Preview

### 6.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|            Launch Faster with Ready-Made Solutions                  |
|       Pre-built, customizable apps. Deploy in weeks.               |
|                                                                    |
|  +----------+  +----------+  +----------+  +----------+           |
|  | [icon]   |  | [icon]   |  | [icon]   |  | [icon]   |           |
|  | Delivery |  | Kinder-  |  | Hyper-   |  | Office   |           |
|  | App      |  | garten   |  | market   |  | Suite    |           |
|  |          |  |          |  |          |  |          |           |
|  | From     |  | From     |  | From     |  | From     |           |
|  | $10,000  |  | $8,000   |  | $15,000  |  | $8,000   |           |
|  | 35 days  |  | 30 days  |  | 45 days  |  | 25 days  |           |
|  |          |  |          |  |          |  |          |           |
|  | [Learn   |  | [Learn   |  | [Learn   |  | [Learn   |           |
|  |  More]   |  |  More]   |  |  More]   |  |  More]   |           |
|  +----------+  +----------+  +----------+  +----------+           |
|                                                                    |
|                     [View All Solutions]                            |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#0F1419`. Section padding: 120px top and bottom.

Container: max-width 1280px. Heading group centered.

Cards: Horizontal scrollable row on mobile (overflow-x auto, snap). Grid on desktop (4 columns). This creates a carousel-like feel on mobile without complex carousel logic.

### 6.2 Content Hierarchy

1. **Price** (Weight: 30%) -- The most impactful information. "Starting from $X,XXX" answers the visitor's top question immediately.
2. **Solution name** (Weight: 25%) -- What it is.
3. **Timeline** (Weight: 20%) -- How fast. This is a key differentiator.
4. **Icon** (Weight: 15%) -- Visual anchor for scanning.
5. **CTA** (Weight: 10%) -- Path forward.

### 6.3 Visual Description

**Section Headline:** "Launch Faster with Ready-Made Solutions" -- `#FFFFFF`, 44px/700 Inter. Centered.

**Subheadline:** "Pre-built, customizable apps. Deploy in weeks, not months." -- `#9CA3AF`, 18px/400 Inter. Centered.

**Solution Cards:** `#1A2332` background, `1px solid #243044` border, 16px radius. Padding: 28px. Min-width on mobile scroll: 260px.

**Card Structure (top to bottom):**

1. **Icon:** A 48px x 48px icon representing the solution type. Rendered in `#C08460` bronze. Icons: truck (Delivery), school-house (Kindergarten), shopping-cart (Hypermarket), briefcase (Office).

2. **Solution Name:** `#F4F4F2`, 20px/600 Inter. Margin-top: 20px.

3. **Price:** "Starting from" in `#9CA3AF`, 12px/400 Inter. Price value "$10,000" in `#C08460` bronze, 24px/700 Inter. The price is the most visually prominent element after the icon. Margin-top: 16px.

4. **Timeline Badge:** A small pill badge: `rgba(16, 185, 129, 0.1)` background (green tint), `#10B981` text, 12px/500 Inter. Content: "35 days". Padding: 4px 12px. Border-radius: 9999px. Margin-top: 12px.

5. **CTA Link:** "Learn More" with right arrow. `#C08460`, 14px/600 Inter. Margin-top: 20px. Hover: arrow shifts right 3px.

**"View All Solutions" Button:** Centered below the cards grid. Outline style (secondary button). Margin-top: 48px.

### 6.4 Responsive Behavior

**Desktop (> 1024px):** 4-column grid. 24px gap. All cards visible simultaneously.

**Tablet (640 - 1024px):** 2-column grid, 2 rows. 20px gap.

**Mobile (< 640px):** Horizontal scroll row (flexbox, overflow-x auto, scroll-snap-type: x mandatory). Each card: scroll-snap-align: start. 16px gap. Padding-left: 24px (first card), padding-right: 24px (last card). A subtle horizontal scroll indicator (a thin line below the cards showing scroll progress, or simply allowing the edge of the next card to peek in from the right, signaling scrollability).

### 6.5 Interactions

- **Card hover:** Same lift pattern as service cards. Background to `#1E2940`, translateY(-4px), shadow increase.
- **Card click:** Navigates to the individual solution page (Phase 2) or a solutions catalog page.
- **Scroll entrance:** Cards stagger in from the right (translateX 30px to 0) with 80ms stagger, 500ms duration.
- **Mobile scroll:** Momentum scrolling with snap points. No custom scrollbar styling -- the native scroll behavior is appropriate.

### 6.6 Component Mapping

| Element | Component |
|---------|-----------|
| Section | `<SectionWrapper />` |
| Header | `<SectionHeader />` |
| Card | `<SolutionCard icon={...} name="..." price="..." timeline="..." href="..." />` |
| Grid/Scroll | `<ScrollableGrid cols={{ base: "scroll", md: 2, lg: 4 }} />` |
| View All | `<Button variant="outline" />` |

### 6.7 Exact Copy

**Headline:** "Launch Faster with Ready-Made Solutions"

**Subheadline:** "Pre-built, customizable apps. Deploy in weeks, not months."

**Solutions:**

| Solution | Price | Timeline |
|----------|-------|----------|
| Delivery App | Starting from $10,000 | 35 days |
| Kindergarten Management | Starting from $8,000 | 30 days |
| Hypermarket System | Starting from $15,000 | 45 days |
| Office Suite | Starting from $8,000 | 25 days |

**CTA:** "View All Solutions"

---

## 7. Section 6: Live Apps Showcase

### 7.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|            Apps We've Built - Live in Stores                       |
|        Subtitle about real apps, real users                        |
|                                                                    |
|  +--------+  +--------+  +--------+  +--------+                   |
|  | [icon] |  | [icon] |  | [icon] |  | [icon] |                   |
|  | Skin   |  | Caliber|  | Hair   |  | Wear & |                   |
|  | Verse  |  | OS     |  | Vision |  | Share  |                   |
|  | desc   |  | desc   |  | desc   |  | desc   |                   |
|  | [AS]   |  | [AS]   |  | [AS]   |  | [AS]   |                   |
|  | [GP]   |  | [GP]   |  | [GP]   |  | [GP]   |                   |
|  +--------+  +--------+  +--------+  +--------+                   |
|                                                                    |
|  +--------+  +--------+  +--------+  +--------+                   |
|  | [icon] |  | [icon] |  | [icon] |  | [icon] |                   |
|  | Pickles|  | Secr-  |  | Nay    |  | Flex   |                   |
|  | Ball   |  | tary   |  | Nursery|  | Pro    |                   |
|  | desc   |  | desc   |  | desc   |  | desc   |                   |
|  | [AS]   |  | [AS]   |  | [AS]   |  | [AS]   |                   |
|  | [GP]   |  | [GP]   |  | [GP]   |  | [GP]   |                   |
|  +--------+  +--------+  +--------+  +--------+                   |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#111820` (subtly different from `#0F1419` to create visual rhythm between sections -- alternating depth). Section padding: 120px top and bottom.

Container: max-width 1280px. Heading centered.

Grid: 4 columns on desktop, 2 rows. 24px gap.

### 7.2 Content Hierarchy

1. **App icons** (Weight: 35%) -- These are the primary visual proof. Real app icons from real stores.
2. **App names** (Weight: 25%) -- Quick identification.
3. **Store buttons** (Weight: 25%) -- The validation element. "These apps are actually live."
4. **Descriptions** (Weight: 15%) -- Brief context.

### 7.3 Visual Description

**Section Headline:** "Apps We've Built - Live in Stores" -- `#FFFFFF`, 44px/700 Inter. Centered.

**Subheadline:** "Real apps. Real users. Available on the App Store and Google Play." -- `#9CA3AF`, 18px/400. Centered.

**App Cards:** `#1A2332` background, `1px solid #243044` border, 16px radius. Padding: 24px. Text-align: center.

**Card Structure:**

1. **App Icon:** 64px x 64px rounded square (20px radius) centered. This should use the actual app icon from the store. If actual icons are not available, use a placeholder with the app's initial letter on a gradient background unique to each app. Margin-bottom: 16px.

2. **App Name:** `#F4F4F2`, 18px/600 Inter. Centered.

3. **Description:** `#9CA3AF`, 14px/400 Inter. One line max (truncate with ellipsis if needed). Centered. Margin-top: 8px. Max-width: 200px, centered within card.

4. **Store Buttons:** Two small badges side-by-side, centered. Each is 32px tall. The App Store badge shows a small Apple icon + "App Store" text. The Google Play badge shows a small Play icon + "Google Play" text. Both are `#243044` background, `#9CA3AF` text, 8px radius, 14px gap between them. Margin-top: 16px.

   For HairVision Pro (web-only B2B), replace store buttons with a single "Web App" badge.

**Apps to display (8 total):**

| App | Description | Platforms |
|-----|------------|-----------|
| SkinVerse | AI-powered skin analysis | iOS, Android |
| Caliber OS | AI hairstyle visualization | iOS, Android |
| HairVision Pro | AI hair transplant planning | Web |
| Wear and Share | AI fashion generation | iOS, Android |
| Pickles Ball | Court booking made easy | iOS, Android |
| Secrtary | Medical practice management | iOS, Android |
| Nay Nursery | Nursery management platform | iOS, Android |
| Flex Pro | Business operations suite | iOS, Android |

### 7.4 Responsive Behavior

**Desktop (> 1024px):** 4x2 grid. 24px gap.

**Tablet (640 - 1024px):** 3-column grid (3 + 3 + 2 in last row). Or 2x4 grid. 20px gap.

**Mobile (< 640px):** 2-column grid. 16px gap. App icon size reduces to 52px. Store buttons stack vertically within each card or reduce to icon-only (Apple logo / Play logo, no text). Card padding reduces to 20px.

### 7.5 Interactions

- **Card hover:** Lift + shadow. App icon scales to 1.08 (slightly larger). Transition 300ms.
- **Store button click:** Opens App Store or Google Play listing in new tab.
- **Store button hover:** Background lightens to `#2A3650`.
- **Scroll entrance:** Cards stagger in a grid wave pattern (left-to-right, top-to-bottom) with 60ms stagger between each.

### 7.6 Component Mapping

| Element | Component |
|---------|-----------|
| Card | `<AppShowcaseCard icon="..." name="..." description="..." appStoreUrl="..." playStoreUrl="..." />` |
| Store button | `<StoreBadge platform="ios" url="..." />` |
| Grid | `<Grid cols={{ base: 2, md: 3, lg: 4 }} gap="lg" />` |

### 7.7 Exact Copy

**Headline:** "Apps We've Built - Live in Stores"

**Subheadline:** "Real apps. Real users. Available on the App Store and Google Play."

(Individual app descriptions as listed in the table above.)

---

## 8. Section 7: Why Choose Aviniti

### 8.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|                  Why Companies Choose Us                           |
|                                                                    |
|  +-------------------------------+  +---------------------------+  |
|  |  [icon]                       |  |  [icon]                   |  |
|  |  AI-First Expertise           |  |  Speed to Market          |  |
|  |                               |  |                           |  |
|  |  We don't just build apps.    |  |  Ready-made accelerators  |  |
|  |  We build intelligent apps    |  |  mean 60% faster launch   |  |
|  |  that learn and adapt.        |  |  times.                   |  |
|  +-------------------------------+  +---------------------------+  |
|                                                                    |
|  +-------------------------------+  +---------------------------+  |
|  |  [icon]                       |  |  [icon]                   |  |
|  |  End-to-End Partner           |  |  Transparent Pricing      |  |
|  |                               |  |                           |  |
|  |  From idea to app store,      |  |  Know your costs upfront  |  |
|  |  we handle everything.        |  |  with our AI estimator.   |  |
|  +-------------------------------+  +---------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#0F1419`. Section padding: 120px top and bottom.

Container: max-width 1280px.

Grid: 2x2 on desktop. 24px gap.

### 8.2 Content Hierarchy

1. **Differentiator titles** (Weight: 35%) -- The key claims.
2. **Descriptions** (Weight: 30%) -- The evidence and explanation.
3. **Icons** (Weight: 20%) -- Visual anchors and category signifiers.
4. **Section headline** (Weight: 15%) -- Context setter.

### 8.3 Visual Description

**Section Headline:** "Why Companies Choose Us" -- `#FFFFFF`, 44px/700 Inter. Centered.

**Differentiator Cards:** `#1A2332` background, `1px solid #243044` border, 16px radius. Padding: 36px.

**Card Structure:**

1. **Icon:** 44px x 44px. Rendered in bronze `#C08460` inside a `rgba(192, 132, 96, 0.1)` background square (52px, 12px radius).
   - AI-First: Brain/sparkle icon
   - Speed: Rocket/clock icon
   - End-to-End: Infinity/chain icon
   - Transparent: Eye/dollar icon

2. **Title:** `#F4F4F2`, 22px/600 Inter. Margin-top: 20px.

3. **Description:** `#9CA3AF`, 15px/400 Inter. Line-height 1.7. Margin-top: 12px.

**Key Metric Highlight:** Each card includes one bold stat or proof point embedded in the description, rendered in `#F4F4F2` (white) within the otherwise `#9CA3AF` text. For example, in the Speed card: "...mean **60% faster** launch times." The "60% faster" is white and semibold. This creates visual punctuation within the descriptive text.

### 8.4 Responsive Behavior

**Desktop (> 1024px):** 2x2 grid. 24px gap.

**Tablet (640 - 1024px):** 2x2 grid. 20px gap.

**Mobile (< 640px):** Single column. 16px gap. Cards at full width.

### 8.5 Interactions

- **Card hover:** Standard lift + shadow pattern.
- **No click action** -- these are informational. The transparent pricing card could optionally link to the AI Estimate tool, but this should be a subtle text link within the description, not the entire card.
- **Scroll entrance:** Stagger fade-up, 80ms between cards.

### 8.6 Component Mapping

| Element | Component |
|---------|-----------|
| Card | `<DifferentiatorCard icon={...} title="..." description="..." />` |
| Grid | `<Grid cols={{ base: 1, sm: 2 }} gap="lg" />` |

### 8.7 Exact Copy

**Headline:** "Why Companies Choose Us"

**Card 1:**
- Title: "AI-First Expertise"
- Description: "We don't just build apps -- we build intelligent apps that learn, adapt, and deliver measurable results using cutting-edge AI."

**Card 2:**
- Title: "Speed to Market"
- Description: "Our ready-made accelerators mean 60% faster launch times. Get to market in weeks, not months."

**Card 3:**
- Title: "End-to-End Partner"
- Description: "From idea to app store, we handle everything -- design, development, testing, deployment, and ongoing support."

**Card 4:**
- Title: "Transparent Pricing"
- Description: "No surprises. Know your costs upfront with our AI-powered estimator. Clear quotes, honest timelines."

---

## 9. Section 8: Case Studies Preview

### 9.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|                  Real Results, Real Impact                         |
|       See how we've helped businesses transform                    |
|                                                                    |
|  +-----------+    +-----------+    +-----------+                   |
|  | [industry |    | [industry |    | [industry |                   |
|  |  icon]    |    |  icon]    |    |  icon]    |                   |
|  |           |    |           |    |           |                   |
|  | HEALTHCARE|    | E-COMMERCE|    | LOGISTICS |                   |
|  |           |    |           |    |           |                   |
|  | Reduced   |    | 3x Conv.  |    | Cut Costs |                   |
|  | Wait Times|    | Rate with |    | by 25%    |                   |
|  | by 40%    |    | AI Recs   |    |           |                   |
|  |           |    |           |    |           |                   |
|  | [40%      |    | [3x       |    | [25%      |                   |
|  |  faster]  |    |  growth]  |    |  savings] |                   |
|  |           |    |           |    |           |                   |
|  | Read ->   |    | Read ->   |    | Read ->   |                   |
|  +-----------+    +-----------+    +-----------+                   |
|                                                                    |
|                    [View All Case Studies]                          |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#111820`. Section padding: 120px top and bottom.

Container: max-width 1280px. Heading centered.

Grid: 3 columns on desktop. 24px gap.

### 9.2 Content Hierarchy

1. **Key metric** (Weight: 35%) -- "40%", "3x", "25%". The number is the hook.
2. **Case study headline** (Weight: 30%) -- What happened and for whom.
3. **Industry label** (Weight: 15%) -- Category context.
4. **Read link** (Weight: 10%) -- Path to detail.
5. **Industry icon** (Weight: 10%) -- Visual anchor.

### 9.3 Visual Description

**Section Headline:** "Real Results, Real Impact" -- `#FFFFFF`, 44px/700 Inter. Centered.

**Subheadline:** "See how we've helped businesses like yours transform." -- `#9CA3AF`, 18px/400 Inter. Centered.

**Case Study Cards:** `#1A2332` background, `1px solid #243044` border, 16px radius. Padding: 32px.

**Card Structure:**

1. **Industry Label:** Uppercase, `#9CA3AF`, 12px/500 Inter, letter-spacing 0.05em. Example: "HEALTHCARE". A small industry icon (20px) in `#9CA3AF` sits to the left of the label.

2. **Case Study Headline:** `#F4F4F2`, 20px/600 Inter. Margin-top: 16px. Two lines max. Example: "Healthcare Startup Reduces Wait Times by 40%"

3. **Key Metric Highlight:** A large, prominent metric display. The number ("40%") renders in `#C08460` bronze, 36px/700 Inter. Below it, a descriptor in `#9CA3AF`, 13px/400: "faster patient processing". This sits in a subtle highlighted area: `rgba(192, 132, 96, 0.05)` background, 12px radius, padding 16px, full width within the card. Margin-top: 20px.

4. **Read Link:** "Read Case Study" with right arrow. `#C08460`, 14px/600. Margin-top: 20px. Hover: arrow shifts right.

### 9.4 Responsive Behavior

**Desktop (> 1024px):** 3-column grid. 24px gap.

**Tablet (640 - 1024px):** 3-column grid (narrower cards). Or 2+1 layout if needed.

**Mobile (< 640px):** Horizontal scroll (same treatment as Solutions Preview -- scroll-snap, card min-width 280px). This prevents the section from becoming excessively tall on mobile.

### 9.5 Interactions

- **Card hover:** Lift + shadow. The metric highlight area background intensifies slightly.
- **Card click:** Navigates to full case study page.
- **Scroll entrance:** Cards stagger from left to right, 100ms apart.

### 9.6 Component Mapping

| Element | Component |
|---------|-----------|
| Card | `<CaseStudyCard industry="..." headline="..." metric="..." metricLabel="..." href="..." />` |

### 9.7 Exact Copy

**Headline:** "Real Results, Real Impact"

**Subheadline:** "See how we've helped businesses like yours transform."

**Case Study 1:**
- Industry: "Healthcare"
- Headline: "Healthcare Startup Reduces Wait Times by 40%"
- Metric: "40%" / "faster patient processing"

**Case Study 2:**
- Industry: "E-Commerce"
- Headline: "3x Conversion Rate with AI Recommendations"
- Metric: "3x" / "conversion growth"

**Case Study 3:**
- Industry: "Logistics"
- Headline: "Cut Delivery Costs by 25% with Route AI"
- Metric: "25%" / "cost reduction"

**CTA:** "View All Case Studies"

---

## 10. Section 9: Final CTA

**Priority Level: CRITICAL -- This is the last chance to convert before the footer. The visitor has scrolled the entire page. They are informed. They are interested. This section must close the deal.**

### 10.1 Emotional Intent

By this point, the visitor has seen: credibility (hero), proof (apps, case studies), differentiation (why us), and tools (AI spotlight). The Final CTA must create a sense of "why not now?" It should feel warm, inviting, and low-pressure -- not desperate or pushy. The emotional tone is: "We are ready when you are. Here are three easy ways to start."

The section must convey confidence: "We are good at what we do, and we make starting easy." The multiple CTA options (AI estimate, call, WhatsApp) respect different comfort levels and cultural preferences (WhatsApp is essential for MENA audiences).

### 10.2 Conversion Psychology

Three CTAs at three commitment levels:
- **"Get AI Estimate"** -- Self-service, instant, no human interaction needed. Lowest friction. This appeals to analytical buyers who want data before talking to anyone.
- **"Book a Call"** -- Medium commitment. Appeals to relational buyers who want to discuss before deciding.
- **"Message us on WhatsApp"** -- Culturally specific, conversational, immediate. Appeals to MENA decision-makers who prefer WhatsApp for business. Also feels the most informal and approachable.

The section uses a contained, elevated visual treatment (not just text on a flat background) to create a "moment" -- a visual pause that says "this is important, pay attention."

### 10.3 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |                                                              | |
|  |              Ready to Build Something Great?                 | |
|  |                                                              | |
|  |     Get a free AI-powered estimate for your project          | |
|  |                    in minutes.                                | |
|  |                                                              | |
|  |       [Get AI Estimate]    [Book a Call]                     | |
|  |                                                              | |
|  |          Or message us on WhatsApp  [WA icon]                | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#0F1419`.

Container: max-width 1280px, centered.

**Inner Container:** A large, rounded rectangle (20px radius) centered within the container. Background: `#1A2332`. Border: `1px solid #243044`. Padding: 80px (desktop), 48px (mobile). Text-align: center. This elevated surface creates visual importance and separates the CTA from surrounding content.

Section padding: 120px top and bottom (desktop), 80px top and bottom (mobile).

### 10.4 Content Hierarchy

1. **Headline** (Weight: 35%) -- The closing question.
2. **Primary CTA** (Weight: 30%) -- The money action.
3. **Subheadline** (Weight: 15%) -- Reassurance and value.
4. **Secondary CTAs** (Weight: 20%) -- Alternative paths.

### 10.5 Visual Description

**Background Treatment:** The inner container (`#1A2332`) has a subtle gradient overlay: `radial-gradient(ellipse at center, rgba(192, 132, 96, 0.04) 0%, transparent 70%)`. This creates a barely-visible warm glow centered behind the headline, adding depth and warmth without being obvious. The effect is atmospheric.

**Headline:** "Ready to Build Something Great?" -- `#FFFFFF`, 44px/700 Inter. Centered. This is a question -- it creates mental engagement. The visitor subconsciously answers "yes" if they have scrolled this far.

**Subheadline:** "Get a free AI-powered estimate for your project in minutes." -- `#9CA3AF`, 18px/400 Inter. Centered. Max-width 480px. Margin-top: 16px. The word "free" is important -- it reduces perceived risk. "Minutes" creates urgency and ease.

**Primary CTA:** "Get AI Estimate" -- Full bronze button, large size. Padding: 18px 40px. Font: 18px/600 Inter. This button is intentionally larger than other CTAs on the page. It is the most prominent button in the entire section. A small sparkle/AI icon (16px) sits before the text. Margin-top: 40px.

**Secondary CTA:** "Book a Call" -- Outline button. Same height as primary. Sits to the right of primary on desktop (20px gap). On mobile, stacks below (16px gap).

**WhatsApp CTA:** Below the button row, centered. Margin-top: 24px. Format: "Or message us on WhatsApp" in `#9CA3AF`, 15px/400 Inter. A WhatsApp icon (20px, `#25D366` green) sits to the right of the text with 8px gap. On hover, the text brightens to `#F4F4F2` and the WhatsApp icon subtly scales to 1.1. The entire line is a single clickable link that opens WhatsApp with a pre-filled message.

**Decorative Elements:** Two subtle decorative lines (1px, `#243044`) extend from the inner container edges toward the section edges, approximately at the vertical center of the section. These create a subtle "wings" effect that frames the CTA container. They fade from `#243044` to `transparent` over 100px. Optional -- include only if it does not feel cluttered.

### 10.6 Animation Sequence

**Scroll entrance (triggered at 0.3 threshold -- slightly higher because this is a focused section):**

| Order | Element | Animation | Delay | Duration |
|-------|---------|-----------|-------|----------|
| 1 | Inner container | Scale(0.97 to 1) + opacity(0 to 1) | 0ms | 600ms |
| 2 | Headline | Fade in + translateY(15px to 0) | 200ms | 500ms |
| 3 | Subheadline | Fade in + translateY(10px to 0) | 350ms | 400ms |
| 4 | Primary CTA | Fade in + translateY(10px to 0) | 500ms | 400ms |
| 5 | Secondary CTA | Fade in + translateY(10px to 0) | 600ms | 400ms |
| 6 | WhatsApp link | Fade in | 700ms | 300ms |

The container scaling from 0.97 to 1.0 creates a subtle "breathing in" effect -- the section gently expands into place, creating a moment of arrival.

### 10.7 Visual Flow (Eye Path)

The inner container creates a visual "stage" that immediately focuses attention. The eye enters at the headline (largest, whitest, centered). It drops to the subheadline for context ("free", "minutes"). Then it drops to the primary bronze button -- the highest-contrast element. If the visitor is not ready for self-service, the eye moves right to "Book a Call". If they prefer WhatsApp, the eye drops to the WhatsApp line. Every path leads to a conversion action.

### 10.8 Responsive Behavior

**Desktop (> 1024px):**
- Inner container padding: 80px
- Headline: 44px
- Two buttons side-by-side
- WhatsApp link below, centered

**Tablet (640 - 1024px):**
- Inner container padding: 56px
- Headline: 36px
- Two buttons side-by-side (if space permits) or stacked

**Mobile (< 640px):**
- Inner container padding: 40px 24px
- Inner container border-radius: 16px
- Headline: 28px
- Buttons stack vertically, full width, 12px gap
- WhatsApp link below buttons, centered, 20px margin-top
- Decorative wing lines hidden

### 10.9 Interactions

- **Primary CTA hover:** Background to `#A6714E`, glow shadow, slight lift. Sparkle icon animates (subtle rotation or pulse).
- **Secondary CTA hover:** Background fill to `rgba(192, 132, 96, 0.1)`.
- **WhatsApp hover:** Text brightens, icon scales to 1.1, icon color remains `#25D366`.
- **WhatsApp click:** Opens `https://wa.me/962XXXXXXXXX?text=Hi! I'm interested in learning more about Aviniti's services.` in new tab/app.

### 10.10 Component Mapping

| Element | Component |
|---------|-----------|
| Inner container | `<CTAContainer />` or styled div |
| Headline | `<Heading level={2} />` |
| Subheadline | `<Text variant="large" color="secondary" />` |
| Primary CTA | `<Button variant="primary" size="xl" />` |
| Secondary CTA | `<Button variant="outline" size="xl" />` |
| WhatsApp link | `<WhatsAppLink phone="..." message="..." />` |

### 10.11 Exact Copy

**Headline:** "Ready to Build Something Great?"

**Subheadline:** "Get a free AI-powered estimate for your project in minutes."

**Primary CTA:** "Get AI Estimate"

**Secondary CTA:** "Book a Call"

**WhatsApp:** "Or message us on WhatsApp"

---

## 11. Section 10: Footer

### 11.1 Layout

```
+------------------------------------------------------------------+
|  1px border-top: #243044                                           |
|                                                                    |
|  [Logo]                                                            |
|  YOUR IDEAS, OUR REALITY                                           |
|                                                                    |
|  Quick Links      AI Tools        Contact         Follow Us       |
|  ----------        ---------       ---------       ----------      |
|  Home              Idea Lab        hello@...       LinkedIn        |
|  Services          AI Analyzer     +962...         WhatsApp        |
|  Solutions         Get Estimate    Amman, Jordan                   |
|  Blog              ROI Calculator  WhatsApp                        |
|  FAQ                                                               |
|  About                                                             |
|                                                                    |
|  ---------------------------------------------------------------  |
|  1px border: #243044                                               |
|                                                                    |
|  (c) 2026 Aviniti.       Privacy Policy  |  Terms of Service      |
|                           [EN / AR]                                |
|                                                                    |
+------------------------------------------------------------------+
```

Full-width section. Background: `#0B0F14` (slightly darker than the page background, creating a visual "base" for the page). Top border: `1px solid #243044`.

Container: max-width 1280px.

Padding: 80px top, 40px bottom.

### 11.2 Content Hierarchy

1. **Logo and tagline** (Weight: 20%) -- Brand anchor.
2. **Link columns** (Weight: 40%) -- Navigation utility.
3. **Contact info** (Weight: 25%) -- Findability.
4. **Legal and language** (Weight: 15%) -- Functional necessities.

### 11.3 Visual Description

**Logo Area:** The bronze infinity symbol (24px height) + "AVINITI" text (18px/700 Inter, `#F4F4F2`). Below it, the tagline "YOUR IDEAS, OUR REALITY" in 11px/500 Inter, `#9CA3AF`, uppercase, letter-spacing 0.1em. Margin-bottom: 48px.

**Link Columns:** Four columns on desktop. Each column has a heading in `#F4F4F2`, 14px/600 Inter, uppercase, letter-spacing 0.05em. Below the heading, links in `#9CA3AF`, 14px/400 Inter, with 12px vertical gap between links. Links hover to `#F4F4F2` with subtle underline.

**Column content:**

Column 1 -- "Quick Links": Home, Services, Solutions, Blog, FAQ, About

Column 2 -- "AI Tools": Idea Lab, AI Analyzer, Get Estimate, ROI Calculator

Column 3 -- "Contact": hello@aviniti.com, +962 XX XXX XXXX, Amman, Jordan, WhatsApp link

Column 4 -- "Follow Us": LinkedIn (with icon), WhatsApp (with icon)

**Bottom Bar:** Separated from link columns by a `1px solid #243044` horizontal line with 40px margin-top and 24px margin-bottom.

Left side: "(c) 2026 Aviniti. All rights reserved." in `#9CA3AF`, 13px/400 Inter.

Right side: "Privacy Policy" | "Terms of Service" in `#9CA3AF`, 13px/400 Inter. Pipe separator in `#243044`. Language switcher: "EN / AR" toggle or dropdown in `#9CA3AF`.

### 11.4 Responsive Behavior

**Desktop (> 1024px):** Logo top-left. Four link columns in a row below, evenly distributed.

**Tablet (640 - 1024px):** Logo top-left. Link columns in a 2x2 grid. 24px gap.

**Mobile (< 640px):** Logo centered. Link columns stack vertically. Each column heading acts as an accordion toggle (tap to expand/collapse the links below it). This keeps the footer compact on mobile. Bottom bar stacks: copyright on one line, legal links on the next, language switcher on the third. All centered.

### 11.5 Interactions

- **Link hover:** Text color transitions from `#9CA3AF` to `#F4F4F2`. Underline slides in from left (200ms).
- **Social icons hover:** Icon color transitions from `#9CA3AF` to their brand color (LinkedIn blue `#0A66C2`, WhatsApp green `#25D366`).
- **Mobile accordion:** Column heading tap toggles the link list. Chevron icon rotates 180 degrees. Expand/collapse animates height with 200ms ease-out.
- **Language switcher:** Click toggles between EN and AR. Active language is `#F4F4F2`, inactive is `#9CA3AF`.

### 11.6 Component Mapping

| Element | Component |
|---------|-----------|
| Footer | `<Footer />` |
| Link column | `<FooterColumn title="..." links={[...]} />` |
| Bottom bar | `<FooterBottom />` |
| Language switcher | `<LanguageSwitcher />` |

### 11.7 Exact Copy

**Tagline:** "YOUR IDEAS, OUR REALITY"

**Column Headings:** "Quick Links", "AI Tools", "Contact", "Follow Us"

**Copyright:** "(c) 2026 Aviniti. All rights reserved."

**Legal Links:** "Privacy Policy", "Terms of Service"

---

## 12. Cross-Section Animation Choreography

### 12.1 Scroll-Triggered Animation System

All sections below the hero use scroll-triggered animations via `IntersectionObserver`. The system follows these rules:

1. **Trigger once:** Animations play once when the section enters the viewport. They do not replay on scroll-back.
2. **Threshold:** 0.2 for most sections (20% visible). 0.3 for the Final CTA (higher threshold ensures the section is prominently in view before animating).
3. **Stagger pattern:** Within each section, elements animate in reading order (top-to-bottom, left-to-right) with 80ms stagger between siblings.
4. **Base animation:** Fade in (opacity 0 to 1) + translateY(20px to 0). Duration: 500ms. Easing: ease-out-expo.
5. **No horizontal animations** except where specifically noted (Solutions scroll, code snippets). Horizontal motion on scroll-in can feel chaotic.

### 12.2 Page-Level Animation Cadence

| Section | Entrance Type | Notes |
|---------|--------------|-------|
| Hero | Page load (not scroll) | Choreographed sequence (see Section 2.6) |
| Trust Indicators | Scroll | Counters animate on viewport entry |
| Services | Scroll | 4 cards stagger |
| AI Tools | Scroll | Headline, then 4 cards stagger |
| Ready-Made | Scroll | Cards stagger left-to-right |
| Live Apps | Scroll | Grid wave pattern |
| Why Choose | Scroll | 4 cards stagger |
| Case Studies | Scroll | 3 cards stagger |
| Final CTA | Scroll | Container scale, then content sequence |
| Footer | No animation | Footer appears instantly. Animating the footer would feel unnecessary and delay access to functional links. |

### 12.3 Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All translateY/translateX animations are removed
- All scale animations are removed
- Opacity transitions are retained but shortened to 100ms
- Counter animations show final values immediately (no counting)
- Floating code snippets in the hero are static (no bob)
- Hover lifts are removed (only background/color changes remain)
- Device mockup carousel uses instant crossfade (0ms) instead of 600ms

### 12.4 Performance Guardrails

- Maximum 3 simultaneous CSS transitions per element
- All animations use `transform` and `opacity` only (GPU-composited properties)
- No `height`, `width`, `margin`, `padding`, `top`, `left` animations
- Framer Motion `layout` animations used sparingly (only for route transitions)
- `will-change` applied only to elements about to animate, removed after animation completes
- IntersectionObserver disconnect after animation triggers (prevent memory leaks)

---

## 13. Performance Budget

| Metric | Target | Rationale |
|--------|--------|-----------|
| First Contentful Paint | < 1.2s | Hero text must appear almost instantly |
| Largest Contentful Paint | < 2.5s | Hero headline or device mockup |
| Cumulative Layout Shift | < 0.05 | No content jumping, ever |
| First Input Delay | < 50ms | CTA must respond instantly |
| Total Blocking Time | < 200ms | Smooth interaction |
| Bundle Size (JS, gzipped) | < 150KB | Initial load, above-fold only |
| Font Loading | Inter subset, swap display | Prevent FOIT |
| Image Strategy | WebP/AVIF, lazy load below fold | Device mockup and app icons |
| Animation Framerate | 60fps | No drops below 30fps on any animation |

### Image Loading Strategy

- **Hero device mockup:** Preloaded. Included in initial HTML or loaded with high priority.
- **App screenshots (carousel):** First image preloaded. Subsequent images lazy-loaded on demand.
- **App icons (Section 6):** Lazy-loaded with blur-up placeholder.
- **All other images:** Lazy-loaded with IntersectionObserver trigger at 200px before viewport entry.

### Font Loading Strategy

- Load Inter with `font-display: swap`
- Subset to Latin + Latin Extended (covers English and most European text)
- Load Arabic font separately, only when Arabic locale is active
- Preload the Inter 400 and 700 weights (most used)

---

## 14. Accessibility Checklist

### 14.1 Color and Contrast

| Pair | Contrast Ratio | WCAG Level |
|------|---------------|------------|
| `#FFFFFF` on `#0F1419` | 18.1:1 | AAA Pass |
| `#F4F4F2` on `#0F1419` | 16.8:1 | AAA Pass |
| `#9CA3AF` on `#0F1419` | 6.2:1 | AA Pass (Large text AAA) |
| `#C08460` on `#0F1419` | 5.1:1 | AA Pass |
| `#FFFFFF` on `#C08460` | 3.6:1 | AA Large Pass (used for button text on bronze) |
| `#F4F4F2` on `#1A2332` | 12.4:1 | AAA Pass |
| `#9CA3AF` on `#1A2332` | 4.8:1 | AA Pass |

**Action Required:** The `#FFFFFF` on `#C08460` ratio of 3.6:1 passes for large text (button text at 16px semibold qualifies) but does not pass AA for normal text. Ensure bronze-background elements only contain bold/semibold text at 16px or larger. Alternatively, darken the bronze to `#A67350` for a 4.6:1 ratio if smaller text must appear on bronze backgrounds.

### 14.2 Keyboard Navigation

- All interactive elements (buttons, links, cards) are focusable via Tab
- Focus order follows visual reading order (top-to-bottom, left-to-right)
- Focus indicators: 2px solid ring, offset by 2px. Ring color:
  - Default: `#C08460` bronze
  - On AI Tool cards: The card's respective accent color
- Skip-to-content link: Hidden until focused, positioned at the top of the page. Visible state: bronze background, white text, positioned as a banner across the top.
- Escape key closes any open modals/overlays
- Enter/Space activates buttons and card links

### 14.3 Screen Reader Support

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Each section has an `aria-labelledby` pointing to its heading
- Decorative elements (floating code snippets, gradient overlays) use `aria-hidden="true"`
- Counter animations: Use `aria-live="polite"` on the counter container so screen readers announce the final value after animation completes
- Device mockup carousel: `aria-label="Showcase of apps built by Aviniti"`, `aria-roledescription="carousel"`
- Store badges: `aria-label="Download SkinVerse on the App Store"` (specific per app)
- Image alt text: Descriptive for functional images, empty (`alt=""`) for decorative
- CTA buttons: Clear, action-oriented labels (no "Click here" or "Learn more" without context)

### 14.4 Touch Targets

- All buttons: minimum 48px height (exceeds 44px requirement)
- Footer links: minimum 44px tap area (achieved via padding)
- Store badges: minimum 44px height
- WhatsApp link: minimum 44px tap area
- Mobile navigation items: minimum 48px height
- Spacing between adjacent touch targets: minimum 8px

### 14.5 Motion and Vestibular

- `prefers-reduced-motion: reduce` disables all non-essential motion
- No auto-playing video
- Device mockup carousel: no rapid transitions (4s interval is comfortable)
- Parallax effects: none (explicitly avoided in this design)
- No flashing or strobing elements

### 14.6 Heading Hierarchy

```
<h1> We Build Intelligent Apps That Transform Your Business (Hero)
  <h2> Trust Indicators (visually hidden, for a11y)
  <h2> What We Build
  <h2> AI-Powered Tools to Get You Started
  <h2> Launch Faster with Ready-Made Solutions
  <h2> Apps We've Built - Live in Stores
  <h2> Why Companies Choose Us
  <h2> Real Results, Real Impact
  <h2> Ready to Build Something Great?
```

Only one `<h1>` on the page (the hero headline). All section titles are `<h2>`. Card titles within sections are `<h3>`.

---

## Appendix A: Section Background Rhythm

To prevent visual monotony across 10 sections, the background alternates subtly:

| Section | Background | Visual Effect |
|---------|-----------|---------------|
| 1. Hero | `#0F1419` + radial glow | Atmospheric warmth |
| 2. Trust | `#0F1419` | Continuous from hero |
| 3. Services | `#0F1419` | Standard |
| 4. AI Tools | `#0D1117` | Slightly darker, new zone |
| 5. Ready-Made | `#0F1419` | Return to base |
| 6. Live Apps | `#111820` | Subtle lift |
| 7. Why Choose | `#0F1419` | Return to base |
| 8. Case Studies | `#111820` | Subtle lift |
| 9. Final CTA | `#0F1419` + inner card `#1A2332` | Elevated CTA container |
| 10. Footer | `#0B0F14` | Darkest, page terminus |

This alternation creates a breathing rhythm. The visitor feels natural section breaks without jarring color changes or divider lines.

---

## Appendix B: Conversion Funnel Mapping

The homepage is a conversion funnel in itself. Each section has a role:

```
[HERO]
  |
  |-- Primary CTA --> Get AI Estimate (bottom-funnel)
  |-- Secondary CTA --> Ready-Made Solutions (mid-funnel)
  |
[TRUST INDICATORS]
  |
  Establishes credibility. No CTA.
  |
[SERVICES]
  |
  Establishes capability. No CTA (informational).
  |
[AI TOOLS SPOTLIGHT] *** CRITICAL ***
  |
  |-- Idea Lab --> Top-funnel capture
  |-- AI Analyzer --> Mid-funnel capture
  |-- Get Estimate --> Bottom-funnel capture
  |-- ROI Calculator --> Justification capture
  |
[READY-MADE SOLUTIONS]
  |
  |-- View All Solutions --> Browse + eventual capture
  |
[LIVE APPS]
  |
  Social proof. Reinforces trust. No direct CTA.
  |
[WHY CHOOSE US]
  |
  Reinforces differentiation. No direct CTA.
  |
[CASE STUDIES]
  |
  |-- Read Case Study --> Deeper engagement, eventual capture
  |
[FINAL CTA] *** CRITICAL ***
  |
  |-- Get AI Estimate --> Bottom-funnel capture
  |-- Book a Call --> Direct sales capture
  |-- WhatsApp --> MENA-preferred capture
  |
[FOOTER]
  |
  Navigation utility + AI Tools links (secondary capture)
```

The three critical conversion points (Hero, AI Tools, Final CTA) are positioned at the beginning, middle, and end of the page. A visitor who scrolls the full page encounters conversion opportunities three times, each more informed than the last.

---

## Appendix C: Implementation Notes

### C.1 Recommended Component File Structure

```
src/
  components/
    ui/
      Button.tsx
      Badge.tsx
      Heading.tsx
      Text.tsx
      TextLink.tsx
      Grid.tsx
    sections/
      Hero.tsx
      TrustIndicators.tsx
      ServicesOverview.tsx
      AIToolsSpotlight.tsx
      ReadyMadeSolutions.tsx
      LiveAppsShowcase.tsx
      WhyChooseUs.tsx
      CaseStudiesPreview.tsx
      FinalCTA.tsx
      Footer.tsx
    shared/
      SectionWrapper.tsx
      SectionHeader.tsx
      AnimatedCounter.tsx
      DeviceMockup.tsx
      FloatingSnippet.tsx
      ToolCard.tsx
      ServiceCard.tsx
      SolutionCard.tsx
      AppShowcaseCard.tsx
      DifferentiatorCard.tsx
      CaseStudyCard.tsx
      StoreBadge.tsx
      WhatsAppLink.tsx
      LanguageSwitcher.tsx
```

### C.2 Tailwind Configuration Tokens

```js
// tailwind.config.js (relevant extension)
{
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B0F14',
          800: '#0D1117',
          700: '#0F1419',
          600: '#111820',
        },
        slate: {
          800: '#1A2332',
          700: '#1E2940',
          600: '#243044',
          500: '#2A3650',
        },
        bronze: {
          DEFAULT: '#C08460',
          hover: '#A6714E',
          light: '#D4A583',
          dark: '#96634A',
        },
        offwhite: '#F4F4F2',
        muted: '#9CA3AF',
        tool: {
          orange: '#F59E0B',
          blue: '#3B82F6',
          green: '#10B981',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'badge': '8px',
        'icon': '20px',
      },
    },
  },
}
```

### C.3 Framer Motion Presets

```tsx
// animation-presets.ts

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export const cardHover = {
  whileHover: {
    y: -4,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};
```

---

## Appendix D: Design Review Checklist

Before marking this design as implementation-ready, verify:

- [ ] All 10 sections have defined layout, content, and responsive behavior
- [ ] The 3 priority sections (Hero, AI Tools, Final CTA) have emotional intent, animation choreography, conversion psychology, and visual flow documented
- [ ] All copy is final and reviewed
- [ ] All color pairs meet WCAG 2.2 AA contrast requirements
- [ ] All interactive elements have 44px+ touch targets
- [ ] Heading hierarchy is valid (single h1, sequential h2s)
- [ ] Keyboard navigation order is logical
- [ ] Screen reader landmarks are defined
- [ ] Reduced motion alternatives are specified
- [ ] Performance budget is defined and feasible
- [ ] Font loading strategy prevents FOIT
- [ ] Image loading strategy prevents CLS
- [ ] Component mapping is complete for all sections
- [ ] Tailwind configuration tokens are documented
- [ ] Framer Motion presets are documented
- [ ] Background rhythm creates visual variety without jarring transitions
- [ ] Conversion funnel is mapped from hero to footer
- [ ] RTL readiness is considered (left-right layouts reverse, but content structure holds)
- [ ] WhatsApp integration is included for MENA market

---

**End of Homepage Design Specification v1.0**

*This document is the definitive design authority for the Aviniti homepage. No implementation should deviate from these specifications without documented justification and design review approval.*
