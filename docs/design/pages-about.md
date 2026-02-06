# About Page -- Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Inter
**Theme:** Dark only
**Status:** Phase 2 Design (Implemented Post-Launch)

---

## Table of Contents

1. [Page Purpose and Strategy](#1-page-purpose-and-strategy)
2. [URL Structure and SEO](#2-url-structure-and-seo)
3. [Page Layout Overview](#3-page-layout-overview)
4. [Section Specifications](#4-section-specifications)
5. [Responsive Behavior](#5-responsive-behavior)
6. [Animation Specifications](#6-animation-specifications)
7. [Accessibility Requirements](#7-accessibility-requirements)
8. [RTL Considerations](#8-rtl-considerations)

---

## 1. Page Purpose and Strategy

### 1.1 Purpose

The About page establishes Aviniti's credibility, company story, and values without relying on a team section (per owner decision). It focuses on:
- **Company Origin Story:** Why Aviniti exists and what drives us
- **Core Values:** What we stand for and how we work
- **Jordan Advantage:** Why our location is a strategic benefit for clients
- **Working Methodology:** Our proven approach to delivery
- **Social Proof:** Quantifiable metrics that build trust

**Note:** This is a Phase 2 page designed now for consistency with Phase 1 brand identity. It will be implemented after the core lead generation features are live.

### 1.2 Target Audience

- **Prospective clients** researching Aviniti before booking a call
- **Decision-makers** evaluating vendor credibility and cultural fit
- **Potential partners** exploring collaboration opportunities
- **Investors/stakeholders** understanding company positioning
- **Job seekers** (secondary) learning about company culture

### 1.3 Conversion Goals

**Primary:** Build trust and credibility leading to contact/estimate form submissions
**Secondary:** Establish thought leadership in AI and app development
**Tertiary:** Reduce objections about offshore development through "Why Jordan" section

### 1.4 Page Differentiators

- **No generic team photos:** Owner decision to skip this section
- **Jordan-focused positioning:** Turn location into competitive advantage
- **Metrics-driven trust:** Let numbers speak louder than marketing copy
- **Values with substance:** Each value is tied to client outcomes, not abstract ideals

---

## 2. URL Structure and SEO

### 2.1 URLs

```
/en/about          (English)
/ar/about          (Arabic)
```

### 2.2 SEO Metadata

```html
<title>About Aviniti - AI & App Development from Jordan | Your Ideas, Our Reality</title>
<meta name="description" content="Aviniti is an AI and app development company based in Amman, Jordan. We help SMBs digitally transform with AI-powered apps, transparent pricing, and rapid delivery." />
<meta property="og:title" content="About Aviniti | AI & App Development Company" />
<meta property="og:description" content="Learn about Aviniti's mission, values, and why Jordan is our strategic advantage for delivering world-class AI and app development." />
<meta property="og:image" content="/og/about-aviniti.jpg" />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://aviniti.com/en/about" />
```

**JSON-LD Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aviniti",
  "description": "AI & App Development Company",
  "url": "https://aviniti.com",
  "logo": "https://aviniti.com/logo.png",
  "foundingDate": "2023",
  "foundingLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Amman",
      "addressCountry": "Jordan"
    }
  },
  "slogan": "Your Ideas, Our Reality",
  "areaServed": "MENA",
  "knowsAbout": ["AI Development", "Mobile App Development", "Web Development", "Cloud Solutions"]
}
```

---

## 3. Page Layout Overview

### 3.1 Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > About                                         |
+------------------------------------------------------------------+
|                                                                    |
|  HERO SECTION                                                      |
|                                                                    |
|  Aviniti                                                           |
|  Your Ideas, Our Reality                                           |
|                                                                    |
|  Building the future of AI-powered apps from Amman, Jordan         |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  OUR STORY                                                         |
|                                                                    |
|  [2-3 paragraphs about founding, vision, and journey]              |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  OUR VALUES                                                        |
|                                                                    |
|  +-------------+  +-------------+  +-------------+  +-------------+|
|  | [icon]      |  | [icon]      |  | [icon]      |  | [icon]      ||
|  | Innovation  |  | Quality     |  | Partnership |  | Transparency||
|  | [desc]      |  | [desc]      |  | [desc]      |  | [desc]      ||
|  +-------------+  +-------------+  +-------------+  +-------------+|
|                                                                    |
|  +-------------+                                                   |
|  | [icon]      |                                                   |
|  | Speed       |                                                   |
|  | [desc]      |                                                   |
|  +-------------+                                                   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  WHY JORDAN                                                        |
|                                                                    |
|  [Icon + Text blocks explaining strategic advantages]              |
|  * Tech Talent Hub                                                 |
|  * MENA Market Gateway                                             |
|  * Cost Efficiency                                                 |
|  * Time Zone Bridge                                                |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  OUR APPROACH                                                      |
|                                                                    |
|  [1] Discover  →  [2] Design  →  [3] Develop  →  [4] Deploy  →  [5] Support |
|                                                                    |
|  [Description under each phase]                                    |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  BY THE NUMBERS                                                    |
|                                                                    |
|  [Large animated counter stats]                                    |
|  50+        15+         98%         35 days                       |
|  Projects   Countries   Satisfaction Avg Timeline                 |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  FINAL CTA                                                         |
|                                                                    |
|  Let's Build Something Together                                    |
|  [Get Estimate]     [Book a Call]                                 |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

---

## 4. Section Specifications

### 4.1 Section 1: Hero

**Purpose:** Immediately establish company identity and mission in a memorable way.

**Layout:** Centered text, full-width background

| Element | Spec |
|---------|------|
| Background | `bg-navy` with subtle radial gradient: `radial-gradient(ellipse at 50% 30%, rgba(192,132,96,0.05) 0%, transparent 60%)` |
| Company Name | `text-display` (clamp 36-72px), White, font-weight 800 -- "Aviniti" |
| Tagline | `text-h2` (clamp 24-42px), Bronze-light `#D4A583`, font-weight 600 -- "Your Ideas, Our Reality" |
| Mission Statement | `text-lg`, Off-white `#F4F4F2`, max-width 640px, centered, mt-6 -- "Building the future of AI-powered apps from Amman, Jordan. We turn ambitious ideas into production-ready applications that scale." |
| Padding | `py-24 md:py-32 lg:py-40` |
| Text Alignment | `text-center` |

**Content:**
- **Company Name:** "Aviniti"
- **Tagline:** "Your Ideas, Our Reality"
- **Mission Statement:** "Building the future of AI-powered apps from Amman, Jordan. We turn ambitious ideas into production-ready applications that scale."

**Animation:** Fade in + translateY(20px to 0), staggered by element (name → tagline → mission), 600ms duration each with 200ms stagger delay.

---

### 4.2 Section 2: Our Story

**Purpose:** Humanize the company and explain the "why" behind Aviniti.

**Layout:** Centered narrow column (max-width 768px), prose styling

| Element | Spec |
|---------|------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "OUR STORY" |
| Headline | `text-h2 text-white mt-3` -- "From Vision to Reality" |
| Body Copy | `text-base text-off-white leading-relaxed`, prose formatting (p tags with `mt-4` spacing) |
| Background | `bg-slate-dark` (alternating section rhythm) |
| Padding | `py-12 md:py-20` |
| Container | `max-w-[768px] mx-auto px-4 sm:px-6` |

**Content (2-3 paragraphs):**

**Paragraph 1 - The Beginning:**
"Aviniti was founded in 2023 with a clear mission: to democratize access to world-class AI and app development for small and medium businesses. We saw too many companies paying enterprise prices for cookie-cutter solutions, or worse, abandoning their digital transformation dreams because the cost seemed insurmountable."

**Paragraph 2 - The Vision:**
"Based in Amman, Jordan, we're strategically positioned at the crossroads of Europe, Asia, and the Middle East. This gives us a unique advantage: access to top-tier technical talent, competitive pricing, and cultural fluency across MENA markets. We don't just build apps—we build bridges between ambitious ideas and market-ready products."

**Paragraph 3 - The Journey:**
"Since our founding, we've delivered 50+ applications across 15+ countries, powering everything from healthcare startups to e-commerce platforms. Our secret? We treat every project like it's our own. We're not an agency churning out billable hours—we're your technical co-founder, invested in your success from day one."

**Tone:** Authentic, confident, mission-driven. Avoid buzzwords and corporate speak.

---

### 4.3 Section 3: Our Values

**Purpose:** Communicate what Aviniti stands for in concrete, client-focused terms.

**Layout:** 4-column grid on desktop (responsive to 2-column on tablet, 1-column on mobile)

| Element | Spec |
|---------|------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "OUR VALUES" |
| Headline | `text-h2 text-white mt-3 mb-12` -- "What Drives Us" |
| Grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` |
| Value Card | No border/background, icon-centered design |
| Icon Container | `h-16 w-16 rounded-xl bg-bronze/10 flex items-center justify-center mx-auto` |
| Icon | `h-8 w-8 text-bronze` (Lucide React) |
| Value Name | `text-lg font-semibold text-white mt-4 text-center` |
| Description | `text-sm text-muted mt-2 text-center max-w-[240px] mx-auto` |
| Background | `bg-navy` |
| Padding | `py-12 md:py-20` |

**Values (5 total, display 4 in first row, 1 centered in second row on desktop):**

1. **Innovation** (Icon: `Lightbulb`)
   - "We don't follow trends, we create them. Every project is an opportunity to push boundaries with AI and emerging technologies."

2. **Quality** (Icon: `Award`)
   - "Good enough isn't good enough. We ship production-ready code that scales, with testing and QA baked into every sprint."

3. **Partnership** (Icon: `Handshake`)
   - "Your success is our success. We're not vendors—we're your technical co-founders, invested in outcomes, not just deliverables."

4. **Transparency** (Icon: `Eye`)
   - "No hidden fees, no scope creep surprises. Our AI estimator gives you upfront pricing, and we communicate progress every step of the way."

5. **Speed** (Icon: `Zap`)
   - "Time to market matters. Our ready-made accelerators and agile workflows get you live 60% faster than traditional development."

**Grid Layout:**
- Desktop: 4 values in first row, 1 value centered in second row
- Tablet: 2x2 grid + 1 centered below
- Mobile: Single column, all stacked

---

### 4.4 Section 4: Why Jordan

**Purpose:** Turn Aviniti's location into a competitive advantage and address any offshore development concerns proactively.

**Layout:** Two-column split (text left, icon blocks right) on desktop, stacked on mobile

| Element | Spec |
|---------|------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "WHY JORDAN" |
| Headline | `text-h2 text-white mt-3` -- "Strategic Location, Global Reach" |
| Intro Text | `text-base text-muted mt-4 max-w-[600px]` -- "Based in Amman, Jordan isn't a compromise—it's a strategic advantage. Here's why clients from San Francisco to Dubai choose to work with us." |
| Advantage Cards | `grid grid-cols-1 md:grid-cols-2 gap-6 mt-10` |
| Card | `bg-slate-blue border border-slate-blue-light rounded-lg p-6` |
| Icon | `h-10 w-10 text-bronze mb-4` |
| Card Title | `text-lg font-semibold text-white` |
| Card Description | `text-sm text-muted mt-2` |
| Background | `bg-slate-dark` |
| Padding | `py-12 md:py-20` |

**Advantages (4 cards):**

1. **Tech Talent Hub** (Icon: `GraduationCap`)
   - "Jordan ranks #1 in the Arab world for STEM education. We tap into a deep pool of engineers trained in AI, mobile, and cloud technologies."

2. **MENA Market Gateway** (Icon: `Globe`)
   - "Serving clients across the Middle East and North Africa? We understand the culture, language, and market nuances that make or break regional success."

3. **Cost Efficiency** (Icon: `DollarSign`)
   - "Same-quality development at 40-60% lower cost than US or EU agencies. No compromise on code quality or communication—just better economics."

4. **Time Zone Bridge** (Icon: `Clock`)
   - "GMT+2/+3 positions us perfectly for real-time collaboration with Europe, overlap with US East Coast, and full coverage of MENA working hours."

**Alternative Layout Option:** Use a horizontal timeline or "Why Choose Jordan" checklist if preferred. The card grid is the recommended default.

---

### 4.5 Section 5: Our Approach

**Purpose:** Demystify the development process and show clients exactly how we work.

**Layout:** Horizontal stepper (using design system Stepper component, Section 7.9) with phase descriptions below each step

| Element | Spec |
|---------|------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "OUR APPROACH" |
| Headline | `text-h2 text-white mt-3 mb-12` -- "How We Deliver" |
| Stepper | Horizontal stepper with 5 phases. Uses design system stepper (Section 7.9). All steps shown as "completed" style for visual consistency (not interactive). |
| Phase Card | Below each step: `text-center max-w-[200px]`. Phase name: `text-base font-semibold text-white mt-6`. Description: `text-sm text-muted mt-2` |
| Mobile Layout | On mobile (< 768px), stepper switches to vertical with phase cards as list items |
| Background | `bg-navy` |
| Padding | `py-12 md:py-20` |

**Phases (5 steps):**

1. **Discover** (Icon: `Search`)
   - "We start by understanding your business, users, and goals. No cookie-cutter solutions—every project begins with a discovery workshop."

2. **Design** (Icon: `PenTool`)
   - "Our designers craft intuitive interfaces and user flows. You'll see interactive prototypes before we write a single line of code."

3. **Develop** (Icon: `Code`)
   - "Agile sprints with weekly demos. You stay in the loop with progress updates, and we adapt to feedback in real-time."

4. **Deploy** (Icon: `Rocket`)
   - "We handle app store submissions, server deployments, and launch logistics. You go live with confidence and zero stress."

5. **Support** (Icon: `HeartHandshake`)
   - "Post-launch, we provide 3 months of bug-fix support and technical guidance. Then ongoing maintenance plans if you need us."

**Stepper Visual:**
- Connector lines between steps in bronze
- Circular step indicators with completed checkmark icons
- Phase number (1-5) inside each circle
- Bronze fill for all steps to show "this is our process" (not a progress indicator)

---

### 4.6 Section 6: By the Numbers

**Purpose:** Build credibility with quantifiable metrics that demonstrate scale and trust.

**Layout:** 4-column grid of large stat counters

| Element | Spec |
|---------|------|
| Section Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "BY THE NUMBERS" |
| Headline | `text-h2 text-white mt-3 mb-16` -- "Proven Track Record" |
| Grid | `grid grid-cols-2 md:grid-cols-4 gap-12` |
| Stat Number | `text-5xl font-extrabold text-white tabular-nums` with animated counter (counts up on scroll into view) |
| Stat Label | `text-sm font-medium text-muted mt-2 text-center` |
| Background | `bg-slate-dark` |
| Padding | `py-12 md:py-20` |

**Stats (4 metrics):**

1. **50+**
   - "Projects Delivered"

2. **15+**
   - "Countries Served"

3. **98%**
   - "Client Satisfaction"

4. **35 days**
   - "Average Timeline"

**Note:** These are placeholder numbers. Owner (Ali) will provide exact metrics based on actual project history.

**Animation:** Counter animation using Framer Motion or vanilla JS. Numbers count up from 0 to final value when scrolled into view. Easing: start fast, slow at end (ease-out-expo). Duration: 1200ms. Stagger: 100ms delay between each counter.

**Alternative Stats to Consider (if owner prefers different metrics):**
- "7+ Years Combined Team Experience"
- "10+ AI-Powered Apps Live"
- "24h Average Response Time"
- "$2M+ in Client Revenue Enabled"

---

### 4.7 Section 7: Final CTA

**Purpose:** Drive visitors to conversion after establishing trust and credibility.

**Layout:** Centered elevated card (same pattern as homepage Final CTA)

| Element | Spec |
|---------|------|
| Inner Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-10 md:p-16 text-center max-w-[900px] mx-auto` |
| Background Glow | `radial-gradient(ellipse at center, rgba(192,132,96,0.04) 0%, transparent 70%)` behind container |
| Headline | `text-h2 text-white` -- "Let's Build Something Together" |
| Subheadline | `text-lg text-muted mt-4 max-w-[500px] mx-auto` -- "Ready to turn your idea into reality? Get a free AI-powered estimate or book a call with our team." |
| Primary CTA | `Button variant="primary" size="lg"` -- "Get AI Estimate" |
| Secondary CTA | `Button variant="outline" size="lg"` -- "Book a Call" |
| Buttons Layout | `flex flex-col sm:flex-row items-center justify-center gap-3 mt-6` |
| WhatsApp Link | `text-muted text-sm mt-6` -- "Or message us on WhatsApp" with green WhatsApp icon |
| Background | `bg-navy` |
| Padding | `py-16 md:py-24` |

**CTAs lead to:**
- **Get AI Estimate:** `/en/get-estimate`
- **Book a Call:** Calendly embed or `/en/contact`
- **WhatsApp:** WhatsApp deep link with pre-filled message

---

## 5. Responsive Behavior

### 5.1 Desktop (1024px+)

- Hero: Centered text, generous vertical padding (160px top, 160px bottom)
- Story: Centered narrow prose column (768px max-width)
- Values: 4-column grid for first 4 values, 1 centered below
- Why Jordan: 2-column grid of advantage cards
- Approach: Horizontal stepper with 5 phases
- Numbers: 4-column grid of counters
- CTA: Horizontal button layout

### 5.2 Tablet (768px - 1023px)

- Hero: Centered text, reduced padding (128px top, 128px bottom)
- Story: Narrow prose column (same as desktop)
- Values: 2x2 grid for first 4 values, 1 centered below
- Why Jordan: 2-column grid (same as desktop)
- Approach: Horizontal stepper (compact phase descriptions)
- Numbers: 4-column grid (slightly tighter spacing)
- CTA: Horizontal button layout

### 5.3 Mobile (< 768px)

- Hero: Centered text, compact padding (96px top, 96px bottom)
- Story: Full-width prose with side padding
- Values: Single column, all values stacked
- Why Jordan: Single column, cards stacked
- Approach: Vertical stepper with phase cards as list items
- Numbers: 2-column grid (2x2)
- CTA: Buttons stacked vertically, full width

---

## 6. Animation Specifications

### 6.1 Scroll-Triggered Animations

All animations trigger when the element crosses 20% of the viewport (0.2 threshold for IntersectionObserver).

| Element | Animation | Delay | Duration | Easing |
|---------|-----------|-------|----------|--------|
| Hero company name | Fade in + translateY(20px) | 0ms | 600ms | ease-out-expo |
| Hero tagline | Fade in + translateY(15px) | 150ms | 600ms | ease-out-expo |
| Hero mission | Fade in + translateY(10px) | 300ms | 500ms | ease-out-expo |
| Section labels | Fade in + translateY(10px) | 0ms | 400ms | ease-out |
| Section headlines | Fade in + translateY(15px) | 100ms | 500ms | ease-out-expo |
| Story paragraphs | Fade in + translateY(10px), stagger 100ms | Scroll | 400ms | ease-out |
| Value cards | Fade in + translateY(20px), stagger 80ms | Scroll | 500ms | ease-out-expo |
| Jordan advantage cards | Fade in + translateY(20px), stagger 100ms | Scroll | 500ms | ease-out-expo |
| Approach stepper steps | Fade in + scale(0.95 to 1), stagger 120ms | Scroll | 500ms | ease-out-expo |
| Stat counters | Number count-up animation | Scroll | 1200ms | ease-out-expo |
| Final CTA container | Scale(0.97 to 1) + opacity | Scroll | 600ms | ease-out-expo |

### 6.2 Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- Remove all translateY, scale, and transform animations
- Retain opacity transitions only (max 200ms duration)
- Disable counter animations (show final number immediately)
- Disable stagger delays

---

## 7. Accessibility Requirements

### 7.1 Semantic HTML

- Page structure: `<main>` wraps all content below navbar
- Breadcrumbs: `<nav aria-label="Breadcrumb">` with `aria-current="page"` on "About"
- Sections: Each section uses `<section>` with unique `id` for skip-links
- Headings: Proper hierarchy (H1 for "Aviniti" in hero, H2 for section headings, H3 for value/card titles)
- Approach stepper: `role="list"` with `role="listitem"` for each phase
- Stats: Use `<dl>` (description list) for stat pairs: `<dt>` for number, `<dd>` for label

### 7.2 ARIA Labels

- Section labels: `aria-label` on each `<section>` describing its purpose (e.g., `aria-label="Company story"`)
- Icons: All decorative icons: `aria-hidden="true"`
- Stat counters: `aria-live="polite"` region so screen readers announce the final count after animation
- CTAs: Descriptive button text (avoid generic "Click here")

### 7.3 Keyboard Navigation

- All interactive elements (buttons, links) reachable via Tab
- Logical tab order: top to bottom, following visual hierarchy
- Focus visible: `focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy`
- Skip to content link at top of page (hidden until focused): targets `#main-content`

### 7.4 Color Contrast

All text meets WCAG AA contrast ratios:
- White headings on navy: 17.4:1 (AAA)
- Off-white body text on navy: 16.1:1 (AAA)
- Muted text on navy: 7.3:1 (AA)
- Bronze accents: 5.8:1 on navy (AA)

### 7.5 Alternative Text

- All images require descriptive `alt` text (no placeholder images on this page)
- Icons: `aria-hidden="true"` since they are decorative and meaning is conveyed by adjacent text

---

## 8. RTL Considerations

### 8.1 Text Direction

When `dir="rtl"` is active (Arabic locale):
- All text aligns right instead of left
- Centered text remains centered
- Section labels, headings, body copy all flow right-to-left

### 8.2 Layout Adjustments

- Hero: No change (centered)
- Story: No change (centered prose column)
- Values: Grid order remains the same (CSS Grid handles RTL automatically)
- Why Jordan: Cards remain in same visual order
- Approach: Stepper flows right-to-left (Phase 5 → Phase 1 visual order)
- Numbers: Grid order remains the same
- CTA: Buttons remain centered

### 8.3 Icon and Visual Elements

- Breadcrumb separators: Chevrons flip direction (left-pointing instead of right-pointing)
- Approach stepper arrows: Flip direction (left-pointing connectors)
- All icons: Remain in same position (CSS `transform: scaleX(-1)` NOT used unless icon is directional like arrows)

### 8.4 Typography

Apply Arabic typography overrides from design-system.md Section 2.8:
- Letter-spacing: Reset to 0 (negative tracking breaks Arabic ligatures)
- Line-height: Multiply by 1.08 for all text
- Font-weight: Use 500 where Latin uses 400 for body text
- Font-family: Apply `--font-arabic` stack

### 8.5 Content Translation

All section labels, headings, body copy, value descriptions, and CTAs must be translated to Arabic. Owner will provide translations or approve machine translations.

**Cultural Notes:**
- "Jordan" positioning is even more relevant for Arabic-speaking MENA clients
- Emphasize WhatsApp CTA in Arabic version (higher usage in region)
- Use formal Arabic for professional tone (not colloquial dialects)

---

## 9. Content Specifications

### 9.1 Content Approval

All content on this page requires final approval from owner (Ali) before implementation. This spec provides placeholder copy that follows brand voice and positioning.

### 9.2 Owner Assets Needed

- **Company founding date:** For JSON-LD structured data (currently placeholder "2023")
- **Exact metrics:** For "By the Numbers" section (currently using "50+ projects, 15+ countries, 98% satisfaction, 35 days avg timeline")
- **Company photos (optional):** Office, workspace, or Jordan cityscape images for visual interest (not required, dark abstract visuals can replace)
- **Arabic translations:** For all text content on this page

### 9.3 Tone and Voice

- **Authentic and confident:** Not boastful, but proud of our work
- **Client-focused:** Benefits and outcomes, not internal processes
- **Clear and jargon-free:** Technical expertise without buzzwords
- **Warm but professional:** Approachable without being casual

### 9.4 SEO Keywords

Target keywords for organic search:
- "app development company Jordan"
- "AI development Amman"
- "offshore development Middle East"
- "MENA app developers"
- "Jordan tech companies"

Naturally incorporate these into body copy without keyword stuffing.

---

## 10. Implementation Notes

### 10.1 Phase 2 Timing

This page is designed for Phase 2 implementation (post-launch of Phase 1 lead generation features). Priority order:
1. Phase 1: Homepage, AI Tools, Solutions, Contact, FAQ (must-have for launch)
2. Phase 2: About, Blog enhancements, Individual solution detail pages

### 10.2 Component Reuse

Leverage existing design system components:
- Buttons (Section 7.1)
- Cards (Section 7.2)
- Stepper (Section 7.9)
- Typography tokens (Section 2)
- Spacing system (Section 3)
- Animation patterns (Section 9)

### 10.3 Performance Considerations

- Lazy load images (if any) below the fold
- Defer counter animations until scroll into view
- Use `next/image` for all visuals with proper sizing
- Inline critical CSS for hero section
- Target Lighthouse score > 90 (same as all pages)

---

**End of About Page Specification**
