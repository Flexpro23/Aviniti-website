# Get AI Estimate - Design Specification

**Version:** 1.0
**Date:** February 2026
**Tool Accent:** Green `#22C55E` (tool-green)
**Route:** `/get-estimate`
**Status:** Design Specification

---

## Table of Contents

1. [Page Overview](#1-page-overview)
2. [Page Layout (Full Wireframe)](#2-page-layout)
3. [Hero / Header Section](#3-hero--header-section)
4. [Interactive Multi-Step Form](#4-interactive-multi-step-form)
5. [AI Processing State](#5-ai-processing-state)
6. [Results Display](#6-results-display)
7. [Cross-Sell / CTA Section](#7-cross-sell--cta-section)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Component Mapping](#9-component-mapping)
10. [Accessibility](#10-accessibility)
11. [RTL Considerations](#11-rtl-considerations)
12. [Error States](#12-error-states)
13. [SEO](#13-seo)

---

## 1. Page Overview

### 1.1 Purpose

Get AI Estimate is the **primary conversion tool** on the Aviniti website. It is the bottom-of-funnel entry point for visitors who know what they want to build and need a cost/timeline estimate before committing. This page must feel like a premium, AI-powered consultation -- not a generic contact form.

### 1.2 User Journey

The typical visitor arrives here through one of these paths:

1. **Direct from homepage** -- clicked "Get Instant AI Estimate" in the hero or final CTA
2. **From Idea Lab results** -- clicked "Explore This Idea" on a generated idea, which passed through the AI Analyzer, and now wants pricing
3. **From AI Idea Analyzer results** -- validated their idea, now wants to know the cost
4. **From Ready-Made Solutions** -- saw a solution, wants a custom quote
5. **From navigation** -- "Get AI Estimate" is a primary nav link

### 1.3 Conversion Goal

**Primary:** Capture a qualified lead with project details and contact information, delivering an AI-generated estimate that demonstrates Aviniti's capability.

**Secondary:** Book a Calendly call after seeing the estimate. Download the estimate as a PDF. Start a WhatsApp conversation.

### 1.4 Success Metrics

- Form completion rate (target: >40% of visitors who start the form)
- Step drop-off rate per step (identify friction points)
- Estimate-to-call conversion rate (target: >15%)
- WhatsApp engagement from results page

---

## 2. Page Layout

### 2.1 Full Page Wireframe (Desktop)

```
+====================================================================+
|                        NAVIGATION BAR                               |
|  [Logo]    Home  Get AI Estimate  FAQ  Blog  [Idea Lab]   [EN/AR]  |
+====================================================================+
|                                                                      |
|  Breadcrumb: Home > Get AI Estimate                                  |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|                    HERO / HEADER SECTION                              |
|                                                                      |
|         [Green calculator icon in green-tinted circle]               |
|                                                                      |
|         Get Your AI-Powered Project Estimate                         |
|         Answer a few questions and our AI will generate              |
|         a detailed cost and timeline breakdown.                      |
|                                                                      |
|         [3 value props in a row]                                     |
|         [AI-Powered]  [Takes 2 Minutes]  [Instant Results]           |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|                    STEPPER PROGRESS BAR                               |
|                                                                      |
|    (1)-------(2)-------(3)-------(4)                                 |
|  Project   Features  Timeline  Contact                               |
|   Type                          Info                                 |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|              FORM STEP CONTENT AREA                                   |
|            (max-width: 720px, centered)                              |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                                                                |   |
|  |  Step 1: What type of project do you want to build?           |   |
|  |                                                                |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |  | [phone icon]      |  | [globe icon]      |                  |   |
|  |  | Mobile App        |  | Web Application   |                  |   |
|  |  | iOS, Android,     |  | SPA, Platform,    |                  |   |
|  |  | or Both           |  | Dashboard         |                  |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |                                                                |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |  | [brain icon]      |  | [cloud icon]      |                  |   |
|  |  | AI / ML Solution  |  | Cloud             |                  |   |
|  |  | Computer Vision,  |  | Infrastructure    |                  |   |
|  |  | NLP, Analytics    |  | & DevOps          |                  |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |                                                                |   |
|  |  +-------------------------------------------+                 |   |
|  |  | [layers icon]                              |                 |   |
|  |  | Multiple / Full Stack                      |                 |   |
|  |  | Mobile + Web + Backend + AI                |                 |   |
|  |  +-------------------------------------------+                 |   |
|  |                                                                |   |
|  |                                     [Next: Features ->]        |   |
|  |                                                                |   |
|  +--------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|              TRUST STRIP (below form)                                |
|                                                                      |
|   [Lock] No spam  [Clock] 2 min  [Shield] Data encrypted            |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|                         FOOTER                                       |
|                                                                      |
+----------------------------------------------------------------------+
```

### 2.2 Full Page Wireframe -- Results State (Desktop)

```
+====================================================================+
|                        NAVIGATION BAR                               |
+====================================================================+
|                                                                      |
|  Breadcrumb: Home > Get AI Estimate > Your Estimate                  |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  RESULTS HEADER                                                      |
|                                                                      |
|  [Green checkmark in circle]                                         |
|  Your Project Estimate Is Ready                                      |
|  Based on your inputs, here's what we recommend.                     |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  ESTIMATE SUMMARY CARDS (3 across)                                   |
|                                                                      |
|  +------------------+ +------------------+ +------------------+      |
|  | Estimated Cost   | | Timeline         | | Approach         |      |
|  |                  | |                  | |                  |      |
|  | $12,000-$18,000  | | 8-12 Weeks       | | Custom Build     |      |
|  |                  | |                  | |                  |      |
|  +------------------+ +------------------+ +------------------+      |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  DETAILED BREAKDOWN                                                  |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |  Phase                         | Cost        | Duration      |   |
|  |  ----------------------------- | ----------- | ------------- |   |
|  |  1. Discovery & Planning       | $1,500      | 1 week        |   |
|  |  2. UI/UX Design               | $2,500      | 2 weeks       |   |
|  |  3. Backend Development         | $4,000      | 3 weeks       |   |
|  |  4. Frontend Development        | $3,500      | 3 weeks       |   |
|  |  5. Testing & QA               | $1,500      | 1 week        |   |
|  |  6. Deployment & Launch         | $1,000      | 1 week        |   |
|  +--------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  RECOMMENDED READY-MADE MATCH (conditional)                          |
|                                                                      |
|  "Based on your requirements, our Delivery App Solution              |
|   could save you 40% in cost and launch 60% faster."                 |
|                                                                      |
|  [View Delivery App Solution]                                        |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  AI KEY INSIGHTS                                                     |
|                                                                      |
|  [AI-generated paragraph summarizing the estimate, risks,            |
|   recommendations, and next steps]                                   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  CTA SECTION                                                         |
|                                                                      |
|  [Book a Call to Discuss]  [Download Estimate PDF]                   |
|  [Discuss on WhatsApp]                                               |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  CROSS-SELL: OTHER AI TOOLS                                          |
|                                                                      |
|  +---------------------+ +---------------------+                    |
|  | ROI Calculator       | | AI Idea Analyzer    |                    |
|  | See your potential   | | Validate your idea  |                    |
|  | return on investment | | before building     |                    |
|  +---------------------+ +---------------------+                    |
|                                                                      |
+----------------------------------------------------------------------+
|                         FOOTER                                       |
+----------------------------------------------------------------------+
```

---

## 3. Hero / Header Section

### 3.1 Emotional Intent

The visitor must immediately feel: "This is a professional, fast, AI-powered experience -- not a clunky contact form." The green accent signals money, value, action, and progress. The hero must establish credibility (AI-powered) and reduce friction (2 minutes, instant results).

### 3.2 Layout

```
Background: bg-navy (#0F1419)
Section padding: pt-24 pb-12 md:pt-32 md:pb-16 (accounts for sticky nav)
Content: centered, max-w-[768px]
```

**Structure (top to bottom):**

1. **Breadcrumb** -- `Home > Get AI Estimate`
2. **Icon** -- A green calculator/receipt icon (Lucide `Calculator`) inside a 64px circle with `bg-green-500/10` and a subtle green glow ring
3. **Headline** -- centered, max-width 600px
4. **Description** -- centered, max-width 520px
5. **Value proposition pills** -- three inline badges

### 3.3 Visual Description

**Breadcrumb:**
```html
<nav aria-label="Breadcrumb" class="flex items-center justify-center gap-2 text-sm mb-8">
  <a href="/" class="text-muted hover:text-bronze transition-colors">Home</a>
  <ChevronRight class="h-4 w-4 text-muted-light" />
  <span class="text-green-400">Get AI Estimate</span>
</nav>
```

**Icon Circle:**
```html
<div class="mx-auto mb-6 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center
  ring-1 ring-green-500/20">
  <Calculator class="h-8 w-8 text-green-400" aria-hidden="true" />
</div>
```

**Headline:**
```
Get Your AI-Powered Project Estimate
```
- Style: `text-h2` (clamp 1.5rem to 2.625rem), `font-bold`, `text-white`, `text-center`
- The word "AI-Powered" is wrapped in a `<span class="text-green-400">` for accent

**Description:**
```
Answer a few questions about your project and our AI will generate a detailed cost breakdown, timeline, and recommendations -- in under 2 minutes.
```
- Style: `text-lg text-muted text-center`, max-w-[520px], mx-auto, mt-4

**Value Proposition Pills:**
Three inline pill badges, centered, mt-6, gap-3:

```html
<div class="flex flex-wrap items-center justify-center gap-3 mt-6">
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-green-500/10 text-green-300 text-sm font-medium border border-green-500/20">
    <Sparkles class="h-4 w-4" aria-hidden="true" />
    AI-Powered
  </span>
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-slate-blue-light text-muted text-sm font-medium">
    <Clock class="h-4 w-4" aria-hidden="true" />
    Takes 2 Minutes
  </span>
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-slate-blue-light text-muted text-sm font-medium">
    <Zap class="h-4 w-4" aria-hidden="true" />
    Instant Results
  </span>
</div>
```

### 3.4 Animation Sequence (On Page Load)

| Order | Element | Animation | Delay | Duration |
|-------|---------|-----------|-------|----------|
| 1 | Breadcrumb | Fade in | 0ms | 300ms |
| 2 | Icon circle | Scale from 0.8 to 1 + fade in | 100ms | 400ms |
| 3 | Headline | Fade in + translateY(15px to 0) | 200ms | 500ms |
| 4 | Description | Fade in + translateY(10px to 0) | 350ms | 400ms |
| 5 | Value pills | Fade in stagger (3 pills, 80ms apart) | 500ms | 300ms each |

```ts
// Framer Motion implementation
const heroAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroChild = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};
```

---

## 4. Interactive Multi-Step Form

### 4.1 Form Architecture

The form uses a **4-step progressive disclosure pattern**. Each step occupies the same content area. Transitions between steps use a horizontal slide animation (the departing step slides left while the arriving step slides in from the right, or vice versa when going back).

```
Total steps: 4
Step 1: Project Type (single select)
Step 2: Features (multi-select checklist with categories)
Step 3: Timeline (single select)
Step 4: Contact Information (form fields + submit)
```

### 4.2 Stepper Progress Indicator

The stepper sits between the hero and the form content area. It persists across all steps.

**Layout:** Horizontal flex, centered, max-w-[560px], mx-auto, mb-10.

**Design token reference:** Section 7.9 of the design system (Stepper component).

**Steps displayed:**

| Step # | Label | Icon (completed) |
|--------|-------|-------------------|
| 1 | Project Type | CheckIcon |
| 2 | Features | CheckIcon |
| 3 | Timeline | CheckIcon |
| 4 | Contact Info | CheckIcon |

**Green accent override for this tool:** The standard bronze stepper tokens are replaced with green for the Get AI Estimate tool:

```
Completed step circle:     bg-green-500 text-white (checkmark icon)
Current step circle:       border-2 border-green-500 bg-green-500/10 text-green-400
Upcoming step circle:      border-2 border-slate-blue-light bg-transparent text-muted
Completed connector:       bg-green-500
Upcoming connector:        bg-slate-blue-light
Current step label:        text-green-300 font-medium
```

```html
<div class="flex items-center w-full max-w-[560px] mx-auto mb-10">
  <!-- Step 1 - Completed -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
      <Check class="h-5 w-5 text-white" />
    </div>
    <span class="text-xs text-muted mt-2 whitespace-nowrap">Project Type</span>
  </div>
  <div class="h-0.5 flex-1 mx-2 bg-green-500" />
  <!-- Step 2 - Current -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-green-500 bg-green-500/10
      flex items-center justify-center text-sm font-semibold text-green-400">
      2
    </div>
    <span class="text-xs text-green-300 font-medium mt-2 whitespace-nowrap">Features</span>
  </div>
  <div class="h-0.5 flex-1 mx-2 bg-slate-blue-light" />
  <!-- Step 3 - Upcoming -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-slate-blue-light
      flex items-center justify-center text-sm font-semibold text-muted">
      3
    </div>
    <span class="text-xs text-muted mt-2 whitespace-nowrap">Timeline</span>
  </div>
  <div class="h-0.5 flex-1 mx-2 bg-slate-blue-light" />
  <!-- Step 4 - Upcoming -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-slate-blue-light
      flex items-center justify-center text-sm font-semibold text-muted">
      4
    </div>
    <span class="text-xs text-muted mt-2 whitespace-nowrap">Contact Info</span>
  </div>
</div>
```

**Mobile stepper:** On screens < 640px, the step labels are hidden. Only the circles and connectors are shown. A text label below the stepper reads "Step 2 of 4 -- Features" in `text-sm text-green-300`.

### 4.3 Form Content Area

**Container:**
```html
<div class="mx-auto max-w-[720px] px-4 sm:px-6">
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 shadow-md">
    <!-- Step content renders here -->
  </div>
</div>
```

### 4.4 Step 1 -- Project Type

**Question:** "What type of project do you want to build?"
- Style: `text-h4 text-white mb-6`

**Selection type:** Single select via selectable cards (not radio buttons -- cards are more visual and engaging).

**Options (5 cards in a 2-column grid, last card spans full width):**

| Option | Icon (Lucide) | Label | Description |
|--------|---------------|-------|-------------|
| mobile | `Smartphone` | Mobile App | iOS, Android, or Both |
| web | `Globe` | Web Application | SPA, Platform, Dashboard |
| ai | `Brain` | AI / ML Solution | Computer Vision, NLP, Analytics |
| cloud | `Cloud` | Cloud Infrastructure | Scalable Backend & DevOps |
| fullstack | `Layers` | Multiple / Full Stack | Mobile + Web + Backend + AI |

**Selectable Card Design:**

```
Default state:
  Background:   bg-navy (#0F1419)
  Border:       border border-slate-blue-light
  Radius:       rounded-lg (12px)
  Padding:      p-4 md:p-5
  Cursor:       pointer
  Layout:       flex items-start gap-4 (icon left, text right)

Hover state:
  Border:       border-green-500/30
  Background:   bg-green-500/5

Selected state:
  Border:       border-green-500 border-2
  Background:   bg-green-500/10
  Shadow:       shadow-glow-green (0 0 20px rgba(34, 197, 94, 0.2))

Focus state:
  Ring:         ring-2 ring-green-500 ring-offset-2 ring-offset-slate-blue
```

```html
<!-- Selectable Card (selected state) -->
<button
  role="radio"
  aria-checked="true"
  class="w-full flex items-start gap-4 p-4 md:p-5 rounded-lg border-2 border-green-500
    bg-green-500/10 shadow-glow-green text-left transition-all duration-200
    focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-slate-blue"
>
  <div class="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
    <Smartphone class="h-5 w-5 text-green-400" />
  </div>
  <div>
    <span class="block text-base font-semibold text-white">Mobile App</span>
    <span class="block text-sm text-green-300/80 mt-0.5">iOS, Android, or Both</span>
  </div>
  <!-- Check indicator (only shown when selected) -->
  <div class="ml-auto flex-shrink-0 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
    <Check class="h-4 w-4 text-white" />
  </div>
</button>
```

**Grid layout:**
```html
<div role="radiogroup" aria-label="Project type" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <!-- Cards 1-4 in 2x2 -->
  <!-- Card 5 (Full Stack) spans full width: class="sm:col-span-2" -->
</div>
```

**Validation:** At least one option must be selected. The "Next" button is disabled (dimmed) until a selection is made.

**Navigation buttons:**
```html
<div class="flex justify-end mt-8">
  <button class="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-sm
    hover:bg-green-600 hover:shadow-md hover:scale-[1.02]
    active:bg-green-700 active:scale-[0.98]
    disabled:opacity-40 disabled:cursor-not-allowed
    transition-all duration-200
    inline-flex items-center gap-2">
    Next: Features
    <ArrowRight class="h-5 w-5" />
  </button>
</div>
```

### 4.5 Step 2 -- Features

**Question:** "What features does your project need?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "Select all that apply. You can also add custom features below."
- Style: `text-sm text-muted mb-6`

**Selection type:** Multi-select checkboxes organized by category. Each category is a collapsible group (accordion-like).

**Feature Categories and Options:**

**Category: Core Features**
| Feature | Description |
|---------|-------------|
| User Authentication | Sign up, login, social auth, password reset |
| User Profiles | User dashboard, settings, preferences |
| Push Notifications | Real-time alerts and messaging |
| In-App Messaging | Chat or messaging between users |
| Search & Filtering | Advanced search with filters |
| Admin Dashboard | Content management, analytics, user management |

**Category: Payments & Commerce**
| Feature | Description |
|---------|-------------|
| Payment Processing | Credit card, debit, Stripe/PayPal integration |
| Subscription / Plans | Recurring billing, plan management |
| Shopping Cart | Product catalog, cart, checkout flow |
| Invoice Generation | PDF invoices, billing history |

**Category: AI & Intelligence**
| Feature | Description |
|---------|-------------|
| AI Chatbot | Conversational AI assistant |
| Image Recognition | Computer vision, object detection |
| Recommendation Engine | Personalized content/product suggestions |
| Natural Language Processing | Text analysis, sentiment, translation |
| Predictive Analytics | Data-driven forecasting |

**Category: Media & Content**
| Feature | Description |
|---------|-------------|
| File Upload & Storage | Images, documents, video upload |
| Camera Integration | Photo/video capture, QR scanning |
| Maps & Location | GPS, geofencing, location services |
| Video Streaming | Live or recorded video playback |

**Category: Integration & Infrastructure**
| Feature | Description |
|---------|-------------|
| API Integration | Connect with third-party services |
| Social Media Sharing | Share content to social platforms |
| Analytics & Reporting | Usage tracking, custom reports |
| Multi-language Support | i18n, RTL support |
| Offline Mode | Work without internet connection |

**Category layout:**

```html
<div class="space-y-4">
  <!-- Category Group -->
  <div class="border border-slate-blue-light rounded-lg overflow-hidden">
    <button class="w-full flex items-center justify-between p-4 bg-navy
      hover:bg-slate-blue-light/30 transition-colors group"
      aria-expanded="true">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center">
          <Shield class="h-4 w-4 text-green-400" />
        </div>
        <span class="text-base font-semibold text-white">Core Features</span>
        <span class="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
          3 selected
        </span>
      </div>
      <ChevronDown class="h-5 w-5 text-muted group-hover:text-white transition-colors
        group-aria-expanded:rotate-180 transition-transform duration-200" />
    </button>
    <div class="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Feature checkbox items -->
    </div>
  </div>
</div>
```

**Feature Checkbox Item:**

```html
<label class="flex items-start gap-3 p-3 rounded-lg border border-transparent
  hover:bg-green-500/5 hover:border-green-500/20 cursor-pointer transition-all duration-150
  has-[:checked]:bg-green-500/8 has-[:checked]:border-green-500/25">
  <input type="checkbox" name="features[]" value="user-auth"
    class="mt-0.5 h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent
    checked:bg-green-500 checked:border-green-500
    focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-slate-blue
    transition-colors duration-200" />
  <div>
    <span class="block text-sm font-medium text-off-white">User Authentication</span>
    <span class="block text-xs text-muted mt-0.5">Sign up, login, social auth, password reset</span>
  </div>
</label>
```

**Custom Feature Input:**

Below the categories, a text input lets users add features not listed:

```html
<div class="mt-6">
  <label class="block text-sm font-medium text-off-white mb-1.5">
    Need something else? Add custom features
  </label>
  <div class="flex gap-3">
    <input type="text"
      class="flex-1 h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none
        transition-all duration-200"
      placeholder="e.g., Barcode scanner, loyalty points..."
    />
    <button class="h-11 px-4 bg-green-500/15 text-green-300 border border-green-500/30
      rounded-lg text-sm font-medium hover:bg-green-500/25 transition-colors"
      type="button">
      Add
    </button>
  </div>
  <!-- Added custom features as removable pills -->
  <div class="flex flex-wrap gap-2 mt-3">
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
      bg-green-500/10 text-green-300 text-sm border border-green-500/20">
      Barcode Scanner
      <button aria-label="Remove Barcode Scanner" class="hover:text-white transition-colors">
        <X class="h-3.5 w-3.5" />
      </button>
    </span>
  </div>
</div>
```

**Feature counter:** A floating summary at the bottom of the card shows: "**X features selected**" in `text-sm text-green-300`.

**Validation:** At least 1 feature must be selected to proceed.

**Navigation:**
```html
<div class="flex justify-between mt-8">
  <button class="h-11 px-5 bg-transparent text-muted font-semibold rounded-lg
    hover:text-white hover:bg-slate-blue-light/40 transition-all duration-200
    inline-flex items-center gap-2">
    <ArrowLeft class="h-5 w-5" />
    Back
  </button>
  <button class="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg ...">
    Next: Timeline
    <ArrowRight class="h-5 w-5" />
  </button>
</div>
```

### 4.6 Step 3 -- Timeline

**Question:** "What's your ideal timeline?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "This helps us recommend the right approach and team size."
- Style: `text-sm text-muted mb-6`

**Selection type:** Single select via horizontal card options (similar to Step 1 but styled differently for variety).

**Options:**

| Option | Icon | Label | Description | Badge |
|--------|------|-------|-------------|-------|
| asap | `Zap` | ASAP | 1-2 months | Rush |
| standard | `Clock` | Standard | 2-4 months | Recommended |
| flexible | `Calendar` | Flexible | 4-6 months | Best Value |
| unsure | `HelpCircle` | Not Sure | We will recommend | -- |

**Card design:** Similar to Step 1 selectable cards but arranged in a single column (vertical stack) since there are fewer options and descriptions matter more.

The "Recommended" badge on the Standard option uses:
```html
<span class="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-xs font-semibold
  bg-green-500 text-white shadow-sm">
  Recommended
</span>
```

**Validation:** At least one option must be selected. Default: none selected.

### 4.7 Step 4 -- Contact Information

**Question:** "Almost there! How should we send your estimate?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "We'll email you the full estimate with a downloadable PDF."
- Style: `text-sm text-muted mb-6`

**Form Fields:**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| Full Name | text | Yes | Min 2 chars | "John Doe" |
| Email | email | Yes | Valid email regex | "you@company.com" |
| Company | text | No | -- | "Your Company (optional)" |
| Phone | tel | No | Valid phone format | "+1 (555) 000-0000" |
| Project Description | textarea | No | Max 500 chars | "Briefly describe your project vision..." |
| WhatsApp checkbox | checkbox | No | -- | "Also send estimate via WhatsApp" |

**Field layout:** Single column, gap-4.

```html
<div class="space-y-4">
  <!-- Name -->
  <div class="space-y-1.5">
    <label for="est-name" class="block text-sm font-medium text-off-white">
      Full Name <span class="text-error">*</span>
    </label>
    <input id="est-name" type="text" required
      class="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none
        focus:ring-1 focus:ring-green-500
        transition-all duration-200"
      placeholder="John Doe" />
  </div>

  <!-- Email -->
  <div class="space-y-1.5">
    <label for="est-email" class="block text-sm font-medium text-off-white">
      Email Address <span class="text-error">*</span>
    </label>
    <input id="est-email" type="email" required
      class="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none
        focus:ring-1 focus:ring-green-500
        transition-all duration-200"
      placeholder="you@company.com" />
  </div>

  <!-- Company (optional) -->
  <div class="space-y-1.5">
    <label for="est-company" class="block text-sm font-medium text-off-white">
      Company <span class="text-muted text-xs">(optional)</span>
    </label>
    <input id="est-company" type="text"
      class="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none
        focus:ring-1 focus:ring-green-500
        transition-all duration-200"
      placeholder="Your Company" />
  </div>

  <!-- Phone (optional) -->
  <div class="space-y-1.5">
    <label for="est-phone" class="block text-sm font-medium text-off-white">
      Phone Number <span class="text-muted text-xs">(optional)</span>
    </label>
    <input id="est-phone" type="tel"
      class="w-full h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none
        focus:ring-1 focus:ring-green-500
        transition-all duration-200"
      placeholder="+962 7XX XXX XXX" />
  </div>

  <!-- Project Description (optional) -->
  <div class="space-y-1.5">
    <label for="est-desc" class="block text-sm font-medium text-off-white">
      Project Description <span class="text-muted text-xs">(optional)</span>
    </label>
    <textarea id="est-desc" rows="3"
      class="w-full min-h-[100px] px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light resize-y
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-green-500 focus:text-white focus:outline-none
        focus:ring-1 focus:ring-green-500
        transition-all duration-200"
      placeholder="Briefly describe your project vision..."
      maxlength="500"></textarea>
    <span class="text-xs text-muted">0/500 characters</span>
  </div>

  <!-- WhatsApp checkbox -->
  <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-blue-light
    hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-150">
    <input type="checkbox" name="whatsapp"
      class="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent
        checked:bg-green-500 checked:border-green-500
        focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-slate-blue
        transition-colors duration-200" />
    <div class="flex items-center gap-2">
      <svg class="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <!-- WhatsApp icon SVG path -->
      </svg>
      <span class="text-sm text-off-white">Also send estimate via WhatsApp</span>
    </div>
  </label>

  <!-- Privacy notice -->
  <p class="text-xs text-muted">
    By submitting, you agree to our
    <a href="/privacy" class="text-green-400 hover:underline">Privacy Policy</a>.
    We will never share your information.
  </p>
</div>
```

**Submit button:**
```html
<div class="flex justify-between mt-8">
  <button class="... back-button-styles">
    <ArrowLeft class="h-5 w-5" /> Back
  </button>
  <button type="submit"
    class="h-12 px-8 bg-green-500 text-white font-semibold rounded-lg shadow-md
    hover:bg-green-600 hover:shadow-lg hover:scale-[1.02]
    active:bg-green-700 active:scale-[0.98]
    disabled:opacity-40 disabled:cursor-not-allowed
    transition-all duration-200
    inline-flex items-center gap-2 text-lg">
    <Sparkles class="h-5 w-5" />
    Generate My Estimate
  </button>
</div>
```

### 4.8 Step Transition Animation

When moving between steps, the form content area transitions with a slide effect:

```ts
// Framer Motion AnimatePresence configuration
const stepTransition = {
  initial: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  }),
};
```

The `direction` variable is `1` for forward, `-1` for backward. This creates a natural left-to-right flow that matches reading direction (reversed in RTL).

### 4.9 Trust Strip (Below Form)

A subtle strip of trust indicators sits below the form card:

```html
<div class="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted">
  <span class="inline-flex items-center gap-1.5">
    <Lock class="h-4 w-4" aria-hidden="true" /> No spam, ever
  </span>
  <span class="inline-flex items-center gap-1.5">
    <Clock class="h-4 w-4" aria-hidden="true" /> Takes under 2 minutes
  </span>
  <span class="inline-flex items-center gap-1.5">
    <ShieldCheck class="h-4 w-4" aria-hidden="true" /> Data encrypted
  </span>
</div>
```

---

## 5. AI Processing State

### 5.1 Trigger

After the user submits Step 4, the form card transitions to a full-area loading state. The form fields are replaced entirely by the processing visualization.

### 5.2 Visual Design

The loading state occupies the same card container as the form steps. It is centered content within the card.

```
+--------------------------------------------------------------+
|                                                                |
|                                                                |
|            [Animated green pulse ring]                         |
|            [AI sparkle icon in center]                         |
|                                                                |
|            Our AI Is Analyzing Your Project                    |
|                                                                |
|            [Progress bar: 0% to 100%]                         |
|                                                                |
|            [Rotating status messages]                          |
|            "Evaluating feature complexity..."                  |
|                                                                |
|                                                                |
+--------------------------------------------------------------+
```

**Animated icon:** A Sparkles icon (24px, text-green-400) sits inside a 72px circle with `bg-green-500/10`. Three concentric rings pulse outward from the center:

```html
<div class="relative mx-auto h-[72px] w-[72px]">
  <!-- Pulse rings -->
  <span class="absolute inset-0 rounded-full bg-green-500/10 animate-ping"
    style="animation-duration: 2s;" />
  <span class="absolute inset-[-8px] rounded-full bg-green-500/5 animate-ping"
    style="animation-duration: 2.5s; animation-delay: 0.3s;" />
  <!-- Center icon -->
  <div class="relative h-full w-full rounded-full bg-green-500/10 flex items-center justify-center
    ring-1 ring-green-500/30">
    <Sparkles class="h-8 w-8 text-green-400 animate-pulse" />
  </div>
</div>
```

**Headline:** "Our AI Is Analyzing Your Project"
- Style: `text-xl font-semibold text-white mt-8 text-center`

**Progress bar:** A horizontal progress bar that fills from 0% to 100% over approximately 8-12 seconds (the actual API call time). If the API resolves faster, the bar jumps to 100%.

```html
<div class="max-w-[300px] mx-auto mt-6">
  <div class="h-1.5 w-full bg-slate-blue-light rounded-full overflow-hidden">
    <div class="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
      style="width: 45%;" />
  </div>
</div>
```

**Rotating status messages:** A single line of text that changes every 2-3 seconds with a crossfade:

```
Messages (cycle through):
1. "Evaluating feature complexity..."
2. "Calculating development effort..."
3. "Comparing with similar projects..."
4. "Estimating timeline and phases..."
5. "Generating detailed breakdown..."
6. "Preparing your personalized estimate..."
```

Style: `text-sm text-muted text-center mt-4`

Animation: Each message fades out (200ms) then the next fades in (200ms).

```ts
// Framer Motion AnimatePresence for rotating messages
<AnimatePresence mode="wait">
  <motion.p
    key={currentMessage}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    className="text-sm text-muted text-center mt-4"
  >
    {messages[currentMessage]}
  </motion.p>
</AnimatePresence>
```

### 5.3 Duration

- **Minimum display time:** 3 seconds (even if API responds instantly, show the animation for at least 3 seconds to maintain the perception that AI is working)
- **Maximum wait time:** 30 seconds before showing a timeout error
- **Expected time:** 5-10 seconds for Gemini API response

### 5.4 Transition to Results

When the estimate is ready, the loading state fades out and the results page fades in with a celebration micro-animation: a brief green checkmark appears (scale from 0 to 1, with a bounce ease) before transitioning to the full results view.

```ts
const celebrationSequence = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};
```

---

## 6. Results Display

### 6.1 Results Header

```html
<div class="text-center mb-10">
  <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-green-500/15 flex items-center justify-center">
    <CheckCircle class="h-8 w-8 text-green-400" />
  </div>
  <h1 class="text-h2 text-white">Your Project Estimate Is Ready</h1>
  <p class="text-lg text-muted mt-3 max-w-[520px] mx-auto">
    Based on your inputs, here is what we recommend for your project.
  </p>
</div>
```

### 6.2 Summary Cards (3 across)

Three highlight cards showing the key metrics at a glance.

```html
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
  <!-- Cost Card -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 text-center">
    <div class="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
      <DollarSign class="h-5 w-5 text-green-400" />
    </div>
    <p class="text-sm text-muted">Estimated Cost</p>
    <p class="text-2xl font-bold text-white mt-1">$12,000 - $18,000</p>
  </div>

  <!-- Timeline Card -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 text-center">
    <div class="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
      <Clock class="h-5 w-5 text-green-400" />
    </div>
    <p class="text-sm text-muted">Estimated Timeline</p>
    <p class="text-2xl font-bold text-white mt-1">8 - 12 Weeks</p>
  </div>

  <!-- Approach Card -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 text-center">
    <div class="mx-auto mb-3 h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
      <Wrench class="h-5 w-5 text-green-400" />
    </div>
    <p class="text-sm text-muted">Recommended Approach</p>
    <p class="text-2xl font-bold text-white mt-1">Custom Build</p>
  </div>
</div>
```

**Animation:** Cards stagger in with `fadeInUp` variant, 100ms stagger between each.

### 6.3 Detailed Breakdown Table

A structured table showing the phase-by-phase cost and timeline breakdown.

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl overflow-hidden mb-8">
  <div class="px-6 py-4 border-b border-slate-blue-light">
    <h2 class="text-lg font-semibold text-white">Project Breakdown</h2>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-slate-blue-light">
          <th class="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider">Phase</th>
          <th class="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider text-right">Cost</th>
          <th class="px-6 py-3 text-sm font-semibold text-muted uppercase tracking-wider text-right">Duration</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-blue-light">
        <tr class="hover:bg-navy/50 transition-colors">
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <span class="h-6 w-6 rounded-full bg-green-500/15 flex items-center justify-center
                text-xs font-semibold text-green-400">1</span>
              <span class="text-sm font-medium text-off-white">Discovery & Planning</span>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-off-white text-right">$1,500</td>
          <td class="px-6 py-4 text-sm text-muted text-right">1 week</td>
        </tr>
        <!-- Additional rows follow the same pattern -->
      </tbody>
      <tfoot>
        <tr class="border-t-2 border-green-500/30 bg-green-500/5">
          <td class="px-6 py-4 text-sm font-bold text-white">Total</td>
          <td class="px-6 py-4 text-sm font-bold text-green-400 text-right">$14,000</td>
          <td class="px-6 py-4 text-sm font-bold text-green-400 text-right">11 weeks</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
```

### 6.4 Ready-Made Solution Match (Conditional)

If the user's selected features closely match one of the 7 Ready-Made Solutions, display a recommendation card. This only appears when a match is found.

```html
<div class="bg-gradient-to-br from-tool-green-dark to-slate-blue border border-green-500/20
  rounded-xl p-6 md:p-8 mb-8">
  <div class="flex items-start gap-4">
    <div class="h-12 w-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
      <Rocket class="h-6 w-6 text-green-400" />
    </div>
    <div class="flex-1">
      <p class="text-sm font-semibold text-green-300 uppercase tracking-wider">Faster Alternative</p>
      <h3 class="text-xl font-bold text-white mt-1">
        Our Delivery App Solution Could Save You 40%
      </h3>
      <p class="text-muted mt-2">
        Based on your requirements, our pre-built Delivery App solution covers 85% of your
        features at a starting price of $10,000, deployable in just 35 days.
      </p>
      <a href="/solutions/delivery-app"
        class="inline-flex items-center gap-2 mt-4 text-green-400 font-semibold
        hover:text-green-300 transition-colors group">
        View Delivery App Solution
        <ArrowRight class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
</div>
```

### 6.5 AI Key Insights

A paragraph generated by the Gemini AI summarizing the estimate, calling out risks, and providing recommendations.

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 mb-8">
  <div class="flex items-center gap-3 mb-4">
    <div class="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
      <Lightbulb class="h-5 w-5 text-green-400" />
    </div>
    <h2 class="text-lg font-semibold text-white">AI Insights</h2>
  </div>
  <div class="prose prose-invert prose-sm max-w-none">
    <p class="text-off-white leading-relaxed">
      <!-- AI-generated content renders here -->
      Based on your requirements for a mobile app with user authentication, payment processing,
      and push notifications, we recommend a phased approach starting with core features.
      The payment integration will be the most complex component, requiring approximately 3 weeks
      of dedicated development. We suggest launching with iOS first to validate the concept,
      then expanding to Android in Phase 2. This approach could reduce your initial investment
      by 30% while still getting to market quickly.
    </p>
  </div>
</div>
```

---

## 7. Cross-Sell / CTA Section

### 7.1 Primary CTA Bar

Immediately after the AI insights, a prominent CTA section drives the next action.

```html
<div class="bg-slate-blue border border-green-500/20 rounded-xl p-6 md:p-8 mb-8">
  <div class="text-center">
    <h2 class="text-h3 text-white">Ready to Move Forward?</h2>
    <p class="text-muted mt-2 max-w-[400px] mx-auto">
      Discuss your estimate with our team and get a finalized proposal.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      <!-- Primary: Book a Call (Calendly) -->
      <a href="/contact#book-call"
        class="h-12 px-8 bg-bronze text-white font-semibold rounded-lg shadow-md
        hover:bg-bronze-hover hover:shadow-lg hover:scale-[1.02]
        active:scale-[0.98]
        transition-all duration-200
        inline-flex items-center gap-2">
        <Calendar class="h-5 w-5" />
        Book a Call to Discuss
      </a>
      <!-- Secondary: Download PDF -->
      <button
        class="h-12 px-6 bg-transparent text-off-white border border-slate-blue-light
        font-semibold rounded-lg
        hover:bg-slate-blue-light/40 hover:border-gray-600
        transition-all duration-200
        inline-flex items-center gap-2">
        <Download class="h-5 w-5" />
        Download Estimate PDF
      </button>
    </div>
    <!-- WhatsApp CTA -->
    <a href="https://wa.me/962XXXXXXXXX?text=Hi!%20I%20just%20got%20an%20AI%20estimate..."
      class="inline-flex items-center gap-2 mt-4 text-green-400 font-medium text-sm
      hover:text-green-300 transition-colors">
      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <!-- WhatsApp icon -->
      </svg>
      Discuss on WhatsApp
    </a>
  </div>
</div>
```

### 7.2 Cross-Sell Other AI Tools

Below the CTA, recommend the two most relevant other tools.

```html
<div class="mb-12">
  <h3 class="text-lg font-semibold text-white text-center mb-6">Continue Exploring</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
    <!-- ROI Calculator -->
    <a href="/roi-calculator"
      class="bg-gradient-to-br from-tool-purple-dark to-slate-blue border border-purple-500/20
      rounded-xl p-5 hover:shadow-glow-purple hover:-translate-y-1 group transition-all duration-300">
      <div class="h-10 w-10 rounded-lg bg-purple-500/15 flex items-center justify-center mb-3">
        <TrendingUp class="h-5 w-5 text-purple-400" />
      </div>
      <h4 class="text-base font-semibold text-white">AI ROI Calculator</h4>
      <p class="text-sm text-purple-300/80 mt-1">See your potential return on investment.</p>
      <span class="inline-flex items-center gap-1.5 mt-3 text-sm text-purple-400 font-medium
        group-hover:gap-2.5 transition-all">
        Calculate ROI <ArrowRight class="h-4 w-4" />
      </span>
    </a>

    <!-- AI Idea Analyzer -->
    <a href="/idea-analyzer"
      class="bg-gradient-to-br from-tool-blue-dark to-slate-blue border border-blue-500/20
      rounded-xl p-5 hover:shadow-glow-blue hover:-translate-y-1 group transition-all duration-300">
      <div class="h-10 w-10 rounded-lg bg-blue-500/15 flex items-center justify-center mb-3">
        <Search class="h-5 w-5 text-blue-400" />
      </div>
      <h4 class="text-base font-semibold text-white">AI Idea Analyzer</h4>
      <p class="text-sm text-blue-300/80 mt-1">Validate your idea before building.</p>
      <span class="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-400 font-medium
        group-hover:gap-2.5 transition-all">
        Analyze Your Idea <ArrowRight class="h-4 w-4" />
      </span>
    </a>
  </div>
</div>
```

---

## 8. Responsive Behavior

### 8.1 Breakpoint Behavior

| Section | Mobile (< 640px) | Tablet (640-1023px) | Desktop (1024px+) |
|---------|-------------------|--------------------|--------------------|
| Hero | Single column centered, smaller heading, pills wrap to 2 rows | Same as desktop but tighter | Centered, full heading |
| Stepper | Circles only, no labels. "Step X of 4" text below | Full stepper with labels | Full stepper with labels |
| Form card | `p-4`, full-width | `p-6` | `p-8`, max-w-[720px] |
| Step 1 cards | Single column stack | 2-column grid | 2-column grid |
| Step 2 features | Single column checkboxes | 2-column checkboxes | 2-column checkboxes |
| Step 4 fields | Single column | Single column | Single column |
| Navigation buttons | Full width, stacked (submit on top) | Inline, `justify-between` | Inline, `justify-between` |
| Results summary | Single column, stacked cards | 3-column row | 3-column row |
| Breakdown table | Horizontal scroll | Full table | Full table |
| CTA buttons | Full width, stacked | Inline | Inline |
| Cross-sell cards | Single column | 2-column | 2-column |

### 8.2 Mobile-Specific Adjustments

- **Step 1 cards:** Stack vertically. Reduce padding to `p-3`. Icon size to 32px.
- **Step 2 categories:** All categories start expanded on mobile (no need to tap to open). Checkboxes in single column.
- **Step navigation:** "Back" button becomes a text link with left arrow above the form card. "Next" button is full width at the bottom.
- **Results page:** Summary cards stack vertically with reduced padding. The breakdown table gets `overflow-x-auto` with a horizontal scroll hint.
- **Touch targets:** All selectable cards maintain minimum 48px height. Checkboxes have 48px touch area via padding.

### 8.3 Mobile Navigation Pattern

On mobile, the navigation between form steps also supports horizontal swipe gestures:

```ts
// Framer Motion drag configuration
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.x < -100) goToNextStep();
    if (info.offset.x > 100) goToPreviousStep();
  }}
>
  {/* Step content */}
</motion.div>
```

---

## 9. Component Mapping

| UI Element | Component Name | Design System Reference |
|------------|----------------|------------------------|
| Page container | `<main>` with standard container | Section 4.4 (Full-Width Section) |
| Breadcrumb | `<Breadcrumb />` | Section 7.4 (Navigation) |
| Hero icon | Custom composition | Lucide `Calculator` + custom circle |
| Headline | `<h1>` with `text-h2` class | Section 2.3 (Heading Styles) |
| Value pills | `<Badge variant="tool-green" />` | Section 7.5 (Badges) |
| Stepper | `<Stepper steps={4} current={step} accentColor="green" />` | Section 7.9 (Progress) |
| Form card | `<Card variant="default" />` with `rounded-xl` | Section 7.2 (Cards) |
| Selectable cards (Step 1, 3) | `<SelectableCard />` | Custom -- based on Card pattern |
| Checkboxes (Step 2) | `<Checkbox />` | Section 7.3 (Form Inputs) |
| Category accordion (Step 2) | `<AccordionGroup />` | Section 7.8 (Accordion) |
| Text input fields (Step 4) | `<TextInput />` | Section 7.3 (Text Input) |
| Textarea (Step 4) | `<Textarea />` | Section 7.3 (Textarea) |
| Submit button | `<Button variant="tool-green" size="lg" />` | Section 7.1 (Buttons) |
| Back button | `<Button variant="ghost" />` | Section 7.1 (Ghost) |
| Loading animation | `<AIProcessingState tool="estimate" />` | Custom |
| Progress bar (loading) | `<ProgressBar color="green" />` | Section 7.9 (Progress Bar) |
| Summary cards (results) | `<MetricCard />` | Custom -- based on Card |
| Breakdown table | `<Table />` | Custom |
| Ready-Made match card | `<FeatureCard variant="tool-green" />` | Section 7.2 (Featured Card) |
| CTA section | `<CTASection />` | Custom composition |
| Cross-sell cards | `<ToolCard accentColor="purple/blue" />` | Section 7.2 (AI Tool Card) |
| Trust indicators | `<TrustStrip />` | Custom |
| Toast notifications | `<Toast />` | Section 7.10 |

---

## 10. Accessibility

### 10.1 Keyboard Navigation Flow

The keyboard navigation follows a logical top-to-bottom, left-to-right flow through each step:

**Step 1 (Project Type):**
1. Tab to first selectable card
2. Arrow keys (Up/Down or Left/Right) to navigate between cards within the `radiogroup`
3. Space or Enter to select a card
4. Tab to "Next" button
5. Enter to proceed

**Step 2 (Features):**
1. Tab to first category header (accordion toggle)
2. Enter/Space to expand/collapse category
3. Tab into checkboxes within the expanded category
4. Space to toggle individual checkboxes
5. Tab to custom feature input
6. Tab to navigation buttons

**Step 3 (Timeline):**
Same pattern as Step 1 (radiogroup).

**Step 4 (Contact Info):**
Standard form field tabbing: Name > Email > Company > Phone > Description > WhatsApp checkbox > Submit.

### 10.2 ARIA Labels and Roles

```html
<!-- Page landmark -->
<main aria-label="Get AI Estimate">

<!-- Stepper -->
<nav aria-label="Estimate form progress" role="navigation">
  <ol class="flex items-center" role="list">
    <li role="listitem" aria-current="step">
      <span class="sr-only">Step 2 of 4: Features (current step)</span>
    </li>
  </ol>
</nav>

<!-- Step 1: Radio group -->
<fieldset>
  <legend class="text-h4 text-white mb-6">What type of project do you want to build?</legend>
  <div role="radiogroup" aria-label="Project type">
    <button role="radio" aria-checked="true" aria-label="Mobile App: iOS, Android, or Both">
      ...
    </button>
    <button role="radio" aria-checked="false" aria-label="Web Application: SPA, Platform, Dashboard">
      ...
    </button>
  </div>
</fieldset>

<!-- Step 2: Feature categories -->
<fieldset>
  <legend class="text-h4 text-white mb-2">What features does your project need?</legend>
  <div role="group" aria-label="Core Features">
    <button aria-expanded="true" aria-controls="core-features-panel">
      Core Features (3 selected)
    </button>
    <div id="core-features-panel" role="region">
      <label>
        <input type="checkbox" aria-describedby="auth-desc" />
        <span>User Authentication</span>
        <span id="auth-desc" class="sr-only">Sign up, login, social auth, password reset</span>
      </label>
    </div>
  </div>
</fieldset>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-label="Generating your estimate">
  <span class="sr-only">Analyzing your project requirements. Please wait.</span>
  <p aria-live="polite">Evaluating feature complexity...</p>
</div>

<!-- Results -->
<section aria-label="Your project estimate results">
  <h1>Your Project Estimate Is Ready</h1>
  <!-- Summary cards use aria-describedby for context -->
  <div aria-label="Estimated cost: $12,000 to $18,000">...</div>
</section>
```

### 10.3 Screen Reader Experience

1. On page load, screen reader announces: "Get AI Estimate page. Breadcrumb: Home, Get AI Estimate."
2. Heading structure: H1 for page title, H2 for each step question, H3 for categories in Step 2.
3. When a step changes, focus moves to the step question heading and the screen reader announces: "Step 2 of 4: Features."
4. During loading, `aria-live="polite"` announces each rotating message.
5. When results are ready, focus moves to the results heading and the screen reader announces: "Your Project Estimate Is Ready."
6. The breakdown table uses proper `<th scope="col">` and `<th scope="row">` for full table navigation.

### 10.4 Focus Management

- When a step transitions, focus moves programmatically to the new step's question heading.
- When the loading state appears, focus moves to the loading status element.
- When results appear, focus moves to the results heading.
- All focus moves use `scrollIntoView({ behavior: 'smooth', block: 'start' })`.

### 10.5 Color Contrast Verification

| Foreground | Background | Ratio | Pass |
|-----------|-----------|-------|------|
| Green `#22C55E` on Navy `#0F1419` | -- | 7.2:1 | AA (all sizes) |
| Green-300 `#86EFAC` on Navy `#0F1419` | -- | 11.8:1 | AAA |
| Green-400 `#4ADE80` on Navy `#0F1419` | -- | 8.7:1 | AAA |
| White on Green-500 `#22C55E` | -- | 3.4:1 | AA (large text, 16px bold = large) |
| Green-300 `#86EFAC` on Slate-Blue `#1A2332` | -- | 8.2:1 | AAA |
| Muted `#9CA3AF` on Navy `#0F1419` | -- | 7.3:1 | AA |

---

## 11. RTL Considerations

### 11.1 Layout Mirroring

When the site language is Arabic (`dir="rtl"`):

- **Stepper:** Flows right-to-left. Step 1 is on the right, Step 4 on the left. Connectors reverse.
- **Form card content:** Text aligns to the right. Labels are right-aligned.
- **Navigation buttons:** "Back" button moves to the right (with a left-arrow still pointing "back" in the flow direction, which in RTL means right-pointing). "Next" button moves to the left.
- **Step transition direction:** Reversed. Forward steps slide in from the left. Back steps slide in from the right.
- **Selectable cards grid:** Remains 2-column but reading order starts from the right column.
- **Checkboxes:** Checkbox element moves to the right side of the label.
- **Breakdown table:** Columns remain in logical order but text aligns right.
- **Icons in buttons:** Arrow icons flip horizontally (ArrowRight becomes ArrowLeft visually).

### 11.2 Typography in Arabic

- Font: System Arabic fallback (no separate Arabic font needed for Inter -- the system font handles Arabic glyphs with `sans-serif`).
- Line height: Increase by approximately 10% for Arabic text readability.
- Letter spacing: Reset to `0` for Arabic (negative tracking breaks Arabic ligatures).

### 11.3 Implementation

```html
<!-- HTML -->
<html lang="ar" dir="rtl">

<!-- Tailwind RTL utilities -->
<button class="flex items-center gap-2 rtl:flex-row-reverse">
  Next <ArrowRight class="h-5 w-5 rtl:rotate-180" />
</button>

<!-- Checkbox alignment -->
<label class="flex items-start gap-3 rtl:flex-row-reverse">
  <input type="checkbox" />
  <span>Also send via WhatsApp</span>
</label>
```

### 11.4 Exact Arabic Copy (Key Elements)

| English | Arabic |
|---------|--------|
| Get Your AI-Powered Project Estimate | احصل على تقدير مشروعك بالذكاء الاصطناعي |
| What type of project do you want to build? | ما نوع المشروع الذي تريد بناءه؟ |
| What features does your project need? | ما الميزات التي يحتاجها مشروعك؟ |
| What's your ideal timeline? | ما هو الجدول الزمني المثالي؟ |
| Generate My Estimate | إنشاء التقدير |
| Your Project Estimate Is Ready | تقدير مشروعك جاهز |
| Book a Call to Discuss | احجز مكالمة للمناقشة |

---

## 12. Error States

### 12.1 Validation Errors

**Inline field errors (Step 4):**

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-off-white">
    Email Address <span class="text-error">*</span>
  </label>
  <input type="email" aria-invalid="true" aria-describedby="email-error"
    class="w-full h-11 px-3 py-2.5 bg-navy border border-error rounded-lg
      text-base text-off-white
      focus:ring-1 focus:ring-error focus:outline-none" />
  <p id="email-error" class="text-sm text-error mt-1 flex items-center gap-1.5" role="alert">
    <AlertCircle class="h-4 w-4 flex-shrink-0" />
    Please enter a valid email address.
  </p>
</div>
```

**Step validation (Steps 1-3):**

If the user tries to proceed without selecting an option, a toast notification appears:

```
"Please select a project type to continue."
```

Style: Error toast (border-l-4 border-l-error).

The "Next" button shakes briefly (horizontal translate -4px to 4px to 0, 200ms):

```ts
const shakeAnimation = {
  x: [0, -4, 4, -4, 4, 0],
  transition: { duration: 0.3 },
};
```

### 12.2 API Error (Estimate Generation Failed)

If the Gemini API call fails, replace the loading state with an error card:

```html
<div class="text-center py-12">
  <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-error-dark flex items-center justify-center">
    <AlertTriangle class="h-8 w-8 text-error" />
  </div>
  <h2 class="text-xl font-semibold text-white">Something went wrong</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    Our AI had trouble processing your request. This is usually temporary.
  </p>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
    <button class="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg
      hover:bg-green-600 transition-all duration-200
      inline-flex items-center gap-2">
      <RotateCcw class="h-5 w-5" />
      Try Again
    </button>
    <a href="/contact" class="h-11 px-6 bg-transparent text-off-white border border-slate-blue-light
      font-semibold rounded-lg hover:bg-slate-blue-light/40 transition-all duration-200
      inline-flex items-center gap-2">
      Contact Us Instead
    </a>
  </div>
</div>
```

### 12.3 Rate Limiting

If a user has already submitted multiple estimates in a short period:

```html
<div class="text-center py-8 px-6">
  <Clock class="h-12 w-12 text-warning mx-auto mb-4" />
  <h2 class="text-xl font-semibold text-white">Slow Down a Bit</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    You've generated several estimates recently. Please wait a few minutes before trying again,
    or contact us directly.
  </p>
  <a href="/contact"
    class="inline-flex items-center gap-2 mt-4 text-bronze font-semibold hover:text-bronze-light transition-colors">
    Contact Us <ArrowRight class="h-4 w-4" />
  </a>
</div>
```

### 12.4 Network Disconnection

If the user loses internet connectivity during the form:

```html
<div class="bg-warning-dark/50 border border-warning/30 rounded-lg p-4 flex items-start gap-3 mb-4"
  role="alert">
  <WifiOff class="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-sm font-medium text-warning">You appear to be offline</p>
    <p class="text-sm text-muted mt-0.5">
      Your form progress is saved. The estimate will be generated when you reconnect.
    </p>
  </div>
</div>
```

### 12.5 Empty State (Direct URL Access)

If a user arrives at `/get-estimate/results` without having submitted a form:

```html
<div class="text-center py-16">
  <div class="mx-auto mb-6 h-16 w-16 rounded-full bg-slate-blue-light flex items-center justify-center">
    <FileSearch class="h-8 w-8 text-muted" />
  </div>
  <h2 class="text-xl font-semibold text-white">No Estimate Found</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    It looks like you haven't generated an estimate yet. Start by telling us about your project.
  </p>
  <a href="/get-estimate"
    class="inline-flex items-center gap-2 mt-6 h-11 px-6 bg-green-500 text-white font-semibold
    rounded-lg hover:bg-green-600 transition-all duration-200">
    Start Your Estimate
    <ArrowRight class="h-5 w-5" />
  </a>
</div>
```

---

## 13. SEO

### 13.1 URL Structure

```
/get-estimate           (English)
/ar/get-estimate        (Arabic)
```

Results are client-side rendered (not a separate URL) since they contain user-specific data. The base page is SSR for SEO.

### 13.2 Meta Tags

```html
<head>
  <title>Get AI-Powered Project Estimate | Aviniti</title>
  <meta name="description" content="Get an instant AI-powered cost estimate for your app or software project. Answer a few questions and receive a detailed breakdown of costs, timeline, and recommendations in under 2 minutes." />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:title" content="Get AI-Powered Project Estimate | Aviniti" />
  <meta property="og:description" content="Get an instant AI-powered cost estimate for your app or software project. Detailed breakdown in under 2 minutes." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://aviniti.com/get-estimate" />
  <meta property="og:image" content="https://aviniti.com/og/get-estimate.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Get AI-Powered Project Estimate | Aviniti" />
  <meta name="twitter:description" content="Instant AI estimate for your app project. Try it free." />
  <meta name="twitter:image" content="https://aviniti.com/og/get-estimate.png" />

  <!-- Canonical -->
  <link rel="canonical" href="https://aviniti.com/get-estimate" />

  <!-- Alternate languages -->
  <link rel="alternate" hreflang="en" href="https://aviniti.com/get-estimate" />
  <link rel="alternate" hreflang="ar" href="https://aviniti.com/ar/get-estimate" />
  <link rel="alternate" hreflang="x-default" href="https://aviniti.com/get-estimate" />
</head>
```

### 13.3 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Aviniti AI Project Estimator",
  "description": "AI-powered tool that generates detailed cost and timeline estimates for app and software development projects.",
  "url": "https://aviniti.com/get-estimate",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free AI-powered project estimate"
  },
  "provider": {
    "@type": "Organization",
    "name": "Aviniti",
    "url": "https://aviniti.com",
    "logo": "https://aviniti.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Amman",
      "addressCountry": "JO"
    }
  }
}
```

### 13.4 Internal Linking

The page links to:
- Homepage (`/`)
- Individual Ready-Made Solutions (`/solutions/[slug]`) from the match card
- ROI Calculator (`/roi-calculator`) from cross-sell
- AI Idea Analyzer (`/idea-analyzer`) from cross-sell
- Contact page (`/contact`) from CTA section
- Privacy Policy (`/privacy`)

Incoming links from:
- Homepage hero CTA
- Homepage AI Tools Spotlight card
- Homepage final CTA
- Idea Lab results
- AI Idea Analyzer results
- Navigation bar (primary link)
- ROI Calculator cross-sell

---

## Appendix A: Data Flow

```
User Input (Steps 1-4)
    |
    v
Client-Side Validation
    |
    v
API Route (/api/estimate)
    |
    +---> Firebase: Store lead data
    |
    +---> Google Gemini API: Generate estimate
    |         |
    |         v
    |     Structured JSON response:
    |     {
    |       costRange: { min, max },
    |       timeline: { weeks, phases[] },
    |       approach: "custom" | "ready-made" | "hybrid",
    |       breakdown: [{ phase, cost, duration, description }],
    |       readyMadeMatch: { solution, matchPercentage, savings } | null,
    |       insights: string,
    |     }
    |
    v
Results Page (client-side render)
    |
    +---> Optional: Send email with estimate PDF
    +---> Optional: Send WhatsApp message
    +---> Analytics: Track completion event
```

## Appendix B: Gemini Prompt Template

```
You are an expert software project estimator for Aviniti, an AI and app development company.

Given the following project requirements:
- Project Type: {projectType}
- Selected Features: {features[]}
- Custom Features: {customFeatures[]}
- Timeline Preference: {timeline}
- Project Description: {description}

Generate a detailed project estimate in JSON format with:
1. Cost range (min and max in USD)
2. Timeline in weeks
3. Phase-by-phase breakdown (Discovery, Design, Backend, Frontend, Testing, Deployment)
4. Whether a Ready-Made Solution from our catalog would be a better fit
5. Key insights and recommendations

Our Ready-Made Solutions catalog:
- Delivery App: $10,000 / 35 days
- Kindergarten Management: $8,000 / 35 days
- Hypermarket System: $15,000 / 35 days
- Office Suite: $8,000 / 35 days
- Gym Management: $25,000 / 60 days
- Airbnb Clone: $15,000 / 35 days
- Hair Transplant AI: $18,000 / 35 days

Respond with valid JSON only.
```
