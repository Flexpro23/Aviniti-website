# AI ROI Calculator - Design Specification

**Version:** 1.0
**Date:** February 2026
**Tool Accent:** Purple `#A855F7` (tool-purple)
**Route:** `/roi-calculator`
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

The AI ROI Calculator is a **justification tool**. It helps prospects who may be interested in building an app but need to quantify the business value before committing budget. It converts the abstract question "Should we build an app?" into a concrete financial answer: "An app will save you $X per year and pay for itself in Y months."

This tool targets decision-makers -- CTOs, founders, and product managers -- who need data to present internally or to justify the investment to stakeholders.

### 1.2 User Journey

The typical visitor arrives here through one of these paths:

1. **From homepage AI Tools Spotlight** -- clicked "Calculate ROI" on the purple card
2. **From Get AI Estimate results** -- cross-sell card recommending ROI analysis
3. **From navigation or footer** -- direct entry via AI Tools links
4. **From organic search** -- searching "app ROI calculator" or "cost of building an app vs savings"
5. **From Avi chatbot** -- Avi recommended the calculator when the visitor asked "Is building an app worth it?"

### 1.3 Conversion Goal

**Primary:** Capture a qualified lead with business context (they have told us their operational costs, pain points, and employee count -- extremely valuable for sales follow-up), delivering an AI-generated ROI report that proves the value of working with Aviniti.

**Secondary:** Drive the visitor to Get AI Estimate (now armed with ROI data, they are more likely to commit). Book a Calendly call. Download the ROI report as a PDF. Start a WhatsApp conversation.

### 1.4 Psychology of the Tool

The purple accent was chosen deliberately. Purple signals wisdom, strategic thinking, and premium value. The calculator positions the visitor as a smart decision-maker who does their due diligence. By showing them how much money they are currently losing to manual processes, the tool creates urgency -- the cost of inaction becomes tangible.

### 1.5 Success Metrics

- Form completion rate (target: >35% of visitors who start)
- Calculator-to-Estimate conversion rate (target: >25%)
- ROI report PDF downloads
- Calendly bookings from results page
- Average annual ROI amount (for sales team intelligence)

---

## 2. Page Layout

### 2.1 Full Page Wireframe (Desktop) -- Form State

```
+====================================================================+
|                        NAVIGATION BAR                               |
|  [Logo]    Home  Get AI Estimate  FAQ  Blog  [Idea Lab]   [EN/AR]  |
+====================================================================+
|                                                                      |
|  Breadcrumb: Home > AI ROI Calculator                                |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|                    HERO / HEADER SECTION                              |
|                                                                      |
|       [Purple trending-up icon in purple-tinted circle]              |
|                                                                      |
|     How Much Could an App Save Your Business?                        |
|     Answer a few questions about your current operations             |
|     and our AI will calculate your potential savings.                 |
|                                                                      |
|     [Free to Use]  [2-Minute Assessment]  [Detailed Report]          |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|   STEPPER PROGRESS BAR                                               |
|                                                                      |
|   (1)---------(2)---------(3)---------(4)---------(5)                |
|  Current    Time &      Costs &    Revenue     Contact               |
|  Process    Team        Issues     Impact      Info                  |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|           FORM STEP CONTENT AREA                                      |
|         (max-width: 720px, centered)                                 |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                                                                |   |
|  |  Step 1: What manual process would the app                    |   |
|  |  replace or improve?                                          |   |
|  |                                                                |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |  | [clipboard icon]  |  | [settings icon]   |                  |   |
|  |  | Customer Orders   |  | Internal          |                  |   |
|  |  | & Bookings        |  | Operations        |                  |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |                                                                |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |  | [headphones icon] |  | [package icon]    |                  |   |
|  |  | Customer Support  |  | Inventory &       |                  |   |
|  |  | & Communication   |  | Resource Mgmt     |                  |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |                                                                |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |  | [users icon]      |  | [bar-chart icon]  |                  |   |
|  |  | Sales & Lead      |  | Data Collection   |                  |   |
|  |  | Management        |  | & Reporting       |                  |   |
|  |  +-------------------+  +-------------------+                  |   |
|  |                                                                |   |
|  |  +-------------------------------------------+                 |   |
|  |  | [edit icon]                                |                 |   |
|  |  | Other (describe below)                     |                 |   |
|  |  | [text input for custom process]            |                 |   |
|  |  +-------------------------------------------+                 |   |
|  |                                                                |   |
|  |                                 [Next: Time & Team ->]         |   |
|  |                                                                |   |
|  +--------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|   SOCIAL PROOF STRIP                                                 |
|   "Companies using apps save an average of 30% on                    |
|    operational costs" - Source citation                               |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|                          FOOTER                                      |
|                                                                      |
+----------------------------------------------------------------------+
```

### 2.2 Full Page Wireframe -- Results State (Desktop)

```
+====================================================================+
|                        NAVIGATION BAR                               |
+====================================================================+
|                                                                      |
|  Breadcrumb: Home > AI ROI Calculator > Your ROI Report              |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  RESULTS HEADER                                                      |
|                                                                      |
|  [Purple checkmark in circle]                                        |
|  Your ROI Analysis Is Ready                                          |
|  Based on your inputs, here is your potential return.                |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  HERO METRIC (centered, large)                                       |
|                                                                      |
|              YOUR ESTIMATED ANNUAL ROI                                |
|                                                                      |
|                   $127,500                                            |
|                                                                      |
|          [payback: 4 months]  [ROI: 638%]                           |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  SAVINGS BREAKDOWN (4 cards in a row)                                |
|                                                                      |
|  +-----------+ +-----------+ +-----------+ +-----------+            |
|  | Annual    | | Error     | | Revenue   | | Time      |            |
|  | Labor     | | Reduction | | Increase  | | Savings   |            |
|  | Savings   | | Savings   | |           | |           |            |
|  |           | |           | |           | |           |            |
|  | $72,000   | | $18,000   | | $37,500   | | 1,560 hrs |            |
|  +-----------+ +-----------+ +-----------+ +-----------+            |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  VISUAL: ROI TIMELINE CHART                                          |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                                        /------/               |   |
|  |                              /--------/                       |   |
|  |  Investment      /---------/                                  |   |
|  |  ----------     /                                             |   |
|  |            \   / <- Break-even point (Month 4)                |   |
|  |             \_/                                               |   |
|  |  M1   M2   M3   M4   M5   M6   M7   M8   M9   M10  M11 M12 |   |
|  +--------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  COST vs RETURN COMPARISON                                           |
|                                                                      |
|  +--------------------------------------------------------------+   |
|  |                                                                |   |
|  |  Cost of App Development:     $15,000 - $25,000               |   |
|  |  ========================================                     |   |
|  |                                                                |   |
|  |  Year 1 Return:               $127,500                        |   |
|  |  ========================================================    |   |
|  |                                                                |   |
|  |  3-Year Return:               $382,500                        |   |
|  |  ============================================================ |   |
|  |                                                                |   |
|  +--------------------------------------------------------------+   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  AI KEY INSIGHT                                                      |
|                                                                      |
|  "Based on your inputs, an app could pay for itself in              |
|   just 4 months and generate $127,500 in annual savings.            |
|   The biggest opportunity is automating your order                   |
|   processing, which alone accounts for 56% of potential savings."   |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  CTA SECTION                                                         |
|                                                                      |
|  [Get a Custom Estimate]  [Book a Call]                              |
|  [Download ROI Report PDF]  [Share on WhatsApp]                      |
|                                                                      |
+----------------------------------------------------------------------+
|                                                                      |
|  CROSS-SELL: OTHER AI TOOLS                                          |
|                                                                      |
|  +---------------------+ +---------------------+                    |
|  | Get AI Estimate      | | Idea Lab            |                    |
|  | Now that you know    | | Need inspiration    |                    |
|  | the ROI, get your    | | for what to build?  |                    |
|  | project quote.       | |                     |                    |
|  +---------------------+ +---------------------+                    |
|                                                                      |
+----------------------------------------------------------------------+
|                          FOOTER                                      |
+----------------------------------------------------------------------+
```

---

## 3. Hero / Header Section

### 3.1 Emotional Intent

The visitor must feel: "This is smart. This is exactly what I need to justify this investment." The purple creates an atmosphere of strategic intelligence. Unlike the green of Get Estimate (action-oriented, "let's go"), the purple says "let's think carefully." The hero must communicate value without pressure -- the ROI data will do the selling.

### 3.2 Layout

