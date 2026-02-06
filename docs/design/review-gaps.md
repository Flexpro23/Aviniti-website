# Design Specification Gap Analysis
**Date:** February 6, 2026
**Reviewer:** Devil's Advocate Design Review
**Source of Truth:** PRD-v3.md
**Files Reviewed:** 12 design specification documents

---

## Executive Summary

This gap analysis compares the PRD-v3.md (source of truth) against 12 design specification files to identify missing, incomplete, or insufficiently specified features. The review found **47 gaps** ranging from critical missing features to specification inconsistencies.

**Critical Gaps:** 8
**Major Gaps:** 19
**Minor Gaps:** 20

---

## Gap 1: Missing About Page Design Specification

- **PRD Reference**: Section 3.15 (About - Phase 2)
- **Severity**: Major
- **What's Missing**: While PRD marks About page as "Phase 2", there is NO design specification file for this page at all. The About page is mentioned in navigation and footer links throughout the design specs, but the page itself has no design.
- **Recommendation**: Create `docs/design/pages-about.md` covering: company story, mission/values, "Why Jordan", optional team section, hero layout, content sections, imagery/photography specs, and CTA placement.

---

## Gap 2: Individual Solution Detail Page Designs Not Specified

- **PRD Reference**: Section 3.7 (Ready-Made Solutions)
- **Severity**: Major
- **What's Missing**: `pages-solutions.md` provides a generic template for solution detail pages but does NOT provide specific content, imagery, or unique value propositions for each of the 7 solutions. The PRD lists 7 distinct solutions (Delivery App, Kindergarten, Hypermarket, Office Suite, Gym, Airbnb, Hair Transplant AI). The design spec provides data reference (Section 3.2) but lacks:
  - Unique hero images/mockups per solution
  - Solution-specific feature callouts
  - Custom timeline phases per solution (e.g., Gym has 13-week timeline vs. standard 7-week)
  - Specific add-on pricing and descriptions
- **Recommendation**: Create individual content specifications for each solution detail page in a supplementary document or expand Section 3.2 of `pages-solutions.md` with full visual and content specs.

---

## Gap 3: 404 Page Not Fully Specified

- **PRD Reference**: Implied requirement (mentioned in Appendix A - Phase 1)
- **Severity**: Minor
- **What's Missing**: `components-global.md` mentions "404 Page" in the table of contents (line 21) but the document cuts off before Section 8 is reached. There is NO design specification for the 404 error page.
- **Recommendation**: Complete Section 8 of `components-global.md` specifying: 404 hero message, helpful navigation links, search functionality, recent blog posts or AI tool recommendations, branded illustration, and CTA to homepage or Get Estimate.

---

## Gap 4: Newsletter Signup Feature Not Designed

- **PRD Reference**: Section 9 (Success Metrics) mentions "Secondary KPIs" and "newsletter signup (future)"
- **Severity**: Minor
- **What's Missing**: The PRD mentions newsletter signup as a future feature but there is NO design specification for newsletter signup forms, placement (footer, blog post end, exit intent), or email collection CTAs.
- **Recommendation**: Either remove newsletter references from PRD (if truly future), or add a newsletter signup component spec to `components-global.md` covering: form design, placement strategy, success states, email service provider integration notes.

---

## Gap 5: Exit Intent Variations A-E Lack Specific Copy and Visuals

- **PRD Reference**: Section 3.13 (Exit Intent System), lists 5 variations
- **Severity**: Major
- **What's Missing**: `components-global.md` Section 5 specifies the 5 exit intent variations but provides only placeholder headlines and generic descriptions. Missing specifics:
  - **Variation A (Lead Magnet):** No specification for the "10 AI App Ideas..." PDF design, no cover mockup specification, no internal PDF layout/content
  - **Variation B (Consultation):** No Calendly link specification, no team photo/illustration specification
  - **Variation C (Quick Estimate):** No specification for how the quick 2-field estimate integrates with the full Get AI Estimate flow
  - **Variation D (WhatsApp):** No Arabic pre-filled message provided
  - **Variation E (Chatbot):** No Avi avatar large-format specification
- **Recommendation**: Create `docs/design/exit-intent-content.md` with exact copy, visual asset specs, and logic for variation selection (which variant shows to which user segment).

---

## Gap 6: Chatbot (Avi) System Prompt and Conversation Flows Not Specified

- **PRD Reference**: Section 3.12 (Vanity Assistant / Avi Chatbot)
- **Severity**: Critical
- **What's Missing**: `components-global.md` Section 4 specifies the chatbot UI design comprehensively, BUT:
  - NO system prompt template provided (what context does Gemini receive?)
  - NO conversation flow trees (how does Avi route users to Idea Lab vs Get Estimate vs Case Studies?)
  - NO intent recognition examples
  - NO sample conversations or training data references
  - NO fallback responses when Avi cannot answer
  - NO escalation path to human (beyond "contact us")
  - NO specification for how Avi detects language (English vs Arabic input)
  - NO specification for multi-turn conversation context management
- **Recommendation**: Create `docs/design/chatbot-avi-logic.md` covering: Gemini system prompt template, intent taxonomy, conversation trees, sample multi-turn conversations, fallback/error handling, language detection logic, and context retention strategy.

---

## Gap 7: WhatsApp Integration Pre-Filled Messages Not Fully Specified

- **PRD Reference**: Section 3.14 (WhatsApp Integration)
- **Severity**: Major
- **What's Missing**: PRD Section 3.14 specifies WhatsApp integration across multiple touchpoints. The design specs reference WhatsApp buttons/links in:
  - Floating button (`components-global.md`)
  - Contact page
  - Get AI Estimate results
  - ROI Calculator results
  - Exit intent Variation D
  - Homepage Final CTA

  However, NONE of the design specs provide:
  - **Exact Arabic pre-filled messages** for each context
  - **Specific WhatsApp Business number** (shown as `962XXXXXXXXX` placeholder throughout)
  - **WhatsApp Business profile setup requirements** (catalog, quick replies, away messages per PRD Section 3.14.5)
  - **Deep link parameter specifications** for tracking which page/CTA initiated the WhatsApp conversation
