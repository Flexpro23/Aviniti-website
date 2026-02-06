# Ready-Made Solutions -- Page Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Inter
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Solutions Catalog Page](#1-solutions-catalog-page)
2. [Individual Solution Detail Pages](#2-individual-solution-detail-pages)
3. [Solution Data Reference](#3-solution-data-reference)

---

## 1. Solutions Catalog Page

### 1.1 Purpose and Conversion Goal

The Solutions Catalog is the primary browse-and-compare page for Aviniti's seven productized offerings. The conversion goal is to move visitors from browsing into either (a) clicking through to a specific solution detail page, or (b) initiating contact/estimate flow directly from a solution card.

**User mindset entering this page:** "I want something pre-built. Show me what you have and what it costs." These visitors are comparison shoppers who value transparency. They want to see pricing, timelines, and feature highlights at a glance before committing to reading a full detail page.

**Primary KPI:** Click-through to individual solution detail pages.
**Secondary KPI:** Direct "Get This Solution" CTA clicks from the catalog grid.

### 1.2 URL Structure

```
/en/solutions          (English)
/ar/solutions          (Arabic)
```

### 1.3 SEO Metadata

```html
<title>Ready-Made Solutions - Launch Faster | Aviniti</title>
<meta name="description" content="Pre-built, customizable apps starting from $8,000. Delivery apps, kindergarten management, hypermarket systems, and more. Deploy in 35 days." />
<meta property="og:title" content="Ready-Made App Solutions | Aviniti" />
<meta property="og:description" content="Launch faster with pre-built apps. Transparent pricing, rapid deployment." />
<meta property="og:image" content="/og/solutions-catalog.jpg" />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://aviniti.com/en/solutions" />
```

**JSON-LD Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Aviniti Ready-Made Solutions",
  "description": "Pre-built app solutions for rapid deployment",
  "numberOfItems": 7,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "Delivery App System",
        "description": "Complete delivery management platform",
        "offers": {
          "@type": "Offer",
          "price": "10000",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    }
  ]
}
```

### 1.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Solutions                                     |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|           Ready-Made Solutions                                     |
|           Launch Faster, Spend Less                                |
|                                                                    |
|    Pre-built, customizable apps. Deploy in weeks, not months.      |
|    Starting from $8,000 with delivery in as few as 35 days.        |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  [All]  [Delivery]  [Management]  [E-Commerce]  [Health/AI]       |
|  -----                                                             |
+------------------------------------------------------------------+
|                                                                    |
|  +----------+  +----------+  +----------+                          |
|  | [icon]   |  | [icon]   |  | [icon]   |                          |
|  |          |  |          |  |          |                          |
|  | Delivery |  | Kinder-  |  | Hyper-   |                          |
|  | App      |  | garten   |  | market   |                          |
|  |          |  |          |  |          |                          |
|  | Complete |  | Nursery  |  | Full     |                          |
|  | delivery |  | manage-  |  | retail   |                          |
|  | platform |  | ment     |  | system   |                          |
|  |          |  |          |  |          |                          |
|  | $10,000  |  | $8,000   |  | $15,000  |                          |
|  | 35 days  |  | 35 days  |  | 35 days  |                          |
|  |          |  |          |  |          |                          |
|  | [Learn   |  | [Learn   |  | [Learn   |                          |
|  |  More]   |  |  More]   |  |  More]   |                          |
|  +----------+  +----------+  +----------+                          |
|                                                                    |
|  +----------+  +----------+  +----------+  +----------+            |
|  | [icon]   |  | [icon]   |  | [icon]   |  | [icon]   |            |
|  |          |  |          |  |          |  |          |            |
|  | Office   |  | Gym &    |  | Airbnb   |  | Hair     |            |
|  | Suite    |  | Fitness  |  | Rental   |  | Transplnt|            |
|  |          |  |          |  |          |  | AI       |            |
|  | $8,000   |  | $25,000  |  | $15,000  |  | $18,000  |            |
|  | 35 days  |  | 60 days  |  | 35 days  |  | 35 days  |            |
|  |          |  |          |  |          |  |          |            |
|  | [Learn   |  | [Learn   |  | [Learn   |  | [Learn   |            |
|  |  More]   |  |  More]   |  |  More]   |  |  More]   |            |
|  +----------+  +----------+  +----------+  +----------+            |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|         Not sure which solution fits?                              |
|      [Get AI Estimate]     [Talk to Us]                            |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 1.5 Content Hierarchy

**1. Hero Section**

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "READY-MADE SOLUTIONS" |
| Headline | `text-h1` (clamp 30-60px), White, font-weight 700 -- "Ready-Made Solutions" |
| Subheadline | `text-h3` (clamp 20-30px), Bronze-light `#D4A583`, font-weight 600 -- "Launch Faster, Spend Less" |
| Description | `text-lg`, Off-white `#F4F4F2`, max-width 640px, centered -- "Pre-built, customizable apps. Deploy in weeks, not months. Starting from $8,000 with delivery in as few as 35 days." |
| Background | `bg-navy` with subtle radial gradient: `radial-gradient(ellipse at 50% 30%, rgba(192,132,96,0.04) 0%, transparent 60%)` |
| Padding | `py-24 lg:py-32` (accounts for navbar offset at top) |

**2. Filter Tabs**

Horizontal tab bar using the design system's Horizontal Tabs component (Section 7.7 of design-system.md).

Categories:
- **All** (default active)
- **Delivery & Logistics** -- filters to: Delivery App
- **Management** -- filters to: Kindergarten, Office Suite, Gym
- **E-Commerce & Rental** -- filters to: Hypermarket, Airbnb
- **Health & AI** -- filters to: Hair Transplant AI

| Element | Spec |
|---------|------|
| Container | `flex items-center gap-1 border-b border-slate-blue-light` within `max-w-[1320px]` container |
| Inactive tab | `px-4 py-2.5 text-sm font-medium text-muted border-b-2 border-transparent hover:text-off-white` |
| Active tab | `text-bronze border-b-2 border-bronze` |
| Count badge | `ml-2 bg-bronze/15 text-bronze-light text-xs px-1.5 py-0.5 rounded-full` |
| Sticky behavior | On mobile, tabs become horizontally scrollable (overflow-x-auto, hide scrollbar) |

**3. Solutions Grid**

| Element | Spec |
|---------|------|
| Grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` |
| Container | `max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20` |
| Filter animation | Cards filter with Framer Motion `AnimatePresence` + `layout` prop for smooth reflow |

**4. Solution Card (Repeated Component)**

Each card follows the Service/Solution Card pattern from the design system, enhanced with pricing.

```
+------------------------------------------+
|                                          |
|  [48x48 icon in bronze/10 bg]           |
|                                          |
|  Solution Name                           |
|  text-lg font-semibold text-white        |
|                                          |
|  Brief one-line description              |
|  text-sm text-muted                      |
|                                          |
|  ----------------------------------------|
|                                          |
|  Starting from                           |
|  $10,000            [35 days badge]      |
|  text-2xl bronze    success pill         |
|                                          |
|  ----------------------------------------|
|                                          |
|  Key features:                           |
|  * Feature 1    * Feature 2             |
|  * Feature 3    * Feature 4             |
|  text-xs text-muted                      |
|                                          |
|  [Learn More ->]                         |
|  text-bronze text-sm font-medium         |
|                                          |
+------------------------------------------+
```

Card component token mapping:

| Property | Value |
|----------|-------|
| Background | `bg-slate-blue` (`#1A2332`) |
| Border | `border border-slate-blue-light` (`#243044`) |
| Radius | `rounded-lg` (12px) |
| Padding | `p-6` (24px) |
| Shadow | `shadow-md` |
| Hover | `shadow-lg hover:-translate-y-1 hover:border-slate-blue-light/80` |
| Transition | `transition-all duration-300` |
| Icon container | `h-12 w-12 rounded-lg bg-bronze/10 flex items-center justify-center` |
| Icon | `h-6 w-6 text-bronze` (Lucide icon) |
| Title | `text-lg font-semibold text-white mt-4` |
| Description | `text-sm text-muted mt-2 line-clamp-2` |
| Divider | `h-px bg-slate-blue-light my-4` |
| Price label | `text-xs text-muted` -- "Starting from" |
| Price value | `text-2xl font-bold text-bronze` -- "$10,000" |
| Timeline badge | `inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-dark text-success` -- "35 days" |
| Features list | `grid grid-cols-2 gap-1 mt-3`, each: `text-xs text-muted flex items-center gap-1` with a check icon `h-3 w-3 text-bronze-muted` |
| CTA link | `inline-flex items-center gap-1.5 text-bronze text-sm font-medium mt-4 group-hover:gap-2.5 transition-all duration-200` |

**5. Bottom CTA Section**

Centered banner following the Final CTA pattern from the homepage.

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-8 md:p-12 text-center max-w-[800px] mx-auto` |
| Headline | `text-h3 text-white` -- "Not Sure Which Solution Fits?" |
| Description | `text-base text-muted mt-3` -- "Our AI can analyze your needs and recommend the perfect starting point." |
| Primary CTA | `Button variant="primary" size="lg"` -- "Get AI Estimate" |
| Secondary CTA | `Button variant="outline" size="lg"` -- "Talk to Us" |
| Buttons layout | `flex flex-col sm:flex-row items-center justify-center gap-3 mt-6` |

### 1.6 Responsive Behavior

**Desktop (1024px+):**
- Hero: centered text, generous padding (128px top, 80px bottom)
- Filter tabs: all visible in single row
- Grid: 3 or 4 columns depending on viewport
- Bottom CTA: horizontal button layout

**Tablet (768px - 1023px):**
- Hero: centered text, reduced padding (96px top, 64px bottom)
- Filter tabs: horizontally scrollable if needed
- Grid: 2 columns
- Bottom CTA: horizontal button layout

**Mobile (< 768px):**
- Hero: centered text, compact padding (80px top, 48px bottom)
- Filter tabs: horizontal scroll with snap, gradient fade on edges to indicate scrollability
- Grid: single column, full-width cards
- Bottom CTA: stacked buttons, full width
- Card padding reduces to `p-4`

### 1.7 Animation Specifications

| Element | Animation | Trigger | Duration | Easing |
|---------|-----------|---------|----------|--------|
| Hero section label | Fade in + translateY(10px to 0) | Page load | 400ms | ease-out |
| Hero headline | Fade in + translateY(20px to 0) | Page load + 100ms | 500ms | ease-out-expo |
| Hero subheadline | Fade in + translateY(15px to 0) | Page load + 250ms | 500ms | ease-out-expo |
| Hero description | Fade in + translateY(10px to 0) | Page load + 400ms | 400ms | ease-out |
| Filter tabs | Fade in | Page load + 500ms | 300ms | ease-out |
| Solution cards | Fade in + translateY(20px to 0), 80ms stagger | Scroll trigger (0.2 threshold) | 500ms each | ease-out-expo |
| Filter transition | `AnimatePresence` with `layout` | Tab click | 300ms | ease-in-out |
| Bottom CTA | Scale(0.97 to 1) + opacity | Scroll trigger (0.3 threshold) | 600ms | ease-out-expo |

**Reduced motion:** Remove translateY and scale. Retain 100ms opacity transitions only.

### 1.8 Accessibility Requirements

- `<main>` landmark wraps all page content below navbar
- Breadcrumbs: `<nav aria-label="Breadcrumb">` with `aria-current="page"` on current item
- Filter tabs: `role="tablist"` with `role="tab"` on each tab, `aria-selected="true"` on active
- Solutions grid: `role="tabpanel"` associated with active tab via `aria-labelledby`
- Each card: `<article>` element with `aria-label` containing solution name and price
- Card "Learn More" link: `aria-label="Learn more about Delivery App System"` (descriptive)
- Price: `aria-label="Starting from ten thousand US dollars"` for screen readers
- Timeline badge: `aria-label="Estimated delivery in 35 days"`
- Focus order: Breadcrumbs > Filter tabs > Cards (left-to-right, top-to-bottom) > Bottom CTA
- Focus visible: `focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy`
- Skip to content link targets `#solutions-grid`
- All icons: `aria-hidden="true"` (decorative)

### 1.9 RTL Considerations

- Text alignment flips from left to right
- Filter tabs scroll direction remains natural (OS handles this)
- Card internal layout: icon stays top, text flows right-to-left
- "Learn More" arrow icon flips to left-pointing arrow
- Breadcrumb chevron separators flip direction
- Grid does not change order (CSS grid handles RTL flow automatically with `dir="rtl"`)
- Price formatting: In Arabic, consider "$10,000" or the localized equivalent
- Timeline badge: "35 days" becomes Arabic translation, text direction handled by `dir`

---

## 2. Individual Solution Detail Pages

### 2.1 Purpose and Conversion Goal

Each solution detail page is the deep-dive for a specific ready-made product. The visitor has already expressed interest by clicking through from the catalog. The goal is to provide enough information to convert them into a lead.

**User mindset:** "This looks promising. Tell me everything -- features, pricing, timeline, and what I get." They need confidence that this solution matches their needs.

**Primary KPI:** "Get This Solution" CTA click (leads to contact/estimate form).
**Secondary KPI:** WhatsApp inquiry clicks, related case study views.

### 2.2 URL Structure

```
/en/solutions/delivery-app        (English)
/ar/solutions/delivery-app        (Arabic)
/en/solutions/kindergarten
/en/solutions/hypermarket
/en/solutions/office-suite
/en/solutions/gym-fitness
/en/solutions/airbnb-rental
/en/solutions/hair-transplant-ai
```

### 2.3 SEO Metadata (Example: Delivery App)

```html
<title>Delivery App System - Starting from $10,000 | Aviniti</title>
<meta name="description" content="Complete delivery management app with driver tracking, order management, and customer apps. Starting from $10,000, delivered in 35 days. Fully customizable." />
<meta property="og:title" content="Delivery App System | Aviniti Ready-Made Solutions" />
<meta property="og:description" content="Launch your delivery business in 35 days with our pre-built delivery app system." />
<meta property="og:image" content="/og/solution-delivery.jpg" />
<link rel="canonical" href="https://aviniti.com/en/solutions/delivery-app" />
```

**JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Delivery App System",
  "description": "Complete delivery management platform with customer app, driver app, and admin dashboard",
  "brand": { "@type": "Brand", "name": "Aviniti" },
  "offers": {
    "@type": "Offer",
    "price": "10000",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "deliveryLeadTime": { "@type": "QuantitativeValue", "value": 35, "unitCode": "DAY" }
  }
}
```

### 2.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Solutions > Delivery App                      |
+------------------------------------------------------------------+
|                                                                    |
|  SOLUTION DETAIL HERO                                              |
|                                                                    |
|  +---------------------------+  +-----------------------------+   |
|  |                           |  |                             |   |
|  |  [DELIVERY & LOGISTICS]   |  |    +-------------------+    |   |
|  |   badge                   |  |    |                   |    |   |
|  |                           |  |    |   Solution        |    |   |
|  |  Delivery App             |  |    |   Mockup /        |    |   |
|  |  System                   |  |    |   Screenshots     |    |   |
|  |                           |  |    |                   |    |   |
|  |  Complete delivery        |  |    +-------------------+    |   |
|  |  management platform      |  |                             |   |
|  |  with real-time tracking  |  |                             |   |
|  |                           |  |                             |   |
|  |  $10,000 | 35 days        |  |                             |   |
|  |                           |  |                             |   |
|  |  [Get This Solution]      |  |                             |   |
|  |  [Customize & Quote]      |  |                             |   |
|  |                           |  |                             |   |
|  +---------------------------+  +-----------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  WHAT'S INCLUDED                                                   |
|                                                                    |
|  +--------+  +--------+  +--------+  +--------+                   |
|  | icon   |  | icon   |  | icon   |  | icon   |                   |
|  | Customer|  | Driver |  | Admin  |  | Real-  |                   |
|  | App    |  | App    |  | Panel  |  | time   |                   |
|  |        |  |        |  |        |  | Track  |                   |
|  +--------+  +--------+  +--------+  +--------+                   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  KEY FEATURES (detailed list)                                      |
|                                                                    |
|  +---------------------------+  +-----------------------------+   |
|  | * Order management       |  | * Push notifications         |   |
|  | * Real-time GPS tracking |  | * Payment integration        |   |
|  | * Route optimization     |  | * Rating & reviews           |   |
|  | * Multi-vendor support   |  | * Analytics dashboard        |   |
|  | * Promo codes & offers   |  | * Multi-language support     |   |
|  +---------------------------+  +-----------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  TECH STACK                                                        |
|                                                                    |
|  [React Native]  [Node.js]  [Firebase]  [Google Maps]             |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  PRICING BREAKDOWN                                                 |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |  Base Package              $10,000    35 days                | |
|  |  ------------------------------------------------           | |
|  |  Includes:                                                   | |
|  |  * Customer mobile app (iOS + Android)                       | |
|  |  * Driver mobile app (iOS + Android)                         | |
|  |  * Admin web dashboard                                       | |
|  |  * Backend API & database                                    | |
|  |  * 3 months of bug-fix support                               | |
|  |                                                              | |
|  |  ------------------------------------------------           | |
|  |  Optional Add-ons:                                           | |
|  |  * AI route optimization        +$3,000   +10 days          | |
|  |  * Multi-vendor marketplace     +$5,000   +15 days          | |
|  |  * Advanced analytics           +$2,000   +7 days           | |
|  |  * Custom branding package      +$1,500   +5 days           | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  TIMELINE                                                          |
|                                                                    |
|  [Week 1-2]---[Week 3-4]---[Week 5]---[Week 6-7]---[Launch]      |
|   Discovery    Design       Dev         Testing      Deploy       |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  RELATED CASE STUDY (if available)                                 |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | LOGISTICS                                                    | |
|  | "Cut Delivery Costs by 25% with Route AI"                   | |
|  | 25% cost reduction                                           | |
|  | [Read Case Study ->]                                         | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  FINAL CTA                                                         |
|                                                                    |
|  Ready to Launch Your Delivery Platform?                           |
|  [Get This Solution]    [Customize & Quote]                        |
|  Or message us on WhatsApp                                         |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 2.5 Section-by-Section Specification

#### Section A: Solution Hero

**Layout:** Two columns on desktop (55% / 45%), single stacked column on mobile.

| Element | Spec |
|---------|------|
| Category badge | `inline-flex px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-bronze/15 text-bronze-light` -- e.g., "Delivery & Logistics" |
| Solution name | `text-display` (clamp 36-72px), White, font-weight 800 |
| Tagline | `text-lg text-muted mt-4` -- e.g., "Complete delivery management platform with real-time tracking and multi-vendor support." |
| Price display | `flex items-center gap-4 mt-6`. Price: `text-3xl font-bold text-bronze` -- "$10,000". Separator: `h-6 w-px bg-slate-blue-light`. Timeline: `inline-flex items-center gap-2 text-success text-lg font-semibold` with clock icon -- "35 days" |
| Primary CTA | `Button variant="primary" size="lg"` -- "Get This Solution" |
| Secondary CTA | `Button variant="outline" size="lg"` -- "Customize & Get Quote" |
| Button layout | `flex flex-col sm:flex-row gap-3 mt-8` |
| Right column | Solution mockup image/illustration. On desktop: 400-500px wide, centered vertically. Uses `next/image` with priority loading. Placeholder: gradient background with solution icon centered. |
| Background | `bg-navy` with `radial-gradient(ellipse at 70% 40%, rgba(192,132,96,0.05) 0%, transparent 50%)` |
| Padding | `py-16 md:py-24 lg:py-32` |

#### Section B: What's Included

**Layout:** Centered heading + 4-column icon grid.

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "WHAT'S INCLUDED" |
| Headline | `text-h2 text-white mt-3` -- "Everything You Need to Launch" |
| Grid | `grid grid-cols-2 md:grid-cols-4 gap-6 mt-12` |
| Item | Center-aligned. Icon container: `h-16 w-16 rounded-xl bg-bronze/10 flex items-center justify-center mx-auto`. Icon: `h-8 w-8 text-bronze`. Title: `text-base font-semibold text-white mt-4`. Description: `text-sm text-muted mt-2 max-w-[200px] mx-auto` |
| Background | `bg-slate-dark` (`#0D1117`) for alternating rhythm |
| Padding | `py-12 md:py-20` |

