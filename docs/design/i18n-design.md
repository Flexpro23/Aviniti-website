# Aviniti Website -- Internationalization and RTL Design Specification

**Version:** 1.0
**Date:** February 2026
**Author:** i18n Architecture
**Status:** Design
**Applies to:** Next.js App Router rebuild (TypeScript + Tailwind CSS)

---

## Table of Contents

1. [URL Strategy and Language Routing](#1-url-strategy-and-language-routing)
2. [Next.js i18n Architecture](#2-nextjs-i18n-architecture)
3. [Translation System](#3-translation-system)
4. [RTL Layout Design Rules](#4-rtl-layout-design-rules)
5. [Tailwind CSS RTL Strategy](#5-tailwind-css-rtl-strategy)
6. [Component-Level i18n Patterns](#6-component-level-i18n-patterns)
7. [Testing Strategy](#7-testing-strategy)
8. [Performance Considerations](#8-performance-considerations)

---

## 1. URL Strategy and Language Routing

### 1.1 Recommended Approach: Path Prefix (`/en/`, `/ar/`)

**Decision:** Use path-prefixed URLs with English as the default language.

```
https://aviniti.com/en/get-estimate       (English)
https://aviniti.com/ar/get-estimate       (Arabic)
https://aviniti.com/                       (redirects to /en/ or /ar/ based on detection)
```

### 1.2 Why Path Prefix Over Alternatives

| Approach | SEO | Implementation | UX | Verdict |
|----------|-----|----------------|-----|---------|
| **Path prefix** (`/en/`, `/ar/`) | Excellent -- single domain authority, separate crawlable paths | Native to Next.js App Router via route groups | Clean, shareable URLs | **Recommended** |
| Subdomain (`en.aviniti.com`, `ar.aviniti.com`) | Splits domain authority, requires separate DNS and SSL | More DevOps overhead, separate deployments or reverse proxy | Looks professional but harder to share | Not recommended |
| Query param (`?lang=ar`) | Poor -- Google discourages for language variants | Simple but fragile | Ugly URLs, easy to lose param | Rejected |
| Cookie/header only | Zero SEO benefit -- search engines cannot detect language | Simplest but invisible to crawlers | No shareable language-specific URLs | Rejected |

### 1.3 Default Language Handling

The root URL (`/`) serves no content directly. It redirects to the appropriate language prefix based on the following detection priority:

```
1. Saved preference (cookie: `NEXT_LOCALE=ar`)
2. Browser Accept-Language header (navigator.language or Accept-Language)
3. IP-based geo hint (Vercel Geo headers or Cloudflare, secondary signal only)
4. Fallback to English (/en/)
```

**Implementation rule:** The redirect from `/` to `/en/` or `/ar/` happens in Next.js middleware as a 307 temporary redirect (not 301). This preserves the ability for users to change their preference without cached permanent redirects causing issues.

### 1.4 SEO Requirements

Every page must include hreflang tags in the `<head>`:

```html
<link rel="alternate" hreflang="en" href="https://aviniti.com/en/get-estimate" />
<link rel="alternate" hreflang="ar" href="https://aviniti.com/ar/get-estimate" />
<link rel="alternate" hreflang="x-default" href="https://aviniti.com/en/get-estimate" />
```

Additional SEO rules:
- Each language version gets its own entry in `sitemap.xml` (or separate sitemaps: `sitemap-en.xml`, `sitemap-ar.xml`).
- Meta descriptions must be translated, not duplicated in English.
- Open Graph tags (`og:title`, `og:description`) must match the page language.
- The `<html>` tag must set both `lang` and `dir` attributes: `<html lang="ar" dir="rtl">` or `<html lang="en" dir="ltr">`.
- Canonical URLs must point to the same-language version, not cross-language.

### 1.5 Slug Localization

**Decision:** Keep URL slugs in English for both languages. Do not translate slugs to Arabic.

Rationale:
- Arabic slugs require percent-encoding in URLs, which produces unreadable strings in many contexts.
- Maintaining parallel slug mappings adds complexity with negligible SEO benefit for a bilingual corporate site.
- Users in the MENA region are accustomed to English-slug URLs with Arabic content.

```
/en/get-estimate     (English content)
/ar/get-estimate     (Arabic content, same slug)
/en/idea-lab         (English content)
/ar/idea-lab         (Arabic content, same slug)
```

---

## 2. Next.js i18n Architecture

### 2.1 App Router Strategy: Route Groups with `[locale]` Segment

Use the Next.js App Router with a dynamic `[locale]` route segment. This is the recommended pattern for Next.js 14+ with the App Router.

```
src/
  app/
    [locale]/
      layout.tsx            # Root layout -- sets dir, lang, fonts
      page.tsx              # Homepage
      get-estimate/
        page.tsx
      idea-lab/
        page.tsx
      idea-analyzer/
        page.tsx
      roi-calculator/
        page.tsx
      solutions/
        page.tsx
        [slug]/
          page.tsx
      case-studies/
        page.tsx
        [slug]/
          page.tsx
      blog/
        page.tsx
        [slug]/
          page.tsx
      faq/
        page.tsx
      contact/
        page.tsx
      privacy/
        page.tsx
      terms/
        page.tsx
    not-found.tsx
  middleware.ts               # Locale detection and redirect
```

### 2.2 Middleware: Locale Detection and Redirect

The middleware runs on every request. Its responsibilities:

1. If the URL has no locale prefix, detect the user's preferred language and redirect.
2. If the URL has an invalid locale prefix, redirect to the default.
3. Set the `NEXT_LOCALE` cookie when the user explicitly switches languages.

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar'] as const;
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a valid locale
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Valid locale found -- continue
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // No locale in URL -- detect and redirect
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const browserLocale = request.headers
    .get('accept-language')
    ?.split(',')[0]
    ?.split('-')[0];

  const detectedLocale =
    (savedLocale && SUPPORTED_LOCALES.includes(savedLocale as any)
      ? savedLocale
      : undefined) ??
    (browserLocale && SUPPORTED_LOCALES.includes(browserLocale as any)
      ? browserLocale
      : undefined) ??
    DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap).*)'],
};
```

### 2.3 Root Layout: Setting `lang` and `dir`

```typescript
// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';

const SUPPORTED_LOCALES = ['en', 'ar'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={dir === 'rtl' ? 'font-arabic' : 'font-sans'}>
        <TranslationProvider locale={locale as Locale}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
```

### 2.4 Translation File Structure

```
src/
  locales/
    en/
      common.json          # Shared: nav, footer, buttons, labels
      home.json            # Homepage sections
      estimate.json        # Get AI Estimate flow
      idea-lab.json        # Idea Lab flow
      idea-analyzer.json   # AI Idea Analyzer flow
      roi-calculator.json  # ROI Calculator flow
      solutions.json       # Ready-Made Solutions
      case-studies.json    # Case Studies
      blog.json            # Blog
      faq.json             # FAQ
      contact.json         # Contact page
      chatbot.json         # Vanity Assistant messages
      errors.json          # Validation and error messages
      meta.json            # SEO meta titles and descriptions
    ar/
      common.json
      home.json
      estimate.json
      idea-lab.json
      idea-analyzer.json
      roi-calculator.json
      solutions.json
      case-studies.json
      blog.json
      faq.json
      contact.json
      chatbot.json
      errors.json
      meta.json
```

### 2.5 Server Components vs Client Components

**Server Components (preferred for most pages):**
- Load translation files at build/request time using a simple `import` or `fs.readFile`.
- Pass translated strings as props or render them directly.
- Zero client-side JS for translations -- best for performance.

```typescript
// src/lib/i18n/server.ts
import type { Locale, Namespace } from './types';

const translationCache = new Map<string, Record<string, string>>();

export async function getTranslations(locale: Locale, namespace: Namespace) {
  const cacheKey = `${locale}:${namespace}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  // Dynamic import for code splitting by locale and namespace
  const translations = (await import(`@/locales/${locale}/${namespace}.json`)).default;
  translationCache.set(cacheKey, translations);
  return translations;
}

export function createTranslator(translations: Record<string, string>) {
  return function t(key: string, params?: Record<string, string | number>): string {
    let value = translations[key];

    if (!value) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
    }

    return value;
  };
}
```

Usage in a Server Component:

```typescript
// src/app/[locale]/page.tsx
import { getTranslations, createTranslator } from '@/lib/i18n/server';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const commonT = createTranslator(await getTranslations(locale as Locale, 'common'));
  const homeT = createTranslator(await getTranslations(locale as Locale, 'home'));

  return (
    <main>
      <h1>{homeT('hero.title')}</h1>
      <p>{homeT('hero.subtitle')}</p>
      <button>{commonT('buttons.getEstimate')}</button>
    </main>
  );
}
```

**Client Components (interactive elements only):**
- For components that need language switching without a page reload (language switcher, chatbot, forms with dynamic validation messages).
- Use a React context provider that holds the current locale and translation function.

```typescript
// src/lib/i18n/client.tsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Locale, Namespace } from './types';

interface TranslationContextValue {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  switchLocale: (newLocale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within TranslationProvider');
  return ctx;
}
```

**Rule of thumb:** Default to Server Components for all page-level content. Only reach for Client Components when the component must react to user interaction (language switch, form validation, chatbot conversation).

### 2.6 Static vs Dynamic Content

| Content Type | Strategy | Example |
|-------------|----------|---------|
| **UI labels, buttons, headings** | Static JSON translation files | "Get AI Estimate", "Book a Call" |
| **SEO meta tags** | Static JSON in `meta.json`, loaded in `generateMetadata` | Page titles, descriptions |
| **Blog posts** | CMS with separate content fields per language, or markdown files per locale | Blog article body |
| **Case studies** | CMS or MDX files with `[locale]` variants | Case study narrative |
| **FAQ content** | Static JSON (questions and answers are relatively fixed) | FAQ accordion items |
| **AI-generated results** | Generate in user's language by passing `locale` to Gemini prompt | Idea Lab results, estimates |
| **Chatbot messages** | Static greetings from JSON; dynamic responses generated in user's locale via Gemini | Vanity Assistant |
| **WhatsApp pre-filled text** | Static JSON per language | "Hi! I'm interested in..." |
| **Error messages** | Static JSON in `errors.json` | Form validation, API errors |
| **Email templates** | Separate templates per language, selected by user's locale at send time | Estimate delivery email |

For AI-generated content (Idea Lab results, Analyzer output, ROI report), always pass the locale in the system prompt:

```typescript
const systemPrompt = locale === 'ar'
  ? 'You are an AI assistant. Respond entirely in Arabic. Use formal Modern Standard Arabic.'
  : 'You are an AI assistant. Respond entirely in English.';
```

---

## 3. Translation System

### 3.1 File Format: Flat JSON

**Decision:** Use flat JSON files with dot-notation keys (not deeply nested objects).

Rationale:
- Flat keys are easier to search, grep, and reference in code.
- No ambiguity about nesting depth.
- Compatible with every translation management tool.
- TypeScript autocompletion can be generated from flat key lists.
- The old codebase had 620+ keys. Flat JSON handles thousands of keys without issue.

```json
// src/locales/en/home.json
{
  "hero.title": "Transform Your Ideas Into Intelligent Apps",
  "hero.subtitle": "AI-powered development for businesses ready to grow",
  "hero.cta.primary": "Get Instant AI Estimate",
  "hero.cta.secondary": "Ready-Made Solutions",
  "hero.cta.contact": "Contact Us",

  "trust.apps_delivered": "Apps Delivered",
  "trust.countries_served": "Countries Served",
  "trust.client_satisfaction": "Client Satisfaction",
  "trust.badge.ssl": "SSL Secured",
  "trust.badge.gdpr": "GDPR Compliant",
  "trust.badge.nda": "NDA Available",

  "services.title": "What We Build",
  "services.ai.title": "AI Solutions",
  "services.ai.description": "Intelligent apps that learn and adapt",
  "services.mobile.title": "Mobile Apps",
  "services.mobile.description": "Native & cross-platform for iOS and Android",
  "services.web.title": "Web Development",
  "services.web.description": "Scalable platforms and web applications",
  "services.cloud.title": "Cloud Solutions",
  "services.cloud.description": "Infrastructure that grows with you"
}
```

```json
// src/locales/ar/home.json
{
  "hero.title": "حوّل أفكارك إلى تطبيقات ذكية",
  "hero.subtitle": "تطوير مدعوم بالذكاء الاصطناعي للشركات المستعدة للنمو",
  "hero.cta.primary": "احصل على تقدير فوري بالذكاء الاصطناعي",
  "hero.cta.secondary": "الحلول الجاهزة",
  "hero.cta.contact": "تواصل معنا",

  "trust.apps_delivered": "تطبيقات مُنجزة",
  "trust.countries_served": "دول نخدمها",
  "trust.client_satisfaction": "رضا العملاء",
  "trust.badge.ssl": "محمي بـ SSL",
  "trust.badge.gdpr": "متوافق مع GDPR",
  "trust.badge.nda": "اتفاقية سرية متاحة",

  "services.title": "ماذا نبني",
  "services.ai.title": "حلول الذكاء الاصطناعي",
  "services.ai.description": "تطبيقات ذكية تتعلم وتتكيف",
  "services.mobile.title": "تطبيقات الجوال",
  "services.mobile.description": "تطبيقات أصلية ومتعددة المنصات لـ iOS و Android",
  "services.web.title": "تطوير الويب",
  "services.web.description": "منصات وتطبيقات ويب قابلة للتوسع",
  "services.cloud.title": "حلول سحابية",
  "services.cloud.description": "بنية تحتية تنمو معك"
}
```

### 3.2 Namespace Organization

Namespaces map to the files in `src/locales/{locale}/`. Each page or major feature gets its own namespace to enable lazy loading.

| Namespace | Contains | Loaded On |
|-----------|----------|-----------|
| `common` | Nav, footer, buttons, generic labels, language names | Every page |
| `home` | All homepage section content | `/` only |
| `estimate` | Get AI Estimate multi-step form | `/get-estimate` |
| `idea-lab` | Idea Lab flow | `/idea-lab` |
| `idea-analyzer` | AI Idea Analyzer flow | `/idea-analyzer` |
| `roi-calculator` | ROI Calculator flow | `/roi-calculator` |
| `solutions` | Solutions catalog and detail pages | `/solutions/*` |
| `case-studies` | Case studies index and detail pages | `/case-studies/*` |
| `blog` | Blog index and post pages | `/blog/*` |
| `faq` | FAQ questions and answers | `/faq` |
| `contact` | Contact page, form labels | `/contact` |
| `chatbot` | Vanity Assistant greetings, quick replies, prompts | Global (lazy loaded) |
| `errors` | Validation messages, API errors, 404 content | On demand |
| `meta` | SEO titles, descriptions, OG content | Per page in `generateMetadata` |

### 3.3 Key Naming Conventions

Format: `{section}.{subsection}.{element}`

Rules:
- Use lowercase with dots as separators.
- First segment is the section or feature area.
- Last segment describes the element type when useful (`title`, `description`, `label`, `placeholder`, `cta`, `error`).
- For lists of items, use indexed keys or descriptive sub-keys (not arrays).

```
nav.home                          # Navigation link
nav.getEstimate                   # Navigation link
nav.languageSwitcher.label        # "Language" label

hero.title                        # Main headline
hero.subtitle                     # Sub-headline
hero.cta.primary                  # Primary button text
hero.cta.secondary                # Secondary button text

form.email.label                  # "Email" label
form.email.placeholder            # "Enter your email"
form.email.error.required         # "Email is required"
form.email.error.invalid          # "Please enter a valid email"

estimate.step1.title              # Step heading
estimate.step1.projectType.label  # "What type of project?"
estimate.step1.projectType.mobile # "Mobile App"
estimate.step1.projectType.web    # "Web Application"
```

### 3.4 Pluralization

Arabic has six plural forms: zero, one, two, few (3-10), many (11-99), and other (100+). This is the most complex plural system of any major language.

Use ICU MessageFormat syntax for plurals:

```json
// src/locales/en/common.json
{
  "items.count": "{count, plural, =0 {No items} one {1 item} other {# items}}"
}

// src/locales/ar/common.json
{
  "items.count": "{count, plural, =0 {لا توجد عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}"
}
```

Alternatively, if using a simpler translation function without ICU parsing, use suffixed keys:

```json
// src/locales/ar/common.json
{
  "items.count.zero": "لا توجد عناصر",
  "items.count.one": "عنصر واحد",
  "items.count.two": "عنصران",
  "items.count.few": "{{count}} عناصر",
  "items.count.many": "{{count}} عنصرًا",
  "items.count.other": "{{count}} عنصر"
}
```

The plural category is determined by the `Intl.PluralRules` API:

```typescript
function getPluralKey(locale: string, count: number): string {
  if (count === 0) return 'zero';
  const rules = new Intl.PluralRules(locale);
  return rules.select(count); // Returns: 'one' | 'two' | 'few' | 'many' | 'other'
}
```

### 3.5 Interpolation

Use double-brace syntax `{{variable}}` for variable substitution:

```json
{
  "welcome.message": "Welcome, {{name}}!",
  "estimate.range": "Estimated cost: {{min}} - {{max}}",
  "estimate.timeline": "Delivery in {{weeks}} weeks"
}
```

```json
{
  "welcome.message": "أهلاً، {{name}}!",
  "estimate.range": "التكلفة المقدّرة: {{min}} - {{max}}",
  "estimate.timeline": "التسليم خلال {{weeks}} أسابيع"
}
```

**Critical rule:** Never concatenate translated strings. The grammar is different between languages.

```typescript
// WRONG -- breaks Arabic grammar
t('greeting') + ' ' + userName + ', ' + t('welcomeBack')

// CORRECT -- single key with interpolation
t('welcome.returning', { name: userName })
```

### 3.6 Number, Date, and Currency Formatting

Use the `Intl` API exclusively. Never manually format numbers, dates, or currencies.

```typescript
// src/lib/i18n/formatters.ts

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(
  value: number,
  locale: string,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date);
}

export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
  }).format(value / 100);
}
```

**Currency display by market:**

| Market | Primary Currency | Code | Example (en) | Example (ar) |
|--------|-----------------|------|--------------|--------------|
| Jordan | Jordanian Dinar | JOD | JOD 8,000 | ٨٬٠٠٠ د.أ. |
| UAE | UAE Dirham | AED | AED 30,000 | ٣٠٬٠٠٠ د.إ. |
| Saudi Arabia | Saudi Riyal | SAR | SAR 30,000 | ٣٠٬٠٠٠ ر.س. |
| Global | US Dollar | USD | $8,000 | ٨٬٠٠٠ US$ |

**Arabic numeral handling:**

The `Intl.NumberFormat` API with locale `ar` automatically uses Eastern Arabic numerals (0123456789 becomes ٠١٢٣٤٥٦٧٨٩). This is correct for formal Arabic text. However, many MENA users are familiar with Western numerals in digital contexts. The recommendation is:

- Use `ar` locale for `Intl.NumberFormat` (Eastern Arabic numerals) in body text.
- For phone numbers, code snippets, and technical fields, use `ar-u-nu-latn` to force Western numerals:

```typescript
// Eastern Arabic numerals (default for Arabic locale)
new Intl.NumberFormat('ar').format(8000)           // "٨٬٠٠٠"

// Western numerals forced in Arabic context
new Intl.NumberFormat('ar-u-nu-latn').format(8000) // "8,000"
```

**Decision for Aviniti:** Use Western Arabic numerals (`ar-u-nu-latn`) across the site for consistency, since the target audience (tech-savvy SMB decision-makers) is accustomed to Western numerals in digital products. This can be revisited based on user feedback.

### 3.7 Translation Workflow

**Phase 1 (Launch):**
1. Developer writes English keys in JSON files.
2. Ali Odat (owner) provides or reviews Arabic translations.
3. Professional Arabic translator reviews all customer-facing text for quality.
4. Translation files are committed to the repository alongside code.

**Phase 2 (Scale):**
- Integrate with Crowdin or Lokalise for translation management.
- Translators work in a web UI with context screenshots.
- CI pipeline checks for missing keys on every pull request.

**Translation rules for Arabic:**
- Use Modern Standard Arabic (MSA / Fusha), not a Jordanian dialect.
- Maintain formal but approachable tone (matching the English brand voice).
- Create a glossary for consistent terminology (e.g., always translate "estimate" as "تقدير", "AI" as "الذكاء الاصطناعي").
- Keep brand names in English even within Arabic text: "Aviniti", "SkinVerse", "Caliber OS".
- The tagline "Your Ideas, Our Reality" has an Arabic equivalent that must be approved by the owner, not machine-translated.

---

## 4. RTL Layout Design Rules

This section defines precise rules for every layout element when the site switches from LTR (English) to RTL (Arabic). The guiding principle is: **the entire horizontal axis mirrors**, except where cultural convention dictates otherwise.

### 4.1 Navigation

| Element | LTR (English) | RTL (Arabic) | Rule |
|---------|---------------|--------------|------|
| Logo | Top-left | Top-right | Mirrors with document flow. Logo itself does NOT flip. |
| Menu items | Left-to-right order (Home, Estimate, FAQ...) | Right-to-left order (same logical order, reversed visually) | Automatic with `flex` in RTL. |
| Language switcher | Right side of nav bar | Left side of nav bar | Mirrors. |
| Hamburger icon (mobile) | Top-right | Top-left | Mirrors. |
| Mobile drawer | Slides in from left | Slides in from right | Mirror slide direction. |
| Active link indicator | Bottom border or underline -- position is language-neutral | Same | No change needed. |

Implementation:

```tsx
<nav className="flex items-center justify-between">
  {/* Logo -- always start side */}
  <Link href={`/${locale}`} className="flex items-center gap-2">
    <AvinitiLogo /> {/* Logo image does NOT flip */}
  </Link>

  {/* Nav links -- order mirrors automatically in RTL with flex */}
  <ul className="flex items-center gap-6">
    <li><Link href={`/${locale}`}>{t('nav.home')}</Link></li>
    <li><Link href={`/${locale}/get-estimate`}>{t('nav.getEstimate')}</Link></li>
    {/* ... */}
  </ul>

  {/* Language switcher -- always end side */}
  <LanguageSwitcher locale={locale} />
</nav>
```

### 4.2 Text Alignment

| Element | LTR | RTL | Rule |
|---------|-----|-----|------|
| Headlines | Left-aligned | Right-aligned | Use `text-start` (not `text-left`). |
| Body text / paragraphs | Left-aligned | Right-aligned | Use `text-start`. |
| Centered text (hero, CTAs) | Center | Center | `text-center` is bidirectional-safe. |
| Form labels | Left of/above input | Right of/above input | Use `text-start`. |
| Button text | Center | Center | No change. |
| List items | Left-aligned with left bullet | Right-aligned with right bullet | Automatic with `list-inside` or logical properties. |
| Code snippets / technical | Left-aligned always | Left-aligned always | Use `dir="ltr"` on code blocks. |

**Critical Tailwind rule:** Never use `text-left` or `text-right` for content alignment. Always use `text-start` and `text-end`, which are direction-aware.

### 4.3 Icons

**Icons that MUST mirror in RTL:**

These icons convey direction and must match reading flow:

- Arrow right / Arrow left (swap)
- Chevron right / Chevron left (swap for "next/back")
- External link arrows
- "Back" / "Forward" navigation arrows
- Progress indicators (step 1 -> 2 -> 3 flows right-to-left in RTL)
- Breadcrumb separators (> becomes <)
- Slide/carousel arrows
- List bullet alignment
- Text indent icons

**Icons that must NOT mirror in RTL:**

- Checkmarks and X marks
- Plus and minus
- Social media logos (LinkedIn, WhatsApp)
- App store badges
- Clock / time icons
- Search magnifying glass
- Download / upload arrows (vertical)
- Star ratings
- Heart / like icons
- Phone icon (receiver is always on the left in both cultures)
- The Aviniti infinity logo
- Media playback controls (play, pause -- universal convention)

Implementation pattern:

```tsx
// Utility component for directional icons
interface DirectionalIconProps {
  icon: 'arrow-right' | 'chevron-right' | 'arrow-left' | 'chevron-left';
  className?: string;
}

function DirectionalIcon({ icon, className }: DirectionalIconProps) {
  // In RTL, arrows swap direction
  return <span className={cn('rtl:-scale-x-100', className)}>{/* icon SVG */}</span>;
}

// Non-directional icons -- no transformation
function CheckIcon({ className }: { className?: string }) {
  return <span className={className}>{/* icon SVG -- never flips */}</span>;
}
```

### 4.4 Flexbox and Grid Direction

**Flexbox:**

When `dir="rtl"` is set on the `<html>` element, `flex-direction: row` automatically reverses to flow right-to-left. This means:

- `flex` and `flex-row` automatically mirror. No extra classes needed.
- `justify-start` aligns to the right in RTL. This is correct.
- `gap` is bidirectional-safe.

**When to NOT mirror:**

- Media playback controls (always left-to-right: rewind, play, forward)
- Code/technical displays
- Timelines that represent chronological order (evaluate case-by-case)
- Progress bars that fill from left to right (consider: in RTL, a progress bar should fill from right to left)

For elements that must NOT mirror, add `dir="ltr"` to the specific container:

```tsx
// Timeline that always flows left-to-right (chronological)
<div dir="ltr" className="flex gap-4">
  <TimelineStep step={1} />
  <TimelineStep step={2} />
  <TimelineStep step={3} />
</div>
```

**Grid:**

CSS Grid is also direction-aware. Grid items flow right-to-left in RTL contexts. This is usually the desired behavior for card grids and form layouts.

### 4.5 Margins, Padding, and Borders -- Logical Properties

**Rule:** Never use physical directional properties (`margin-left`, `padding-right`, `border-left`). Always use CSS logical properties.

| Physical (avoid) | Logical (use) | Tailwind (avoid) | Tailwind (use) |
|-------------------|---------------|-------------------|-----------------|
| `margin-left` | `margin-inline-start` | `ml-4` | `ms-4` |
| `margin-right` | `margin-inline-end` | `mr-4` | `me-4` |
| `padding-left` | `padding-inline-start` | `pl-4` | `ps-4` |
| `padding-right` | `padding-inline-end` | `pr-4` | `pe-4` |
| `border-left` | `border-inline-start` | `border-l` | `border-s` |
| `border-right` | `border-inline-end` | `border-r` | `border-e` |
| `left: 0` | `inset-inline-start: 0` | `left-0` | `start-0` |
| `right: 0` | `inset-inline-end: 0` | `right-0` | `end-0` |
| `text-left` | `text-start` | `text-left` | `text-start` |
| `text-right` | `text-end` | `text-right` | `text-end` |
| `float: left` | `float: inline-start` | `float-left` | `float-start` |
| `float: right` | `float: inline-end` | `float-right` | `float-end` |

**Symmetric properties are safe and do not need logical equivalents:**
- `mx-4` (margin on both sides) -- safe
- `px-4` (padding on both sides) -- safe
- `border-x` (borders on both sides) -- safe
- `rounded-lg` (all corners) -- safe

**Asymmetric border radius:**

| Physical (avoid) | Logical (use) | Tailwind (avoid) | Tailwind (use) |
|-------------------|---------------|-------------------|-----------------|
| `border-top-left-radius` | `border-start-start-radius` | `rounded-tl-lg` | `rounded-ss-lg` |
| `border-top-right-radius` | `border-start-end-radius` | `rounded-tr-lg` | `rounded-se-lg` |
| `border-bottom-left-radius` | `border-end-start-radius` | `rounded-bl-lg` | `rounded-es-lg` |
| `border-bottom-right-radius` | `border-end-end-radius` | `rounded-br-lg` | `rounded-ee-lg` |

### 4.6 Images

**Images that must NOT flip:**
- Photographs of people, places, products
- App screenshots (they show real UIs that may be LTR)
- The Aviniti logo
- Social media icons
- App store badges
- Brand partner logos
- Decorative illustrations without directional meaning

**Images that SHOULD flip:**
- Illustrations showing directional flow (e.g., a person pointing right should point left in RTL)
- Decorative background shapes that create a left-to-right visual flow
- Arrow-based decorative elements

**Images that need separate Arabic versions:**
- Screenshots containing English UI text (provide Arabic UI screenshots)
- Infographics with embedded text
- Marketing banners with text overlays

Implementation:

```tsx
// For decorative directional images
<Image
  src="/decorations/flow-lines.svg"
  alt=""
  className="rtl:-scale-x-100"
/>

// For content images -- never flip
<Image
  src="/apps/skinverse-screenshot.png"
  alt={t('portfolio.skinverse.alt')}
  // No RTL transformation
/>
```

### 4.7 Forms

| Element | LTR | RTL | Implementation |
|---------|-----|-----|----------------|
| Label position | Above or to the left of input | Above or to the right of input | Labels above inputs are simplest (no mirroring needed). If side-labels are used, flexbox handles it. |
| Input text direction | LTR | RTL | Automatic from `dir="rtl"` on `<html>`. |
| Placeholder text | Left-aligned | Right-aligned | Automatic. |
| Input icons (e.g., email icon) | Left side of input | Right side of input | Use `ps-10` for padding + `start-3` for icon position. |
| Validation error messages | Below input, left-aligned | Below input, right-aligned | Use `text-start`. |
| Required asterisk | After label text | After label text (appears on the left in RTL because text flows right-to-left) | Place inside the text flow, not absolutely positioned. |
| Submit button alignment | Right-aligned or centered | Left-aligned or centered | Use `ms-auto` for end-alignment or `mx-auto` for center. |
| Multi-step progress | Steps flow left-to-right (Step 1 -> 2 -> 3) | Steps flow right-to-left (Step 1 -> 2 -> 3, but starting from right) | Automatic with flexbox in RTL. |
| Phone number input | LTR input with country code on left | LTR input with country code on left -- phone numbers are always LTR | Use `dir="ltr"` on phone inputs. |
| Email input | LTR | LTR -- email addresses are always LTR | Use `dir="ltr"` on email inputs. |
| URL input | LTR | LTR | Use `dir="ltr"` on URL inputs. |
| Textarea for Arabic text | LTR | RTL | Automatic from document direction. |

```tsx
// Form input with icon -- RTL-safe
<div className="relative">
  <label htmlFor="email" className="block text-start text-sm font-medium mb-1">
    {t('form.email.label')}
  </label>
  <div className="relative">
    <MailIcon className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
    <input
      id="email"
      type="email"
      dir="ltr"  // Email addresses are always LTR
      className="w-full ps-10 pe-4 py-2 border rounded-lg text-start"
      placeholder={t('form.email.placeholder')}
    />
  </div>
  {error && (
    <p className="text-red-500 text-sm text-start mt-1">{t('form.email.error.invalid')}</p>
  )}
</div>
```

### 4.8 Numbers

As established in section 3.6, the recommendation is Western Arabic numerals (`ar-u-nu-latn`) for the Aviniti site. However, the system must handle both:

| Context | Numeral System | Example |
|---------|---------------|---------|
| Prices and costs | Western | $8,000 / 8,000 USD |
| Phone numbers | Western (always LTR) | +962 79 123 4567 |
| Dates | Western | 6 February 2026 / 6 فبراير 2026 |
| Statistics/counters | Western | 50+ Apps Delivered / 50+ تطبيق مُنجز |
| Percentages | Western | 40% / %40 (note: percent sign moves to the left in Arabic) |
| Step numbers | Western | Step 1, 2, 3 / الخطوة 1، 2، 3 |

### 4.9 Cards and Lists

**Card grids:**
- A 3-column grid of service cards will display in the same grid positions (top-left, top-center, top-right in LTR becomes top-right, top-center, top-left in RTL). This is automatic with CSS Grid or flexbox wrapping.
- Card internal content (icon, title, description) aligns to `text-start`.

**Ordered lists and numbered steps:**
- Numbers appear on the right side in RTL (automatic with `list-decimal` and `dir="rtl"`).
- Step-by-step flows (like the estimate multi-step form) reverse their visual direction.

**Horizontal scrolling lists (carousels):**
- Scroll origin is on the right in RTL. The first item appears on the right.
- Navigation arrows: "Next" arrow points left in RTL, "Previous" points right.
- Swipe direction: Swipe left to go forward in LTR; swipe right to go forward in RTL.

```tsx
// Card grid -- automatic RTL mirroring
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {services.map((service) => (
    <div key={service.key} className="p-6 rounded-xl border text-start">
      <ServiceIcon name={service.icon} className="mb-4" />
      <h3 className="text-lg font-semibold mb-2">{t(service.titleKey)}</h3>
      <p className="text-muted">{t(service.descriptionKey)}</p>
    </div>
  ))}
</div>
```

### 4.10 Floating Elements

| Element | LTR Position | RTL Position | Notes |
|---------|-------------|--------------|-------|
| WhatsApp button | Bottom-left | Bottom-right | The positions swap so both floating elements mirror. |
| Vanity chatbot bubble | Bottom-right | Bottom-left | Mirrors to opposite corner. |
| Scroll-to-top button | Bottom-right | Bottom-left | Mirrors. |
| Toast notifications | Top-right or bottom-right | Top-left or bottom-left | Mirrors. |

Implementation:

```tsx
// WhatsApp floating button -- uses logical positioning
<a
  href="https://wa.me/962XXXXXXXXX?text=..."
  className="fixed bottom-6 start-6 z-50 bg-green-500 rounded-full p-4 shadow-lg"
  aria-label={t('common.whatsapp.label')}
>
  <WhatsAppIcon className="h-6 w-6 text-white" />
</a>

// Chatbot bubble -- uses logical positioning
<button
  onClick={openChat}
  className="fixed bottom-6 end-6 z-50 bg-bronze rounded-full p-4 shadow-lg"
  aria-label={t('chatbot.open')}
>
  <ChatBotIcon className="h-6 w-6 text-white" />
</button>
```

Note the use of `start-6` and `end-6` instead of `left-6` and `right-6`. In LTR, `start-6` resolves to `left: 1.5rem`. In RTL, it resolves to `right: 1.5rem`.

### 4.11 Modals and Dialogs

| Element | LTR | RTL | Rule |
|---------|-----|-----|------|
| Close button (X) | Top-right | Top-left | Use `end-4 top-4` positioning. |
| Modal title | Left-aligned | Right-aligned | `text-start`. |
| Modal body text | Left-aligned | Right-aligned | `text-start`. |
| Action buttons | Right-aligned (Primary on right) | Left-aligned (Primary on left) | Use `flex justify-end` -- this mirrors in RTL. |
| Slide-in direction | Slides from right | Slides from left | Mirror animation origin. |

```tsx
// Modal close button -- RTL-safe
<button
  onClick={onClose}
  className="absolute top-4 end-4 text-muted hover:text-white"
  aria-label={t('common.close')}
>
  <XIcon className="h-5 w-5" />
</button>

// Modal action buttons
<div className="flex justify-end gap-3 mt-6">
  <button className="btn-secondary">{t('common.cancel')}</button>
  <button className="btn-primary">{t('common.confirm')}</button>
</div>
```

### 4.12 Exit Intent Popup

The exit intent modal follows the same modal rules above. Additional considerations:
- Slide-up animation on mobile is vertical and does not need RTL changes.
- "No thanks" link and primary CTA follow the same alignment rules.
- The lead magnet mockup image does not flip.

---

## 5. Tailwind CSS RTL Strategy

### 5.1 Recommended Approach: Native Tailwind Logical Properties

**Decision:** Use Tailwind CSS v3.3+ built-in logical property utilities. Do NOT use the `tailwindcss-rtl` plugin -- it is no longer necessary.

Tailwind v3.3+ includes native support for:
- `ms-*` / `me-*` (margin-inline-start / margin-inline-end)
- `ps-*` / `pe-*` (padding-inline-start / padding-inline-end)
- `start-*` / `end-*` (inset-inline-start / inset-inline-end)
- `border-s-*` / `border-e-*` (border-inline-start / border-inline-end)
- `rounded-ss-*` / `rounded-se-*` / `rounded-es-*` / `rounded-ee-*`
- `text-start` / `text-end`
- `float-start` / `float-end`
- `scroll-ms-*` / `scroll-me-*` / `scroll-ps-*` / `scroll-pe-*`

For the few cases where logical utilities are not available, use the `rtl:` variant:

```html
<!-- Example: an icon that flips in RTL -->
<ChevronRight className="h-4 w-4 rtl:-scale-x-100" />

<!-- Example: override a specific behavior in RTL -->
<div className="translate-x-2 rtl:-translate-x-2">...</div>
```

### 5.2 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1419',
          light: '#1A2332',
          lighter: '#243044',
        },
        bronze: {
          DEFAULT: '#C08460',
          hover: '#A6714E',
          light: '#D4A583',
        },
        offwhite: '#F4F4F2',
        muted: '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### 5.3 Complete RTL-Safe Class Reference

Below is a mapping of common layout patterns and their RTL-safe Tailwind equivalents.

**Spacing:**

```html
<!-- WRONG -->
<div class="ml-4 pr-6">

<!-- CORRECT -->
<div class="ms-4 pe-6">
```

**Positioning:**

```html
<!-- WRONG -->
<div class="absolute left-0 top-0">

<!-- CORRECT -->
<div class="absolute start-0 top-0">
```

**Borders:**

```html
<!-- WRONG -->
<div class="border-l-2 border-bronze">

<!-- CORRECT -->
<div class="border-s-2 border-bronze">
```

**Text alignment:**

```html
<!-- WRONG -->
<p class="text-left">

<!-- CORRECT -->
<p class="text-start">
```

**Rounded corners (asymmetric):**

```html
<!-- WRONG: left side rounded -->
<div class="rounded-l-lg">

<!-- CORRECT: start side rounded -->
<div class="rounded-s-lg">
```

**Complex example -- a card with icon and text:**

```html
<!-- Full RTL-safe card -->
<div class="flex items-start gap-4 p-6 border rounded-xl">
  <!-- Icon on start side -->
  <div class="shrink-0 rounded-lg bg-bronze/10 p-3">
    <RocketIcon class="h-6 w-6 text-bronze" />
  </div>

  <!-- Content fills remaining space, text aligns to start -->
  <div class="flex-1 text-start">
    <h3 class="text-lg font-semibold text-white mb-1">AI Solutions</h3>
    <p class="text-muted text-sm">Intelligent apps that learn and adapt</p>
  </div>

  <!-- Directional chevron on end side -->
  <ChevronIcon class="h-5 w-5 text-muted rtl:-scale-x-100" />
</div>
```

### 5.4 Common Pitfalls and Prevention

| Pitfall | Example | Prevention |
|---------|---------|------------|
| Using `ml-` / `mr-` / `pl-` / `pr-` | `className="ml-4"` | ESLint rule to flag physical directional classes. Use `ms-4` / `me-4`. |
| Using `left-` / `right-` for positioning | `className="absolute right-4"` | Use `end-4` / `start-4`. |
| Using `text-left` / `text-right` | `className="text-left"` | Use `text-start` / `text-end`. |
| Hardcoded `transform: translateX()` | `style={{ transform: 'translateX(10px)' }}` | Use Tailwind's `translate-x-*` with `rtl:-translate-x-*` override. |
| Fixed-width containers breaking with longer Arabic text | `className="w-[200px]"` | Use `min-w-` and `max-w-` instead of fixed widths. Let text wrap. |
| Absolute positioning for decorative elements | `left: 50px` | Use `start-[50px]`. |
| `border-radius` on one side only | `rounded-tl-lg rounded-bl-lg` | Use `rounded-ss-lg rounded-es-lg`. |
| Background gradients flowing left-to-right | `bg-gradient-to-r` | Use `bg-gradient-to-r rtl:bg-gradient-to-l` when the gradient direction should mirror. |
| Animations with directional transforms | `@keyframes slideIn { from { translateX(-100%) } }` | Create RTL-aware animation variants or use logical motion values. |

### 5.5 ESLint Rule for Enforcement

Add a custom ESLint rule (or use `eslint-plugin-tailwindcss` with custom configuration) to flag prohibited physical-directional Tailwind classes:

```typescript
// .eslintrc.js (simplified concept)
// Flag these class patterns in JSX className attributes:
const PROHIBITED_PATTERNS = [
  'ml-', 'mr-', 'pl-', 'pr-',       // Use ms-, me-, ps-, pe-
  'left-', 'right-',                  // Use start-, end-
  'text-left', 'text-right',          // Use text-start, text-end
  'float-left', 'float-right',        // Use float-start, float-end
  'border-l', 'border-r',             // Use border-s, border-e
  'rounded-tl-', 'rounded-tr-',       // Use rounded-ss-, rounded-se-
  'rounded-bl-', 'rounded-br-',       // Use rounded-es-, rounded-ee-
  'scroll-ml-', 'scroll-mr-',         // Use scroll-ms-, scroll-me-
  'scroll-pl-', 'scroll-pr-',         // Use scroll-ps-, scroll-pe-
];
```

This enforcement catches RTL bugs at development time rather than in visual QA.

---

## 6. Component-Level i18n Patterns

### 6.1 How Components Consume Translations

**Pattern A: Server Component (default)**

The page-level server component loads translations and passes the `t` function or translated strings as props.

```typescript
// src/app/[locale]/page.tsx (Server Component)
import { getTranslations, createTranslator } from '@/lib/i18n/server';
import { HeroSection } from '@/components/home/hero-section';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = createTranslator(await getTranslations(locale as Locale, 'home'));
  const commonT = createTranslator(await getTranslations(locale as Locale, 'common'));

  return (
    <>
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaPrimary={t('hero.cta.primary')}
        ctaSecondary={t('hero.cta.secondary')}
        locale={locale}
      />
      {/* ... */}
    </>
  );
}
```

```typescript
// src/components/home/hero-section.tsx (Server Component -- no 'use client')
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  locale: string;
}

export function HeroSection({ title, subtitle, ctaPrimary, ctaSecondary, locale }: HeroSectionProps) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">{subtitle}</p>
      <div className="flex justify-center gap-4">
        <Link href={`/${locale}/get-estimate`} className="btn-primary">{ctaPrimary}</Link>
        <Link href={`/${locale}/solutions`} className="btn-secondary">{ctaSecondary}</Link>
      </div>
    </section>
  );
}
```

**Pattern B: Client Component (interactive elements)**

For components that need client-side interactivity with translated text (forms, chatbot, language switcher), use the translation context.

```typescript
// src/components/chatbot/chat-window.tsx
'use client';

import { useTranslation } from '@/lib/i18n/client';

export function ChatWindow() {
  const { t, locale } = useTranslation();

  return (
    <div className="fixed end-6 bottom-20 w-80 bg-navy-light rounded-xl shadow-2xl z-50">
      <div className="p-4 border-b border-navy-lighter flex items-center justify-between">
        <h2 className="font-semibold text-white">{t('chatbot.title')}</h2>
        <button aria-label={t('common.close')}>
          <XIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {/* Messages */}
      </div>
      <div className="p-4 border-t border-navy-lighter">
        <input
          type="text"
          placeholder={t('chatbot.inputPlaceholder')}
          className="w-full bg-navy rounded-lg px-4 py-2 text-white text-start"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
}
```

### 6.2 Client-Side Language Switching

Language switching must feel instant. The strategy:

1. The language switcher is a Client Component.
2. On click, it navigates to the same page path under the new locale prefix using Next.js `useRouter`.
3. Because the new locale URL is a separate route, Next.js performs a client-side navigation (no full page reload with the Link component or router.push).
4. The `NEXT_LOCALE` cookie is updated by the middleware on the new request.

```typescript
// src/components/language-switcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const targetLocale = locale === 'en' ? 'ar' : 'en';
  const targetLabel = locale === 'en' ? 'العربية' : 'English';

  function switchLanguage() {
    // Replace current locale prefix with the target
    const newPath = pathname.replace(`/${locale}`, `/${targetLocale}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center gap-2 text-sm text-offwhite hover:text-bronze transition-colors"
      aria-label={`Switch to ${targetLabel}`}
    >
      <GlobeIcon className="h-4 w-4" />
      <span>{targetLabel}</span>
    </button>
  );
}
```

**Why this is instant:** Next.js App Router prefetches linked routes. When the user navigates from `/en/get-estimate` to `/ar/get-estimate`, the framework performs a client-side transition, updating the DOM without a full page reload. The `<html lang>` and `<html dir>` attributes are updated because the root layout re-renders with the new locale parameter.

### 6.3 Font Considerations

**Inter does NOT support Arabic.** Inter is a Latin/Cyrillic typeface. Arabic glyphs will fall back to the browser's default Arabic font, which is inconsistent across platforms and usually unattractive.

**Required Arabic font:** Noto Sans Arabic (by Google Fonts).

Rationale:
- Noto Sans Arabic is designed to harmonize with Latin sans-serif fonts like Inter.
- It has the same weight range (100-900) as Inter.
- It is available on Google Fonts with the same loading strategy.
- It is specifically designed for screen readability.

Alternative options (if Noto Sans Arabic does not match the brand feel):
- **Tajawal** -- Modern, clean Arabic font that pairs well with geometric sans-serifs.
- **Cairo** -- Slightly more traditional but highly readable.
- **IBM Plex Sans Arabic** -- Pairs with IBM Plex Sans if used as the Latin font.

**Font loading strategy:**

```typescript
// src/app/[locale]/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Latin font -- loaded for all locales (brand names appear in Arabic pages too)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Arabic font -- loaded only for Arabic locale
const notoSansArabic = localFont({
  src: [
    { path: '../fonts/NotoSansArabic-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/NotoSansArabic-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/NotoSansArabic-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/NotoSansArabic-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-arabic',
  display: 'swap',
});
```

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-body: var(--font-inter), system-ui, sans-serif;
  }

  [dir="rtl"] {
    --font-body: var(--font-arabic), var(--font-inter), system-ui, sans-serif;
  }

  body {
    font-family: var(--font-body);
  }
}
```

**Arabic typography adjustments:**

Arabic text typically appears visually smaller than Latin text at the same font size because Arabic characters are more vertically compact and have more intricate shapes. Apply a size adjustment for Arabic:

```css
@layer base {
  [dir="rtl"] body {
    font-size: 1.05em;    /* 5% larger base size for Arabic */
    line-height: 1.8;     /* More line height for Arabic readability */
  }

  [dir="rtl"] h1, [dir="rtl"] h2, [dir="rtl"] h3 {
    line-height: 1.4;     /* Slightly tighter for headings */
  }
}
```

### 6.4 Text Expansion and Contraction

Arabic text length varies compared to English. Plan for:

| English Length | Arabic Equivalent | Ratio |
|---------------|-------------------|-------|
| Short labels (1-3 words) | Often similar or slightly longer | 1.0x - 1.3x |
| Medium phrases (4-10 words) | Can be shorter (Arabic is compact in mid-length text) | 0.8x - 1.2x |
| Long paragraphs | Usually similar length | 0.9x - 1.1x |
| CTA buttons | Often significantly longer | 1.2x - 1.5x |

**Design rules to handle expansion:**

1. Never set fixed widths on text containers. Use `max-w-*` constraints with flexible inner content.
2. Buttons must accommodate variable text length. Use `px-6 py-3` (horizontal padding) rather than `w-[200px]`.
3. Navigation items should use `gap-*` between flex items, not fixed widths per item.
4. Card heights should not be fixed; let content dictate height, or use `min-h-*` for visual consistency.
5. Test every component with both the English and Arabic text to verify no overflow or truncation.

```html
<!-- WRONG: Fixed width button breaks with longer Arabic text -->
<button class="w-[180px] py-3 bg-bronze text-white">Get Estimate</button>

<!-- CORRECT: Flexible width with padding -->
<button class="px-8 py-3 bg-bronze text-white whitespace-nowrap">Get Estimate</button>
```

### 6.5 Bidirectional Text (Bidi) Mixing

When Arabic text contains English words (brand names, technical terms), the Unicode Bidirectional Algorithm (UBiDi) handles most cases automatically. However, some situations require explicit markup:

**Common bidi scenarios in Aviniti's site:**

1. Brand name in Arabic sentence: "مرحبًا بكم في Aviniti" -- UBiDi handles this automatically.
2. App names in Arabic: "تطبيق SkinVerse" -- automatic.
3. Technical terms in Arabic text: "تقنية Machine Learning" -- automatic.
4. Numbers and currency in Arabic: "تكلفة المشروع $8,000" -- automatic, but verify placement.

**When to intervene:**

If the automatic bidi algorithm produces incorrect ordering (e.g., punctuation or parentheses appear in the wrong place), use the `<bdi>` element or Unicode control characters:

```tsx
// Wrapping English brand names for bidi safety
<p>
  {t('portfolio.description', {
    appName: <bdi key="app">SkinVerse</bdi>
  })}
</p>
```

For translation files, no special handling is needed; the JSON strings contain the mixed-direction text, and the browser renders it correctly in the appropriate `dir` context.

---

## 7. Testing Strategy

### 7.1 RTL Visual Testing

**Manual testing checklist (run before every release):**

For every page, verify in Arabic mode:
- [ ] Text is right-aligned
- [ ] Logo is on the right side of the nav
- [ ] Hamburger menu is on the left (mobile)
- [ ] Flexbox rows are reversed
- [ ] Icons that should flip are flipped
- [ ] Icons that should not flip are not flipped
- [ ] WhatsApp button is bottom-right, chatbot is bottom-left
- [ ] Modal close button is top-left
- [ ] Form labels and inputs are right-aligned
- [ ] Phone and email inputs remain LTR
- [ ] No text overflow or truncation
- [ ] Margins and padding are visually correct (no doubled spacing)
- [ ] Scroll direction is correct in carousels
- [ ] Arabic font is rendering (not fallback Times New Roman)
- [ ] Font size and line height are comfortable for Arabic text

**Automated visual regression testing:**

Use Playwright for screenshot comparison between English and Arabic versions:

```typescript
// tests/visual/rtl.spec.ts
import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/get-estimate',
  '/idea-lab',
  '/solutions',
  '/contact',
  '/faq',
];

for (const page of pages) {
  test(`RTL visual: ${page}`, async ({ browser }) => {
    // English version
    const enPage = await browser.newPage();
    await enPage.goto(`http://localhost:3000/en${page}`);
    const enScreenshot = await enPage.screenshot({ fullPage: true });

    // Arabic version
    const arPage = await browser.newPage();
    await arPage.goto(`http://localhost:3000/ar${page}`);
    const arScreenshot = await arPage.screenshot({ fullPage: true });

    // Compare with golden screenshots (allow 5% pixel difference for text)
    expect(arScreenshot).toMatchSnapshot(`ar${page.replace(/\//g, '-')}.png`, {
      maxDiffPixelRatio: 0.05,
    });
  });
}
```

### 7.2 Translation Completeness Checks

**CI pipeline check:** On every pull request, run a script that compares English and Arabic translation files for missing keys.

```typescript
// scripts/check-translations.ts
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.resolve('src/locales');
const NAMESPACES = fs.readdirSync(path.join(LOCALES_DIR, 'en'))
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

let hasErrors = false;

for (const ns of NAMESPACES) {
  const enKeys = Object.keys(
    JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en', `${ns}.json`), 'utf-8'))
  );
  const arKeys = Object.keys(
    JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ar', `${ns}.json`), 'utf-8'))
  );

  const missingInAr = enKeys.filter(k => !arKeys.includes(k));
  const extraInAr = arKeys.filter(k => !enKeys.includes(k));

  if (missingInAr.length > 0) {
    console.error(`[${ns}] Missing in Arabic: ${missingInAr.join(', ')}`);
    hasErrors = true;
  }
  if (extraInAr.length > 0) {
    console.warn(`[${ns}] Extra keys in Arabic (not in English): ${extraInAr.join(', ')}`);
  }
}

if (hasErrors) {
  process.exit(1);
}
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "check:translations": "tsx scripts/check-translations.ts"
  }
}
```

### 7.3 Hardcoded String Detection

Use a combination of approaches to catch untranslated hardcoded strings:

1. **ESLint rule:** `eslint-plugin-i18next` or a custom rule that flags string literals in JSX (except for className, key, href, and other non-display attributes).

2. **Visual test:** Render every page with a pseudo-locale that wraps all translated text with markers (e.g., `[=== Get Estimate ===]`). Any text without markers is hardcoded.

```typescript
// For development: pseudo-locale that wraps translations
function createPseudoTranslator(translations: Record<string, string>) {
  return function t(key: string, params?: Record<string, string | number>): string {
    const value = translations[key] || key;
    // Wrap in markers so hardcoded text is visible
    return `[== ${value} ==]`;
  };
}
```

### 7.4 Browser Testing Matrix

| Browser | Platform | Priority | RTL Focus Areas |
|---------|----------|----------|-----------------|
| Chrome | Desktop + Android | P0 | Flexbox RTL, logical properties |
| Safari | Desktop + iOS | P0 | Arabic font rendering, flexbox quirks |
| Firefox | Desktop | P1 | Logical properties (earliest adopter, usually fine) |
| Edge | Desktop | P2 | Chromium-based, same as Chrome |
| Samsung Internet | Android | P2 | Common in MENA region |

---

## 8. Performance Considerations

### 8.1 Bundle Size Impact

Translation files for a site with 600-800 keys per language are approximately 15-25 KB uncompressed per language (JSON). With gzip, this compresses to 3-6 KB per file.

**Strategy to minimize impact:**

| Technique | Impact | Implementation |
|-----------|--------|----------------|
| Load only the active locale | 50% reduction | Only import `en/` or `ar/` files, never both |
| Split by namespace | Load only what the page needs | Dynamic `import()` per namespace |
| Server Components | Zero client JS for static translations | Default to Server Components |
| Preload common namespace | Prevent waterfall | Include `common.json` in initial page bundle |

### 8.2 Lazy Loading Translations by Route

Because each namespace maps to a route, Next.js automatically code-splits them when using dynamic imports in server components:

```typescript
// This runs on the server -- the JSON file is NOT sent to the client
const translations = (await import(`@/locales/${locale}/home.json`)).default;
```

For client components that need translations, load the namespace when the component mounts:

```typescript
// Lazy load chatbot translations only when chatbot opens
const [chatbotTranslations, setChatbotTranslations] = useState<Record<string, string> | null>(null);

async function openChatbot() {
  if (!chatbotTranslations) {
    const mod = await import(`@/locales/${locale}/chatbot.json`);
    setChatbotTranslations(mod.default);
  }
  setIsOpen(true);
}
```

### 8.3 Avoiding Re-renders on Language Switch

Since language switching navigates to a new URL (`/en/page` to `/ar/page`), the page tree unmounts and remounts naturally. This is actually desirable -- it ensures all server components re-fetch their translations and the entire page is consistent.

For client-state preservation across language switches (e.g., form progress in the estimate flow), persist state to:
- URL search parameters (recommended for multi-step forms: `?step=2&type=mobile`)
- Session storage (for draft text input)
- Not React state (which resets on navigation)

### 8.4 Font Loading Performance

Arabic fonts add a separate font download. Minimize impact:

1. **Subset the font:** Only include the Arabic Unicode range and Latin numerals/punctuation. Noto Sans Arabic from Google Fonts is already subsetted.
2. **Use `font-display: swap`:** Text renders immediately in a fallback font, then swaps when the Arabic font loads.
3. **Preload for Arabic pages:** Add a `<link rel="preload">` for the Arabic font file when `locale === 'ar'`.

```typescript
// In the root layout, conditionally preload the Arabic font
{locale === 'ar' && (
  <link
    rel="preload"
    href="/fonts/NotoSansArabic-Regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
)}
```

4. **Use `next/font`:** Next.js's built-in font optimization handles self-hosting, subsetting, and preloading automatically.

### 8.5 Static Generation Considerations

For pages that can be statically generated (homepage, FAQ, solutions catalog, case studies), generate both locale versions at build time:

```typescript
// src/app/[locale]/page.tsx
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}
```

This produces pre-rendered HTML for both `/en/` and `/ar/` at build time, resulting in zero server computation and optimal TTFB for these pages.

---

## Appendix A: Translation Type Definitions

```typescript
// src/lib/i18n/types.ts

