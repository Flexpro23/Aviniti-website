# Aviniti AI Tool: Idea Lab - Design Specification

**Version:** 1.0
**Date:** February 2026
**Tool Accent:** Orange `#F97316` (tool-orange)
**URL:** `/idea-lab`
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

Idea Lab is a **top-of-funnel lead generation tool** that helps visitors who have a problem but do not know what app could solve it. It is designed for the user who arrives thinking "I want to build something, but I do not know what." The tool asks three simple questions about the user's background, industry, and problem space, then uses Google Gemini AI to generate 5-6 personalized app ideas complete with names, descriptions, features, cost estimates, and timelines.

### 1.2 User Journey

```
Homepage AI Tools Spotlight (or nav link)
  |
  v
Idea Lab Landing/Intro (Hero)
  |
  v
Step 1: Background (single-select cards)
  |
  v
Step 2: Industry (single-select cards)
  |
  v
Step 3: Problem Description (free text)
  |
  v
Step 4: Email Capture (+ optional WhatsApp)
  |
  v
AI Processing / Loading State
  |
  v
Results: 5-6 AI-Generated App Ideas
  |
  v
"Explore This Idea" --> AI Idea Analyzer (pre-filled)
  or
"Get Estimate for This Idea" --> Get AI Estimate
  or
"Book a Call" --> Calendly
```

### 1.3 Conversion Goals

| Priority | Goal | Mechanism |
|----------|------|-----------|
| Primary | Email capture | Required before AI generates ideas |
| Secondary | Tool chain progression | "Explore This Idea" sends user to AI Idea Analyzer |
| Tertiary | Direct booking | "Book a Call" CTA on results page |
| Quaternary | WhatsApp contact | Optional WhatsApp delivery checkbox |

### 1.4 Key Metrics

- Form start rate (clicked "Start Discovery")
- Step completion rates (1/4, 2/4, 3/4, 4/4)
- Email capture rate (Step 4 completion)
- Results engagement (which ideas users click)
- Tool chain conversion (Idea Lab to Analyzer to Estimate)

---

## 2. Page Layout

### 2.1 Full Page Wireframe (Desktop)

```
+========================================================================+
|  [Logo]   Home   Get AI Estimate   FAQ   Blog   [Idea Lab]   [EN/AR]  |
+========================================================================+
|                                                                         |
|  Breadcrumb: Home / AI Tools / Idea Lab                                |
|                                                                         |
|  +-----------------------------------------------------------------+   |
|  |                                                                 |   |
|  |   [Orange lightbulb icon]                                       |   |
|  |                                                                 |   |
|  |   IDEA LAB                        (section label, orange)       |   |
|  |                                                                 |   |
|  |   Don't Have an App Idea?                                       |   |
|  |   Let's Discover One Together.                                  |   |
|  |                                                                 |   |
|  |   Answer 3 quick questions and our AI will generate             |   |
|  |   personalized app ideas tailored to your background,           |   |
|  |   industry, and vision.                                         |   |
|  |                                                                 |   |
|  |   [  Start Discovery  -->  ]                                    |   |
|  |                                                                 |   |
|  |   [clock icon] Takes about 2 minutes                            |   |
|  |   [lock icon]  Your data stays private                          |   |
|  |   [sparkle icon] Powered by AI                                  |   |
|  |                                                                 |   |
|  +-----------------------------------------------------------------+   |
|                                                                         |
+=========================================================================+
|                                                                         |
|  HOW IT WORKS                                                           |
|                                                                         |
|  +-------------------+  +-------------------+  +-------------------+   |
|  |  [1]              |  |  [2]              |  |  [3]              |   |
|  |  Tell Us About    |  |  Pick Your        |  |  Describe the     |   |
|  |  Yourself         |  |  Industry         |  |  Problem          |   |
|  |                   |  |                   |  |                   |   |
|  |  Your background  |  |  The area that    |  |  What challenge   |   |
|  |  helps us match   |  |  excites you      |  |  you want to      |   |
|  |  ideas to your    |  |  most             |  |  solve            |   |
|  |  strengths        |  |                   |  |                   |   |
|  +-------------------+  +-------------------+  +-------------------+   |
|                                                                         |
+=========================================================================+
|                                                                         |
|  FORM AREA (Steps 1-4, shown one at a time)                            |
|                                                                         |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|  |                                                                 |   |
|  |  [Step Indicator:  (1)-----(2)-----(3)-----(4)  ]              |   |
|  |                                                                 |   |
|  |  Step 1: Tell Us About Yourself                                 |   |
|  |                                                                 |   |
|  |  What's your background?                                        |   |
|  |                                                                 |   |
|  |  +--------------------+   +--------------------+                |   |
|  |  | [briefcase icon]   |   | [user icon]        |                |   |
|  |  | Entrepreneur /     |   | Professional /     |                |   |
|  |  | Business Owner     |   | Employee           |                |   |
|  |  +--------------------+   +--------------------+                |   |
|  |                                                                 |   |
|  |  +--------------------+   +--------------------+                |   |
|  |  | [graduation icon]  |   | [palette icon]     |                |   |
|  |  | Student /          |   | Creative /         |                |   |
|  |  | Academic           |   | Freelancer         |                |   |
|  |  +--------------------+   +--------------------+                |   |
|  |                                                                 |   |
|  |  +--------------------+                                         |   |
|  |  | [more icon]        |                                         |   |
|  |  | Other              |                                         |   |
|  |  +--------------------+                                         |   |
|  |                                                                 |   |
|  |                        [  Continue  -->  ]                      |   |
|  |                                                                 |   |
|  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +   |
|                                                                         |
+=========================================================================+
|                        [Footer]                                         |
+=========================================================================+
```

### 2.2 Page Structure Summary

The page is divided into three distinct zones:

1. **Hero Zone** -- Landing intro with headline, description, and "Start Discovery" CTA. Visible on initial load. Scrolled past once user begins the form.
2. **How It Works Zone** -- Three-step visual explainer. Builds confidence before the form. Always visible between hero and form.
3. **Form Zone** -- The interactive multi-step form. Steps appear one at a time with animated transitions. The step indicator at the top shows progress. After completion, this zone transforms into the Results display.

---

## 3. Hero / Header

### 3.1 Layout

```
+------------------------------------------------------------------+
|                                                                    |
|  max-w-[768px], centered                                           |
|                                                                    |
|  [Orange lightbulb icon -- 48px, inside 64px rounded-xl            |
|   bg-orange-500/15 container]                                      |
|                                                                    |
|  IDEA LAB                                                          |
|  (section label: text-sm font-semibold uppercase                   |
|   tracking-[0.1em] text-orange-400)                                |
|                                                                    |
|  Don't Have an App Idea?                                           |
|  Let's Discover One Together.                                      |
|  (text-h1, text-white)                                             |
|                                                                    |
|  Answer 3 quick questions and our AI will generate                 |
|  personalized app ideas tailored to your background,               |
|  industry, and vision.                                             |
|  (text-lg, text-muted, max-w-[540px])                             |
|                                                                    |
|  [  Start Discovery  -->  ]                                        |
|  (orange primary button variant)                                   |
|                                                                    |
|  [clock] Takes about 2 minutes                                     |
|  [lock] Your data stays private                                    |
|  [sparkle] Powered by AI                                           |
|  (inline row of trust signals, text-sm text-muted)                |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.2 Visual Description

**Background:** Full page background is `#0F1419` (navy). The hero section has a subtle radial gradient: `radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.05) 0%, transparent 60%)`. This produces a barely perceptible warm orange glow at the top of the page, signaling this is the "orange tool" without being garish.

