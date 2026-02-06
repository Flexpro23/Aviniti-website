# Aviniti AI Tool: AI Idea Analyzer - Design Specification

**Version:** 1.0
**Date:** February 2026
**Tool Accent:** Blue `#3B82F6` (tool-blue)
**URL:** `/idea-analyzer`
**Status:** Design Specification
**Stack:** Next.js 14+ / Tailwind CSS / Framer Motion / Inter

---

## Table of Contents

1. [Page Overview](#1-page-overview)
2. [Page Layout](#2-page-layout)
3. [Hero / Header](#3-hero--header)
4. [Interactive Form / Steps](#4-interactive-form--steps)
5. [AI Processing State](#5-ai-processing-state)
6. [Results Display](#6-results-display)
7. [Cross-Sell / CTA](#7-cross-sell--cta)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Component Mapping](#9-component-mapping)
10. [Accessibility](#10-accessibility)
11. [RTL Considerations](#11-rtl-considerations)
12. [Error States](#12-error-states)
13. [SEO](#13-seo)

---

## 1. Page Overview

### 1.1 Purpose

AI Idea Analyzer is a **middle-of-funnel lead generation tool** for users who already have an app concept and want objective validation before investing. The user describes their idea in detail, and Google Gemini AI produces a comprehensive analysis covering market potential, technical feasibility, monetization strategies, competition landscape, and an overall viability score. This tool sits between exploration (Idea Lab) and commitment (Get AI Estimate) in the buyer journey.

### 1.2 User Journey

Two primary entry paths:

**Path A: Direct entry (user has their own idea)**
```
Homepage AI Tools Spotlight / Nav link / Search
  |
  v
Analyzer Landing/Intro (Hero)
  |
  v
Step 1: Describe Your Idea (free text + optional structured fields)
  |
  v
Step 2: Email Capture (+ optional WhatsApp)
  |
  v
AI Processing / Loading State
  |
  v
Results: Comprehensive Analysis Dashboard
  |
  v
"Get a Detailed Estimate" --> Get AI Estimate (pre-filled)
  or
"Book a Call" --> Calendly
```

**Path B: From Idea Lab (idea pre-filled)**
```
Idea Lab Results --> "Explore This Idea"
  |
  v
Analyzer Landing (hero visible but scrolled past)
  |
  v
Step 1: Pre-filled with idea from Idea Lab
  (user can edit/expand, banner shows continuity)
  |
  v
(same flow as Path A from Step 2 onward)
```

### 1.3 Conversion Goals

| Priority | Goal | Mechanism |
|----------|------|-----------|
| Primary | Email capture | Required before AI analysis runs |
| Secondary | Funnel progression | "Get a Detailed Estimate" sends user to Get AI Estimate |
| Tertiary | Direct booking | "Book a Call" CTA on results page |
| Quaternary | WhatsApp engagement | Optional WhatsApp delivery |

### 1.4 Key Metrics

- Form start rate (clicked "Analyze My Idea")
- Pre-fill rate (percentage arriving from Idea Lab)
- Email capture rate
- Results page engagement (time spent, scroll depth)
- Funnel progression rate (Analyzer to Get AI Estimate)
- Share rate (if sharing functionality is added)

---

## 2. Page Layout

### 2.1 Full Page Wireframe (Desktop)

```
+========================================================================+
|  [Logo]   Home   Get AI Estimate   FAQ   Blog   [Idea Lab]   [EN/AR]  |
+========================================================================+
|                                                                         |
|  Breadcrumb: Home / AI Tools / AI Idea Analyzer                        |
|                                                                         |
|  +-----------------------------------------------------------------+   |
|  |                                                                 |   |
|  |   [Blue search/sparkle icon]                                    |   |
|  |                                                                 |   |
|  |   AI IDEA ANALYZER                  (section label, blue)       |   |
|  |                                                                 |   |
|  |   Have an App Idea?                                             |   |
|  |   Let's Validate It.                                            |   |
|  |                                                                 |   |
|  |   Get a comprehensive AI-powered analysis of your app idea.     |   |
|  |   Market potential, technical feasibility, competition,         |   |
|  |   and monetization -- all in one report.                        |   |
|  |                                                                 |   |
|  |   [  Analyze My Idea  -->  ]                                    |   |
|  |                                                                 |   |
|  |   WHAT YOU'LL GET:                                              |   |
|  |   [chart icon] Market Analysis                                  |   |
|  |   [cpu icon] Technical Feasibility                              |   |
|  |   [dollar icon] Monetization Strategy                           |   |
|  |   [users icon] Competition Overview                             |   |
|  |   [target icon] Overall Viability Score                         |   |
|  |                                                                 |   |
|  +-----------------------------------------------------------------+   |
|                                                                         |
+=========================================================================+
|                                                                         |
|  FORM AREA (Steps 1-2, shown one at a time)                           |
|                                                                         |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|  |                                                                 |   |
|  |  [Step Indicator:  (1)-----------(2)  ]                        |   |
|  |                                                                 |   |
|  |  Step 1: Describe Your App Idea                                 |   |
|  |                                                                 |   |
|  |  +--------------------------------------------------------------+  |
|  |  |                                                              |  |
|  |  |  Describe your app idea in detail...                         |  |
|  |  |                                                              |  |
|  |  |                                                              |  |
|  |  |                                                              |  |
|  |  |                                                              |  |
|  |  |                                                              |  |
|  |  +--------------------------------------------------------------+  |
|  |                                                  45 / 2000 chars   |
|  |                                                                 |   |
|  |  HELP US UNDERSTAND BETTER (optional):                          |   |
|  |                                                                 |   |
|  |  Target Audience:  [dropdown/input                        ]     |   |
|  |  Industry:         [dropdown/input                        ]     |   |
|  |  Revenue Model:    [dropdown/input                        ]     |   |
|  |                                                                 |   |
|  |                         [  Analyze My Idea  -->  ]              |   |
|  |                                                                 |   |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|                                                                         |
+=========================================================================+
|                                                                         |
|  RESULTS AREA (replaces form after AI processing)                      |
|                                                                         |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|  |                                                                 |   |
|  |  YOUR IDEA ANALYSIS                                             |   |
|  |                                                                 |   |
|  |  "Idea Name"   Overall Score: [==== 78/100 ====]               |   |
|  |                                                                 |   |
|  |  +--------+  +--------+  +--------+  +--------+  +--------+   |   |
|  |  | Market |  | Tech.  |  | Monet. |  | Compet.|  | Overall|   |   |
|  |  |  72    |  |  85    |  |  68    |  |  74    |  |  78    |   |   |
|  |  | /100   |  | /100   |  | /100   |  | /100   |  | /100   |   |   |
|  |  +--------+  +--------+  +--------+  +--------+  +--------+   |   |
|  |                                                                 |   |
|  |  [Market Potential Section -- expandable]                       |   |
|  |  [Technical Feasibility Section -- expandable]                  |   |
|  |  [Monetization Strategies Section -- expandable]                |   |
|  |  [Competition Overview Section -- expandable]                   |   |
|  |  [Recommendations Section]                                      |   |
|  |                                                                 |   |
|  |  +------------------------------------------------------------+ |   |
|  |  |  CTA: Get a Detailed Estimate / Book a Call                | |   |
|  |  +------------------------------------------------------------+ |   |
|  |                                                                 |   |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|                                                                         |
+=========================================================================+
|                        [Footer]                                         |
+=========================================================================+
```

### 2.2 Page Structure Summary

The Analyzer page has a simpler structure than Idea Lab because the form is only 2 steps. The complexity lives in the results display, which is the most data-rich output of any AI tool on the site.

1. **Hero Zone** -- Landing with headline, deliverables list, and "Analyze My Idea" CTA. Provides confidence about what the user will receive.
2. **Form Zone** -- Two-step form. Step 1 is the substantive input (idea description + optional context). Step 2 is email capture. After submission, this zone transitions to results.
3. **Results Zone** -- A comprehensive analysis dashboard with score cards, expandable sections, and data visualizations.

---

## 3. Hero / Header

### 3.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|  max-w-[768px], centered, text-center                              |
|                                                                    |
|  [Blue search-sparkle icon -- 48px, inside 64px rounded-xl        |
|   bg-blue-500/15 container, border border-blue-500/20]            |
|                                                                    |
|  AI IDEA ANALYZER                                                  |
|  (section label: text-sm font-semibold uppercase                   |
|   tracking-[0.1em] text-blue-400)                                  |
|                                                                    |
|  Have an App Idea?                                                 |
|  Let's Validate It.                                                |
|  (text-h1, text-white)                                             |
|                                                                    |
|  Get a comprehensive AI-powered analysis of your app               |
|  idea. Market potential, technical feasibility, competition,       |
|  and monetization -- all in one report.                            |
|  (text-lg, text-muted, max-w-[560px])                             |
|                                                                    |
|  [  Analyze My Idea  -->  ]                                        |
|  (blue primary button variant)                                     |
|                                                                    |
|  WHAT YOU'LL GET:                                                  |
|  (5 deliverables in a row with icons)                              |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.2 Visual Description

**Background:** Full page `#0F1419` with a subtle radial gradient: `radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.04) 0%, transparent 60%)`. This creates a cool blue atmospheric glow at the top, distinguishing this page from the warm orange Idea Lab. The effect is more muted than Idea Lab's because blue is a cooler, more analytical color -- matching the tool's personality.

**Tool Icon:** Lucide `SearchCode` icon (or `Scan` icon as alternative), 24px (`h-6 w-6`), in `text-blue-400`. Centered inside a 56px container (`h-14 w-14`) with `bg-blue-500/15 rounded-xl border border-blue-500/20`.

**Section Label:** "AI IDEA ANALYZER" -- `text-sm font-semibold uppercase tracking-[0.1em] text-blue-400`. Margin-top: 20px.

**Headline:** "Have an App Idea? Let's Validate It." -- `<h1>` element. `text-h1` scale. Color: `#FFFFFF`. The word "Validate" carries a blue underline decoration: `border-b-[3px] border-blue-500 pb-1` on a `<span>`. Margin-top: 16px.

**Description:** `text-lg` (18px). Color: `#9CA3AF`. Line-height: 1.75. Max-width: 560px. Centered. Margin-top: 20px.

**CTA Button:** "Analyze My Idea" with `ArrowRight` icon (h-5 w-5). Blue primary button: `bg-blue-500 text-white font-semibold rounded-lg h-13 px-7 py-3 text-lg shadow-sm hover:bg-blue-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`. Focus: `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy`. Margin-top: 32px.

**Deliverables Row:** Below the CTA, a horizontal row of 5 items showing what the analysis includes. On desktop, these are arranged in a single row with even spacing. Each item is a vertical stack: icon (h-5 w-5, text-blue-400) on top, label (text-xs font-medium text-muted) below. Items are separated by 32px gap.

| Icon (Lucide) | Label |
|---------------|-------|
| `TrendingUp` | Market Analysis |
| `Cpu` | Technical Feasibility |
| `DollarSign` | Monetization Strategy |
| `Users` | Competition Overview |
| `Target` | Viability Score |

Styling: `flex items-center justify-center gap-6 md:gap-8 flex-wrap`. Each item: `flex flex-col items-center gap-1.5`. Margin-top: 32px.

### 3.3 Animation Sequence (Page Load)

| Order | Element | Animation | Delay | Duration | Easing |
|-------|---------|-----------|-------|----------|--------|
| 1 | Icon container | Fade in + scale(0.8 to 1) | 0ms | 500ms | ease-out-expo |
| 2 | Section label | Fade in + translateY(10px to 0) | 100ms | 400ms | ease-out |
| 3 | Headline | Fade in + translateY(20px to 0) | 200ms | 600ms | ease-out-expo |
| 4 | Blue underline on "Validate" | Width 0% to 100% | 550ms | 400ms | ease-out |
| 5 | Description | Fade in + translateY(10px to 0) | 400ms | 500ms | ease-out |
| 6 | CTA button | Fade in + translateY(10px to 0) | 550ms | 400ms | ease-out |
| 7 | Deliverables row | Fade in + translateY(10px to 0), items stagger 60ms each | 700ms | 400ms | ease-out |

### 3.4 Continuity Banner (Path B -- from Idea Lab)

When the user arrives from Idea Lab via "Explore This Idea", a banner appears between the hero and the form:

```html
<div class="w-full max-w-[720px] mx-auto mb-6 bg-blue-500/10 border border-blue-500/20
  rounded-xl p-4 flex items-center gap-3">
  <div class="h-8 w-8 rounded-lg bg-orange-500/15 flex items-center justify-center flex-shrink-0">
    <Lightbulb class="h-4 w-4 text-orange-400" />
  </div>
  <div class="flex-1">
    <p class="text-sm font-medium text-white">
      Continuing from Idea Lab: <span class="text-blue-300">MedQueue Pro</span>
    </p>
    <p class="text-xs text-muted mt-0.5">
      Your idea description has been pre-filled below. Feel free to add more detail.
    </p>
  </div>
  <button class="text-xs text-muted hover:text-off-white transition-colors"
    aria-label="Dismiss banner">
    <X class="h-4 w-4" />
  </button>
</div>
```

The banner uses a mix of blue (Analyzer accent) and orange (Idea Lab accent) to visually bridge the two tools.

### 3.5 Exact Copy

**Section label:** "AI IDEA ANALYZER"

**Headline:** "Have an App Idea? Let's Validate It."

**Description:** "Get a comprehensive AI-powered analysis of your app idea. Market potential, technical feasibility, competition, and monetization -- all in one report."

**CTA:** "Analyze My Idea"

**Deliverables:** "Market Analysis" / "Technical Feasibility" / "Monetization Strategy" / "Competition Overview" / "Viability Score"

---

## 4. Interactive Form / Steps

### 4.1 Form Container

Same container pattern as Idea Lab: `max-w-[720px] mx-auto bg-slate-blue/50 border border-slate-blue-light rounded-2xl p-6 md:p-10`. Anchor ID: `id="analyzer-form"`.

### 4.2 Step Indicator

Two-step indicator (simpler than Idea Lab's four steps).

```
  (1)-------------------------(2)
Your Idea                   Email
```

Uses blue accent variants:
- Completed: `bg-blue-500 text-white`
- Current: `border-2 border-blue-500 bg-blue-500/10 text-blue-400`
- Upcoming: `border-2 border-slate-blue-light text-muted`
- Completed connector: `bg-blue-500`
- Upcoming connector: `bg-slate-blue-light`

### 4.3 Step Transition Animation

Same pattern as Idea Lab (horizontal slide with direction awareness). Uses Framer Motion `AnimatePresence` with custom variants for direction.

### 4.4 Step 1: Describe Your Idea

This is the most substantive input step across all four AI tools. The quality of input directly determines the quality of analysis, so the design must encourage detailed, thoughtful descriptions.

**Layout:**

```
+------------------------------------------------------------------+
|                                                                    |
|  Describe Your App Idea                                            |
|  text-h3, text-white                                               |
|                                                                    |
|  The more detail you provide, the more accurate                   |
|  your analysis will be.                                            |
|  text-base, text-muted                                             |
|                                                                    |
|  GUIDING PROMPTS:                                                  |
|  [lightbulb] What problem does it solve?                           |
|  [users] Who is it for?                                            |
|  [sparkle] What makes it unique?                                   |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |  (Textarea -- large, inviting, with generous padding)        | |
|  |                                                              | |
|  |  I want to build an app that...                              | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                               45 / 2000 chars     |
|                                                                    |
|  - - - - - - - - - - - - - - - - - - - - - - - - -               |
|                                                                    |
|  HELP US UNDERSTAND BETTER (optional):                             |
|  (collapsible section -- open by default on desktop,               |
|   collapsed on mobile)                                             |
|                                                                    |
|  Target Audience       [Who will use this app?           ]        |
|  Industry/Sector       [Select industry       v         ]        |
|  Preferred Revenue     [Select revenue model  v         ]        |
|  Model                                                             |
|                                                                    |
|                         [  Continue  -->  ]                        |
|                                                                    |
+------------------------------------------------------------------+
```

**Guiding Prompts:** Three inline prompts above the textarea to guide the user's thinking. Each is a small inline element: icon (h-4 w-4, text-blue-300) + text (text-sm text-muted-light italic). Arranged in a column stack with 8px gap. Margin-bottom: 16px before the textarea.

```html
<div class="space-y-2 mb-4">
  <div class="flex items-center gap-2">
    <Lightbulb class="h-4 w-4 text-blue-300 flex-shrink-0" />
    <span class="text-sm text-muted-light italic">What problem does it solve?</span>
  </div>
  <div class="flex items-center gap-2">
    <Users class="h-4 w-4 text-blue-300 flex-shrink-0" />
    <span class="text-sm text-muted-light italic">Who is it for?</span>
  </div>
  <div class="flex items-center gap-2">
    <Sparkles class="h-4 w-4 text-blue-300 flex-shrink-0" />
    <span class="text-sm text-muted-light italic">What makes it unique?</span>
  </div>
</div>
```

**Primary Textarea:**

The textarea is intentionally larger than Idea Lab's to signal that more detail is welcome here. This is the analyzer -- depth matters.

```html
<textarea
  id="idea-description"
  class="w-full min-h-[220px] md:min-h-[280px] p-5 bg-slate-blue border border-slate-blue-light
    rounded-xl text-base text-off-white placeholder:text-muted-light
    leading-relaxed
    hover:border-gray-700
    focus:bg-slate-blue-light focus:border-blue-500 focus:text-white
    focus:outline-none focus:ring-1 focus:ring-blue-500
    resize-y transition-all duration-200"
  placeholder="I want to build an app that..."
  minLength={30}
  maxLength={2000}
  aria-describedby="idea-helper idea-counter"
  aria-required="true"
/>
```

**Character counter:** Right-aligned below textarea. `text-xs text-muted`. Format: "45 / 2000 chars". Under 30 characters: text turns `text-blue-400` with message "Minimum 30 characters for a meaningful analysis."

**If pre-filled from Idea Lab:** The textarea contains the idea name and description from Idea Lab. The text is editable. A small blue `Info` badge appears above the textarea: "Pre-filled from Idea Lab. Feel free to add more detail for a deeper analysis."

**Optional Context Section:**

Below a horizontal divider (`bg-gradient-to-r from-transparent via-slate-blue-light to-transparent h-px my-6`), three optional fields provide structured context that improves the AI analysis.

Label: "HELP US UNDERSTAND BETTER" -- `text-xs font-semibold uppercase tracking-[0.08em] text-muted-light`. With a `ChevronDown` icon that toggles the section open/closed (collapsed by default on mobile, expanded on desktop).

**Target Audience Input:**

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-off-white" for="target-audience">
    Target Audience
  </label>
  <input
    id="target-audience"
    type="text"
    class="w-full h-11 px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg
      text-base text-off-white placeholder:text-muted-light
      hover:border-gray-700
      focus:bg-slate-blue-light focus:border-blue-500 focus:text-white
      focus:outline-none focus:ring-1 focus:ring-blue-500
      transition-all duration-200"
    placeholder="Who will use this app? (e.g., Small business owners, fitness enthusiasts)"
  />
</div>
```

**Industry Select:**

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-off-white" for="industry">
    Industry / Sector
  </label>
  <div class="relative">
    <select
      id="industry"
      class="w-full h-11 px-3 py-2.5 pr-10 bg-slate-blue border border-slate-blue-light rounded-lg
        text-base text-off-white appearance-none
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-blue-500 focus:text-white
        focus:outline-none focus:ring-1 focus:ring-blue-500
        transition-all duration-200">
      <option value="" class="text-muted-light">Select industry (optional)</option>
      <option value="health">Health and Wellness</option>
      <option value="finance">Finance and Banking</option>
      <option value="education">Education and Learning</option>
      <option value="ecommerce">E-commerce and Retail</option>
      <option value="logistics">Logistics and Delivery</option>
      <option value="entertainment">Entertainment and Media</option>
      <option value="travel">Travel and Hospitality</option>
      <option value="realestate">Real Estate</option>
      <option value="food">Food and Restaurant</option>
      <option value="social">Social and Community</option>
      <option value="other">Other</option>
    </select>
    <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
  </div>
</div>
```

**Revenue Model Select:**

Same select styling. Options:
- "Select revenue model (optional)" (default)
- Subscription (SaaS)
- Freemium
- One-time purchase
- In-app purchases
- Advertising
- Marketplace / Commission
- Enterprise licensing
- Not sure yet

**Fields are arranged in a 1-column layout** with `gap-4` between them.

**Continue Button:**

```html
<div class="flex items-center justify-end mt-8">
  <button class="h-11 px-6 bg-blue-500 text-white font-semibold rounded-lg
    shadow-sm hover:bg-blue-600 hover:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 flex items-center gap-2"
    disabled={descriptionLength < 30}>
    Continue
    <ArrowRight class="h-5 w-5" />
  </button>
</div>
```

Note: No "Back" button on Step 1 since it is the first step.

**Validation:**
- Idea description: Required. Minimum 30 characters (higher than Idea Lab because the analysis requires more substance). Error: "Please describe your idea in at least 30 characters for a meaningful analysis."
- Maximum 2000 characters.
- Optional fields: No validation (they enhance the analysis but are not required).

**Exact copy:**

Heading: "Describe Your App Idea"

Helper text: "The more detail you provide, the more accurate your analysis will be."

Guiding prompts:
- "What problem does it solve?"
- "Who is it for?"
- "What makes it unique?"

Placeholder: "I want to build an app that..."

Optional section label: "Help Us Understand Better"

### 4.5 Step 2: Email Capture

**Layout and behavior:** Same pattern as Idea Lab Step 4. The question, email input, WhatsApp checkbox, privacy note, and submit button are identical in structure but use blue accent colors throughout.

```
+------------------------------------------------------------------+
|                                                                    |
|  Where should we send your analysis?                               |
|                                                                    |
|  [mail icon]  [Email address input field              ]            |
|                                                                    |
|  [x] Also send via WhatsApp                                       |
|      [phone icon] [WhatsApp number input field        ]            |
|                                                                    |
|  [lock icon] We'll only use this to send your results.            |
|  We never spam. Read our Privacy Policy.                           |
|                                                                    |
|                                                                    |
|        [Back]                       [Get My Analysis -->]          |
|                                                                    |
+------------------------------------------------------------------+
```

**Key difference from Idea Lab:** The submit button text is "Get My Analysis" (not "Discover My Ideas"). The icon is `BarChart3` (h-5 w-5) instead of `Sparkles`, reinforcing the analytical nature of this tool.

**All inputs use blue focus rings:** `focus:border-blue-500 focus:ring-1 focus:ring-blue-500`.

**Checkbox checked state:** `checked:bg-blue-500 checked:border-blue-500`.

**Validation:** Same as Idea Lab Step 4.

**Exact copy:**

Question: "Where should we send your analysis?"

Email label: "Email Address"

WhatsApp label: "Also send via WhatsApp"

Privacy note: "We'll only use this to send your results. We never spam. Read our Privacy Policy."

Submit CTA: "Get My Analysis"

---

## 5. AI Processing State

### 5.1 Layout

The processing state for the Analyzer is more elaborate than Idea Lab's because the analysis takes longer (20-45 seconds) and the user expects more rigor. The loading experience must communicate analytical depth.

```
+------------------------------------------------------------------+
|                                                                    |
|  [Step Indicator: both steps completed]                           |
|                                                                    |
|  - - - - - - - - - - - - - - - - - - - - - - - - - - - -         |
|                                                                    |
|         [Animated analysis visualization]                          |
|                                                                    |
|         Analyzing your idea...                                     |
|                                                                    |
|         "Evaluating market potential"                              |
|         (rotating messages, synced with progress sections)         |
|                                                                    |
|  +---+---+---+---+---+                                            |
|  | M | T | $ | C | S |  (5 analysis category indicators)          |
|  +---+---+---+---+---+                                            |
|  [==][ ][ ][ ][ ]   (each fills as that category is "analyzed")   |
|                                                                    |
|              This usually takes 20-45 seconds.                     |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.2 Visual Description

**Central animation:** Instead of a single pulsing icon, the Analyzer uses a more complex visualization: a circular scanning animation. A 96px (`h-24 w-24`) circle with `border-2 border-blue-500/30`. Inside, a smaller 64px circle with `bg-blue-500/10`. The border of the outer circle has an animated segment (a 90-degree arc in `border-blue-400`) that rotates continuously, creating a "scanning" effect. Inside the inner circle, the Lucide `Brain` icon (h-8 w-8, text-blue-400) pulses gently (scale 1.0 to 1.05, 2-second cycle).

**Framer Motion for scanning animation:**

```tsx
<motion.div className="relative h-24 w-24">
  {/* Outer ring with scanning arc */}
  <motion.div
    className="absolute inset-0 rounded-full border-2 border-blue-500/20"
    style={{ borderTopColor: '#60A5FA' }}
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  />
  {/* Inner circle */}
  <div className="absolute inset-4 rounded-full bg-blue-500/10 flex items-center justify-center">
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Brain className="h-8 w-8 text-blue-400" />
    </motion.div>
  </div>
</motion.div>
```

**Headline:** "Analyzing your idea..." -- `text-xl font-semibold text-white`. Margin-top: 24px.

**Rotating messages:** Cycle every 4 seconds (longer than Idea Lab because the analysis has distinct phases). Crossfade animation. Color: `text-muted`. Size: `text-base`.

Messages (mapped to analysis categories):
1. "Evaluating market potential and size..."
2. "Assessing technical feasibility and complexity..."
3. "Exploring monetization strategies..."
4. "Analyzing competitive landscape..."
5. "Calculating overall viability score..."

**Category progress indicators:** Five small category blocks arranged horizontally. Each represents one section of the analysis. They light up sequentially as the (simulated) analysis progresses.

```html
<div class="flex items-center gap-3 mt-8">
  <!-- Market (completed) -->
  <div class="flex flex-col items-center gap-1.5">
    <div class="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
      <TrendingUp class="h-5 w-5 text-blue-400" />
    </div>
    <div class="h-1 w-10 rounded-full bg-blue-500" />
    <span class="text-[10px] text-blue-300 font-medium">Market</span>
  </div>

  <!-- Technical (in progress - pulsing) -->
  <div class="flex flex-col items-center gap-1.5">
    <div class="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center animate-pulse">
      <Cpu class="h-5 w-5 text-blue-400/60" />
    </div>
    <div class="h-1 w-10 rounded-full bg-slate-blue-light overflow-hidden">
      <div class="h-full bg-blue-500 rounded-full animate-[progress_2s_ease-in-out_infinite]"
           style="width: 50%" />
    </div>
    <span class="text-[10px] text-muted font-medium">Technical</span>
  </div>

  <!-- Monetization (upcoming) -->
  <div class="flex flex-col items-center gap-1.5">
    <div class="h-10 w-10 rounded-lg bg-slate-blue-light/50 flex items-center justify-center">
      <DollarSign class="h-5 w-5 text-muted-light" />
    </div>
    <div class="h-1 w-10 rounded-full bg-slate-blue-light" />
    <span class="text-[10px] text-muted-light font-medium">Revenue</span>
  </div>

  <!-- Competition (upcoming) -->
  <div class="flex flex-col items-center gap-1.5">
    <div class="h-10 w-10 rounded-lg bg-slate-blue-light/50 flex items-center justify-center">
      <Users class="h-5 w-5 text-muted-light" />
    </div>
    <div class="h-1 w-10 rounded-full bg-slate-blue-light" />
    <span class="text-[10px] text-muted-light font-medium">Competition</span>
  </div>

  <!-- Score (upcoming) -->
  <div class="flex flex-col items-center gap-1.5">
    <div class="h-10 w-10 rounded-lg bg-slate-blue-light/50 flex items-center justify-center">
      <Target class="h-5 w-5 text-muted-light" />
    </div>
    <div class="h-1 w-10 rounded-full bg-slate-blue-light" />
    <span class="text-[10px] text-muted-light font-medium">Score</span>
  </div>
</div>
```

**Timing:** Each category indicator "completes" at intervals: Market at 20%, Technical at 40%, Revenue at 60%, Competition at 80%, Score at 90%. The last 10% waits for the actual API response.

**Wait time note:** "This usually takes 20-45 seconds." -- `text-xs text-muted-light`. Margin-top: 20px.

### 5.3 Transition Into Results

1. All five category indicators complete with a satisfying "check" animation (icon changes to `Check`, background becomes `bg-blue-500/20`, indicator bar fills fully)
2. Brief pause (500ms) for the user to register completion
3. Entire loading state fades out + scale(0.98) (300ms)
4. 200ms pause
5. Results header fades in from above (translateY(-10px to 0), 500ms)
6. Score cards stagger in (80ms apart, translateY(15px to 0), 400ms each)
7. Analysis sections fade in below (200ms stagger)

---

## 6. Results Display

### 6.1 Results Header

```
+------------------------------------------------------------------+
|                                                                    |
|  [CheckCircle icon, blue] ANALYSIS COMPLETE                      |
|  (badge: bg-blue-500/15 text-blue-300 rounded-full)              |
|                                                                    |
|  Your Idea Analysis                                                |
|  text-h2, text-white                                               |
|                                                                    |
|  "[User's idea name or first 60 chars of description]"            |
|  text-base, text-muted, italic, max-w-600px                       |
|                                                                    |
+------------------------------------------------------------------+
```

**Success badge:** `bg-blue-500/15 text-blue-300 text-xs font-medium uppercase tracking-[0.05em] px-3 py-1 rounded-full inline-flex items-center gap-1.5`. Icon: `CheckCircle` (h-3.5 w-3.5).

**Headline:** "Your Idea Analysis" -- `text-h2`, `text-white`, `font-bold`.

**Idea summary:** The first ~60 characters of the user's idea description in quotes, or an AI-generated idea name if the API returns one. `text-base text-muted italic`. Margin-top: 8px.

### 6.2 Overall Score Display

The centerpiece of the results. A large circular progress indicator showing the overall viability score.

```
+------------------------------------------------------------------+
|                                                                    |
|  +------------ SCORE HERO SECTION ----------------+               |
|  |                                                 |               |
|  |   LEFT (40%):                                   |               |
|  |                                                 |               |
|  |   [Large circular progress]                     |               |
|  |         78                                      |               |
|  |        /100                                     |               |
|  |   Overall Viability Score                       |               |
|  |                                                 |               |
|  |   RIGHT (60%):                                  |               |
|  |                                                 |               |
|  |   "Your idea shows strong potential with        |               |
|  |   solid market opportunity and manageable        |               |
|  |   technical complexity. Focus on differentiation |               |
|  |   to stand out in a competitive market."         |               |
|  |                                                 |               |
|  |   Score Interpretation:                          |               |
|  |   [green dot] 80-100: Excellent                 |               |
|  |   [blue dot] 60-79: Good, needs refinement      |               |
|  |   [yellow dot] 40-59: Possible, significant work |               |
|  |   [red dot] Below 40: Reconsider approach        |               |
|  |                                                 |               |
|  +--------------------------------------------------+              |
|                                                                    |
+------------------------------------------------------------------+
```

**Circular progress (SVG-based):**

Size: 160px (`h-40 w-40`). Track: `stroke-slate-blue-light`, stroke-width: 8. Fill: `stroke-blue-500` (or color-coded based on score range), stroke-width: 8, stroke-linecap: round. Center text: score number in `text-4xl font-extrabold text-white` with "/100" below in `text-sm text-muted`. Label "Overall Viability Score" below the circle in `text-sm font-medium text-blue-300`.

**Score color coding:**
- 80-100: `stroke-success` (`#34D399`)
- 60-79: `stroke-blue-500` (`#3B82F6`)
- 40-59: `stroke-warning` (`#FBBF24`)
- Below 40: `stroke-error` (`#F87171`)

**Circular progress animation:** On mount, the stroke-dashoffset transitions from full circumference to the calculated value over 1.5 seconds with ease-out easing. The number counts up from 0 to the final score simultaneously.

```tsx
<svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
  {/* Track */}
  <circle
    cx="80" cy="80" r="68"
    fill="none"
    stroke="var(--border-default)"
    strokeWidth="8"
  />
  {/* Fill */}
  <motion.circle
    cx="80" cy="80" r="68"
    fill="none"
    stroke={scoreColor}
    strokeWidth="8"
    strokeLinecap="round"
    strokeDasharray={circumference}
    initial={{ strokeDashoffset: circumference }}
    animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
    transition={{ duration: 1.5, ease: [0, 0, 0.2, 1], delay: 0.3 }}
  />
</svg>
```

**AI-generated summary:** A 2-3 sentence paragraph summarizing the overall assessment. `text-base text-off-white leading-relaxed`. This is the "executive summary" of the analysis.

**Score interpretation legend:** A vertical stack of 4 score ranges with colored dots. Each: `flex items-center gap-2 text-sm`. Dot: `h-2.5 w-2.5 rounded-full`. Text: `text-muted`.

### 6.3 Category Score Cards

Five horizontal score cards in a row, each showing one analysis category's score.

```
+----------+  +----------+  +----------+  +----------+  +----------+
|  Market  |  | Technical|  | Monetize |  | Compete  |  | Overall  |
|          |  |          |  |          |  |          |  |          |
|   [72]   |  |   [85]   |  |   [68]   |  |   [74]   |  |   [78]   |
|  /100    |  |  /100    |  |  /100    |  |  /100    |  |  /100    |
|          |  |          |  |          |  |          |  |          |
|  [=====] |  |  [======]|  |  [====]  |  |  [=====] |  |  [=====] |
+----------+  +----------+  +----------+  +----------+  +----------+
```

**Layout:** `grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4`. On mobile, 2-column grid with the "Overall" card spanning full width at the top.

**Card structure:**

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-4 text-center">
  <div class="h-8 w-8 mx-auto rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
    <TrendingUp class="h-4 w-4 text-blue-400" />
  </div>
  <p class="text-xs font-medium text-muted uppercase tracking-wide">Market</p>
  <p class="text-2xl font-bold text-white mt-1">72</p>
  <p class="text-xs text-muted">/100</p>
  <div class="h-1.5 w-full bg-slate-blue-light rounded-full mt-3 overflow-hidden">
    <motion.div
      className="h-full bg-blue-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: '72%' }}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
    />
  </div>
</div>
```

**Score bar color:** Uses the same color-coding system as the main circular score (green for 80+, blue for 60-79, yellow for 40-59, red for below 40).

### 6.4 Detailed Analysis Sections

Below the score cards, the full analysis is presented in expandable accordion sections. Each section corresponds to one analysis category. All sections default to expanded on desktop, collapsed on mobile (first section expanded).

**Section structure:**

```html
<div class="space-y-4 mt-8">
  <!-- Market Potential Section -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl overflow-hidden">
    <!-- Section header (always visible, clickable to toggle) -->
    <button
      class="w-full flex items-center justify-between p-5 text-left group"
      aria-expanded="true"
      aria-controls="section-market">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <TrendingUp class="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">Market Potential</h3>
          <p class="text-xs text-muted mt-0.5">Size, growth, and opportunity assessment</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-lg font-bold text-blue-400">72/100</span>
        <ChevronDown class="h-5 w-5 text-muted group-hover:text-off-white
          transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
      </div>
    </button>

    <!-- Section content (collapsible) -->
    <div id="section-market" class="px-5 pb-5">
      <!-- AI-generated analysis content -->
      <div class="prose prose-sm prose-invert max-w-none">
        <p class="text-off-white leading-relaxed">
          The health and wellness app market is projected to reach $189 billion
          by 2028, growing at a CAGR of 17.6%. Patient queue management is a
          growing niche within healthtech...
        </p>

        <!-- Key findings as bullet points -->
        <h4 class="text-sm font-semibold text-white mt-4 mb-2">Key Findings</h4>
        <ul class="space-y-2">
          <li class="flex items-start gap-2 text-sm text-muted">
            <ChevronRight class="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            Large addressable market with consistent year-over-year growth
          </li>
          <!-- more findings -->
        </ul>
      </div>
    </div>
  </div>

  <!-- Technical Feasibility Section (same pattern) -->
  <!-- Monetization Strategies Section (same pattern) -->
  <!-- Competition Overview Section (same pattern) -->
</div>
```

**Each section contains:**

1. **Market Potential:**
   - Market size and growth data
   - Target demographic analysis
   - Opportunity assessment
   - Key findings (bulleted)

2. **Technical Feasibility:**
   - Complexity assessment (Low / Medium / High)
   - Suggested tech stack (displayed as `TechStackBadge` components)
   - Key technical challenges
   - Estimated development phases
   - Complexity shown as a visual indicator:

   ```html
   <div class="flex items-center gap-2 mt-3">
     <span class="text-sm text-muted">Complexity:</span>
     <div class="flex gap-1">
       <div class="h-2 w-8 rounded-full bg-blue-500" />
       <div class="h-2 w-8 rounded-full bg-blue-500" />
       <div class="h-2 w-8 rounded-full bg-slate-blue-light" />
     </div>
     <span class="text-sm font-medium text-blue-300">Medium</span>
   </div>
   ```

3. **Monetization Strategies:**
   - 2-3 recommended revenue models
   - Each with a brief explanation and pros/cons
   - Revenue model cards:

   ```html
   <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
     <div class="bg-slate-blue-light/30 rounded-lg p-4">
       <div class="flex items-center gap-2 mb-2">
         <Repeat class="h-4 w-4 text-blue-400" />
         <span class="text-sm font-semibold text-white">Subscription (SaaS)</span>
       </div>
       <p class="text-xs text-muted leading-relaxed">
         Monthly/annual subscription for clinic staff access. Most sustainable
         model for B2B healthtech.
       </p>
       <div class="flex gap-2 mt-2">
         <span class="text-[10px] bg-success-dark text-success px-1.5 py-0.5 rounded">
           Recurring revenue
         </span>
         <span class="text-[10px] bg-warning-dark text-warning px-1.5 py-0.5 rounded">
           Slower initial adoption
         </span>
       </div>
     </div>
   </div>
   ```

4. **Competition Overview:**
   - List of 3-5 similar apps/solutions (AI-identified)
   - Differentiation opportunities
   - Competition intensity indicator
   - Competitor cards:

   ```html
   <div class="space-y-2 mt-3">
     <div class="flex items-center justify-between p-3 bg-slate-blue-light/30 rounded-lg">
       <div>
         <span class="text-sm font-medium text-white">QueueDr</span>
         <span class="text-xs text-muted ml-2">Patient scheduling app</span>
       </div>
       <span class="text-xs bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded-full">
         Direct competitor
       </span>
     </div>
     <!-- more competitors -->
   </div>
   ```

### 6.5 Recommendations Section

A non-collapsible section at the bottom of the analysis, before the CTA.

```html
<div class="bg-gradient-to-br from-tool-blue-dark to-slate-blue
  border border-blue-500/20 rounded-xl p-6 md:p-8 mt-6">
  <div class="flex items-center gap-3 mb-4">
    <div class="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
      <Lightbulb class="h-5 w-5 text-blue-400" />
    </div>
    <h3 class="text-lg font-semibold text-white">AI Recommendations</h3>
  </div>
  <ul class="space-y-3">
    <li class="flex items-start gap-3">
      <div class="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center
        flex-shrink-0 mt-0.5">
        <span class="text-xs font-bold text-blue-300">1</span>
      </div>
      <p class="text-sm text-off-white leading-relaxed">
        Start with an MVP focused on the core queue management feature.
        Add AI prediction in Phase 2 once you have real patient data.
      </p>
    </li>
    <!-- 2-4 more recommendations -->
  </ul>
</div>
```

### 6.6 Results Animation Sequence

| Order | Element | Animation | Delay | Duration |
|-------|---------|-----------|-------|----------|
| 1 | Success badge | Fade in + scale(0.8 to 1) | 0ms | 400ms |
| 2 | Headline | Fade in + translateY(15px to 0) | 100ms | 500ms |
| 3 | Idea summary | Fade in | 200ms | 300ms |
| 4 | Circular score | Stroke animation + number count-up | 400ms | 1500ms |
| 5 | AI summary text | Fade in | 600ms | 400ms |
| 6 | Score interpretation | Fade in | 700ms | 300ms |
| 7 | Category card 1 | Fade in + translateY(10px to 0), bar fills | 800ms | 400ms |
| 8 | Category card 2 | Same, staggered | 880ms | 400ms |
| 9 | Category card 3 | Same, staggered | 960ms | 400ms |
| 10 | Category card 4 | Same, staggered | 1040ms | 400ms |
| 11 | Category card 5 | Same, staggered | 1120ms | 400ms |
| 12 | Analysis sections | Fade in sequentially | 1300ms | 400ms each, 100ms stagger |
| 13 | Recommendations | Fade in | 1800ms | 500ms |
| 14 | Bottom CTA | Fade in | 2000ms | 400ms |

---

## 7. Cross-Sell / CTA

### 7.1 Post-Results CTA Section

```
+------------------------------------------------------------------+
|  bg-gradient-to-br from-tool-blue-dark to-slate-blue              |
|  border border-blue-500/20 rounded-2xl p-8 md:p-10               |
|  mt-8                                                              |
|                                                                    |
|  CENTER LAYOUT:                                                    |
|                                                                    |
|    Ready to Bring This Idea to Life?                               |
|    text-h3, text-white, text-center                                |
|                                                                    |
|    Get a detailed project estimate with cost breakdown,            |
|    timeline, and recommended tech stack.                           |
|    text-base, text-muted, text-center, max-w-500px                |
|                                                                    |
|    [Get a Detailed Estimate -->]  (green primary button*)          |
|    [Book a Free Consultation]     (blue outline button)            |
|    [Share Analysis via WhatsApp]  (text link with WA icon)         |
|                                                                    |
+------------------------------------------------------------------+
```

*Note: The primary CTA uses **green** (`bg-green-500`) instead of blue because it links to the Get AI Estimate tool (which has a green accent). This creates a visual bridge to the next tool in the funnel and signals forward momentum. The secondary CTA remains blue (Analyzer's own color).

**Buttons:**

```html
<div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
  <a href="/get-estimate?idea=..."
    class="h-11 px-6 bg-green-500 text-white font-semibold rounded-lg
      shadow-sm hover:bg-green-600 hover:shadow-md
      transition-all duration-200 flex items-center gap-2">
    Get a Detailed Estimate
    <ArrowRight class="h-5 w-5" />
  </a>
  <a href="/contact?source=analyzer"
    class="h-11 px-6 bg-transparent text-blue-400 border border-blue-500/30
      font-semibold rounded-lg
      hover:bg-blue-500/10 hover:border-blue-500/50
      transition-all duration-200 flex items-center gap-2">
    Book a Free Consultation
  </a>
</div>
<div class="text-center mt-4">
  <a href="#" class="text-sm text-muted hover:text-off-white transition-colors
    inline-flex items-center gap-1.5">
    <MessageCircle class="h-4 w-4" />
    Share Analysis via WhatsApp
  </a>
</div>
```

### 7.2 "Get a Detailed Estimate" Behavior

When clicked, the user is directed to `/get-estimate` with the idea context passed via URL parameters or localStorage:
- Idea description (truncated)
- AI-suggested tech stack
- Complexity level
- The Estimate tool pre-fills what it can and shows a banner: "Continuing from AI Analyzer"

### 7.3 Download / Share Options

**Download PDF:** A "Download Full Report" text link in the results header area allows the user to generate and download a branded PDF of the analysis. The PDF includes:
- Aviniti branding and logo
- All scores and analysis sections
- Recommendations
- CTA: "Contact Aviniti to bring this idea to life"

**Share via WhatsApp:** Opens WhatsApp with a pre-filled message: "Check out my AI app idea analysis from Aviniti! Overall score: 78/100. Learn more at [link]"

### 7.4 Email Follow-Up

The full analysis is sent to the user's email including:
- PDF attachment of the report
- HTML summary with scores
- "Get a Detailed Estimate" CTA button
- "Book a Call" link
- Aviniti branding

---

## 8. Responsive Behavior

### 8.1 Breakpoint Overview

| Breakpoint | Hero | Form | Loading | Results |
|------------|------|------|---------|---------|
| Mobile (< 640px) | Centered. Deliverables wrap 3+2 or 2+2+1. CTA full-width. | Full-width. Textarea shorter (min-h 180px). Optional fields collapsed by default. Button full-width. | Category indicators wrap into 3+2 layout. Scanning circle reduces to h-20 w-20. | Score circle reduces to h-32 w-32. Category cards: 2-col grid with Overall spanning full. Sections all collapsed except first. CTA buttons stack full-width. |
| Tablet (640-1023px) | Centered. Deliverables in single row. | Max-w 600px. Textarea at full min-height. | Full horizontal row. | Two-column score layout (circle left, summary right). Category cards 5-col but tighter. Sections default expanded. |
| Desktop (1024px+) | Centered, max-w 768px. Full layout as wireframed. | Max-w 720px. All optional fields visible. | Full layout as wireframed. | Full layout. Score hero is two-column. All sections expanded. |

### 8.2 Mobile-Specific Adjustments

**Hero deliverables:** On mobile, the 5 items wrap. Use `flex flex-wrap justify-center gap-4`. Items may become 3-per-row or 2-per-row depending on width. Icons reduce to h-4 w-4.

**Textarea:** Min-height reduces to `min-h-[180px]` on mobile. Padding reduces to `p-4`.

**Optional context section:** Collapsed by default on mobile to prevent overwhelming the user. A "Show additional options" button reveals them with a slide-down animation.

**Loading state:** Category indicators wrap from a 5-item row to a 3+2 layout using `flex flex-wrap justify-center`. The scanning animation circle reduces to `h-20 w-20`.

**Results score hero:** On mobile, the two-column layout (circle + summary) stacks to single column. The circular score displays above the summary text. Both are centered.

**Category score cards:** 2-column grid on mobile. The "Overall" card appears first and spans full width: `grid grid-cols-2 gap-3` with the first child having `col-span-2`.

**Analysis sections:** All collapsed by default on mobile (only the first section is expanded). This prevents an overwhelming wall of text. The user can tap to expand each section.

**CTA buttons:** Stack full-width on mobile.

### 8.3 Touch Targets

All interactive elements maintain 44px minimum:
- Accordion headers: full-width tappable area with `min-h-[56px]`
- Buttons: h-11 (44px)
- Category score cards: generous padding ensures tappable
- Deliverable items in hero: non-interactive (informational only)

---

## 9. Component Mapping

### 9.1 Page-Level Components

| Section | Component | Description |
|---------|-----------|-------------|
| Page wrapper | `<IdeaAnalyzerPage />` | Route component, manages form/results state |
| Hero | `<AnalyzerHero onStart={scrollToForm} />` | Hero with deliverables list |
| Continuity banner | `<ContinuityBanner source="idea-lab" ideaName={name} />` | Shown when arriving from Idea Lab |
| Form container | `<AnalyzerForm onSubmit={handleSubmit} prefill={prefill} />` | Two-step form |
| Step indicator | `<StepIndicator currentStep={step} totalSteps={2} accentColor="blue" />` | Shared component |
| Loading state | `<AnalyzerLoader categories={[...]} />` | Custom loader with category progress |
| Results header | `<AnalysisHeader score={score} summary={summary} />` | Score circle + summary |
| Score cards | `<ScoreCardGrid scores={[...]} />` | Five category cards |
| Analysis section | `<AnalysisAccordion sections={[...]} />` | Expandable sections |
| Recommendations | `<RecommendationsList items={[...]} />` | Numbered recommendations |
| Cross-sell | `<ToolCrossSell variant="analyzer" />` | CTA section |

### 9.2 Shared Design System Components Used

| Component | Design System Reference | Customization |
|-----------|------------------------|---------------|
| `<Button />` primary | Section 7.1 | `accentColor="blue"` override |
| `<Button variant="outline" />` | Section 7.1 | Blue border/text |
| `<TextInput />` | Section 7.3 | Blue focus ring |
| `<Textarea />` | Section 7.3 | Blue focus ring, larger min-height |
| `<Select />` | Section 7.3 | Blue focus ring |
| `<Checkbox />` | Section 7.3 | Blue checked state |
| `<Badge />` | Section 7.5 | Blue variant |
| `<Accordion />` | Section 7.8 | Custom header with score display |
| `<CircularProgress />` | Section 7.9 | Color-coded by score range |
| `<ProgressBar />` | Section 7.9 | Blue fill, used in score cards |
| `<Toast />` | Section 7.10 | Success/error variants |
| `<Tooltip />` | Section 7.11 | For score explanations |

### 9.3 Custom Components (Page-Specific)

| Component | Purpose |
|-----------|---------|
| `<ScanningLoader />` | Circular scanning animation for loading state |
| `<CategoryProgressRow />` | Five category indicators during loading |
| `<ScoreCircle />` | Large SVG circular progress with animated fill |
| `<ScoreCard />` | Individual category score card with bar |
| `<ComplexityIndicator />` | Three-bar complexity visual (Low/Med/High) |
| `<CompetitorCard />` | Individual competitor entry in analysis |
| `<RevenueModelCard />` | Revenue model with pros/cons badges |
| `<GuidingPrompts />` | Three prompt hints above textarea |
| `<DownloadReportButton />` | Generates and downloads PDF |

---

## 10. Accessibility

### 10.1 Keyboard Navigation Flow

**Hero section:**
1. Skip to content link
2. Navigation links
3. "Analyze My Idea" button (scrolls to form)

**Form section:**
1. Continuity banner dismiss button (if present)
2. Textarea (Step 1)
3. Target audience input (optional)
4. Industry select (optional)
5. Revenue model select (optional)
6. "Continue" button
7. "Back" button (Step 2)
8. Email input (Step 2)
9. WhatsApp checkbox (Step 2)
10. WhatsApp phone input (Step 2, if checkbox checked)
11. "Get My Analysis" button (Step 2)

**Results section:**
1. Results heading (focus lands here after loading, via programmatic focus)
2. Score interpretation legend (informational, not interactive)
3. Each analysis section accordion header (Enter/Space to toggle)
4. "Get a Detailed Estimate" button
5. "Book a Free Consultation" button
6. "Share via WhatsApp" link
7. "Download Full Report" link (if present)

### 10.2 ARIA Labels and Roles

```html
<!-- Textarea with comprehensive labeling -->
<div role="group" aria-labelledby="step1-heading">
  <h2 id="step1-heading" class="text-h3 text-white">Describe Your App Idea</h2>
  <p id="step1-description" class="text-base text-muted">
    The more detail you provide, the more accurate your analysis will be.
  </p>
  <label for="idea-description" class="sr-only">
    Describe your app idea in detail
  </label>
  <textarea
    id="idea-description"
    aria-describedby="step1-description idea-counter idea-error"
    aria-required="true"
    aria-invalid="false"
  />
  <span id="idea-counter" aria-live="polite" class="sr-only">
    45 of 2000 characters used
  </span>
  <span id="idea-error" role="alert" class="sr-only">
    <!-- Populated when validation fails -->
  </span>
</div>

<!-- Loading state -->
<div role="status" aria-live="polite"
  aria-label="Analyzing your idea, please wait">
  <p>Analyzing your idea...</p>
  <p aria-live="assertive">Evaluating market potential...</p>
  <div role="progressbar" aria-valuenow="40" aria-valuemin="0"
    aria-valuemax="100" aria-label="Analysis progress: 40%">
  </div>
</div>

<!-- Results score -->
<section aria-label="Idea analysis results">
  <h2 tabindex="-1" id="results-heading">Your Idea Analysis</h2>
  <div role="img" aria-label="Overall viability score: 78 out of 100">
    <!-- SVG circular progress -->
  </div>
</section>

<!-- Analysis accordion -->
<div class="space-y-4">
  <div>
    <h3>
      <button
        aria-expanded="true"
        aria-controls="section-market-content"
        id="section-market-header">
        Market Potential - Score: 72 out of 100
      </button>
    </h3>
    <div id="section-market-content"
      role="region"
      aria-labelledby="section-market-header">
      <!-- Content -->
    </div>
  </div>
</div>
```

### 10.3 Screen Reader Experience

1. **Page load:** Screen reader announces: "AI Idea Analyzer - Validate Your App Idea | Aviniti"
2. **Hero:** H1 reads naturally: "Have an App Idea? Let's Validate It." Deliverables list reads as static text (not as a list since they are short labels)
3. **Continuity banner (if present):** Announces: "Continuing from Idea Lab: MedQueue Pro. Your idea description has been pre-filled."
4. **Form Step 1:** The textarea label, description, and guiding prompts provide context. Character counter announces periodically (every 50 characters) via `aria-live="polite"`
5. **Form Step 2:** Standard form field announcements
6. **Loading state:** `role="status"` announces "Analyzing your idea, please wait." Rotating messages announce only the first message and the final "Calculating overall viability score" to avoid excessive announcements. Progress is announced at 25%, 50%, 75%, and 100%.
7. **Results:** Focus moves to results heading. The overall score is announced via `aria-label` on the SVG container: "Overall viability score: 78 out of 100." Each accordion section announces its title and score when focused. Content within sections is standard prose.

### 10.4 Focus Management

- "Analyze My Idea" hero CTA scrolls to form and focuses the textarea
- After Step 1 to Step 2 transition, focus moves to the email input
- After clicking "Back" in Step 2, focus returns to the textarea
- After loading completes, focus moves to the results heading (`tabindex="-1"`)
- Accordion sections use standard focus management: Tab moves between headers, Enter/Space toggles, content is in tab order when expanded

### 10.5 Reduced Motion

When `prefers-reduced-motion: reduce`:
- Scanning animation stops (static brain icon displayed)
- Circular score fills instantly (no stroke animation)
- Score number appears instantly (no count-up)
- Category progress bars fill instantly
- All slide/translate animations become instant opacity transitions
- Accordion expand/collapse is instant (no height animation)

### 10.6 Color Contrast Verification

| Element | Foreground | Background | Ratio | Pass |
|---------|-----------|-----------|-------|------|
| Section label "AI IDEA ANALYZER" | `#60A5FA` (blue-400) | `#0F1419` | 5.6:1 | AA Yes |
| Description text | `#9CA3AF` | `#0F1419` | 7.3:1 | AA Yes |
| Blue button text | `#FFFFFF` | `#3B82F6` | 3.6:1 | AA Large text (18px bold) |
| Score "72" | `#FFFFFF` | `#1A2332` | 11.2:1 | AA Yes |
| Category label | `#9CA3AF` | `#1A2332` | 5.1:1 | AA Yes |
| Analysis body text | `#F4F4F2` | `#1A2332` | 11.2:1 | AA Yes |
| Competitor tag | `#93C5FD` (blue-300) | `#172554` (blue-950) | 5.8:1 | AA Yes |

---

## 11. RTL Considerations

### 11.1 Layout Mirroring

When the page is in Arabic (RTL) mode:

**General rules (same as Idea Lab):**
- All horizontal layouts mirror
- Text aligns right
- Direction icons flip
- Step indicator reads right-to-left

**Analyzer-specific RTL changes:**

| Element | LTR | RTL |
|---------|-----|-----|
| Hero deliverables row | Left-to-right icon order | Right-to-left icon order |
| Continuity banner | Orange icon left, text right, X right | Orange icon right, text left, X left |
| Guiding prompts | Icon left, text right | Icon right, text left |
| Textarea | `text-left`, placeholder LTR | `text-right`, placeholder RTL |
| Optional fields labels | Above input, left-aligned | Above input, right-aligned |
| Select chevron | Right side | Left side, `pr-10` becomes `pl-10` |
| Score circle | Center (unchanged) | Center (unchanged) |
| Score cards grid | LTR flow | RTL flow |
| Accordion header | Icon+title left, score+chevron right | Icon+title right, score+chevron left |
| Recommendation numbers | Left-aligned | Right-aligned |
| Competitor cards | Name left, tag right | Name right, tag left |
| Revenue model pros/cons | LTR flex | RTL flex |
| CTA buttons | LTR order | RTL order |

### 11.2 Typography in Arabic

Same guidelines as Idea Lab:
- System Arabic fonts with Noto Sans Arabic fallback
- Line-height increased to 1.75 for body text
- Letter-spacing reset to 0
- No `uppercase` transform (section labels display translated text without case transformation)

### 11.3 Content Translation Notes

- Guiding prompts must be culturally adapted, not just translated
- Industry options in the select must include locally relevant industries
- Revenue model options should include region-specific models (e.g., "Mobile wallet payments" popular in MENA)
- Currency references in results should adapt to regional conventions
- Score interpretations (Excellent/Good/Possible/Reconsider) must be translated with culturally appropriate phrasing
- Competitor names in results will be AI-generated and may already include regional competitors when Arabic is detected

---

## 12. Error States

### 12.1 Form Validation Errors

| Step | Field | Validation Rule | Error Message |
|------|-------|-----------------|---------------|
| 1 | Idea textarea | Min 30 chars | "Please describe your idea in at least 30 characters for a meaningful analysis." |
| 1 | Idea textarea | Max 2000 chars | Character counter turns red; stops accepting input at 2000 |
| 1 | Target audience (opt.) | Max 200 chars | "Please keep your target audience description under 200 characters." |
| 2 | Email | Valid format | "Please enter a valid email address." |
| 2 | Phone (if checked) | Valid format | "Please enter a valid phone number with country code." |

**Inline error display:** Same pattern as Idea Lab. `text-sm text-error` with `AlertCircle` icon, appearing below the invalid field with a slide-down + fade-in animation (200ms).

### 12.2 API Error State

```
+------------------------------------------------------------------+
|                                                                    |
|              [AlertTriangle icon, h-12 w-12, text-error]          |
|                                                                    |
|           Analysis Could Not Be Completed                          |
|           text-xl font-semibold text-white                         |
|                                                                    |
|           Our AI encountered an issue while analyzing your idea.  |
|           This is usually temporary.                               |
|           text-base text-muted                                     |
|                                                                    |
|           [  Try Again  ]    [  Contact Support  ]                |
|                                                                    |
|           Your idea has been saved -- we won't ask you             |
|           to type it again.                                        |
|           text-xs text-muted-light italic                          |
|                                                                    |
+------------------------------------------------------------------+
```

Key difference from Idea Lab: The "Your idea has been saved" message. Because the user invested significant effort typing their description, losing it would be extremely frustrating. The form state is preserved so "Try Again" does not require re-entry.

### 12.3 Rate Limiting

Same pattern as Idea Lab. 3 analyses per 24 hours per user.

```
+------------------------------------------------------------------+
|                                                                    |
|  [Shield icon, h-8 w-8, text-blue-400]                           |
|                                                                    |
|  You've reached the daily analysis limit                           |
|  text-lg font-semibold text-white                                  |
|                                                                    |
|  You've used 3 of 3 free analyses today. To continue:             |
|  text-base text-muted                                              |
|                                                                    |
|  * Come back tomorrow for 3 more free analyses                    |
|  * Book a call for in-depth analysis with our team                |
|                                                                    |
|  [Book a Free Call]                                                |
|                                                                    |
+------------------------------------------------------------------+
```

### 12.4 Partial/Low-Quality Results

If the AI returns an analysis with very low confidence or missing sections, display what is available with a disclaimer:

"Some analysis sections may be limited due to the information provided. For a more comprehensive analysis, try adding more detail about your idea or book a call with our team for a personal review."

Missing sections display a placeholder card:

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-5 opacity-60">
  <div class="flex items-center gap-3">
    <div class="h-10 w-10 rounded-lg bg-slate-blue-light flex items-center justify-center">
      <HelpCircle class="h-5 w-5 text-muted" />
    </div>
    <div>
      <h3 class="text-lg font-semibold text-muted">Competition Overview</h3>
      <p class="text-sm text-muted-light mt-1">
        Not enough information to analyze competition. Try adding more detail
        about your target market.
      </p>
    </div>
  </div>
</div>
```

### 12.5 Network/Timeout Error

If the request times out after 90 seconds (longer timeout than Idea Lab because analysis is more complex):

Message: "The analysis is taking longer than expected. Our AI is working on a thorough review."

Actions:
- "Keep Waiting" (extends timeout by another 60 seconds)
- "Email Me When Ready" (switches to async; user receives results by email)
- "Try Again" (restarts the request)

### 12.6 Pre-fill Error (Path B)

If the URL parameters from Idea Lab are malformed or expired:

The banner displays a warning variant: "We couldn't load your Idea Lab results. Please describe your idea below to get started."

The form proceeds normally without pre-fill.

### 12.7 JavaScript Disabled

Same approach as Idea Lab: SSR the hero and static content. Form section shows a `<noscript>` message:

"AI Idea Analyzer requires JavaScript to perform real-time analysis. Please enable JavaScript, or contact us directly and our team will analyze your idea personally."

---

## 13. SEO

### 13.1 URL Structure

| Language | URL |
|----------|-----|
| English | `/idea-analyzer` |
| Arabic | `/ar/idea-analyzer` |

When pre-filled from Idea Lab, the URL may include a query parameter: `/idea-analyzer?from=idea-lab&ref=abc123`. This does not affect SEO (parameters are not indexed).

### 13.2 Meta Tags

```html
<title>AI Idea Analyzer - Validate Your App Idea | Aviniti</title>
<meta name="description" content="Have an app idea? Get a free AI-powered analysis with market potential, technical feasibility, monetization strategies, and competition overview. Validate your concept before investing." />
<meta name="keywords" content="app idea validation, AI idea analysis, startup idea validator, market analysis, technical feasibility, Aviniti" />
<link rel="canonical" href="https://aviniti.com/idea-analyzer" />

<!-- Open Graph -->
<meta property="og:title" content="AI Idea Analyzer - Validate Your App Idea | Aviniti" />
<meta property="og:description" content="Get a free AI-powered analysis of your app idea. Market potential, technical feasibility, monetization, and competition -- all in one report." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://aviniti.com/idea-analyzer" />
<meta property="og:image" content="https://aviniti.com/og/idea-analyzer.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Aviniti" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AI Idea Analyzer - Validate Your App Idea | Aviniti" />
<meta name="twitter:description" content="Free AI-powered analysis: market potential, technical feasibility, monetization, and competition for your app idea." />
<meta name="twitter:image" content="https://aviniti.com/og/idea-analyzer.png" />

<!-- Alternate languages -->
<link rel="alternate" hreflang="en" href="https://aviniti.com/idea-analyzer" />
<link rel="alternate" hreflang="ar" href="https://aviniti.com/ar/idea-analyzer" />
<link rel="alternate" hreflang="x-default" href="https://aviniti.com/idea-analyzer" />
```

### 13.3 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AI Idea Analyzer - App Idea Validator",
  "description": "Get a free AI-powered analysis of your app idea including market potential, technical feasibility, monetization strategies, and competition overview.",
  "url": "https://aviniti.com/idea-analyzer",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Aviniti",
    "url": "https://aviniti.com"
  },
  "featureList": [
    "Market potential analysis",
    "Technical feasibility assessment",
    "Monetization strategy recommendations",
    "Competition overview",
    "Overall viability score"
  ]
}
```

Breadcrumb structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://aviniti.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "AI Tools",
      "item": "https://aviniti.com/ai-tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "AI Idea Analyzer",
      "item": "https://aviniti.com/idea-analyzer"
    }
  ]
}
```

### 13.4 OG Image Specification

The Open Graph image (`/og/idea-analyzer.png`) should be:
- Dimensions: 1200x630px
- Background: Deep navy `#0F1419`
- Left side: Aviniti logo (small, top-left)
- Center: Large blue magnifying glass / search icon with sparkle overlay
- Text: "AI Idea Analyzer" in white, 48px bold. "Validate Your App Idea with AI" below in `#9CA3AF`, 24px
- Bottom-right: Five small score category icons in a row (blue tinted)
- Bottom: "aviniti.com" in `#C08460`, 16px
- Subtle blue gradient glow behind the icon

### 13.5 Performance Notes for SEO

- Hero and deliverables are SSR for immediate indexing
- Form and results are client-side interactive
- Analysis sections use accordion (content is in DOM, just collapsed) -- crawlable
- Page load within 3-second LCP budget
- Code splitting: form validation and API logic lazy-loaded
- Results page content is not indexable per-session (dynamic, unique per user), but the static page structure provides sufficient SEO value

---

## Appendix: State Management

### Form State Shape

```ts
interface AnalyzerState {
  currentStep: 1 | 2;
  direction: 1 | -1;
  prefill: {
    source: 'idea-lab' | null;
    ideaName: string | null;
    ideaDescription: string | null;
  } | null;
  formData: {
    ideaDescription: string;          // Step 1 (required)
    targetAudience: string;           // Step 1 (optional)
    industry: string | null;          // Step 1 (optional)
    revenueModel: string | null;      // Step 1 (optional)
    email: string;                    // Step 2
    whatsappEnabled: boolean;         // Step 2
    whatsappNumber: string;           // Step 2
  };
  validation: {
    [key: string]: string | null;
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  loadingPhase: number;              // 0-4, maps to category being "analyzed"
  results: AnalysisResult | null;
  error: string | null;
}

interface AnalysisResult {
  ideaName: string;                   // AI-generated name for the idea
  overallScore: number;               // 0-100
  summary: string;                    // 2-3 sentence executive summary
  categories: {
    market: CategoryAnalysis;
    technical: CategoryAnalysis;
    monetization: CategoryAnalysis;
    competition: CategoryAnalysis;
  };
  recommendations: string[];          // 3-5 actionable recommendations
}

interface CategoryAnalysis {
  score: number;                      // 0-100
  title: string;                      // Category name
  subtitle: string;                   // Brief descriptor
  content: string;                    // Full analysis (markdown-compatible)
  keyFindings: string[];              // 3-5 bullet points
  // Category-specific fields:
  complexity?: 'low' | 'medium' | 'high';     // Technical only
  techStack?: string[];                        // Technical only
  revenueModels?: RevenueModel[];              // Monetization only
  competitors?: Competitor[];                  // Competition only
}

interface RevenueModel {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

interface Competitor {
  name: string;
  description: string;
  type: 'direct' | 'indirect' | 'potential';
}
```

### API Contract

**Request:**
```
POST /api/idea-analyzer
Content-Type: application/json

{
  "ideaDescription": "I want to build a smart patient queue management app...",
  "targetAudience": "Clinics and hospitals with 5-50 staff",
  "industry": "health",
  "revenueModel": "subscription",
  "email": "user@example.com",
  "whatsapp": "+962791234567",
  "source": "idea-lab",
  "sourceRef": "abc123"
}
```

**Response (200):**
```json
{
  "ideaName": "MedQueue Pro",
  "overallScore": 78,
  "summary": "Your idea shows strong potential with solid market opportunity...",
  "categories": {
    "market": {
      "score": 72,
      "title": "Market Potential",
      "subtitle": "Size, growth, and opportunity assessment",
      "content": "The health and wellness app market...",
      "keyFindings": [
        "Large addressable market with consistent growth",
        "Patient experience improvement is a top healthcare priority",
        "Government digitization initiatives support adoption"
      ]
    },
    "technical": {
      "score": 85,
      "title": "Technical Feasibility",
      "subtitle": "Complexity, tech stack, and challenges",
      "content": "This application has moderate technical complexity...",
      "keyFindings": ["..."],
      "complexity": "medium",
      "techStack": ["React Native", "Node.js", "PostgreSQL", "Firebase"]
    },
    "monetization": {
      "score": 68,
      "title": "Monetization Strategies",
      "subtitle": "Revenue models and pricing approaches",
      "content": "...",
      "keyFindings": ["..."],
      "revenueModels": [
        {
          "name": "Subscription (SaaS)",
          "description": "Monthly/annual per-clinic license",
          "pros": ["Recurring revenue", "Predictable cash flow"],
          "cons": ["Slower initial adoption", "Requires ongoing value delivery"]
        }
      ]
    },
    "competition": {
      "score": 74,
      "title": "Competition Overview",
      "subtitle": "Competitive landscape and differentiation",
      "content": "...",
      "keyFindings": ["..."],
      "competitors": [
        {
          "name": "QueueDr",
          "description": "Patient scheduling and queue management",
          "type": "direct"
        }
      ]
    }
  },
  "recommendations": [
    "Start with an MVP focused on core queue management",
    "Target small-to-medium clinics (5-20 staff) for initial adoption",
    "Differentiate with AI-powered wait time predictions",
    "Consider freemium model to drive initial adoption"
  ]
}
```

**Error (429 - Rate Limited):**
```json
{
  "error": "rate_limited",
  "message": "You have reached the daily limit for AI Idea Analyzer.",
  "retryAfter": 86400
}
```

**Error (500 - Server Error):**
```json
{
  "error": "analysis_failed",
  "message": "Could not complete the analysis. Please try again."
}
```

**Error (422 - Insufficient Input):**
```json
{
  "error": "insufficient_input",
  "message": "The idea description is too vague for a meaningful analysis. Please provide more detail.",
  "suggestion": "Try describing the problem your app solves, who it's for, and what makes it different."
}
```

---

**End of AI Idea Analyzer Design Specification**