#### Section C: Key Features

**Layout:** Two-column checklist.

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "KEY FEATURES" |
| Headline | `text-h2 text-white mt-3` -- "Built for Scale, Designed for Users" |
| Feature grid | `grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-10` |
| Feature item | `flex items-start gap-3`. Check icon: `h-5 w-5 text-bronze mt-0.5 flex-shrink-0`. Text: `text-base text-off-white` |
| Background | `bg-navy` |
| Padding | `py-12 md:py-20` |

#### Section D: Tech Stack

**Layout:** Horizontal row of tech badges.

| Element | Spec |
|---------|------|
| Label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "TECH STACK" |
| Badge row | `flex flex-wrap items-center gap-3 mt-6` |
| Badge | Design system Tech Stack Badge: `px-3 py-1.5 rounded-lg bg-slate-dark border border-slate-blue-light text-sm font-mono text-muted` |
| Background | `bg-navy` (continues from features, separated by gradient divider) |

#### Section E: Pricing Breakdown

**Layout:** Featured card with structured content.

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "PRICING" |
| Headline | `text-h2 text-white mt-3` -- "Transparent Pricing" |
| Card | Featured Card style: `bg-slate-blue border border-bronze/30 border-t-2 border-t-bronze rounded-xl p-8 md:p-10 mt-10 shadow-lg` |
| Base package header | `flex justify-between items-center`. Left: `text-h3 text-white` -- "Base Package". Right: `text-2xl font-bold text-bronze` -- "$10,000" + `text-sm text-success ml-2` -- "35 days" |
| Includes list | `mt-6 space-y-3`. Each: `flex items-start gap-3`. Check icon: `h-5 w-5 text-success flex-shrink-0`. Text: `text-base text-off-white` |
| Divider | `h-px bg-slate-blue-light my-8` |
| Add-ons header | `text-h4 text-white` -- "Optional Add-ons" |
| Add-on item | `flex items-center justify-between py-3 border-b border-slate-blue-light/50`. Left: `text-base text-off-white`. Right: `flex items-center gap-4`. Price: `text-base font-semibold text-bronze`. Timeline: `text-sm text-muted` |
| Background | `bg-slate-dark` |
| Padding | `py-12 md:py-20` |

