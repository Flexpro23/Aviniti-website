# Aviniti Website — Production Readiness Audit Report
**Date:** 2026-02-23
**Audited by:** 7 parallel AI agents (Claude Sonnet 4.6)
**Codebase:** `/Users/aliodat/Desktop/N-Aviniti-website` (branch: `main`)

---

## Master Summary Table

| # | Section | Score | Critical Issues | Est. Hours to 10/10 |
|---|---------|:-----:|:---------------:|:-------------------:|
| 1 | TypeScript & Code Quality | **8/10** | 2 | 1.5h |
| 2 | Security | **7/10** | 8 | 7h |
| 3 | Performance & Core Web Vitals | **7.5/10** | 4 | 4h |
| 4 | SEO & Discoverability | **6.5/10** | 9 | 10h |
| 5 | Internationalization & RTL | **7/10** | 5 | 7h |
| 6 | Accessibility (a11y) | **7/10** | 8 | 9h |
| 7 | Firebase & Backend Architecture | **7/10** | 6 | 5h |
| 8 | AI Tools | **8/10** | 7 | 7h |
| 9 | UI/UX & Design Consistency | **8/10** | 6 | 9h |
| 10 | Error Handling & Resilience | **7/10** | 8 | 10h |
| 11 | Testing | **3/10** | 8 | 20h |
| 12 | DevOps & Deployment Readiness | **4/10** | 14 | 18h |
| 13 | Content Completeness | **7/10** | 6 | 16h |
| 14 | Analytics & Conversion Tracking | **8/10** | 6 | 5.5h |
| | **OVERALL** | **6.8/10** | **97 total** | **~129h total** |

---

## Overall Assessment

### Top 5 Critical Blockers (Must Fix Before Launch)

**🔴 BLOCKER 1 — Rate Limiting Is Completely Broken in Production**
- `src/lib/utils/rate-limit.ts:11` uses an in-memory `Map()` that resets on every cold start
- Vercel serverless functions have NO shared memory between instances
- This means **all rate limits are 100% ineffective** in production — bots can hit AI routes (Gemini costs money), contact form, and newsletter unlimited times
- **Fix:** Set up Upstash Redis + `@upstash/ratelimit`. Env vars are already in `.env.example` but blank.
- **Effort:** 2 hours

**🔴 BLOCKER 2 — No CI/CD Pipeline**
- No `.github/workflows/` directory exists — zero automated testing, linting, type-checking, or deployment
- Every deployment is manual and untested, with no preview deployments on PRs
- **Fix:** Create GitHub Actions workflow: `type-check → lint → test → build → Vercel deploy`
- **Effort:** 2.5 hours

**🔴 BLOCKER 3 — Missing Firestore Security Rules for 6+ Collections**
- `firestore.rules` only defines rules for `blog_posts` and `contacts`
- Collections with NO rules: `leads`, `newsletter_subscribers`, `contact_submissions`, `error_logs`, `chatbot_conversations`, `blog_topic_backlog`
- Any user who knows the collection names can write arbitrary data directly to Firestore
- `contacts` collection has `allow create: if true` with zero server-side validation
- **Fix:** Add `allow write: if false` (Admin SDK only) for all sensitive collections
- **Effort:** 1 hour

**🔴 BLOCKER 4 — Near-Zero Test Coverage on Critical Business Logic**
- Only 16 unit tests exist, all for low-level utilities
- Zero tests for: 12 API routes, 15 Zod validators, pricing calculator, AI prompt pipelines, form flows
- Pricing math errors (bundle discounts, phase cost splits) could produce wrong quotes
- Contact form, AI tools, newsletter — all ship to production completely untested
- **Fix:** Add validator tests, calculator tests, and API integration tests with Firebase mocks
- **Effort:** 20 hours (phased)

**🔴 BLOCKER 5 — Privacy Policy & Terms of Service Translation Files Missing**
- `src/app/[locale]/privacy-policy/page.tsx` and `terms-of-service/page.tsx` use i18n keys from `privacy_policy` and `terms_of_service` namespaces
- These JSON files **do not exist** in `/messages/en/` or `/messages/ar/`
- These pages will crash or render blank in production — a legal compliance and UX failure
- **Fix:** Create both namespace JSON files with full legal content in EN and AR
- **Effort:** 4 hours

---

### Quick Wins (Under 2 Hours Each, High Impact)

| Fix | File | Time |
|-----|------|------|
| Noindex AI tool pages (`/idea-lab`, `/ai-analyzer`, `/get-estimate`, `/roi-calculator`) | `src/app/robots.ts` | 20 min |
| Add `hreflang="x-default"` to sitemap | `src/app/sitemap.ts` | 20 min |
| Use `crypto.timingSafeEqual()` for revalidate secret | `src/app/api/revalidate/route.ts:20` | 15 min |
| Add `notFound()` guards to solutions & case studies detail pages | `solutions/[slug]/page.tsx`, `case-studies/[slug]/page.tsx` | 30 min |
| Fix 4× lint errors (`let` → `const`) in AI tool pages | `ai-analyzer/page.tsx:432`, `get-estimate/page.tsx:552`, `idea-lab/page.tsx:263`, `roi-calculator/page.tsx:491` | 30 min |
| Sanitize `sourceContext` fields before prompt insertion (prompt injection) | `src/app/api/ai/analyzer/route.ts:74`, `estimate/route.ts:82` | 45 min |
| Reduce AI rate limits 5/24hr → 3/24hr for estimate & ROI routes | `estimate/route.ts:23`, `roi-calculator/route.ts:22` | 5 min |
| Add `aria-label` to exit intent popup email input | `src/components/features/exit-intent/ExitIntentPopup.tsx:196` | 20 min |
| Add `role="alert"` to all form error messages | Contact form, AI tool forms | 1 hour |
| Apply Cairo font to `h1-h6` in `[dir="rtl"]` CSS | `src/app/globals.css:216-241` | 30 min |
| Add body size limit check to all AI routes | All `src/app/api/ai/*/route.ts` | 45 min |
| Mark topic as `'processing'` before Gemini call in Cloud Function | `functions/blog_generator/main.py:369` | 30 min |
| Wire `FAQPage` JSON-LD schema to FAQ page | `src/app/[locale]/faq/page.tsx` | 1 hour |
| Add newsletter subscription tracking events | `src/app/api/newsletter/route.ts` | 1 hour |