export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const NAMESPACES = [
  'common',
  'home',
  'estimate',
  'idea-lab',
  'idea-analyzer',
  'roi-calculator',
  'solutions',
  'case-studies',
  'blog',
  'faq',
  'contact',
  'chatbot',
  'errors',
  'meta',
] as const;
export type Namespace = (typeof NAMESPACES)[number];

export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

export interface LocaleConfig {
  code: Locale;
  name: string;          // "English", "العربية"
  nativeName: string;    // "English", "العربية"
  dir: 'ltr' | 'rtl';
  fontFamily: string;
  dateLocale: string;    // For date-fns or Intl
  numberLocale: string;  // For Intl.NumberFormat (with numeral system)
}

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontFamily: 'font-sans',
    dateLocale: 'en-US',
    numberLocale: 'en-US',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontFamily: 'font-arabic',
    dateLocale: 'ar-JO',
    numberLocale: 'ar-u-nu-latn', // Western numerals in Arabic context
  },
};
```

## Appendix B: Chatbot and WhatsApp i18n

### Vanity Assistant (Chatbot)

The chatbot must respond in the user's language. This is achieved at two levels:

**Static messages (greetings, quick replies):** Loaded from `chatbot.json` per locale.

```json
// src/locales/en/chatbot.json
{
  "title": "Chat with Avi",
  "greeting.firstVisit": "Hi! I'm Avi, Aviniti's AI assistant. I can help you explore our services, get estimates, or answer questions. What brings you here today?",
  "greeting.returning": "Welcome back! How can I help you today?",
  "quickReply.buildApp": "I want to build an app",
  "quickReply.pricing": "How much does it cost?",
  "quickReply.portfolio": "Show me examples",
  "quickReply.talkHuman": "Talk to a human",
  "inputPlaceholder": "Type your message...",
  "typing": "Avi is typing...",
  "handoff.message": "I'll connect you with our team. How would you like to be reached?",
  "handoff.email": "Email me",
  "handoff.whatsapp": "WhatsApp",
  "handoff.calendly": "Book a call"
}
```

```json
// src/locales/ar/chatbot.json
{
  "title": "تحدث مع آفي",
  "greeting.firstVisit": "مرحبًا! أنا آفي، المساعد الذكي من Aviniti. يمكنني مساعدتك في استكشاف خدماتنا أو الحصول على تقديرات أو الإجابة عن أسئلتك. كيف أقدر أساعدك اليوم؟",
  "greeting.returning": "أهلاً بعودتك! كيف أقدر أساعدك اليوم؟",
  "quickReply.buildApp": "أريد بناء تطبيق",
  "quickReply.pricing": "كم التكلفة؟",
  "quickReply.portfolio": "أرني أمثلة",
  "quickReply.talkHuman": "أريد التحدث مع شخص",
  "inputPlaceholder": "اكتب رسالتك...",
  "typing": "آفي يكتب...",
  "handoff.message": "سأوصلك بفريقنا. كيف تفضل أن نتواصل معك؟",
  "handoff.email": "أرسلوا لي إيميل",
  "handoff.whatsapp": "واتساب",
  "handoff.calendly": "حجز مكالمة"
}
```

**Dynamic responses (AI-generated):** Pass the locale to the Gemini system prompt:

```typescript
const systemPrompt = `You are Avi, Aviniti's AI assistant on their website.
Language: ${locale === 'ar' ? 'Arabic (Modern Standard Arabic, friendly tone)' : 'English'}
Rules:
- Respond ONLY in ${locale === 'ar' ? 'Arabic' : 'English'}.
- Keep brand names in English: Aviniti, SkinVerse, Caliber OS, etc.
- Be helpful, concise, and guide users to the right tool or page.
- If the user switches language mid-conversation, switch to match them.`;
```

### WhatsApp Pre-filled Messages

```json
// src/locales/en/common.json (relevant keys)
{
  "whatsapp.prefilled.general": "Hi! I'm interested in learning more about Aviniti's services.",
  "whatsapp.prefilled.estimate": "Hi! I just got an estimate from your website and I'd like to discuss it.",
  "whatsapp.prefilled.caseStudy": "Hi! I'd like to know more about your {{industry}} project.",
  "whatsapp.label": "Message us on WhatsApp"
}