#### Section F: Timeline

**Layout:** Horizontal stepper using the design system's Stepper component (Section 7.9).

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "TIMELINE" |
| Headline | `text-h2 text-white mt-3` -- "From Kickoff to Launch" |
| Stepper | Horizontal stepper with 5 phases. Uses design system stepper tokens. All steps shown as "upcoming" style (not interactive, purely informational). |
| Phase labels | Below each step circle: phase name in `text-xs text-off-white mt-2`, duration in `text-xs text-muted` |
| Mobile | On mobile (< 640px), stepper switches to vertical layout with connector lines running down the left side |
| Background | `bg-navy` |
| Padding | `py-12 md:py-20` |

Timeline phases (example for Delivery App):
1. Discovery & Planning -- Week 1-2
2. UI/UX Design -- Week 2-3
3. Development -- Week 3-6
4. Testing & QA -- Week 6-7
5. Launch & Deployment -- Week 7

#### Section G: Related Case Study

Conditional section -- only renders if a related case study exists.

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "SUCCESS STORY" |
| Card | Uses the Case Study Card pattern from design system (Section 7.2). Full-width variant within a `max-w-[800px]` centered container. |
| Background | `bg-slate-dark` |
| Padding | `py-12 md:py-20` |

#### Section H: Final CTA

Follows the homepage Final CTA pattern exactly: elevated inner container with centered content.

| Element | Spec |
|---------|------|
| Inner container | `bg-slate-blue border border-slate-blue-light rounded-xl p-10 md:p-16 text-center max-w-[900px] mx-auto` |
| Background glow | `radial-gradient(ellipse at center, rgba(192,132,96,0.04) 0%, transparent 70%)` |
| Headline | `text-h2 text-white` -- "Ready to Launch Your [Solution Name]?" |
| Subheadline | `text-lg text-muted mt-4 max-w-[500px] mx-auto` -- "Get started in minutes. Our team will have your app ready in [timeline]." |
| Primary CTA | `Button variant="primary" size="lg"` -- "Get This Solution" |
| Secondary CTA | `Button variant="outline" size="lg"` -- "Customize & Get Quote" |
| WhatsApp link | `text-muted text-sm mt-6` -- "Or message us on WhatsApp" with green WhatsApp icon |
| Background | `bg-navy` |
| Padding | `py-16 md:py-24` |

### 2.6 Responsive Behavior

**Desktop (1024px+):**
- Hero: 55/45 split columns
- What's Included: 4-column grid
- Features: 2-column checklist
- Pricing: full-width card with generous padding
- Timeline: horizontal stepper

**Tablet (768px - 1023px):**
- Hero: 50/50 split or stacked with image below
- What's Included: 2x2 grid
- Features: 2-column checklist (narrower)
- Pricing: full-width card, slightly reduced padding
- Timeline: horizontal stepper (compact labels)

**Mobile (< 768px):**
- Hero: single column, image below text, buttons stacked full-width
- What's Included: 2-column grid
- Features: single column checklist
- Pricing: full-width card, `p-4` padding, add-on items stack vertically
- Timeline: vertical stepper
- Final CTA: buttons stacked

### 2.7 Animation Specifications

| Element | Animation | Delay | Duration |
|---------|-----------|-------|----------|
| Hero badge | Fade in + translateY(10px) | 0ms | 400ms |
| Hero title | Fade in + translateY(20px) | 100ms | 600ms |
| Hero tagline | Fade in + translateY(15px) | 300ms | 500ms |
| Hero price | Fade in + translateY(10px) | 450ms | 400ms |
| Hero CTAs | Fade in + translateY(10px) | 550ms | 400ms |
| Hero mockup | Fade in + translateX(30px) + scale(0.95) | 200ms | 700ms |
| Included items | Fade in + translateY(20px), stagger 80ms | Scroll | 500ms |
| Feature items | Fade in + translateX(left: -15px, right: +15px) | Scroll, stagger 50ms | 400ms |
| Pricing card | Scale(0.98 to 1) + opacity | Scroll | 500ms |
| Timeline steps | Fade in + scale, stagger 120ms | Scroll | 400ms |
| Case study card | Fade in + translateY(20px) | Scroll | 500ms |
| Final CTA container | Scale(0.97 to 1) + opacity | Scroll | 600ms |