---

### Launch Readiness Verdict

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⛔  NOT READY FOR PRODUCTION LAUNCH                    ║
║                                                          ║
║   5 critical blockers must be resolved first.           ║
║   Estimated minimum fix time: 35–40 hours                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**The codebase is architecturally excellent** — the TypeScript patterns, i18n infrastructure, AI pipeline, and Firebase integration are all well-built. But three infrastructure gaps (broken rate limiting, no CI/CD, missing Firestore rules) and near-zero test coverage mean the site is not safe to expose to real traffic yet.

---

---

# Full Section Reports

---

## SECTION 1 — TypeScript & Code Quality
**Score: 8/10**

### What's Working
- `strict: true` in `tsconfig.json` with `noImplicitAny`, `strictNullChecks`, `noImplicitThis`, `strictBindCallApply`, `strictPropertyInitialization` all enabled
- Well-structured type system in `src/types/api.ts` covering all AI tools, forms, and responses with proper discriminated unions
- Zod schemas defined once and reused consistently across all API routes
- Type-safe error handling with structured `ErrorCode` and `ApiErrorResponse` wrapper types
- All API routes use async/await with try-catch; errors logged and returned as typed responses
- `sanitizePromptInput()` and `detectInputLanguage()` utilities are typed and reusable
- No observable `any` types beyond one legitimate case in `solutions/[slug]/page.tsx:42`
- No dead code or unused imports detected

### Critical Issues (blocking production)
1. **Revalidate endpoint has no Zod validation** — `src/app/api/revalidate/route.ts:20` receives `secret` from request body as raw `unknown` with no schema validation; the slug field has no format validation allowing path traversal attempts
2. **Timing attack on secret comparison** — `src/app/api/revalidate/route.ts:20` uses `secret !== expectedSecret` (non-constant-time) which is theoretically exploitable via brute force timing measurement

### To Reach 10/10 (prioritized)
1. Add Zod schema to `/api/revalidate/route.ts`:
   ```typescript
   const revalidateSchema = z.object({
     secret: z.string(),
     slug: z.string().max(100).regex(/^[a-z0-9\-]+$/).optional(),
     type: z.enum(['blog']),
   });
   ```
2. Replace string comparison with constant-time comparison:
   ```typescript
   import crypto from 'crypto';
   if (!crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret))) { ... }
   ```
3. Add `"noUncheckedIndexedAccess": true` and `"exactOptionalPropertyTypes": true` to `tsconfig.json`
4. Document in-memory rate limit reset behavior prominently in `rate-limit.ts` startup log

### Estimated Effort
1.5 hours

---

## SECTION 2 — Security
**Score: 7/10**

### What's Working
- Rate limiting applied to all public API routes with reasonable windows
- Zod validation with length limits on all user inputs (idea: max 2000 chars, messages: max 1000)
- `sanitizePromptInput()` at `src/lib/utils/api-helpers.ts:143-167` removes code blocks, system tags, escapes angle brackets before AI prompts
- IP addresses hashed with SHA-256 before Firestore storage (`api-helpers.ts:49-51`)
- Firestore rules default deny-all at the bottom (`firestore.rules:17-19`)
- Storage rules: public read on `/blog/` only; all other paths require auth
- Security headers in `next.config.ts`: CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy all set
- Firebase Admin SDK throws on client import (`admin.ts:8-11`)
- Gemini API key is server-only (no `NEXT_PUBLIC_` prefix)

### Critical Issues (blocking production)
1. **No rate limiting or Zod validation on `/api/revalidate`** — open DoS and cache invalidation vector (`revalidate/route.ts`)
2. **Non-constant-time secret comparison** — timing attack possible (`revalidate/route.ts:20`)
3. **No request body size limit on AI routes** — multi-MB payload could drain Gemini credits (`api/ai/*/route.ts`)
4. **`sourceContext` fields not sanitized before prompt insertion** — prompt injection via cross-tool context (`analyzer/route.ts:65-72`, `estimate/route.ts:71-80`)
5. **Firestore contacts collection allows `create: if true` with no validation** — any client can write arbitrary data (`firestore.rules:10-14`)
6. **In-memory rate limiter resets per cold start** — rate limits are completely ineffective in Vercel production (see Blocker 1)
7. **CSP uses `'unsafe-inline'` for scripts** — weakens XSS protection (`next.config.ts:42-45`)
8. **No explicit CORS headers** — API accessible from any origin; should restrict to production domain

### To Reach 10/10 (prioritized)
1. Harden `/api/revalidate`: add Zod schema, constant-time comparison, rate limiting (1.5h)
2. Add `content-length` body size check (max 100KB) to all AI routes (1h)
3. Create `sanitizeSourceContext()` helper; apply in analyzer and estimate routes (45 min)
4. Fix Firestore rules for all collections — see Section 7 for specifics (1h)
5. Set up Upstash Redis for production rate limiting — see Section 12 (2h)
6. Set explicit `Access-Control-Allow-Origin: https://aviniti.app` on all API routes (1h)

### Estimated Effort
7 hours

---

## SECTION 3 — Performance & Core Web Vitals
**Score: 7.5/10**

