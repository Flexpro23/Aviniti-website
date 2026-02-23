# Production Readiness Audit — Aviniti Website

## Your Role

You are a senior full-stack engineer and technical auditor. Your job is to perform a comprehensive, ruthlessly honest production readiness audit of the Aviniti website codebase. This is a commercial website for an AI & App Development company based in Amman, Jordan, targeting English and Arabic-speaking markets.

**You must read every file listed in each section before scoring it.** Do not score from assumptions. Score based only on what you actually find in the code.

---

## Tech Stack Context

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **i18n:** next-intl v4 — two locales: `en` and `ar` (Arabic/RTL)
- **Backend:** Firebase (Firestore, Cloud Functions Python 3.13, Firebase Storage, Firebase Auth)
- **AI:** Google Gemini API (content generation), Imagen 4.0 Ultra (image generation)
- **Analytics:** Firebase Analytics + Google Analytics (GA4)
- **Deployment target:** Vercel (production)
- **Translation files:** `/messages/en/*.json` and `/messages/ar/*.json`

---

## Output Format

For **every section**, output exactly this structure:

```
## [Section Name]
**Score: X/10**

### What's Working
- Bullet list of things done correctly

### Critical Issues (blocking production launch)
- Bullet list with exact file paths and line numbers where relevant

### Improvements (to reach 10/10)
- Numbered, prioritized action list — most impactful first
- Each item must be specific and actionable, not generic advice
- Include exact file paths to fix, code snippets to add/change where helpful

### Estimated Effort
X-Y hours to reach 10/10
```

End with a **Master Summary** table and an **Overall Score**.

---

## Audit Sections

---

### SECTION 1 — TypeScript & Code Quality

**Files to read:**
- `src/types/api.ts`, `src/types/solutions.ts`, `src/types/blog.ts`, `src/types/forms.ts`, `src/types/common.ts`, `src/types/chatbot.ts`, `src/types/case-studies.ts`, `src/types/global.d.ts`
- `tsconfig.json`
- `src/lib/utils/validators.ts`
- `src/lib/utils/api-helpers.ts`
- `src/lib/utils/rate-limit.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/newsletter/route.ts`
- `src/app/api/ai/analyzer/route.ts`
- `src/app/api/ai/estimate/route.ts`
- `src/app/api/ai/idea-lab/route.ts`
- `src/app/api/ai/roi-calculator/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/exit-intent/route.ts`
- `src/app/api/revalidate/route.ts`

**Evaluate:**
1. Is `strict: true` enabled in tsconfig? Are `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` enabled?
2. Are there any `any` types? Are they justified?
3. Are API route request/response types fully typed end-to-end?
4. Are Zod schemas used consistently for all API input validation?
5. Are there unhandled promise rejections in API routes?
6. Is error handling consistent — do all catch blocks re-throw or return typed error responses?
7. Are there `@ts-ignore` or `@ts-expect-error` comments that shouldn't exist?
8. Is there dead code, unused imports, or unused variables?
9. Are utility functions pure and tested?
10. Are environment variables accessed safely (with fallback handling)?

---

### SECTION 2 — Security

**Files to read:**
- `src/app/api/contact/route.ts`
- `src/app/api/newsletter/route.ts`
- `src/app/api/ai/analyzer/route.ts`
- `src/app/api/ai/estimate/route.ts`
- `src/app/api/ai/idea-lab/route.ts`
- `src/app/api/ai/roi-calculator/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/exit-intent/route.ts`
- `src/app/api/revalidate/route.ts`
- `src/lib/utils/rate-limit.ts`
- `src/lib/utils/api-helpers.ts`
- `src/lib/utils/validators.ts`
- `src/lib/firebase/admin.ts`
- `src/lib/firebase/client.ts`
- `firestore.rules`
- `storage.rules`
- `next.config.ts`
- `src/app/[locale]/layout.tsx`