### 2.8 Accessibility Requirements

- Page structure: `<main>` > `<article>` for the solution content
- Heading hierarchy: H1 (solution name) > H2 (section headings) > H3 (sub-sections)
- Pricing table: Use `<dl>` (description list) for base package details: `<dt>` for item name, `<dd>` for description
- Add-ons: Use `<table>` with proper `<th>` headers if tabular, or `<dl>` for list
- Timeline stepper: `role="list"` with `role="listitem"` for each phase; `aria-label="Project timeline"`
- All mockup images: descriptive `alt` text -- e.g., `alt="Delivery app showing order tracking screen on iPhone"`
- Price: Use `aria-label` on price elements for clear screen reader output
- Tech stack badges: `aria-label="Technologies used"` on the container
- Keyboard navigation: All CTAs and links reachable via Tab, logical order

### 2.9 RTL Considerations

- Hero split layout: Text column moves to right, mockup to left (CSS flexbox `flex-row-reverse` in RTL via `rtl:flex-row-reverse` or `dir` handling)
- Feature checklist: Check icons move to right side of text
- Pricing breakdown: Price values stay left-aligned in LTR, right-aligned in RTL. Currency symbol stays before number in both languages (or adapt to locale convention)
- Timeline stepper: Horizontal flow reverses (right-to-left progression)
- Breadcrumb: Chevron separators flip
- "Learn More" arrows: Flip direction
- WhatsApp pre-filled message: Arabic version for Arabic locale

---

## 3. Solution Data Reference

### 3.1 Complete Solution Inventory

| # | Solution | Slug | Price | Timeline | Category | Icon (Lucide) |
|---|----------|------|-------|----------|----------|---------------|
| 1 | Delivery App System | `delivery-app` | $10,000 | 35 days | Delivery & Logistics | `Truck` |
| 2 | Kindergarten Management | `kindergarten` | $8,000 | 35 days | Management | `GraduationCap` |
| 3 | Hypermarket System | `hypermarket` | $15,000 | 35 days | E-Commerce & Rental | `ShoppingCart` |
| 4 | Office Suite | `office-suite` | $8,000 | 35 days | Management | `Briefcase` |
| 5 | Gym & Fitness Platform | `gym-fitness` | $25,000 | 60 days | Management | `Dumbbell` |
| 6 | Airbnb-Style Rental | `airbnb-rental` | $15,000 | 35 days | E-Commerce & Rental | `Home` |
| 7 | Hair Transplant AI | `hair-transplant-ai` | $18,000 | 35 days | Health & AI | `Sparkles` |

### 3.2 Solution Detail Content (Per Solution)

Each solution detail page requires the following content blocks. Below is the full spec for each solution.

---

#### Solution 1: Delivery App System

**Tagline:** "Complete delivery management platform with real-time tracking and multi-vendor support."

**What's Included (4 items):**
1. Customer App (iOS + Android) -- Browse, order, track deliveries in real-time
2. Driver App (iOS + Android) -- Accept orders, navigate routes, manage deliveries
3. Admin Dashboard (Web) -- Manage orders, drivers, customers, and analytics
4. Backend & API -- Scalable server infrastructure with real-time updates

**Key Features (10 items):**
1. Real-time GPS order tracking
2. Push notification system
3. Multiple payment methods (card, cash, wallet)
4. Rating and review system
5. Promo codes and discount management
6. Route optimization for drivers
7. Order history and reordering
8. Multi-language support (EN/AR)
9. Analytics and reporting dashboard
10. Automated dispatch system

**Tech Stack:** React Native, Node.js, Firebase, Google Maps API, Stripe

**Timeline Phases:**
1. Discovery & Planning -- Week 1
2. UI/UX Design -- Week 2-3
3. Development -- Week 3-6
4. Testing & QA -- Week 6-7
5. Launch -- Week 7

**Add-ons:**
- AI Route Optimization: +$3,000 / +10 days
- Multi-Vendor Marketplace: +$5,000 / +15 days
- Advanced Analytics: +$2,000 / +7 days
- Custom Branding Package: +$1,500 / +5 days

**Related Case Study:** "Cut Delivery Costs by 25% with Route AI" (Logistics)

---

#### Solution 2: Kindergarten Management

**Tagline:** "All-in-one nursery and kindergarten management platform for modern early education."

**What's Included:**
1. Parent App (iOS + Android) -- Track child activities, communicate with teachers, view reports
2. Teacher App (iOS + Android) -- Attendance, daily reports, activity logging
3. Admin Dashboard (Web) -- Student management, billing, staff scheduling
4. Backend & API -- Secure data storage with parent-teacher messaging

**Key Features:**
1. Daily activity reports with photos
2. Attendance tracking (check-in/check-out)
3. Parent-teacher messaging
4. Invoice and payment management
5. Event calendar and announcements
6. Health records and allergy tracking
7. Bus tracking for transport
8. Multi-language support (EN/AR)
9. Progress reports and milestones
10. Emergency contact management

**Tech Stack:** React Native, Node.js, Firebase, Cloudinary (media)

**Timeline Phases:**
1. Discovery -- Week 1
2. Design -- Week 2-3
3. Development -- Week 3-6
4. Testing -- Week 6-7
5. Launch -- Week 7

**Add-ons:**
- Bus GPS Tracking: +$2,500 / +7 days
- AI Learning Analytics: +$3,000 / +10 days
- Custom Curriculum Module: +$2,000 / +7 days

**Related Case Study:** "Increased Parent Engagement by 60%" (Education)

---

#### Solution 3: Hypermarket System

**Tagline:** "Full-featured retail and grocery management system with e-commerce capabilities."

**What's Included:**
1. Customer App (iOS + Android) -- Browse products, place orders, track delivery
2. Admin Dashboard (Web) -- Inventory, orders, suppliers, promotions
3. POS Integration -- Connect with existing point-of-sale systems
4. Backend & API -- High-volume order processing and inventory management

**Key Features:**
1. Product catalog with categories and search
2. Real-time inventory management
3. Order management and fulfillment
4. Multiple delivery zones and pricing
5. Loyalty program and rewards
6. Barcode scanning integration
7. Supplier management portal
8. Sales analytics and forecasting
9. Multi-language support (EN/AR)
10. Promotional banner management

**Tech Stack:** React Native, Next.js, Node.js, PostgreSQL, Redis, Stripe

**Timeline Phases:**
1. Discovery & Planning -- Week 1
2. Design -- Week 2-3
3. Development -- Week 3-6
4. Testing & Integration -- Week 6-7
5. Launch -- Week 7

**Add-ons:**
- AI Product Recommendations: +$4,000 / +10 days
- Multi-Branch Management: +$5,000 / +15 days
- Advanced Inventory Forecasting: +$3,000 / +10 days
- Supplier Marketplace: +$3,500 / +12 days

---

#### Solution 4: Office Suite

**Tagline:** "Streamline your office operations with an integrated workspace management platform."

**What's Included:**
1. Employee App (iOS + Android) -- Tasks, attendance, leave requests, announcements
2. Admin Dashboard (Web) -- HR management, task assignment, reporting
3. Communication Module -- Internal messaging and announcements
4. Backend & API -- Secure employee data management

**Key Features:**
1. Employee attendance tracking
2. Leave request and approval workflow
3. Task management and assignment
4. Internal announcement board
5. Document sharing and storage
6. Meeting room booking
7. Expense reporting
8. Performance review templates
9. Multi-language support (EN/AR)
10. Role-based access control

**Tech Stack:** React Native, Next.js, Node.js, Firebase

**Timeline Phases:**
1. Discovery -- Week 1
2. Design -- Week 2-3
3. Development -- Week 3-6
4. Testing -- Week 6-7
5. Launch -- Week 7

**Add-ons:**
- Payroll Integration: +$3,000 / +10 days
- Advanced HR Analytics: +$2,500 / +7 days
- Custom Workflow Builder: +$3,500 / +12 days

---

#### Solution 5: Gym & Fitness Platform

**Tagline:** "Complete gym management and fitness tracking platform for modern fitness businesses."

**What's Included:**
1. Member App (iOS + Android) -- Class booking, workout tracking, progress, payments
2. Trainer App (iOS + Android) -- Schedule management, client tracking, workout plans
3. Admin Dashboard (Web) -- Membership management, revenue tracking, facility scheduling
4. Backend & API -- High-concurrency booking system with real-time availability

**Key Features:**
1. Class scheduling and booking
2. Membership management with tiers
3. Workout plan builder and tracker
4. Progress photos and measurements
5. Payment and subscription billing
6. Trainer-client matching
7. Nutrition tracking integration
8. QR code check-in
9. Push notifications for classes
10. Social features (leaderboards, challenges)
11. Multi-branch support
12. Revenue and attendance analytics

**Tech Stack:** React Native, Next.js, Node.js, PostgreSQL, Stripe, Firebase