### What's Working
- All fonts (Inter, Plus Jakarta Sans, Cairo) loaded via `next/font/google` with `display: swap`
- Tailwind v4 with logical CSS properties throughout for RTL/LTR auto-adaptation
- AVIF + WebP image formats enabled in `next.config.ts:13`; remote patterns configured for Firebase Storage
- Large libraries (Recharts, jsPDF, html2canvas) dynamically imported only on pages that need them
- All Framer Motion components use GPU-accelerated properties (`transform`, `opacity`, `scale`)
- `usePrefersReducedMotion()` hook implemented and used throughout
- Firebase Analytics initializes on mount (fire-and-forget, non-blocking)
- `loading.tsx` implemented; `PageViewTracker` is Suspense-wrapped
- `ANALYZE=true` bundle analyzer flag configured in `next.config.ts:6`
- `optimizePackageImports` set for lucide-react and framer-motion (`next.config.ts:28`)

### Critical Issues (blocking production)
1. **Spotlight effects in `CompanyLogos.tsx` and `WhyChooseUs.tsx` render even with reduced-motion** — they use `opacity: 0` instead of not rendering the element entirely (lines 122-135 and 134-146 respectively)
2. **No explicit image dimensions verified across all components** — must audit every `<Image>` for `width`/`height` to prevent CLS
3. **Analytics library not lazily deferred** — `AnalyticsProvider.tsx` fires synchronously on mount; consider 2–3s delay after first user interaction
4. **No `<link rel="preconnect">` for Firebase Storage CDN** — images from `firebasestorage.googleapis.com` have no preconnect hint

### To Reach 10/10 (prioritized)
1. Audit all `<Image>` components for `width`/`height` props (1h)
2. Conditionally skip rendering spotlight `<div>` entirely when `prefersReducedMotion` is true (30 min)
3. Lazy-load Firebase Analytics after first scroll/click with 2s delay (45 min)
4. Add `<link rel="preconnect" href="https://firebasestorage.googleapis.com">` to layout head (15 min)
5. Run Lighthouse on production build; target LCP <2.5s, CLS <0.1, INP <200ms (30 min testing)

### Estimated Effort
4 hours

---

## SECTION 4 — SEO & Discoverability
**Score: 6.5/10**

### What's Working
- Homepage has full metadata: title, description, og:title, og:description, og:image, og:type, twitter:card
- `hreflang` alternate links present in root layout for `en` and `ar`
- `sitemap.ts` includes all static pages, solutions, case studies, and dynamic blog posts (fetched from Firebase)
- `robots.ts` is clean: allows `/`, disallows `/api/`
- Organization, WebSite, LocalBusiness, and Services JSON-LD schemas on homepage
- `/api/og/route.tsx` generates dynamic 1200×630 OG images with brand colors and RTL/LTR awareness
- Both `messages/en/meta.json` and `messages/ar/meta.json` have unique title/description per page
- `llms.txt` and `llms-full.txt` present for AI crawler guidance

### Critical Issues (blocking production)
1. **AI tool pages not `noindex`** — `/idea-lab`, `/ai-analyzer`, `/get-estimate`, `/roi-calculator` are indexable but are interactive apps with no standalone content value; will dilute SEO (`robots.ts`)
2. **Missing `hreflang="x-default"`** — sitemap has `en` and `ar` alternates but no `x-default` fallback; Google requires this
3. **No `BlogPosting` JSON-LD schema on blog post pages** — `getBlogPostingSchema()` exists in `structured-data.ts` but is never called; blog posts are ineligible for rich snippets
4. **No `FAQPage` JSON-LD schema on FAQ page** — structured FAQ data exists but no schema rendering (`faq/page.tsx`)
5. **No `BreadcrumbList` JSON-LD** — inner pages have breadcrumb UI but no machine-readable schema
6. **Per-page metadata for dynamic routes unverified** — `solutions/[slug]`, `case-studies/[slug]`, `blog/[slug]` must have `generateMetadata()` returning unique title/description/og:image per slug
7. **No `Service` schema on solution detail pages** — $8K–$25K products have no structured pricing schema
8. **Missing Twitter Card image dimensions** — `twitter:image:width` and `twitter:image:height` meta tags absent
9. **Production domain not verified in env** — must confirm `NEXT_PUBLIC_SITE_URL=https://www.aviniti.app` in Vercel

### To Reach 10/10 (prioritized)
1. Add noindex: modify `robots.ts` to disallow `*/idea-lab`, `*/ai-analyzer`, `*/get-estimate`, `*/roi-calculator` (20 min)
2. Add `'x-default'` to sitemap alternates in `sitemap.ts` (20 min)
3. Render `BlogPosting` JSON-LD in `blog/[slug]/page.tsx` using existing `getBlogPostingSchema()` (1h)
4. Create `FAQPage` schema and render in `faq/page.tsx` (1h)
5. Create `BreadcrumbList` schema; render on About, Solutions, Case Studies, Blog (1.5h)
6. Audit and implement `generateMetadata()` in all three dynamic `[slug]` pages (3h)
7. Add `Service` schema to `solutions/[slug]/page.tsx` (1h)
8. Add `twitter:image:width: "1200"` and `twitter:image:height: "630"` to all Metadata objects (30 min)

### Estimated Effort
10 hours

---

## SECTION 5 — Internationalization (i18n) & RTL
**Score: 7/10**