**Evaluate:**
1. **Rate limiting:** Is it applied to ALL public API routes? Is it per-IP? Is in-memory rate limiting safe on serverless (resets per cold start)?
2. **Input validation:** Is every user-submitted field validated with Zod before processing? Are there length limits on all string inputs?
3. **Prompt injection:** Are AI routes protected against prompt injection — do they sanitize user input before inserting it into Gemini prompts?
4. **Secret exposure:** Are any API keys or secrets visible in client-side code? Check `NEXT_PUBLIC_` variables.
5. **Firestore rules:** Do `firestore.rules` enforce proper read/write restrictions? Is there any `allow read, write: if true` rule in production?
6. **Storage rules:** Does `storage.rules` expose any path beyond `/blog/` for public reads?
7. **CORS:** Are API routes setting appropriate CORS headers? Is there wildcard CORS (`*`) on sensitive routes?
8. **Security headers:** Does `next.config.ts` set `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`?
9. **RevalidateSecret:** Is the `/api/revalidate` endpoint protected with a secret? Is the secret compared using timing-safe comparison?
10. **Gemini/Firebase key exposure:** Are `GEMINI_API_KEY` and Firebase config properly restricted to server-side only?
11. **DoS surface:** Is there a maximum body size limit on AI routes? Are AI routes protected from abuse (model costs)?

---

### SECTION 3 — Performance & Core Web Vitals

**Files to read:**
- `next.config.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/homepage/HeroSection.tsx`
- `src/components/homepage/CompanyLogos.tsx`
- `src/components/homepage/TrustIndicators.tsx`
- `src/components/homepage/ServicesOverview.tsx`
- `src/components/homepage/CaseStudiesPreview.tsx`
- `src/components/homepage/Testimonials.tsx`
- `src/components/homepage/WhyChooseUs.tsx`
- `src/components/homepage/FinalCTA.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/lib/motion/hooks.ts`
- `src/lib/motion/variants.ts`
- `src/lib/motion/tokens.ts`
- `package.json`

**Evaluate:**
1. **Images:** Are all `<img>` tags replaced with Next.js `<Image>` with `width`, `height`, and `priority` set on above-the-fold images? Are solution WebPs lazy-loaded below the fold?
2. **Fonts:** Are fonts loaded with `next/font`? Is `font-display: swap` configured? Is there font preloading for Arabic (`Noto Sans Arabic` or `Cairo`)?
3. **Bundle size:** Are large libraries (Recharts, jsPDF, html2canvas) dynamically imported only on pages that need them? Is Framer Motion tree-shaken?
4. **Animations:** Is `useReducedMotion` respected in all Framer Motion components? Do animations use GPU-accelerated properties only (`transform`, `opacity`)?
5. **Server vs Client components:** Are `'use client'` directives used minimally? Are data-fetching components server components?
6. **Streaming & Suspense:** Are loading states implemented with `<Suspense>`? Is `loading.tsx` implemented?
7. **Third-party scripts:** Is Firebase Analytics deferred until after hydration? Is GA4 loaded with `afterInteractive` strategy?
8. **Route prefetching:** Are key navigation links prefetched?
9. **CSS:** Is there unused CSS? Is Tailwind configured with proper content paths to purge unused classes?
10. **next.config.ts:** Are compression, image optimization domains, and experimental features configured correctly?

---

### SECTION 4 — SEO & Discoverability

**Files to read:**
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx` (home page metadata)
- `src/app/[locale]/about/layout.tsx`
- `src/app/[locale]/blog/layout.tsx`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/app/[locale]/solutions/layout.tsx`
- `src/app/[locale]/solutions/[slug]/page.tsx`
- `src/app/[locale]/case-studies/layout.tsx`
- `src/app/[locale]/case-studies/[slug]/page.tsx`
- `src/app/[locale]/contact/layout.tsx`
- `src/app/[locale]/faq/page.tsx` (check for JSON-LD FAQ schema)
- `src/app/api/og/route.tsx`
- `src/app/manifest.ts`
- `src/components/seo/structured-data.ts`
- `public/llms.txt`
- `public/llms-full.txt`
- `public/.well-known/security.txt`
- `messages/en/meta.json`
- `messages/ar/meta.json`