**Tool Icon:** A Lucide `Lightbulb` icon, 24px (`h-6 w-6`), in `text-orange-400`. It sits centered inside a 56px container (`h-14 w-14`) with `bg-orange-500/15 rounded-xl`. This icon container has a subtle border: `border border-orange-500/20`.

**Section Label:** "IDEA LAB" -- `text-sm font-semibold uppercase tracking-[0.1em] text-orange-400`. Margin-top: 20px below the icon container.

**Headline:** "Don't Have an App Idea? Let's Discover One Together." -- Applied as a single `<h1>` element. Desktop: `text-h1` (clamp 1.875rem to 3.75rem). Color: `#FFFFFF`. The words "Discover One Together" carry an orange underline decoration: a 3px bottom border in `#F97316` with 4px offset below the baseline, applied via a `<span>` with inline-block and `border-b-[3px] border-orange-500 pb-1`. Margin-top: 16px.

**Description:** Three lines of body text. Color: `#9CA3AF`. Size: `text-lg` (18px). Line-height: 1.75. Max-width: 540px. Centered. Margin-top: 20px.

**CTA Button:** "Start Discovery" with a right-arrow icon (Lucide `ArrowRight`, h-5 w-5). This is a **tool-accent primary button**: `bg-orange-500 text-white font-semibold rounded-lg h-13 px-7 py-3 text-lg shadow-sm hover:bg-orange-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`. Focus ring: `focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy`. Margin-top: 32px.

On click, this button smoothly scrolls the page down to the Form Zone and auto-activates Step 1.

**Trust Signals:** Three inline items in a horizontal row with 24px gap between them. Each item: icon (h-4 w-4, text-muted-light) + text (text-sm text-muted). Centered. Margin-top: 24px.

- `Clock` icon + "Takes about 2 minutes"
- `Lock` icon + "Your data stays private"
- `Sparkles` icon + "Powered by AI"

### 3.3 Animation Sequence (Page Load)

| Order | Element | Animation | Delay | Duration | Easing |
|-------|---------|-----------|-------|----------|--------|
| 1 | Icon container | Fade in + scale(0.8 to 1) | 0ms | 500ms | ease-out-expo |
| 2 | Section label | Fade in + translateY(10px to 0) | 100ms | 400ms | ease-out |
| 3 | Headline | Fade in + translateY(20px to 0) | 200ms | 600ms | ease-out-expo |
| 4 | Orange underline | Width 0% to 100% (left to right) | 550ms | 400ms | ease-out |
| 5 | Description | Fade in + translateY(10px to 0) | 400ms | 500ms | ease-out |
| 6 | CTA button | Fade in + translateY(10px to 0) | 550ms | 400ms | ease-out |
| 7 | Trust signals | Fade in | 700ms | 300ms | ease-out |

**Framer Motion implementation:**

```tsx
const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};
```

### 3.4 Exact Copy

**Section label:** "IDEA LAB"

**Headline:** "Don't Have an App Idea? Let's Discover One Together."

**Description:** "Answer 3 quick questions and our AI will generate personalized app ideas tailored to your background, industry, and vision."

**CTA:** "Start Discovery"

**Trust signals:** "Takes about 2 minutes" / "Your data stays private" / "Powered by AI"

---

## 4. Interactive Form / Steps

### 4.1 Form Container

The entire form lives inside a centered container: `max-w-[720px] mx-auto`. Background: `bg-slate-blue/50 border border-slate-blue-light rounded-2xl p-6 md:p-10`. This card treatment visually separates the form from the surrounding page and gives it elevation.

An `id="idea-lab-form"` anchor allows the hero CTA to scroll to this section.

### 4.2 Step Indicator (Progress Stepper)

A horizontal stepper sits at the top of the form container, showing all 4 steps. It uses the **orange accent** variant of the design system stepper instead of the default bronze.

```
  (1)---------(2)---------(3)---------(4)
Background  Industry    Problem     Email
```

**Step circle styles:**
- Completed: `bg-orange-500 text-white` with `Check` icon (h-5 w-5)
- Current: `border-2 border-orange-500 bg-orange-500/10 text-orange-400` showing the step number
- Upcoming: `border-2 border-slate-blue-light bg-transparent text-muted` showing the step number

**Connector line:**
- Completed: `bg-orange-500`
- Upcoming: `bg-slate-blue-light`

**Step labels (below circles):**
- Current: `text-xs text-off-white font-medium`
- Other: `text-xs text-muted`

**HTML structure:**

```html
<nav aria-label="Progress" class="flex items-center w-full mb-8 md:mb-10">
  <!-- Step 1 - Completed -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center"
         aria-label="Step 1: Background, completed">
      <CheckIcon class="h-5 w-5 text-white" />
    </div>
    <span class="text-xs text-muted mt-2 hidden sm:block">Background</span>
  </div>
  <!-- Connector (completed) -->
  <div class="h-0.5 flex-1 mx-2 bg-orange-500 transition-colors duration-500" />
  <!-- Step 2 - Current -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-orange-500 bg-orange-500/10
         flex items-center justify-center text-sm font-semibold text-orange-400"
         aria-current="step" aria-label="Step 2: Industry, current">
      2
    </div>
    <span class="text-xs text-off-white font-medium mt-2 hidden sm:block">Industry</span>
  </div>
  <!-- Connector (upcoming) -->
  <div class="h-0.5 flex-1 mx-2 bg-slate-blue-light transition-colors duration-500" />
  <!-- Step 3 - Upcoming -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-slate-blue-light
         flex items-center justify-center text-sm font-semibold text-muted"
         aria-label="Step 3: Problem">
      3
    </div>
    <span class="text-xs text-muted mt-2 hidden sm:block">Problem</span>
  </div>
  <!-- Connector (upcoming) -->
  <div class="h-0.5 flex-1 mx-2 bg-slate-blue-light transition-colors duration-500" />
  <!-- Step 4 - Upcoming -->
  <div class="flex flex-col items-center">
    <div class="h-10 w-10 rounded-full border-2 border-slate-blue-light
         flex items-center justify-center text-sm font-semibold text-muted"
         aria-label="Step 4: Email">
      4
    </div>
    <span class="text-xs text-muted mt-2 hidden sm:block">Email</span>
  </div>
</nav>
```

### 4.3 Step Transition Animation

When moving between steps, the current step content exits and the next step enters. This uses Framer Motion's `AnimatePresence`.

**Exit animation:** Fade out + translateX(-30px). Duration: 200ms. Easing: ease-in.

**Enter animation:** Fade in + translateX(30px to 0). Duration: 300ms. Easing: ease-out. Delay: 50ms (after exit completes).

**Back navigation (previous step):** Animations reverse direction. Exit: translateX(+30px). Enter: translateX(-30px to 0).

```tsx
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};
```

### 4.4 Step 1: Background