**Timeline Phases:**
1. Discovery & Planning -- Week 1-2
2. UI/UX Design -- Week 3-4
3. Core Development -- Week 5-10
4. Testing & QA -- Week 10-12
5. Launch & Training -- Week 12-13

**Add-ons:**
- AI Workout Recommendations: +$4,000 / +10 days
- Wearable Device Integration: +$5,000 / +15 days
- Virtual Class Streaming: +$6,000 / +20 days
- Marketplace for Supplements: +$3,000 / +10 days

---

#### Solution 6: Airbnb-Style Rental Platform

**Tagline:** "Launch your property rental marketplace with guest management and booking automation."

**What's Included:**
1. Guest App (iOS + Android) -- Search, book, pay, review properties
2. Host Dashboard (Web + Mobile) -- List properties, manage bookings, communicate with guests
3. Admin Dashboard (Web) -- Platform management, commission tracking, dispute handling
4. Backend & API -- Booking engine with calendar sync and payment processing

**Key Features:**
1. Property listing with photos and details
2. Advanced search with filters and map view
3. Calendar-based availability management
4. Secure payment processing with escrow
5. Host-guest messaging
6. Review and rating system
7. Dynamic pricing suggestions
8. Multi-currency support
9. ID verification integration
10. Cleaning and maintenance scheduling

**Tech Stack:** React Native, Next.js, Node.js, PostgreSQL, Stripe Connect, Google Maps, Cloudinary

**Timeline Phases:**
1. Discovery & Planning -- Week 1
2. UI/UX Design -- Week 2-3
3. Development -- Week 3-6
4. Testing & Integration -- Week 6-7
5. Launch -- Week 7

**Add-ons:**
- AI Price Optimization: +$3,500 / +10 days
- Smart Lock Integration: +$4,000 / +12 days
- Property Management Tools: +$3,000 / +10 days
- Multi-City Expansion Kit: +$2,500 / +7 days

---

#### Solution 7: Hair Transplant AI

**Tagline:** "AI-powered hair transplant consultation and planning platform with virtual visualization."

**What's Included:**
1. Patient App (iOS + Android) -- AI consultation, virtual try-on, clinic finder, appointment booking
2. Clinic Dashboard (Web) -- Patient management, AI analysis results, scheduling
3. AI Analysis Engine -- Hair loss pattern detection, graft estimation, result visualization
4. Backend & API -- HIPAA-aware data handling with AI model serving

**Key Features:**
1. AI hair loss pattern analysis from photos
2. Virtual hair transplant visualization
3. Graft count estimation
4. Before/after simulation
5. Clinic recommendation engine
6. Appointment booking and management
7. Treatment plan generation
8. Progress photo tracking
9. Multi-language support (EN/AR)
10. Secure medical data handling

**Tech Stack:** React Native, Next.js, Python (FastAPI), TensorFlow/PyTorch, Google Cloud AI, Firebase

**Timeline Phases:**
1. Discovery & AI Model Planning -- Week 1-2
2. UI/UX Design -- Week 2-3
3. AI Model Development -- Week 3-6
4. App Development -- Week 4-7
5. Integration & Testing -- Week 7-8
6. Launch -- Week 8

**Add-ons:**
- Advanced AI Model Training (custom dataset): +$5,000 / +15 days
- Telemedicine Video Consultation: +$4,000 / +10 days
- Multi-Clinic Management: +$3,000 / +10 days
- Patient CRM Integration: +$2,500 / +7 days

**Related Case Study:** None currently (potential future addition)

---

### 3.3 Component Mapping Summary

| Page Element | React Component | Design System Reference |
|-------------|----------------|----------------------|
| Solution card (catalog) | `<SolutionCard />` | Section 7.2 Service/Solution Card |
| Filter tabs | `<FilterTabs />` | Section 7.7 Horizontal Tabs |
| Price display | `<PriceDisplay />` | Custom (uses typography tokens) |
| Timeline badge | `<Badge variant="success" />` | Section 7.5 Status Badge |
| Tech badge | `<TechBadge />` | Section 7.5 Tech Stack Badge |
| Feature list | `<FeatureList />` | Custom (uses checkbox pattern) |
| Pricing card | `<PricingCard />` | Section 7.2 Featured Card |
| Timeline stepper | `<TimelineStepper />` | Section 7.9 Stepper |
| Case study card | `<CaseStudyCard />` | Section 7.2 Case Study Card |
| Breadcrumbs | `<Breadcrumbs />` | Section 7.4 Breadcrumbs |
| CTA section | `<CTASection />` | Homepage Final CTA pattern |
| WhatsApp link | `<WhatsAppLink />` | Custom |

---

## 4. Individual Solution Content Briefs

This section provides comprehensive content specifications for each of the 7 ready-made solutions. Use these briefs to populate individual solution detail pages with consistent, compelling content.

### 4.1 Solution Content Framework

Each solution detail page follows this structure:
- **Hero:** Tagline, subtitle, price, timeline
- **Key Features:** 6 features with icons and descriptions
- **Target Audience:** Ideal customer profile
- **What's Included:** 6 core deliverables
- **Timeline Phases:** 3-4 phases with week ranges
- **Add-ons:** Optional enhancements with pricing
- **USP:** Unique selling proposition
- **Pain Points:** Industry-specific problems solved
- **Related Case Study:** Link to relevant success story (if available)
- **Cross-sell:** Links to estimation and ROI tools

---

### 4.2 Solution 1: Delivery App System

**Hero Tagline:** "Launch Your Delivery Business in 35 Days"

**Hero Subtitle:** "Complete delivery management platform with real-time tracking, automated dispatch, and multi-vendor support. Everything you need to compete with the big players."

**Price:** $10,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **Real-Time GPS Tracking** (Icon: `MapPin`)
   - Live driver location tracking with optimized route suggestions. Customers see exactly when their order will arrive.

2. **Automated Dispatch System** (Icon: `Route`)
   - AI-powered order assignment to nearest available drivers. Reduces delivery time by up to 30%.

3. **Multi-Payment Integration** (Icon: `CreditCard`)
   - Accept credit cards, digital wallets, cash on delivery. Integrated with Stripe and local payment gateways.

4. **Customer & Driver Apps** (Icon: `Smartphone`)
   - Native iOS and Android apps for customers and drivers. Intuitive interfaces with push notifications.

5. **Order Management Dashboard** (Icon: `LayoutDashboard`)
   - Web-based admin panel with real-time analytics, order history, revenue tracking, and driver performance metrics.

6. **Rating & Review System** (Icon: `Star`)
   - Built-in feedback system to maintain service quality. Customers rate drivers and experience after each delivery.

#### Target Audience / Ideal Customer

- **Restaurant chains** expanding into delivery
- **Grocery stores** offering home delivery
- **Logistics startups** building a delivery network
- **Multi-vendor marketplaces** needing delivery infrastructure
- **E-commerce businesses** requiring last-mile delivery

#### What's Included (6 Deliverables)

1. **Customer Mobile App** (iOS + Android) - Browse, order, track deliveries in real-time
2. **Driver Mobile App** (iOS + Android) - Accept orders, navigate routes, manage deliveries
3. **Admin Web Dashboard** - Manage orders, drivers, customers, and analytics
4. **Backend API & Database** - Scalable server infrastructure with real-time updates
5. **Payment Gateway Integration** - Pre-configured Stripe and cash-on-delivery support
6. **3 Months Bug-Fix Support** - Post-launch technical support and maintenance

#### Timeline Phases (3-4 phases with week ranges)

1. **Discovery & Planning** (Week 1-2) - Requirements gathering, workflow mapping, feature prioritization
2. **UI/UX Design** (Week 2-3) - App screens, user flows, branding integration
3. **Development & Integration** (Week 3-6) - Build apps, backend, payment integration, GPS tracking
4. **Testing & Launch** (Week 6-7) - QA testing, beta deployment, app store submission, go-live

#### Add-on Possibilities

- **AI Route Optimization:** +$3,000 / +10 days - Machine learning-powered route planning saves fuel and time
- **Multi-Vendor Marketplace:** +$5,000 / +15 days - Support multiple restaurants/stores on one platform
- **Advanced Analytics Dashboard:** +$2,000 / +7 days - Deep-dive reports, heatmaps, demand forecasting
- **Custom Branding Package:** +$1,500 / +5 days - Full white-label design with your brand colors and logo
- **Scheduled Deliveries:** +$1,000 / +5 days - Let customers pre-schedule delivery times

#### Unique Selling Proposition vs Competitors

Unlike generic delivery templates, our system is built on proven architecture powering real delivery apps in production. Features like automated dispatch and AI route optimization are typically $50K+ custom builds - we include the foundation at a fraction of the cost. Fully customizable to your business rules.

#### Industry-Specific Pain Points Solved