### What's Working
- `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` set dynamically (`[locale]/layout.tsx:66`)
- Cairo font loaded via `next/font/google` and applied conditionally for Arabic (`layout.tsx:79`)
- 16 namespaces configured with dynamic imports and fallback support (`src/lib/i18n/request.ts`)
- EN and AR key counts match (spot-checked); no empty string values detected
- Logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`) used consistently
- Directional icons mirror in RTL: `rtl:rotate-180` on arrows and chevrons (`HeroSection.tsx:111`, `Footer.tsx:244`)
- Language switcher has `aria-expanded`, `aria-haspopup`, keyboard navigation, outside-click close
- All 4 AI API routes include explicit output language instruction in Gemini prompts
- `Intl.NumberFormat` and `Intl.DateTimeFormat` utilities implemented with locale-aware formatting
- Phone numbers use `dir="ltr"` wrapper in RTL context (`Footer.tsx:162`)

### Critical Issues (blocking production)
1. **Arabic headings (`h1`–`h6`) still render with Inter font** — `globals.css:216-241` overrides headings to `var(--font-heading)` (Inter) globally; `[dir="rtl"] h1-h6` selectors are missing, so Arabic pages have Latin-optimized headings
2. **`hreflang` not wired into individual page `generateMetadata()`** — `getAlternateLinks()` function exists but individual pages (home, solutions, blog, about, contact) don't call it in their metadata exports
3. **Hardcoded `"Back to top"` aria-label in Footer** — `Footer.tsx:242` hardcodes English; should use `t('footer.backToTop')`
4. **Fixed-width containers may clip Arabic text** — `Navbar.tsx:287` uses `w-[480px]` dropdown; `MobileDrawer.tsx:183` uses `w-[320px]`; Arabic text is 20–30% longer
5. **No build-time i18n key parity validation** — missing AR keys silently return `'namespace.key'` as the rendered string; no script to catch this at build time

### To Reach 10/10 (prioritized)
1. Add RTL heading font rules to `globals.css`: `[dir="rtl"] h1, [dir="rtl"] h2 { font-family: var(--font-arabic); }` (1h)
2. Wire `getAlternateLinks()` into all page `generateMetadata()` exports (2h)
3. Move `"Back to top"` to `common.json` translations; use `t()` in Footer (1h)
4. Replace fixed `w-[480px]`/`w-[320px]` with `max-w-` or `min-w-` to accommodate longer Arabic strings (1h)
5. Create `scripts/validate-i18n.ts` to diff EN/AR key parity at build time; add to `prebuild` script (2h)

### Estimated Effort
7 hours

---

## SECTION 6 — Accessibility (a11y)
**Score: 7/10**

### What's Working
- Semantic HTML: `<header role="banner">`, `<nav aria-label>`, `<main id="main-content">`, `<footer role="contentinfo">` used throughout
- Skip-to-content link: present as first focusable element, `sr-only` until Tab focus, links to `#main-content`
- Icon-only buttons have `aria-label` via translation keys
- Keyboard navigation: Arrow keys, Escape, focus management on dropdown and language switcher
- Focus trapping in MobileDrawer and ExitIntentPopup; focus returned on close
- `focus-visible:ring-2 focus-visible:ring-bronze` on all interactive elements
- `prefers-reduced-motion` respected via `useReducedMotion()` hook in all animated components
- FAQ Accordion uses Radix UI with built-in ARIA roles and keyboard support
- `role="dialog" aria-modal="true"` on ExitIntentPopup

### Critical Issues (blocking production)
1. **No `role="alert"` or `aria-live` on form validation errors** — screen reader users receive no feedback when contact or AI tool forms fail validation
2. **No `aria-describedby` linking inputs to error messages** — users cannot programmatically associate errors with their source fields (`contact/page.tsx:196-202`)
3. **Exit intent popup email input has no `<label>` or `aria-label`** — only a `placeholder` attribute (`ExitIntentPopup.tsx:196-202`)
4. **Mobile touch targets below 44×44px** — Navbar menu button and MobileDrawer close button use `h-9 w-9` (36px) (`Navbar.tsx:420-425`, `MobileDrawer.tsx:214-219`)
5. **No `aria-live="polite"` on AI tool processing states** — "Generating..." and "Processing..." states are invisible to screen readers
6. **Bronze button text contrast unverified** — text on `#C08460` bronze background needs WCAG AA audit (4.5:1 ratio)
7. **No per-page h1 audit completed** — some pages may have missing or duplicate h1 elements
8. **Accordion trigger lacks `aria-label`** for truncated long questions (`FAQAccordionSection.tsx:230`)

### To Reach 10/10 (prioritized)
1. Add `role="alert"` to all form error message divs; add `aria-describedby` linking inputs to error elements (2h)
2. Add `aria-label` (or `<label>`) to exit intent email input (20 min)
3. Increase menu/close buttons to `h-11 w-11` (44px) across Navbar and MobileDrawer (30 min)
4. Add `aria-live="polite" aria-busy="true"` wrapper around all AI tool loading/processing states (1h)
5. Run WAVE or axe DevTools; fix any contrast failures on bronze backgrounds (1h)
6. Audit every page for single `<h1>` — home, about, solutions, case studies, blog, contact, faq, 404 (1h)
7. Add `aria-label` to Accordion triggers for screen reader completeness (1h)

### Estimated Effort
9 hours

---

## SECTION 7 — Firebase & Backend Architecture
**Score: 7/10**

### What's Working
- Admin SDK uses singleton with `getApps().length > 0` guard; safe against hot-reload re-init (`admin.ts:21-65`)
- Client SDK guarded with `typeof window === 'undefined'` and `isSupported()` checks (`client.ts:40, 50`)
- Error logging is fire-and-forget with `.catch()` fallback; never throws in catch blocks (`error-logging.ts:69-103`)
- Firestore indexes cover `blog_posts` (status + publishedAt) and `blog_topic_backlog` (status + priority)
- Cloud Function wraps each step (Gemini, Imagen, Firestore, Storage) in try-catch with meaningful logs
- All secrets in `main.py` read with `.strip()` to handle Firebase Secret Manager trailing newlines
- Blog generator marks topic as `'used'` after successful generation

