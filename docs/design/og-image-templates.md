# Open Graph Image Templates - Design Specification

**Version:** 1.0
**Date:** February 2026
**Framework:** Next.js 14+ / @vercel/og
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technical Specifications](#2-technical-specifications)
3. [Template 1: Default (Homepage/Generic)](#3-template-1-default-homepagegeneric)
4. [Template 2: AI Tool Template](#4-template-2-ai-tool-template)
5. [Template 3: Solutions Template](#5-template-3-solutions-template)
6. [Template 4: Blog Post Template](#6-template-4-blog-post-template)
7. [Template 5: Case Study Template](#7-template-5-case-study-template)
8. [Implementation Guide](#8-implementation-guide)
9. [Dynamic Text Zones](#9-dynamic-text-zones)
10. [Assets Required](#10-assets-required)

---

## 1. Overview

### 1.1 Purpose

Open Graph (OG) images are the visual preview shown when sharing Aviniti pages on social media platforms (LinkedIn, Twitter, Facebook, WhatsApp). These images must:

- Instantly communicate brand identity through the dark navy + bronze aesthetic
- Clearly indicate the page content type (homepage, AI tool, blog post, etc.)
- Maintain legibility at small sizes (preview thumbnails)
- Follow platform best practices for engagement

### 1.2 Design Philosophy

All OG images share a consistent visual language:

- **Dark navy gradient background** (`#0F1419` to `#1A2332`) matching the website
- **Bronze accents** (`#C08460`) for logos, decorative elements, and highlights
- **Off-white text** (`#F4F4F2`) for maximum readability
- **Subtle geometric patterns** inspired by the Aviniti infinity logo
- **Generous whitespace** to avoid visual clutter
- **Clear hierarchy** with title as the dominant element

### 1.3 Platform Requirements

| Platform | Recommended Size | Aspect Ratio | Max File Size | Format |
|----------|-----------------|--------------|---------------|--------|
| Open Graph (Facebook, LinkedIn) | 1200x630px | 1.91:1 | 8MB | PNG, JPG |
| Twitter Card (Summary Large) | 1200x628px | 1.91:1 | 5MB | PNG, JPG |
| WhatsApp Preview | 1200x630px | 1.91:1 | -- | PNG, JPG |

**Decision:** Use a single 1200x630px template for all platforms. The 2px difference between OG and Twitter is negligible and not worth separate templates.

---

## 2. Technical Specifications

### 2.1 Image Dimensions

- **Width:** 1200px
- **Height:** 630px
- **Aspect Ratio:** 1.91:1 (landscape)
- **DPI:** 72 (web standard)
- **Color Space:** sRGB

### 2.2 Safe Zones

Social platforms may crop or overlay UI elements on OG images. Define safe zones:

```
+----------------------------------------------------------------+
|  ← 40px →                                          ← 40px →   |
|  ↑                                                             |
| 40px                     [SAFE ZONE]                           |
|  ↓                                                             |
|                                                                |
|           Logo area (top-left)       Badge area (top-right)   |
|                                                                |
|                                                                |
|                     Title text zone                            |
|                   (centered vertically)                        |
|                                                                |
|                                                                |
|           Subtitle/Meta zone (bottom-left)                     |
|                                                                |
|  ↑                                                             |
| 40px                                                           |
|  ↓                                                             |
+----------------------------------------------------------------+
```

**Safe zone padding:** 40px on all sides. Critical text (title, logo) must stay within this boundary.

### 2.3 Typography

All text uses **Inter** font family (loaded via @vercel/og).

| Element | Size | Weight | Color | Line Height | Max Characters |
|---------|------|--------|-------|-------------|----------------|
| Title | 64px | 700 (Bold) | `#F4F4F2` | 1.1 | 60 |
| Subtitle | 32px | 400 (Regular) | `#9CA3AF` | 1.3 | 100 |
| Meta Label | 24px | 500 (Medium) | `#C08460` | 1.2 | 30 |
| Body Text | 28px | 400 (Regular) | `#F4F4F2` | 1.4 | 120 |

**Character limits:** Enforce truncation with ellipsis (`…`) if dynamic text exceeds limits. This prevents layout breaks.

### 2.4 Color Palette

Reuse design system tokens:

| Token | Hex | Usage in OG |
|-------|-----|-------------|
| Deep Navy | `#0F1419` | Background gradient start |
| Slate Blue | `#1A2332` | Background gradient end |
| Bronze | `#C08460` | Logo, accent shapes, badges |
| Bronze Light | `#D4A583` | Decorative gradients |
| Off-White | `#F4F4F2` | Primary text |
| Muted | `#9CA3AF` | Secondary text |
| White | `#FFFFFF` | Logo text, high-emphasis elements |

### 2.5 File Output

- **Format:** PNG (supports transparency if needed in future)
- **Compression:** Optimize to ~150-250KB for fast loading
- **Naming:** Dynamic generation via Next.js route segments (`opengraph-image.tsx`)

---

## 3. Template 1: Default (Homepage/Generic)

### 3.1 Visual Layout

```
+----------------------------------------------------------------+
|                                                                |
|  [Aviniti Logo]                                    [Badge]     |
|  (Bronze infinity + text)                      "Premium AI"    |
|                                                                |
|                                                                |
|                                                                |
|                   Transform Your Vision into                   |
|                      AI-Powered Reality                        |
|                                                                |
|                                                                |
|               Custom AI solutions built with                   |
|                  precision and expertise                       |
|                                                                |
|                                                                |
|  aviniti.ai                                                    |
|                                                                |
+----------------------------------------------------------------+
```

### 3.2 Component Specifications

#### Background

- **Gradient:** Radial gradient from center
  - Center: `#1A2332` (Slate Blue)
  - Edges: `#0F1419` (Deep Navy)
  - CSS: `radial-gradient(ellipse at center, #1A2332 0%, #0F1419 70%)`
- **Decorative element:** Subtle geometric pattern overlay
  - Faint bronze infinity symbol watermark at 5% opacity in bottom-right quadrant
  - Position: `bottom: 60px, right: 80px`
  - Size: 240px x 240px
  - Opacity: `0.05`

#### Logo (Top-Left)

- **Position:** 40px from top, 40px from left
- **Content:** Aviniti logo (infinity symbol + "AVINITI" text)
- **Size:** Height 40px (auto width)
- **Color:** Bronze (`#C08460`) for symbol, White (`#FFFFFF`) for text

#### Badge (Top-Right)

- **Position:** 40px from top, 40px from right
- **Content:** "Premium AI" or "Est. 2024" or custom badge text
- **Style:**
  - Background: `rgba(192, 132, 96, 0.15)` (bronze glow)
  - Border: `1px solid rgba(192, 132, 96, 0.3)`
  - Padding: `12px 24px`
  - Border-radius: `8px`
  - Text: 20px, weight 500, color `#C08460`

#### Title (Center)

- **Position:** Centered horizontally, vertical center (approx 280px from top)
- **Content:** "Transform Your Vision into AI-Powered Reality"
- **Style:**
  - Font-size: 64px
  - Font-weight: 700
  - Color: `#F4F4F2`
  - Line-height: 1.1
  - Text-align: center
  - Max-width: 900px
  - Letter-spacing: -0.02em

#### Subtitle (Below Title)

- **Position:** 24px below title, centered
- **Content:** "Custom AI solutions built with precision and expertise"
- **Style:**
  - Font-size: 32px
  - Font-weight: 400
  - Color: `#9CA3AF`
  - Line-height: 1.3
  - Text-align: center
  - Max-width: 800px

#### Domain (Bottom-Left)

- **Position:** 40px from bottom, 40px from left
- **Content:** "aviniti.ai"
- **Style:**
  - Font-size: 24px
  - Font-weight: 500
  - Color: `#C08460`
  - Letter-spacing: 0.02em

### 3.3 Dynamic Text Zones

For the default template, all text is static (uses homepage tagline). However, the template can accept:

| Variable | Default Value | Max Length |
|----------|--------------|------------|
| `title` | "Transform Your Vision into AI-Powered Reality" | 60 chars |
| `subtitle` | "Custom AI solutions built with precision and expertise" | 100 chars |
| `badge` | "Premium AI" | 30 chars |

---

## 4. Template 2: AI Tool Template

### 4.1 Visual Layout

```
+----------------------------------------------------------------+
|                                                                |
|  [Aviniti Logo]                              [Tool Icon/Badge] |
|                                               "AI Tool"        |
|                                                                |
|                                                                |
|                                                                |
|                      [Tool Name]                               |
|                   Large, Prominent Title                       |
|                                                                |
|                                                                |
|                  Short tool description                        |
|                    (1-2 lines max)                             |
|                                                                |
|                                                                |
|  aviniti.ai                          [Tool-specific accent]    |
|                                                                |
+----------------------------------------------------------------+
```

### 4.2 Component Specifications

#### Background

- **Gradient:** Tool-specific gradient (diagonal)
  - **Idea Lab:** `linear-gradient(135deg, #431407 0%, #1A2332 70%, #0F1419 100%)`
  - **AI Analyzer:** `linear-gradient(135deg, #172554 0%, #1A2332 70%, #0F1419 100%)`
  - **Get Estimate:** `linear-gradient(135deg, #052E16 0%, #1A2332 70%, #0F1419 100%)`
  - **ROI Calculator:** `linear-gradient(135deg, #3B0764 0%, #1A2332 70%, #0F1419 100%)`
- **Decorative element:** Tool icon as subtle watermark
  - Position: Bottom-right
  - Size: 200px x 200px
  - Opacity: 0.08
  - Color: Tool accent color

#### Logo (Top-Left)

- Same as Template 1

#### Tool Badge (Top-Right)

- **Position:** 40px from top, 40px from right
- **Content:** Tool icon + "AI Tool" label
- **Style:**
  - Display: Horizontal flex (icon + text)
  - Icon size: 32px x 32px
  - Icon color: Tool-specific accent
    - Idea Lab: `#F97316` (orange-500)
    - AI Analyzer: `#3B82F6` (blue-500)
    - Get Estimate: `#22C55E` (green-500)
    - ROI Calculator: `#A855F7` (purple-500)
  - Gap: 12px
  - Text: "AI Tool" or tool category
  - Font-size: 22px, weight 600, color matching icon

**Icon mapping:**

| Tool | Lucide Icon | Color |
|------|------------|-------|
| Idea Lab | `Lightbulb` | `#F97316` |
| AI Idea Analyzer | `Brain` | `#3B82F6` |
| Get AI Estimate | `Calculator` | `#22C55E` |
| AI ROI Calculator | `TrendingUp` | `#A855F7` |

#### Tool Name (Center)

- **Position:** Centered, ~260px from top
- **Content:** Dynamic tool name
  - "Idea Lab"
  - "AI Idea Analyzer"
  - "Get AI Estimate"
  - "AI ROI Calculator"
- **Style:**
  - Font-size: 72px
  - Font-weight: 800
  - Color: `#FFFFFF` (pure white for max contrast)
  - Line-height: 1.0
  - Text-align: center
  - Letter-spacing: -0.03em
  - Optional: Subtle text shadow `0 2px 8px rgba(0,0,0,0.3)` for legibility on gradient

#### Tool Description (Below Name)

- **Position:** 28px below tool name, centered
- **Content:** Dynamic 1-2 line description
  - Idea Lab: "Transform ideas into actionable AI solutions instantly"
  - AI Analyzer: "Deep AI analysis of your product concept"
  - Get Estimate: "Instant AI-powered project estimates"
  - ROI Calculator: "Calculate the ROI of your AI investment"
- **Style:**
  - Font-size: 32px
  - Font-weight: 400
  - Color: `#9CA3AF`
  - Line-height: 1.35
  - Text-align: center
  - Max-width: 900px

#### Domain + Accent Line (Bottom)

- **Domain (Bottom-Left):**
  - Same as Template 1
- **Accent Line (Bottom):**
  - Horizontal gradient line spanning 60% width
  - Position: Bottom edge (20px from bottom)
  - Height: 3px
  - Gradient: `linear-gradient(90deg, transparent 0%, [tool-color] 50%, transparent 100%)`
  - Centered horizontally

### 4.3 Dynamic Text Zones

| Variable | Source | Max Length | Fallback |
|----------|--------|------------|----------|
| `toolName` | Tool page metadata | 40 chars | "AI Tool" |
| `toolDescription` | Tool page metadata | 90 chars | "Powered by Aviniti AI" |
| `toolIcon` | Tool identifier (enum) | -- | `Sparkles` (default) |
| `toolColor` | Tool identifier (enum) | -- | `#C08460` (bronze) |

---

## 5. Template 3: Solutions Template

### 5.1 Visual Layout

```
+----------------------------------------------------------------+
|                                                                |
|  [Aviniti Logo]                              "Ready Solution"  |
|                                                                |
|                                                                |
|                                                                |
|               [Solution Name/Title]                            |
|           E.g., "E-Commerce Platform"                          |
|                                                                |
|                                                                |
|            Short description of solution                       |
|              (what it does, who it's for)                      |
|                                                                |
|                                                                |
|  aviniti.ai                    [Industry Badge] [Price Badge]  |
|                                                                |
+----------------------------------------------------------------+
```

### 5.2 Component Specifications

#### Background

- **Gradient:** Diagonal gradient with bronze accent
  - CSS: `linear-gradient(135deg, #0F1419 0%, #1A2332 50%, rgba(192,132,96,0.1) 100%)`
  - Creates a subtle bronze glow in bottom-right
- **Decorative element:** Abstract geometric shapes
  - 2-3 overlapping circles/rectangles with rounded corners
  - Position: Scattered in background (top-right, bottom-left)
  - Colors: Bronze at 5-8% opacity
  - Sizes: 150px - 300px diameter/width

#### Logo (Top-Left)

- Same as Template 1

#### Category Badge (Top-Right)

- **Position:** 40px from top, 40px from right
- **Content:** "Ready Solution" or "Pre-Built Solution"
- **Style:** Same badge styling as Template 1 default

#### Solution Name (Center)

- **Position:** Centered, ~240px from top
- **Content:** Dynamic solution name
  - E.g., "AI-Powered E-Commerce Platform"
  - E.g., "Smart Inventory Management System"
- **Style:**
  - Font-size: 68px
  - Font-weight: 700
  - Color: `#F4F4F2`
  - Line-height: 1.1
  - Text-align: center
  - Max-width: 1000px
  - Letter-spacing: -0.02em

#### Solution Description (Below Name)

- **Position:** 24px below solution name, centered
- **Content:** 1-2 line description
  - E.g., "Full-featured online store with AI recommendations and analytics"
- **Style:**
  - Font-size: 30px
  - Font-weight: 400
  - Color: `#9CA3AF`
  - Line-height: 1.4
  - Text-align: center
  - Max-width: 900px

#### Metadata Badges (Bottom-Right)

- **Position:** 40px from bottom, 40px from right
- **Layout:** Horizontal flex row, gap 16px
- **Badges:**
  1. **Industry Badge**
     - Content: Industry icon + name (e.g., "Retail", "Healthcare")
     - Background: `rgba(192, 132, 96, 0.1)`
     - Border: `1px solid rgba(192, 132, 96, 0.3)`
     - Padding: `10px 20px`
     - Border-radius: `8px`
     - Text: 20px, weight 500, color `#C08460`
  2. **Price Badge** (optional)
     - Content: "From $X,XXX" or "Starting at $X,XXX"
     - Same styling as industry badge

#### Domain (Bottom-Left)

- Same as Template 1

### 5.3 Dynamic Text Zones

| Variable | Source | Max Length | Fallback |
|----------|--------|------------|----------|
| `solutionName` | Solution page title | 60 chars | "AI Solution" |
| `solutionDescription` | Solution page excerpt | 100 chars | "Ready-made solution by Aviniti" |
| `industry` | Solution metadata | 20 chars | -- |
| `priceLabel` | Solution metadata | 30 chars | -- |

---

## 6. Template 4: Blog Post Template

### 6.1 Visual Layout

```
+----------------------------------------------------------------+
|                                                                |
|  [Aviniti Logo]                                    "Blog"      |
|                                                                |
|                                                                |
|                                                                |
|                   [Blog Post Title]                            |
|              (Large, Multi-line if needed)                     |
|                                                                |
|                                                                |
|                                                                |
|  [Author Avatar]  Author Name                [Category Tag]    |
|                   Date · X min read                            |
|                                                                |
+----------------------------------------------------------------+
```

### 6.2 Component Specifications

#### Background

- **Gradient:** Clean vertical gradient
  - CSS: `linear-gradient(180deg, #0F1419 0%, #1A2332 100%)`
- **Decorative element:** Horizontal bronze accent line
  - Position: Top of image (just below logo area)
  - Width: 100%
  - Height: 2px
  - Gradient: `linear-gradient(90deg, transparent 0%, #C08460 30%, #C08460 70%, transparent 100%)`
  - Position: 100px from top

#### Logo (Top-Left)

- Same as Template 1

#### Blog Badge (Top-Right)

- **Position:** 40px from top, 40px from right
- **Content:** "Blog" or "Article"
- **Style:** Same badge styling as Template 1

#### Article Title (Center)

- **Position:** Centered horizontally, ~200px from top (higher than other templates to make room for author info)
- **Content:** Dynamic blog post title
- **Style:**
  - Font-size: 60px
  - Font-weight: 700
  - Color: `#F4F4F2`
  - Line-height: 1.15
  - Text-align: center
  - Max-width: 1000px
  - Letter-spacing: -0.015em
  - Supports 2-3 lines with truncation

#### Author Section (Bottom-Left)

- **Position:** 40px from bottom, 40px from left
- **Layout:** Horizontal flex, gap 16px, align center
- **Components:**
  1. **Avatar (optional):**
     - Size: 56px x 56px
     - Border-radius: 50% (circular)
     - Border: `2px solid #C08460`
     - If no avatar: Use initials in bronze circle
  2. **Author Info (Vertical stack):**
     - Author name: 24px, weight 600, color `#F4F4F2`
     - Meta line: "Feb 6, 2026 · 8 min read"
       - Font-size: 20px
       - Weight: 400
       - Color: `#9CA3AF`
       - Format: `{date} · {readTime} min read`

#### Category Tag (Bottom-Right)

- **Position:** 40px from bottom, 40px from right
- **Content:** Category name (e.g., "AI Development", "Case Study", "Industry Insights")
- **Style:**
  - Background: `rgba(192, 132, 96, 0.15)`
  - Border: `1px solid rgba(192, 132, 96, 0.4)`
  - Padding: `10px 24px`
  - Border-radius: `999px` (pill shape)
  - Text: 20px, weight 600, color `#C08460`
  - Text-transform: uppercase
  - Letter-spacing: 0.05em

### 6.3 Dynamic Text Zones

| Variable | Source | Max Length | Fallback |
|----------|--------|------------|----------|
| `postTitle` | Blog post title | 80 chars | "Article Title" |
| `authorName` | Post author metadata | 30 chars | "Aviniti Team" |
| `authorAvatar` | Author image URL | -- | Initials circle |
| `publishDate` | Post date | -- | Current date |
| `readTime` | Calculated from content | -- | "5 min read" |
| `category` | Post category | 25 chars | -- |

---

## 7. Template 5: Case Study Template

### 7.1 Visual Layout

```
+----------------------------------------------------------------+
|                                                                |
|  [Aviniti Logo]                              "Case Study"      |
|                                                                |
|                                                                |
|                                                                |
|             [Client/Project Name]                              |
|                                                                |
|                                                                |
|               Brief project tagline                            |
|                                                                |
|                                                                |
|  [Client Logo]          [Industry] · [Service Type]            |
|   (if available)                                               |
|                                                                |
+----------------------------------------------------------------+
```

### 7.2 Component Specifications

#### Background

- **Gradient:** Diagonal with bronze accent
  - CSS: `linear-gradient(135deg, #0F1419 0%, #1A2332 60%, rgba(192,132,96,0.08) 100%)`
- **Decorative element:** Success metric visualization
  - Subtle chart/graph abstract shape in background (bottom-right)
  - Color: Bronze at 6% opacity
  - Size: 280px x 180px
  - Icon: Simplified bar chart or upward trending line

#### Logo (Top-Left)

- Same as Template 1

#### Case Study Badge (Top-Right)

- **Position:** 40px from top, 40px from right
- **Content:** "Case Study" or "Success Story"
- **Style:** Same badge styling as Template 1

#### Client/Project Name (Center)

- **Position:** Centered, ~230px from top
- **Content:** Dynamic client name or project title
  - E.g., "TechCorp AI Transformation"
  - E.g., "E-Commerce Platform for RetailX"
- **Style:**
  - Font-size: 68px
  - Font-weight: 700
  - Color: `#F4F4F2`
  - Line-height: 1.1
  - Text-align: center
  - Max-width: 1000px
  - Letter-spacing: -0.02em

#### Project Tagline (Below Name)

- **Position:** 24px below client name, centered
- **Content:** 1-line summary of results/impact
  - E.g., "300% increase in conversion with AI recommendations"
  - E.g., "Reduced operational costs by 45% through automation"
- **Style:**
  - Font-size: 32px
  - Font-weight: 500
  - Color: `#C08460` (bronze for emphasis on results)
  - Line-height: 1.3
  - Text-align: center
  - Max-width: 900px

#### Client Logo (Bottom-Left)

- **Position:** 40px from bottom, 40px from left
- **Content:** Client logo image (if permission granted and available)
- **Size:** Max height 48px, auto width
- **Fallback:** If no client logo, show client name as text
  - Font-size: 28px, weight 600, color `#9CA3AF`

#### Metadata Tags (Bottom-Right)

- **Position:** 40px from bottom, 40px from right
- **Layout:** Horizontal flex, gap 12px
- **Content:** Industry · Service Type
  - E.g., "Healthcare · AI Development"
  - E.g., "Retail · E-Commerce Solution"
- **Style:**
  - Font-size: 22px
  - Weight: 500
  - Color: `#9CA3AF`
  - Separator: ` · ` (middle dot)

### 7.3 Dynamic Text Zones

| Variable | Source | Max Length | Fallback |
|----------|--------|------------|----------|
| `projectName` | Case study title | 60 chars | "Client Project" |
| `resultTagline` | Case study excerpt | 70 chars | "Successful AI implementation" |
| `clientLogo` | Client logo image URL | -- | Client name text |
| `clientName` | Case study metadata | 30 chars | "Client" |
| `industry` | Case study metadata | 20 chars | -- |
| `serviceType` | Case study metadata | 30 chars | "AI Development" |

---

## 8. Implementation Guide

### 8.1 Technology Stack

**Recommended:** Use `@vercel/og` for dynamic OG image generation.

#### Why @vercel/og?

- Dynamic text rendering with Inter font
- Edge runtime support (fast generation)
- JSX-based templates (easy to maintain)
- Automatic caching
- No external image generation services needed

#### Installation

```bash
npm install @vercel/og
```

### 8.2 Next.js App Router Structure

Each page that needs a custom OG image should have an `opengraph-image.tsx` file in its route directory.

**Example directory structure:**

```
app/
├── opengraph-image.tsx          (Default template)
├── (home)/
│   └── page.tsx
├── idea-lab/
│   ├── opengraph-image.tsx      (AI Tool template)
│   └── page.tsx
├── ai-analyzer/
│   ├── opengraph-image.tsx      (AI Tool template)
│   └── page.tsx
├── get-estimate/
│   ├── opengraph-image.tsx      (AI Tool template)
│   └── page.tsx
├── roi-calculator/
│   ├── opengraph-image.tsx      (AI Tool template)
│   └── page.tsx
├── solutions/
│   ├── opengraph-image.tsx      (Default template)
│   └── [slug]/
│       ├── opengraph-image.tsx  (Solutions template)
│       └── page.tsx
├── blog/
│   ├── opengraph-image.tsx      (Default template)
│   └── [slug]/
│       ├── opengraph-image.tsx  (Blog Post template)
│       └── page.tsx
└── case-studies/
    ├── opengraph-image.tsx      (Default template)
    └── [slug]/
        ├── opengraph-image.tsx  (Case Study template)
        └── page.tsx
```

### 8.3 Implementation Pattern

**File:** `app/opengraph-image.tsx` (Default template example)

```typescript
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Aviniti - Transform Your Vision into AI-Powered Reality';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Load Inter font
  const interBold = fetch(
    new URL('../../assets/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const interRegular = fetch(
    new URL('../../assets/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #1A2332 0%, #0F1419 70%)',
          position: 'relative',
        }}
      >
        {/* Logo (Top-Left) */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Logo SVG or image would go here */}
          <span style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>
            AVINITI
          </span>
        </div>

        {/* Badge (Top-Right) */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 40,
            background: 'rgba(192, 132, 96, 0.15)',
            border: '1px solid rgba(192, 132, 96, 0.3)',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: 20,
            fontWeight: 500,
            color: '#C08460',
          }}
        >
          Premium AI
        </div>

        {/* Title (Center) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 900,
            padding: '0 40px',
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#F4F4F2',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Transform Your Vision into AI-Powered Reality
          </h1>

          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: '#9CA3AF',
              lineHeight: 1.3,
              marginTop: 24,
            }}
          >
            Custom AI solutions built with precision and expertise
          </p>
        </div>

        {/* Domain (Bottom-Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            fontSize: 24,
            fontWeight: 500,
            color: '#C08460',
            letterSpacing: '0.02em',
          }}
        >
          aviniti.ai
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: await interRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
```

### 8.4 Dynamic Template Example

**File:** `app/blog/[slug]/opengraph-image.tsx` (Blog Post template with dynamic data)

```typescript
import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch post data
  const post = await getPostBySlug(params.slug);

  // Load fonts
  const interBold = fetch(
    new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const interRegular = fetch(
    new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  // Truncate title if too long
  const maxTitleLength = 80;
  const title = post.title.length > maxTitleLength
    ? post.title.slice(0, maxTitleLength) + '…'
    : post.title;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0F1419 0%, #1A2332 100%)',
          position: 'relative',
        }}
      >
        {/* Logo, badge, title, author section... */}
        {/* Use post.title, post.author, post.date, post.category */}

        <div style={{ /* Title styling */ }}>
          {title}
        </div>

        {/* Author info bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            display: 'flex',
            gap: 16,
          }}
        >
          <div style={{ /* Author name and date */ }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#F4F4F2' }}>
              {post.author}
            </div>
            <div style={{ fontSize: 20, color: '#9CA3AF' }}>
              {post.date} · {post.readTime} min read
            </div>
          </div>
        </div>

        {/* Category tag bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            background: 'rgba(192, 132, 96, 0.15)',
            border: '1px solid rgba(192, 132, 96, 0.4)',
            borderRadius: 999,
            padding: '10px 24px',
            fontSize: 20,
            fontWeight: 600,
            color: '#C08460',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {post.category}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter',
          data: await interRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return [
    {
      id: params.slug,
      alt: post.title,
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
    },
  ];
}
```

### 8.5 Metadata Integration

In the corresponding `page.tsx` file, ensure metadata references the OG image:

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getPostBySlug } from '@/lib/blog';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: `/blog/${params.slug}/opengraph-image`, // Next.js auto-generates this route
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`/blog/${params.slug}/opengraph-image`],
    },
  };
}
```

---

## 9. Dynamic Text Zones

### 9.1 Text Truncation Logic

All templates enforce maximum character limits to prevent layout breaks. Implement truncation helper:

```typescript
// lib/og-utils.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

// Usage in OG template
const title = truncateText(post.title, 80);
```

### 9.2 Fallback Values

Every dynamic field must have a sensible fallback:

| Field | Fallback Value | Reason |
|-------|---------------|--------|
| `title` | "Aviniti - AI Solutions" | Generic brand message |
| `description` | "Custom AI solutions built with expertise" | Brand tagline |
| `author` | "Aviniti Team" | Default attribution |
| `date` | Current date | Avoid showing blank |
| `category` | "Article" | Generic content type |
| `clientLogo` | Client name text | Not all clients provide logos |

### 9.3 Multi-line Text Handling

For titles that span multiple lines:

- Use `flex` layout with `flexDirection: 'column'`
- Set `textAlign: 'center'`
- Apply `maxWidth` to control line breaks
- Use `lineHeight: 1.1 - 1.2` for tight leading
- Test with 1-line, 2-line, and 3-line titles to ensure layout stability

---

## 10. Assets Required

### 10.1 Font Files

Store Inter font weights locally for OG generation (required by `@vercel/og`):

```
app/assets/fonts/
├── Inter-Regular.ttf     (400 weight)
├── Inter-Medium.ttf      (500 weight)
├── Inter-SemiBold.ttf    (600 weight)
├── Inter-Bold.ttf        (700 weight)
└── Inter-ExtraBold.ttf   (800 weight)
```

Download from [Google Fonts](https://fonts.google.com/specimen/Inter) or use the subset included in Next.js `@next/font`.

### 10.2 Logo Asset

**Aviniti logo** must be available as:

- **SVG inline code** (recommended for crispness at all sizes)
- Or **PNG** at 2x resolution (200px height minimum for 100px display)

**Approach:** Since `@vercel/og` has limited SVG support, consider:

1. Embedding logo as base64 PNG data URI
2. Or using separate logo image hosted at absolute URL
3. Or rendering logo text only with bronze color

**Example with text-only logo:**

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  {/* Bronze infinity symbol as SVG path (simplified) */}
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M..." fill="#C08460" />
  </svg>

  <span style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>
    AVINITI
  </span>
</div>
```

### 10.3 Icon Assets

For AI Tool templates, Lucide icons can be:

- Rendered as inline SVG paths
- Or sourced from `lucide-react` and converted to static SVG strings

**Example:**

```tsx
// Generate static SVG for Lightbulb icon
import { Lightbulb } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const lightbulbSvg = renderToStaticMarkup(
  <Lightbulb size={32} color="#F97316" strokeWidth={2} />
);

// Use in ImageResponse:
<div dangerouslySetInnerHTML={{ __html: lightbulbSvg }} />
```

### 10.4 Decorative Background Elements

For watermarks and geometric patterns:

- Use CSS gradients (preferred - lightweight)
- Or inline SVG shapes
- Keep opacity low (5-10%) to avoid visual noise

---

## 11. Testing and Validation

### 11.1 Testing Checklist

Before deploying OG images to production, validate:

- [ ] Renders correctly in Next.js dev environment (`localhost:3000`)
- [ ] All dynamic text renders without layout breaks
- [ ] Long titles truncate correctly with ellipsis
- [ ] Fallback values appear when dynamic data is missing
- [ ] Font weights load correctly (no FOUT/FOIT)
- [ ] File size is under 250KB (optimize if over)
- [ ] Background gradients render as expected
- [ ] Logo/icons are crisp and not pixelated
- [ ] Safe zones respected (no text cut off)

### 11.2 Social Platform Testing

Use these tools to preview OG images:

1. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
   - Paste page URL to see OG preview
   - Click "Scrape Again" to refresh cache

2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
   - Paste page URL
   - Verify summary_large_image renders correctly

3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
   - Paste page URL
   - Check OG image dimensions and text legibility

4. **WhatsApp:** Send link in chat to yourself
   - Preview appears automatically
   - Verify image loads and text is readable

### 11.3 Responsive Previews

OG images are fixed at 1200x630, but platforms may display them at different sizes. Test thumbnail legibility:

- Large preview (desktop): Full 1200x630
- Medium preview (mobile feed): ~400px width
- Small thumbnail (link preview): ~200px width

**Legibility test:** At 200px width, can you still read the title and identify the brand? If not, increase font sizes or reduce text.

### 11.4 Performance Testing

OG images are generated on-demand (first request) then cached. Test:

- **First load time:** Should be < 2 seconds
- **Cached load time:** Should be instant (served from CDN)
- **File size:** Aim for 150-250KB (compress if > 300KB)

Use Vercel Edge Network caching to ensure fast global delivery.

---

## 12. Accessibility Considerations

### 12.1 Alt Text

Every OG image must have descriptive alt text defined in the `alt` export:

```typescript
export const alt = 'Aviniti Idea Lab - Transform ideas into actionable AI solutions instantly';
```

**Formula:** `[Brand] [Page Type] - [Brief Description]`

Examples:

- Default: "Aviniti - Transform Your Vision into AI-Powered Reality"
- AI Tool: "Aviniti Idea Lab - AI-powered idea generation and analysis"
- Blog: "Aviniti Blog - [Post Title]"
- Case Study: "Aviniti Case Study - [Client] Success Story"

### 12.2 Text Contrast

All text must meet WCAG AA contrast ratios:

| Foreground | Background | Ratio | Pass? |
|-----------|-----------|-------|-------|
| `#F4F4F2` | `#0F1419` | 16.1:1 | Yes |
| `#9CA3AF` | `#0F1419` | 7.3:1 | Yes |
| `#C08460` | `#0F1419` | 5.8:1 | Yes (large text) |
| `#FFFFFF` | `#1A2332` | 14.2:1 | Yes |

### 12.3 No Text in Images (Semantic HTML)

While OG images contain text, ensure the actual page also has:

- Proper `<h1>` matching the OG image title
- Meta description matching the OG subtitle
- Structured content accessible to screen readers

OG images are visual previews only - never rely on them as the sole source of information.

---

## 13. Future Enhancements (Phase 2)

### 13.1 Video OG Previews

Platforms like LinkedIn and Facebook support video OG tags. Future iteration could include:

- Short 3-5 second animated intro (logo reveal + tagline)
- Subtle particle effects in background
- Tool-specific animations (e.g., idea bubbles for Idea Lab)

### 13.2 Localized OG Images

For Arabic (`/ar/`) routes, generate RTL OG images:

- Logo and domain on right side
- Text alignment: right
- Decorative elements mirrored
- Arabic typography (use Noto Sans Arabic or similar)

### 13.3 A/B Testing Templates

Test different template variations to optimize click-through rates:

- Variant A: Minimal text, large logo
- Variant B: Detailed description, smaller logo
- Variant C: Include testimonial quote or stat

Track engagement metrics in analytics to determine best-performing template per content type.

### 13.4 Automated Screenshot Fallback

If dynamic OG generation fails, automatically fall back to:

- Pre-generated static OG image for the page type
- Or default Aviniti OG image
- Log error for debugging

---

## 14. Summary and Quick Reference

### 14.1 Template Decision Tree

```
Is it a homepage or generic page?
├─ Yes → Use Template 1 (Default)
│
Is it an AI tool page (Idea Lab, Analyzer, Estimate, ROI)?
├─ Yes → Use Template 2 (AI Tool)
│
Is it a solution detail page?
├─ Yes → Use Template 3 (Solutions)
│
Is it a blog post?
├─ Yes → Use Template 4 (Blog Post)
│
Is it a case study?
├─ Yes → Use Template 5 (Case Study)
│
└─ Else → Use Template 1 (Default) as fallback
```

### 14.2 Template Color Schemes

| Template | Primary Gradient | Accent Color | Text Color |
|----------|-----------------|--------------|------------|
| Default | Radial (Navy to Slate) | Bronze | Off-White |
| AI Tool | Diagonal (Tool-dark to Navy) | Tool-specific | White + Muted |
| Solutions | Diagonal (Navy to Bronze glow) | Bronze | Off-White |
| Blog Post | Vertical (Navy to Slate) | Bronze | Off-White |
| Case Study | Diagonal (Navy to Bronze glow) | Bronze | Off-White + Bronze |

### 14.3 File Locations

```
app/
├── opengraph-image.tsx                    → Template 1 (Default)
├── idea-lab/opengraph-image.tsx           → Template 2 (Idea Lab variant)
├── ai-analyzer/opengraph-image.tsx        → Template 2 (Analyzer variant)
├── get-estimate/opengraph-image.tsx       → Template 2 (Estimate variant)
├── roi-calculator/opengraph-image.tsx     → Template 2 (ROI variant)
├── solutions/[slug]/opengraph-image.tsx   → Template 3
├── blog/[slug]/opengraph-image.tsx        → Template 4
└── case-studies/[slug]/opengraph-image.tsx → Template 5
```

### 14.4 Key Measurements

| Element | Size/Position | Applies To |
|---------|--------------|------------|
| Safe zone padding | 40px all sides | All templates |
| Logo height | 40px | All templates |
| Badge padding | 12px vertical, 24px horizontal | All templates |
| Title font size | 60-72px | All templates |
| Subtitle font size | 30-32px | All templates |
| Meta text font size | 20-24px | All templates |
| Image dimensions | 1200x630px | All templates |

---

**End of OG Image Templates Specification**

**Maintained by:** Aviniti Design Team
**Last Updated:** February 2026
**Version:** 1.0
**Status:** Ready for Implementation