**Evaluate:**
1. **hreflang tags:** Are `<link rel="alternate" hreflang="en">` and `<link rel="alternate" hreflang="ar">` present on every page, including a `hreflang="x-default"`?
2. **Canonical tags:** Does every page have a `<link rel="canonical">` pointing to the correct locale URL?
3. **Metadata completeness:** Does every page (home, about, blog, solutions, case-studies, contact, faq, AI tools, privacy, terms) have a unique `title`, `description`, and Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)?
4. **Twitter Card:** Are Twitter/X card meta tags present?
5. **Sitemap:** Does `sitemap.ts` include all pages in both locales? Does it include blog post URLs fetched from Firestore? Does it include solutions and case studies?
6. **robots.ts:** Is the robots file correct? Are AI tool pages (`/idea-lab`, `/ai-analyzer`, `/get-estimate`, `/roi-calculator`) set to `noindex` (they are interactive apps, not indexable content)?
7. **Structured data (JSON-LD):** Is `Organization` schema present on the homepage? Is `Article` schema on blog posts? Is `FAQPage` schema on the FAQ page? Is `BreadcrumbList` on inner pages?
8. **OG Image:** Does `/api/og` generate locale-aware images? Does it use the correct brand colors (navy bg, bronze accent)?
9. **Blog SEO:** Do individual blog post pages have per-post metadata (title, description, og:image from `featuredImage`)?
10. **Core domain:** Are all SEO tags using the correct production domain (not localhost)?

---

### SECTION 5 — Internationalization (i18n) & RTL

**Files to read:**
- `src/lib/i18n/config.ts`
- `src/lib/i18n/routing.ts`
- `src/lib/i18n/request.ts`
- `src/lib/i18n/navigation.ts`
- `src/app/[locale]/layout.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/MobileDrawer.tsx`
- `src/components/layout/Footer.tsx`
- `src/app/globals.css`
- `messages/en/home.json`
- `messages/ar/home.json`
- `messages/en/common.json`
- `messages/ar/common.json`
- `messages/en/solutions.json`
- `messages/ar/solutions.json`
- `messages/en/blog.json`
- `messages/ar/blog.json`
- `messages/en/about.json`
- `messages/ar/about.json`
- `messages/en/meta.json`
- `messages/ar/meta.json`
- `messages/en/case-studies.json`
- `messages/ar/case-studies.json`

**Evaluate:**
1. **HTML `dir` and `lang`:** Does `layout.tsx` set `dir="rtl" lang="ar"` for Arabic and `dir="ltr" lang="en"` for English dynamically based on locale param?
2. **Arabic font loading:** Is an Arabic-optimized font (Noto Sans Arabic, Cairo, or Tajawal) loaded via `next/font`? Is it applied to the `<body>` in Arabic locale?
3. **Translation key completeness:** Are the key counts in EN and AR files identical per namespace? Are there any `undefined` or empty string values?
4. **RTL layout correctness:** Do flex/grid components use `gap` and logical properties (not `ml-`, `mr-`, `pl-`, `pr-` hardcoded)? Check Navbar, Footer, and homepage sections.
5. **RTL icons/arrows:** Are directional icons (chevrons, arrows, "back" buttons) mirrored in RTL using `rtl:rotate-180` or `scale-x-[-1]` in RTL?
6. **Language switcher:** Is the language switcher visible, accessible, and working? Does it update the URL path correctly (`/en/` → `/ar/`)?
7. **Hardcoded strings:** Are there any hardcoded English strings in components that should use `useTranslations`? Check: button labels, error messages, aria-labels, placeholder text.
8. **AI tool output language:** Are Gemini prompts in all 4 AI API routes instructed to respond in the same language as the user's input?
9. **Number and date formatting:** Are numbers formatted using `Intl.NumberFormat` with locale? Are dates formatted correctly (MM/DD/YYYY for EN, DD/MM/YYYY for AR)?
10. **Text overflow:** Do Arabic translation strings fit within their containers without clipping? (Arabic is typically 20-30% longer — check for `truncate` or fixed-width containers that might break).