// src/locales/ar/common.json (relevant keys)
{
  "whatsapp.prefilled.general": "مرحبًا! أنا مهتم بمعرفة المزيد عن خدمات Aviniti.",
  "whatsapp.prefilled.estimate": "مرحبًا! حصلت للتو على تقدير من موقعكم وأريد مناقشته.",
  "whatsapp.prefilled.caseStudy": "مرحبًا! أريد معرفة المزيد عن مشروعكم في مجال {{industry}}.",
  "whatsapp.label": "راسلنا على واتساب"
}
```

The WhatsApp deep link must URL-encode the Arabic text:

```typescript
function getWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

## Appendix C: SEO Metadata Pattern

```typescript
// src/app/[locale]/layout.tsx (or per-page)
import { getTranslations, createTranslator } from '@/lib/i18n/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = createTranslator(await getTranslations(locale as Locale, 'meta'));

  return {
    title: t('home.title'),                         // "Aviniti - AI & App Development"
    description: t('home.description'),              // Translated meta description
    openGraph: {
      title: t('home.og.title'),
      description: t('home.og.description'),
      locale: locale === 'ar' ? 'ar_JO' : 'en_US',
      siteName: 'Aviniti',
    },
    alternates: {
      canonical: `https://aviniti.com/${locale}`,
      languages: {
        en: 'https://aviniti.com/en',
        ar: 'https://aviniti.com/ar',
      },
    },
  };
}
```

## Appendix D: Aviniti-Specific Glossary

Maintain a glossary to ensure consistent Arabic translation across all namespaces.

| English Term | Arabic Translation | Notes |
|-------------|-------------------|-------|
| Get AI Estimate | احصل على تقدير بالذكاء الاصطناعي | Primary CTA |
| Idea Lab | مختبر الأفكار | Feature name |
| AI Idea Analyzer | محلل الأفكار الذكي | Feature name |
| ROI Calculator | حاسبة العائد على الاستثمار | Feature name |
| Ready-Made Solutions | الحلول الجاهزة | Product category |
| Book a Call | احجز مكالمة | CTA |
| Case Studies | قصص النجاح | Section title |
| Mobile App | تطبيق جوال | Service category |
| Web Application | تطبيق ويب | Service category |
| AI Solutions | حلول الذكاء الاصطناعي | Service category |
| Cloud Solutions | حلول سحابية | Service category |
| Your Ideas, Our Reality | أفكاركم، واقعنا | Tagline (owner must approve) |
| Aviniti | Aviniti | Never translate -- always English |
| SkinVerse | SkinVerse | Never translate |
| Caliber OS | Caliber OS | Never translate |
| Vanity / Avi | آفي | Chatbot name in Arabic |

---

**End of i18n Design Specification**