**Question:** "Tell me about yourself -- what's your background?"

**Type:** Single-select card grid.

**Layout:** 2-column grid on desktop (`grid grid-cols-2 gap-4`). Last item (if odd count) spans full width or sits alone in the first column.

**Options (5 cards):**

| Option | Icon (Lucide) | Label |
|--------|---------------|-------|
| 1 | `Briefcase` | Entrepreneur / Business Owner |
| 2 | `User` | Professional / Employee |
| 3 | `GraduationCap` | Student / Academic |
| 4 | `Palette` | Creative / Freelancer |
| 5 | `MoreHorizontal` | Other |

**Selection Card Design:**

Each option is a selectable card. It functions like a radio button but with a rich visual treatment.

**Default state:**
```
bg-slate-blue border border-slate-blue-light rounded-xl p-4 md:p-5
cursor-pointer transition-all duration-200
flex items-center gap-4
```

**Hover state:**
```
bg-slate-blue-light/50 border-slate-blue-light
```

**Selected state:**
```
bg-orange-500/10 border-orange-500/50 ring-1 ring-orange-500/30
```

The icon container: `h-10 w-10 rounded-lg flex items-center justify-center`
- Default: `bg-slate-blue-light text-muted`
- Selected: `bg-orange-500/20 text-orange-400`

The label: `text-base font-medium`
- Default: `text-off-white`
- Selected: `text-white`

A small orange checkmark circle appears on the right side of the card when selected: `h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center` with a white `Check` icon (h-3 w-3). This element fades in with scale animation (0.8 to 1, 200ms).

**Micro-interaction:** When a card is clicked, a brief ripple effect (orange, opacity 0.1) expands from the click point and fades. The card's border transitions from `border-slate-blue-light` to `border-orange-500/50` over 200ms. The icon color transitions to orange over 200ms.

**Validation:** One option must be selected before continuing. The "Continue" button is disabled (opacity-50, cursor-not-allowed) until a selection is made. Once selected, the button enables with a subtle fade-in effect.

**Continue Button:**
```html
<button
  class="w-full sm:w-auto h-11 px-6 bg-orange-500 text-white font-semibold
    rounded-lg shadow-sm hover:bg-orange-600 hover:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 mt-8 flex items-center justify-center gap-2"
  disabled={!selected}>
  Continue
  <ArrowRight class="h-5 w-5" />
</button>
```

**Exact copy:**

Question: "Tell me about yourself -- what's your background?"

Helper text (below question): "This helps us match ideas to your strengths and experience."

### 4.5 Step 2: Industry

**Question:** "What industry or area interests you most?"

**Type:** Single-select card grid.

**Layout:** 3-column grid on desktop (`grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4`). 11 options.

**Options:**

| Option | Icon (Lucide) | Label |
|--------|---------------|-------|
| 1 | `Heart` | Health and Wellness |
| 2 | `DollarSign` | Finance and Banking |
| 3 | `BookOpen` | Education and Learning |
| 4 | `ShoppingCart` | E-commerce and Retail |
| 5 | `Truck` | Logistics and Delivery |
| 6 | `Film` | Entertainment and Media |
| 7 | `Plane` | Travel and Hospitality |
| 8 | `Home` | Real Estate |
| 9 | `UtensilsCrossed` | Food and Restaurant |
| 10 | `Users` | Social and Community |
| 11 | `MoreHorizontal` | Other / Multiple |

**Card design:** Same as Step 1 selection cards, but more compact due to higher count. On desktop with 3-column layout, card padding reduces to `p-3 md:p-4`. Icon container: `h-8 w-8` on mobile, `h-10 w-10` on desktop. Label: `text-sm md:text-base`.

**Validation:** Same as Step 1. One selection required.

**Navigation:** "Continue" button and a "Back" text link.

```html
<div class="flex items-center justify-between mt-8">
  <button class="text-sm font-medium text-muted hover:text-off-white
    transition-colors duration-200 flex items-center gap-1.5">
    <ArrowLeft class="h-4 w-4" />
    Back
  </button>
  <button class="h-11 px-6 bg-orange-500 text-white font-semibold rounded-lg
    shadow-sm hover:bg-orange-600 hover:shadow-md
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 flex items-center gap-2"
    disabled={!selected}>
    Continue
    <ArrowRight class="h-5 w-5" />
  </button>
</div>
```

**Exact copy:**

Question: "What industry or area interests you most?"

Helper text: "Pick the area where you see the most opportunity."

### 4.6 Step 3: Problem Description

**Question:** "What problem do you want to solve or what opportunity do you see?"

**Type:** Free-text textarea with character counter.

**Layout:** Single column, centered.

```
+------------------------------------------------------------------+
|                                                                    |
|  What problem do you want to solve or what                        |
|  opportunity do you see?                                           |
|                                                                    |
|  Be as specific as you can -- the more detail                     |
|  you give, the better your ideas will be.                          |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |  Describe the challenge you're facing or the                 | |
|  |  opportunity you've spotted...                               | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                    12 / 500 chars  |
|                                                                    |
|  NEED INSPIRATION?                                                 |
|                                                                    |
|  "I run a clinic and patients always complain about wait times"   |
|  "Students in my country can't find affordable tutoring"           |
|  "Small restaurants struggle to manage delivery orders"            |
|                                                                    |
|        [Back]                        [Continue -->]                |
|                                                                    |
+------------------------------------------------------------------+
```

**Textarea styling:**

```html
<textarea
  class="w-full min-h-[160px] md:min-h-[200px] p-4 bg-slate-blue border border-slate-blue-light
    rounded-xl text-base text-off-white placeholder:text-muted-light
    hover:border-gray-700
    focus:bg-slate-blue-light focus:border-orange-500 focus:text-white
    focus:outline-none focus:ring-1 focus:ring-orange-500
    resize-y transition-all duration-200"
  placeholder="Describe the challenge you're facing or the opportunity you've spotted..."
  minLength={10}
  maxLength={500}
/>
```

Note: Focus ring uses `ring-orange-500` instead of the default `ring-bronze` because this is within the orange-accented tool context.

**Character counter:** Positioned below the textarea, right-aligned. `text-xs text-muted`. Format: "12 / 500 chars". When under 10 characters, the counter text turns `text-orange-400` with a helper message: "Minimum 10 characters". When at 10+ characters, reverts to `text-muted`.

**Inspiration section:** Below the character counter, separated by 24px. A "Need inspiration?" label in `text-xs font-semibold uppercase tracking-[0.1em] text-muted-light`. Below it, three clickable example prompts, each on its own line.

Each example is a clickable card:

```html
<button class="w-full text-left p-3 rounded-lg bg-slate-blue-light/30 border border-transparent
  text-sm text-muted-light italic
  hover:bg-slate-blue-light/50 hover:border-slate-blue-light hover:text-muted
  transition-all duration-200">
  "I run a clinic and patients always complain about wait times"
</button>
```

Clicking an example fills the textarea with that text, triggering a brief highlight animation on the textarea (border flashes orange for 500ms then returns to normal focus state).

**Validation:**
- Minimum: 10 characters (after trimming whitespace)
- Maximum: 500 characters
- Error message below textarea: "Please describe your problem in at least 10 characters." (`text-sm text-error`)
- Shown only after user has attempted to continue with insufficient text