---

### SECTION 6 — Accessibility (a11y)

**Files to read:**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/MobileDrawer.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/homepage/HeroSection.tsx`
- `src/components/features/exit-intent/ExitIntentPopup.tsx`
- `src/app/[locale]/faq/FAQAccordionSection.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/blog/page.tsx`
- `src/app/[locale]/solutions/page.tsx`
- Any form component files in `src/components/ai-tools/ToolForm.tsx`
- `src/app/globals.css`

**Evaluate:**
1. **Semantic HTML:** Are `<main>`, `<header>`, `<nav>`, `<footer>`, `<article>`, `<section>` used correctly? Is there only one `<h1>` per page?
2. **Keyboard navigation:** Can all interactive elements (nav links, buttons, form fields, accordions, modals) be reached and activated by keyboard alone?
3. **Focus management:** Is focus trapped in modals/drawers when open? Is focus returned to trigger element when closed? Does the exit-intent popup trap focus?
4. **ARIA labels:** Do icon-only buttons have `aria-label`? Do images have meaningful `alt` text (not empty or "image")? Do form inputs have associated `<label>` elements?
5. **Color contrast:** Does text meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text) against the navy background?
6. **Skip link:** Is there a "Skip to main content" link as the first focusable element?
7. **Form errors:** Are form validation errors announced to screen readers (`role="alert"` or `aria-live="polite"`)? Are error messages associated with inputs via `aria-describedby`?
8. **Reduced motion:** Is `prefers-reduced-motion` respected — do all Framer Motion animations disable or reduce when the user has this preference set?
9. **Mobile touch targets:** Are all tappable elements at least 44×44px on mobile?
10. **Language attribute:** When Arabic text appears inline within an English page (e.g., brand name), is `lang="ar"` set on that element?

---

### SECTION 7 — Firebase & Backend Architecture

**Files to read:**
- `src/lib/firebase/admin.ts`
- `src/lib/firebase/client.ts`
- `src/lib/firebase/collections.ts`
- `src/lib/firebase/blog.ts`
- `src/lib/firebase/error-logging.ts`
- `src/lib/firebase/index.ts`
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`
- `firebase.json`
- `functions/blog_generator/main.py`
- `functions/blog_generator/requirements.txt`

**Evaluate:**
1. **Admin SDK init:** Is `getAdminDb()` using a singleton pattern to avoid re-initialization across hot-reloads in development?
2. **Client SDK init:** Is the Firebase client SDK guarded with `typeof window !== 'undefined'` and `isSupported()` checks to prevent SSR crashes?
3. **Firestore rules security:** Do `firestore.rules` properly restrict writes to admin-only for `newsletter_subscribers`, `contact_submissions`, `leads`, and `blog_posts` collections? Is there any insecure wildcard rule?
4. **Storage rules:** Does `storage.rules` restrict write access to authenticated (admin) users only? Is public read limited to the `/blog/` path?
5. **Indexes:** Do `firestore.indexes.json` indexes cover all queries used in the codebase? Check `blog.ts` and API routes for all `.where()` + `.orderBy()` combinations.
6. **Cloud Function robustness:** Does `main.py` handle errors gracefully at each step (Gemini API failure, Imagen failure, Firestore write failure, Storage upload failure) with meaningful log output?
7. **Cloud Function secrets:** Are all secrets (`GEMINI_API_KEY`, `STORAGE_BUCKET`, `REVALIDATE_SECRET`, `REVALIDATE_URL`) read with `.strip()` to handle trailing newlines from Firebase Secret Manager?
8. **Blog generation pipeline:** Does the scheduler correctly pick the highest-priority pending topic, mark it as `processing` before starting (to prevent duplicate runs), and mark it `completed` or `failed` after?
9. **Error logging:** Does `error-logging.ts` properly capture and store errors in Firestore without itself throwing?
10. **Cold start performance:** Does lazy initialization in both admin.ts and main.py prevent cold-start timeouts during Firebase CLI analysis?