- **Recommendation**: Create `docs/design/whatsapp-integration.md` with: final WhatsApp Business number, pre-filled message templates (English + Arabic) for every touchpoint, UTM parameter structure for tracking, and WhatsApp Business profile content specifications.

---

## Gap 8: SEO Structured Data (JSON-LD) Incomplete for Key Pages

- **PRD Reference**: Section 8 (Technical Requirements - SEO)
- **Severity**: Major
- **What's Missing**: PRD requires "Structured data (JSON-LD)" for all pages. Design specs provide JSON-LD for:
  - Solutions catalog (ItemList)
  - Individual solutions (Product)
  - Blog posts (BlogPosting)
  - FAQ (FAQPage)
  - Case studies catalog (implied but not shown)
  - Contact (Organization)

  Missing structured data for:
  - **Homepage** (Organization + Website + BreadcrumbList)
  - **AI Tools pages** (WebApplication for each tool)
  - **Case study detail pages** (Article or Case Study markup)
  - **Individual blog posts** (verified BlogPosting but no example provided in blog spec)
  - **404 page** (WebPage with error status)

  Additionally, NO specification for:
  - **BreadcrumbList** structured data (mentioned in PRD, not implemented in design specs)
  - **Video** structured data (if demo videos are added per PRD Section 11 assets)
- **Recommendation**: Add JSON-LD specifications to each page design doc, and create a master reference in `docs/design/seo-structured-data.md` with all schema.org templates.

---

## Gap 9: Social Sharing OG Images Not Specified

- **PRD Reference**: Section 8 (Technical Requirements - SEO)
- **Severity**: Major
- **What's Missing**: PRD requires "Open Graph tags for social sharing" on all pages. Design specs include `og:image` meta tags but provide NO specification for:
  - OG image dimensions (should be 1200x630px per OG spec)
  - OG image design templates (branded background, page title overlay, Aviniti logo placement)
  - Which pages get unique OG images vs. default
  - Fallback OG image specification

  Example: `get-estimate.md` shows `<meta property="og:image" content="/og/get-estimate.png" />` but there's no design for what `/og/get-estimate.png` should look like.
- **Recommendation**: Create `docs/design/og-image-templates.md` specifying: default OG image design, per-page OG image variations, design template (Figma/Canva), asset generation process, and file naming convention.

---

## Gap 10: Analytics Event Tracking Not Specified

- **PRD Reference**: Section 9 (Success Metrics) and Section 7 (Integrations - Google Analytics)
- **Severity**: Critical
- **What's Missing**: PRD Section 9 lists Primary and Secondary KPIs requiring event tracking:
  - Lead form submissions
  - Calendly bookings
  - Time on site, pages per session
  - Chatbot conversations initiated
  - WhatsApp conversations started
  - Exit intent conversion rate
  - AI tool completion rate
  - ROI Calculator completions
  - Case study page views
  - Chatbot-to-conversion rate

  NONE of the design specifications include:
  - Event names and parameters for Google Analytics 4
  - Trigger points for events (e.g., when exactly is "AI tool completion" tracked?)
  - Conversion event definitions
  - Custom dimensions/parameters (e.g., tool type, variant shown)
  - Goal setup specifications
- **Recommendation**: Create `docs/design/analytics-tracking-plan.md` mapping every KPI to specific GA4 events, parameters, and triggers. Include event schemas (JSON format).

---

## Gap 11: Form Validation Error Messages Inconsistent and Incomplete

- **PRD Reference**: Implied by form specifications across AI tools
- **Severity**: Major
- **What's Missing**: Each AI tool form spec (`ai-tool-estimate.md`, `ai-tool-idea-lab.md`, etc.) defines form fields and validation rules, but:
  - Error messages are generic or missing entirely for many fields
  - No consistent error message voice/style guide
  - No specification for real-time validation vs. submit-time validation
  - No specification for field-level error display timing (on blur? on submit?)

  Example: `ai-tool-estimate.md` Step 4 specifies email validation "Valid email regex" but doesn't specify the EXACT error message or when it appears.

  Additionally, `i18n-design.md` mentions `errors.json` translation file but doesn't provide the actual error message key structure or complete message list.
- **Recommendation**: Create `docs/design/form-validation-spec.md` with: complete error message dictionary (English + Arabic), validation timing rules, error display patterns, and inline help text specifications. Populate the `errors.json` structure in `i18n-design.md`.

---

## Gap 12: Loading States and Skeleton Screens Underspecified

- **PRD Reference**: Section 5 (Interactions & Animations)
- **Severity**: Major
- **What's Missing**: PRD Section 5 mentions "Loading states - Custom branded loading spinners, Skeleton loaders for content". `animation-spec.md` Section 9 is titled "Loading & Skeleton States" but the document cuts off before this section is reached.

  Missing specifications:
  - Skeleton screen designs for: blog listing, case studies listing, solutions catalog, AI tool results pages
  - Branded loading spinner SVG/animation specification
  - Loading state timeout behaviors (what happens if API takes >10 seconds?)
  - Progressive loading strategies (show partial content while loading more?)
- **Recommendation**: Complete `animation-spec.md` Section 9 with skeleton screen wireframes, loading spinner design (SVG + animation keyframes), and timeout/error transition specs.

---

## Gap 13: Mobile Gesture Support Not Specified

- **PRD Reference**: Section 5 (Interactions & Animations)
- **Severity**: Minor
- **What's Missing**: `animation-spec.md` Section 5.3 shows swipe gesture support for AI tool step transitions in code, but there is NO design specification for:
  - Visual feedback during swipe (elastic scroll, haptic feedback on mobile)
  - Swipe threshold distances
  - Swipe velocity requirements
  - Other gesture support (pinch to zoom on images, pull-to-refresh on blog listing, swipe-to-dismiss on mobile drawer)
- **Recommendation**: Add gesture interaction specifications to `animation-spec.md` covering supported gestures, visual feedback, and platform-specific behaviors (iOS vs Android).

---

## Gap 14: Empty States Not Designed