**Exact copy:**

Question: "What problem do you want to solve or what opportunity do you see?"

Helper text: "Be as specific as you can -- the more detail you give, the better your ideas will be."

Placeholder: "Describe the challenge you're facing or the opportunity you've spotted..."

Inspiration examples:
- "I run a clinic and patients always complain about wait times"
- "Students in my country can't find affordable tutoring"
- "Small restaurants struggle to manage delivery orders"

### 4.7 Step 4: Email Capture

**Question:** "Where should we send your personalized app ideas?"

**Type:** Email input + optional WhatsApp checkbox.

**Layout:**

```
+------------------------------------------------------------------+
|                                                                    |
|  Where should we send your personalized                           |
|  app ideas?                                                        |
|                                                                    |
|  [email icon]  [Email address input field             ]            |
|                                                                    |
|  [x] Also send via WhatsApp                                       |
|      [phone icon] [WhatsApp number input field        ]            |
|      (shown only when checkbox is checked)                         |
|                                                                    |
|  [lock icon] We'll only use this to send your results.            |
|  We never spam. Read our Privacy Policy.                           |
|                                                                    |
|                                                                    |
|        [Back]                    [Discover My Ideas -->]           |
|                                                                    |
+------------------------------------------------------------------+
```

**Email input:**

```html
<div class="space-y-1.5">
  <label class="block text-sm font-medium text-off-white" for="idea-lab-email">
    Email Address
  </label>
  <div class="relative">
    <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-light" />
    <input
      id="idea-lab-email"
      type="email"
      required
      class="w-full h-11 pl-10 pr-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg
        text-base text-off-white placeholder:text-muted-light
        hover:border-gray-700
        focus:bg-slate-blue-light focus:border-orange-500 focus:text-white
        focus:outline-none focus:ring-1 focus:ring-orange-500
        transition-all duration-200"
      placeholder="you@example.com"
    />
  </div>
</div>
```

**WhatsApp checkbox + conditional phone input:**

```html
<div class="mt-4 space-y-3">
  <label class="flex items-center gap-2.5 cursor-pointer">
    <input type="checkbox"
      class="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent
        checked:bg-orange-500 checked:border-orange-500
        focus-visible:ring-2 focus-visible:ring-orange-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-navy
        transition-colors duration-200" />
    <span class="text-sm text-off-white">Also send via WhatsApp</span>
  </label>

  <!-- Animated reveal when checkbox is checked -->
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-off-white" for="idea-lab-whatsapp">
      WhatsApp Number
    </label>
    <div class="relative">
      <Phone class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-light" />
      <input
        id="idea-lab-whatsapp"
        type="tel"
        class="w-full h-11 pl-10 pr-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg
          text-base text-off-white placeholder:text-muted-light
          hover:border-gray-700
          focus:bg-slate-blue-light focus:border-orange-500 focus:text-white
          focus:outline-none focus:ring-1 focus:ring-orange-500
          transition-all duration-200"
        placeholder="+962 7XX XXX XXX"
      />
    </div>
  </div>
</div>
```

The WhatsApp phone input appears with a slide-down + fade-in animation (height: 0 to auto, opacity: 0 to 1, 300ms ease-out) when the checkbox is checked. It collapses with the reverse animation when unchecked.

**Privacy note:** Below the form fields. `text-xs text-muted-light`. The "Privacy Policy" text is a link: `text-orange-400 hover:underline`.

**Submit button:** "Discover My Ideas" with a `Sparkles` icon (h-5 w-5). Uses the same orange primary button treatment as the hero CTA but at `md` size (`h-11`). On mobile, this button is full-width.

**Validation:**
- Email: Required. Standard email format validation. Error message: "Please enter a valid email address."
- WhatsApp (if checked): Optional format check for phone number. Error: "Please enter a valid phone number."
- On submit, check all fields. Show inline errors next to invalid fields.

**Exact copy:**

Question: "Where should we send your personalized app ideas?"

Email label: "Email Address"

WhatsApp label: "Also send via WhatsApp"

Privacy note: "We'll only use this to send your results. We never spam. Read our Privacy Policy."

Submit CTA: "Discover My Ideas"

---

## 5. AI Processing State

### 5.1 Layout

After the user submits Step 4, the form container transitions into a full loading state. The step indicator remains visible (all 4 steps completed) but the form content is replaced by a centered loading composition.