---

### SECTION 8 — AI Tools (Idea Lab, AI Analyzer, Get Estimate, ROI Calculator)

**Files to read:**
- `src/app/api/ai/idea-lab/route.ts`
- `src/app/api/ai/idea-lab/discover/route.ts`
- `src/app/api/ai/analyzer/route.ts`
- `src/app/api/ai/estimate/route.ts`
- `src/app/api/ai/roi-calculator/route.ts`
- `src/app/api/ai/generate-features/route.ts`
- `src/app/api/ai/analyze-idea/route.ts`
- `src/lib/gemini/client.ts`
- `src/lib/gemini/prompts.ts`
- `src/lib/gemini/prompts/idea-lab.ts`
- `src/lib/gemini/prompts/idea-lab-discover.ts`
- `src/lib/gemini/schemas.ts`
- `src/app/[locale]/idea-lab/page.tsx`
- `src/app/[locale]/ai-analyzer/page.tsx`
- `src/app/[locale]/get-estimate/page.tsx`
- `src/app/[locale]/roi-calculator/page.tsx`

**Evaluate:**
1. **Output language rule:** Do ALL Gemini prompts include an explicit instruction to respond in the same language as the user's input?
2. **Gemini model version:** Are all routes using `gemini-3-flash-preview` (or the latest specified model) consistently? Are there any routes still on `gemini-2.0-flash` or older?
3. **Prompt injection protection:** Is user input sanitized before insertion into prompts? Are there guardrails preventing the model from being redirected by malicious input?
4. **Structured output:** Are Gemini responses parsed with schema validation (not blind JSON.parse)? Is there a fallback if the model returns malformed JSON?
5. **Error UX:** If a Gemini API call fails, does the user see a meaningful error (not a raw 500)? Is there a retry mechanism?
6. **Rate limiting:** Are all AI routes rate-limited per IP? Given AI costs, is the limit strict enough (e.g., max 5 requests/hour per IP)?
7. **Result persistence:** Are AI tool results persisted to localStorage so users don't lose their work on navigation or page refresh? Check `useResultPersistence.ts`.
8. **Cross-tool navigation:** Does the "cross-sell CTA" (e.g., "Now try Get Estimate") correctly pass context from one tool to the next?
9. **PDF generation:** Do all three PDF reports (AnalyzerPDFReport, PDFReport, ROIPDFReport) generate correctly? Are they RTL-aware for Arabic output?
10. **Lead capture:** When a user completes an AI tool, is the lead (email + tool results) correctly saved to Firestore under the right subcollection?

---

### SECTION 9 — UI/UX & Design Consistency

**Files to read:**
- `tailwind.config.ts` (or `tailwind.config.js`)
- `src/app/globals.css`
- `src/components/ui/Section.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/homepage/HeroSection.tsx`
- `src/components/homepage/ServicesOverview.tsx`
- `src/components/homepage/Testimonials.tsx`
- `src/components/homepage/WhyChooseUs.tsx`
- `src/components/homepage/FinalCTA.tsx`
- `src/components/features/exit-intent/ExitIntentPopup.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/solutions/page.tsx`
- `src/app/[locale]/blog/page.tsx`

**Evaluate:**
1. **Design token consistency:** Are colors, spacing, and typography values defined as Tailwind theme tokens — or are raw hex values (`#0A1628`) scattered through components?
2. **Component reusability:** Are shared UI elements (buttons, cards, badges, inputs) abstracted into reusable components in `/src/components/ui/`? Or is styling duplicated across pages?
3. **Mobile responsiveness:** Do all pages render correctly on 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), and 1280px+ screens? Check Navbar collapse, hero layout, card grids.
4. **Dark mode consistency:** Is the dark navy theme consistent across all pages — no white/light backgrounds appearing unexpectedly?
5. **Loading states:** Do all async operations (form submit, AI tool processing, blog fetch) show meaningful loading states — not blank screens or frozen UI?
6. **Empty states:** Do pages that fetch data (blog list, case studies list) have proper empty states when no data is returned?
7. **Animation coherence:** Is animation timing and easing consistent across sections? Are there jarring animation conflicts?
8. **Form UX:** Do contact and newsletter forms show inline validation, success confirmation, and prevent double-submission?
9. **Exit intent popup:** Is the exit-intent popup triggered at the right time (not on first load, not repeatedly)? Is it dismissible and does it respect the dismissal state across sessions?
10. **404 & error pages:** Does `not-found.tsx` and `error.tsx` have branded designs with navigation — not blank white pages?