```
Background: bg-navy (#0F1419) with a subtle radial gradient:
  radial-gradient(ellipse at 50% 80%, rgba(168, 85, 247, 0.04) 0%, transparent 60%)
Section padding: pt-24 pb-12 md:pt-32 md:pb-16
Content: centered, max-w-[768px]
```

### 3.3 Visual Description

**Breadcrumb:**
```html
<nav aria-label="Breadcrumb" class="flex items-center justify-center gap-2 text-sm mb-8">
  <a href="/" class="text-muted hover:text-bronze transition-colors">Home</a>
  <ChevronRight class="h-4 w-4 text-muted-light" />
  <span class="text-purple-400">AI ROI Calculator</span>
</nav>
```

**Icon Circle:**
```html
<div class="mx-auto mb-6 h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center
  ring-1 ring-purple-500/20">
  <TrendingUp class="h-8 w-8 text-purple-400" aria-hidden="true" />
</div>
```

**Headline:**
```
How Much Could an App Save Your Business?
```
- Style: `text-h2` (clamp 1.5rem to 2.625rem), `font-bold`, `text-white`, `text-center`
- The word "Save" is wrapped in `<span class="text-purple-400">` for accent

**Description:**
```
Calculate your potential ROI in 2 minutes. Answer a few questions about your current
operations and our AI will estimate your potential savings and revenue gains.
```
- Style: `text-lg text-muted text-center`, max-w-[560px], mx-auto, mt-4

**Value Proposition Pills:**
Three inline pill badges, centered, mt-6, gap-3:

```html
<div class="flex flex-wrap items-center justify-center gap-3 mt-6">
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-purple-500/10 text-purple-300 text-sm font-medium border border-purple-500/20">
    <Sparkles class="h-4 w-4" aria-hidden="true" />
    Free to Use
  </span>
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-slate-blue-light text-muted text-sm font-medium">
    <Clock class="h-4 w-4" aria-hidden="true" />
    2-Minute Assessment
  </span>
  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
    bg-slate-blue-light text-muted text-sm font-medium">
    <FileText class="h-4 w-4" aria-hidden="true" />
    Detailed Report
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

Uses the same `heroAnimation` and `heroChild` Framer Motion variants as the Get Estimate page, maintaining consistency across tools.

---

## 4. Interactive Multi-Step Form

### 4.1 Form Architecture

The form uses a **5-step progressive disclosure pattern**. One more step than Get Estimate because the ROI calculation requires richer data inputs.

```
Total steps: 5
Step 1: Current Process (single select + optional text)
Step 2: Time & Team (sliders + number inputs)
Step 3: Costs & Issues (currency input + multi-select)
Step 4: Revenue Impact (radio selections with conditional inputs)
Step 5: Contact Information (email + optional fields)
```

### 4.2 Stepper Progress Indicator

**Layout:** Horizontal flex, centered, max-w-[640px], mx-auto, mb-10.

**Purple accent override:**

```
Completed step circle:     bg-purple-500 text-white (checkmark icon)
Current step circle:       border-2 border-purple-500 bg-purple-500/10 text-purple-400
Upcoming step circle:      border-2 border-slate-blue-light bg-transparent text-muted
Completed connector:       bg-purple-500
Upcoming connector:        bg-slate-blue-light
Current step label:        text-purple-300 font-medium
```

**Steps displayed:**

| Step # | Label |
|--------|-------|
| 1 | Current Process |
| 2 | Time & Team |
| 3 | Costs & Issues |
| 4 | Revenue Impact |
| 5 | Contact Info |

**Mobile stepper:** On screens < 640px, the step labels are hidden. Only circles and connectors are shown. Below the stepper: "Step 2 of 5 -- Time & Team" in `text-sm text-purple-300`. On mobile with 5 steps, the circles reduce to `h-8 w-8` and connectors use `mx-1` for tighter spacing.

### 4.3 Form Content Area

**Container:**
```html
<div class="mx-auto max-w-[720px] px-4 sm:px-6">
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 shadow-md">
    <!-- Step content renders here with AnimatePresence -->
  </div>
</div>
```

### 4.4 Step 1 -- Current Process

**Question:** "What manual process would the app replace or improve?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "Select the primary process you want to digitize. This helps us calculate the right ROI."
- Style: `text-sm text-muted mb-6`

**Selection type:** Single select via selectable cards. If "Other" is selected, a text input appears below.

**Options (7 cards in a 2-column grid, last card spans full width):**

| Option | Icon (Lucide) | Label | Description |
|--------|---------------|-------|-------------|
| orders | `ClipboardList` | Customer Orders & Bookings | Order processing, scheduling, reservations |
| operations | `Settings` | Internal Operations & Workflow | Task management, approvals, documentation |
| support | `Headphones` | Customer Support & Communication | Tickets, chat, follow-ups, feedback |
| inventory | `Package` | Inventory & Resource Management | Stock tracking, allocation, procurement |
| sales | `Users` | Sales & Lead Management | CRM, pipeline, follow-ups, proposals |
| data | `BarChart3` | Data Collection & Reporting | Manual reports, data entry, analytics |
| other | `Pencil` | Other | Describe your process below |

**Selectable Card Design (purple accent):**

```
Default state:
  Background:   bg-navy
  Border:       border border-slate-blue-light
  Radius:       rounded-lg
  Padding:      p-4

Hover state:
  Border:       border-purple-500/30
  Background:   bg-purple-500/5

Selected state:
  Border:       border-purple-500 border-2
  Background:   bg-purple-500/10
  Shadow:       shadow-glow-purple

Focus state:
  Ring:         ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-blue
```

```html
<!-- Selectable Card (selected state) -->
<button
  role="radio"
  aria-checked="true"
  class="w-full flex items-start gap-4 p-4 rounded-lg border-2 border-purple-500
    bg-purple-500/10 shadow-glow-purple text-left transition-all duration-200
    focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
    focus-visible:ring-offset-slate-blue"
>
  <div class="h-10 w-10 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
    <ClipboardList class="h-5 w-5 text-purple-400" />
  </div>
  <div>
    <span class="block text-base font-semibold text-white">Customer Orders & Bookings</span>
    <span class="block text-sm text-purple-300/80 mt-0.5">Order processing, scheduling, reservations</span>
  </div>
  <div class="ml-auto flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
    <Check class="h-4 w-4 text-white" />
  </div>
</button>
```

**"Other" conditional text input:**

When "Other" is selected, a text input smoothly expands below the cards:

```html
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
  class="overflow-hidden"
>
  <div class="mt-4 space-y-1.5">
    <label for="custom-process" class="block text-sm font-medium text-off-white">
      Describe your process
    </label>
    <textarea id="custom-process" rows="2"
      class="w-full min-h-[80px] px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light resize-y
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
        transition-all duration-200"
      placeholder="Describe the manual process you want to automate..."
      required></textarea>
  </div>