- **PRD Reference**: Implied by interactive features
- **Severity**: Major
- **What's Missing**: NONE of the design specifications include empty state designs for:
  - **Blog listing** - No posts in a category after filtering
  - **Case studies listing** - No case studies in a filtered industry
  - **Solutions catalog** - No solutions match filter (unlikely but should handle)
  - **AI tool results** - AI fails to generate ideas/analysis (error state exists, but what if AI returns zero results?)
  - **Search results** - No results found (FAQ search, blog search)
  - **Chatbot** - No conversation history (first message)

  Example: If a user filters blog posts by "AI & ML" but there are no posts in that category yet, what does the page show?
- **Recommendation**: Add empty state specifications to each applicable page design doc. Include: empty state illustration/icon, headline, description, and CTA (e.g., "No posts yet in this category. View all posts" or "Try a different filter").

---

## Gap 15: Success States and Confirmation Screens Incomplete

- **PRD Reference**: Implied by form submissions throughout
- **Severity**: Major
- **What's Missing**: Most form specifications include submit button states but lack complete success confirmation specifications:
  - **Contact form** (`pages-contact-legal.md`): Shows inline success message but no email confirmation sent specification
  - **Newsletter signup** (if implemented): No confirmation email spec, no double opt-in flow spec
  - **Calendly booking**: No post-booking confirmation screen or email spec
  - **AI tool email delivery**: PRD says results are emailed but design specs don't specify email template designs, subject lines, or "check your email" confirmation screens

  Example: Get AI Estimate results page shows CTAs but doesn't specify: "We've also sent this estimate to your@email.com" confirmation message.
- **Recommendation**: Create `docs/design/email-templates.md` with all transactional email designs (estimate delivery, ROI report, idea lab results, contact form confirmation, newsletter confirmation). Add post-submit confirmation messaging to each form spec.

---

## Gap 16: Reduced Motion Fallbacks Incompletely Specified

- **PRD Reference**: Section 5 (Interactions & Animations) and `animation-spec.md` Section 1.3
- **Severity**: Minor
- **What's Missing**: `animation-spec.md` Section 1.3 states "When `prefers-reduced-motion: reduce` is active, Tiers 2-4 are disabled." This is a good high-level rule, but:
  - Individual page design specs do NOT consistently specify what happens when reduced motion is active
  - No examples of what "Tier 1 simplified to opacity-only transitions at 0ms duration" looks like in practice
  - No specification for alternative visual indicators when motion is removed (e.g., if a card normally lifts on hover with translateY, what happens in reduced motion mode?)
- **Recommendation**: Add reduced-motion fallback specifications to high-animation components (hero, AI tool loading states, chatbot, exit intent). Ensure WCAG compliance by maintaining visual feedback even without motion.

---

## Gap 17: Print Styles Not Specified

- **PRD Reference**: Section 3.11 (Contact) and legal pages
- **Severity**: Minor
- **What's Missing**: `pages-contact-legal.md` Section 3.9 mentions "Print-friendly. Add `@media print` styles" for legal pages but does NOT specify:
  - Exact print styles (remove dark background, use black text on white)
  - Which elements to hide on print (navbar, footer, chatbot, WhatsApp button, exit intent)
  - Page break rules
  - Print header/footer content

  Additionally, other pages that may be printed are not considered:
  - **AI tool results pages** (users may want to print estimates)
  - **Case studies** (users may want to print for offline review)
  - **Blog posts** (users may want to print articles)
- **Recommendation**: Create `docs/design/print-styles.md` specifying print CSS for all printable content types. Ensure legal pages, AI tool results, blog posts, and case studies are print-optimized.

---

## Gap 18: Focus Management and Keyboard Navigation Patterns Inconsistent

- **PRD Reference**: Section 8 (Technical Requirements - Accessibility)
- **Severity**: Major
- **What's Missing**: Each page design spec includes accessibility sections with keyboard navigation notes, but:
  - **Inconsistent focus order specifications**: Some pages specify exact tab order, others don't
  - **Missing focus management on route change**: When navigating from one page to another, where does focus land? (Should be H1 or skip-to-content)
  - **Missing focus trapping specifications for modals**: Exit intent popup specifies focus trap, but mobile drawer does not clearly specify focus trap behavior
  - **Inconsistent "Skip to content" link**: Only mentioned in `components-global.md` navbar section, not consistently applied across all pages
  - **No specification for focus visible styles on custom components**: Design system specifies focus rings, but individual components (AI tool cards, solution cards) don't always show focus treatment
- **Recommendation**: Create `docs/design/accessibility-keyboard-nav.md` consolidating all keyboard navigation patterns, focus management rules on route changes, and focus-visible style application checklist. Audit each page spec for consistency.

---

## Gap 19: ARIA Live Regions and Dynamic Content Announcements Underspecified