---

### SECTION 10 — Error Handling & Resilience

**Files to read:**
- `src/app/[locale]/error.tsx`
- `src/app/[locale]/not-found.tsx`
- `src/app/[locale]/loading.tsx`
- `src/lib/utils/client-error-logger.ts`
- `src/lib/firebase/error-logging.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/ai/analyzer/route.ts`
- `src/components/blog/BlogGrid.tsx`
- `src/lib/firebase/blog.ts`
- `src/app/[locale]/blog/[slug]/page.tsx`
- `src/app/[locale]/solutions/[slug]/page.tsx`
- `src/app/[locale]/case-studies/[slug]/page.tsx`

**Evaluate:**
1. **Error boundaries:** Is `error.tsx` present at the `[locale]` level? Does it have a bilingual error message and a "Try again" button?
2. **Not-found pages:** Does `not-found.tsx` catch 404s for dynamic routes (e.g., invalid blog slug, invalid solution slug)? Does `generateStaticParams` or `notFound()` handle missing slugs?
3. **API error format:** Are all API routes returning a consistent error response shape `{ success: false, error: { code, message } }`?
4. **Client error logging:** Is there a global `window.onerror` or React ErrorBoundary that logs client-side errors to Firestore/Firebase?
5. **Firebase fetch errors:** If Firestore is unreachable, do blog/case-studies pages degrade gracefully (show empty state) rather than crashing?
6. **AI tool timeouts:** Are AI API routes protected with a request timeout (e.g., 30s abort signal)? If Gemini takes too long, does the user see a timeout message?
7. **Fallback content:** If the blog has no posts yet, does the blog listing page show a friendly empty state rather than an error?
8. **Form submission errors:** Do forms distinguish between network errors, validation errors, and rate limit errors — showing different messages to the user?
9. **Server Component errors:** Are `async` Server Components wrapped in try/catch with proper fallback rendering?
10. **Logging completeness:** Are all caught errors in API routes passed to `logServerError` with enough context (route name, input summary) to diagnose in production?

---

### SECTION 11 — Testing

**Files to read:**
- `package.json` (test scripts, test dependencies)
- `src/lib/utils/__tests__/api-helpers.test.ts`
- `src/lib/utils/__tests__/rate-limit.test.ts`
- `src/test/setup.ts`
- Any other test files found in the codebase

**Evaluate:**
1. **Test coverage breadth:** What percentage of critical paths are covered? Check: API route handlers, Zod validators, rate limiter, pricing calculator, i18n formatters.
2. **Unit tests:** Are the two existing test files (`api-helpers.test.ts`, `rate-limit.test.ts`) complete and passing? Do they cover edge cases (empty input, max length, invalid types)?
3. **Integration tests:** Are there any API route integration tests (using `next-test-api-route-handler` or similar)?
4. **E2E tests:** Is there any Playwright or Cypress setup for critical user flows (contact form submission, AI tool completion, language switching)?
5. **CI integration:** Is there a GitHub Actions workflow that runs tests on every push/PR?
6. **Test configuration:** Is `src/test/setup.ts` properly configured for the testing framework (Vitest/Jest)? Are Firebase mocks set up?
7. **Validator tests:** Is `validators.ts` (email schema, phone schema, etc.) fully tested with valid and invalid inputs?
8. **Calculator tests:** Is `src/lib/pricing/calculator.ts` tested with various input combinations?
9. **Snapshot tests:** Are there any component snapshot tests for key UI components?
10. **Coverage threshold:** Is a minimum coverage threshold configured (e.g., 80%)?

