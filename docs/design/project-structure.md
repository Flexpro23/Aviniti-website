# Aviniti Website -- Project Structure & Scaffolding Guide

**Version:** 1.0
**Last Updated:** February 2026
**Status:** Implementation-Ready
**Stack:** Next.js 14+ App Router / TypeScript / Tailwind CSS v4 / Framer Motion 11+
**References:** `design-system.md`, `i18n-design.md`, `animation-spec.md`, `PRD-v3.md`

---

## Table of Contents

1. [Complete File/Folder Tree](#1-complete-filefolder-tree)
2. [Key TypeScript Interfaces](#2-key-typescript-interfaces)
3. [Component Hierarchy Diagrams](#3-component-hierarchy-diagrams)
4. [Dependency List](#4-dependency-list)
5. [Environment Variables](#5-environment-variables)
6. [Configuration Files](#6-configuration-files)
7. [Development Scripts](#7-development-scripts)
8. [Module Responsibility Guide](#8-module-responsibility-guide)
9. [Import Path Conventions](#9-import-path-conventions)
10. [Scaffolding Commands](#10-scaffolding-commands)

---

## 1. Complete File/Folder Tree

Every file and folder in the project, annotated with its purpose. This tree uses the Next.js 14+ App Router with the `[locale]` dynamic segment for i18n, as specified in `i18n-design.md` Section 2.1.

```
/
├── .env.example                        # Template for environment variables (committed)
├── .env.local                          # Local secrets -- NEVER committed
├── .eslintrc.json                      # ESLint config with RTL class enforcement
├── .gitignore
├── .prettierrc                         # Prettier config
├── next.config.ts                      # Next.js configuration
├── tailwind.config.ts                  # Full Tailwind config (design-system.md Section 10)
├── postcss.config.mjs                  # PostCSS with Tailwind plugin
├── tsconfig.json                       # TypeScript config with path aliases
├── package.json                        # Dependencies, scripts, metadata
├── package-lock.json
├── middleware.ts                        # i18n locale detection + redirect (root level)
│
├── messages/                            # Translation JSON files (flat key format)
│   ├── en/
│   │   ├── common.json                  # Nav, footer, buttons, generic labels
│   │   ├── home.json                    # Homepage section content
│   │   ├── estimate.json                # Get AI Estimate flow
│   │   ├── idea-lab.json                # Idea Lab flow
│   │   ├── idea-analyzer.json           # AI Idea Analyzer flow
│   │   ├── roi-calculator.json          # ROI Calculator flow
│   │   ├── solutions.json               # Solutions catalog + detail pages
│   │   ├── case-studies.json            # Case studies index + detail
│   │   ├── blog.json                    # Blog index + post pages
│   │   ├── faq.json                     # FAQ questions and answers
│   │   ├── contact.json                 # Contact page, form labels
│   │   ├── chatbot.json                 # Avi assistant greetings, quick replies
│   │   ├── errors.json                  # Validation messages, API errors, 404 content
│   │   └── meta.json                    # SEO titles, descriptions, OG content
│   └── ar/
│       ├── common.json
│       ├── home.json
│       ├── estimate.json
│       ├── idea-lab.json
│       ├── idea-analyzer.json
│       ├── roi-calculator.json
│       ├── solutions.json
│       ├── case-studies.json
│       ├── blog.json
│       ├── faq.json
│       ├── contact.json
│       ├── chatbot.json
│       ├── errors.json
│       └── meta.json
│
├── public/
│   ├── fonts/
│   │   ├── NotoSansArabic-Regular.woff2
│   │   ├── NotoSansArabic-Medium.woff2
│   │   ├── NotoSansArabic-SemiBold.woff2
│   │   └── NotoSansArabic-Bold.woff2
│   ├── images/
│   │   ├── hero/                        # Hero section visuals, device mockups
│   │   ├── solutions/                   # Solution screenshots, icons
│   │   ├── apps/                        # Live app icons (SkinVerse, Caliber OS, etc.)
│   │   ├── case-studies/                # Case study industry images
│   │   ├── blog/                        # Blog post featured images
│   │   ├── og/                          # Open Graph images per page
│   │   └── icons/                       # Miscellaneous icons, trust badges
│   ├── logo/
│   │   ├── aviniti-logo.svg             # Primary logo (infinity mark + wordmark)
│   │   ├── aviniti-mark.svg             # Infinity mark only
│   │   └── aviniti-logo-white.svg       # White variant for dark backgrounds
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/
│   ├── check-translations.ts            # CI script: compare en/ar keys for parity
│   └── generate-sitemap.ts              # Build-time sitemap generator
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx               # Root layout: fonts, metadata, providers, dir/lang
│   │   │   ├── page.tsx                 # Homepage
│   │   │   ├── template.tsx             # Page transition wrapper (AnimatePresence)
│   │   │   ├── not-found.tsx            # 404 page
│   │   │   ├── error.tsx                # Error boundary (client component)
│   │   │   ├── loading.tsx              # Loading skeleton (global fallback)
│   │   │   │
│   │   │   ├── idea-lab/
│   │   │   │   └── page.tsx             # Idea Lab: 3 questions + AI idea generation
│   │   │   │
│   │   │   ├── ai-analyzer/
│   │   │   │   └── page.tsx             # AI Idea Analyzer: validate existing idea
│   │   │   │
│   │   │   ├── get-estimate/
│   │   │   │   └── page.tsx             # Get AI Estimate: 4-step project estimator
│   │   │   │
│   │   │   ├── roi-calculator/
│   │   │   │   └── page.tsx             # AI ROI Calculator: 6-step ROI analysis
│   │   │   │
│   │   │   ├── solutions/
│   │   │   │   ├── page.tsx             # Solutions catalog (grid with filters)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Individual solution detail page
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # Blog listing with categories + search
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Individual blog post
│   │   │   │
│   │   │   ├── case-studies/
│   │   │   │   ├── page.tsx             # Case studies index with industry filter
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx         # Individual case study
│   │   │   │
│   │   │   ├── faq/
│   │   │   │   └── page.tsx             # FAQ with categorized accordions
│   │   │   │
│   │   │   ├── contact/
│   │   │   │   └── page.tsx             # Contact form + Calendly embed
│   │   │   │
│   │   │   ├── privacy-policy/
│   │   │   │   └── page.tsx             # Privacy policy (narrow content layout)
│   │   │   │
│   │   │   └── terms-of-service/
│   │   │       └── page.tsx             # Terms of service (narrow content layout)
│   │   │
│   │   └── api/
│   │       ├── ai/
│   │       │   ├── idea-lab/
│   │       │   │   └── route.ts         # POST: Generate app ideas from Gemini
│   │       │   ├── analyzer/
│   │       │   │   └── route.ts         # POST: Analyze idea viability via Gemini
│   │       │   ├── estimate/
│   │       │   │   └── route.ts         # POST: Generate project estimate via Gemini
│   │       │   └── roi-calculator/
│   │       │       └── route.ts         # POST: Calculate ROI projections via Gemini
│   │       ├── chat/
│   │       │   └── route.ts             # POST: Avi chatbot conversation endpoint
│   │       ├── contact/
│   │       │   └── route.ts             # POST: Contact form submission + Firebase
│   │       └── exit-intent/
│   │           └── route.ts             # POST: Exit intent lead capture
│   │
│   ├── components/
│   │   ├── ui/                          # Design system primitives (stateless, reusable)
│   │   │   ├── Button.tsx               # Primary, Secondary, Ghost, Link, Icon variants
│   │   │   ├── Card.tsx                 # Default, Featured, AI Tool card wrappers
│   │   │   ├── Input.tsx                # Text input with label, error, icon support
│   │   │   ├── Textarea.tsx             # Multi-line input
│   │   │   ├── Select.tsx               # Custom select with chevron
│   │   │   ├── Checkbox.tsx             # Styled checkbox with label
│   │   │   ├── RadioGroup.tsx           # Radio button group
│   │   │   ├── Slider.tsx               # Range slider (ROI Calculator hours/employees)
│   │   │   ├── Badge.tsx                # Pill badges, status indicators
│   │   │   ├── Tabs.tsx                 # Tabbed navigation with sliding underline
│   │   │   ├── Accordion.tsx            # Expandable content panels (FAQ, footer)
│   │   │   ├── Modal.tsx                # Desktop scale-in, mobile slide-up
│   │   │   ├── Toast.tsx                # Slide-in notifications (via sonner)
│   │   │   ├── Tooltip.tsx              # Hover/focus tooltip
│   │   │   ├── Skeleton.tsx             # Loading placeholder shapes
│   │   │   ├── Spinner.tsx              # Loading spinner (16px, 24px sizes)
│   │   │   ├── EmptyState.tsx           # No-results placeholder with icon + message
│   │   │   ├── Stepper.tsx              # Multi-step form progress indicator
│   │   │   ├── ProgressBar.tsx          # Horizontal progress bar (bronze fill)
│   │   │   ├── Avatar.tsx               # Circular avatar (chatbot, testimonials)
│   │   │   ├── Divider.tsx              # Section divider with fade gradient
│   │   │   ├── Container.tsx            # Centered max-w-[1320px] content wrapper
│   │   │   └── Section.tsx              # Full-width section with bg + py presets
│   │   │
│   │   ├── layout/                      # Global layout components (persist across pages)
│   │   │   ├── Navbar.tsx               # Desktop nav: logo, links, Idea Lab CTA, lang switch
│   │   │   ├── MobileDrawer.tsx         # Slide-out mobile navigation drawer
│   │   │   ├── Footer.tsx               # Multi-column footer with links, social, legal
│   │   │   ├── Breadcrumbs.tsx          # Breadcrumb trail for inner pages
│   │   │   ├── PageTransition.tsx       # Framer Motion page fade wrapper
│   │   │   ├── NavigationProgress.tsx   # Thin bronze progress bar during navigation
│   │   │   ├── LanguageSwitcher.tsx     # EN/AR toggle button with globe icon
│   │   │   └── SkipToContent.tsx        # Accessibility skip-to-main link (z-100)
│   │   │
│   │   ├── features/                    # Feature-specific component groups
│   │   │   ├── chatbot/
│   │   │   │   ├── ChatbotWidget.tsx    # Root wrapper: manages open/closed state
│   │   │   │   ├── ChatBubble.tsx       # Floating bubble with bounce entrance
│   │   │   │   ├── ChatWindow.tsx       # Expanded chat panel (380x520 desktop)
│   │   │   │   ├── ChatMessage.tsx      # Individual message bubble (user/AI)
│   │   │   │   ├── QuickReplies.tsx     # Tappable quick reply button row
│   │   │   │   └── TypingIndicator.tsx  # Three-dot pulsing animation
│   │   │   │
│   │   │   ├── exit-intent/
│   │   │   │   ├── ExitIntentProvider.tsx   # Detects exit intent, manages state
│   │   │   │   ├── ExitIntentPopup.tsx      # Modal with variation A-E content
│   │   │   │   └── ExitIntentForm.tsx       # Email capture form within popup
│   │   │   │
│   │   │   ├── whatsapp/
│   │   │   │   └── WhatsAppButton.tsx   # Floating WhatsApp button (bottom-start)
│   │   │   │
│   │   │   └── analytics/
│   │   │       ├── AnalyticsProvider.tsx # GA4, Meta Pixel, Google Ads initialization
│   │   │       └── TrackingEvents.tsx   # Event helper components
│   │   │
│   │   ├── homepage/                    # Homepage section components
│   │   │   ├── HeroSection.tsx          # Headline, CTA, device mockup, animated badge
│   │   │   ├── TrustIndicators.tsx      # Counter stats + trust badges (SSL, GDPR, NDA)
│   │   │   ├── ServicesOverview.tsx      # "What We Build" 4-card grid
│   │   │   ├── AIToolsSpotlight.tsx     # 4 AI tool cards with accent colors
│   │   │   ├── SolutionsPreview.tsx     # Featured solutions carousel/grid
│   │   │   ├── LiveAppsShowcase.tsx     # Portfolio of live apps with store links
│   │   │   ├── WhyChooseUs.tsx          # 4 differentiator cards
│   │   │   ├── CaseStudiesPreview.tsx   # 2-3 featured case study cards
│   │   │   ├── BlogPreview.tsx          # Latest blog posts (optional homepage section)
│   │   │   ├── ProcessOverview.tsx      # How we work (optional homepage section)
│   │   │   └── FinalCTA.tsx             # "Ready to Build?" with scale-in animation
│   │   │
│   │   ├── ai-tools/                    # Shared components across all 4 AI tools
│   │   │   ├── ToolHero.tsx             # Tool page hero with accent color theming
│   │   │   ├── ToolForm.tsx             # Multi-step form container
│   │   │   ├── StepTransition.tsx       # Horizontal slide between form steps
│   │   │   ├── AIThinkingState.tsx      # 3-phase loading (submitting/analyzing/generating)
│   │   │   ├── ToolResults.tsx          # Results container with staggered reveal
│   │   │   ├── CrossSellCTA.tsx         # "Next step" CTA linking to another tool
│   │   │   ├── EmailCapture.tsx         # Email + optional WhatsApp capture step
│   │   │   ├── ScoreGauge.tsx           # Circular score gauge (AI Analyzer)
│   │   │   ├── ROIChart.tsx             # Bar/donut chart for ROI results
│   │   │   └── ComparisonBars.tsx       # Cost vs Return comparison visual
│   │   │
│   │   └── shared/                      # Reusable across multiple pages
│   │       ├── SectionLabel.tsx         # Uppercase bronze label above headings
│   │       ├── SectionHeading.tsx       # Label + title + subtitle group
│   │       ├── CTABanner.tsx            # Reusable CTA section with background
│   │       ├── ShareButtons.tsx         # Social share (LinkedIn, WhatsApp, copy link)
│   │       ├── NewsletterForm.tsx       # Email newsletter subscription
│   │       └── ScrollReveal.tsx         # whileInView wrapper with variant presets
│   │
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts               # Firebase client SDK initialization
│   │   │   ├── admin.ts                # Firebase Admin SDK (server-only)
│   │   │   └── collections.ts          # Firestore collection refs + typed helpers
│   │   │
│   │   ├── gemini/
│   │   │   ├── client.ts               # Gemini API client initialization
│   │   │   ├── prompts/
│   │   │   │   ├── idea-lab.ts          # System + user prompts for Idea Lab
│   │   │   │   ├── analyzer.ts          # Prompts for AI Idea Analyzer
│   │   │   │   ├── estimate.ts          # Prompts for Get AI Estimate
│   │   │   │   ├── roi-calculator.ts    # Prompts for ROI Calculator
│   │   │   │   └── chatbot.ts           # Avi system prompt + context rules
│   │   │   └── schemas.ts              # Zod schemas for validating Gemini responses
│   │   │
│   │   ├── motion/
│   │   │   ├── variants.ts             # Framer Motion variant presets:
│   │   │   │                            #   fadeIn, fadeInUp, fadeInDown, slideInRight,
│   │   │   │                            #   scaleIn, staggerContainer, cardHover
│   │   │   ├── tokens.ts               # Duration, easing, spring configs, motionDistance
│   │   │   │                            #   (from animation-spec.md Section 2)
│   │   │   └── hooks.ts                # useScrollReveal, useStaggerChildren, useCountUp
│   │   │
│   │   ├── i18n/
│   │   │   ├── types.ts                # Locale, Namespace, LocaleConfig types
│   │   │   ├── config.ts               # SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_CONFIGS
│   │   │   ├── server.ts               # getTranslations, createTranslator (server-side)
│   │   │   ├── client.tsx              # TranslationProvider, useTranslation (client-side)
│   │   │   ├── formatters.ts           # formatNumber, formatCurrency, formatDate, formatPercent
│   │   │   └── navigation.ts           # createLocalizedHref helper
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                   # clsx + tailwind-merge utility
│   │   │   ├── formatters.ts           # General formatting (phone, slug, truncate)
│   │   │   ├── validators.ts           # Zod schemas for form validation
│   │   │   └── analytics.ts            # GA4 event tracking helpers
│   │   │
│   │   └── data/
│   │       ├── solutions.ts            # Static solution definitions (7 solutions)
│   │       ├── apps.ts                 # Live app portfolio data (9 apps)
│   │       ├── services.ts             # Service card data (4 services)
│   │       ├── faq.ts                  # FAQ categories + question/answer pairs
│   │       └── navigation.ts           # Nav link config (desktop + mobile)
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.ts            # Responsive breakpoint detection
│   │   ├── useScrollDirection.ts       # Detect scroll up/down for navbar behavior
│   │   ├── useExitIntent.ts            # Mouse/scroll-based exit intent detection
│   │   ├── useReducedMotion.ts         # prefers-reduced-motion media query hook
│   │   ├── useLocale.ts                # Get current locale from params/context
│   │   └── useLocalStorage.ts          # Persistent client state (chatbot, preferences)
│   │
│   ├── types/
│   │   ├── common.ts                   # Locale, Direction, ToolSlug, ToolAccentColor
│   │   ├── api.ts                      # API request/response types for all endpoints
│   │   ├── solutions.ts                # Solution, SolutionCategory types
│   │   ├── blog.ts                     # BlogPost, BlogCategory types
│   │   ├── case-studies.ts             # CaseStudy type
│   │   ├── chatbot.ts                  # ChatMessage, ChatSession types
│   │   └── forms.ts                    # Form data types for Estimate, IdeaLab, ROI, Contact
│   │
│   └── styles/
│       └── globals.css                 # Tailwind @layer base/components/utilities,
│                                        # custom heading classes (clamp), Arabic overrides,
│                                        # glow utilities, RTL letter-spacing reset
│
└── tests/                               # (Optional, recommended)
    ├── visual/
    │   └── rtl.spec.ts                  # Playwright RTL visual regression tests
    └── unit/
        └── translations.test.ts         # Translation key parity checks
```

---

## 2. Key TypeScript Interfaces

All shared types live in `src/types/`. Components import from these modules for consistent typing across the codebase.

### 2.1 Common Types

```typescript
// src/types/common.ts

/** Supported locale codes */
export type Locale = 'en' | 'ar';

/** Text direction derived from locale */
export type Direction = 'ltr' | 'rtl';

/** The four AI tool identifiers */
export type ToolSlug = 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';

/** Accent color names for AI tools (mapped in Tailwind config) */
export type ToolAccentColor = 'orange' | 'blue' | 'green' | 'purple';

/** Mapping from tool slug to accent color */
export const TOOL_COLORS: Record<ToolSlug, ToolAccentColor> = {
  'idea-lab': 'orange',
  'ai-analyzer': 'blue',
  'get-estimate': 'green',
  'roi-calculator': 'purple',
};

/** Next.js page props for locale-scoped routes */
export interface LocalePageProps {
  params: Promise<{ locale: Locale }>;
}

/** Next.js page props for locale + slug routes */
export interface SlugPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}
```

### 2.2 Solution Types

```typescript
// src/types/solutions.ts

export type SolutionCategory =
  | 'delivery'
  | 'education'
  | 'booking'
  | 'ecommerce'
  | 'restaurant'
  | 'operations'
  | 'social';

export interface Solution {
  /** Unique URL slug (e.g., "delivery-app-system") */
  slug: string;

  /** Display name (translation key: "solutions.<slug>.name") */
  nameKey: string;

  /** Category for filtering */
  category: SolutionCategory;

  /** Lucide icon name */
  icon: string;

  /** Starting price in USD */
  startingPrice: number;

  /** Estimated delivery in days */
  timelineDays: number;

  /** Short description translation key */
  descriptionKey: string;

  /** Feature list translation key prefix (features are indexed) */
  featuresKeyPrefix: string;

  /** Number of features to render */
  featureCount: number;

  /** Whether this solution has a live demo */
  hasDemo: boolean;

  /** Related case study slug, if any */
  relatedCaseStudy?: string;
}
```

### 2.3 Blog Types

```typescript
// src/types/blog.ts

export interface BlogPost {
  slug: string;
  titleKey: string;
  excerptKey: string;
  category: BlogCategory;
  publishedAt: string;          // ISO 8601 date
  readingTimeMinutes: number;
  featuredImage: string;         // Path in /public/images/blog/
  author: string;
  tags: string[];
}

export type BlogCategory =
  | 'ai'
  | 'mobile-development'
  | 'web-development'
  | 'case-study'
  | 'industry-insights'
  | 'tutorials';
```

### 2.4 Case Study Types

```typescript
// src/types/case-studies.ts

export interface CaseStudy {
  slug: string;
  industry: CaseStudyIndustry;
  headlineKey: string;           // Result-focused headline
  excerptKey: string;
  keyMetric: string;             // e.g., "40%" or "3x"
  keyMetricLabelKey: string;     // e.g., "Faster patient processing"
  metrics: CaseStudyMetric[];    // 3-4 metrics for hero bar
  challengeKey: string;
  solutionKey: string;
  resultsKey: string;
  takeawaysKeyPrefix: string;
  takeawaysCount: number;
  quoteKey?: string;
  technologies: string[];
  featuredImage?: string;
}

export interface CaseStudyMetric {
  value: string;                 // "40%", "3x", "$120K"
  labelKey: string;
}

export type CaseStudyIndustry =
  | 'healthcare'
  | 'ecommerce'
  | 'logistics'
  | 'education'
  | 'restaurant';
```

### 2.5 API Types

```typescript
// src/types/api.ts

// ---------- Idea Lab ----------
export interface IdeaLabRequest {
  background: string;
  industry: string;
  problem: string;
  email: string;
  whatsapp?: string;
  locale: Locale;
}

export interface IdeaLabIdea {
  name: string;
  description: string;
  features: string[];
  estimatedCost: { min: number; max: number };
  estimatedWeeks: number;
}

export interface IdeaLabResponse {
  ideas: IdeaLabIdea[];
  sessionId: string;
}

// ---------- AI Analyzer ----------
export interface AnalyzerRequest {
  ideaDescription: string;
  email: string;
  whatsapp?: string;
  locale: Locale;
}

export interface AnalyzerResponse {
  overallScore: number;          // 0-100
  marketPotential: AnalysisSection;
  technicalFeasibility: AnalysisSection;
  monetizationStrategies: AnalysisSection;
  competitionOverview: AnalysisSection;
  sessionId: string;
}

export interface AnalysisSection {
  title: string;
  summary: string;
  points: string[];
  score: number;                 // 0-100
}

// ---------- Get AI Estimate ----------
export interface EstimateRequest {
  projectType: string;
  features: string[];
  customFeatures?: string;
  timeline: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  description?: string;
  locale: Locale;
}

export interface EstimateResponse {
  costRange: { min: number; max: number };
  timelineWeeks: { min: number; max: number };
  breakdown: EstimateBreakdownItem[];
  recommendedApproach: string;
  sessionId: string;
}

export interface EstimateBreakdownItem {
  phase: string;
  description: string;
  costRange: { min: number; max: number };
  weeks: number;
}

// ---------- ROI Calculator ----------
export interface ROICalculatorRequest {
  process: string;
  hoursPerWeek: number;
  employeesInvolved: number;
  hourlyCost: number;
  currency: 'USD' | 'JOD' | 'AED' | 'SAR';
  issues: string[];
  canServeMoreCustomers: 'yes' | 'no' | 'unsure';
  customerIncreasePercent?: number;
  canIncreaseRetention: 'yes' | 'no' | 'unsure';
  retentionIncreasePercent?: number;
  email: string;
  whatsapp?: string;
  locale: Locale;
}

export interface ROICalculatorResponse {
  annualTimeSavingsHours: number;
  annualCostSavings: number;
  potentialRevenueIncrease: number;
  totalAnnualROI: number;
  paybackPeriodMonths: number;
  appCostEstimate: { min: number; max: number };
  roiPercentage: number;
  breakdown: ROIBreakdownItem[];
  keyInsight: string;
  sessionId: string;
}

export interface ROIBreakdownItem {
  category: string;
  annualSavings: number;
  description: string;
}

// ---------- Chat ----------
export interface ChatRequest {
  message: string;
  sessionId: string;
  locale: Locale;
  currentPage: string;
}

export interface ChatResponse {
  reply: string;
  quickReplies?: string[];
  suggestedLinks?: { label: string; href: string }[];
  handoff?: boolean;
}

// ---------- Contact ----------
export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  whatsapp?: string;
  locale: Locale;
}

// ---------- Exit Intent ----------
export interface ExitIntentRequest {
  email: string;
  variation: 'lead-magnet' | 'consultation' | 'quick-estimate' | 'whatsapp' | 'chatbot';
  projectType?: string;
  locale: Locale;
  source: string;
}
```

### 2.6 Form Data Types

```typescript
// src/types/forms.ts

/** Get AI Estimate multi-step form state */
export interface EstimateFormData {
  step: 1 | 2 | 3 | 4;
  projectType: string;
  features: string[];
  customFeatures: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  sendWhatsApp: boolean;
  description: string;
}

/** Idea Lab multi-step form state */
export interface IdeaLabFormData {
  step: 1 | 2 | 3 | 4 | 5;
  background: string;
  industry: string;
  problem: string;
  email: string;
  sendWhatsApp: boolean;
}

/** ROI Calculator multi-step form state */
export interface ROIFormData {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  process: string;
  customProcess: string;
  hoursPerWeek: number;
  employeesInvolved: number;
  hourlyCost: number;
  currency: 'USD' | 'JOD' | 'AED' | 'SAR';
  issues: string[];
  canServeMoreCustomers: 'yes' | 'no' | 'unsure';
  customerIncreasePercent: number;
  canIncreaseRetention: 'yes' | 'no' | 'unsure';
  retentionIncreasePercent: number;
  email: string;
  sendWhatsApp: boolean;
}

/** Chatbot session state */
export interface ChatSessionState {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  isOpen: boolean;
  hasInteracted: boolean;
}
```

### 2.7 Chatbot Types

```typescript
// src/types/chatbot.ts

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  quickReplies?: string[];
  suggestedLinks?: ChatSuggestedLink[];
}

export interface ChatSuggestedLink {
  label: string;
  href: string;
}

export type ChatbotState = 'idle' | 'open' | 'minimized' | 'typing';
```

---

## 3. Component Hierarchy Diagrams

These diagrams show the nesting structure of components for key pages. Indentation represents parent-child relationships.

### 3.1 Root Layout

```
[locale]/layout.tsx
├── <html lang={locale} dir={dir}>
│   └── <body className={fontClass}>
│       ├── AnalyticsProvider
│       ├── TranslationProvider (client)
│       ├── SkipToContent
│       ├── Navbar
│       │   ├── Logo (Link)
│       │   ├── NavLink x N
│       │   ├── IdeaLabNavCTA (highlighted)
│       │   ├── LanguageSwitcher
│       │   └── MobileMenuToggle
│       ├── NavigationProgress
│       ├── MobileDrawer (conditionally rendered)
│       │   ├── NavLink x N
│       │   └── LanguageSwitcher
│       ├── {children}                    ← page content via template.tsx
│       ├── Footer
│       │   ├── Logo + tagline
│       │   ├── QuickLinks column
│       │   ├── AITools column
│       │   ├── Contact column
│       │   ├── Social links
│       │   └── Legal links + copyright
│       ├── WhatsAppButton (fixed bottom-start)
│       ├── ChatbotWidget (fixed bottom-end)
│       │   ├── ChatBubble
│       │   └── ChatWindow (when open)
│       │       ├── ChatMessage x N
│       │       ├── TypingIndicator
│       │       ├── QuickReplies
│       │       └── ChatInput
│       ├── ExitIntentProvider
│       │   └── ExitIntentPopup (modal, when triggered)
│       │       └── ExitIntentForm
│       └── Toaster (sonner provider)
```

### 3.2 Homepage

```
[locale]/page.tsx
├── HeroSection
│   ├── SectionLabel ("AI-POWERED APP DEVELOPMENT")
│   ├── Heading (display size, animated)
│   ├── Subheading (body large, animated)
│   ├── Button (primary: "Get Instant AI Estimate")
│   ├── Button (secondary: "Ready-Made Solutions")
│   ├── Link ("Contact Us")
│   └── DeviceMockup (animated floating)
│
├── TrustIndicators
│   ├── CounterStat x 3 (useCountUp animation)
│   │   ├── Animated number
│   │   └── Stat label
│   └── TrustBadge x 3 (SSL, GDPR, NDA)
│
├── ServicesOverview
│   ├── SectionHeading ("What We Build")
│   └── ScrollReveal
│       └── CardGrid (4 columns)
│           └── ServiceCard x 4
│               ├── IconBox (bronze/10 background)
│               ├── Card title
│               ├── Card description
│               └── "Learn More" link + arrow
│
├── AIToolsSpotlight
│   ├── SectionHeading ("AI-Powered Tools to Get You Started")
│   └── ScrollReveal
│       └── CardGrid (2x2 on desktop)
│           └── AIToolCard x 4
│               ├── IconBox (tool accent bg)
│               ├── Tool name
│               ├── Tool description
│               └── Button (tool accent: "Start Discovery" / etc.)
│
├── SolutionsPreview
│   ├── SectionHeading ("Launch Faster with Ready-Made Solutions")
│   ├── SolutionCard x 3-4
│   │   ├── Solution icon
│   │   ├── Solution name
│   │   ├── "Starting from $X"
│   │   ├── Timeline badge
│   │   └── "Learn More" link
│   └── Button (secondary: "View All Solutions")
│
├── LiveAppsShowcase
│   ├── SectionHeading ("Apps We've Built - Live in Stores")
│   └── AppGrid (4x2 wave stagger)
│       └── AppCard x 8
│           ├── AppIcon (64x64 rounded-2xl)
│           ├── App name
│           ├── App description
│           └── StoreButtons (App Store + Google Play)
│
├── WhyChooseUs
│   ├── SectionHeading ("Why Companies Choose Us")
│   └── DifferentiatorCard x 4
│       ├── Icon
│       ├── Title
│       └── Description
│
├── CaseStudiesPreview
│   ├── SectionHeading ("Real Results, Real Impact")
│   ├── CaseStudyCard x 2-3
│   │   ├── Industry badge
│   │   ├── Headline
│   │   ├── Key metric (bronze, large)
│   │   ├── Excerpt
│   │   └── "Read Case Study" link
│   └── Button (secondary: "View All Case Studies")
│
└── FinalCTA
    ├── Container (scaleIn animation)
    ├── Heading ("Ready to Build Something Great?")
    ├── Subheading
    ├── Button (primary: "Get AI Estimate")
    ├── Button (secondary: "Book a Call")
    └── WhatsApp link
```

### 3.3 AI Tool Page (Generic Pattern)

All four AI tool pages follow this pattern with tool-specific accent colors and form fields.

```
[locale]/<tool-slug>/page.tsx
├── ToolHero
│   ├── SectionLabel (tool accent color)
│   ├── Heading
│   ├── Description (what the user will get)
│   └── Button (tool accent: "Start" CTA)
│
├── ToolForm
│   ├── Stepper (step circles + progress bar)
│   └── StepTransition (AnimatePresence horizontal slide)
│       ├── Step 1 content (varies by tool)
│       │   └── RadioGroup / Input / Select
│       ├── Step 2 content
│       │   └── Checkbox group / Slider / Textarea
│       ├── Step N-1 content (last question)
│       └── EmailCapture (final step)
│           ├── Input (email)
│           ├── Checkbox ("Also send via WhatsApp")
│           └── Button ("Get My Results")
│
├── AIThinkingState (shown during API call)
│   ├── Phase message (crossfading)
│   ├── ProcessingRing (SVG, tool accent stroke)
│   └── ThinkingDots x 3
│
├── ToolResults (staggered reveal)
│   ├── Result section 1 (fadeInUp, 0ms)
│   ├── Result section 2 (fadeInUp, 150ms)
│   ├── Result section 3 (fadeInUp, 300ms)
│   ├── ... (varies by tool)
│   └── CrossSellCTA ("Next: Get a Detailed Estimate")
│
└── CTABanner (below results)
    ├── "Book a Call" button
    ├── "Download PDF" button
    └── "Share on WhatsApp" button
```

### 3.4 Solution Detail Page

```
[locale]/solutions/[slug]/page.tsx
├── Breadcrumbs (Home > Solutions > {name})
├── ToolHero (solution-themed)
│   ├── Solution icon
│   ├── Solution name
│   ├── Tagline
│   ├── Price badge ("Starting from $X,XXX")
│   └── Timeline badge ("35 days")
│
├── Section: Key Features
│   └── FeatureCard x N
│       ├── Icon
│       ├── Feature title
│       └── Feature description
│
├── Section: Screenshots/Mockups
│   └── Image gallery or carousel
│
├── Section: Pricing Details
│   ├── What's included list
│   ├── Customization options
│   └── Timeline breakdown
│
├── Section: Related Case Study (optional)
│   └── CaseStudyCard
│
└── CTABanner
    ├── Button (primary: "Get This Solution")
    └── Button (secondary: "Customize & Get Estimate")
```

---

## 4. Dependency List

All packages required for the project, organized by category. Pin to compatible versions.

### 4.1 Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | `^14.2` | App Router, SSR/SSG, API routes, image optimization |
| `react` | `^18.3` | UI library |
| `react-dom` | `^18.3` | DOM rendering |

### 4.2 TypeScript

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | `^5.4` | Type checking |
| `@types/react` | `^18.3` | React type definitions |
| `@types/react-dom` | `^18.3` | React DOM type definitions |
| `@types/node` | `^20` | Node.js type definitions |

### 4.3 Styling

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^4.0` | Utility-first CSS framework |
| `postcss` | `^8.4` | CSS processing |
| `autoprefixer` | `^10.4` | Vendor prefix automation |
| `clsx` | `^2.1` | Conditional className concatenation |
| `tailwind-merge` | `^2.3` | Intelligent Tailwind class deduplication |

### 4.4 Animation

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | `^11.0` | Declarative animations, AnimatePresence, layout animations |

### 4.5 i18n (Internationalization)

| Package | Version | Purpose |
|---------|---------|---------|
| `next-intl` | `^3.0` | OR roll custom i18n (see i18n-design.md) |

> **Note:** The `i18n-design.md` specification describes a custom lightweight i18n system using `getTranslations` + `createTranslator`. If using that approach, `next-intl` is not required. If preferring a maintained library, `next-intl` provides the same path-prefix routing, server/client components, and `useTranslations` hook out of the box. Choose one approach, not both.

### 4.6 Backend / AI

| Package | Version | Purpose |
|---------|---------|---------|
| `firebase` | `^10.12` | Client SDK: Firestore, Auth (if needed) |
| `firebase-admin` | `^12.1` | Server SDK: Firestore writes, server-side auth |
| `@google/generative-ai` | `^0.14` | Gemini API SDK for AI features |

### 4.7 Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | `^3.23` | Schema validation (forms, API req/res, Gemini output) |

### 4.8 UI Primitives (Optional -- Radix)

These are optional. The design system specifies custom implementations. If preferring accessible primitives with less custom code, install Radix:

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/react-dialog` | `^1.0` | Accessible modal/dialog base |
| `@radix-ui/react-accordion` | `^1.1` | Accessible accordion base |
| `@radix-ui/react-tabs` | `^1.0` | Accessible tabs base |
| `@radix-ui/react-tooltip` | `^1.0` | Accessible tooltip base |
| `@radix-ui/react-checkbox` | `^1.0` | Accessible checkbox base |
| `@radix-ui/react-radio-group` | `^1.1` | Accessible radio group base |
| `@radix-ui/react-slider` | `^1.1` | Accessible slider base |
| `@radix-ui/react-select` | `^2.0` | Accessible select base |

### 4.9 Icons

| Package | Version | Purpose |
|---------|---------|---------|
| `lucide-react` | `^0.378` | Icon library (design-system.md Section 8) |

### 4.10 Notifications

| Package | Version | Purpose |
|---------|---------|---------|
| `sonner` | `^1.5` | Toast notification system |

### 4.11 Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | `^8.57` | Code linting |
| `eslint-config-next` | `^14.2` | Next.js ESLint rules |
| `prettier` | `^3.2` | Code formatting |
| `prettier-plugin-tailwindcss` | `^0.5` | Tailwind class sorting |
| `tsx` | `^4.10` | Run TypeScript scripts (translation checks) |

### 4.12 Testing (Optional -- Recommended)

| Package | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | `^1.44` | E2E + visual regression testing |

---

## 5. Environment Variables

### `.env.example` (committed to repo)

```bash
# ===== Firebase =====
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-only, no NEXT_PUBLIC_ prefix)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# ===== Google Gemini AI =====
GEMINI_API_KEY=

# ===== Analytics =====
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=

# ===== WhatsApp =====
NEXT_PUBLIC_WHATSAPP_NUMBER=962XXXXXXXXX

# ===== Calendly =====
NEXT_PUBLIC_CALENDLY_URL=

# ===== Site =====
NEXT_PUBLIC_SITE_URL=https://aviniti.com
```

**Security rules:**
- Variables without `NEXT_PUBLIC_` prefix are server-only and never exposed to the browser.
- `GEMINI_API_KEY` and all `FIREBASE_ADMIN_*` keys must never have the `NEXT_PUBLIC_` prefix.
- `.env.local` is in `.gitignore` and never committed.

---

## 6. Configuration Files

### 6.1 `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add if loading images from external CDN
    ],
  },

  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default config;
```

### 6.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/messages/*": ["./messages/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6.3 `tailwind.config.ts`

The full Tailwind config is defined in `design-system.md` Section 10. The key structure:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F1419', light: '#1A2332', lighter: '#243044', dark: '#0D1117' },
        'slate-blue': { DEFAULT: '#1A2332', light: '#243044' },
        bronze: { DEFAULT: '#C08460', hover: '#A6714E', light: '#D4A583', muted: '#8B6344' },
        'off-white': '#F4F4F2',
        muted: { DEFAULT: '#9CA3AF', light: '#6B7280' },
        success: { DEFAULT: '#34D399', dark: '#065F46' },
        warning: { DEFAULT: '#FBBF24', dark: '#78350F' },
        error: { DEFAULT: '#F87171', dark: '#7F1D1D' },
        info: { DEFAULT: '#60A5FA', dark: '#1E3A5F' },
        'tool-orange': { DEFAULT: '#F97316', dark: '#431407', light: '#FDBA74' },
        'tool-blue': { DEFAULT: '#3B82F6', dark: '#172554', light: '#93C5FD' },
        'tool-green': { DEFAULT: '#22C55E', dark: '#052E16', light: '#86EFAC' },
        'tool-purple': { DEFAULT: '#A855F7', dark: '#3B0764', light: '#D8B4FE' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      // See design-system.md Section 10 for full extend config
    },
  },
  plugins: [],
};

export default config;
```

### 6.4 `middleware.ts`

Locale detection and redirect middleware. Full implementation is in `i18n-design.md` Section 2.2.

```typescript
// middleware.ts (project root)
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'] as const;
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for valid locale prefix
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // Detect and redirect
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const browserLocale = request.headers
    .get('accept-language')
    ?.split(',')[0]
    ?.split('-')[0];

  const detectedLocale =
    (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as any) ? savedLocale : undefined) ??
    (browserLocale && SUPPORTED_LOCALES.includes(browserLocale as any) ? browserLocale : undefined) ??
    DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap).*)'],
};
```

---

## 7. Development Scripts

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css}\"",
    "check:translations": "tsx scripts/check-translations.ts",
    "test:visual": "playwright test tests/visual/",
    "prebuild": "npm run type-check && npm run check:translations"
  }
}
```

### Script descriptions

| Script | Purpose | When to Run |
|--------|---------|-------------|
| `dev` | Start local dev server on `localhost:3000` | Active development |
| `build` | Production build with type check + translation check | Before deploy |
| `start` | Serve production build | Production server |
| `lint` | Run ESLint (includes RTL class enforcement) | Pre-commit |
| `lint:fix` | Auto-fix ESLint violations | Manual cleanup |
| `type-check` | TypeScript compiler check without emitting | Pre-commit, CI |
| `format` | Format all source files with Prettier | Manual cleanup |
| `format:check` | Verify formatting without changing files | CI |
| `check:translations` | Verify en/ar translation key parity | CI, pre-build |
| `test:visual` | Playwright RTL visual regression screenshots | Pre-release |
| `prebuild` | Runs automatically before `build`: type check + translation check | Automatic |

---

## 8. Module Responsibility Guide

A quick reference for what belongs where.

### `src/app/[locale]/` -- Pages (Thin)

Pages are **thin orchestrators**. They:
- Load translations via `getTranslations` / `createTranslator`
- Fetch any server-side data
- Pass props down to section components
- Define `generateMetadata` for SEO
- Define `generateStaticParams` for static generation

Pages should **not** contain UI markup beyond composing section components.

### `src/app/api/` -- API Routes (Server Logic)

API routes handle:
- Request validation (Zod schemas)
- Gemini API calls (prompt construction + response parsing)
- Firebase writes (lead storage)
- Rate limiting
- Error handling and structured responses

API routes should **not** import React components or client-side code.

### `src/components/ui/` -- Design System Primitives

These are the building blocks referenced in `design-system.md`. Each component:
- Accepts design tokens as props (variant, size, color)
- Is stateless or minimally stateful (controlled via props)
- Uses `cn()` for conditional class merging
- Follows the design system's exact color, spacing, and radius values
- Supports RTL via logical Tailwind properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`)

### `src/components/layout/` -- Persistent Chrome

Layout components wrap page content and persist across navigation. They live in the root `layout.tsx` outside the `template.tsx` transition wrapper so they are not affected by `AnimatePresence`.

### `src/components/features/` -- Isolated Feature Modules

Self-contained feature groups (chatbot, exit intent, analytics, WhatsApp) with their own state management. These are typically client components with lazy loading.

### `src/components/homepage/` -- Homepage Sections

One component per homepage section (as defined in PRD Section 3.2). Each section:
- Accepts translated strings as props (from page-level server component)
- Wraps content in `ScrollReveal` for entrance animation
- Uses the correct section padding from design system (`py-12 md:py-20`)

### `src/components/ai-tools/` -- Shared AI Tool Components

Components shared across the four AI tools. Tool-specific behavior is driven by props (accent color, form fields) rather than separate implementations.

### `src/lib/` -- Business Logic (No UI)

Pure logic modules with zero React component imports:
- `firebase/` -- Database operations
- `gemini/` -- AI prompt engineering and response parsing
- `motion/` -- Animation constants and variant definitions
- `i18n/` -- Translation loading, formatting, locale config
- `utils/` -- Pure utility functions
- `data/` -- Static data constants

### `src/hooks/` -- Custom React Hooks

Reusable hooks for cross-cutting concerns. Each hook:
- Has a single responsibility
- Returns a clean API
- Handles cleanup in `useEffect` teardown

### `src/types/` -- Type Definitions Only

No runtime code. Only TypeScript interfaces, types, and const assertions.

### `src/styles/globals.css` -- Tailwind Layers

Contains:
- Tailwind `@import` directives
- `@layer base` -- Custom heading classes with `clamp()`, Arabic typography overrides, RTL `letter-spacing: 0` reset
- `@layer components` -- Glow shadow utilities, gradient utilities, section divider
- `@layer utilities` -- Any custom one-off utilities

---

## 9. Import Path Conventions

All imports use the `@/` alias mapped to `src/`. This eliminates relative path fragility (`../../../`).

### Import order (enforced by ESLint `import/order`):

```typescript
// 1. React and Next.js
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. Third-party libraries
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

// 3. Internal lib modules
import { cn } from '@/lib/utils/cn';
import { duration, easing } from '@/lib/motion/tokens';
import { fadeInUp, staggerContainer } from '@/lib/motion/variants';
import { getTranslations, createTranslator } from '@/lib/i18n/server';

// 4. Components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/shared/SectionHeading';

// 5. Hooks
import { useReducedMotion } from '@/hooks/useReducedMotion';

// 6. Types (type-only imports)
import type { Locale, ToolSlug } from '@/types/common';
import type { Solution } from '@/types/solutions';

// 7. Data
import { solutions } from '@/lib/data/solutions';
```

### Naming conventions:

| Category | File naming | Export style |
|----------|------------|-------------|
| Components | `PascalCase.tsx` | Named export: `export function Button()` |
| Hooks | `camelCase.ts` | Named export: `export function useMediaQuery()` |
| Lib modules | `camelCase.ts` | Named exports: `export const duration = {}` |
| Types | `camelCase.ts` | Named exports: `export type Locale = ...` |
| API routes | `route.ts` | Default exports: `export async function POST()` |
| Pages | `page.tsx` | Default export: `export default async function Page()` |
| Layouts | `layout.tsx` | Default export: `export default function Layout()` |

---

## 10. Scaffolding Commands

Run these commands in sequence to scaffold the project from scratch.

### Step 1: Create Next.js project

```bash
npx create-next-app@latest aviniti-website \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

### Step 2: Install core dependencies

```bash
cd aviniti-website

npm install framer-motion \
  firebase firebase-admin \
  @google/generative-ai \
  zod \
  clsx tailwind-merge \
  lucide-react \
  sonner
```

### Step 3: Install optional Radix primitives

```bash
npm install @radix-ui/react-dialog \
  @radix-ui/react-accordion \
  @radix-ui/react-tabs \
  @radix-ui/react-tooltip \
  @radix-ui/react-checkbox \
  @radix-ui/react-radio-group \
  @radix-ui/react-slider \
  @radix-ui/react-select
```

### Step 4: Install dev dependencies

```bash
npm install -D prettier prettier-plugin-tailwindcss tsx
```

### Step 5: Create directory structure

```bash
# Translation files
mkdir -p messages/en messages/ar

# Public assets
mkdir -p public/fonts public/images/{hero,solutions,apps,case-studies,blog,og,icons} public/logo

# App routes
mkdir -p src/app/\[locale\]/{idea-lab,ai-analyzer,get-estimate,roi-calculator}
mkdir -p src/app/\[locale\]/solutions/\[slug\]
mkdir -p src/app/\[locale\]/blog/\[slug\]
mkdir -p src/app/\[locale\]/case-studies/\[slug\]
mkdir -p src/app/\[locale\]/{faq,contact,privacy-policy,terms-of-service}

# API routes
mkdir -p src/app/api/ai/{idea-lab,analyzer,estimate,roi-calculator}
mkdir -p src/app/api/{chat,contact,exit-intent}

# Components
mkdir -p src/components/{ui,layout,shared}
mkdir -p src/components/features/{chatbot,exit-intent,whatsapp,analytics}
mkdir -p src/components/{homepage,ai-tools}

# Lib
mkdir -p src/lib/{firebase,gemini/prompts,motion,i18n,utils,data}

# Other
mkdir -p src/{hooks,types,styles}
mkdir -p scripts
mkdir -p tests/{visual,unit}
```

### Step 6: Create placeholder files

```bash
# Create all route.ts files
for dir in idea-lab analyzer estimate roi-calculator; do
  touch src/app/api/ai/$dir/route.ts
done
touch src/app/api/chat/route.ts
touch src/app/api/contact/route.ts
touch src/app/api/exit-intent/route.ts

# Create all page.tsx files
for dir in idea-lab ai-analyzer get-estimate roi-calculator faq contact privacy-policy terms-of-service; do
  touch "src/app/[locale]/$dir/page.tsx"
done
touch "src/app/[locale]/solutions/page.tsx"
touch "src/app/[locale]/solutions/[slug]/page.tsx"
touch "src/app/[locale]/blog/page.tsx"
touch "src/app/[locale]/blog/[slug]/page.tsx"
touch "src/app/[locale]/case-studies/page.tsx"
touch "src/app/[locale]/case-studies/[slug]/page.tsx"

# Create root locale files
touch "src/app/[locale]/{layout,page,template,not-found,error,loading}.tsx"

# Create middleware
touch middleware.ts

# Create translation file placeholders
for ns in common home estimate idea-lab idea-analyzer roi-calculator solutions case-studies blog faq contact chatbot errors meta; do
  echo '{}' > messages/en/$ns.json
  echo '{}' > messages/ar/$ns.json
done

# Create type files
for f in common api solutions blog case-studies chatbot forms; do
  touch src/types/$f.ts
done

# Create lib files
touch src/lib/firebase/{client,admin,collections}.ts
touch src/lib/gemini/{client,schemas}.ts
touch src/lib/gemini/prompts/{idea-lab,analyzer,estimate,roi-calculator,chatbot}.ts
touch src/lib/motion/{variants,tokens,hooks}.ts
touch src/lib/i18n/{types,config,server,client,formatters,navigation}.ts
touch src/lib/utils/{cn,formatters,validators,analytics}.ts
touch src/lib/data/{solutions,apps,services,faq,navigation}.ts

# Create hook files
touch src/hooks/{useMediaQuery,useScrollDirection,useExitIntent,useReducedMotion,useLocale,useLocalStorage}.ts

# Create component files
touch src/components/ui/{Button,Card,Input,Textarea,Select,Checkbox,RadioGroup,Slider,Badge,Tabs,Accordion,Modal,Toast,Tooltip,Skeleton,Spinner,EmptyState,Stepper,ProgressBar,Avatar,Divider,Container,Section}.tsx
touch src/components/layout/{Navbar,MobileDrawer,Footer,Breadcrumbs,PageTransition,NavigationProgress,LanguageSwitcher,SkipToContent}.tsx
touch src/components/features/chatbot/{ChatbotWidget,ChatBubble,ChatWindow,ChatMessage,QuickReplies,TypingIndicator}.tsx
touch src/components/features/exit-intent/{ExitIntentProvider,ExitIntentPopup,ExitIntentForm}.tsx
touch src/components/features/whatsapp/WhatsAppButton.tsx
touch src/components/features/analytics/{AnalyticsProvider,TrackingEvents}.tsx
touch src/components/homepage/{HeroSection,TrustIndicators,ServicesOverview,AIToolsSpotlight,SolutionsPreview,LiveAppsShowcase,WhyChooseUs,CaseStudiesPreview,BlogPreview,ProcessOverview,FinalCTA}.tsx
touch src/components/ai-tools/{ToolHero,ToolForm,StepTransition,AIThinkingState,ToolResults,CrossSellCTA,EmailCapture,ScoreGauge,ROIChart,ComparisonBars}.tsx
touch src/components/shared/{SectionLabel,SectionHeading,CTABanner,ShareButtons,NewsletterForm,ScrollReveal}.tsx

# Create scripts
touch scripts/{check-translations,generate-sitemap}.ts

# Create globals.css placeholder
touch src/styles/globals.css

# Create env
touch .env.example .env.local
```

### Step 7: Initialize `cn()` utility

Write the first real code -- the `cn()` utility that every component depends on:

```typescript
// src/lib/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

**End of Project Structure Document v1.0**

This document, combined with `design-system.md`, `i18n-design.md`, and `animation-spec.md`, provides everything a developer needs to scaffold and build the complete Aviniti website. Every file has a defined purpose, every type has a defined shape, and every component has a defined position in the hierarchy.