</motion.div>
```

**Validation:** One option must be selected. If "Other" is selected, the text input must have at least 10 characters.

### 4.5 Step 2 -- Time & Team

**Question:** "How much time and people are involved in this process?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "This helps us calculate the labor cost savings from automation."
- Style: `text-sm text-muted mb-6`

**Fields:**

**Field 1: Hours per week (slider + input)**

```html
<div class="space-y-3">
  <div class="flex items-center justify-between">
    <label for="hours-slider" class="text-sm font-medium text-off-white">
      Hours per week spent on this process
    </label>
    <div class="flex items-center gap-2">
      <input id="hours-input" type="number" min="1" max="200" value="20"
        class="w-20 h-9 px-2 py-1 bg-navy border border-slate-blue-light rounded-lg
          text-center text-base font-semibold text-white
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
          transition-all duration-200"
        aria-label="Hours per week" />
      <span class="text-sm text-muted">hrs/week</span>
    </div>
  </div>
  <input id="hours-slider" type="range" min="1" max="200" value="20"
    class="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer
      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
      [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2
      [&::-webkit-slider-thumb]:border-white
      [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
    style="background: linear-gradient(to right, #A855F7 0%, #A855F7 10%, #243044 10%, #243044 100%);"
    aria-label="Hours per week spent on this process"
  />
  <div class="flex justify-between text-xs text-muted">
    <span>1 hr</span>
    <span>50 hrs</span>
    <span>100 hrs</span>
    <span>200+ hrs</span>
  </div>
</div>
```

The slider track fill updates dynamically: the filled portion is `bg-purple-500`, the unfilled portion is `bg-slate-blue-light`.

**Field 2: Number of employees (number input with stepper)**

```html
<div class="mt-8 space-y-3">
  <label for="employees" class="block text-sm font-medium text-off-white">
    How many employees are involved in this process?
  </label>
  <div class="flex items-center gap-3">
    <button type="button" aria-label="Decrease employees"
      class="h-11 w-11 rounded-lg bg-navy border border-slate-blue-light
        flex items-center justify-center text-muted
        hover:border-purple-500/30 hover:text-white hover:bg-purple-500/5
        active:scale-95 transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed">
      <Minus class="h-5 w-5" />
    </button>
    <input id="employees" type="number" min="1" max="100" value="5"
      class="w-24 h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-center text-xl font-bold text-white
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
        transition-all duration-200"
      aria-label="Number of employees" />
    <button type="button" aria-label="Increase employees"
      class="h-11 w-11 rounded-lg bg-navy border border-slate-blue-light
        flex items-center justify-center text-muted
        hover:border-purple-500/30 hover:text-white hover:bg-purple-500/5
        active:scale-95 transition-all duration-150">
      <Plus class="h-5 w-5" />
    </button>
    <span class="text-sm text-muted">employees</span>
  </div>
</div>
```

**Live calculation preview:** As the user adjusts the slider and employee count, a live preview card updates:

```html
<div class="mt-6 p-4 rounded-lg bg-purple-500/5 border border-purple-500/15">
  <p class="text-sm text-muted">
    That is approximately
    <span class="text-white font-semibold">100 hours/week</span>
    or
    <span class="text-white font-semibold">5,200 hours/year</span>
    of manual work.
  </p>
</div>
```

This updates in real-time as the user adjusts inputs. The number transitions use `framer-motion`'s `useSpring` for smooth counter interpolation.

**Validation:** Hours must be >= 1. Employees must be >= 1.

### 4.6 Step 3 -- Costs & Issues

**Question:** "What are the costs and pain points of this process?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "We will use this to calculate your potential savings from automation."
- Style: `text-sm text-muted mb-6`

**Field 1: Average hourly cost per employee**

```html
<div class="space-y-1.5">
  <label for="hourly-cost" class="block text-sm font-medium text-off-white">
    Average hourly cost per employee
    <span class="text-muted text-xs">(salary + overhead)</span>
  </label>
  <div class="flex items-center gap-3">
    <!-- Currency selector -->
    <select id="currency"
      class="h-11 pl-3 pr-8 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white appearance-none
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
        transition-all duration-200"
      aria-label="Currency">
      <option value="USD">USD $</option>
      <option value="JOD">JOD</option>
      <option value="AED">AED</option>
      <option value="SAR">SAR</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
    <!-- Amount input -->
    <input id="hourly-cost" type="number" min="1" step="0.5" value="25"
      class="flex-1 h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
        transition-all duration-200"
      placeholder="25"
      aria-label="Hourly cost amount" />
    <span class="text-sm text-muted whitespace-nowrap">per hour</span>
  </div>
  <p class="text-xs text-muted mt-1">
    Tip: Include benefits and overhead (typically 1.3x-1.5x base salary / working hours).
  </p>
</div>
```

**Field 2: Current pain points (multi-select)**

**Question:** "Which of these issues do you currently experience?"

```html
<div class="mt-8">
  <label class="block text-sm font-medium text-off-white mb-4">
    Which of these issues do you currently experience?
    <span class="text-muted text-xs">(Select all that apply)</span>
  </label>
  <div class="space-y-3">
    <!-- Issue checkbox items -->
  </div>
</div>
```

**Issues (each is a checkbox with an impact indicator):**

| Issue | Icon | Impact Label |
|-------|------|-------------|
| Errors requiring rework | `AlertTriangle` | High cost |
| Missed opportunities or leads | `UserX` | Revenue loss |
| Customer complaints | `MessageCircle` | Reputation risk |
| Delayed deliveries or services | `Timer` | Customer churn |
| Manual data entry mistakes | `FileX` | Wasted time |
| Compliance or reporting gaps | `ShieldAlert` | Legal risk |

**Issue checkbox item design:**

```html
<label class="flex items-center gap-4 p-4 rounded-lg border border-slate-blue-light
  cursor-pointer hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-150
  has-[:checked]:border-purple-500/40 has-[:checked]:bg-purple-500/8">
  <input type="checkbox" name="issues[]" value="errors"
    class="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent
      checked:bg-purple-500 checked:border-purple-500
      focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
      focus-visible:ring-offset-slate-blue
      transition-colors duration-200" />
  <div class="flex-1">
    <div class="flex items-center gap-2">
      <AlertTriangle class="h-4 w-4 text-purple-400" aria-hidden="true" />
      <span class="text-sm font-medium text-off-white">Errors requiring rework</span>
    </div>
  </div>
  <span class="text-xs text-warning bg-warning-dark px-2 py-0.5 rounded-full">High cost</span>
</label>
```

**Live cost preview:** Updates as user selects issues:

```html
<div class="mt-6 p-4 rounded-lg bg-purple-500/5 border border-purple-500/15">
  <p class="text-sm text-muted">
    Current estimated labor cost:
    <span class="text-white font-semibold">$6,500/month</span>
    or
    <span class="text-white font-semibold">$78,000/year</span>
  </p>
  <p class="text-xs text-purple-300 mt-1">
    With 3 issues identified, error rates typically add 15-25% in hidden costs.
  </p>
</div>
```

**Validation:** Hourly cost must be > 0. At least one issue should be selected (show a soft warning if none selected, but allow proceeding).

### 4.7 Step 4 -- Revenue Impact

**Question:** "Could an app help you grow revenue?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "These questions help us estimate the revenue-side ROI, not just cost savings."
- Style: `text-sm text-muted mb-6`

**Sub-question 1:** "Could an app help you serve more customers?"

```html
<div class="space-y-3 mb-8">
  <p class="text-base font-medium text-off-white">
    Could an app help you serve more customers?
  </p>
  <div role="radiogroup" aria-label="Revenue increase from serving more customers"
    class="flex flex-wrap gap-3">
    <label class="flex-1 min-w-[120px]">
      <input type="radio" name="more-customers" value="yes" class="sr-only peer" />
      <div class="peer-checked:border-purple-500 peer-checked:bg-purple-500/10
        peer-checked:shadow-glow-purple
        border border-slate-blue-light rounded-lg p-3 text-center cursor-pointer
        hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200
        peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500
        peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-blue">
        <span class="block text-sm font-semibold text-white">Yes</span>
      </div>
    </label>
    <label class="flex-1 min-w-[120px]">
      <input type="radio" name="more-customers" value="no" class="sr-only peer" />
      <div class="peer-checked:border-purple-500 peer-checked:bg-purple-500/10
        border border-slate-blue-light rounded-lg p-3 text-center cursor-pointer
        hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200">
        <span class="block text-sm font-semibold text-white">No</span>
      </div>
    </label>
    <label class="flex-1 min-w-[120px]">
      <input type="radio" name="more-customers" value="unsure" class="sr-only peer" />
      <div class="peer-checked:border-purple-500 peer-checked:bg-purple-500/10
        border border-slate-blue-light rounded-lg p-3 text-center cursor-pointer
        hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-200">
        <span class="block text-sm font-semibold text-white">Not Sure</span>
      </div>
    </label>
  </div>

  <!-- Conditional: Estimate percentage (shown only if "Yes" is selected) -->
  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
    <div class="mt-3 flex items-center gap-3">
      <label for="customer-increase" class="text-sm text-muted whitespace-nowrap">
        Estimated increase:
      </label>
      <input id="customer-increase" type="number" min="1" max="200" value="20"
        class="w-20 h-9 px-2 py-1 bg-navy border border-slate-blue-light rounded-lg
          text-center text-base font-semibold text-white
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
          transition-all duration-200" />
      <span class="text-sm text-muted">%</span>
    </div>
  </motion.div>
</div>
```

**Sub-question 2:** "Could an app increase customer retention?"

Same structure as Sub-question 1 with options: Yes (with percentage input), No, Not Sure.

**Sub-question 3 (optional, shown if "Yes" to either above):** "What is your approximate monthly revenue?"

```html
<div class="space-y-1.5">
  <label for="monthly-revenue" class="block text-sm font-medium text-off-white">
    Approximate monthly revenue
    <span class="text-muted text-xs">(helps us calculate revenue impact accurately)</span>
  </label>
  <div class="flex items-center gap-3">
    <span class="text-muted text-sm">$</span>
    <input id="monthly-revenue" type="number" min="0" step="1000"
      class="flex-1 h-11 px-3 py-2.5 bg-navy border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none
        transition-all duration-200"
      placeholder="50,000" />
    <span class="text-sm text-muted whitespace-nowrap">per month</span>
  </div>
</div>
```

**Validation:** At least the two primary questions must be answered (Yes/No/Not Sure). Percentage inputs only required if "Yes" is selected.

### 4.8 Step 5 -- Contact Information

**Question:** "Where should we send your detailed ROI report?"
- Style: `text-h4 text-white mb-2`

**Helper text:** "We will email you a comprehensive ROI report with full calculations."
- Style: `text-sm text-muted mb-6`

**Fields:**

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| Email | email | Yes | Valid email | "you@company.com" |
| Full Name | text | No | Min 2 chars | "Your Name (optional)" |
| Company | text | No | -- | "Your Company (optional)" |
| WhatsApp checkbox | checkbox | No | -- | "Also send report via WhatsApp" |

The field design follows the same pattern as Get Estimate Step 4, but with purple accent focus states:

```
focus:border-purple-500 focus:ring-1 focus:ring-purple-500
```

**Submit button:**
```html
<button type="submit"
  class="w-full sm:w-auto h-12 px-8 bg-purple-500 text-white font-semibold rounded-lg shadow-md
    hover:bg-purple-600 hover:shadow-lg hover:scale-[1.02]
    active:bg-purple-700 active:scale-[0.98]
    disabled:opacity-40 disabled:cursor-not-allowed
    transition-all duration-200
    inline-flex items-center justify-center gap-2 text-lg">
  <TrendingUp class="h-5 w-5" />
  Calculate My ROI
</button>
```

### 4.9 Step Transition Animation

Identical to Get Estimate: horizontal slide with directional awareness. Departing step slides out left (or right when going back), arriving step slides in from right (or left).

```ts
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

### 4.10 Social Proof Strip (Below Form)

A trust/social proof strip below the form card:

```html
<div class="flex flex-wrap items-center justify-center gap-4 mt-8 p-4 rounded-lg
  bg-purple-500/5 border border-purple-500/10 max-w-[720px] mx-auto">
  <BarChart3 class="h-5 w-5 text-purple-400 flex-shrink-0" aria-hidden="true" />
  <p class="text-sm text-muted text-center">
    Companies using custom apps report an average of
    <span class="text-white font-semibold">30% reduction in operational costs</span>
    within the first year.
  </p>
</div>
```

---

## 5. AI Processing State

### 5.1 Visual Design

Same container as the form, replacing the form content. Centered layout.

```
+--------------------------------------------------------------+
|                                                                |
|           [Animated purple pulse ring]                         |
|           [TrendingUp icon in center]                         |
|                                                                |
|           Calculating Your Potential ROI                       |
|                                                                |
|           [Progress bar: 0% to 100%]                          |
|                                                                |
|           [Rotating status messages]                           |
|           "Analyzing your operational costs..."                |
|                                                                |
|                                                                |
+--------------------------------------------------------------+
```

**Animated icon:** TrendingUp icon (24px, text-purple-400) inside a 72px circle with `bg-purple-500/10`. Three concentric pulse rings:

```html
<div class="relative mx-auto h-[72px] w-[72px]">
  <span class="absolute inset-0 rounded-full bg-purple-500/10 animate-ping"
    style="animation-duration: 2s;" />
  <span class="absolute inset-[-8px] rounded-full bg-purple-500/5 animate-ping"
    style="animation-duration: 2.5s; animation-delay: 0.3s;" />
  <div class="relative h-full w-full rounded-full bg-purple-500/10 flex items-center justify-center
    ring-1 ring-purple-500/30">
    <TrendingUp class="h-8 w-8 text-purple-400 animate-pulse" />
  </div>
</div>
```

**Headline:** "Calculating Your Potential ROI"
- Style: `text-xl font-semibold text-white mt-8 text-center`

**Progress bar:** Purple fill:
```html
<div class="max-w-[300px] mx-auto mt-6">
  <div class="h-1.5 w-full bg-slate-blue-light rounded-full overflow-hidden">
    <div class="h-full bg-purple-500 rounded-full transition-all duration-500 ease-out"
      style="width: 65%;" />
  </div>
</div>
```

**Rotating status messages:**

```
1. "Analyzing your operational costs..."
2. "Calculating labor savings potential..."
3. "Evaluating error reduction impact..."
4. "Estimating revenue opportunities..."
5. "Comparing with industry benchmarks..."
6. "Generating your personalized ROI report..."
```

Style: `text-sm text-muted text-center mt-4`

### 5.2 Duration

- **Minimum display time:** 3 seconds
- **Maximum wait time:** 30 seconds before timeout error
- **Expected time:** 5-10 seconds for Gemini API response

### 5.3 Celebration Transition

When results are ready, a brief purple checkmark animation plays (scale 0 to 1 with spring ease), then transitions to the results view.

---

## 6. Results Display

### 6.1 Results Header

```html
<div class="text-center mb-8">
  <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-purple-500/15 flex items-center justify-center">
    <CheckCircle class="h-8 w-8 text-purple-400" />
  </div>
  <h1 class="text-h2 text-white">Your ROI Analysis Is Ready</h1>
  <p class="text-lg text-muted mt-3 max-w-[480px] mx-auto">
    Based on your inputs, here is your potential return on investment.
  </p>
</div>
```

### 6.2 Hero Metric (The Big Number)

The single most impactful element on the results page. The total annual ROI is displayed as a massive number.

```html
<div class="text-center py-8 mb-8 bg-gradient-to-br from-tool-purple-dark to-slate-blue
  border border-purple-500/20 rounded-2xl">
  <p class="text-sm font-semibold text-purple-300 uppercase tracking-widest">
    Your Estimated Annual ROI
  </p>
  <p class="text-5xl md:text-6xl font-extrabold text-white mt-3 tabular-nums">
    $127,500
  </p>
  <div class="flex items-center justify-center gap-6 mt-4">
    <div class="flex items-center gap-2">
      <Clock class="h-4 w-4 text-purple-400" />
      <span class="text-sm text-off-white">
        Payback: <span class="font-semibold text-purple-300">4 months</span>
      </span>
    </div>
    <div class="h-4 w-px bg-slate-blue-light" />
    <div class="flex items-center gap-2">
      <TrendingUp class="h-4 w-4 text-purple-400" />
      <span class="text-sm text-off-white">
        ROI: <span class="font-semibold text-purple-300">638%</span>
      </span>
    </div>
  </div>
</div>
```

**Animation:** The dollar amount counts up from $0 to the final value using a spring-eased counter animation (1.5s duration). The payback period and ROI percentage fade in after the counter completes (300ms delay, 400ms duration).

```ts
// Animated counter for the hero metric
const animatedValue = useSpring(0, { stiffness: 50, damping: 15 });
useEffect(() => { animatedValue.set(127500); }, []);
const displayValue = useTransform(animatedValue, (v) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
);
```

### 6.3 Savings Breakdown Cards (4 across)

Four metric cards showing the component breakdown of the total ROI.

```html
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <!-- Labor Savings -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-5 text-center">
    <div class="mx-auto mb-2 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <Users class="h-5 w-5 text-purple-400" />
    </div>
    <p class="text-xs text-muted uppercase tracking-wider">Annual Labor Savings</p>
    <p class="text-xl md:text-2xl font-bold text-white mt-1 tabular-nums">$72,000</p>
    <p class="text-xs text-purple-300 mt-1">Reduced manual hours</p>
  </div>

  <!-- Error Reduction -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-5 text-center">
    <div class="mx-auto mb-2 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <ShieldCheck class="h-5 w-5 text-purple-400" />
    </div>
    <p class="text-xs text-muted uppercase tracking-wider">Error Reduction Savings</p>
    <p class="text-xl md:text-2xl font-bold text-white mt-1 tabular-nums">$18,000</p>
    <p class="text-xs text-purple-300 mt-1">Fewer mistakes & rework</p>
  </div>

  <!-- Revenue Increase -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-5 text-center">
    <div class="mx-auto mb-2 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <DollarSign class="h-5 w-5 text-purple-400" />
    </div>
    <p class="text-xs text-muted uppercase tracking-wider">Revenue Increase</p>
    <p class="text-xl md:text-2xl font-bold text-white mt-1 tabular-nums">$37,500</p>
    <p class="text-xs text-purple-300 mt-1">More customers served</p>
  </div>

  <!-- Time Savings -->
  <div class="bg-slate-blue border border-slate-blue-light rounded-xl p-5 text-center">
    <div class="mx-auto mb-2 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <Clock class="h-5 w-5 text-purple-400" />
    </div>
    <p class="text-xs text-muted uppercase tracking-wider">Time Recovered</p>
    <p class="text-xl md:text-2xl font-bold text-white mt-1 tabular-nums">1,560 hrs</p>
    <p class="text-xs text-purple-300 mt-1">Per year redirected</p>
  </div>
</div>
```

**Animation:** Cards stagger in with `fadeInUp` variant, 80ms stagger. Each number uses a count-up animation (800ms duration).

### 6.4 ROI Timeline Chart

A visual chart showing the break-even point and cumulative ROI over 12 months. This is the most visually compelling element on the page.

**Implementation:** Use a lightweight SVG chart (no heavy charting library). The chart is rendered as a `<svg>` element with paths for the investment line and the cumulative savings line.

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 mb-8">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-lg font-semibold text-white">ROI Timeline</h2>
    <div class="flex items-center gap-4 text-xs">
      <span class="flex items-center gap-1.5">
        <span class="h-2 w-6 rounded-full bg-purple-500" aria-hidden="true"></span>
        Cumulative Savings
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-2 w-6 rounded-full bg-slate-blue-light" aria-hidden="true"></span>
        App Investment
      </span>
    </div>
  </div>

  <!-- SVG Chart -->
  <div class="relative h-[240px] md:h-[300px]">
    <svg viewBox="0 0 600 240" class="w-full h-full" role="img"
      aria-label="ROI timeline chart showing break-even at month 4">
      <!-- Grid lines -->
      <line x1="40" y1="200" x2="580" y2="200" stroke="#243044" stroke-width="1" />
      <line x1="40" y1="150" x2="580" y2="150" stroke="#243044" stroke-width="0.5" stroke-dasharray="4" />
      <line x1="40" y1="100" x2="580" y2="100" stroke="#243044" stroke-width="0.5" stroke-dasharray="4" />
      <line x1="40" y1="50" x2="580" y2="50" stroke="#243044" stroke-width="0.5" stroke-dasharray="4" />

      <!-- Investment line (flat) -->
      <line x1="40" y1="160" x2="580" y2="160" stroke="#6B7280" stroke-width="2" stroke-dasharray="6" />

      <!-- Cumulative savings curve -->
      <path d="M40,200 C100,190 140,175 180,160 S260,120 340,90 S460,40 580,20"
        stroke="#A855F7" stroke-width="3" fill="none" stroke-linecap="round" />

      <!-- Fill area under curve -->
      <path d="M40,200 C100,190 140,175 180,160 S260,120 340,90 S460,40 580,20 L580,200 Z"
        fill="url(#purpleGradient)" opacity="0.15" />

      <!-- Break-even point marker -->
      <circle cx="180" cy="160" r="6" fill="#A855F7" stroke="#0F1419" stroke-width="2" />

      <!-- Break-even label -->
      <text x="180" y="145" text-anchor="middle" fill="#D8B4FE" font-size="10" font-weight="600">
        Break-even
      </text>
      <text x="180" y="135" text-anchor="middle" fill="#D8B4FE" font-size="9">
        Month 4
      </text>

      <!-- Y-axis labels -->
      <text x="35" y="204" text-anchor="end" fill="#6B7280" font-size="9">$0</text>
      <text x="35" y="104" text-anchor="end" fill="#6B7280" font-size="9">$75K</text>
      <text x="35" y="54" text-anchor="end" fill="#6B7280" font-size="9">$150K</text>

      <!-- X-axis labels (months) -->
      <text x="85" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M1</text>
      <text x="130" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M2</text>
      <text x="175" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M3</text>
      <text x="220" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M4</text>
      <text x="310" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M6</text>
      <text x="445" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M9</text>
      <text x="580" y="218" text-anchor="middle" fill="#6B7280" font-size="9">M12</text>

      <!-- Gradient definition -->
      <defs>
        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#A855F7" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#A855F7" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>

  <!-- Accessible data table (hidden visually, available to screen readers) -->
  <table class="sr-only">
    <caption>Monthly cumulative savings vs app investment cost</caption>
    <thead>
      <tr><th>Month</th><th>Cumulative Savings</th><th>Investment</th></tr>
    </thead>
    <tbody>
      <tr><td>Month 1</td><td>$5,312</td><td>$20,000</td></tr>
      <tr><td>Month 4</td><td>$21,250</td><td>$20,000</td></tr>
      <tr><td>Month 12</td><td>$127,500</td><td>$20,000</td></tr>
    </tbody>
  </table>
</div>
```

**Animation:** The SVG path draws itself using `stroke-dashoffset` animation. The curve path starts fully hidden (`dashoffset` equal to total path length) and transitions to `0` over 1.5 seconds with an ease-out curve when the section scrolls into view.

```ts
// Framer Motion path animation
<motion.path
  d="..."
  stroke="#A855F7"
  strokeWidth="3"
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

### 6.5 Cost vs Return Comparison

A horizontal bar comparison that makes the investment look small against the return.

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 mb-8">
  <h2 class="text-lg font-semibold text-white mb-6">Investment vs Return</h2>

  <div class="space-y-6">
    <!-- App Development Cost -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-muted">Cost of App Development</span>
        <span class="text-sm font-semibold text-off-white">$15,000 - $25,000</span>
      </div>
      <div class="h-4 w-full bg-slate-blue-light rounded-full overflow-hidden">
        <div class="h-full bg-muted-light rounded-full" style="width: 16%;"></div>
      </div>
    </div>

    <!-- Year 1 Return -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-muted">Year 1 Return</span>
        <span class="text-sm font-semibold text-purple-300">$127,500</span>
      </div>
      <div class="h-4 w-full bg-slate-blue-light rounded-full overflow-hidden">
        <motion.div
          class="h-full bg-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '83%' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>

    <!-- 3-Year Return -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-muted">3-Year Return</span>
        <span class="text-sm font-semibold text-purple-300">$382,500</span>
      </div>
      <div class="h-4 w-full bg-slate-blue-light rounded-full overflow-hidden">
        <motion.div
          class="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  </div>

  <!-- ROI multiplier callout -->
  <div class="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
    <p class="text-lg font-bold text-white">
      Every $1 invested returns
      <span class="text-purple-300">$6.38</span>
      in the first year
    </p>
  </div>
</div>
```

### 6.6 AI Key Insight

```html
<div class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8 mb-8">
  <div class="flex items-center gap-3 mb-4">
    <div class="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
      <Lightbulb class="h-5 w-5 text-purple-400" />
    </div>
    <h2 class="text-lg font-semibold text-white">AI Insight</h2>
  </div>
  <div class="prose prose-invert prose-sm max-w-none">
    <p class="text-off-white leading-relaxed">
      <!-- AI-generated content renders here -->
      Based on your inputs, an app could pay for itself in just 4 months and generate
      $127,500 in annual savings. The biggest opportunity lies in automating your order
      processing workflow, which currently consumes 100 hours per week across 5 employees.
      By eliminating manual data entry errors (which you identified as a pain point),
      you could save an additional $18,000 per year in rework costs alone.
      We recommend starting with a focused MVP that automates the core order flow,
      then expanding to customer-facing features in Phase 2.
    </p>
  </div>
</div>
```

---

## 7. Cross-Sell / CTA Section

### 7.1 Primary CTA Bar

The strongest CTA drives to Get AI Estimate -- the natural next step after proving ROI.

```html
<div class="bg-gradient-to-br from-tool-purple-dark to-slate-blue border border-purple-500/20
  rounded-xl p-6 md:p-8 mb-8">
  <div class="text-center">
    <h2 class="text-h3 text-white">The Numbers Speak for Themselves</h2>
    <p class="text-muted mt-2 max-w-[480px] mx-auto">
      Now that you know the ROI, take the next step and get your custom project estimate.
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
      <!-- Primary: Get Custom Estimate (green accent -- links to green tool) -->
      <a href="/get-estimate"
        class="h-12 px-8 bg-green-500 text-white font-semibold rounded-lg shadow-md
        hover:bg-green-600 hover:shadow-lg hover:scale-[1.02]
        active:scale-[0.98]
        transition-all duration-200
        inline-flex items-center gap-2">
        <Calculator class="h-5 w-5" />
        Get a Custom Estimate
      </a>
      <!-- Secondary: Book a Call -->
      <a href="/contact#book-call"
        class="h-12 px-6 bg-transparent text-off-white border border-slate-blue-light
        font-semibold rounded-lg
        hover:bg-slate-blue-light/40 hover:border-gray-600
        transition-all duration-200
        inline-flex items-center gap-2">
        <Calendar class="h-5 w-5" />
        Book a Call
      </a>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-4 mt-4">
      <!-- Download PDF -->
      <button class="inline-flex items-center gap-2 text-purple-400 font-medium text-sm
        hover:text-purple-300 transition-colors">
        <Download class="h-4 w-4" />
        Download ROI Report (PDF)
      </button>
      <!-- WhatsApp -->
      <a href="https://wa.me/962XXXXXXXXX?text=Hi!%20I%20just%20calculated%20my%20ROI..."
        class="inline-flex items-center gap-2 text-green-400 font-medium text-sm
        hover:text-green-300 transition-colors">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <!-- WhatsApp icon -->
        </svg>
        Share on WhatsApp
      </a>
    </div>
  </div>
</div>
```

**Design note:** The primary CTA uses green (`bg-green-500`) intentionally, not purple. This creates a visual bridge to the Get AI Estimate tool and signals a new action (green = go). It also breaks the purple monotony, drawing the eye.

### 7.2 Cross-Sell Other AI Tools

```html
<div class="mb-12">
  <h3 class="text-lg font-semibold text-white text-center mb-6">Explore More Tools</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
    <!-- Get AI Estimate -->
    <a href="/get-estimate"
      class="bg-gradient-to-br from-tool-green-dark to-slate-blue border border-green-500/20
      rounded-xl p-5 hover:shadow-glow-green hover:-translate-y-1 group transition-all duration-300">
      <div class="h-10 w-10 rounded-lg bg-green-500/15 flex items-center justify-center mb-3">
        <Calculator class="h-5 w-5 text-green-400" />
      </div>
      <h4 class="text-base font-semibold text-white">Get AI Estimate</h4>
      <p class="text-sm text-green-300/80 mt-1">Get your project cost and timeline.</p>
      <span class="inline-flex items-center gap-1.5 mt-3 text-sm text-green-400 font-medium
        group-hover:gap-2.5 transition-all">
        Get Estimate <ArrowRight class="h-4 w-4" />
      </span>
    </a>

    <!-- Idea Lab -->
    <a href="/idea-lab"
      class="bg-gradient-to-br from-tool-orange-dark to-slate-blue border border-orange-500/20
      rounded-xl p-5 hover:shadow-glow-orange hover:-translate-y-1 group transition-all duration-300">
      <div class="h-10 w-10 rounded-lg bg-orange-500/15 flex items-center justify-center mb-3">
        <Lightbulb class="h-5 w-5 text-orange-400" />
      </div>
      <h4 class="text-base font-semibold text-white">Idea Lab</h4>
      <p class="text-sm text-orange-300/80 mt-1">Need inspiration for what to build?</p>
      <span class="inline-flex items-center gap-1.5 mt-3 text-sm text-orange-400 font-medium
        group-hover:gap-2.5 transition-all">
        Try Idea Lab <ArrowRight class="h-4 w-4" />
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
| Hero | Single column, smaller heading, pills wrap to 2 rows | Same as desktop | Centered, full heading |
| Stepper | Circles only (smaller `h-8 w-8`), "Step X of 5" text | Full stepper | Full stepper with labels |
| Form card | `p-4`, full-width | `p-6` | `p-8`, max-w-[720px] |
| Step 1 cards | Single column stack | 2-column grid | 2-column grid |
| Step 2 slider | Full width, number input above slider | Full width, inline | Full width, inline |
| Step 3 issues | Single column | Single column | Single column |
| Step 4 radio pills | Stack vertically | 3 inline | 3 inline |
| Navigation buttons | Full width, stacked | Inline, `justify-between` | Inline, `justify-between` |
| Results hero metric | `text-4xl` | `text-5xl` | `text-6xl` |
| Breakdown cards | 2x2 grid | 2x2 grid | 4-column row |
| Timeline chart | 200px height, simplified labels | 260px height | 300px height |
| Bar comparison | Full width | Full width | Full width |
| CTA buttons | Full width, stacked | Inline | Inline |
| Cross-sell cards | Single column | 2-column | 2-column |

### 8.2 Mobile-Specific Adjustments

- **Stepper with 5 steps on mobile:** Since 5 circles are tight, reduce to `h-7 w-7` circles with `mx-0.5` connectors. Hide step numbers inside circles; use dots instead. The active step gets a filled purple dot; others get hollow dots.
- **Step 2 slider:** On mobile, place the numeric input above the slider (stacked) instead of inline. Enlarge the slider thumb to 24px for better touch targets.
- **Step 3 currency selector:** Stack above the amount input on mobile.
- **Results chart:** Simplify to show only M1, M4, M8, M12 labels. Reduce chart height to 200px.
- **Results breakdown cards:** Use 2x2 grid on mobile. Reduce padding to `p-3`. Font size for numbers drops to `text-lg`.
- **Social proof strip:** Text wraps normally. Reduce padding.

### 8.3 Touch Target Compliance

All interactive elements maintain minimum 44px touch targets:
- Selectable cards: Minimum 56px height (padding ensures this)
- Radio pills: Minimum 48px height
- Slider thumb: 20px (24px on mobile via `-webkit-slider-thumb` scaling)
- Stepper circles: 40px on desktop, 28px on mobile (compensated by generous tap padding)
- Checkboxes: 20px checkbox inside 48px label area

---

## 9. Component Mapping

| UI Element | Component Name | Design System Reference |
|------------|----------------|------------------------|
| Page container | `<main>` with standard container | Section 4.4 |
| Breadcrumb | `<Breadcrumb />` | Section 7.4 |
| Hero icon | Custom composition | Lucide `TrendingUp` + custom circle |
| Headline | `<h1>` with `text-h2` class | Section 2.3 |
| Value pills | `<Badge variant="tool-purple" />` | Section 7.5 |
| Stepper | `<Stepper steps={5} current={step} accentColor="purple" />` | Section 7.9 |
| Form card | `<Card variant="default" />` with `rounded-xl` | Section 7.2 |
| Selectable cards | `<SelectableCard accentColor="purple" />` | Custom |
| Range slider | `<RangeSlider accentColor="purple" />` | Section 7.3 (Slider) |
| Number stepper | `<NumberInput withStepper />` | Custom |
| Currency input | `<CurrencyInput currencies={['USD','JOD','AED','SAR']} />` | Custom |
| Checkboxes | `<Checkbox accentColor="purple" />` | Section 7.3 |
| Radio pills | `<RadioPill />` | Custom |
| Submit button | `<Button variant="tool-purple" size="lg" />` | Section 7.1 |
| Loading animation | `<AIProcessingState tool="roi" />` | Custom |
| Hero metric | `<AnimatedCounter />` | Section 9.5 |
| Breakdown cards | `<MetricCard />` | Custom |
| SVG chart | `<ROITimelineChart />` | Custom |
| Bar comparison | `<ComparisonBars />` | Custom |
| CTA section | `<CTASection />` | Custom composition |
| Cross-sell cards | `<ToolCard />` | Section 7.2 (AI Tool Card) |
| Social proof strip | `<SocialProofStrip />` | Custom |
| Toast | `<Toast />` | Section 7.10 |

---

## 10. Accessibility

### 10.1 Keyboard Navigation Flow

**Step 1 (Current Process):**
1. Tab to first selectable card
2. Arrow keys to navigate within `radiogroup`
3. Space/Enter to select
4. Tab to "Next" button
5. Enter to proceed

**Step 2 (Time & Team):**
1. Tab to hours slider
2. Arrow keys to adjust slider value (Left/Right for coarse, Up/Down for fine)
3. Tab to hours number input (direct entry)
4. Tab to employees decrement button
5. Tab to employees number input
6. Tab to employees increment button
7. Tab to navigation buttons

**Step 3 (Costs & Issues):**
1. Tab to currency selector dropdown
2. Tab to hourly cost input
3. Tab to first issue checkbox
4. Tab through remaining checkboxes
5. Tab to navigation buttons

**Step 4 (Revenue Impact):**
1. Tab to first radio pill ("Yes")
2. Arrow keys between radio options
3. If "Yes" selected, Tab to percentage input
4. Tab to next sub-question radio group
5. Tab to monthly revenue input (if visible)
6. Tab to navigation buttons

**Step 5 (Contact Info):**
Standard form tabbing: Email > Name > Company > WhatsApp checkbox > Submit.

### 10.2 ARIA Labels and Roles

```html
<!-- Page landmark -->
<main aria-label="AI ROI Calculator">

<!-- Stepper -->
<nav aria-label="ROI calculator progress" role="navigation">
  <ol role="list">
    <li aria-current="step">
      <span class="sr-only">Step 3 of 5: Costs and Issues (current step)</span>
    </li>
  </ol>
</nav>

<!-- Step 1: Radio group -->
<fieldset>
  <legend class="text-h4 text-white mb-2">
    What manual process would the app replace or improve?
  </legend>
  <div role="radiogroup" aria-label="Manual process type">
    <button role="radio" aria-checked="true"
      aria-label="Customer Orders and Bookings: Order processing, scheduling, reservations">
    </button>
  </div>
</fieldset>

<!-- Step 2: Slider -->
<fieldset>
  <legend class="text-h4 text-white mb-2">
    How much time and people are involved in this process?
  </legend>
  <input type="range"
    role="slider"
    aria-label="Hours per week spent on this process"
    aria-valuemin="1"
    aria-valuemax="200"
    aria-valuenow="20"
    aria-valuetext="20 hours per week" />
  <input type="number"
    aria-label="Number of employees involved"
    aria-describedby="employees-desc" />
  <span id="employees-desc" class="sr-only">
    Enter the number of employees currently involved in this manual process
  </span>
</fieldset>

<!-- Step 3: Multi-select -->
<fieldset>
  <legend class="text-h4 text-white mb-2">
    What are the costs and pain points of this process?
  </legend>
  <div role="group" aria-label="Current issues experienced">
    <label>
      <input type="checkbox" aria-describedby="errors-impact" />
      Errors requiring rework
      <span id="errors-impact" class="sr-only">Impact level: High cost</span>
    </label>
  </div>
</fieldset>

<!-- Step 4: Conditional radio groups -->
<fieldset>
  <legend class="text-h4 text-white mb-2">
    Could an app help you grow revenue?
  </legend>
  <div role="radiogroup" aria-label="Could an app help you serve more customers">
    <input type="radio" name="more-customers" value="yes"
      aria-label="Yes, an app could help serve more customers" />
  </div>
</fieldset>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-label="Calculating your ROI">
  <span class="sr-only">Calculating your potential return on investment. Please wait.</span>
  <p aria-live="polite">Analyzing your operational costs...</p>
</div>

<!-- Results -->
<section aria-label="Your ROI analysis results">
  <h1>Your ROI Analysis Is Ready</h1>
  <div aria-label="Total estimated annual ROI: $127,500" role="figure">
    <p class="text-5xl">$127,500</p>
  </div>
</section>

<!-- Chart has sr-only data table -->
<figure aria-label="ROI timeline chart">
  <svg role="img" aria-label="Chart showing cumulative savings overtaking app investment at month 4">
    ...
  </svg>
  <table class="sr-only">
    <caption>Monthly cumulative savings breakdown</caption>
    ...
  </table>
</figure>
```

### 10.3 Screen Reader Experience

1. On page load: "AI ROI Calculator page. Breadcrumb: Home, AI ROI Calculator."
2. Step transitions announce: "Step 3 of 5: Costs and Issues."
3. Live preview cards use `aria-live="polite"` so value changes are announced: "That is approximately 100 hours per week or 5,200 hours per year of manual work."
4. Slider value changes are announced via `aria-valuetext`.
5. During loading: announces each rotating message.
6. Results hero metric: "Your estimated annual ROI: $127,500."
7. Chart is backed by a hidden data table for screen reader users.

### 10.4 Focus Management

Same pattern as Get Estimate:
- Step transitions move focus to the new step's legend/heading.
- Loading state receives focus.
- Results heading receives focus when results appear.
- All focus moves use smooth scrolling.

### 10.5 Color Contrast Verification

| Foreground | Background | Ratio | Pass |
|-----------|-----------|-------|------|
| Purple `#A855F7` on Navy `#0F1419` | -- | 5.5:1 | AA (normal text) |
| Purple-300 `#D8B4FE` on Navy `#0F1419` | -- | 11.0:1 | AAA |
| Purple-400 `#C084FC` on Navy `#0F1419` | -- | 7.5:1 | AAA |
| White on Purple-500 `#A855F7` | -- | 4.6:1 | AA (16px bold = large text OK) |
| Purple-300 `#D8B4FE` on Slate-Blue `#1A2332` | -- | 7.6:1 | AAA |
| Muted `#9CA3AF` on Navy `#0F1419` | -- | 7.3:1 | AA |

---

## 11. RTL Considerations

### 11.1 Layout Mirroring

When the site language is Arabic (`dir="rtl"`):

- **Stepper:** Flows right-to-left. Step 1 is on the right, Step 5 on the left.
- **Step transition direction:** Reversed. Forward steps slide in from the left.
- **Selectable cards grid:** Reading order starts from right column.
- **Range slider:** The slider fills from right-to-left. Min value is on the right, max on the left. The `background` gradient direction reverses.
- **Number stepper:** Minus button on the right, plus on the left.
- **Currency selector:** Appears on the right side of the currency input.
- **Chart:** X-axis reverses. Month 1 starts on the right, Month 12 on the left.
- **Comparison bars:** Fill from right side. Labels remain right-aligned (natural for Arabic).
- **Checkboxes:** Move to the right side of the label text.
- **Arrow icons:** Flip horizontally.

### 11.2 Implementation

```html
<html lang="ar" dir="rtl">

<!-- Slider direction -->
<input type="range" class="rtl:direction-rtl" />

<!-- Number stepper -->
<div class="flex items-center gap-3 rtl:flex-row-reverse">
  <button>-</button>
  <input type="number" />
  <button>+</button>
</div>

<!-- Arrow icons -->
<ArrowRight class="h-5 w-5 rtl:rotate-180" />
```

### 11.3 Exact Arabic Copy (Key Elements)

| English | Arabic |
|---------|--------|
| How Much Could an App Save Your Business? | كم يمكن لتطبيق أن يوفر لعملك؟ |
| What manual process would the app replace? | ما العملية اليدوية التي سيحل محلها التطبيق؟ |
| How many hours per week? | كم ساعة في الأسبوع؟ |
| How many employees are involved? | كم عدد الموظفين المشاركين؟ |
| Average hourly cost per employee | متوسط التكلفة بالساعة لكل موظف |
| Calculate My ROI | احسب عائد الاستثمار |
| Your ROI Analysis Is Ready | تحليل عائد الاستثمار جاهز |
| Your Estimated Annual ROI | عائد الاستثمار السنوي المقدر |
| Get a Custom Estimate | احصل على تقدير مخصص |
| Download ROI Report | تحميل تقرير عائد الاستثمار |

---

## 12. Error States

### 12.1 Validation Errors

**Slider minimum value:**
If hours = 0 or employees = 0, show an inline warning:

```html
<p class="text-sm text-error mt-1 flex items-center gap-1.5" role="alert">
  <AlertCircle class="h-4 w-4 flex-shrink-0" />
  Please enter a value of at least 1.
</p>
```

**Hourly cost validation:**
If hourly cost is 0 or negative:

```html
<p class="text-sm text-error mt-1 flex items-center gap-1.5" role="alert">
  <AlertCircle class="h-4 w-4 flex-shrink-0" />
  Please enter a valid hourly cost.
</p>
```

**Email validation (Step 5):**
Standard email validation pattern. Error shows below the email field.

**Step skip attempt:**
If the user tries to proceed without required selections, the "Next" button shakes (same shake animation as Get Estimate) and a toast appears:

```
"Please select a process type to continue."
```

### 12.2 API Error (ROI Calculation Failed)

```html
<div class="text-center py-12">
  <div class="mx-auto mb-4 h-14 w-14 rounded-full bg-error-dark flex items-center justify-center">
    <AlertTriangle class="h-8 w-8 text-error" />
  </div>
  <h2 class="text-xl font-semibold text-white">Calculation Failed</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    Our AI had trouble processing your data. This is usually temporary.
  </p>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
    <button class="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg
      hover:bg-purple-600 transition-all duration-200
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

```html
<div class="text-center py-8 px-6">
  <Clock class="h-12 w-12 text-warning mx-auto mb-4" />
  <h2 class="text-xl font-semibold text-white">Please Wait a Moment</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    You have run several calculations recently. Please wait a few minutes
    before trying again, or contact us directly.
  </p>
  <a href="/contact"
    class="inline-flex items-center gap-2 mt-4 text-bronze font-semibold
    hover:text-bronze-light transition-colors">
    Contact Us <ArrowRight class="h-4 w-4" />
  </a>
</div>
```

### 12.4 Network Disconnection

```html
<div class="bg-warning-dark/50 border border-warning/30 rounded-lg p-4 flex items-start gap-3 mb-4"
  role="alert">
  <WifiOff class="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-sm font-medium text-warning">You appear to be offline</p>
    <p class="text-sm text-muted mt-0.5">
      Your form progress is saved locally. The calculation will run when you reconnect.
    </p>
  </div>
</div>
```

### 12.5 Unrealistic Input Detection

If the user enters values that produce an implausible ROI (e.g., $500/hour for 200 employees), the results page shows a disclaimer:

```html
<div class="bg-info-dark/50 border border-info/30 rounded-lg p-4 flex items-start gap-3 mb-6"
  role="note">
  <Info class="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-sm font-medium text-info">About This Estimate</p>
    <p class="text-sm text-muted mt-0.5">
      This ROI calculation is based on the inputs you provided and industry benchmarks.
      Actual results may vary. We recommend discussing these numbers with our team for
      a more precise analysis.
    </p>
  </div>
</div>
```

### 12.6 Empty State (Direct URL Access)

If a user arrives at `/roi-calculator/results` without form submission:

```html
<div class="text-center py-16">
  <div class="mx-auto mb-6 h-16 w-16 rounded-full bg-slate-blue-light flex items-center justify-center">
    <BarChart3 class="h-8 w-8 text-muted" />
  </div>
  <h2 class="text-xl font-semibold text-white">No ROI Report Found</h2>
  <p class="text-muted mt-2 max-w-[400px] mx-auto">
    It looks like you have not calculated your ROI yet. Start by answering a few questions
    about your current operations.
  </p>
  <a href="/roi-calculator"
    class="inline-flex items-center gap-2 mt-6 h-11 px-6 bg-purple-500 text-white font-semibold
    rounded-lg hover:bg-purple-600 transition-all duration-200">
    Start Your ROI Calculation
    <ArrowRight class="h-5 w-5" />
  </a>
</div>
```

---

## 13. SEO

### 13.1 URL Structure

```
/roi-calculator          (English)
/ar/roi-calculator       (Arabic)
```

Results are client-side rendered (user-specific data). The base page is SSR.

### 13.2 Meta Tags

```html
<head>
  <title>AI ROI Calculator - Calculate Your App Investment Return | Aviniti</title>
  <meta name="description" content="Calculate the potential return on investment of building a custom app for your business. Free AI-powered ROI analysis with detailed savings breakdown, payback period, and revenue projections in 2 minutes." />
  <meta name="robots" content="index, follow" />

  <!-- Open Graph -->
  <meta property="og:title" content="AI ROI Calculator - How Much Could an App Save You? | Aviniti" />
  <meta property="og:description" content="Free AI tool that calculates your potential ROI from building a custom app. See annual savings, payback period, and revenue impact in 2 minutes." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://aviniti.com/roi-calculator" />
  <meta property="og:image" content="https://aviniti.com/og/roi-calculator.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI ROI Calculator | Aviniti" />
  <meta name="twitter:description" content="See how much a custom app could save your business. Free ROI analysis." />
  <meta name="twitter:image" content="https://aviniti.com/og/roi-calculator.png" />

  <!-- Canonical -->
  <link rel="canonical" href="https://aviniti.com/roi-calculator" />

  <!-- Alternate languages -->
  <link rel="alternate" hreflang="en" href="https://aviniti.com/roi-calculator" />
  <link rel="alternate" hreflang="ar" href="https://aviniti.com/ar/roi-calculator" />
  <link rel="alternate" hreflang="x-default" href="https://aviniti.com/roi-calculator" />
</head>
```

### 13.3 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Aviniti AI ROI Calculator",
  "description": "AI-powered tool that calculates the potential return on investment of building a custom application for your business, including labor savings, error reduction, and revenue impact.",
  "url": "https://aviniti.com/roi-calculator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free AI-powered ROI analysis"
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

Additionally, add FAQ structured data for organic search:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How is the ROI calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes your current operational costs (labor hours, employee count, hourly rates), identified pain points (errors, missed opportunities), and potential revenue impact to calculate annual savings, payback period, and total ROI percentage."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate is the ROI estimate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The estimate is based on your inputs and industry benchmarks. It provides a directional estimate of potential savings. For a precise analysis tailored to your specific situation, we recommend booking a consultation with our team."
      }
    }
  ]
}
```

### 13.4 Internal Linking

The page links to:
- Homepage (`/`)
- Get AI Estimate (`/get-estimate`) -- primary cross-sell
- Idea Lab (`/idea-lab`) -- secondary cross-sell
- Contact page (`/contact`) -- for booking calls
- Privacy Policy (`/privacy`)

Incoming links from:
- Homepage AI Tools Spotlight (purple card)
- Homepage footer AI Tools section
- Get AI Estimate results cross-sell
- AI Idea Analyzer results cross-sell
- Navigation footer links
- Avi chatbot recommendations

---

## Appendix A: Data Flow

```
User Input (Steps 1-5)
    |
    v
Client-Side Validation
    |
    +---> Client-Side Pre-calculation (live preview in Steps 2-3)
    |     - hours_per_week * employees = total_weekly_hours
    |     - total_weekly_hours * 52 = annual_hours
    |     - annual_hours * hourly_cost = annual_labor_cost
    |
    v
API Route (/api/roi-calculate)
    |
    +---> Firebase: Store lead data
    |
    +---> Google Gemini API: Generate ROI analysis
    |         |
    |         v
    |     Structured JSON response:
    |     {
    |       totalAnnualROI: number,
    |       paybackMonths: number,
    |       roiPercentage: number,
    |       breakdown: {
    |         laborSavings: number,
    |         errorReductionSavings: number,
    |         revenueIncrease: number,
    |         timeRecovered: { hours: number, description: string },
    |       },
    |       appCostRange: { min: number, max: number },
    |       yearOneReturn: number,
    |       threeYearReturn: number,
    |       timelineData: [{ month: number, cumulativeSavings: number }],
    |       insight: string,
    |     }
    |
    v
Results Page (client-side render)
    |
    +---> Optional: Send email with ROI report PDF
    +---> Optional: Send WhatsApp message
    +---> Analytics: Track completion event
```

## Appendix B: Gemini Prompt Template

```
You are a business ROI analyst for Aviniti, an AI and app development company.

Given the following business data:
- Process being automated: {processType}
- Custom process description: {customDescription} (if "other")
- Weekly hours on this process: {hoursPerWeek}
- Number of employees involved: {employees}
- Average hourly employee cost: {hourlyCost} {currency}
- Current issues: {issues[]}
- Can app increase customers: {moreCustomers} (yes/no/unsure, percentage if yes)
- Can app increase retention: {moreRetention} (yes/no/unsure, percentage if yes)
- Approximate monthly revenue: {monthlyRevenue} (if provided)

Calculate a detailed ROI analysis:

1. Annual labor savings:
   - Assume the app automates 60-80% of the manual process
   - Calculate: hours_saved_per_year * hourly_cost

2. Error reduction savings:
   - Based on the issues selected, estimate 10-25% additional savings from reduced errors
   - Factor in rework time, customer churn, and compliance risks

3. Revenue increase:
   - If the user indicated "yes" to more customers or retention, calculate the revenue impact
   - Use the percentage estimates provided, or conservative estimates (10-15%) if "not sure"

4. Payback period:
   - Estimate app development cost based on the process type (range from our catalog)
   - Calculate: app_cost / (annual_total_savings / 12)

5. Generate an insight paragraph that:
   - Summarizes the ROI in plain language
   - Identifies the single biggest saving opportunity
   - Recommends a phased approach
   - Is encouraging but not unrealistic

Our Ready-Made Solutions that might be relevant:
- Delivery App: $10,000 / 35 days
- Kindergarten Management: $8,000 / 35 days
- Hypermarket System: $15,000 / 35 days
- Office Suite: $8,000 / 35 days
- Gym Management: $25,000 / 60 days
- Airbnb Clone: $15,000 / 35 days
- Hair Transplant AI: $18,000 / 35 days

Respond with valid JSON only. All monetary values in the specified currency.
Be conservative rather than optimistic -- credibility matters more than impressive numbers.
```

## Appendix C: OG Image Design

The Open Graph image (`/og/roi-calculator.png`, 1200x630px) should be:

```
Background:  Deep navy #0F1419
Left side:   Purple TrendingUp icon (large, 120px) with purple glow
Center:      "How Much Could an App Save Your Business?" in white, bold
             "Free AI ROI Calculator" in purple-300
Bottom:      Aviniti logo in bronze, "aviniti.com/roi-calculator" in muted
Right side:  Stylized dashboard preview showing a sample ROI number ($127,500)
             with a small chart silhouette in purple
```

This creates a compelling social sharing card that communicates the tool's value proposition at a glance.