### Critical Issues (blocking production)
1. **Firestore rules missing for 6 collections** — `leads`, `newsletter_subscribers`, `contact_submissions`, `error_logs`, `chatbot_conversations`, `blog_topic_backlog` have no rules; any client can write directly (`firestore.rules`)
2. **`contacts` collection allows `create: if true`** — no server-side validation; arbitrary client writes accepted (`firestore.rules:10-14`)
3. **Blog generator NOT idempotent** — topic status is not set to `'processing'` before Gemini call (`main.py:369-382`); parallel retries can create duplicate blog posts
4. **Composite indexes missing** for: `leads.where('phone', '==', ...)`, `newsletter_subscribers.where('email', '==', ...)`, blog slug query
5. **Admin SDK private key parsing fragile** — `admin.ts:49` uses `replace(/\\n/g, '\n')` but no `.strip()` for surrounding whitespace (unlike `main.py:89`)
6. **Blog query has N+1 problem** — `blog.ts:47-52` fetches ALL blog documents with no field selection or pagination; will timeout at scale

### To Reach 10/10 (prioritized)
1. Add `allow write: if false` rules for all sensitive collections in `firestore.rules` (1h)
2. Mark topic `status = 'processing'` before Gemini call in `main.py`; mark `'failed'` on error (45 min)
3. Add missing composite indexes to `firestore.indexes.json` and deploy (30 min)
4. Add `.strip()` to private key parsing in `admin.ts:49` (10 min)
5. Add `limit` + field selection (`.select([...])`) to `getBlogPosts()` in `blog.ts` (30 min)
6. Handle Firestore write failure explicitly in `newsletter/route.ts:77-82`: return 503 if save fails (30 min)

### Estimated Effort
5 hours

---

## SECTION 8 — AI Tools (Idea Lab, Analyzer, Estimate, ROI Calculator)
**Score: 8/10**

### What's Working
- Output language rule enforced in ALL prompts: `"Your ENTIRE output MUST be in ${outputLang === 'ar' ? 'Arabic' : 'English'}"` (`prompts.ts:93`)
- `detectInputLanguage()` used in all 4 routes before prompt construction
- `gemini-3-flash-preview` used consistently across all routes via `DEFAULT_MODEL` constant (`gemini/client.ts:63`)
- All routes validate Gemini responses with Zod `safeParse()` with retry logic (2 attempts)
- `sanitizePromptInput()` called on primary user inputs in all 4 routes
- Rate limits: Analyzer 3/24hr, Estimate 5/24hr, ROI 5/24hr, Idea Lab 6/24hr — all with IP hashing
- `useResultPersistence.ts` persists results to localStorage with 30-day expiration and shareable URL generation
- `sourceContext` passes structured data between tools (Idea Lab → Analyzer → Estimate → ROI)
- All 4 routes save leads + submissions to Firestore subcollections (`leads/{id}/analyzer`, etc.)
- Meaningful error responses (503 "AI service temporarily unavailable") instead of raw 500s

### Critical Issues (blocking production)
1. **`sourceContext` fields not sanitized** — `ideaName`, `complexity`, `recommendations` fields from upstream tools are inserted into Gemini prompts without `sanitizePromptInput()` (`analyzer/route.ts:65-72`, `estimate/route.ts:71-80`) — prompt injection vector
2. **RTL PDF generation not confirmed** — `PDFReport.tsx`, `AnalyzerPDFReport.tsx`, `ROIPDFReport.tsx` not audited for Arabic RTL support; jsPDF may render Arabic LTR
3. **`selectedFeatureIds` not validated against feature catalog** — `estimate/route.ts:62-65` accepts arbitrary feature IDs; invalid IDs could crash `calculateEstimate()` or produce wrong pricing
4. **ROI Calculator `projectName` field goes unsanitized in `from-estimate` mode** — `roi-calculator/route.ts:69-73` skips sanitization for certain fields based on mode
5. **No post-response language validation** — if Gemini ignores the language instruction, output language mismatch is not detected or flagged to the user
6. **Rate limits may be too permissive** — Estimate and ROI at 5/24hr cost ~$0.01/request; distributed bot attack can drain Gemini budget
7. **Email validation in `EmailCapture.tsx:69` uses weak regex** — accepts near-any format; leads polluted with fake emails

### To Reach 10/10 (prioritized)
1. Sanitize all `sourceContext` fields: create `sanitizeSourceContext()` helper; apply in `analyzer/route.ts:74` and `estimate/route.ts:82` (45 min)
2. Audit all three PDF components for RTL support; add jsPDF RTL settings and Arabic font if missing (2h)
3. Validate `selectedFeatureIds` against feature catalog before `calculateEstimate()` in `estimate/route.ts:62` (30 min)
4. Apply `sanitizePromptInput()` to `projectName` in `roi-calculator/route.ts` regardless of mode (15 min)
5. Reduce Estimate and ROI rate limits from 5/24hr to 3/24hr (`estimate/route.ts:23`, `roi-calculator/route.ts:22`) (5 min)
6. Add post-response language detection: compare output language against `inputLanguage`; log mismatch (1h)
7. Upgrade email validation to RFC 5322-compliant check in `EmailCapture.tsx:69` (30 min)

### Estimated Effort
7 hours

---

## SECTION 9 — UI/UX & Design Consistency
**Score: 8/10**

### What's Working
- Comprehensive design token system in `globals.css` with CSS custom properties for all colors, gradients, and tool-specific themes — no raw hex values scattered in components
- Strong mobile responsiveness across all major sections with proper `md:` and `lg:` breakpoints
- Dark navy theme uniformly applied — no unexpected light backgrounds
- Framer Motion animation variants centralized in `src/lib/motion/variants.ts` and reused consistently
- `Section.tsx` wrapper component abstracts padding and background variants for consistency
- Clear hover and focus states on all interactive elements
- RTL layout using logical CSS properties (`start-0`, `end-0`, `ps-4`, `rtl:rotate-180`)
- ExitIntentPopup is dismissible, respects session state, accessible (keyboard trap, focus management)
- Inline form validation with error messages and double-submit prevention
- 404 and error pages are branded with helpful navigation