```
+------------------------------------------------------------------+
|                                                                    |
|  [Step Indicator: all 4 steps completed with checkmarks]          |
|                                                                    |
|  - - - - - - - - - - - - - - - - - - - - - - - - - - - -         |
|                                                                    |
|              [Animated orange lightbulb icon]                       |
|              (pulsing glow + rotation)                              |
|                                                                    |
|           Our AI is crafting your ideas...                          |
|                                                                    |
|        "Analyzing your industry and background"                    |
|        (rotating messages, fade in/out)                            |
|                                                                    |
|  [==============================                    ]  65%         |
|  (progress bar with orange fill)                                   |
|                                                                    |
|              This usually takes 15-30 seconds.                     |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.2 Visual Description

**Central icon animation:** The Lucide `Lightbulb` icon (h-12 w-12) in `text-orange-400` sits inside a `h-20 w-20` circle with `bg-orange-500/10 rounded-full`. The circle has a pulsing glow animation: box-shadow oscillates between `0 0 0 0 rgba(249,115,22,0)` and `0 0 30px 10px rgba(249,115,22,0.15)` with a 2-second cycle. The icon itself rotates subtly: `rotate(-5deg)` to `rotate(5deg)` oscillating with a 3-second cycle.

**Framer Motion for icon:**

```tsx
<motion.div
  animate={{
    boxShadow: [
      '0 0 0 0 rgba(249,115,22,0)',
      '0 0 30px 10px rgba(249,115,22,0.15)',
      '0 0 0 0 rgba(249,115,22,0)',
    ],
  }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center"
>
  <motion.div
    animate={{ rotate: [-5, 5, -5] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    <Lightbulb className="h-12 w-12 text-orange-400" />
  </motion.div>
</motion.div>
```

**Headline:** "Our AI is crafting your ideas..." -- `text-xl font-semibold text-white`. Margin-top: 24px.

**Rotating messages:** A series of messages that cycle every 3 seconds with a crossfade animation (fade out 300ms, fade in 300ms). Color: `text-muted`. Size: `text-base`. Margin-top: 12px.

Messages cycle through:
1. "Analyzing your industry and background..."
2. "Exploring market opportunities..."
3. "Generating creative app concepts..."
4. "Evaluating technical feasibility..."
5. "Estimating costs and timelines..."

**Progress bar:** A horizontal bar showing simulated progress. Track: `h-2 w-full max-w-[320px] bg-slate-blue-light rounded-full overflow-hidden`. Fill: `bg-orange-500 rounded-full`. The progress bar fills from 0% to ~90% over 15 seconds using a deceleration curve (fast at first, slowing down). It stays at ~90% until the API response arrives, then jumps to 100%. Margin-top: 32px.

Percentage label: `text-sm font-medium text-off-white` displayed to the right of the bar.

**Wait time note:** "This usually takes 15-30 seconds." -- `text-xs text-muted-light`. Margin-top: 16px.

### 5.3 Transition Into Results

When the API response is received:

1. Progress bar completes to 100% (300ms)
2. Entire loading state fades out + translateY(-10px) (300ms)
3. 200ms pause
4. Results section fades in + translateY(10px to 0) (500ms, ease-out-expo)
5. Results cards stagger in from below (80ms per card)

---

## 6. Results Display

### 6.1 Layout

```
+==================================================================+
|                                                                    |
|  [Checkmark in circle] IDEAS GENERATED                            |
|                                                                    |
|  Here Are Your Personalized App Ideas                              |
|                                                                    |
|  Based on your background as an [Entrepreneur] in                  |
|  [Health and Wellness], here are ideas that match                  |
|  your vision.                                                      |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  IDEA 1                                            [star]    | |
|  |                                                              | |
|  |  MedQueue Pro                                                | |
|  |  Smart patient queue management with AI wait-time            | |
|  |  prediction and automated notifications.                     | |
|  |                                                              | |
|  |  KEY FEATURES:                                               | |
|  |  * AI-powered wait time prediction                           | |
|  |  * Real-time queue status for patients                       | |
|  |  * Automated SMS/push notifications                          | |
|  |  * Analytics dashboard for clinic staff                      | |
|  |                                                              | |
|  |  +-------------------+  +-------------------+                | |
|  |  | Est. Cost         |  | Timeline          |                | |
|  |  | $12,000 - $18,000 |  | 8-12 weeks        |                | |
|  |  +-------------------+  +-------------------+                | |
|  |                                                              | |
|  |  [Explore This Idea -->]    [Get Estimate]                   | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  IDEA 2                                                      | |
|  |  ... (same card structure)                                   | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  IDEA 3                                                      | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  ... (5-6 ideas total)                                             |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |  [lightbulb] Want to explore more?                           | |
|  |                                                              | |
|  |  [Run Idea Lab Again]    [Book a Free Call]                  | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+==================================================================+
```

### 6.2 Results Header

**Success badge:** A small orange pill badge: `bg-orange-500/15 text-orange-300 text-xs font-medium uppercase tracking-[0.05em] px-3 py-1 rounded-full`. Content: Lucide `CheckCircle` icon (h-3.5 w-3.5) + "Ideas Generated". Gap: 6px.

**Headline:** "Here Are Your Personalized App Ideas" -- `text-h2` (clamp 1.5rem to 2.625rem), `text-white`, `font-bold`.

**Personalized subtitle:** Dynamically constructed from the user's Step 1 and Step 2 selections. Example: "Based on your background as an Entrepreneur in Health and Wellness, here are ideas that match your vision." -- `text-base text-muted`. Margin-top: 12px. Max-width: 600px.

### 6.3 Idea Card Design

Each AI-generated idea is a card. Cards are stacked vertically with `gap-6` between them.

**Card structure:**

```html
<article class="bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8
  hover:border-orange-500/30 transition-all duration-300 group">

  <!-- Card header -->
  <div class="flex items-start justify-between mb-4">
    <div>
      <span class="text-xs font-semibold uppercase tracking-[0.08em] text-orange-400">
        Idea 1
      </span>
      <h3 class="text-xl md:text-2xl font-bold text-white mt-1">
        MedQueue Pro
      </h3>
    </div>
    <!-- Favorite / bookmark button (optional) -->
    <button class="h-9 w-9 rounded-lg flex items-center justify-center
      text-muted hover:text-orange-400 hover:bg-orange-500/10
      transition-colors duration-200"
      aria-label="Bookmark this idea">
      <Star class="h-5 w-5" />
    </button>
  </div>

  <!-- Description -->
  <p class="text-base text-off-white leading-relaxed">
    Smart patient queue management with AI wait-time prediction
    and automated notifications.
  </p>

  <!-- Features -->
  <div class="mt-5">
    <h4 class="text-xs font-semibold uppercase tracking-[0.08em] text-muted mb-3">
      Key Features
    </h4>
    <ul class="space-y-2">
      <li class="flex items-start gap-2.5 text-sm text-muted">
        <Check class="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
        AI-powered wait time prediction
      </li>
      <!-- ... more features -->
    </ul>
  </div>

  <!-- Estimates row -->
  <div class="grid grid-cols-2 gap-4 mt-6">
    <div class="bg-slate-blue-light/40 rounded-lg p-3">
      <span class="text-xs text-muted block">Estimated Cost</span>
      <span class="text-lg font-bold text-white mt-0.5 block">$12,000 - $18,000</span>
    </div>
    <div class="bg-slate-blue-light/40 rounded-lg p-3">
      <span class="text-xs text-muted block">Timeline</span>
      <span class="text-lg font-bold text-white mt-0.5 block">8-12 weeks</span>
    </div>
  </div>

  <!-- Card actions -->
  <div class="flex flex-col sm:flex-row gap-3 mt-6">
    <a href="/idea-analyzer?idea=..."
      class="h-11 px-5 bg-orange-500 text-white font-semibold rounded-lg
        shadow-sm hover:bg-orange-600 hover:shadow-md
        transition-all duration-200 flex items-center justify-center gap-2
        flex-1 sm:flex-initial">
      Explore This Idea
      <ArrowRight class="h-4 w-4" />
    </a>
    <a href="/get-estimate?idea=..."
      class="h-11 px-5 bg-transparent text-orange-400 border border-orange-500/30
        font-semibold rounded-lg
        hover:bg-orange-500/10 hover:border-orange-500/50
        transition-all duration-200 flex items-center justify-center gap-2
        flex-1 sm:flex-initial">
      Get Estimate
    </a>
  </div>
</article>
```

**Card hover:** Border transitions to `border-orange-500/30`. No vertical lift (these are content cards, not action cards -- lifting would feel unstable with long content).

**Feature list checkmarks:** Use `Check` icon in `text-orange-400`. This creates a branded checklist feel.

**Estimate boxes:** `bg-slate-blue-light/40 rounded-lg p-3`. The cost and timeline are the most actionable data points, so they receive visual emphasis with their own contained treatment.

### 6.4 Results Animation Sequence

| Order | Element | Animation | Delay | Duration |
|-------|---------|-----------|-------|----------|
| 1 | Success badge | Fade in + scale(0.8 to 1) | 0ms | 400ms |
| 2 | Headline | Fade in + translateY(15px to 0) | 100ms | 500ms |
| 3 | Subtitle | Fade in | 250ms | 400ms |
| 4 | Idea card 1 | Fade in + translateY(20px to 0) | 400ms | 500ms |
| 5 | Idea card 2 | Fade in + translateY(20px to 0) | 480ms | 500ms |
| 6 | Idea card 3 | Fade in + translateY(20px to 0) | 560ms | 500ms |
| 7 | Idea card 4 | Fade in + translateY(20px to 0) | 640ms | 500ms |
| 8 | Idea card 5 | Fade in + translateY(20px to 0) | 720ms | 500ms |
| 9 | Idea card 6 | Fade in + translateY(20px to 0) | 800ms | 500ms |
| 10 | Bottom CTA section | Fade in | 900ms | 400ms |

---

## 7. Cross-Sell / CTA

### 7.1 Post-Results Cross-Sell Section

After the last idea card, a full-width CTA section encourages the next step in the funnel.

```
+------------------------------------------------------------------+
|  bg-gradient-to-br from-tool-orange-dark to-slate-blue            |
|  border border-orange-500/20 rounded-2xl p-8 md:p-10             |
|                                                                    |
|  [Two-column layout on desktop]                                    |
|                                                                    |
|  LEFT (60%):                                                       |
|    "Like what you see?"                                            |
|    text-h3, text-white                                             |
|                                                                    |
|    "Pick any idea above and let our AI Idea Analyzer              |
|    validate it with market research, competition analysis,         |
|    and a viability score. Or jump straight to getting              |
|    an estimate."                                                   |
|    text-base, text-muted                                           |
|                                                                    |
|  RIGHT (40%):                                                      |
|    [Analyze an Idea]  (orange primary button)                      |
|    [Get AI Estimate]  (orange outline button)                      |
|    [Book a Free Call] (text link, text-muted)                      |
|                                                                    |
+------------------------------------------------------------------+
```

**Exact copy:**

Headline: "Like what you see?"

Description: "Pick any idea above and let our AI Idea Analyzer validate it with market research, competition analysis, and a viability score. Or jump straight to getting an estimate."

CTA Primary: "Analyze an Idea" (links to `/idea-analyzer`)

CTA Secondary: "Get AI Estimate" (links to `/get-estimate`)

CTA Tertiary: "Book a Free Call" (links to Calendly)

### 7.2 "Explore This Idea" Behavior

When the user clicks "Explore This Idea" on a specific idea card, they are redirected to the AI Idea Analyzer page (`/idea-analyzer`) with the idea description pre-filled via a URL query parameter or localStorage handoff. The analyzer should display a banner: "Continuing from Idea Lab: [Idea Name]" to maintain context continuity.

### 7.3 Email Follow-Up

The results are also sent to the user's provided email address. The email contains:
- All generated ideas with the same formatting
- Direct links to "Analyze This Idea" for each
- A "Book a Call" CTA
- Aviniti branding

---

## 8. Responsive Behavior

### 8.1 Breakpoint Overview

| Breakpoint | Hero | How It Works | Form | Results |
|------------|------|-------------|------|---------|
| Mobile (< 640px) | Single column, centered. CTA full-width. Trust signals stack vertically. | 1-column stack, cards full-width. | Full-width. Selection cards: 1-col for Step 1, 2-col for Step 2. Textarea full-width. Buttons stack full-width. | Cards full-width. Estimate boxes stack (1-col). Action buttons stack. |
| Tablet (640-1023px) | Single column, centered, wider max-width. | 3-column row. | Max-width 600px centered. Step 2 cards: 3-col. | Max-width 720px. Cards maintain desktop structure. |
| Desktop (1024px+) | Centered, max-width 768px. | 3-column row. | Max-width 720px centered. | Max-width 800px. Full layout as wireframed. |

### 8.2 Mobile-Specific Adjustments

**Step Indicator:** On mobile (< 640px), step labels below the circles are hidden (`hidden sm:block`). Only the numbered circles and connectors are visible. This saves vertical space.

**Selection Cards (Step 1):** Switch to 1-column layout on mobile to ensure full readability and easy tapping. Each card has a minimum height of 56px to meet 44px touch target requirements.

**Selection Cards (Step 2):** 2-column grid on mobile (cards are more compact). Icons reduce to `h-8 w-8`. Labels reduce to `text-sm`.

**Textarea (Step 3):** Min-height reduces to 140px on mobile. Inspiration examples stack vertically with 8px gap.

**Email Form (Step 4):** Full-width inputs. Submit button full-width.

**Results Cards:** Action buttons (`Explore This Idea` and `Get Estimate`) stack vertically full-width on mobile. Estimate boxes remain 2-column (they are compact enough).

**Cross-sell CTA section:** Stacks to single column. Buttons stack full-width.

### 8.3 Touch Targets

All interactive elements maintain a minimum of 44px touch target:
- Selection cards: min-height 56px
- Buttons: h-11 (44px) or h-13 (52px) for primary CTAs
- Checkboxes: h-5 w-5 (20px) but the entire label row is the touch target
- Back link: py-2 adds vertical padding for tap area
- Inspiration example cards: min-height 44px via padding

---

## 9. Component Mapping

### 9.1 Page-Level Components

| Section | Component | Description |
|---------|-----------|-------------|
| Page wrapper | `<IdeaLabPage />` | Route component, manages form state |
| Hero | `<IdeaLabHero onStart={scrollToForm} />` | Hero with CTA |
| How It Works | `<HowItWorks steps={[...]} accentColor="orange" />` | Reusable across tools |
| Form container | `<IdeaLabForm onSubmit={handleSubmit} />` | Multi-step form logic |
| Step indicator | `<StepIndicator currentStep={step} totalSteps={4} accentColor="orange" />` | Reusable stepper |
| Loading state | `<AIProcessingLoader messages={[...]} accentColor="orange" />` | Reusable loader |
| Results | `<IdeaLabResults ideas={[...]} userContext={context} />` | Results display |
| Cross-sell | `<ToolCrossSell variant="idea-lab" />` | Cross-sell CTA |

### 9.2 Shared Design System Components Used

| Component | Design System Reference | Customization |
|-----------|------------------------|---------------|
| `<Button />` | Section 7.1 - Primary variant | `accentColor="orange"` prop overrides bronze with orange |
| `<Button variant="outline" />` | Section 7.1 - Secondary variant | Orange border/text instead of bronze |
| `<TextInput />` | Section 7.3 - Text Input | Focus ring in orange |
| `<Textarea />` | Section 7.3 - Textarea | Focus ring in orange |
| `<Checkbox />` | Section 7.3 - Checkbox | Checked state in orange |
| `<Badge />` | Section 7.5 - Status Badge | Orange variant |
| `<SectionHeader />` | Reusable heading group | Centered alignment |
| `<Toast />` | Section 7.10 | Success/error variants |
| `<Skeleton />` | Section 7.14 | For loading fallback |

### 9.3 Custom Components (Page-Specific)

| Component | Purpose |
|-----------|---------|
| `<SelectionCard />` | Radio-button-style card for Step 1 and Step 2 |
| `<InspirationPrompt />` | Clickable example text that fills textarea |
| `<IdeaCard />` | Result card with idea details, estimates, and actions |
| `<RotatingMessage />` | Crossfading text cycle for loading state |
| `<SimulatedProgress />` | Progress bar with deceleration curve |

---

## 10. Accessibility

### 10.1 Keyboard Navigation Flow

The Tab key moves through these focusable elements in order:

**Hero section:**
1. Skip to content link (visually hidden, visible on focus)
2. Navigation links
3. "Start Discovery" button

**Form section (per step):**
1. Step indicator circles (not focusable -- they are decorative progress only)
2. Selection cards (each card is a radio-like focusable element)
3. "Back" button (Steps 2-4)
4. "Continue" / "Submit" button

**Selection cards keyboard behavior:**
- Arrow keys (Up/Down or Left/Right) move selection between cards within the group
- Space or Enter selects/confirms the focused card
- The card group uses `role="radiogroup"` and each card uses `role="radio"`

**Results section:**
1. Results headline (focus lands here after loading completes, via `tabindex="-1"` and programmatic focus, announced to screen readers)
2. Each idea card's "Explore This Idea" button
3. Each idea card's "Get Estimate" button
4. Cross-sell section buttons

### 10.2 ARIA Labels and Roles

```html
<!-- Step indicator -->
<nav aria-label="Idea Lab progress">
  <ol role="list">
    <li aria-current="step">Step 2 of 4: Industry</li>
  </ol>
</nav>

<!-- Selection card group (Step 1) -->
<fieldset>
  <legend class="text-h3 text-white mb-2">
    Tell me about yourself -- what's your background?
  </legend>
  <div role="radiogroup" aria-label="Background selection">
    <div role="radio" aria-checked="false" tabindex="0"
         aria-label="Entrepreneur / Business Owner">
      ...
    </div>
    <div role="radio" aria-checked="true" tabindex="0"
         aria-label="Professional / Employee">
      ...
    </div>
  </div>
</fieldset>

<!-- Textarea (Step 3) -->
<label for="problem-description">
  What problem do you want to solve or what opportunity do you see?
</label>
<textarea
  id="problem-description"
  aria-describedby="problem-helper problem-counter"
  aria-required="true"
  aria-invalid="false"
/>
<span id="problem-helper" class="sr-only">
  Minimum 10 characters required. Be as specific as you can.
</span>
<span id="problem-counter" aria-live="polite" class="sr-only">
  12 of 500 characters used
</span>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-label="Generating your app ideas">
  <p>Our AI is crafting your ideas...</p>
  <p aria-live="assertive">Analyzing your industry and background...</p>
  <div role="progressbar" aria-valuenow="65" aria-valuemin="0"
       aria-valuemax="100" aria-label="AI processing progress">
  </div>
</div>

<!-- Results -->
<section aria-label="Your personalized app ideas">
  <h2 tabindex="-1" id="results-heading">
    Here Are Your Personalized App Ideas
  </h2>
  <article aria-label="Idea 1: MedQueue Pro">
    ...
  </article>
</section>
```

### 10.3 Screen Reader Experience

1. **Page load:** Screen reader announces page title: "Idea Lab - Generate App Ideas | Aviniti"
2. **Hero:** The heading structure is clear: H1 for the main headline, no headings in the trust signals
3. **Form start:** Focus moves to the first step's question (the fieldset legend)
4. **Step transitions:** When a step changes, focus moves to the new step's question heading. An `aria-live="polite"` region announces "Step 2 of 4: Industry"
5. **Loading state:** The `role="status"` region announces "Generating your app ideas" and the rotating messages are announced via `aria-live="assertive"` (but only the first and last to avoid verbosity)
6. **Results:** Focus moves to the results heading. Each idea card is an `<article>` with a clear `aria-label`. Features are in a proper `<ul>` list

### 10.4 Focus Management

- After clicking "Start Discovery", focus moves to the form section (first step question)
- After completing each step, focus moves to the next step's question
- After clicking "Back", focus moves to the previous step's question
- After loading completes, focus moves to the results heading
- Focus ring uses `focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy` throughout

### 10.5 Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All slide/translate animations are replaced with simple opacity fades (200ms)
- The loading icon glow and rotation are stopped
- The progress bar fills without animation
- Step transitions use instant opacity change instead of slide
- Card entrance stagger is removed; all cards appear simultaneously

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

const stepVariants = prefersReducedMotion
  ? {
      enter: { opacity: 0 },
      center: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    }
  : {
      // full animation variants
    };
```

### 10.6 Color Contrast Verification

| Element | Foreground | Background | Ratio | Pass |
|---------|-----------|-----------|-------|------|
| Section label "IDEA LAB" | `#FB923C` (orange-400) | `#0F1419` | 6.2:1 | AA Yes |
| Description text | `#9CA3AF` | `#0F1419` | 7.3:1 | AA Yes |
| Orange button text | `#FFFFFF` | `#F97316` | 3.1:1 | AA Large text (18px bold) |
| Card label "Idea 1" | `#FB923C` (orange-400) | `#1A2332` | 4.3:1 | AA Large text |
| Feature checkmark | `#FB923C` | `#1A2332` | 4.3:1 | Decorative (paired with text) |
| Estimate text | `#FFFFFF` | `#243044` (approx) | 11.7:1 | AA Yes |

---

## 11. RTL Considerations

### 11.1 Layout Mirroring

When the page is in Arabic (RTL) mode via `<html dir="rtl" lang="ar">`:

**General rules:**
- All horizontal layouts mirror: left becomes right, right becomes left
- Text aligns to the right
- Icons that indicate direction (arrows) flip horizontally
- The step indicator reads right-to-left: Step 4 on the left, Step 1 on the right
- Selection card checkmarks appear on the left side instead of right
- "Back" button (with left arrow) appears on the right; "Continue" button appears on the left

**Specific RTL changes:**

| Element | LTR | RTL |
|---------|-----|-----|
| Hero text alignment | `text-center` | `text-center` (unchanged, centered) |
| Step indicator direction | Left to right (1-2-3-4) | Right to left (4-3-2-1) |
| Selection card layout | Icon left, text right, check right | Icon right, text left, check left |
| Back/Continue buttons | Back left, Continue right | Back right, Continue left |
| Textarea | `text-left` | `text-right` |
| Email input icon | `left-3` | `right-3`, `pl-10` becomes `pr-10` |
| Feature list checkmarks | Check left, text right | Check right, text left |
| Idea card actions | LTR row | RTL row |
| Arrow icons | Points right | Points left (CSS `scaleX(-1)` or `rotate(180deg)`) |

### 11.2 Typography in Arabic

- Font: Arabic text uses system Arabic fonts from the Inter font stack fallback chain. Consider adding `Noto Sans Arabic` as an explicit fallback
- Line height: Arabic text typically needs slightly more line-height. Body text increases from 1.625 to 1.75
- Letter spacing: Reset to 0 for Arabic (Arabic does not benefit from letter-spacing adjustments)
- Uppercase transforms: Disabled for Arabic (Arabic has no uppercase/lowercase distinction). Section labels like "IDEA LAB" display the Arabic translation without `uppercase` class

### 11.3 Content Translation Notes

- Placeholder text in textarea must be translated
- Inspiration examples must be culturally relevant for Arabic-speaking markets
- "WhatsApp" label remains in English (brand name)
- Currency in estimates should adapt to user's region (JOD, AED, SAR) when locale is Arabic
- Step labels ("Background", "Industry", etc.) must be translated

---

## 12. Error States

### 12.1 Form Validation Errors

**Inline field errors:** Appear below the problematic field with `text-sm text-error mt-1.5` and a `AlertCircle` icon (h-4 w-4).

| Step | Field | Validation Rule | Error Message |
|------|-------|-----------------|---------------|
| 1 | Selection | One required | "Please select your background to continue." |
| 2 | Selection | One required | "Please select an industry to continue." |
| 3 | Textarea | Min 10 chars | "Please describe your problem in at least 10 characters." |
| 3 | Textarea | Max 500 chars | Character counter turns red; textarea stops accepting input |
| 4 | Email | Valid email format | "Please enter a valid email address." |
| 4 | Phone (if checked) | Valid phone format | "Please enter a valid phone number with country code." |

### 12.2 API Error State

If the Gemini AI API call fails, the loading state transitions to an error state.

```
+------------------------------------------------------------------+
|                                                                    |
|              [AlertTriangle icon, h-12 w-12, text-error]          |
|                                                                    |
|           Something Went Wrong                                     |
|           text-xl font-semibold text-white                         |
|                                                                    |
|           We couldn't generate your ideas right now.               |
|           This might be a temporary issue.                         |
|           text-base text-muted                                     |
|                                                                    |
|           [  Try Again  ]    [  Contact Support  ]                |
|                                                                    |
+------------------------------------------------------------------+
```

"Try Again" retries the API call with the same inputs. "Contact Support" opens the Avi chatbot with a pre-filled message about the error.

### 12.3 Rate Limiting

If a user has already generated ideas more than 3 times in 24 hours (tracked via cookie/fingerprint), show a gating message before Step 1:

```
+------------------------------------------------------------------+
|                                                                    |
|  [Clock icon, h-8 w-8, text-orange-400]                          |
|                                                                    |
|  You've used Idea Lab 3 times today                               |
|  text-lg font-semibold text-white                                  |
|                                                                    |
|  To generate more ideas, you can:                                  |
|  text-base text-muted                                              |
|                                                                    |
|  * Come back tomorrow for 3 more free sessions                    |
|  * Book a call with our team for unlimited brainstorming          |
|                                                                    |
|  [Book a Free Call]                                                |
|                                                                    |
+------------------------------------------------------------------+
```

### 12.4 Empty/Partial Results

If the AI returns fewer than 3 ideas (unusual but possible), display whatever was returned with a message:

"Our AI generated [N] ideas based on your inputs. For more detailed exploration, try being more specific about your problem or book a call with our team."

### 12.5 Network/Timeout Error

If the request times out after 60 seconds:

Message: "This is taking longer than expected. Our servers might be busy."

Actions: "Try Again" and "We'll email your results when ready" (captures email, switches to async processing if backend supports it).

### 12.6 JavaScript Disabled / Loading Failed

The page should server-side render the hero and How It Works sections. The form section displays a `<noscript>` message:

"Idea Lab requires JavaScript to generate personalized ideas. Please enable JavaScript in your browser, or contact us directly and we'll help you brainstorm ideas."

---

## 13. SEO

### 13.1 URL Structure

| Language | URL |
|----------|-----|
| English | `/idea-lab` |
| Arabic | `/ar/idea-lab` |

### 13.2 Meta Tags

```html
<title>Idea Lab - AI App Idea Generator | Aviniti</title>
<meta name="description" content="Don't have an app idea? Answer 3 quick questions and our AI will generate personalized app ideas tailored to your background, industry, and vision. Free tool by Aviniti." />
<meta name="keywords" content="app idea generator, AI app ideas, mobile app ideas, startup ideas, Aviniti" />
<link rel="canonical" href="https://aviniti.com/idea-lab" />

<!-- Open Graph -->
<meta property="og:title" content="Idea Lab - AI App Idea Generator | Aviniti" />
<meta property="og:description" content="Answer 3 quick questions and get personalized app ideas powered by AI. Free tool by Aviniti." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://aviniti.com/idea-lab" />
<meta property="og:image" content="https://aviniti.com/og/idea-lab.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="Aviniti" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Idea Lab - AI App Idea Generator | Aviniti" />
<meta name="twitter:description" content="Answer 3 quick questions and get personalized app ideas powered by AI." />
<meta name="twitter:image" content="https://aviniti.com/og/idea-lab.png" />

<!-- Alternate languages -->
<link rel="alternate" hreflang="en" href="https://aviniti.com/idea-lab" />
<link rel="alternate" hreflang="ar" href="https://aviniti.com/ar/idea-lab" />
<link rel="alternate" hreflang="x-default" href="https://aviniti.com/idea-lab" />
```

### 13.3 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Idea Lab - AI App Idea Generator",
  "description": "Answer 3 quick questions and get personalized app ideas powered by AI. Free tool by Aviniti.",
  "url": "https://aviniti.com/idea-lab",
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
  "creator": {
    "@type": "Organization",
    "name": "Aviniti"
  }
}
```

Additionally, add `BreadcrumbList` structured data:

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
      "name": "Idea Lab",
      "item": "https://aviniti.com/idea-lab"
    }
  ]
}
```

### 13.4 OG Image Specification

The Open Graph image (`/og/idea-lab.png`) should be:
- Dimensions: 1200x630px
- Background: Deep navy `#0F1419`
- Left side: Aviniti logo (small, top-left corner)
- Center: Large orange lightbulb icon
- Text: "Idea Lab" in white, 48px bold. "AI-Powered App Idea Generator" below in `#9CA3AF`, 24px
- Bottom: "aviniti.com" in `#C08460`, 16px
- Subtle orange gradient glow behind the lightbulb

### 13.5 Performance Notes for SEO

- Hero section and "How It Works" are server-side rendered for immediate indexing
- Form is client-side interactive but the static content around it provides crawlable context
- Images use `next/image` with WebP format and proper `alt` text
- Page loads within the 3-second LCP budget via code splitting (form logic lazy-loaded after hero)

---

## Appendix: State Management

### Form State Shape

```ts
interface IdeaLabState {
  currentStep: 1 | 2 | 3 | 4;
  direction: 1 | -1; // for animation direction
  formData: {
    background: string | null;    // Step 1 selection
    industry: string | null;      // Step 2 selection
    problem: string;              // Step 3 text
    email: string;                // Step 4
    whatsappEnabled: boolean;     // Step 4
    whatsappNumber: string;       // Step 4
  };
  validation: {
    [key: string]: string | null; // field name -> error message
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  results: IdeaLabResult[] | null;
  error: string | null;
}

interface IdeaLabResult {
  id: string;
  name: string;
  description: string;
  features: string[];
  estimatedCost: { min: number; max: number };
  estimatedTimeline: string;
}
```

### API Contract

**Request:**
```
POST /api/idea-lab
Content-Type: application/json

{
  "background": "entrepreneur",
  "industry": "health-wellness",
  "problem": "Patients always complain about wait times at my clinic...",
  "email": "user@example.com",
  "whatsapp": "+962791234567" // optional
}
```

**Response (200):**
```json
{
  "ideas": [
    {
      "id": "idea-1",
      "name": "MedQueue Pro",
      "description": "Smart patient queue management...",
      "features": ["AI wait prediction", "Real-time status", "SMS alerts", "Analytics"],
      "estimatedCost": { "min": 12000, "max": 18000 },
      "estimatedTimeline": "8-12 weeks"
    }
    // ... 4-5 more ideas
  ],
  "context": {
    "background": "Entrepreneur / Business Owner",
    "industry": "Health and Wellness"
  }
}
```

**Error (429 - Rate Limited):**
```json
{
  "error": "rate_limited",
  "message": "You have reached the daily limit for Idea Lab.",
  "retryAfter": 86400
}
```

**Error (500 - Server Error):**
```json
{
  "error": "generation_failed",
  "message": "Failed to generate ideas. Please try again."
}
```

---

**End of Idea Lab Design Specification**