- **High delivery costs** - Optimized routing reduces fuel and time waste
- **Poor customer experience** - Real-time tracking eliminates "where's my order?" calls
- **Driver inefficiency** - Automated dispatch assigns orders intelligently
- **Limited scalability** - Cloud infrastructure handles growth from 10 to 10,000 orders/day
- **Complex vendor management** - Centralized dashboard for multi-vendor operations

#### Related Case Study

**"Cut Delivery Costs by 25% with Route AI"** (Logistics category)

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need custom features? Get a detailed quote in 60 seconds"
- **Calculate Your ROI** - "See how much a delivery app could save your business"
- **View Similar Solutions** - Link to Hypermarket System (retail delivery synergy)

---

### 4.3 Solution 2: Kindergarten Management

**Hero Tagline:** "Modern Kindergarten Management That Parents Love"

**Hero Subtitle:** "Streamline operations, engage parents, and elevate early education with an all-in-one management platform built for nurseries and kindergartens."

**Price:** $8,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **Daily Activity Reports** (Icon: `FileText`)
   - Teachers document meals, naps, activities, and mood with photos. Parents receive real-time updates throughout the day.

2. **Smart Attendance Tracking** (Icon: `ClipboardCheck`)
   - QR code or biometric check-in/check-out system. Automated parent notifications when child arrives or leaves.

3. **Parent-Teacher Messaging** (Icon: `MessageCircle`)
   - Secure in-app chat for questions, updates, and coordination. Eliminates phone tag and missed communications.

4. **Billing & Invoicing** (Icon: `Receipt`)
   - Automated invoice generation, payment tracking, overdue reminders. Parents pay online via card or bank transfer.

5. **Bus Tracking** (Icon: `Bus`)
   - Real-time GPS tracking for school buses. Parents see exactly when the bus will arrive for pickup.

6. **Health & Allergy Records** (Icon: `Heart`)
   - Centralized medical records, allergy tracking, emergency contacts. Accessible to authorized staff instantly.

#### Target Audience / Ideal Customer

- **Nurseries and kindergartens** (10-200 students)
- **Daycare centers** seeking to modernize operations
- **Early education chains** expanding locations
- **International schools** with preschool programs
- **Private educators** offering premium childcare services

#### What's Included (6 Deliverables)

1. **Parent Mobile App** (iOS + Android) - Track child activities, communicate with teachers, view reports
2. **Teacher Mobile App** (iOS + Android) - Log attendance, daily reports, activity updates with photos
3. **Admin Web Dashboard** - Student management, billing, staff scheduling, analytics
4. **Backend & Database** - Secure data storage with role-based access and parent-teacher messaging
5. **Payment Gateway Integration** - Online invoice payment with automated reminders
6. **3 Months Support** - Post-launch technical support and staff training

#### Timeline Phases

1. **Discovery & Workflow Design** (Week 1) - Understand current processes, staff roles, parent expectations
2. **UI/UX Design** (Week 2-3) - App screens for parents and teachers, admin dashboard layouts
3. **Development** (Week 3-6) - Build apps, messaging system, billing, attendance tracking
4. **Testing & Training** (Week 6-7) - QA, staff training sessions, parent onboarding materials, launch

#### Add-on Possibilities

- **Bus GPS Tracking:** +$2,500 / +7 days - Real-time bus location tracking for parent peace of mind
- **AI Learning Analytics:** +$3,000 / +10 days - Track developmental milestones and generate progress insights
- **Custom Curriculum Module:** +$2,000 / +7 days - Digital curriculum planning and activity library
- **Meal Planning System:** +$1,500 / +5 days - Menu publishing, dietary restrictions, meal tracking
- **Event Calendar & RSVP:** +$1,000 / +5 days - School events, parent-teacher meetings, RSVP tracking

#### Unique Selling Proposition vs Competitors

Purpose-built for early childhood education, not adapted from generic school management systems. Our interface is designed for busy teachers who need to log updates in seconds, not minutes. Parents get the transparency they crave without overwhelming staff.

#### Industry-Specific Pain Points Solved

- **Parent communication overload** - Centralized updates eliminate constant phone calls and messages
- **Administrative inefficiency** - Automated billing and attendance save 10+ hours/week
- **Low parent engagement** - Daily photo updates and activity logs increase satisfaction and retention
- **Safety concerns** - Check-in/out tracking and bus GPS provide accountability and peace of mind
- **Staff turnover** - Simple, intuitive interface reduces training time for new teachers

#### Related Case Study

**"Increased Parent Engagement by 60%"** (Education category)

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need features for your specific curriculum? Get a quote"
- **Calculate Your ROI** - "See how much time and money you could save"
- **View Similar Solutions** - Link to Office Management (admin workflow synergy)

---

### 4.4 Solution 3: Hypermarket Management System

**Hero Tagline:** "From Aisle to Doorstep: Complete Retail Management"

**Hero Subtitle:** "Integrated hypermarket and grocery management system with e-commerce, inventory control, and multi-channel sales. Built for modern retail operations."

**Price:** $15,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **Unified Product Catalog** (Icon: `Package`)
   - Centralized inventory across physical stores and online. Real-time stock updates, barcode scanning, category management.

2. **Multi-Channel Sales** (Icon: `ShoppingBag`)
   - Sell in-store, online, and via mobile app. Orders sync instantly across all channels with unified fulfillment.

3. **Smart Inventory Management** (Icon: `Warehouse`)
   - Automated low-stock alerts, supplier reordering, expiry date tracking. Reduce waste and prevent stockouts.

4. **Delivery Zone Pricing** (Icon: `MapPinned`)
   - Set different delivery fees by zone, order value, or customer tier. Schedule same-day or next-day delivery slots.

5. **Loyalty & Promotions** (Icon: `Ticket`)
   - Points-based loyalty program, discount codes, flash sales, BOGO offers. Increase repeat purchases and average order value.

6. **Sales Analytics Dashboard** (Icon: `TrendingUp`)
   - Real-time revenue tracking, best-selling products, customer behavior insights, inventory forecasting.

#### Target Audience / Ideal Customer

- **Hypermarkets and supermarkets** adding e-commerce
- **Grocery chains** expanding online delivery
- **Wholesale retailers** serving B2B and B2C customers
- **Specialty food stores** needing inventory control
- **Multi-location retailers** requiring centralized management

#### What's Included (6 Deliverables)

1. **Customer Mobile App** (iOS + Android) - Browse products, place orders, track delivery, loyalty program
2. **Admin Web Dashboard** - Inventory management, orders, suppliers, promotions, analytics
3. **POS System Integration** - Connect with existing point-of-sale systems for unified inventory
4. **Backend & Database** - High-volume order processing, inventory sync, customer management
5. **Payment Gateway Integration** - Stripe, local payment methods, cash-on-delivery support
6. **3 Months Support** - Technical support, inventory setup assistance, staff training

#### Timeline Phases

1. **Discovery & Integration Planning** (Week 1) - Current POS system, inventory structure, supplier workflows
2. **Design & Catalog Setup** (Week 2-3) - App design, product categorization, pricing structures
3. **Development & POS Integration** (Week 3-6) - Build system, integrate POS, test inventory sync
4. **Testing & Launch** (Week 6-7) - QA, load testing, staff training, soft launch, go-live

#### Add-on Possibilities

- **AI Product Recommendations:** +$4,000 / +10 days - Personalized shopping suggestions based on purchase history
- **Multi-Branch Management:** +$5,000 / +15 days - Manage inventory and sales across multiple store locations
- **Advanced Inventory Forecasting:** +$3,000 / +10 days - Predictive analytics for demand planning and reordering
- **Supplier Marketplace Portal:** +$3,500 / +12 days - Let suppliers manage their products and view sales data
- **Customer Mobile Payments:** +$2,000 / +7 days - In-store mobile checkout with QR code scanning

#### Unique Selling Proposition vs Competitors

Unlike generic e-commerce platforms, our system is built for high-volume retail with real-world inventory complexity. We handle expiry dates, batch tracking, multi-location stock, and supplier integrations that Shopify and WooCommerce can't. Purpose-built for grocers and hypermarkets.

#### Industry-Specific Pain Points Solved

- **Inventory chaos** - Real-time sync between online and in-store prevents overselling
- **Manual reordering** - Automated supplier orders based on stock levels and sales velocity
- **Expiry waste** - Track expiration dates and prioritize FIFO (first in, first out) fulfillment
- **Complex pricing** - Handle bulk pricing, zone-based delivery fees, multi-tier loyalty discounts
- **Fragmented systems** - Unified platform replaces disparate POS, inventory, and e-commerce tools

#### Related Case Study

None currently (potential future: "E-commerce Retail Automation" case study)

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need multi-location or wholesale features? Get a quote"
- **Calculate Your ROI** - "See how much inventory efficiency could save you"
- **View Similar Solutions** - Link to Delivery App System (fulfillment synergy)

---

### 4.5 Solution 4: Office Management Suite

**Hero Tagline:** "Streamline Your Workspace, Empower Your Team"

**Hero Subtitle:** "All-in-one office management platform for HR, tasks, attendance, and communication. Built for SMBs that want to work smarter, not harder."