### Critical Issues (blocking production)
1. **Inline `style={}` objects scattered in Navbar, FinalCTA, and Contact page** instead of reusable CSS utility classes — `Navbar.tsx:162-167`, `Navbar.tsx:289-292`, `FinalCTA.tsx:163-168`, `Contact/page.tsx:228-244, 301-318, 493-509`
2. **BlogGrid has no empty state component** — shows only a text message when zero posts; no branded visual (`BlogGrid.tsx:126-133`)
3. **No loading skeleton states** — BlogGrid uses text fallback instead of shimmer/skeleton; AI tool pages show a spinner but no content skeleton
4. **Inconsistent section spacing** — some sections use `py-12 md:py-20` (Section component), others manually set `py-16 lg:py-32` with no single source of truth
5. **Form input styling inconsistency** — PhoneInput has custom CSS in `globals.css:400-504` while other inputs use inline classNames; may not match visually
6. **No design token documentation** — no reference for future contributors on which tokens to use

### To Reach 10/10 (prioritized)
1. Extract all inline `style={}` glass/card effects into `.glass-dark`, `.glass-dropdown`, `.form-card` utility classes in `globals.css` (2h)
2. Create `BlogEmpty.tsx` branded empty state with icon, heading, and CTA (1h)
3. Create `BlogCardSkeleton.tsx` with shimmer animation; use as Suspense fallback in BlogGrid (2h)
4. Standardize form input base styles into a single `input-base` Tailwind class (1.5h)
5. Create spacing scale CSS custom properties (`--spacing-section-sm`, `--spacing-section-lg`) (1.5h)
6. Create `docs/design-tokens.md` documenting all color, spacing, animation tokens (1h)

### Estimated Effort
9 hours

---

## SECTION 10 — Error Handling & Resilience
**Score: 7/10**

### What's Working
- `error.tsx` at `[locale]` level with bilingual error message and "Try Again" retry button
- `not-found.tsx` with branded design and navigation links; `notFound()` called in `blog/[slug]/page.tsx:74`
- Consistent API error response format: `{ success: false, error: { code, message, retryAfter?, suggestion? } }`
- AI analyzer implements 2-attempt retry before returning 503
- `getBlogPosts()` returns empty array on Firestore error; `getBlogPost()` returns `null`
- Forms distinguish validation errors (400), rate limit errors (429), and server errors (503)
- `logServerError` used in catch blocks across API routes

### Critical Issues (blocking production)
1. **`solutions/[slug]/page.tsx` and `case-studies/[slug]/page.tsx` do NOT call `notFound()`** — invalid slugs render with null/undefined data instead of proper 404 page
2. **No AbortController timeout on AI routes** — if Gemini hangs, request continues until Next.js platform timeout; no user-facing timeout message
3. **`blog/page.tsx:23-26` has no try/catch** — if Firestore is down, unhandled promise rejection crashes the page; `error.tsx` catches it but loses all context
4. **UI cannot distinguish "zero posts" from "Firestore error"** — `BlogGrid` renders same text for both states; users can't retry on error
5. **Contact form errors not tracked in analytics** — `contact/page.tsx:178, 181` catches errors but never calls analytics tracking
6. **No `aria-live` regions on loading states** — processing/generating states not announced to screen readers (also Section 6)
7. **Error log context insufficient** — `logServerError` calls in AI routes don't include `locale` or `inputLanguage`; hard to debug locale-specific failures
8. **Exit intent tracking failures are silent** — no fallback logging if `/api/exit-intent` is unreachable

### To Reach 10/10 (prioritized)
1. Add `notFound()` guard to `solutions/[slug]/page.tsx` and `case-studies/[slug]/page.tsx` after data fetch (30 min)
2. Create `withTimeout()` wrapper using `AbortController`; apply to all 4 Gemini API calls (2h)
3. Wrap `blog/page.tsx` data fetch in try/catch; pass error state to `BlogGrid` for differentiated UI (1h)
4. Add `trackContactFormError()` analytics call to contact form catch block (30 min)
5. Add `locale` and `inputLanguage` to all `logServerError` calls in AI routes (1h)
6. Create generic `ErrorBoundary` wrapper for server component data fetches (1.5h)

### Estimated Effort
10 hours

---

## SECTION 11 — Testing
**Score: 3/10**

### What's Working
- Vitest configured correctly with jsdom environment (`vitest.config.ts:8`)
- Two utility test files exist and pass: `api-helpers.test.ts` (12 tests) and `rate-limit.test.ts` (4 tests)
- Core helpers tested: `sanitizeInput`, `generateTicketId`, `hashIP`, `getLocaleFromRequest`, `checkRateLimit`
- Test setup file imports `@testing-library/jest-dom/vitest`
- 16 total tests, 0 failures

### Critical Issues (blocking production)
1. **Zero tests for 12 API routes** — contact, newsletter, all 4 AI tools, chat, exit-intent, revalidate, og, generate-features, analyze-idea — all completely untested; 0% coverage on production business logic
2. **Zero tests for 15 Zod validators** — `emailSchema`, `phoneSchema`, `nameSchema`, `analyzerFormSchema`, `contactFormSchema`, and 10 others — invalid data could reach Firestore untested
3. **Zero tests for pricing calculator** — bundle discount logic, phase distribution, rounding math in `src/lib/pricing/calculator.ts` — wrong pricing quotes could ship to clients
4. **Zero E2E tests** — no Playwright or Cypress; no coverage of contact form submission, AI tool completion, PDF generation, or language switching
5. **Zero component tests** — no snapshot or render tests for any form or PDF component
6. **No Firebase mock setup** — `setup.ts` has no Firestore/Admin SDK mocks; API route tests can't run without real Firebase credentials
7. **Tests don't block builds** — `prebuild` in `package.json:16` runs only `type-check`, not `npm test`; broken tests can ship to production
8. **37 ESLint errors in codebase** — 4× `prefer-const` in AI tool pages; `no-explicit-any` in `solutions/[slug]/page.tsx:42`; `setState` in effect body in `AnalyzerPDFReport.tsx:511`

