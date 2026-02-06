# Content Pages -- Blog, Case Studies, FAQ Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Inter
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Blog Listing Page](#1-blog-listing-page)
2. [Blog Post Detail Page](#2-blog-post-detail-page)
3. [Case Studies Listing Page](#3-case-studies-listing-page)
4. [Case Study Detail Page](#4-case-study-detail-page)
5. [FAQ Page](#5-faq-page)

---

## 1. Blog Listing Page

### 1.1 Purpose and Conversion Goal

The blog establishes Aviniti as a thought leader in AI and app development. It serves as a top-of-funnel SEO asset, attracting visitors searching for industry topics who may later convert into leads.

**User mindset:** "I want to learn about AI app development, trends, or best practices." These are research-phase visitors. The page must make content discoverable and encourage deeper exploration.

**Primary KPI:** Blog post click-through rate.
**Secondary KPI:** Newsletter sign-up (future), CTA clicks to AI tools from within blog context.

### 1.2 URL Structure

```
/en/blog                   (English listing)
/ar/blog                   (Arabic listing)
/en/blog?category=ai       (Filtered by category)
/en/blog?page=2            (Pagination)
```

### 1.3 SEO Metadata

```html
<title>Blog - AI & App Development Insights | Aviniti</title>
<meta name="description" content="Expert insights on AI, mobile app development, digital transformation, and tech innovation for SMBs. Stay ahead with Aviniti." />
<meta property="og:title" content="Aviniti Blog - AI & App Development" />
<meta property="og:description" content="Expert insights on building intelligent apps and digital transformation." />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://aviniti.com/en/blog" />
```

### 1.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Blog                                          |
+------------------------------------------------------------------+
|                                                                    |
|  HERO / FEATURED POST                                              |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------------+  +---------------------------+   | |
|  |  |                        |  |  [AI]  category badge     |   | |
|  |  |                        |  |                           |   | |
|  |  |  Featured Image        |  |  The Future of AI in      |   | |
|  |  |  (16:9 aspect)         |  |  Mobile App Development   |   | |
|  |  |                        |  |                           |   | |
|  |  |                        |  |  First 2 lines of         |   | |
|  |  |                        |  |  excerpt text...          |   | |
|  |  |                        |  |                           |   | |
|  |  |                        |  |  Feb 3, 2026 * 8 min read |   | |
|  |  |                        |  |                           |   | |
|  |  |                        |  |  [Read Article ->]        |   | |
|  |  +------------------------+  +---------------------------+   | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  [All]  [AI & ML]  [Mobile Dev]  [Web Dev]  [Business]  [Trends] |
|                                                                    |
|  +  Search input  [Q]                                              |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  +----------+  +----------+  +----------+                          |
|  | [image]  |  | [image]  |  | [image]  |                          |
|  | [categ]  |  | [categ]  |  | [categ]  |                          |
|  |          |  |          |  |          |                          |
|  | Post     |  | Post     |  | Post     |                          |
|  | Title    |  | Title    |  | Title    |                          |
|  |          |  |          |  |          |                          |
|  | Excerpt  |  | Excerpt  |  | Excerpt  |                          |
|  | text...  |  | text...  |  | text...  |                          |
|  |          |  |          |  |          |                          |
|  | Date     |  | Date     |  | Date     |                          |
|  +----------+  +----------+  +----------+                          |
|                                                                    |
|  +----------+  +----------+  +----------+                          |
|  | [image]  |  | [image]  |  | [image]  |                          |
|  | ...      |  | ...      |  | ...      |                          |
|  +----------+  +----------+  +----------+                          |
|                                                                    |
|  [Previous]          Page 1 of 5          [Next]                   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CTA: Want to build an app? [Get AI Estimate]                      |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 1.5 Content Hierarchy and Component Specs

#### Featured Post (Hero Area)

| Element | Spec |
|---------|------|
| Container | Featured Card style: `bg-slate-blue border border-bronze/20 rounded-xl overflow-hidden shadow-lg` |
| Layout | `grid grid-cols-1 lg:grid-cols-2` -- image left, content right |
| Image | `aspect-[16/9] lg:aspect-auto lg:h-full object-cover`. On default: slight desaturation `grayscale(20%)`. On hover: full color. Transition 300ms. |
| Category badge | Absolute on image: `absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-medium bg-bronze/80 text-white` |
| Content padding | `p-6 lg:p-8` |
| Title | `text-h3 lg:text-h2 text-white mt-3` (clamp 20-42px) |
| Excerpt | `text-base text-muted mt-3 line-clamp-3` |
| Meta | `flex items-center gap-3 text-sm text-muted mt-4`. Date + read time separated by dot |
| CTA link | `inline-flex items-center gap-1.5 text-bronze text-sm font-medium mt-4 hover:gap-2.5 transition-all` -- "Read Article" with arrow |

#### Category Filter + Search

| Element | Spec |
|---------|------|
| Filter tabs | Design system Horizontal Tabs (Section 7.7). Categories: All, AI & ML, Mobile Dev, Web Dev, Business, Trends |
| Search input | `h-11 px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light w-full max-w-[320px]` with search icon (Lucide `Search`) prepended |
| Layout | `flex flex-col md:flex-row items-start md:items-center justify-between gap-4` |
| Sticky | On mobile, filter tabs become horizontally scrollable. Search moves below tabs. |

#### Blog Post Card Grid

| Element | Spec |
|---------|------|
| Grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Card | Blog Post Card from design system (Section 7.2): `bg-slate-blue border border-slate-blue-light rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300` |
| Image | `aspect-[16/9] object-cover w-full`. Default: `grayscale(30%)`. Hover: `grayscale(0%)`. Transition 300ms. Lazy loaded. |
| Category badge | Absolute on image top-left |
| Date | `text-xs text-muted mt-4 px-6` |
| Title | `text-lg font-semibold text-white mt-1 px-6 line-clamp-2` |
| Excerpt | `text-sm text-muted mt-2 px-6 pb-6 line-clamp-3` |
| Entire card | Wrapped in `<a>` -- entire card is clickable |

#### Pagination

| Element | Spec |
|---------|------|
| Container | `flex items-center justify-center gap-2 mt-12` |
| Previous/Next | Ghost button style: `h-10 px-4 rounded-lg text-sm font-medium text-muted hover:text-white hover:bg-slate-blue-light/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed` |
| Page numbers | `h-10 w-10 rounded-lg text-sm font-medium flex items-center justify-center`. Active: `bg-bronze text-white`. Inactive: `text-muted hover:text-white hover:bg-slate-blue-light/60` |
| Ellipsis | `text-muted text-sm px-1` -- "..." |

#### Bottom CTA Banner

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-10 text-center` |
| Headline | `text-h3 text-white` -- "Ready to Turn Insights into Action?" |
| Description | `text-base text-muted mt-3 max-w-[480px] mx-auto` -- "Get an AI-powered estimate for your next app project." |
| CTA | `Button variant="primary" size="lg" mt-6` -- "Get AI Estimate" |

### 1.6 Responsive Behavior

**Desktop (1024px+):** Featured post in 2-column layout. Grid: 3 columns. Search inline with tabs.
**Tablet (768px-1023px):** Featured post stacked. Grid: 2 columns. Search below tabs.
**Mobile (<768px):** Everything stacked. Grid: single column. Tabs scrollable. Search full width. Cards simplified. Pagination compact (prev/next only, no page numbers).

### 1.7 Animation Specifications

- Featured post: Fade in + translateY(20px) on page load, 500ms
- Filter tabs: Fade in, 300ms delay
- Blog cards: Stagger fade-up, 80ms per card, triggered on scroll
- Pagination: No animation (functional element)
- Filter change: Cards use `AnimatePresence` with `layout` for smooth reflow

### 1.8 Accessibility

- Blog listing uses `<main>` landmark with `aria-label="Blog"`
- Featured post: `<article>` with `aria-label` containing post title
- Each blog card: `<article>` element
- Category filter: `role="tablist"` / `role="tab"` pattern
- Search: `<input type="search" aria-label="Search blog posts">`
- Pagination: `<nav aria-label="Blog pagination">` with `aria-current="page"` on active
- Images: Descriptive `alt` text per image
- Focus order: Breadcrumbs > Featured post > Tabs > Search > Cards > Pagination > CTA

### 1.9 RTL Considerations

- Featured post image/text columns swap
- Category tabs scroll direction natural
- Search icon moves to right side of input
- Pagination arrow buttons swap (Previous becomes right, Next becomes left)
- Card text alignment flips
- "Read Article" arrow flips direction

---

## 2. Blog Post Detail Page

### 2.1 Purpose and Conversion Goal

The blog post page delivers the content value while providing contextual conversion opportunities. The reading experience must be excellent -- clean typography, distraction-free, but with strategic CTA placement.

**Primary KPI:** Time on page (engagement), scroll depth.
**Secondary KPI:** CTA clicks (in-article and bottom CTA), related post clicks.

### 2.2 URL Structure

```
/en/blog/future-of-ai-in-mobile-development
/ar/blog/future-of-ai-in-mobile-development
```

### 2.3 SEO Metadata

```html
<title>[Post Title] | Aviniti Blog</title>
<meta name="description" content="[First 155 chars of excerpt]" />
<meta property="og:title" content="[Post Title]" />
<meta property="og:description" content="[Excerpt]" />
<meta property="og:image" content="[Featured image URL]" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-02-03T00:00:00Z" />
<meta property="article:author" content="Aviniti Team" />
<meta property="article:section" content="[Category]" />
<link rel="canonical" href="https://aviniti.com/en/blog/[slug]" />
```

**JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title]",
  "description": "[Excerpt]",
  "image": "[Featured image URL]",
  "author": { "@type": "Organization", "name": "Aviniti" },
  "publisher": {
    "@type": "Organization",
    "name": "Aviniti",
    "logo": { "@type": "ImageObject", "url": "[logo URL]" }
  },
  "datePublished": "2026-02-03",
  "dateModified": "2026-02-03"
}
```

### 2.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Blog > [Post Title]                           |
+------------------------------------------------------------------+
|                                                                    |
|                   max-w-[768px] centered                           |
|                                                                    |
|  [AI & Machine Learning]  category badge                           |
|                                                                    |
|  The Future of AI in Mobile                                        |
|  App Development                                                   |
|  (H1 heading)                                                      |
|                                                                    |
|  Feb 3, 2026 * 8 min read * By Aviniti Team                       |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |                                                              | |
|  |              Featured Image (16:9)                           | |
|  |                                                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  Article body content...                                           |
|                                                                    |
|  Paragraph text with proper typographic treatment.                 |
|  Links styled in bronze. Code blocks styled per design system.     |
|                                                                    |
|  ## Subheading (H2)                                                |
|                                                                    |
|  More paragraph content...                                         |
|                                                                    |
|  > Blockquote styled with left bronze border                       |
|                                                                    |
|  ### Sub-subheading (H3)                                           |
|                                                                    |
|  - Bullet list items                                               |
|  - Styled with bronze bullets                                      |
|                                                                    |
|  [Inline CTA banner: "Building an AI app? Get an estimate"]       |
|                                                                    |
|  More content...                                                   |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  SHARE: [LinkedIn] [Twitter/X] [Copy Link]                   | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  |  TAGS: #AI  #MobileDev  #Trends                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  RELATED POSTS                                                     |
|                                                                    |
|  +----------+  +----------+  +----------+                          |
|  | Related  |  | Related  |  | Related  |                          |
|  | Post 1   |  | Post 2   |  | Post 3   |                          |
|  +----------+  +----------+  +----------+                          |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CTA: Ready to build? [Get AI Estimate]                            |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 2.5 Article Typography System

The blog post body uses a constrained, readable layout centered at `max-w-[768px]` with the narrow container pattern.

| Element | Spec |
|---------|------|
| Container | `mx-auto w-full max-w-[768px] px-4 sm:px-6` |
| Category badge | `inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-bronze/15 text-bronze-light` |
| H1 (title) | `text-h1 text-white mt-4` (clamp 30-60px) |
| Meta line | `flex flex-wrap items-center gap-3 text-sm text-muted mt-4`. Separator: `text-muted-light` dot character |
| Featured image | `w-full aspect-[16/9] rounded-xl overflow-hidden mt-8`. Uses `next/image` with `priority`. |
| Body paragraphs | `text-base text-off-white leading-[1.75] mt-6` (generous 28px line-height for readability) |
| H2 | `text-h2 text-white mt-12 mb-4` |
| H3 | `text-h3 text-white mt-8 mb-3` |
| H4 | `text-h4 text-white mt-6 mb-2` |
| Links (inline) | `text-bronze underline-offset-4 hover:underline hover:text-bronze-light transition-colors` |
| Bold text | `font-semibold text-white` (slightly brighter than body for emphasis) |
| Italic | `italic` (no color change) |
| Blockquote | `border-l-2 border-bronze pl-6 text-lg italic text-off-white my-8` |
| Unordered list | `list-none space-y-2 my-6 pl-0`. Each item: `flex items-start gap-3`. Bronze dot: `h-1.5 w-1.5 rounded-full bg-bronze mt-2.5 flex-shrink-0`. Text: `text-base text-off-white` |
| Ordered list | `list-decimal list-inside space-y-2 my-6 text-off-white marker:text-bronze marker:font-semibold` |
| Code inline | `font-mono text-sm bg-slate-blue-light px-1.5 py-0.5 rounded text-bronze-light` |
| Code block | `font-mono text-sm bg-slate-dark p-4 rounded-lg text-off-white overflow-x-auto my-6 border border-slate-blue-light` |
| Image in body | `w-full rounded-xl my-8` with caption: `text-sm text-muted text-center mt-3 italic` |
| Horizontal rule | `h-px bg-gradient-to-r from-transparent via-slate-blue-light to-transparent my-12` (decorative gradient divider) |

#### Inline CTA Banner (mid-article)

Placed after approximately 40-60% of article content to catch engaged readers.

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-bronze/20 rounded-xl p-6 my-10` |
| Layout | `flex flex-col sm:flex-row items-center gap-4` |
| Text | `text-base font-medium text-white` -- "Thinking about building an AI-powered app?" |
| CTA | `Button variant="primary" size="md"` -- "Get Free Estimate" |

#### Share and Tags

| Element | Spec |
|---------|------|
| Share section | `flex items-center gap-4 mt-12 pt-6 border-t border-slate-blue-light`. Label: `text-sm font-medium text-muted` -- "Share this article". Buttons: Icon buttons (32x32) for LinkedIn, X/Twitter, Copy Link. Style: `h-8 w-8 rounded-lg bg-slate-blue-light text-muted hover:text-white hover:bg-slate-blue-light/80 transition-colors` |
| Tags | `flex flex-wrap gap-2 mt-6`. Each tag: Category Tag style from design system -- `px-2.5 py-1 rounded-sm text-xs font-medium uppercase tracking-wide bg-slate-blue-light text-muted hover:text-off-white transition-colors` |

#### Related Posts

| Element | Spec |
|---------|------|
| Section | Full-width, `bg-slate-dark py-12 md:py-20 mt-16` |
| Headline | `text-h3 text-white text-center` -- "Related Articles" |
| Grid | `grid grid-cols-1 md:grid-cols-3 gap-6 mt-10`, using standard Blog Post Card component |

### 2.6 Responsive Behavior

**Desktop:** 768px content width centered. Featured image full-width within container. Comfortable reading experience.
**Tablet:** Same narrow layout, slightly less padding.
**Mobile:** Full-width with `px-4` padding. Featured image full-bleed (rounded corners removed). Inline CTA banner stacks vertically. Share buttons: full-width row. Related posts: horizontal scroll or single column.

### 2.7 Accessibility

- Article wrapped in `<article>` element with `aria-labelledby` pointing to H1
- Heading hierarchy: H1 (title), H2-H4 (content headings). No skipped levels.
- Featured image: descriptive `alt` text
- Code blocks: `<pre><code>` with `aria-label="Code example"`
- Share buttons: `aria-label` on each -- "Share on LinkedIn", "Share on X", "Copy link"
- Inline CTA: not an intrusive popup -- it is part of the content flow, keyboard-accessible
- Related posts: each card is an `<article>` within a `<section aria-label="Related articles">`
- Reading experience: body text at 16px with 28px line-height ensures readability for users with dyslexia or low vision

### 2.8 RTL Considerations

- All text alignment flips
- Blockquote border moves from left to right
- Unordered list bronze dots move to right side
- Share section layout flips (label right, icons left)
- Code blocks: remain LTR (code is always LTR regardless of locale)
- Inline CTA: text flows right-to-left, button position adapts

---

## 3. Case Studies Listing Page

### 3.1 Purpose and Conversion Goal

Case studies serve as social proof. Despite NDA constraints (all stories are anonymized), they demonstrate real results with quantified outcomes. The listing page must make it easy to find relevant case studies by industry.

**User mindset:** "Show me proof that you deliver results." These visitors are evaluating credibility. They scan for relevant industries and impressive metrics.

**Primary KPI:** Case study detail page click-through.
**Secondary KPI:** CTA clicks from listing page.

### 3.2 URL Structure

```
/en/case-studies              (English)
/ar/case-studies              (Arabic)
/en/case-studies?industry=healthcare   (Filtered)
```

### 3.3 SEO Metadata

```html
<title>Case Studies - Real Results from Real Projects | Aviniti</title>
<meta name="description" content="Explore anonymized case studies showing real results: 40% faster processing, 3x conversions, 25% cost reduction. See what Aviniti can do for your business." />
<meta property="og:title" content="Case Studies | Aviniti" />
<meta property="og:description" content="Real results from real projects. See how businesses transformed with Aviniti." />
<link rel="canonical" href="https://aviniti.com/en/case-studies" />
```

### 3.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Case Studies                                  |
+------------------------------------------------------------------+
|                                                                    |
|                    Success Stories                                  |
|  Real results from real projects. Names changed to protect         |
|  client confidentiality.                                           |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  [All]  [Healthcare]  [E-Commerce]  [Logistics]  [Education]      |
|  [Restaurant]                                                      |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  +----------+   +----------+   +----------+                        |
|  |          |   |          |   |          |                        |
|  | HEALTH-  |   | E-COM-   |   | LOGIS-   |                        |
|  | CARE     |   | MERCE    |   | TICS     |                        |
|  |          |   |          |   |          |                        |
|  | Reduced  |   | 3x Conv. |   | Cut      |                        |
|  | Wait     |   | Rate     |   | Delivery |                        |
|  | Times    |   | with AI  |   | Costs    |                        |
|  | by 40%   |   | Recs     |   | by 25%   |                        |
|  |          |   |          |   |          |                        |
|  | [40%]    |   | [3x]     |   | [25%]    |                        |
|  | faster   |   | growth   |   | savings  |                        |
|  |          |   |          |   |          |                        |
|  | Read ->  |   | Read ->  |   | Read ->  |                        |
|  +----------+   +----------+   +----------+                        |
|                                                                    |
|  +----------+   +----------+                                       |
|  |          |   |          |                                       |
|  | EDUCA-   |   | RESTAU-  |                                       |
|  | TION     |   | RANT     |                                       |
|  |          |   |          |                                       |
|  | Parent   |   | Doubled  |                                       |
|  | Engage-  |   | Online   |                                       |
|  | ment 60% |   | Orders   |                                       |
|  |          |   |          |                                       |
|  | [60%]    |   | [2x]     |                                       |
|  | more     |   | orders   |                                       |
|  |          |   |          |                                       |
|  | Read ->  |   | Read ->  |                                       |
|  +----------+   +----------+                                       |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CTA: Facing a similar challenge?                                  |
|  [Get Your Estimate]   [Book a Consultation]                       |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 3.5 Content Hierarchy and Component Specs

#### Hero Section

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "CASE STUDIES" |
| Headline | `text-h1 text-white mt-3` -- "Success Stories" |
| Description | `text-lg text-muted mt-4 max-w-[600px] mx-auto text-center` -- "Real results from real projects. Names changed to protect client confidentiality." |
| Background | `bg-navy` |
| Padding | `py-16 md:py-24 text-center` |

#### Industry Filter

Uses the same Horizontal Tabs pattern as the blog. Categories: All, Healthcare, E-Commerce, Logistics, Education, Restaurant.

#### Case Study Cards Grid

| Element | Spec |
|---------|------|
| Grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| Card | Case Study Card from design system (Section 7.2) |

**Card anatomy:**

```
+------------------------------------------+
|  padding: 32px                           |
|                                          |
|  [icon] HEALTHCARE                       |
|  industry icon + uppercase label         |
|  text-xs text-muted uppercase tracking   |
|                                          |
|  Healthcare Startup Reduces              |
|  Wait Times by 40%                       |
|  text-xl font-semibold text-white        |
|                                          |
|  +--------------------------------------+|
|  |  bg-bronze/5 rounded-lg p-4          ||
|  |                                      ||
|  |  40%                                 ||
|  |  text-3xl font-bold text-bronze      ||
|  |                                      ||
|  |  faster patient processing           ||
|  |  text-sm text-muted                  ||
|  +--------------------------------------+|
|                                          |
|  Brief excerpt text here describing     |
|  the challenge and outcome...           |
|  text-sm text-muted line-clamp-2        |
|                                          |
|  [Read Case Study ->]                   |
|  text-bronze text-sm font-medium        |
|                                          |
+------------------------------------------+
```

Specific card values:

| Property | Value |
|----------|-------|
| Background | `bg-slate-blue` |
| Border | `border border-slate-blue-light` |
| Radius | `rounded-lg` (12px) |
| Padding | `p-8` (32px) |
| Shadow | `shadow-md` |
| Hover | `shadow-lg hover:-translate-y-1` |
| Transition | `transition-all duration-300` |
| Industry label | `flex items-center gap-2`. Icon: `h-5 w-5 text-muted`. Label: `text-xs font-medium text-muted uppercase tracking-[0.05em]` |
| Headline | `text-xl font-semibold text-white mt-4 line-clamp-2` |
| Metric container | `bg-bronze/5 rounded-lg p-4 mt-5` |
| Metric number | `text-3xl font-bold text-bronze` |
| Metric descriptor | `text-sm text-muted mt-1` |
| Excerpt | `text-sm text-muted mt-4 line-clamp-2` |
| CTA link | `inline-flex items-center gap-1.5 text-bronze text-sm font-medium mt-4` -- "Read Case Study" |

#### Bottom CTA

Same pattern as blog listing bottom CTA, adapted:

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Facing a Similar Challenge?" |
| Description | `text-base text-muted mt-3` -- "Let us show you what we can build for your business." |
| Primary CTA | "Get Your Estimate" |
| Secondary CTA | "Book a Consultation" |

### 3.6 Case Study Data Reference

| # | Industry | Slug | Headline | Key Metric | Metric Label | Icon (Lucide) |
|---|----------|------|----------|------------|--------------|---------------|
| 1 | Healthcare | `healthcare-wait-times` | "Healthcare Startup Reduces Wait Times by 40%" | "40%" | "faster patient processing" | `Heart` |
| 2 | E-Commerce | `ecommerce-ai-conversions` | "3x Conversion Rate with AI Recommendations" | "3x" | "conversion growth" | `ShoppingBag` |
| 3 | Logistics | `logistics-delivery-costs` | "Cut Delivery Costs by 25% with Route AI" | "25%" | "cost reduction" | `Truck` |
| 4 | Education | `education-parent-engagement` | "Increased Parent Engagement by 60%" | "60%" | "more engagement" | `GraduationCap` |
| 5 | Restaurant | `restaurant-online-orders` | "Doubled Online Orders in 3 Months" | "2x" | "order growth" | `Utensils` |

### 3.7 Responsive, Animation, Accessibility, RTL

**Responsive:** Same patterns as blog listing -- 3 cols desktop, 2 cols tablet, 1 col or horizontal scroll mobile.

**Animation:** Cards stagger fade-up on scroll, 80ms stagger, 500ms duration. Filter changes use `AnimatePresence`.

**Accessibility:** Same patterns as blog listing. Each card is `<article>`. Metric values have `aria-label` for screen readers (e.g., "40 percent faster patient processing").

**RTL:** Industry icon/label flex direction flips. Card text aligns right. "Read Case Study" arrow flips.

---

## 4. Case Study Detail Page

### 4.1 Purpose and Conversion Goal

The detail page tells the full anonymized success story. It follows the Challenge-Solution-Results narrative structure that builds credibility and creates empathy ("this could be my business").

**Primary KPI:** Bottom CTA clicks (Get Estimate, Book Consultation).
**Secondary KPI:** Time on page, scroll completion.

### 4.2 URL Structure

```
/en/case-studies/healthcare-wait-times
/ar/case-studies/healthcare-wait-times
```

### 4.3 SEO Metadata (Example: Healthcare)

```html
<title>Healthcare App Reduced Wait Times by 40% | Aviniti Case Study</title>
<meta name="description" content="How we helped a healthcare startup reduce patient wait times by 40% with a custom AI-powered appointment and queue management app." />
<meta property="og:type" content="article" />
<link rel="canonical" href="https://aviniti.com/en/case-studies/healthcare-wait-times" />
```

### 4.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Case Studies > Healthcare                     |
+------------------------------------------------------------------+
|                                                                    |
|  HERO                                                              |
|                                                                    |
|  [HEALTHCARE]  industry badge                                      |
|                                                                    |
|  How a Healthcare Startup Reduced                                  |
|  Patient Wait Times by 40%                                         |
|                                                                    |
|  +----------+  +----------+  +----------+  +----------+            |
|  | 40%      |  | 3 months |  | 2 apps   |  | $12K     |            |
|  | faster   |  | to build |  | delivered|  | invested |            |
|  +----------+  +----------+  +----------+  +----------+            |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|           max-w-[768px] centered                                   |
|                                                                    |
|  ## The Challenge                                                  |
|                                                                    |
|  Paragraphs describing the client background                       |
|  (anonymized), the problem they faced, and                        |
|  the business impact.                                              |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ## Our Solution                                                   |
|                                                                    |
|  What we built, key features, technologies                         |
|  used, and the development timeline.                               |
|                                                                    |
|  Tech stack badges: [React Native] [Node.js] [...]               |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ## The Results                                                    |
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | Before              |  After                                 | |
|  | 45 min wait         |  12 min wait                          | |
|  | 60% manual process  |  95% automated                        | |
|  | 3 complaints/day    |  0.5 complaints/day                   | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  > "The app transformed our operations..."                         |
|  > -- Operations Director, Healthcare Startup                      |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ## Key Takeaways                                                  |
|                                                                    |
|  * Insight 1                                                       |
|  * Insight 2                                                       |
|  * Insight 3                                                       |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CTA                                                               |
|  Facing a similar challenge?                                       |
|  [Get Your Estimate]  [Book a Consultation]                        |
|  Or ask about this project on WhatsApp                             |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  MORE CASE STUDIES                                                 |
|  +----------+  +----------+                                        |
|  | E-Com.   |  | Logist.  |                                        |
|  +----------+  +----------+                                        |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 4.5 Section Specifications

#### Hero Section

| Element | Spec |
|---------|------|
| Industry badge | `inline-flex px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-bronze/15 text-bronze-light` |
| Headline | `text-h1 text-white mt-4 max-w-[800px]` (centered or left-aligned on desktop) |
| Metrics bar | `grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-[900px] mx-auto` |
| Metric card | `bg-slate-blue border border-slate-blue-light rounded-lg p-5 text-center`. Number: `text-2xl font-bold text-bronze`. Label: `text-xs text-muted mt-1 uppercase tracking-wide` |
| Background | `bg-navy py-16 md:py-24 text-center` |

#### Body Sections (Challenge, Solution, Results, Takeaways)

Use the same narrow-content typography system as blog posts: `max-w-[768px]` centered.

| Element | Spec |
|---------|------|
| Section heading (H2) | `text-h2 text-white mt-16 mb-6` |
| Body text | Same typography as blog article body |
| Tech stack badges | `flex flex-wrap gap-2 my-6` using Tech Stack Badge pattern |

#### Before/After Comparison Table

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl overflow-hidden my-8` |
| Header row | `grid grid-cols-3 bg-slate-blue-light`. First col empty, second: `text-sm font-semibold text-muted text-center p-3` -- "Before", third: `text-sm font-semibold text-bronze text-center p-3` -- "After" |
| Data row | `grid grid-cols-3 border-t border-slate-blue-light`. Metric label: `text-sm text-off-white p-3`. Before value: `text-sm text-muted text-center p-3`. After value: `text-sm text-success font-semibold text-center p-3` |

#### Client Quote

| Element | Spec |
|---------|------|
| Blockquote | `border-l-4 border-bronze pl-6 my-10`. Quote text: `text-xl italic text-off-white leading-relaxed`. Attribution: `text-sm text-muted mt-4 not-italic` -- "-- Operations Director, Healthcare Startup" |

#### CTA Section

Same elevated container pattern as homepage Final CTA and solution detail pages.

| Element | Spec |
|---------|------|
| Headline | `text-h2 text-white` -- "Facing a Similar Challenge?" |
| Description | `text-lg text-muted mt-4` -- "Let us build a solution tailored to your needs." |
| Primary CTA | "Get Your Estimate" |
| Secondary CTA | "Book a Consultation" |
| WhatsApp | "Or ask about this project on WhatsApp" |

#### More Case Studies

| Element | Spec |
|---------|------|
| Section | `bg-slate-dark py-12 md:py-20` |
| Headline | `text-h3 text-white text-center` -- "More Success Stories" |
| Grid | `grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-[800px] mx-auto` using Case Study Card component |

### 4.6 Responsive, Animation, Accessibility, RTL

**Responsive:** Same as blog post -- narrow content width, full-width hero. Metrics bar: 2x2 on mobile, 4 cols on desktop. Before/After table: horizontally scrollable on mobile.

**Animation:** Hero metrics count up on load. Body sections fade up on scroll. Blockquote fades in with slight scale.

**Accessibility:** `<article>` wrapping. Proper heading hierarchy. Before/After table uses `<table>` with `<th scope="col">` headers. Quote uses `<blockquote>` with `<cite>`.

**RTL:** Text and layout directions flip. Before/After table column order stays semantic. Blockquote border moves to right.

---

## 5. FAQ Page

### 5.1 Purpose and Conversion Goal

The FAQ page answers common questions to reduce friction in the buyer's journey. It addresses objections (cost, timeline, process) and builds trust by being transparent.

**User mindset:** "I have questions before I commit." These visitors need reassurance. Every answer should reduce anxiety and subtly guide toward conversion.

**Primary KPI:** Reduction in "basic question" support inquiries.
**Secondary KPI:** CTA clicks from FAQ page, time on page.

### 5.2 URL Structure

```
/en/faq
/ar/faq
```

### 5.3 SEO Metadata

```html
<title>FAQ - Frequently Asked Questions | Aviniti</title>
<meta name="description" content="Get answers about Aviniti's app development process, pricing, timelines, technologies, and more. Everything you need to know before starting your project." />
<link rel="canonical" href="https://aviniti.com/en/faq" />
```

**JSON-LD (FAQ schema for rich results):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does it cost to build an app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our ready-made solutions start from $8,000..."
      }
    }
  ]
}
```

### 5.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > FAQ                                           |
+------------------------------------------------------------------+
|                                                                    |
|              Frequently Asked Questions                            |
|  Everything you need to know about working with Aviniti.           |
|                                                                    |
|  [Search FAQ...]                                                   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  +--- sidebar ---+  +--- main content -------------------+        |
|  |               |  |                                     |        |
|  | CATEGORIES    |  |  GENERAL                            |        |
|  |               |  |                                     |        |
|  | * General     |  |  v  What does Aviniti do?           |        |
|  | * Services    |  |     Answer text here...             |        |
|  | * Pricing     |  |                                     |        |
|  | * Process     |  |  >  Where is Aviniti based?         |        |
|  | * Technical   |  |                                     |        |
|  |               |  |  >  Do you sign NDAs?               |        |
|  |               |  |                                     |        |
|  |               |  |  PRICING                            |        |
|  |               |  |                                     |        |
|  |               |  |  >  How much does it cost?          |        |
|  |               |  |                                     |        |
|  |               |  |  >  Do you offer payment plans?     |        |
|  |               |  |                                     |        |
|  |               |  |  >  What's included in the price?   |        |
|  |               |  |                                     |        |
|  |               |  |  PROCESS                            |        |
|  |               |  |                                     |        |
|  |               |  |  >  How long does it take?          |        |
|  |               |  |                                     |        |
|  |               |  |  >  What is your process?           |        |
|  |               |  |                                     |        |
|  |               |  |  (more categories...)               |        |
|  |               |  |                                     |        |
|  +---------------+  +-------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  Still have questions?                                             |
|  [Chat with Avi]   [Contact Us]   [WhatsApp Us]                   |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 5.5 Content Hierarchy and Component Specs

#### Hero Section

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "FAQ" |
| Headline | `text-h1 text-white mt-3 text-center` -- "Frequently Asked Questions" |
| Description | `text-lg text-muted mt-4 max-w-[600px] mx-auto text-center` -- "Everything you need to know about working with Aviniti." |
| Search input | `h-12 px-4 py-3 bg-slate-blue border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light w-full max-w-[500px] mx-auto mt-8` with `Search` icon. Focus: `border-bronze ring-1 ring-bronze` |
| Background | `bg-navy` |
| Padding | `py-16 md:py-24 text-center` |

#### Sidebar + Main Content Layout

| Element | Spec |
|---------|------|
| Layout | `grid grid-cols-12 gap-8` within `max-w-[1320px]` container |
| Sidebar | `col-span-12 lg:col-span-3`. On desktop: `sticky top-20` (below navbar). On mobile: hidden (replaced by horizontal scroll tabs at top of main content). |
| Main content | `col-span-12 lg:col-span-9` |

**Sidebar Navigation:**

| Element | Spec |
|---------|------|
| Container | `space-y-1` |
| Item (inactive) | `block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-off-white hover:bg-slate-blue-light/40 transition-colors` |
| Item (active) | `text-bronze bg-bronze/10` |
| Click behavior | Smooth-scrolls to the corresponding category section in the main content |

**Accordion (Main Content):**

Each FAQ category is a group with a visible heading followed by accordion items.

| Element | Spec |
|---------|------|
| Category heading | `text-h4 text-white mt-12 first:mt-0 mb-4` with `id` for sidebar anchor links |
| Accordion container | `divide-y divide-slate-blue-light` using design system Accordion (Section 7.8) |
| Question (trigger) | `w-full flex justify-between items-center text-left py-4`. Question text: `text-base font-medium text-off-white group-hover:text-white transition-colors pr-4`. Chevron: `h-5 w-5 text-muted flex-shrink-0` -- rotates 180 degrees when open |
| Answer (panel) | `pb-4 text-sm text-muted leading-relaxed`. May contain links (bronze), lists, and inline emphasis. |
| Open/close animation | Height transition 300ms ease-in-out + opacity 200ms |
| Multiple open | Allow multiple accordions open simultaneously (not exclusive) |

### 5.6 FAQ Content

#### Category: General

**Q: What does Aviniti do?**
A: Aviniti is an AI and app development company based in Amman, Jordan. We help small and medium businesses digitally transform by building custom AI-powered applications and offering ready-made solution accelerators.

**Q: Where is Aviniti based?**
A: We are headquartered in Amman, Jordan, and serve clients globally across the MENA region and beyond.

**Q: Do you sign NDAs?**
A: Yes. We take confidentiality seriously and are happy to sign NDAs before any discussions. All our client relationships are protected by strict confidentiality agreements.

**Q: What industries do you serve?**
A: We work across healthcare, e-commerce, logistics, education, real estate, hospitality, fitness, and more. Our solutions are adaptable to virtually any industry.

#### Category: Services

**Q: What types of apps do you build?**
A: We build mobile apps (iOS and Android), web applications, AI/ML solutions, and cloud infrastructure. We handle everything from design to deployment.

**Q: What are your ready-made solutions?**
A: These are pre-built, customizable app systems for common business needs -- delivery, kindergarten management, hypermarket, office operations, gym management, rental platforms, and AI-powered health tools. They start from $8,000 and can be deployed in as few as 35 days.

**Q: Can I customize a ready-made solution?**
A: Absolutely. Every ready-made solution is designed as a foundation. We customize branding, features, integrations, and workflows to match your specific needs. Optional add-ons are available for advanced functionality.

**Q: Do you provide ongoing support after launch?**
A: Yes. All our packages include a post-launch support period (typically 3 months). We also offer extended maintenance and support plans.

#### Category: Pricing

**Q: How much does it cost to build an app?**
A: Our ready-made solutions start from $8,000. Custom projects typically range from $15,000 to $50,000+ depending on complexity. Use our [AI Estimate tool](/en/get-estimate) for a personalized quote in minutes.

**Q: Do you offer payment plans?**
A: Yes. We typically structure payments in milestones -- a portion at project kickoff, at design approval, at development milestones, and at launch. We can discuss flexible terms that work for your business.

**Q: What is included in the price?**
A: All prices include UI/UX design, development, testing, deployment to app stores, and a post-launch support period. Source code ownership is transferred to you. Hosting and third-party service costs are separate.

**Q: Are there any hidden costs?**
A: No. We believe in transparent pricing. Our AI estimator gives you a clear breakdown. Additional costs only arise if you request scope changes during development, and we always discuss these before proceeding.

#### Category: Process

**Q: How long does it take to build an app?**
A: Ready-made solutions deploy in 35-60 days. Custom projects typically take 8-16 weeks depending on complexity. Our AI estimator can give you a more specific timeline.

**Q: What is your development process?**
A: We follow an agile process: Discovery and Planning (Week 1-2), UI/UX Design (Week 2-3), Development in sprints (Week 3+), Testing and QA, and Launch. You are involved at every stage with regular updates and feedback cycles.

**Q: Will I own the source code?**
A: Yes. Upon project completion and final payment, full source code ownership is transferred to you. No lock-in, no licensing fees.

**Q: How do I get started?**
A: The easiest way is to use our [AI Estimate tool](/en/get-estimate) to get a quick project quote. You can also [book a free consultation call](/en/contact) or [message us on WhatsApp](https://wa.me/962XXXXXXXXX).

#### Category: Technical

**Q: What technologies do you use?**
A: We primarily use React Native for mobile apps, Next.js for web applications, Node.js for backends, Firebase and PostgreSQL for databases, and Google Cloud for AI/ML features. We choose the best stack for each project.

**Q: Do you build for both iOS and Android?**
A: Yes. We use React Native for cross-platform development, meaning your app works on both iOS and Android from a single codebase, reducing cost and development time.

**Q: Can you integrate with existing systems?**
A: Yes. We regularly integrate with ERPs, CRMs, payment gateways, logistics APIs, and other third-party systems. We assess integration requirements during the discovery phase.

**Q: Do you handle app store submissions?**
A: Yes. We handle the entire submission process for both Apple App Store and Google Play Store, including meeting all store guidelines and requirements.

### 5.7 Responsive Behavior

**Desktop (1024px+):** Sidebar sticky on left (3-col), main content right (9-col). Search centered above.
**Tablet (768px-1023px):** Sidebar hidden. Category navigation becomes horizontal scrollable tabs above the accordion content.
**Mobile (<768px):** Full single-column layout. Category tabs horizontally scrollable at top. Search full width. Accordion items take full width with generous tap targets (minimum 44px height on triggers).

### 5.8 Animation Specifications

| Element | Animation | Duration |
|---------|-----------|----------|
| Hero elements | Fade in + translateY, stagger | 400-600ms |
| Accordion open | Height expand + opacity fade in | 300ms ease-in-out |
| Accordion close | Height collapse + opacity fade out | 200ms ease-in |
| Sidebar highlight | Background color transition | 200ms |
| Search results filter | Instant (no animation on filter, just show/hide matching items) |

### 5.9 Accessibility

- Page uses `<main>` with `aria-label="FAQ"`
- Search: `<input type="search" role="searchbox" aria-label="Search frequently asked questions">`
- Sidebar: `<nav aria-label="FAQ categories">`
- Each category section: `<section aria-labelledby="category-heading-id">`
- Accordion: Each item uses the disclosure pattern:
  - Trigger: `<button aria-expanded="true/false" aria-controls="answer-id">`
  - Answer: `<div id="answer-id" role="region" aria-labelledby="question-id">`
- Keyboard: Enter/Space toggles accordion. Tab moves between triggers. Arrow keys navigate sidebar items.
- Screen readers: Questions announced as expandable buttons. Answers announced when expanded.
- Links in answers: Standard inline link treatment with `text-bronze`

### 5.10 RTL Considerations

- Sidebar moves from left to right side of layout
- Accordion chevron moves from right to left side of question
- Search icon position flips
- Category heading alignment flips
- Answer text flows right-to-left
- All interactive elements maintain correct reading order

### 5.11 Bottom CTA

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-8 md:p-12 text-center mt-16` |
| Headline | `text-h3 text-white` -- "Still Have Questions?" |
| Description | `text-base text-muted mt-3` -- "Our team is here to help. Choose your preferred way to reach us." |
| Buttons | `flex flex-col sm:flex-row items-center justify-center gap-3 mt-6` |
| Chat CTA | `Button variant="primary" size="md"` -- "Chat with Avi" (opens chatbot) |
| Contact CTA | `Button variant="outline" size="md"` -- "Contact Us" |
| WhatsApp CTA | `Button variant="ghost" size="md"` with WhatsApp icon -- "WhatsApp Us" |

---

**End of Content Pages Specification**