- **PRD Reference**: Section 8 (Technical Requirements - Accessibility)
- **Severity**: Major
- **What's Missing**: Several interactive features dynamically update content but lack proper screen reader announcements:
  - **AI tool step transitions**: When moving between steps, is the new step announced? (`ai-tool-estimate.md` doesn't specify `aria-live` region for step content)
  - **Chatbot new messages**: `components-global.md` specifies `role="log"` and `aria-live="polite"` for messages container, but what about typing indicators?
  - **Filter/search results update**: When blog/case study filters change content, is the new count announced? ("Showing 5 results")
  - **Counter animations**: Trust Indicators counters animate from 0 to final value - are they announced to screen readers? (Could be disruptive if announced every frame)
  - **Form validation**: Real-time validation errors - are they announced immediately or only on submit?
- **Recommendation**: Audit all dynamic content updates and specify `aria-live` regions, `role="status"`, and announcement timing. Add to each component's accessibility section.

---

## Gap 20: Color Contrast Ratios Not Verified for All Component Combinations

- **PRD Reference**: Section 8 (Technical Requirements - Accessibility)
- **Severity**: Major
- **What's Missing**: `design-system.md` Section 1.4 provides contrast ratios for core color combinations, but:
  - **Tool accent colors on dark backgrounds**: Only the 4 tool accent primary colors are verified. What about tool accent *light* shades (used for text on dark tinted surfaces)? Example: Orange-300 `#FDBA74` on Orange-950 `#431407` - is this contrast sufficient?
  - **Status colors**: Success, Warning, Error, Info colors have contrast ratios verified against Navy, but NOT against Slate Blue (card backgrounds where they often appear)
  - **Muted text on Slate Blue Light**: `#9CA3AF` on `#243044` - is this 4.5:1 minimum? Not verified in design system.
  - **Bronze on card hover states**: When card background changes from Slate Blue to Slate Blue Light on hover, does bronze text maintain contrast?
- **Recommendation**: Expand `design-system.md` Section 1.4 with exhaustive contrast ratio table covering ALL foreground/background combinations used in the design specs. Run automated contrast checker and document results.

---

## Gap 21: Internationalization (i18n) Translation Key Structure Not Fully Defined

- **PRD Reference**: Section 6 (Internationalization) and `i18n-design.md`
- **Severity**: Major
- **What's Missing**: `i18n-design.md` Section 3 provides file structure and naming conventions for translation keys, but:
  - **Incomplete key examples**: Only homepage keys are shown (`home.json` excerpt). Other namespaces (estimate, idea-lab, roi-calculator, etc.) are listed but not exemplified.
  - **No complete key inventory**: Across 12 design spec files, there are hundreds of UI strings (button labels, headlines, descriptions, error messages, validation messages, success messages, etc.). NONE of these are compiled into a translation key reference.
  - **Pluralization rules not specified**: How are plurals handled in Arabic? (Arabic has 6 plural forms)
  - **Variable interpolation examples insufficient**: Only shows `{{paramKey}}` pattern but doesn't show complex examples (dates, currency formatting, etc.)
  - **No RTL-specific text handling**: Are parentheses, quotes, and punctuation handled correctly in RTL? (Arabic uses different quote marks: « »)
- **Recommendation**: Generate complete translation key dictionary from all design specs. Create `docs/design/i18n-translation-keys.md` with all English keys as source of truth. Add RTL text formatting rules and pluralization strategy.

---

## Gap 22: Right-to-Left (RTL) Layout Specifications Inconsistent

- **PRD Reference**: Section 6 (Internationalization) and `i18n-design.md` Section 4
- **Severity**: Major
- **What's Missing**: Each design spec includes RTL considerations sections, but:
  - **Inconsistent level of detail**: Some specs thoroughly detail RTL (homepage, contact), others are superficial (blog, FAQ)
  - **No RTL wireframes or mockups**: All wireframes are LTR. No visual reference for what RTL layout looks like for complex sections (AI tools multi-step forms, case study layouts)
  - **Missing RTL specifications for:**
    - Data tables (which columns stay left-aligned vs. flip?)
    - Charts and graphs (ROI Calculator results charts - do axis labels flip?)
    - Code blocks (code is always LTR even in RTL documents - is this specified?)
    - Mixed LTR/RTL content (email addresses, URLs, phone numbers embedded in Arabic text)
    - Numeric formatting (Arabic-Indic numerals ٠-٩ vs Western numerals 0-9)
- **Recommendation**: Create `docs/design/rtl-layout-guide.md` with comprehensive RTL rules, edge case handling, and visual mockups of key pages in RTL mode. Consider creating Figma/design files showing RTL layouts.

---

## Gap 23: Responsive Breakpoint Strategy Inconsistent Across Specs

- **PRD Reference**: `design-system.md` Section 4.1 (Breakpoints)
- **Severity**: Minor
- **What's Missing**: `design-system.md` defines standard breakpoints (640px, 768px, 1024px, 1280px, 1536px), but individual page specs use inconsistent breakpoint terminology:
  - Some specs use: Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)
  - Others use: Mobile (<640px), Tablet (640-1023px), Desktop (1024px+)
  - Some distinguish "Wide" (1440px+), others don't

  Example: `homepage-design.md` uses "< 640px" for mobile, but `pages-solutions.md` uses "< 768px"

  Additionally:
  - No specification for in-between sizes (e.g., 640-767px range)
  - No specification for very large screens (>1920px) - does content keep expanding or cap at max-width?
- **Recommendation**: Standardize all responsive specifications to use the same breakpoint definitions and terminology. Add responsive behavior specifications for edge sizes (320px minimum, 1920px+ maximum).

---

## Gap 24: Image Asset Specifications Incomplete