**Price:** $8,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **Employee Attendance Tracking** (Icon: `Clock`)
   - GPS-based check-in/check-out, shift scheduling, overtime tracking. Automated timesheets for payroll processing.

2. **Leave Management** (Icon: `Calendar`)
   - Online leave requests with approval workflows. Managers see team availability at a glance. Automated balance tracking.

3. **Task Management** (Icon: `CheckSquare`)
   - Assign tasks, set deadlines, track progress. Kanban boards and list views for team productivity.

4. **Internal Communication Hub** (Icon: `Megaphone`)
   - Company announcements, department updates, employee directory. Replace scattered email threads.

5. **Document Sharing & Storage** (Icon: `FolderOpen`)
   - Centralized document library with version control. Share policies, handbooks, and forms securely.

6. **Meeting Room Booking** (Icon: `DoorOpen`)
   - Real-time availability, book meeting rooms, avoid double bookings. Integrated with calendar.

#### Target Audience / Ideal Customer

- **SMBs (20-200 employees)** needing HR digitization
- **Startups** scaling beyond spreadsheets
- **Professional services firms** (law, consulting, agencies)
- **Co-working spaces** managing member access and resources
- **Regional offices** of larger enterprises seeking lightweight tools

#### What's Included (6 Deliverables)

1. **Employee Mobile App** (iOS + Android) - Check in/out, request leave, view tasks, read announcements
2. **Admin Web Dashboard** - HR management, task assignment, reporting, employee data
3. **Communication Module** - Internal messaging, announcement board, employee directory
4. **Backend & Database** - Secure employee data storage with role-based access control
5. **Attendance Tracking System** - GPS check-in, shift management, timesheet generation
6. **3 Months Support** - Technical support, HR workflow setup, training sessions

#### Timeline Phases

1. **Discovery & Workflow Mapping** (Week 1) - Current HR processes, approval hierarchies, reporting needs
2. **Design** (Week 2-3) - Employee app, admin dashboard, communication flows
3. **Development** (Week 3-6) - Build attendance, leave management, tasks, document storage
4. **Testing & Training** (Week 6-7) - QA, admin training, employee onboarding, launch

#### Add-on Possibilities

- **Payroll Integration:** +$3,000 / +10 days - Connect with payroll systems for automated salary processing
- **Advanced HR Analytics:** +$2,500 / +7 days - Employee performance dashboards, turnover analysis, engagement metrics
- **Custom Workflow Builder:** +$3,500 / +12 days - Design approval workflows for expenses, purchases, and requests
- **Performance Review Module:** +$2,000 / +7 days - 360-degree feedback, goal setting, review cycles
- **Visitor Management System:** +$1,500 / +5 days - Check-in kiosk for guests, contractor access tracking

#### Unique Selling Proposition vs Competitors

We combine the best features of HR systems, task managers, and communication tools into one affordable platform. No more paying for Slack, Asana, BambooHR separately. Purpose-built for SMBs that need simplicity without sacrificing functionality.

#### Industry-Specific Pain Points Solved

- **HR admin overload** - Automated leave approvals and attendance tracking save 15+ hours/week
- **Scattered communication** - Replace email chaos with centralized announcements and updates
- **Lack of visibility** - Managers see real-time team availability, task progress, and attendance
- **Onboarding friction** - New hires access company documents and policies from day one
- **Compliance gaps** - Digital record-keeping for audits, leave balances, and attendance logs

#### Related Case Study

None currently

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need payroll or custom workflows? Get a quote"
- **Calculate Your ROI** - "See how much admin time you could save"
- **View Similar Solutions** - Link to Kindergarten Management (admin workflow parallels)

---

### 4.6 Solution 5: Gym & Fitness Management Platform

**Hero Tagline:** "The Complete Gym Management System Your Members Will Love"

**Hero Subtitle:** "Class booking, membership management, workout tracking, and payments - all in one platform. Built for gyms, studios, and fitness centers ready to scale."

**Price:** $25,000 | **Timeline:** 60 days

#### Key Features (6 with icons and descriptions)

1. **Class Scheduling & Booking** (Icon: `CalendarClock`)
   - Members book classes from the app with real-time availability. Waitlists, recurring bookings, late cancellation fees.

2. **Membership Tiers & Billing** (Icon: `CreditCard`)
   - Multiple membership plans (monthly, annual, drop-in). Automated recurring billing, payment reminders, freeze requests.

3. **Workout Plan Builder** (Icon: `Dumbbell`)
   - Trainers create custom workout plans for clients. Members track exercises, sets, reps, and progress photos.

4. **Progress Tracking & Analytics** (Icon: `LineChart`)
   - Body measurements, weight tracking, progress photos with before/after comparisons. Charts show member improvement over time.

5. **Trainer-Client Matching** (Icon: `Users`)
   - Members request personal trainers. Trainers manage client rosters, schedules, and communication in one place.

6. **QR Code Check-In** (Icon: `QrCode`)
   - Members scan QR code at the gym entrance. Tracks attendance, validates memberships, prevents unauthorized access.

#### Target Audience / Ideal Customer

- **Gyms and fitness centers** (100-5000 members)
- **Boutique fitness studios** (yoga, Pilates, CrossFit)
- **Personal training businesses** with multiple trainers
- **Multi-location fitness chains** needing centralized management
- **Corporate wellness programs** offering employee fitness access

#### What's Included (6 Deliverables)

1. **Member Mobile App** (iOS + Android) - Class booking, workout tracking, progress photos, payments
2. **Trainer Mobile App** (iOS + Android) - Schedule management, client tracking, workout plan creation
3. **Admin Web Dashboard** - Membership management, revenue tracking, facility scheduling, analytics
4. **Backend & Database** - High-concurrency booking system with real-time class availability
5. **Payment Gateway Integration** - Stripe subscription billing, one-time payments, late fee automation
6. **3 Months Support** - Technical support, membership migration, staff training

#### Timeline Phases

1. **Discovery & Planning** (Week 1-2) - Current operations, membership structure, class schedules, trainer workflows
2. **UI/UX Design** (Week 3-4) - Member and trainer apps, booking flows, workout tracking interfaces
3. **Core Development** (Week 5-10) - Build booking engine, membership billing, workout plans, analytics
4. **Testing & QA** (Week 10-12) - Load testing, payment testing, trainer/member beta testing
5. **Launch & Training** (Week 12-13) - Staff training, member migration, soft launch, go-live

#### Add-on Possibilities

- **AI Workout Recommendations:** +$4,000 / +10 days - Personalized workout suggestions based on goals and progress
- **Wearable Device Integration:** +$5,000 / +15 days - Sync with Apple Health, Fitbit, Garmin for automatic workout logging
- **Virtual Class Streaming:** +$6,000 / +20 days - Live and on-demand video classes for hybrid fitness models
- **Supplement Marketplace:** +$3,000 / +10 days - Sell protein, supplements, and merchandise in-app
- **Nutrition Tracking:** +$2,500 / +7 days - Meal logging, macro tracking, integration with trainers

#### Unique Selling Proposition vs Competitors

Unlike Mindbody and Zen Planner, our system is fully white-labeled and owned by you - no per-member fees eating into your margins. Built on modern mobile-first architecture with features typically reserved for enterprise platforms. Scales from a single studio to multi-location chains.

#### Industry-Specific Pain Points Solved

- **Class booking chaos** - Real-time availability and waitlists eliminate manual coordination
- **Membership billing headaches** - Automated recurring payments and reminders reduce late payments
- **Low member retention** - Progress tracking and workout plans increase engagement and loyalty
- **Trainer inefficiency** - Centralized client management and scheduling save trainers 10+ hours/week
- **Poor reporting** - Revenue, attendance, and member analytics inform business decisions

#### Related Case Study

None currently (potential future: "Fitness Studio Growth" case study)

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need multi-location or franchise features? Get a quote"
- **Calculate Your ROI** - "See how much member retention could increase revenue"
- **View Similar Solutions** - Link to Office Management (scheduling/booking parallels)

---

### 4.7 Solution 6: Airbnb-Style Rental Marketplace

**Hero Tagline:** "Launch Your Property Rental Marketplace in 35 Days"

**Hero Subtitle:** "Complete booking platform with guest management, host tools, and automated payments. Everything Airbnb has, customized for your brand and market."

**Price:** $15,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **Property Listing Management** (Icon: `Home`)
   - Hosts upload photos, descriptions, amenities, house rules. Admin approves listings. SEO-friendly URLs for each property.

2. **Advanced Search & Filters** (Icon: `Search`)
   - Guests search by location, dates, price, amenities, property type. Map view, list view, saved searches.

3. **Calendar-Based Booking** (Icon: `CalendarDays`)
   - Real-time availability sync. Block dates, set minimum stays, adjust pricing by season. Prevent double bookings.

4. **Secure Payment Processing** (Icon: `Shield`)
   - Escrow system holds payments until check-in. Automatic payouts to hosts. Support for multiple currencies and payment methods.