### To Reach 10/10 (prioritized)
1. Create Firebase mock layer in `src/test/firebase-mock.ts` (2h)
2. Create `src/lib/utils/__tests__/validators.test.ts` — test all 15 schemas with valid, invalid, boundary, and injection inputs (3h)
3. Create `src/lib/pricing/__tests__/calculator.test.ts` — test discount tiers, phase distribution, rounding (2h)
4. Create API integration tests for contact, newsletter, and AI routes using Firebase mocks (6h)
5. Set up Playwright; create E2E specs for contact form, language switching, AI tool flow (4h)
6. Add component snapshot tests for form components and PDF reports (3h)
7. Add `&& npm test` to `prebuild` script in `package.json` (2 min)
8. Fix all 37 ESLint errors (30 min)
9. Set coverage threshold in `vitest.config.ts`: 70% lines/functions (1h)
10. Create GitHub Actions CI workflow: `type-check → lint → test → build` (see Section 12)

### Estimated Effort
20 hours

---

## SECTION 12 — DevOps & Deployment Readiness
**Score: 4/10**

### What's Working
- Security headers well-configured in `next.config.ts`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- Firebase config complete in `firebase.json`: Firestore rules, indexes, storage rules, Cloud Functions
- `.gitignore` properly excludes `.env` files, Firebase service account JSON, Python venv
- `npm run build` completes with 0 errors; `npm run type-check` passes with 0 errors
- `.env.example` documents all required variables (lines 1–33) with clear `NEXT_PUBLIC_` vs server-only separation
- Image optimization and remote patterns configured in `next.config.ts`

### Critical Issues (blocking production)
1. **No GitHub Actions CI/CD pipeline** — `.github/workflows/` does not exist; every deployment is manual and untested
2. **No Vercel configuration** — no `.vercel/project.json` or `vercel.json`; no preview deployments on PRs; production env vars likely not set in Vercel
3. **In-memory rate limiter is ineffective in Vercel serverless** — `rate-limit.ts:11` uses `Map()` that resets per cold start; rate limiting does not work in production at all
4. **No error monitoring** — no Sentry, Datadog, or equivalent; errors are logged to Firestore but there are no alerts or dashboards
5. **No Cloud Function deployment automation** — no script or workflow for `firebase deploy --only functions`; manual deployments error-prone
6. **No rollback documentation** — no runbooks for Vercel, Firebase Functions, Firestore rules, or database rollback
7. **No database backup strategy** — Firestore has live client/lead data with no documented export schedule or recovery procedure
8. **`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.example` are blank** — Redis is not set up; rate limiting is purely in-memory
9. **No environment variable validation at startup** — missing Firebase/Gemini env vars cause runtime crashes, not build-time failures
10. **No `www` → apex domain redirect configured** — potential duplicate content if both `www.aviniti.app` and `aviniti.app` are accessible
11. **No domain/DNS/SSL documentation** — no deployment guide or runbook
12. **Cloud Function has no Python unit tests** — `main.py` is 500+ lines with complex logic; zero test coverage

### To Reach 10/10 (prioritized)
1. **Create `.github/workflows/ci.yml`**: `type-check → lint → test → build → Vercel deploy on main` (2.5h)
2. **Create Firebase deploy workflow**: `firebase deploy --only firestore:rules,firestore:indexes,storage` on push to `main` (1h)
3. **Set up Upstash Redis**: create instance, set env vars, implement `rate-limit-redis.ts` using `@upstash/ratelimit` (2h)
4. **Set up Vercel**: run `vercel link`, configure production + preview deployments, set all env vars in Vercel dashboard (2h)
5. **Add Sentry**: `npm install @sentry/nextjs`; configure client and server configs; add Slack alerts (1.5h)
6. **Add env validation in `src/lib/config/env.ts`**: throw at startup if required vars are missing (1h)
7. **Enable Firestore automated backups** in Firebase Console; document restore procedure (1h)
8. **Create `docs/deployment.md` and `docs/rollback.md`** with step-by-step guides (1h)
9. **Configure `www` → apex redirect** in Vercel project settings (15 min)
10. **Add Cloud Function CI workflow**: deploy `functions/blog_generator` on changes to `functions/**` (1h)

### Estimated Effort
18 hours

---

## SECTION 13 — Content Completeness
**Score: 7/10**

### What's Working
- All 8 solutions defined in `solutions.ts` with pricing, timelines, features, and hero images
- 6 comprehensive case studies with real client testimonials, metrics, and technology stacks
- 5 FAQ categories (pricing, process, timeline, technology, support) with proper i18n keys
- Real contact info: `aliodat@aviniti.app`, WhatsApp `+962790685302` in Footer and Contact page
- EN/AR translations complete for home, solutions, and about sections
- Testimonials use real client names and company attributions (5-star ratings)
- About page has genuine founder story (Ali Odat) with mission and values
- All 8 solution hero images exist in `/public/Ready-made-solutions/`

### Critical Issues (blocking production)
1. **Privacy Policy and Terms of Service translation files do not exist** — `privacy-policy/page.tsx` and `terms-of-service/page.tsx` use `privacy_policy` and `terms_of_service` i18n namespaces; neither exists in `/messages/en/` or `/messages/ar/` — these pages will crash or render blank
2. **Case study hero images referenced but missing** — `case-studies.ts` references `/images/case-studies/delivery-platform-amman.webp` etc.; some images may not exist in `/public/images/case-studies/`
3. **App store links in `liveApps.ts` are placeholder URLs** — e.g., `https://apps.apple.com/app/skinverse` missing region/app ID; broken links on public-facing pages
4. **Blog section in home.json has post translations** (`post_1_title`, etc.) but these hardcoded posts should be replaced by dynamic Firebase content
5. **`contact.json` namespace missing validation messages** — form error messages like `name_required`, `phone_error`, `message_required` may be hardcoded or falling back to key names
6. **No `faq` namespace translation file** — FAQ uses `faq.ts` data but translations must flow through proper i18n