---

### SECTION 12 — DevOps & Deployment Readiness

**Files to read:**
- `next.config.ts`
- `package.json`
- `firebase.json`
- `firestore.rules`
- `storage.rules`
- `.gitignore`
- Any `.github/workflows/` files if they exist
- `public/llms.txt`
- `src/app/robots.ts`

**Evaluate:**
1. **Environment variables:** Are all required env vars documented? Is there a `.env.example` file listing all required variables (without values)?
2. **Build process:** Does `npm run build` complete with zero TypeScript errors and zero warnings?
3. **CI/CD:** Is there a GitHub Actions (or equivalent) pipeline that: runs type-check → runs tests → runs build → deploys to Vercel on push to `main`?
4. **Preview deployments:** Is Vercel configured to create preview deployments for every PR?
5. **Firebase deployment:** Is `firebase deploy --only firestore:rules,firestore:indexes,storage` part of the deployment process?
6. **Cloud Function deployment:** Is `firebase deploy --only functions:blog-generator` scripted and documented?
7. **Monitoring & alerting:** Is there an error monitoring solution (Sentry, Firebase Crashlytics, or similar) connected? Are there alerts for high error rates or Cloud Function failures?
8. **Secrets management:** Are all production secrets stored in Vercel environment variables (not in `.env.local`)? Are Firebase secrets set via Firebase Secret Manager?
9. **Rollback strategy:** Is there a documented rollback procedure if a bad deployment goes live?
10. **Domain & SSL:** Is the production domain configured in Vercel? Is SSL auto-renewed? Are `www` and non-`www` redirects configured?

---

### SECTION 13 — Content Completeness

**Files to read:**
- `src/lib/data/solutions.ts`
- `src/lib/data/case-studies.ts`
- `src/lib/data/faq.ts`
- `src/lib/data/services.ts`
- `src/lib/data/apps.ts`
- `src/lib/data/navigation.ts`
- `messages/en/home.json`
- `messages/ar/home.json`
- `messages/en/solutions.json`
- `messages/ar/solutions.json`
- `messages/en/about.json`
- `messages/ar/about.json`
- `src/app/[locale]/privacy-policy/page.tsx`
- `src/app/[locale]/terms-of-service/page.tsx`
- `src/app/[locale]/about/page.tsx`

**Evaluate:**
1. **Solutions completeness:** Are all 8 solutions (Delivery App, Kindergarten, Hypermarket, Office Mgmt, Gym Mgmt, Airbnb Marketplace, Hair Transplant AI, Barbershop) fully described in `solutions.ts` with correct pricing, timelines, features, and hero images?
2. **Case studies:** Are all case study entries in `case-studies.ts` complete with real content (not placeholder Lorem Ipsum)?
3. **FAQ page:** Is the FAQ content complete and comprehensive? Does it cover pricing, process, technology, and support questions?
4. **About page:** Does the About page have real company content (mission, team, values) — not placeholder text?
5. **Privacy Policy & Terms:** Are these pages complete, legally adequate, and bilingual? Do they mention data collection practices (Firestore, Analytics, AI inputs)?
6. **Navigation completeness:** Does the navigation include all major pages? Are there any broken or missing routes?
7. **Blog backlog:** Are there 40+ topics in the `blog_topic_backlog` Firestore collection ready for the daily generator?
8. **Images:** Do all solution pages have hero images? Are case study images present and correctly referenced?
9. **Contact information:** Is real contact information (email, WhatsApp, address) present in the Footer and Contact page — not placeholder values?
10. **Placeholder content:** Is there any "Lorem Ipsum", "Coming Soon", "TBD", or placeholder text remaining anywhere in the codebase?

---

### SECTION 14 — Analytics & Conversion Tracking