5. **Host-Guest Messaging** (Icon: `MessagesSquare`)
   - In-app chat for questions, check-in instructions, and coordination. Notification system for new messages.

6. **Review & Rating System** (Icon: `Star`)
   - Two-way reviews: guests rate properties, hosts rate guests. Builds trust and quality control.

#### Target Audience / Ideal Customer

- **Vacation rental entrepreneurs** building niche marketplaces
- **Property management companies** serving multiple owners
- **Real estate agencies** expanding into short-term rentals
- **Hotel groups** offering apartment-style accommodations
- **Co-living platforms** targeting digital nomads and long-term stays

#### What's Included (6 Deliverables)

1. **Guest Mobile App** (iOS + Android) - Search properties, book, pay, message hosts, leave reviews
2. **Host Dashboard** (Web + Mobile) - List properties, manage bookings, communicate with guests, view earnings
3. **Admin Web Dashboard** - Platform management, commission tracking, dispute resolution, analytics
4. **Backend & Booking Engine** - Real-time calendar sync, payment processing, notification system
5. **Payment Gateway Integration** - Stripe Connect for split payments, escrow, multi-currency support
6. **3 Months Support** - Technical support, listing setup, host onboarding, launch assistance

#### Timeline Phases

1. **Discovery & Platform Planning** (Week 1) - Business model, commission structure, host workflows, guest expectations
2. **UI/UX Design** (Week 2-3) - Property listings, search interface, booking flow, host dashboard
3. **Development & Payment Integration** (Week 3-6) - Build booking engine, integrate Stripe Connect, test payouts
4. **Testing & Launch** (Week 6-7) - QA, payment testing, host training, beta launch, go-live

#### Add-on Possibilities

- **AI Price Optimization:** +$3,500 / +10 days - Dynamic pricing based on demand, seasonality, local events
- **Smart Lock Integration:** +$4,000 / +12 days - Generate unique entry codes for guests, integrate with August, Yale, etc.
- **Property Management Tools:** +$3,000 / +10 days - Cleaning schedules, maintenance requests, inspector checklists
- **Multi-City Expansion Kit:** +$2,500 / +7 days - Launch in multiple cities with localized content and currencies
- **ID Verification System:** +$2,000 / +7 days - Verify guest identity with ID upload and background checks

#### Unique Selling Proposition vs Competitors

Own your marketplace, your data, and your brand. No per-booking fees to Airbnb or Booking.com. Built on the same architecture powering real rental platforms, with all the trust and safety features guests expect. Fully customizable to your niche (pet-friendly, luxury, long-term, etc.).

#### Industry-Specific Pain Points Solved

- **Platform fees eating profits** - No per-booking commissions, set your own fee structure
- **Limited customization** - Tailor the platform to your niche market and brand identity
- **Trust and safety concerns** - Reviews, ID verification, secure payments, and escrow build confidence
- **Calendar chaos** - Unified calendar prevents double bookings across channels
- **Poor host tools** - Empower hosts with earnings dashboards, messaging, and booking management

#### Related Case Study

None currently

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need long-term rentals or unique features? Get a quote"
- **Calculate Your ROI** - "See how much owning your platform could save vs Airbnb fees"
- **View Similar Solutions** - Link to Delivery App System (marketplace architecture parallels)

---

### 4.8 Solution 7: Hair Transplant AI

**Hero Tagline:** "AI-Powered Hair Transplant Consultations at Scale"

**Hero Subtitle:** "Transform patient consultations with AI hair loss analysis, virtual try-on visualization, and clinic matching. Built for hair transplant clinics and medical tourism platforms."

**Price:** $18,000 | **Timeline:** 35 days

#### Key Features (6 with icons and descriptions)

1. **AI Hair Loss Pattern Analysis** (Icon: `Brain`)
   - Upload photos, AI detects hair loss pattern (Norwood scale), estimates graft count needed. Instant results for patients.

2. **Virtual Hair Transplant Visualization** (Icon: `Image`)
   - AI generates before/after simulation showing post-transplant results. Patients see realistic expectations before committing.

3. **Graft Count Estimation** (Icon: `Calculator`)
   - AI calculates required grafts based on baldness severity and desired density. Helps clinics provide accurate quotes.

4. **Clinic Recommendation Engine** (Icon: `MapPin`)
   - Match patients with clinics based on location, price, reviews, and specialization. Comparison tool for informed decisions.

5. **Appointment Booking System** (Icon: `CalendarCheck`)
   - Patients book consultations and procedures directly. Clinics manage availability and confirm bookings.

6. **Progress Photo Tracking** (Icon: `Camera`)
   - Patients upload post-surgery progress photos. Clinics monitor healing and provide guidance remotely.

#### Target Audience / Ideal Customer

- **Hair transplant clinics** (single or multi-location)
- **Medical tourism agencies** promoting hair restoration abroad
- **Dermatology clinics** offering hair loss treatments
- **Hair restoration device manufacturers** needing patient assessment tools
- **Telemedicine platforms** adding hair loss consultations

#### What's Included (6 Deliverables)

1. **Patient Mobile App** (iOS + Android) - AI analysis, virtual try-on, clinic finder, appointment booking
2. **Clinic Web Dashboard** - Patient management, AI analysis results, booking calendar, treatment plans
3. **AI Analysis Engine** - Hair loss pattern detection, graft estimation, result visualization models
4. **Backend & Database** - HIPAA-aware data handling, secure medical record storage, AI model serving
5. **Payment Gateway Integration** - Online consultation and procedure payments with deposit handling
6. **3 Months Support** - AI model tuning, clinic onboarding, training, technical support

#### Timeline Phases

1. **Discovery & AI Model Planning** (Week 1-2) - Medical requirements, accuracy expectations, clinic workflows, patient journey
2. **UI/UX Design** (Week 2-3) - Patient app, consultation flow, AI result displays, clinic dashboard
3. **AI Model Development** (Week 3-6) - Train hair loss detection model, build visualization engine, test accuracy
4. **App Development & Integration** (Week 4-7) - Build patient and clinic apps, integrate AI models, payment system
5. **Testing & Launch** (Week 7-8) - Medical validation, patient beta testing, clinic training, go-live

#### Add-on Possibilities

- **Advanced AI Model Training (custom dataset):** +$5,000 / +15 days - Train on your clinic's patient photos for higher accuracy
- **Telemedicine Video Consultation:** +$4,000 / +10 days - In-app video calls between patients and doctors
- **Multi-Clinic Management:** +$3,000 / +10 days - Centralized dashboard for clinic chains and franchises
- **Patient CRM Integration:** +$2,500 / +7 days - Connect with Salesforce, HubSpot, or custom CRM systems
- **AI Skin Analysis (expansion):** +$4,500 / +12 days - Add facial skin analysis for cosmetic dermatology

#### Unique Selling Proposition vs Competitors

Purpose-built for hair transplant industry with AI accuracy validated by medical professionals. Unlike generic telemedicine platforms, our AI understands hair loss patterns, graft requirements, and realistic result visualization. Turnkey solution that typically costs $100K+ as a custom build.

#### Industry-Specific Pain Points Solved

- **Time-consuming consultations** - AI pre-assessment reduces doctor consultation time by 50%
- **Unrealistic patient expectations** - Virtual try-on visualization shows achievable results upfront
- **Inaccurate graft estimates** - AI provides consistent, data-backed graft counts
- **Patient acquisition costs** - Clinic matching feature drives qualified leads to your practice
- **Medical tourism complexity** - Platform handles international patients, pricing in multiple currencies

#### Related Case Study

None currently (emerging technology, future case study potential)

#### Cross-sell CTAs

- **Get a Custom Estimate** - "Need multi-clinic or custom AI features? Get a quote"
- **Calculate Your ROI** - "See how many more consultations you could handle with AI"
- **View Similar Solutions** - Link to Gym Management (booking/scheduling parallels)

---

### 4.9 Content Usage Guidelines

**Tone:** Professional yet approachable. Focus on business outcomes, not technical jargon.

**Structure:** Use short paragraphs (2-3 lines), bullet points for scannability, and clear CTAs.

**Imagery:** Each solution page should include:
- Hero mockup or app screenshot
- Feature icons (Lucide React icons)
- Dashboard screenshots (can be generic placeholders initially)
- Optional: customer testimonial quote graphic

**Localization:** All content must be translated to Arabic for `/ar/` routes with culturally appropriate adaptations (e.g., "WhatsApp" emphasis in MENA market).

**SEO:** Each solution page should target long-tail keywords like "[industry] management system," "[solution type] app cost," "ready-made [solution] platform."

**CTA Hierarchy:**
1. Primary: "Get This Solution" (leads to contact/customization form)
2. Secondary: "Get Custom Estimate" (leads to AI Estimate tool)
3. Tertiary: "Calculate ROI" (leads to ROI Calculator)
4. Quaternary: "View Related Case Study" (if available)

---

**End of Solutions Page Specification**