### To Reach 10/10 (prioritized)
1. Create `/messages/en/privacy-policy.json` and `/messages/ar/privacy-policy.json` with full legal text covering data collection (Firestore, Analytics, AI inputs), retention, user rights (4h)
2. Create `/messages/en/terms-of-service.json` and `/messages/ar/terms-of-service.json` (2h)
3. Verify all 6 case study images exist in `/public/images/case-studies/`; generate missing ones with Imagen 4.0 Ultra (3h)
4. Fix all placeholder App Store/Google Play links in `liveApps.ts` or remove sections using them (30 min)
5. Add missing form validation messages to `contact.json` in both locales (1h)
6. Verify FAQ content renders fully with i18n — add `faq.json` namespace if needed (1h)

### Estimated Effort
16 hours (includes legal content creation + image generation)

---

## SECTION 14 — Analytics & Conversion Tracking
**Score: 8/10**

### What's Working
- `PageViewTracker.tsx` properly Suspense-wrapped and wired into root layout
- All event names defined as constants in `events.ts`; no hardcoded strings found in components
- Firebase Analytics initialized with `isSupported()` + `typeof window` guards — fully SSR-safe
- CTA tracking wired in `FinalCTA.tsx` with `location`, `label`, and `locale` parameters
- `AnalyticsProvider` is non-rendering and fires-and-forgets on mount
- Language change tracking implemented with `from`/`to` locale parameters
- Contact form tracks `contact_capture_started` and `contact_capture_submitted`
- All 4 AI tools track `ai_tool_started`, `ai_tool_submitted`, `ai_tool_completed`, `ai_tool_error`

### Critical Issues (blocking production)
1. **Newsletter subscription events not tracked** — no `EVT_NEWSLETTER_*` constants in `events.ts`; `newsletter/route.ts` has no analytics calls; subscription funnel is invisible in GA4
2. **PDF download tracking not wired** — `EVT_PDF_DOWNLOADED` constant exists in `events.ts` but no `trackPdfDownloaded()` calls found in `AnalyzerPDFReport.tsx`, `PDFReport.tsx`, or `ROIPDFReport.tsx`
3. **Exit intent tracking uses custom fetch instead of standard analytics module** — `ExitIntentPopup.tsx:10-20` hardcodes event names (`'exit_intent_dismissed'`) instead of using `events.ts` constants; no `EVT_EXIT_INTENT_*` constants exist
4. **AI tool cross-sell click tracking not wired** — `EVT_AI_TOOL_CROSS_SELL_CLICKED` constant defined (`events.ts:14`) but no `trackAiToolCrossSellClicked()` calls found in any component
5. **Solution page views not tracked** — `EVT_SOLUTION_VIEWED` defined but no calls in `solutions/page.tsx` or solution detail pages
6. **Contact form validation errors not tracked** — form abandonment and validation failure events are missing

### To Reach 10/10 (prioritized)
1. Add `EVT_NEWSLETTER_SUBSCRIBED` to `events.ts`; add `trackNewsletterSubscribed()` to `analytics/index.ts`; wire into `newsletter/route.ts` (1h)
2. Add `trackPdfDownloaded(tool, locale)` calls to all three PDF report download handlers (1h)
3. Add `EVT_EXIT_INTENT_SHOWN` and `EVT_EXIT_INTENT_DISMISSED` to `events.ts`; refactor `ExitIntentPopup.tsx` to use standard analytics module (1h)
4. Wire `trackAiToolCrossSellClicked()` to cross-sell CTAs in each AI tool page (1.5h)
5. Add `trackSolutionViewed(slug, locale)` on mount in `solutions/[slug]/page.tsx` (30 min)
6. Add `trackContactFormValidationError()` to contact form error handling (30 min)

### Estimated Effort
5.5 hours

---

## Recommended Fix Priority Order

### Phase 1 — Must Do Before Launch (~40 hours)
| Priority | Task | Hours |
|----------|------|-------|
| P0 | Set up Upstash Redis for production rate limiting | 2h |
| P0 | Create GitHub Actions CI/CD pipeline | 2.5h |
| P0 | Fix Firestore security rules for all collections | 1h |
| P0 | Create Privacy Policy & Terms translation files (EN + AR) | 4h |
| P0 | Add Zod validation + constant-time comparison to `/api/revalidate` | 1.5h |
| P0 | Sanitize `sourceContext` fields before prompt insertion | 45min |
| P0 | Add `notFound()` to solutions & case studies detail pages | 30min |
| P0 | Create validator tests + pricing calculator tests | 5h |
| P0 | Mark blog topics as `'processing'` before Gemini call | 30min |
| P0 | Set up Vercel project + configure preview deployments | 2h |
| P1 | Fix 37 ESLint errors | 30min |
| P1 | Add noindex to AI tool pages | 20min |
| P1 | Add `hreflang="x-default"` | 20min |
| P1 | Add body size limit to AI routes | 45min |
| P1 | Fix Arabic heading font (Cairo for `h1`–`h6` in RTL) | 30min |
| P1 | Add `role="alert"` to form error messages | 1h |
| P1 | Add Sentry error monitoring | 1.5h |
| P1 | Wire PDF download tracking | 1h |
| P1 | Wire newsletter analytics | 1h |

### Phase 2 — First Two Weeks Post-Launch (~50 hours)
- Full SEO schema implementation (BlogPosting, FAQ, Breadcrumb, Service schemas)
- E2E tests with Playwright
- API route integration tests
- RTL PDF audit and fix
- i18n build-time key validation script
- Env variable validation at startup
- Database backup strategy
- Rollback documentation
- Deployment documentation

### Phase 3 — Ongoing (~40 hours)
- Coverage threshold enforcement (70%)
- Component snapshot tests
- CSP nonce implementation
- Accessibility audit with axe DevTools
- Performance tuning based on Lighthouse data
- Content expansion (blog infrastructure, case study images)