**Files to read:**
- `src/lib/analytics/index.ts`
- `src/lib/analytics/events.ts`
- `src/lib/firebase/client.ts`
- `src/components/analytics/AnalyticsProvider.tsx`
- `src/components/analytics/PageViewTracker.tsx`
- `src/app/[locale]/layout.tsx`
- `src/components/homepage/HeroSection.tsx`
- `src/components/homepage/FinalCTA.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/idea-lab/page.tsx`
- `src/app/[locale]/ai-analyzer/page.tsx`
- `src/app/[locale]/get-estimate/page.tsx`
- `src/app/[locale]/roi-calculator/page.tsx`

**Evaluate:**
1. **Page view tracking:** Is every route change tracked as a page view event?
2. **AI tool funnel:** Are all AI tool events tracked: `ai_tool_started` → `ai_tool_submitted` → `ai_tool_completed` / `ai_tool_error`?
3. **CTA tracking:** Are all CTA clicks tracked with `cta_clicked` events including `cta_id`, `page`, and `locale` parameters?
4. **Contact form funnel:** Is the full contact form funnel tracked: `contact_capture_started` → `contact_capture_submitted`?
5. **PDF downloads:** Are PDF download events tracked for all three AI tool PDF reports?
6. **Language changes:** Are language switch events tracked with `from` and `to` locale?
7. **Newsletter:** Are newsletter subscription events tracked (success and already-subscribed)?
8. **Exit intent:** Are exit intent popup views and interactions tracked?
9. **SSR safety:** Is all analytics code properly guarded so it never runs during SSR? Does it use `typeof window !== 'undefined'` checks?
10. **GA4 configuration:** Is the GA4 Measurement ID correct? Are custom events configured in the GA4 dashboard to match the event names used in code?

---

## Master Summary Table

After completing all 14 sections, output this table:

| # | Section | Score | Critical Issues | Est. Hours to 10/10 |
|---|---------|-------|-----------------|---------------------|
| 1 | TypeScript & Code Quality | X/10 | N | Xh |
| 2 | Security | X/10 | N | Xh |
| 3 | Performance & Core Web Vitals | X/10 | N | Xh |
| 4 | SEO & Discoverability | X/10 | N | Xh |
| 5 | Internationalization & RTL | X/10 | N | Xh |
| 6 | Accessibility | X/10 | N | Xh |
| 7 | Firebase & Backend Architecture | X/10 | N | Xh |
| 8 | AI Tools | X/10 | N | Xh |
| 9 | UI/UX & Design Consistency | X/10 | N | Xh |
| 10 | Error Handling & Resilience | X/10 | N | Xh |
| 11 | Testing | X/10 | N | Xh |
| 12 | DevOps & Deployment Readiness | X/10 | N | Xh |
| 13 | Content Completeness | X/10 | N | Xh |
| 14 | Analytics & Conversion Tracking | X/10 | N | Xh |
| | **OVERALL** | **X/10** | **N total** | **Xh total** |

---

## Overall Assessment

After the table, write:
1. **Top 5 Critical Blockers** — things that MUST be fixed before going live (security holes, broken pages, missing legal content, etc.)
2. **Quick Wins** — improvements that take under 2 hours each and have high impact
3. **Launch Readiness Verdict** — one of:
   - `READY` — can go live today
   - `READY WITH CAVEATS` — can go live with minor issues to fix post-launch
   - `NOT READY` — must fix critical blockers first, with a list of what those are

---

## Audit Rules

- **Read files, don't assume.** Every score must be justified by what you actually found in the code.
- **Be ruthlessly honest.** A 7/10 that is accurate is more useful than a 9/10 that is flattering.
- **Specificity is mandatory.** Never say "improve error handling" — say "in `src/app/api/ai/analyzer/route.ts` line 84, the catch block swallows the error without logging it; add `logServerError('analyzer', 'Gemini call failed', error)`."
- **Consider the business context.** This is a commercial website for an AI company trying to win enterprise clients in Jordan. Content gaps, broken Arabic, and missing legal pages are as critical as TypeScript errors.
- **Cross-reference.** If a translation key is defined in EN but missing in AR, flag it. If an API route has no rate limit while another does, flag it. Inconsistency is a bug.