- **PRD Reference**: Section 11 (Assets Needed)
- **Severity**: Major
- **What's Missing**: PRD Section 11 lists assets needed but design specs do NOT specify:
  - **Image dimensions and aspect ratios** for:
    - Blog post featured images (mentioned as 16:9 but no minimum resolution)
    - Case study hero images (no specification at all)
    - Solution mockups/screenshots (no specification)
    - App portfolio screenshots (no specification)
    - Team photos for About page (page doesn't exist)
  - **Image optimization requirements**:
    - File format (WebP with PNG/JPG fallback per PRD, but not consistently specified)
    - Compression targets (file size limits)
    - Lazy loading strategy (mentioned in PRD but not in specs)
    - Responsive image srcset rules
  - **Alt text writing guidelines**: PRD requires alt text, specs mention it, but NO guidelines on how to write descriptive alt text
  - **Placeholder images during development**: Should components show lorem ipsum images or branded placeholders?
- **Recommendation**: Create `docs/design/image-asset-specs.md` with: required dimensions per context, aspect ratios, file format/optimization rules, alt text guidelines, and responsive image strategy.

---

## Gap 25: Icon System and Iconography Not Fully Specified

- **PRD Reference**: `design-system.md` Section 8 (Iconography)
- **Severity**: Minor
- **What's Missing**: Design specs reference Lucide icons throughout but `design-system.md` Section 8 "Iconography" is likely not fully detailed (document sections suggest this exists but content not shown in excerpt).

  Missing specifications:
  - **Complete icon inventory**: Which Lucide icons are used where?
  - **Icon sizing rules**: Specs use various sizes (h-4, h-5, h-6, h-8, etc.) - what are the semantic rules? (e.g., inline icons are 16px, section icons are 24px)
  - **Icon color rules**: When do icons use `text-muted` vs `text-bronze` vs `text-white`?
  - **Custom icons**: Are any icons custom-designed (not from Lucide)? The WhatsApp icon is custom SVG - where is it specified?
  - **Icon accessibility**: All icons should be `aria-hidden="true"` if decorative, but this isn't consistently specified
- **Recommendation**: Complete `design-system.md` Section 8 with icon inventory, sizing/color rules, custom icon SVG specs, and accessibility guidelines.

---

## Gap 26: Video Content Specifications Missing

- **PRD Reference**: Section 11 (Assets Needed) mentions "Demo videos (user has)"
- **Severity**: Minor
- **What's Missing**: PRD mentions demo videos but NONE of the design specifications include:
  - Where are videos displayed? (Homepage? Solution detail pages? Case studies?)
  - Video player design (custom branded player or default HTML5?)
  - Video dimensions and aspect ratios
  - Autoplay rules (PRD Section 5 says "No autoplay video" but this isn't consistently specified)
  - Video loading states and poster images
  - Video accessibility (captions, transcripts, audio descriptions)
  - Video hosting (YouTube embed, self-hosted, Cloudinary?)
- **Recommendation**: If videos are being used, create `docs/design/video-specs.md` with player design, placement strategy, accessibility requirements, and hosting/delivery specifications. If videos are NOT being used, remove references from PRD.

---

## Gap 27: Micro-Copy and Content Voice/Tone Guidelines Missing

- **PRD Reference**: Implied by brand identity (Section 2)
- **Severity**: Major
- **What's Missing**: PRD Section 2 defines brand personality: "Modern & Premium", "Approachable & Bold", "Trust-Building", "AI-Forward". However, NONE of the design specifications include:
  - **Voice and tone guidelines** for writing UI copy
  - **Content style guide** (punctuation rules, capitalization, etc.)
  - **Writing examples** demonstrating brand voice
  - **Forbidden words/phrases** (e.g., avoid "cheap", "basic", "simple")
  - **Terminology consistency** (Is it "AI-powered" or "AI powered"? "App" or "application"? "Get estimate" or "Get an estimate"?)

  Example: Some specs say "Get AI Estimate", others "Get Your AI Estimate", others "Get an AI Estimate" - inconsistent.
- **Recommendation**: Create `docs/design/content-style-guide.md` with voice/tone principles, writing rules, terminology dictionary, and before/after examples. Audit all design specs for terminology consistency.

---

## Gap 28: API Endpoint Specifications and Request/Response Formats Missing

- **PRD Reference**: Section 7 (Integrations - Google Gemini AI)
- **Severity**: Critical
- **What's Missing**: AI tools specs (Idea Lab, Analyzer, Estimate, ROI Calculator) show frontend form flows but do NOT specify:
  - **API endpoint URLs**: `/api/idea-lab`, `/api/estimate`, etc.
  - **Request payload formats** (JSON schemas)
  - **Response payload formats** (JSON schemas)
  - **Error response formats**
  - **Rate limiting rules** (how many requests per user per minute?)
  - **Authentication/authorization** (are API endpoints public or require tokens?)
  - **Timeout configurations** (specs say "30 second timeout" but is this client-side or server-side?)

  Example: `ai-tool-estimate.md` shows the user submits Step 1-4 data, but what does the API request body look like? What fields are sent? What does the AI response JSON structure look like?

  Similarly, chatbot spec shows UI but no API contract for `/api/chat` endpoint.
- **Recommendation**: Create `docs/design/api-specifications.md` with OpenAPI/Swagger-style specs for all API endpoints. Include request/response schemas, error codes, and rate limiting rules.

---

## Gap 29: Third-Party Service Configuration Details Missing

- **PRD Reference**: Section 7 (Integrations)
- **Severity**: Major
- **What's Missing**: PRD lists required integrations (Google Analytics, Google Ads, Meta Pixel, Calendly, Firebase, Gemini, WhatsApp Business) but design specs do NOT specify:
  - **Google Analytics 4**:
    - GA4 property ID placeholder
    - Custom event naming convention (already flagged in Gap 10)
    - User ID tracking strategy (for cross-session tracking)
    - Cookie consent banner design (GDPR/CCPA compliance)
  - **Meta Pixel**:
    - Pixel ID placeholder
    - Standard events to track (PageView, Lead, ViewContent)
    - Custom conversions setup
  - **Calendly**:
    - Exact Calendly embed URL
    - Calendly event type slug
    - Prefill parameters (name, email from form)
    - Calendly webhook configuration for tracking bookings
  - **Firebase**:
    - Firestore data schema (how are leads stored?)
    - Firebase Authentication (is it used? The specs don't mention user accounts)
    - Firebase Storage (for uploaded files? There are no file uploads in the specs)
  - **Cookie Consent**:
    - NO cookie consent banner design specified (required for GDPR)
- **Recommendation**: Create `docs/design/third-party-integrations.md` with configuration details, embed code templates, and data flow diagrams. Add cookie consent banner design to `components-global.md`.

---

## Gap 30: Performance Budget and Optimization Specs Incomplete

- **PRD Reference**: Section 8 (Technical Requirements - Performance)
- **Severity**: Major
- **What's Missing**: PRD specifies "Lighthouse score > 90 on all metrics" and targets for FCP (<1.5s) and TTI (<3s), but design specs do NOT specify:
  - **Bundle size budgets**: Maximum JS bundle size per page
  - **Image optimization**: Specific compression targets (already flagged in Gap 24)
  - **Font loading strategy**: FOUT vs FOIT, font-display: swap is mentioned in design-system.md but not consistently applied
  - **Critical CSS**: Which CSS should be inlined?
  - **Code splitting strategy**: How are page bundles split?
  - **Lazy loading**: Which components are lazy loaded? (Chatbot is, per specs, but what else?)
  - **Prefetching/preloading**: Which resources should be prefetched on hover?
  - **CDN strategy**: Are assets served from CDN? Which CDN?
- **Recommendation**: Create `docs/design/performance-optimization.md` with bundle budgets, lazy loading strategy, critical path optimization, and CDN configuration. Add performance budget to each page spec.

---

## Gap 31: Database Schema and Data Models Not Specified

- **PRD Reference**: Section 7 (Integrations - Firebase)
- **Severity**: Critical
- **What's Missing**: Design specs show forms collecting user data (leads, AI tool inputs, contact submissions, newsletter signups) but there is NO specification for:
  - **Firestore collections schema**: What collections exist? (leads, ai-tool-submissions, chatbot-conversations, etc.)
  - **Document structure**: What fields are in each document? Data types?
  - **Indexes**: Which fields need indexes for queries?
  - **Security rules**: Firestore security rules to prevent unauthorized access
  - **Data retention policy**: How long is data kept?
  - **PII handling**: How is personally identifiable information (email, phone, name) protected?

  Example: When a user submits Get AI Estimate form, where is that data stored? What does the Firestore document look like?
- **Recommendation**: Create `docs/design/database-schema.md` with Firestore collection schemas, security rules, data flow diagrams, and PII handling procedures. Ensure compliance with Privacy Policy statements.

---

## Gap 32: Error Tracking and Logging Strategy Not Specified

- **PRD Reference**: Implied by technical requirements
- **Severity**: Major
- **What's Missing**: When errors occur (API failures, Gemini timeouts, form submission errors, 404s, etc.), how are they tracked and logged?
  - NO specification for error tracking service (Sentry, LogRocket, etc.)
  - NO specification for client-side error boundaries (React Error Boundaries)
  - NO specification for error logging format
  - NO specification for alert thresholds (when to notify team of errors)
  - NO specification for user-facing error messages vs. internal error logs (don't expose stack traces to users)
- **Recommendation**: Create `docs/design/error-tracking.md` with error tracking service selection, error boundary implementation, logging strategy, and alert configuration.

---

## Gap 33: Deployment and Environment Configuration Not Specified

- **PRD Reference**: Implied by technical requirements
- **Severity**: Minor
- **What's Missing**: No design specification for:
  - **Environment variables**: Which env vars are needed? (API keys, Firebase config, Gemini API key, WhatsApp number, Calendly URL, etc.)
  - **Environment-specific configurations**: Staging vs Production differences
  - **Build configuration**: Next.js build settings, environment variable handling
  - **Deployment platform**: Vercel? Netlify? Self-hosted? (PRD mentions "Vercel Geo headers" suggesting Vercel)
- **Recommendation**: Create `docs/design/deployment-config.md` with environment variable inventory, build configuration, and deployment checklist. Not strictly a design doc, but necessary for implementation.

---

## Gap 34: Testing Strategy and Acceptance Criteria Not Specified

- **PRD Reference**: Implied by quality requirements
- **Severity**: Major
- **What's Missing**: Design specs show what to build but NOT how to verify it works:
  - NO test plan or QA checklist
  - NO acceptance criteria for each feature
  - NO browser/device testing matrix (PRD Section 8 lists browser support but no testing procedure)
  - NO accessibility testing checklist (beyond WCAG mentions)
  - NO performance testing procedure (how to verify Lighthouse >90?)
  - NO user acceptance testing (UAT) plan
  - NO specification for staged rollout or feature flags
- **Recommendation**: Create `docs/design/testing-strategy.md` with test plans, acceptance criteria per feature, browser/device matrix, accessibility testing checklist, and UAT procedures.

---

## Gap 35: Content Management Strategy Not Specified

- **PRD Reference**: Section 3.9 (Blog), Section 3.8 (Case Studies)
- **Severity**: Major
- **What's Missing**: Design specs show blog and case study pages but do NOT specify:
  - **CMS selection**: Headless CMS (Contentful, Sanity, etc.) or file-based (MDX)?
  - **Content schema**: What fields does a blog post have? (title, slug, featured image, excerpt, author, date, category, tags, content body, SEO fields)
  - **Content authoring workflow**: Who creates content? How is it previewed? How is it published?
  - **Drafts vs Published**: Content state management
  - **Content localization**: How are blog posts translated? Separate documents per language?
  - **Rich text/markdown**: What formatting options are available in blog content? (headings, lists, links, images, code blocks, blockquotes)
- **Recommendation**: Create `docs/design/cms-content-strategy.md` with CMS selection, content schemas, authoring workflow, and localization strategy.

---

## Gap 36: Scroll Behavior and Anchor Link Specifications Incomplete

- **PRD Reference**: Implied by navigation and FAQ accordion
- **Severity**: Minor
- **What's Missing**: Several design specs mention smooth-scrolling and anchor links but do NOT fully specify:
  - **Smooth scroll configuration**: `scroll-behavior: smooth` globally? Or per link?
  - **Scroll offset for sticky navbar**: When jumping to an anchor (e.g., FAQ question, table of contents), does scroll account for 64px navbar height?
  - **Scroll restoration**: When user navigates back, should scroll position be restored?
  - **Scroll-to-top button**: Not specified anywhere. Should there be a "Back to top" button on long pages?
  - **Deep linking**: FAQ questions, blog table of contents, case study sections - do these have `id` attributes for deep linking?
- **Recommendation**: Add scroll behavior specifications to `components-global.md` and relevant page specs. Specify scroll offset rules, restoration policy, and whether scroll-to-top button is needed.

---

## Gap 37: Typography Hierarchy Edge Cases Not Specified

- **PRD Reference**: `design-system.md` Section 2 (Typography)
- **Severity**: Minor
- **What's Missing**: Design system defines typography scale and heading styles, but edge cases are not specified:
  - **Very long headings**: What happens if a blog post title is 200 characters? Does it wrap? Truncate? Reduce font size?
  - **Headings with inline code**: If a heading contains `<code>` (e.g., "Using the `getStaticProps` function"), how is it styled?
  - **Headings with links**: Can headings contain links? Are they styled differently?
  - **Line length maximums**: Narrow-content container is max-w-[768px] for readability, but is there a maximum line length in characters enforced?
  - **Widows and orphans**: Should CSS prevent single-word last lines?
- **Recommendation**: Add edge case handling to `design-system.md` typography section with examples and CSS rules.

---

## Gap 38: Z-Index Scale and Layering Not Fully Specified

- **PRD Reference**: `design-system.md` (implied)
- **Severity**: Minor
- **What's Missing**: Design specs use various z-index values (z-40, z-50, z-60, z-[100]) but there is NO centralized z-index scale or layering documentation.

  From specs:
  - Navbar: `z-50`
  - Chatbot bubble: `z-40`
  - WhatsApp button: `z-40`
  - Mobile drawer: `z-50`
  - Exit intent popup: `z-[60]`
  - Toast notifications: `z-100`
  - Skip-to-content: `z-[100]`

  Questions:
  - What if exit intent popup and mobile drawer are both open? (z-60 vs z-50 - exit intent wins, is that correct?)
  - What if chatbot and exit intent are both showing? (z-60 vs z-40 - exit intent wins, correct?)
  - Is there a z-index scale definition (10, 20, 30, etc.) or are values arbitrary?
- **Recommendation**: Add z-index scale to `design-system.md` with semantic layer names (e.g., z-navbar: 50, z-overlay: 60, z-toast: 100) and layering hierarchy documentation.

---

## Gap 39: Interaction States Beyond Hover Not Fully Specified

- **PRD Reference**: `design-system.md` Section 7 (Components)
- **Severity**: Minor
- **What's Missing**: Design system and component specs thoroughly document hover states but other interaction states are underspecified:
  - **Active/pressed state**: Mentioned for buttons but not consistently for all interactive elements (cards, tabs, accordions)
  - **Disabled state**: Mentioned for form inputs and buttons but not for other controls (selectable cards in AI tools?)
  - **Loading state**: Specified for buttons but what about links, cards, or other clickable elements that trigger async actions?
  - **Drag state**: If drag gestures are supported (mobile swipe), what visual feedback during drag?
  - **Selected vs focused**: Selectable cards show selected state, but is it different from focus state for keyboard users?
- **Recommendation**: Audit all interactive components and specify all states (default, hover, focus, active, disabled, loading, selected) with visual treatments.

---

## Gap 40: Component Reusability and Composition Patterns Not Documented

- **PRD Reference**: Implied by design system approach
- **Severity**: Minor
- **What's Missing**: Design specs reference components (Button, Card, Input, etc.) but there's NO documentation of:
  - **Component hierarchy**: Which components are composed of other components?
  - **Composition patterns**: How do components combine? (e.g., Card contains Icon + Heading + Body + CTA)
  - **Component variants**: Button has primary/outline/ghost variants - are these exhaustive? Can new variants be added?
  - **Component props and API**: What props does each component accept?
  - **Compound components**: Are there compound components (e.g., Accordion.Trigger + Accordion.Content)?

  While this is partially an implementation concern, design specs should document intended component structure for consistency.
- **Recommendation**: Add component composition documentation to `design-system.md` or create `docs/design/component-library.md` with component API reference and composition examples.

---

## Gap 41: Browser-Specific Quirks and Fallbacks Not Specified

- **PRD Reference**: Section 8 (Technical Requirements - Browser Support)
- **Severity**: Minor
- **What's Missing**: PRD lists supported browsers (Chrome, Safari, Firefox, Edge - latest 2 versions) but design specs do NOT specify:
  - **Safari-specific handling**: backdrop-filter support (navbar, overlays), flex gap support, smooth scrolling support
  - **Firefox-specific handling**: scrollbar styling (custom scrollbar colors)
  - **iOS Safari-specific**: 100vh issues, input zoom on focus (<16px text), position:fixed keyboard behavior
  - **Mobile browser UI bars**: Top/bottom browser bars on mobile affect viewport height - how is this handled?
  - **Fallbacks for unsupported features**: What if a browser doesn't support backdrop-filter? Solid background fallback?
- **Recommendation**: Add browser compatibility notes and fallback strategies to `docs/design/browser-support.md` with specific handling for known quirks.

---

## Gap 42: Handoff Assets and Developer Resources Not Specified

- **PRD Reference**: Section 11 (Assets Needed)
- **Severity**: Minor
- **What's Missing**: PRD lists assets needed but does NOT specify how assets are delivered to developers:
  - **Design files**: Figma? Adobe XD? Sketch? Are there design files at all or just these markdown specs?
  - **Asset export format**: How are icons exported? SVG? Font? React components?
  - **Design tokens export**: Are colors, spacing, typography tokens exported as JSON for developer import?
  - **Component library**: Is there a Storybook or component playground?
  - **Developer handoff checklist**: What does a developer need to implement a page?
- **Recommendation**: Create `docs/design/developer-handoff.md` with asset delivery process, design file links (if applicable), token export format, and implementation checklist.

---

## Gap 43: Multi-Language URL Structure Edge Cases Not Fully Specified

- **PRD Reference**: Section 6 (Internationalization) and `i18n-design.md`
- **Severity**: Minor
- **What's Missing**: `i18n-design.md` specifies `/en/` and `/ar/` URL structure but edge cases are not covered:
  - **Root URL `/` behavior**: Specs say it redirects based on detection, but what if detection fails or user has no preference? (Answered: defaults to `/en/`, but is this prominently stated?)
  - **404 pages**: Is there `/en/404` and `/ar/404`? Or a shared 404?
  - **Language switcher on 404**: If user lands on a 404, can they switch language? What does that do?
  - **External link tracking**: When user clicks a language switcher, are they redirected to the equivalent page in the new language, or the new language homepage?
  - **Deep links**: If user receives a link to `/en/blog/article-slug` and their preference is Arabic, does the page show a banner suggesting Arabic version?
- **Recommendation**: Add edge case handling to `i18n-design.md` covering 404s, language switching behavior, deep links, and fallback scenarios.

---

## Gap 44: Animated Illustrations and Branded Graphics Not Specified

- **PRD Reference**: Section 11 (Assets Needed) mentions "3D/Isometric device mockups (AI-generated + refined)"
- **Severity**: Minor
- **What's Missing**: Homepage hero mentions "Animated phone mockup showcasing our apps with floating code snippets" and several pages reference illustrations, but:
  - **No illustration style guide**: 3D? Flat? Isometric? Line art? What's the consistent style?
  - **No animation specifications for illustrations**: Hero device mockup rotates? Floats? Static?
  - **No specification for empty state illustrations** (flagged in Gap 14)
  - **No specification for error state illustrations**
  - **No specification for loading state illustrations**
  - **Inconsistent reference to "AI-generated"**: Are illustrations AI-generated (Midjourney, DALL-E) then refined by designer? Or custom-illustrated?
- **Recommendation**: Create `docs/design/illustration-style-guide.md` with visual style direction, animation specifications for illustrated elements, and asset sourcing strategy.

---

## Gap 45: Form Autofill and Autocomplete Attributes Not Specified

- **PRD Reference**: Implied by form accessibility
- **Severity**: Minor
- **What's Missing**: Form specs show input fields but do NOT specify HTML `autocomplete` attributes for autofill:
  - **Contact form**: name, email, company, phone should have `autocomplete="name"`, `autocomplete="email"`, etc.
  - **AI tool email capture**: Should have `autocomplete="email"`
  - **Phone inputs**: Should have `autocomplete="tel"`
  - **Address fields** (if added to Contact page for map): Should have `autocomplete="street-address"`, `autocomplete="country"`, etc.

  Benefits of autocomplete attributes:
  - Better UX (browser autofill)
  - Better accessibility (assistive tech understands field purpose)
  - Better mobile UX (correct keyboard appears)
- **Recommendation**: Add `autocomplete` attribute specifications to all form input specs in AI tool docs and contact page doc.

---

## Gap 46: Language Switcher Behavior on Form Pages Not Specified

- **PRD Reference**: Section 6 (Internationalization)
- **Severity**: Minor
- **What's Missing**: If a user is filling out a multi-step form (e.g., Get AI Estimate Step 3 of 4) and switches language, what happens?
  - **Form data preservation**: Is entered data preserved when switching languages?
  - **Current step preservation**: Does user stay on Step 3 or reset to Step 1?
  - **URL structure**: Does `/en/get-estimate` become `/ar/get-estimate` with state preserved, or does user lose progress?

  No specification exists for this edge case.
- **Recommendation**: Add language switching behavior to `i18n-design.md` covering form state preservation, step persistence, and user notification (e.g., "Switching language will reset your progress" warning).

---

## Gap 47: Social Proof Elements (Testimonials, Logos) Not Specified

- **PRD Reference**: Section 1 (Product Overview) mentions building trust, Section 3.2 (Homepage) shows Trust Indicators
- **Severity**: Major
- **What's Missing**: PRD emphasizes "Build trust and credibility" but design specs do NOT include:
  - **Client testimonials**: No specification for testimonial quotes, attribution, photo/avatar
  - **Client logos**: PRD mentions NDAs prevent naming clients, but are there anonymized/generic trust badges? ("Trusted by companies in X industries")
  - **Awards/certifications**: No specification for any badges (e.g., "Google Cloud Partner", "ISO certified", etc.)
  - **Press mentions**: If Aviniti has been featured in press, where are these displayed?
  - **Social proof on AI tool results pages**: "X people used this tool this month" - not specified

  Homepage has Trust Indicators (metrics + badges: SSL, GDPR, NDA) but no social proof beyond metrics.
- **Recommendation**: Add testimonials section to homepage design spec. Specify where client logos/trust badges appear (if at all). Add social proof elements to AI tool pages to increase conversion.

---

## Summary of Recommendations

### Immediate Action Required (Critical Gaps)

1. **Create chatbot logic specification** (Gap 6) - defines core AI functionality
2. **Create API specifications document** (Gap 28) - required for implementation
3. **Create database schema document** (Gap 31) - required for backend
4. **Define analytics tracking plan** (Gap 10) - required for measuring success
5. **Create exit intent content specification** (Gap 5) - completes lead gen strategy

### High Priority (Major Gaps)

6. **Create About page design spec** (Gap 1)
7. **Specify individual solution content** (Gap 2)
8. **Complete WhatsApp integration spec** (Gap 7)
9. **Expand SEO structured data** (Gap 8)
10. **Design OG image templates** (Gap 9)
11. **Create form validation spec** (Gap 11)
12. **Design empty states** (Gap 14)
13. **Create email template designs** (Gap 15)
14. **Complete accessibility specs** (Gaps 18-20)
15. **Complete i18n translation keys** (Gap 21)
16. **Create RTL layout guide** (Gap 22)
17. **Specify image assets comprehensively** (Gap 24)
18. **Create content style guide** (Gap 27)
19. **Specify third-party integrations** (Gap 29)
20. **Define performance optimization strategy** (Gap 30)
21. **Create error tracking specification** (Gap 32)
22. **Define testing strategy** (Gap 34)
23. **Specify CMS content strategy** (Gap 35)
24. **Add social proof elements** (Gap 47)

### Medium Priority (Minor Gaps)

25-46. Address remaining minor gaps (404 page, newsletter, reduced motion, print styles, gestures, video, browser quirks, etc.)

---

## Conclusion

The design specifications are comprehensive in visual design and component-level detail, but significant gaps exist in:
- **System-level specifications** (APIs, database, analytics, error tracking)
- **Content strategy** (copy, translations, social proof, CMS)
- **Implementation details** (third-party configs, deployment, testing)
- **Edge cases** (empty states, errors, loading, form language switching)

**Recommendation**: Prioritize critical and high-priority gaps before implementation begins. Many gaps will block development if not addressed (API specs, database schema, chatbot logic, analytics).

---

**Next Steps:**
1. Review this gap analysis with product owner (Ali)
2. Assign ownership of each gap documentation task
3. Set deadline for completing critical gaps (before development kickoff)
4. Schedule design review sessions after gaps are filled
5. Create implementation-ready design package with all specs complete

