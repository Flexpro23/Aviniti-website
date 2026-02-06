# Aviniti Transactional Email Templates Design Specification

**Version:** 1.0
**Date:** February 2026
**Email Service:** Resend
**Templating Engine:** React Email
**Status:** Design Specification

---

## Table of Contents

1. [Overview](#1-overview)
2. [Brand Guidelines for Email](#2-brand-guidelines-for-email)
3. [Email Template Specifications](#3-email-template-specifications)
   - 3.1 [Contact Form Confirmation](#31-contact-form-confirmation)
   - 3.2 [AI Estimate Delivery](#32-ai-estimate-delivery)
   - 3.3 [Idea Lab Results](#33-idea-lab-results)
   - 3.4 [ROI Calculator Report](#34-roi-calculator-report)
   - 3.5 [AI Analyzer Results](#35-ai-analyzer-results)
   - 3.6 [Welcome / Lead Nurture](#36-welcome--lead-nurture)
4. [Technical Implementation](#4-technical-implementation)
5. [Environment Variables](#5-environment-variables)
6. [Testing Strategy](#6-testing-strategy)

---

## 1. Overview

### 1.1 Purpose

Transactional emails are critical touchpoints in the Aviniti user journey. These emails deliver AI tool results, confirm form submissions, and nurture leads. Each email must reinforce brand identity, provide clear value, and guide users toward the next conversion action.

### 1.2 Email Service Architecture

- **Provider:** Resend (https://resend.com)
- **Templating:** React Email (https://react.email)
- **Trigger Points:** Next.js API routes (`/api/ai/*`, `/api/contact`, `/api/exit-intent`)
- **Rendering:** Server-side HTML generation from React components
- **Localization:** All templates support English and Arabic (RTL)

### 1.3 Key Design Principles

1. **Brand Consistency:** Every email reflects the dark-theme Aviniti brand (navy background, bronze accents, off-white text)
2. **Mobile-First:** 60%+ of emails are read on mobile devices
3. **Clear Hierarchy:** Visual priority guides users to primary CTAs
4. **Accessibility:** WCAG AA contrast ratios, semantic HTML, alt text for all images
5. **Performance:** Inline CSS, optimized images, 600px max width for compatibility

---

## 2. Brand Guidelines for Email

### 2.1 Color Palette

All colors must work in both light and dark email clients. The design assumes a **dark theme** but provides fallbacks for clients that override dark mode.

| Token | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#0F1419` | Email background, header/footer background |
| Slate Blue | `#1A2332` | Card backgrounds, content sections |
| Slate Blue Light | `#243044` | Borders, dividers |
| Bronze | `#C08460` | Primary CTA buttons, logo accents, links |
| Bronze Hover | `#A6714E` | Button hover state (with `:hover` CSS) |
| Off-White | `#F4F4F2` | Body text |
| White | `#FFFFFF` | Headings, emphasis text |
| Muted | `#9CA3AF` | Secondary text, captions |

**AI Tool Accent Colors:**

| Tool | Accent | Usage |
|------|--------|-------|
| Idea Lab | `#F97316` (Orange) | Accent borders, icons |
| AI Analyzer | `#3B82F6` (Blue) | Accent borders, icons |
| Get AI Estimate | `#22C55E` (Green) | Accent borders, icons |
| ROI Calculator | `#A855F7` (Purple) | Accent borders, icons |

### 2.2 Typography

**Primary Font:** Inter (with web-safe fallbacks)

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
```

**Arabic Font:** Noto Sans Arabic (with fallbacks)

```css
font-family: 'Noto Sans Arabic', Inter, -apple-system, sans-serif;
```

**Type Scale:**

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| H1 (Hero Headline) | 28px | 700 | 1.2 | `#FFFFFF` |
| H2 (Section Title) | 22px | 600 | 1.3 | `#FFFFFF` |
| H3 (Subsection) | 18px | 600 | 1.4 | `#F4F4F2` |
| Body | 16px | 400 | 1.6 | `#F4F4F2` |
| Small / Caption | 14px | 400 | 1.5 | `#9CA3AF` |
| Button Text | 16px | 600 | 1 | `#FFFFFF` |

**Mobile adjustments:**

- H1: 24px
- H2: 20px
- Body: 16px (no change)

### 2.3 Layout Structure

Every email follows this structure:

```
┌─────────────────────────────────────┐
│  HEADER                             │
│  - Logo (left)                      │
│  - Tagline                          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  HERO SECTION                       │
│  - Headline                         │
│  - Subheadline / Preview            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  CONTENT BODY                       │
│  - Main content blocks              │
│  - Data / Results                   │
│  - Visual elements (cards, tables)  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  CTA SECTION                        │
│  - Primary button                   │
│  - Secondary link/button            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  FOOTER                             │
│  - Company info                     │
│  - Social links                     │
│  - Unsubscribe link                 │
│  - Legal disclaimer                 │
└─────────────────────────────────────┘
```

**Max width:** 600px (standard email client compatibility)
**Padding (mobile):** 20px
**Padding (desktop):** 32px

### 2.4 CTA Button Styles

**Primary Button (Bronze):**

```css
background-color: #C08460;
color: #FFFFFF;
font-size: 16px;
font-weight: 600;
padding: 14px 28px;
border-radius: 8px;
text-decoration: none;
display: inline-block;
border: none;
```

**Hover state:** `background-color: #A6714E;`

**Secondary Button (Outline):**

```css
background-color: transparent;
color: #C08460;
font-size: 16px;
font-weight: 600;
padding: 14px 28px;
border-radius: 8px;
border: 2px solid #C08460;
text-decoration: none;
display: inline-block;
```

**Hover state:** `background-color: rgba(192, 132, 96, 0.1);`

### 2.5 Header Component

**Logo placement:** Left-aligned, 160px width (SVG or PNG with @2x retina version)
**Logo file:** `aviniti-logo-horizontal-light.png` (bronze logo + white text)
**Tagline:** "YOUR IDEAS, OUR REALITY" (12px, uppercase, letter-spacing: 1px, color: `#9CA3AF`)
**Background:** `#0F1419`
**Padding:** 24px 32px
**Border-bottom:** 1px solid `#243044`

### 2.6 Footer Component

**Background:** `#0D1117` (Slate Dark - deeper than body)
**Padding:** 32px
**Text color:** `#9CA3AF`
**Link color:** `#C08460`

**Footer content blocks:**

1. **Company Info:**
   - Aviniti - AI & App Development
   - Amman, Jordan
   - Email: hello@aviniti.com
   - Phone: +962 79 068 5302
   - WhatsApp: +962 79 068 5302

2. **Social Links:**
   - LinkedIn: https://linkedin.com/company/aviniti
   - WhatsApp: https://wa.me/962790685302

3. **Legal:**
   - Privacy Policy link
   - Unsubscribe link
   - © 2026 Aviniti. All rights reserved.

4. **Disclaimer (small text, 12px):**
   - "This email was sent to {{email}} because you used one of our AI tools or contacted us via our website. You can unsubscribe at any time."

### 2.7 Arabic (RTL) Considerations

When `locale === 'ar'`:

- Set `dir="rtl"` on root `<html>` element
- Flip alignment: Left-aligned text becomes right-aligned
- Logo remains left-aligned (logos are directionally neutral)
- Button alignment: Center or full-width on mobile, right-aligned on desktop
- Number and email addresses remain LTR (use `<span dir="ltr">...</span>`)
- Increase line-height by 8% for Arabic text (multiply by 1.08)

### 2.8 Dark Mode Support

Resend/React Email generates inline CSS, which ensures consistent rendering across email clients. However, some clients (Outlook, Gmail dark mode) force background color overrides.

**Strategy:**

1. Use dark backgrounds by default (`#0F1419`, `#1A2332`)
2. For critical text, use high-contrast colors (`#FFFFFF`, `#F4F4F2`)
3. Provide `[data-ogsc]` and `[data-ogsb]` attributes for Outlook dark mode overrides
4. Test in Gmail dark mode, Apple Mail dark mode, Outlook desktop

**Example override:**

```css
[data-ogsc] .email-body {
  background-color: #0F1419 !important;
}
```

---

## 3. Email Template Specifications

---

## 3.1 Contact Form Confirmation

**Trigger:** User submits contact form via `/api/contact`
**Recipient:** User's email address
**Priority:** High (expected by user immediately after form submission)
**API Response Field:** `ticketId` (format: `AVN-XXXXXX`)

### Subject Line

**English:**
`✓ We received your message - Ticket #{{ticketId}}`

**Arabic:**
`✓ استلمنا رسالتك - تذكرة رقم {{ticketId}}`

### Preview Text

**English:**
"Thank you for contacting Aviniti. We'll respond within 24 hours."

**Arabic:**
"شكراً لتواصلك مع أفينيتي. سنرد خلال 24 ساعة."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
│ [Aviniti Logo] YOUR IDEAS, OUR REALITY
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO SECTION                         │
│ ✓ Message Received                   │
│ Thank you for reaching out!          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ TICKET INFO CARD                     │
│ Your ticket ID: AVN-2F8K3L           │
│ (Keep this for reference)            │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CONTENT                              │
│ We've received your message and our │
│ team will review it shortly.         │
│                                      │
│ Expected response time: 24 hours     │
│                                      │
│ Need immediate help?                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CTA SECTION                          │
│ [Chat on WhatsApp]   [View AI Tools] │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
│ Company info, social links, etc.     │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`✓ Message Received` (with checkmark emoji or icon)

**Subheadline:**
`Thank you for reaching out, {{name}}!`

**Arabic:**
Headline: `✓ تم استلام الرسالة`
Subheadline: `شكراً لتواصلك، {{name}}!`

#### Ticket Info Card

**Background:** `#1A2332` (Slate Blue)
**Border:** 2px solid `#C08460` (Bronze)
**Padding:** 20px
**Border-radius:** 12px

**Content:**

```
Your Ticket ID
AVN-{{ticketId}}

(Keep this for reference in future communications)
```

**Arabic:**

```
رقم تذكرتك
AVN-{{ticketId}}

(احتفظ بهذا الرقم للرجوع إليه في المستقبل)
```

**Ticket ID styling:**

- Font-size: 24px
- Font-weight: 700
- Color: `#FFFFFF`
- Letter-spacing: 2px
- Monospace font: `Courier New, monospace`

#### Main Content

**Copy (English):**

```
Hello {{name}},

We've successfully received your message and our team is reviewing it. You can expect a detailed response within 24 hours (usually much sooner during business hours).

Your inquiry was regarding: {{topic}}

Expected response time: Within 24 hours
Business hours: Sunday - Thursday, 9:00 AM - 6:00 PM (Jordan Time)

Need immediate help?
If your matter is urgent, you can reach us directly via WhatsApp for faster assistance.
```

**Copy (Arabic):**

```
مرحباً {{name}},

تم استلام رسالتك بنجاح وفريقنا يقوم بمراجعتها. يمكنك توقع رد مفصل خلال 24 ساعة (عادةً أسرع خلال ساعات العمل).

استفسارك كان بخصوص: {{topic}}

وقت الرد المتوقع: خلال 24 ساعة
ساعات العمل: الأحد - الخميس، 9:00 صباحاً - 6:00 مساءً (بتوقيت الأردن)

تحتاج مساعدة فورية؟
إذا كان أمرك عاجلاً، يمكنك التواصل معنا مباشرة عبر واتساب للحصول على مساعدة أسرع.
```

#### CTA Section

**Primary CTA:**

- Text: `Chat on WhatsApp`
- URL: `https://wa.me/962790685302?text=Hi, I submitted contact form ticket {{ticketId}}`
- Style: Primary button (Bronze)
- Icon: WhatsApp icon (left of text, 20px)

**Arabic:**
Text: `تحدث معنا على واتساب`

**Secondary CTA:**

- Text: `Explore AI Tools`
- URL: `https://aviniti.com/en#ai-tools` (or `/ar#ai-tools` for Arabic)
- Style: Text link (Bronze color, underline on hover)

**Arabic:**
Text: `استكشف أدوات الذكاء الاصطناعي`

### Mobile Responsive Notes

- Stack buttons vertically on screens < 480px
- Ticket ID card full-width with 16px padding
- Font sizes reduce by 10% on mobile
- Logo height: 32px (down from 40px on desktop)

### Dark Mode Considerations

- Background already dark (`#0F1419`)
- No special overrides needed
- Test in Gmail app (dark mode) and Apple Mail

---

## 3.2 AI Estimate Delivery

**Trigger:** User completes Get AI Estimate form via `/api/ai/estimate`
**Recipient:** User's email address
**Priority:** High
**Includes:** PDF attachment with full estimate breakdown
**API Response Fields:** `estimatedCost`, `estimatedTimeline`, `breakdown`, `keyInsights`, `matchedSolution`, `approach`

### Subject Line

**English:**
`Your AI Estimate: ${{cost.min}}–${{cost.max}} | {{timeline}} weeks`

**Arabic:**
`تقديرك بواسطة الذكاء الاصطناعي: ${{cost.min}}–${{cost.max}} | {{timeline}} أسابيع`

### Preview Text

**English:**
"Your personalized project estimate is ready. Review cost breakdown, timeline, and next steps."

**Arabic:**
"تقديرك الشخصي للمشروع جاهز. راجع تفاصيل التكلفة والجدول الزمني والخطوات التالية."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO                                 │
│ Your Project Estimate is Ready       │
│ [Project Type Badge]                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ PROJECT SUMMARY CARD                 │
│ Project Type: [Mobile App]           │
│ Features: [User Auth, Payments, ...]│
│ Timeline Preference: [Standard]      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ COST ESTIMATE HIGHLIGHT              │
│ Estimated Cost                       │
│ $12,000 – $18,000 USD                │
│                                      │
│ Estimated Timeline                   │
│ 8-12 weeks                           │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ PHASE BREAKDOWN TABLE                │
│ Phase | Duration | Cost              │
│ ----- | -------- | ----              │
│ Discovery & Planning | 1 week | $2K  │
│ UI/UX Design | 2 weeks | $3K         │
│ ...                                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ APPROACH RECOMMENDATION              │
│ (Custom / Ready-Made / Hybrid)       │
│ + Matched Solution (if applicable)   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ KEY INSIGHTS                         │
│ • Insight 1                          │
│ • Insight 2                          │
│ • Insight 3                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CTA SECTION                          │
│ [Book a Call to Discuss]             │
│ [Chat on WhatsApp]                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`Your Project Estimate is Ready, {{name}}!`

**Project Type Badge:**
Display project type as a colored badge (e.g., "Mobile App", "Web Application")

- Background: `#22C55E` (Green - Get Estimate accent)
- Color: `#0F1419` (Navy text on green - accessible contrast)
- Padding: 6px 12px
- Border-radius: 20px (pill shape)
- Font-size: 14px
- Font-weight: 600

**Arabic:**
Headline: `تقديرك للمشروع جاهز، {{name}}!`

#### Project Summary Card

**Background:** `#1A2332`
**Border-left:** 4px solid `#22C55E` (Green accent)
**Padding:** 24px
**Border-radius:** 12px

**Content (English):**

```
Project Summary

• Project Type: {{projectType}}
• Selected Features: {{features.join(', ')}}
• Timeline Preference: {{timeline}}
{{#if customFeatures}}
• Custom Features: {{customFeatures.join(', ')}}
{{/if}}
{{#if description}}
• Description: {{description}}
{{/if}}
```

**Arabic:**

```
ملخص المشروع

• نوع المشروع: {{projectType}}
• الميزات المحددة: {{features.join('، ')}}
• الجدول الزمني المفضل: {{timeline}}
{{#if customFeatures}}
• ميزات مخصصة: {{customFeatures.join('، ')}}
{{/if}}
{{#if description}}
• الوصف: {{description}}
{{/if}}
```

#### Cost Estimate Highlight

**Background:** Gradient from `#1A2332` to `#0F1419`
**Border:** 2px solid `#22C55E`
**Padding:** 32px
**Border-radius:** 16px
**Text-align:** Center

**Content (English):**

```
Estimated Cost
${{cost.min | formatNumber}} – ${{cost.max | formatNumber}} USD

Estimated Timeline
{{timeline.weeks}} weeks
```

**Styling for numbers:**

- Font-size: 36px
- Font-weight: 700
- Color: `#FFFFFF`
- Letter-spacing: -0.5px

**Label styling:**

- Font-size: 14px
- Font-weight: 600
- Color: `#9CA3AF`
- Text-transform: uppercase
- Letter-spacing: 1px

**Arabic:**

```
التكلفة المقدرة
${{cost.min | formatNumber}} – ${{cost.max | formatNumber}} USD

الجدول الزمني المقدر
{{timeline.weeks}} أسابيع
```

#### Phase Breakdown Table

**Table styling:**

- Background: `#1A2332`
- Border: 1px solid `#243044`
- Border-radius: 12px
- Full-width

**Header row:**

- Background: `#243044`
- Color: `#FFFFFF`
- Font-weight: 600
- Padding: 12px 16px

**Body rows:**

- Background: `#1A2332`
- Color: `#F4F4F2`
- Padding: 12px 16px
- Border-bottom: 1px solid `#243044` (except last row)

**Content (English):**

| Phase | Description | Duration | Cost |
|-------|-------------|----------|------|
| {{phase}} - {{name}} | {{description}} | {{duration}} | ${{cost | formatNumber}} |
| ... | ... | ... | ... |
| **Total** |  | **{{totalWeeks}} weeks** | **${{totalCost | formatNumber}}** |

**Arabic:**

| المرحلة | الوصف | المدة | التكلفة |
|-------|-------|------|---------|
| {{phase}} - {{name}} | {{description}} | {{duration}} | ${{cost | formatNumber}} |
| ... | ... | ... | ... |
| **المجموع** |  | **{{totalWeeks}} أسابيع** | **${{totalCost | formatNumber}}** |

**Mobile responsive:**

- Hide "Description" column on screens < 480px
- Stack phase name and cost vertically

#### Approach Recommendation

**Display based on `approach` value:**

**If `approach === 'ready-made'`:**

**Headline:**
`💡 Great News: We Have a Ready-Made Solution!`

**Content:**

```
Your project closely matches our {{matchedSolution.name}}. This pre-built solution covers {{matchedSolution.featureMatchPercentage}}% of your requirements and can be deployed in just {{matchedSolution.deploymentTimeline}}.

Starting Price: ${{matchedSolution.startingPrice | formatNumber}}
Deployment: {{matchedSolution.deploymentTimeline}}

This ready-made solution could save you {{savingsPercentage}}% in cost and get you to market 60% faster than a fully custom build.
```

**CTA:** `Learn More About {{matchedSolution.name}}`
**URL:** `https://aviniti.com/en/solutions/{{matchedSolution.slug}}`

**Arabic:**

Headline: `💡 خبر سار: لدينا حل جاهز!`

**If `approach === 'hybrid'`:**

**Headline:**
`Recommended: Hybrid Approach`

**Content:**

```
We recommend starting with our {{matchedSolution.name}} as a foundation and customizing it to your specific needs. This hybrid approach balances speed and flexibility.
```

**If `approach === 'custom'`:**

**Headline:**
`Recommended: Fully Custom Development`

**Content:**

```
Your project requires a fully custom solution to meet your unique requirements. This approach gives you maximum flexibility and a tailor-made product.
```

#### Key Insights

**Headline:**
`Key Insights from Our AI Analysis`

**Arabic:**
`رؤى رئيسية من تحليلنا بالذكاء الاصطناعي`

**List styling:**

- Each insight as a bullet point
- Color: `#F4F4F2`
- Font-size: 16px
- Line-height: 1.6
- Bullet color: `#22C55E`

**Content:**

```
{{#each keyInsights}}
• {{this}}
{{/each}}
```

#### CTA Section

**Primary CTA:**

- Text: `Book a Call to Discuss Your Project`
- URL: `https://calendly.com/aliodat-aviniti/30min`
- Style: Primary button (Bronze)
- Width: Full-width on mobile, auto on desktop

**Secondary CTA:**

- Text: `Chat on WhatsApp`
- URL: `https://wa.me/962790685302?text=Hi, I received my estimate for {{projectType}}. Can we discuss?`
- Style: Secondary button (Outline)
- Icon: WhatsApp icon

**Tertiary Link:**

- Text: `Download Estimate as PDF`
- URL: Attachment (see note below)
- Style: Text link with download icon
- Color: `#C08460`

**Arabic:**
Primary: `احجز مكالمة لمناقشة مشروعك`
Secondary: `تحدث معنا على واتساب`
Tertiary: `تحميل التقدير بصيغة PDF`

**PDF Attachment Note:**

The PDF should be generated server-side using a library like `@react-pdf/renderer` or Puppeteer to render the estimate as a downloadable PDF. Include the same information as the email body but in a print-friendly format.

**Filename:** `Aviniti-Estimate-{{name}}-{{date}}.pdf`

### Mobile Responsive Notes

- Table converts to stacked cards on mobile
- Cost/timeline highlight: Reduce font-size to 28px
- CTA buttons: Full-width, stack vertically with 12px gap

### Dark Mode Considerations

- Green accent (`#22C55E`) has excellent contrast on dark backgrounds
- Table borders remain visible in all modes

---

## 3.3 Idea Lab Results

**Trigger:** User completes Idea Lab form via `/api/ai/idea-lab`
**Recipient:** User's email address
**Priority:** High
**API Response Fields:** `ideas` (array), `context`

### Subject Line

**English:**
`✨ 6 Personalized App Ideas - Just for You`

**Arabic:**
`✨ 6 أفكار تطبيقات مخصصة - مصممة لك`

### Preview Text

**English:**
"We've generated 6 unique app ideas based on your profile. Each one is ready to explore."

**Arabic:**
"قمنا بإنشاء 6 أفكار تطبيقات فريدة بناءً على ملفك الشخصي. كل واحدة جاهزة للاستكشاف."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO                                 │
│ Your Personalized App Ideas          │
│ Based on your unique profile         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CONTEXT SUMMARY                      │
│ Background: [Entrepreneur]           │
│ Industry: [Health & Wellness]        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ IDEA CARD 1                          │
│ [Icon] App Name                      │
│ Description...                       │
│ • Feature 1                          │
│ • Feature 2                          │
│ • Feature 3                          │
│ Cost: $X,XXX - $X,XXX | Timeline     │
│ [Explore This Idea] [Get Estimate]   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ IDEA CARD 2                          │
│ ...                                  │
└──────────────────────────────────────┘

[ ... 4 more idea cards ... ]

┌──────────────────────────────────────┐
│ CROSS-SELL CTA                       │
│ Ready to validate one of these?      │
│ [Use AI Idea Analyzer]               │
│ [Get a Cost Estimate]                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`Your Personalized App Ideas are Ready! ✨`

**Subheadline:**
`Based on your profile, we've generated 6 unique app ideas tailored to your background and industry.`

**Arabic:**
Headline: `أفكار تطبيقاتك المخصصة جاهزة! ✨`
Subheadline: `بناءً على ملفك الشخصي، قمنا بإنشاء 6 أفكار تطبيقات فريدة مصممة خصيصاً لك.`

#### Context Summary Card

**Background:** `#1A2332`
**Border-left:** 4px solid `#F97316` (Orange - Idea Lab accent)
**Padding:** 20px
**Border-radius:** 12px

**Content (English):**

```
Your Profile Summary

• Background: {{context.background}}
• Industry: {{context.industry}}
```

**Arabic:**

```
ملخص ملفك الشخصي

• الخلفية: {{context.background}}
• الصناعة: {{context.industry}}
```

#### Idea Card

**Each idea is a distinct card. Render 5-6 cards based on API response.**

**Card styling:**

- Background: `#1A2332`
- Border: 2px solid `#243044`
- Border-radius: 16px
- Padding: 24px
- Margin-bottom: 20px

**Hover effect (if email client supports):**

- Border-color: `#F97316` (Orange accent)

**Content structure:**

```
┌──────────────────────────────────────┐
│ [Icon] {{idea.name}}                 │  ← Headline
│                                      │
│ {{idea.description}}                 │  ← Body text
│                                      │
│ Key Features:                        │
│ ✓ {{feature1}}                       │
│ ✓ {{feature2}}                       │
│ ✓ {{feature3}}                       │
│                                      │
│ Estimated Cost: ${{min}}–${{max}}    │
│ Timeline: {{timeline}}               │
│                                      │
│ {{#if matchedSolution}}              │
│ 💡 Matches: {{matchedSolution.name}} │
│ {{/if}}                              │
│                                      │
│ [Explore This Idea] [Get Estimate]   │
└──────────────────────────────────────┘
```

**Icon:** Use a generic app icon or emoji relevant to the idea (e.g., 🏥 for healthcare, 🛒 for e-commerce). Size: 40px, float left of app name.

**App Name:**

- Font-size: 20px
- Font-weight: 700
- Color: `#FFFFFF`
- Margin-bottom: 12px

**Description:**

- Font-size: 16px
- Font-weight: 400
- Color: `#F4F4F2`
- Line-height: 1.6
- Margin-bottom: 16px

**Features List:**

- Color: `#F4F4F2`
- Font-size: 15px
- Line-height: 1.5
- Checkmark icon: `✓` in `#F97316` (Orange)

**Cost & Timeline:**

- Font-size: 14px
- Color: `#9CA3AF`
- Font-weight: 500

**Matched Solution Badge (conditional):**

If `matchedSolution` exists:

- Background: `#431407` (Orange dark tint)
- Color: `#FDBA74` (Orange light)
- Padding: 8px 12px
- Border-radius: 8px
- Font-size: 13px
- Margin-top: 12px

**Content:**

```
💡 Great match: This idea aligns {{matchedSolution.featureMatchPercentage}}% with our {{matchedSolution.name}} ready-made solution. Deploy in {{matchedSolution.deploymentTimeline}} for ${{matchedSolution.startingPrice}}.
```

**CTAs (per idea):**

**Primary CTA:**

- Text: `Explore This Idea`
- URL: `https://aviniti.com/en/ai-analyzer?sourceIdea={{idea.id}}&idea={{idea.name | urlencode}}`
- Style: Primary button (Bronze)
- Size: Small (padding: 10px 20px, font-size: 14px)

**Secondary CTA:**

- Text: `Get Estimate`
- URL: `https://aviniti.com/en/estimate`
- Style: Text link (Bronze)
- Font-size: 14px

**Arabic:**
Primary: `استكشف هذه الفكرة`
Secondary: `احصل على تقدير`

**Mobile Responsive:**

- Stack buttons vertically
- Icon size: 32px

#### Cross-Sell CTA Section

**Background:** Gradient from `#1A2332` to `#0F1419`
**Padding:** 32px
**Border-radius:** 12px
**Text-align:** Center

**Headline:**
`Love one of these ideas?`

**Subheadline:**
`Take the next step: validate it with our AI Analyzer or get a detailed cost estimate.`

**Arabic:**
Headline: `أعجبتك إحدى هذه الأفكار؟`
Subheadline: `اتخذ الخطوة التالية: تحقق من صحتها باستخدام محلل الذكاء الاصطناعي أو احصل على تقدير مفصل للتكلفة.`

**CTAs:**

**Button 1:**

- Text: `Use AI Idea Analyzer`
- URL: `https://aviniti.com/en/ai-analyzer`
- Style: Primary button (Blue accent - `#3B82F6`)
- Color: `#FFFFFF`
- Width: 48% (side-by-side on desktop)

**Button 2:**

- Text: `Get a Cost Estimate`
- URL: `https://aviniti.com/en/estimate`
- Style: Primary button (Green accent - `#22C55E`)
- Color: `#0F1419` (Navy text on green)
- Width: 48%

**Arabic:**
Button 1: `استخدم محلل أفكار الذكاء الاصطناعي`
Button 2: `احصل على تقدير التكلفة`

**Mobile:**

- Stack buttons vertically, full-width

### Mobile Responsive Notes

- Idea cards: Full-width, single column
- Reduce padding to 16px on mobile
- Font sizes: H2 down to 18px, body remains 16px

### Dark Mode Considerations

- Orange accent (`#F97316`) is vibrant on dark backgrounds
- Feature checkmarks use orange color for visual consistency

---

## 3.4 ROI Calculator Report

**Trigger:** User completes ROI Calculator via `/api/ai/roi-calculator`
**Recipient:** User's email address
**Priority:** High
**Includes:** PDF attachment with full ROI report
**API Response Fields:** `annualROI`, `paybackPeriodMonths`, `roiPercentage`, `breakdown`, `yearlyProjection`, `costVsReturn`, `aiInsight`

### Subject Line

**English:**
`📊 Your ROI Report: {{roiPercentage}}% return | {{paybackPeriodMonths}}-month payback`

**Arabic:**
`📊 تقرير العائد على الاستثمار: {{roiPercentage}}% عائد | {{paybackPeriodMonths}} شهر استرداد`

### Preview Text

**English:**
"Your app could generate ${{annualROI | formatNumber}} in annual returns. See the full breakdown."

**Arabic:**
"يمكن لتطبيقك أن يحقق ${{annualROI | formatNumber}} عوائد سنوية. شاهد التفصيل الكامل."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO                                 │
│ Your ROI Report is Ready             │
│ [Purple accent]                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ROI HIGHLIGHT CARD                   │
│ Annual ROI: $XX,XXX                  │
│ ROI Percentage: XXX%                 │
│ Payback Period: X months             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ AI INSIGHT                           │
│ {{aiInsight}}                        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ BREAKDOWN TABLE                      │
│ Labor Savings: $XX,XXX               │
│ Error Reduction: $X,XXX              │
│ Revenue Increase: $X,XXX             │
│ Time Recovered: X,XXX hours          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ COST VS RETURN COMPARISON            │
│ App Cost: $X,XXX - $XX,XXX           │
│ Year 1 Return: $XX,XXX               │
│ 3-Year Return: $XXX,XXX              │
│ [Visual bar chart representation]    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CTA SECTION                          │
│ [Let's Build This] [Download PDF]    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`Your ROI Report is Ready, {{name}}! 📊`

**Subheadline:**
`Here's what an app could do for your business`

**Arabic:**
Headline: `تقرير العائد على الاستثمار جاهز، {{name}}! 📊`
Subheadline: `إليك ما يمكن أن يفعله التطبيق لعملك`

#### ROI Highlight Card

**Background:** Gradient from `#3B0764` (Purple dark) to `#1A2332`
**Border:** 2px solid `#A855F7` (Purple accent)
**Padding:** 32px
**Border-radius:** 16px
**Text-align:** Center

**Content (English):**

```
Estimated Annual ROI
${{annualROI | formatNumber}} {{currency}}

ROI Percentage
{{roiPercentage}}%

Payback Period
{{paybackPeriodMonths}} months
```

**Number styling:**

- Font-size: 42px (annual ROI), 36px (others)
- Font-weight: 700
- Color: `#FFFFFF`

**Label styling:**

- Font-size: 14px
- Font-weight: 600
- Color: `#D8B4FE` (Purple light)
- Text-transform: uppercase
- Letter-spacing: 1px

**Arabic:**

```
العائد السنوي المقدر
${{annualROI | formatNumber}} {{currency}}

نسبة العائد على الاستثمار
{{roiPercentage}}%

فترة استرداد التكلفة
{{paybackPeriodMonths}} أشهر
```

#### AI Insight

**Background:** `#1A2332`
**Border-left:** 4px solid `#A855F7` (Purple)
**Padding:** 24px
**Border-radius:** 12px
**Icon:** 💡 emoji or lightbulb icon

**Headline:**
`Key Insight`

**Content:**

```
{{aiInsight}}
```

**Styling:**

- Font-size: 16px
- Line-height: 1.6
- Color: `#F4F4F2`
- Font-style: Normal (not italic)

**Arabic:**
Headline: `رؤية رئيسية`

#### Breakdown Table

**Background:** `#1A2332`
**Border:** 1px solid `#243044`
**Border-radius:** 12px

**Content (English):**

| Category | Annual Savings/Revenue |
|----------|------------------------|
| 💰 Labor Savings | ${{breakdown.laborSavings | formatNumber}} |
| ✓ Error Reduction | ${{breakdown.errorReduction | formatNumber}} |
| 📈 Revenue Increase | ${{breakdown.revenueIncrease | formatNumber}} |
| ⏱️ Time Recovered | {{breakdown.timeRecovered | formatNumber}} hours |
| **Total Annual ROI** | **${{annualROI | formatNumber}}** |

**Arabic:**

| الفئة | الوفورات/الإيرادات السنوية |
|-------|---------------------------|
| 💰 توفير العمالة | ${{breakdown.laborSavings | formatNumber}} |
| ✓ تقليل الأخطاء | ${{breakdown.errorReduction | formatNumber}} |
| 📈 زيادة الإيرادات | ${{breakdown.revenueIncrease | formatNumber}} |
| ⏱️ الوقت المسترد | {{breakdown.timeRecovered | formatNumber}} ساعة |
| **إجمالي العائد السنوي** | **${{annualROI | formatNumber}}** |

**Styling:**

- Header row: Background `#243044`, Color `#FFFFFF`
- Body rows: Alternating backgrounds (`#1A2332` and `#1A2332` with slight opacity variation)
- Numbers: Font-weight 600, Color `#FFFFFF`
- Icons: 20px, left-aligned before text

**Mobile:**

- Convert to stacked cards, hide table borders

#### Cost vs Return Comparison

**Section headline:**
`Investment Comparison`

**Arabic:**
`مقارنة الاستثمار`

**Visual representation:**

Display a **text-based bar chart** (email clients have limited CSS support for complex visualizations):

**Content (English):**

```
App Development Cost:    ${{costVsReturn.appCost.min | formatNumber}} – ${{costVsReturn.appCost.max | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [25% bar width]

Year 1 Return:           ${{costVsReturn.year1Return | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [60% bar width]

3-Year Cumulative Return: ${{costVsReturn.year3Return | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ [100% bar width]
```

**Bar styling:**

- Character: `━` (Unicode box drawing)
- Color: `#A855F7` (Purple)
- Labels: Font-size 14px, Color `#F4F4F2`
- Numbers: Font-weight 600, Color `#FFFFFF`

**Alternative (if HTML bars supported):**

Use `<div>` elements with background colors and widths proportional to values.

**Arabic:**

```
تكلفة تطوير التطبيق:    ${{costVsReturn.appCost.min | formatNumber}} – ${{costVsReturn.appCost.max | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

عائد السنة الأولى:       ${{costVsReturn.year1Return | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

العائد التراكمي لـ 3 سنوات: ${{costVsReturn.year3Return | formatNumber}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### CTA Section

**Primary CTA:**

- Text: `Let's Build This`
- URL: `https://aviniti.com/en/estimate`
- Style: Primary button (Bronze)

**Secondary CTA:**

- Text: `Book a Consultation`
- URL: `https://calendly.com/aliodat-aviniti/30min`
- Style: Secondary button (Outline)

**Tertiary Link:**

- Text: `Download Full Report (PDF)`
- URL: Attachment
- Style: Text link with download icon
- Color: `#C08460`

**Arabic:**
Primary: `لنبني هذا`
Secondary: `احجز استشارة`
Tertiary: `تحميل التقرير الكامل (PDF)`

### Mobile Responsive Notes

- ROI highlight numbers: Reduce font-size to 32px
- Breakdown table: Convert to stacked cards
- Bar chart: Reduce bar width, stack vertically

### Dark Mode Considerations

- Purple accent (`#A855F7`) has strong visibility on dark backgrounds
- Test in Gmail and Apple Mail dark modes

---

## 3.5 AI Analyzer Results

**Trigger:** User completes AI Idea Analyzer via `/api/ai/analyzer`
**Recipient:** User's email address
**Priority:** High
**Includes:** PDF attachment with full analysis
**API Response Fields:** `ideaName`, `overallScore`, `summary`, `categories`, `recommendations`

### Subject Line

**English:**
`✅ Your Idea Analysis: "{{ideaName}}" scored {{overallScore}}/100`

**Arabic:**
`✅ تحليل فكرتك: "{{ideaName}}" حصلت على {{overallScore}}/100`

### Preview Text

**English:**
"Your app idea has been analyzed. Review viability score, market insights, and recommendations."

**Arabic:**
"تم تحليل فكرة تطبيقك. راجع درجة الجدوى والرؤى السوقية والتوصيات."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO                                 │
│ Your Idea Analysis: "{{ideaName}}"   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ OVERALL SCORE CARD                   │
│ Viability Score: XX/100              │
│ [Visual indicator: Excellent/Good/   │
│  Possible/Reconsider]                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ EXECUTIVE SUMMARY                    │
│ {{summary}}                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CATEGORY SCORES                      │
│ Market Potential: XX/100             │
│ Technical Feasibility: XX/100        │
│ Monetization: XX/100                 │
│ Competition: XX/100                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ DETAILED ANALYSIS (4 sections)       │
│ [Market | Technical | Monetization   │
│  | Competition]                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ KEY RECOMMENDATIONS                  │
│ 1. Recommendation 1                  │
│ 2. Recommendation 2                  │
│ ...                                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CTA SECTION                          │
│ [Get an Estimate] [Book a Call]      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`Your Idea Analysis: "{{ideaName}}" 💡`

**Subheadline:**
`We've analyzed your app idea across 4 key dimensions. Here's what we found.`

**Arabic:**
Headline: `تحليل فكرتك: "{{ideaName}}" 💡`
Subheadline: `قمنا بتحليل فكرة تطبيقك عبر 4 أبعاد رئيسية. إليك ما وجدناه.`

#### Overall Score Card

**Background:** Gradient based on score range
- 80-100: Gradient from `#065F46` (Success dark) to `#1A2332`
- 60-79: Gradient from `#1E3A5F` (Info dark) to `#1A2332`
- 40-59: Gradient from `#78350F` (Warning dark) to `#1A2332`
- 0-39: Gradient from `#7F1D1D` (Error dark) to `#1A2332`

**Border:** 2px solid corresponding color
**Padding:** 32px
**Border-radius:** 16px
**Text-align:** Center

**Content (English):**

```
Overall Viability Score
{{overallScore}}/100

{{#if overallScore >= 80}}
✅ Excellent — Strong market, clear differentiation
{{else if overallScore >= 60}}
👍 Good — Promising, needs refinement in some areas
{{else if overallScore >= 40}}
⚠️ Possible — Significant challenges to overcome
{{else}}
❌ Reconsider — Fundamental viability issues
{{/if}}
```

**Score styling:**

- Font-size: 48px
- Font-weight: 700
- Color: `#FFFFFF`

**Visual indicator (circular progress bar or badge):**

Use a circular progress indicator if email client supports SVG, otherwise use text badges.

**Badge version:**

- Background: Corresponding semantic color (Success, Info, Warning, Error)
- Color: `#FFFFFF`
- Padding: 8px 16px
- Border-radius: 20px (pill)
- Font-size: 14px
- Font-weight: 600

**Arabic:**

```
درجة الجدوى الإجمالية
{{overallScore}}/100

{{#if overallScore >= 80}}
✅ ممتاز — سوق قوي، تميز واضح
{{else if overallScore >= 60}}
👍 جيد — واعد، يحتاج تحسين في بعض المجالات
{{else if overallScore >= 40}}
⚠️ ممكن — تحديات كبيرة يجب التغلب عليها
{{else}}
❌ أعد النظر — مشاكل جوهرية في الجدوى
{{/if}}
```

#### Executive Summary

**Background:** `#1A2332`
**Border-left:** 4px solid `#3B82F6` (Blue - Analyzer accent)
**Padding:** 24px
**Border-radius:** 12px

**Headline:**
`Executive Summary`

**Arabic:**
`الملخص التنفيذي`

**Content:**

```
{{summary}}
```

**Styling:**

- Font-size: 16px
- Line-height: 1.6
- Color: `#F4F4F2`

#### Category Scores

**Display 4 category scores as a grid (2x2 on desktop, stacked on mobile).**

**Each score card:**

- Background: `#1A2332`
- Border: 2px solid `#243044`
- Border-radius: 12px
- Padding: 20px
- Text-align: Center

**Content structure per card:**

```
┌──────────────────────┐
│ [Icon]               │
│ Market Potential     │  ← Category name
│ 78/100               │  ← Score
│ ━━━━━━━━━━━━━━━━━━   │  ← Progress bar (78% filled)
└──────────────────────┘
```

**Icons:**

- Market: 📊
- Technical: ⚙️
- Monetization: 💵
- Competition: 🏆

**Score styling:**

- Font-size: 28px
- Font-weight: 700
- Color: `#FFFFFF`

**Progress bar:**

- Height: 8px
- Background: `#243044`
- Fill color: Based on score (same logic as overall score)
- Border-radius: 4px

**Category names (English):**

- Market Potential
- Technical Feasibility
- Monetization
- Competition

**Arabic:**

- إمكانات السوق
- الجدوى الفنية
- تحقيق الدخل
- المنافسة

#### Detailed Analysis Sections

**Display 4 expandable/collapsible sections (or full sections in email).**

For email, render all sections in full (no collapsing).

**Section structure:**

```
┌──────────────────────────────────────┐
│ [Icon] Market Potential (78/100)     │  ← Header
│                                      │
│ {{categories.market.analysis}}       │  ← Analysis paragraph
│                                      │
│ Key Findings:                        │
│ • {{finding1}}                       │
│ • {{finding2}}                       │
│ • {{finding3}}                       │
└──────────────────────────────────────┘
```

**Header:**

- Background: `#243044`
- Color: `#FFFFFF`
- Font-size: 18px
- Font-weight: 600
- Padding: 16px 20px
- Border-radius: 12px 12px 0 0

**Body:**

- Background: `#1A2332`
- Color: `#F4F4F2`
- Padding: 20px
- Border-radius: 0 0 12px 12px
- Border: 1px solid `#243044`

**For Technical Feasibility category, include additional fields:**

```
Complexity: {{categories.technical.complexity}}
(Display as badge: Low [Green] | Medium [Yellow] | High [Red])

Suggested Tech Stack:
{{#each categories.technical.suggestedTechStack}}
• {{this}}
{{/each}}

Key Challenges:
{{#each categories.technical.challenges}}
• {{this}}
{{/each}}
```

**For Monetization category, include revenue models:**

```
Recommended Revenue Models:

{{#each categories.monetization.revenueModels}}
──────────────────────────
{{name}}
{{description}}

Pros:
{{#each pros}}
✓ {{this}}
{{/each}}

Cons:
{{#each cons}}
✗ {{this}}
{{/each}}
{{/each}}
```

**For Competition category, include competitors:**

```
Identified Competitors:

{{#each categories.competition.competitors}}
──────────────────────────
{{name}} ({{type}})
{{description}}
{{/each}}

Competition Intensity: {{categories.competition.intensity}}
(Display as badge with color coding)
```

**Arabic translations:**

- Key Findings: النتائج الرئيسية
- Complexity: التعقيد
- Suggested Tech Stack: المجموعة التقنية المقترحة
- Key Challenges: التحديات الرئيسية
- Recommended Revenue Models: نماذج الإيرادات الموصى بها
- Pros: الإيجابيات
- Cons: السلبيات
- Identified Competitors: المنافسون المحددون
- Competition Intensity: شدة المنافسة

#### Key Recommendations

**Background:** `#1A2332`
**Border:** 2px solid `#3B82F6` (Blue accent)
**Padding:** 24px
**Border-radius:** 12px

**Headline:**
`Key Recommendations (Prioritized)`

**Arabic:**
`التوصيات الرئيسية (حسب الأولوية)`

**Content:**

```
{{#each recommendations}}
{{@index + 1}}. {{this}}
{{/each}}
```

**Styling:**

- Numbered list (1, 2, 3, ...)
- Font-size: 16px
- Line-height: 1.6
- Color: `#F4F4F2`
- Numbers: Font-weight 700, Color `#3B82F6`

#### CTA Section

**Primary CTA:**

- Text: `Get a Detailed Estimate`
- URL: `https://aviniti.com/en/estimate`
- Style: Primary button (Bronze)

**Secondary CTA:**

- Text: `Book a Strategy Call`
- URL: `https://calendly.com/aliodat-aviniti/30min`
- Style: Secondary button (Outline)

**Tertiary Link:**

- Text: `Download Full Analysis (PDF)`
- URL: Attachment
- Style: Text link with download icon

**Arabic:**
Primary: `احصل على تقدير مفصل`
Secondary: `احجز مكالمة استراتيجية`
Tertiary: `تحميل التحليل الكامل (PDF)`

### Mobile Responsive Notes

- Category score cards: Stack vertically, single column
- Overall score: Reduce font-size to 36px
- Analysis sections: Full-width

### Dark Mode Considerations

- Blue accent (`#3B82F6`) contrasts well with dark backgrounds
- Category score progress bars remain visible

---

## 3.6 Welcome / Lead Nurture

**Trigger:** User provides email via exit intent popup (`/api/exit-intent`)
**Recipient:** User's email address
**Priority:** Medium
**Purpose:** Welcome new leads, provide value, guide to AI tools
**Optional:** Include link to lead magnet PDF (e.g., "10 Questions to Ask Before Building an App")

### Subject Line

**English:**
`Welcome to Aviniti — Let's Turn Your Ideas into Reality 🚀`

**Arabic:**
`مرحباً بك في أفينيتي — لنحول أفكارك إلى واقع 🚀`

### Preview Text

**English:**
"Thanks for joining! Explore our free AI tools and discover how we can help you build your app."

**Arabic:**
"شكراً لانضمامك! استكشف أدوات الذكاء الاصطناعي المجانية واكتشف كيف يمكننا مساعدتك في بناء تطبيقك."

### Layout Wireframe

```
┌──────────────────────────────────────┐
│ HEADER                               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ HERO                                 │
│ Welcome to Aviniti! 👋               │
│ We're here to help you build.        │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ INTRO MESSAGE                        │
│ Thanks for subscribing. Here's what  │
│ you can do next...                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ SERVICES OVERVIEW                    │
│ What we do at Aviniti                │
│ [4 service cards]                    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ AI TOOLS SECTION                     │
│ Try Our Free AI Tools                │
│ [4 tool cards with CTAs]             │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ LEAD MAGNET (Optional)               │
│ Download our free guide              │
│ [Download PDF]                       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ CTA SECTION                          │
│ Ready to get started?                │
│ [Get AI Estimate] [Contact Us]       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ FOOTER                               │
└──────────────────────────────────────┘
```

### Content Blocks

#### Hero Section

**Headline:**
`Welcome to Aviniti! 👋`

**Subheadline:**
`We're here to help you turn ideas into powerful apps.`

**Arabic:**
Headline: `مرحباً بك في أفينيتي! 👋`
Subheadline: `نحن هنا لمساعدتك في تحويل أفكارك إلى تطبيقات قوية.`

#### Intro Message

**Content (English):**

```
Hi there,

Thanks for subscribing! We noticed you were interested in learning more about Aviniti. We're an AI & app development company based in Amman, Jordan, and we specialize in helping businesses like yours build custom applications that drive real results.

Whether you're just exploring an idea or ready to build, we've got tools and solutions to help you at every stage.

Here's how to get started:
```

**Arabic:**

```
مرحباً،

شكراً لاشتراكك! لاحظنا اهتمامك بمعرفة المزيد عن أفينيتي. نحن شركة تطوير تطبيقات وذكاء اصطناعي مقرها عمّان، الأردن، ونتخصص في مساعدة الشركات مثل شركتك في بناء تطبيقات مخصصة تحقق نتائج حقيقية.

سواء كنت تستكشف فكرة أو جاهزاً للبناء، لدينا أدوات وحلول لمساعدتك في كل مرحلة.

إليك كيفية البدء:
```

**Styling:**

- Font-size: 16px
- Line-height: 1.6
- Color: `#F4F4F2`
- Margin-bottom: 24px

#### Services Overview

**Headline:**
`What We Do`

**Arabic:**
`ما نقوم به`

**Display 4 service cards (compact version):**

1. **AI Solutions**
   Intelligent apps that learn and adapt

2. **Mobile Apps**
   Native & cross-platform for iOS and Android

3. **Web Development**
   Scalable platforms and web applications

4. **Cloud Solutions**
   Infrastructure that grows with you

**Card styling:**

- Background: `#1A2332`
- Border: 1px solid `#243044`
- Padding: 16px
- Border-radius: 12px
- Display: 2x2 grid on desktop, stacked on mobile

**Content per card:**

```
[Icon] Service Name
Brief description (1 line)
```

**Icons:** Use emojis or SVG icons (🤖, 📱, 🌐, ☁️)

**Arabic service names:**

- حلول الذكاء الاصطناعي
- تطبيقات الموبايل
- تطوير الويب
- حلول السحابة

#### AI Tools Section

**Headline:**
`Try Our Free AI Tools`

**Subheadline:**
`No commitment. No cost. Just powerful insights in minutes.`

**Arabic:**
Headline: `جرب أدوات الذكاء الاصطناعي المجانية`
Subheadline: `بدون التزام. بدون تكلفة. فقط رؤى قوية في دقائق.`

**Display 4 AI tool cards:**

**Card structure:**

```
┌──────────────────────────────────────┐
│ [Icon in accent color]               │
│ Tool Name                            │
│ Brief description                    │
│ [Try It Now →]                       │
└──────────────────────────────────────┘
```

**Tool 1: Idea Lab**

- Accent color: `#F97316` (Orange)
- Icon: 💡
- Name: Idea Lab
- Description: Don't have an idea yet? We'll help you discover one.
- CTA: `Discover Ideas`
- URL: `https://aviniti.com/en/idea-lab`

**Tool 2: AI Idea Analyzer**

- Accent color: `#3B82F6` (Blue)
- Icon: 🔍
- Name: AI Idea Analyzer
- Description: Have an idea? Let's validate it.
- CTA: `Analyze My Idea`
- URL: `https://aviniti.com/en/ai-analyzer`

**Tool 3: Get AI Estimate**

- Accent color: `#22C55E` (Green)
- Icon: 💵
- Name: Get AI Estimate
- Description: Ready to build? Get your quote in minutes.
- CTA: `Get Estimate`
- URL: `https://aviniti.com/en/estimate`

**Tool 4: AI ROI Calculator**

- Accent color: `#A855F7` (Purple)
- Icon: 📊
- Name: AI ROI Calculator
- Description: See how much an app could save you.
- CTA: `Calculate ROI`
- URL: `https://aviniti.com/en/roi-calculator`

**Card styling:**

- Background: `#1A2332`
- Border-top: 3px solid [accent color]
- Padding: 20px
- Border-radius: 12px

**CTA button (per tool):**

- Background: Transparent
- Color: [accent color]
- Font-size: 14px
- Font-weight: 600
- Padding: 10px 20px
- Border: 2px solid [accent color]
- Border-radius: 8px

**Arabic tool names:**

- مختبر الأفكار
- محلل أفكار الذكاء الاصطناعي
- احصل على تقدير بالذكاء الاصطناعي
- حاسبة عائد الاستثمار بالذكاء الاصطناعي

#### Lead Magnet Section (Optional)

**Display only if lead magnet PDF is available.**

**Background:** `#1A2332`
**Border:** 2px solid `#C08460` (Bronze)
**Padding:** 24px
**Border-radius:** 12px

**Headline:**
`Free Download: 10 Questions to Ask Before Building an App`

**Subheadline:**
`Our comprehensive guide to planning your app project.`

**CTA:**

- Text: `Download Free Guide (PDF)`
- URL: Link to PDF file
- Style: Primary button (Bronze)
- Icon: Download icon

**Arabic:**
Headline: `تنزيل مجاني: 10 أسئلة يجب طرحها قبل بناء التطبيق`
Subheadline: `دليلنا الشامل لتخطيط مشروع تطبيقك.`
CTA: `تحميل الدليل المجاني (PDF)`

#### Final CTA Section

**Background:** Gradient from `#1A2332` to `#0F1419`
**Padding:** 32px
**Border-radius:** 12px
**Text-align:** Center

**Headline:**
`Ready to Get Started?`

**Subheadline:**
`Let's turn your idea into reality.`

**Arabic:**
Headline: `جاهز للبدء؟`
Subheadline: `لنحول فكرتك إلى واقع.`

**CTAs:**

**Primary CTA:**

- Text: `Get AI Estimate`
- URL: `https://aviniti.com/en/estimate`
- Style: Primary button (Bronze)

**Secondary CTA:**

- Text: `Contact Us`
- URL: `https://aviniti.com/en/contact`
- Style: Text link (Bronze)

**Arabic:**
Primary: `احصل على تقدير بالذكاء الاصطناعي`
Secondary: `اتصل بنا`

### Mobile Responsive Notes

- Service cards: Stack vertically
- AI tool cards: Stack vertically
- CTAs: Full-width on mobile

### Dark Mode Considerations

- Multiple accent colors (orange, blue, green, purple) all contrast well with dark backgrounds
- Test each tool card border color for visibility

---

## 4. Technical Implementation

### 4.1 File Structure

```
app/
  emails/
    templates/
      ContactConfirmation.tsx      # Template 1
      EstimateDelivery.tsx          # Template 2
      IdeaLabResults.tsx            # Template 3
      ROICalculatorReport.tsx       # Template 4
      AIAnalyzerResults.tsx         # Template 5
      WelcomeEmail.tsx              # Template 6
    components/
      EmailHeader.tsx               # Shared header component
      EmailFooter.tsx               # Shared footer component
      EmailButton.tsx               # Reusable button component
      EmailCard.tsx                 # Reusable card component
    utils/
      formatters.ts                 # Number/date formatting helpers
      styles.ts                     # Shared inline styles
      constants.ts                  # Colors, fonts, URLs
    index.ts                        # Export all templates
  api/
    email/
      send/
        route.ts                    # Email sending utility endpoint
```

### 4.2 React Email Setup

**Installation:**

```bash
npm install react-email @react-email/components
npm install resend
```

**Package.json script:**

```json
{
  "scripts": {
    "email:dev": "email dev",
    "email:export": "email export"
  }
}
```

**Preview server:**

Run `npm run email:dev` to preview all email templates at `http://localhost:3000`

### 4.3 Resend Integration

**Send email function:**

```typescript
// app/emails/utils/send-email.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  template: React.ReactElement;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  content: Buffer | string;
}

export async function sendEmail({
  to,
  subject,
  template,
  attachments = [],
}: SendEmailOptions) {
  const html = render(template);

  const result = await resend.emails.send({
    from: 'Aviniti <hello@aviniti.com>',
    to,
    subject,
    html,
    attachments,
  });

  if (!result.id) {
    throw new Error('Failed to send email');
  }

  return result;
}
```

### 4.4 Trigger Points

**Where each email is sent:**

| Email Template | Trigger API Route | Trigger Condition |
|----------------|-------------------|-------------------|
| Contact Confirmation | `/api/contact` | After successful form submission and Firestore save |
| AI Estimate Delivery | `/api/ai/estimate` | After AI generates estimate and saves lead to Firestore |
| Idea Lab Results | `/api/ai/idea-lab` | After AI generates ideas and saves lead to Firestore |
| ROI Calculator Report | `/api/ai/roi-calculator` | After AI calculates ROI and saves lead to Firestore |
| AI Analyzer Results | `/api/ai/analyzer` | After AI completes analysis and saves lead to Firestore |
| Welcome Email | `/api/exit-intent` | Immediately after email capture (no AI processing) |

**Example trigger implementation:**

```typescript
// app/api/contact/route.ts
import { sendEmail } from '@/app/emails/utils/send-email';
import ContactConfirmation from '@/app/emails/templates/ContactConfirmation';

export async function POST(request: Request) {
  const body = await request.json();

  // ... validate, save to Firestore ...

  const ticketId = generateTicketId(); // e.g., "AVN-2F8K3L"

  // Send confirmation email
  await sendEmail({
    to: body.email,
    subject: `✓ We received your message - Ticket #${ticketId}`,
    template: ContactConfirmation({
      name: body.name,
      ticketId,
      topic: body.topic,
      locale: body.locale,
    }),
  });

  return Response.json({
    success: true,
    data: { ticketId, message: "Thank you! We'll get back to you within 24 hours." },
  });
}
```

### 4.5 Shared Components

**EmailHeader.tsx:**

```typescript
import { Img, Section, Row, Column, Text } from '@react-email/components';

interface EmailHeaderProps {
  locale: 'en' | 'ar';
}

export function EmailHeader({ locale }: EmailHeaderProps) {
  return (
    <Section style={headerStyles.container}>
      <Row>
        <Column>
          <Img
            src="https://aviniti.com/images/logo-horizontal-light.png"
            alt="Aviniti Logo"
            width={160}
            height={40}
            style={headerStyles.logo}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={headerStyles.tagline}>
            {locale === 'ar' ? 'أفكارك، واقعنا' : 'YOUR IDEAS, OUR REALITY'}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

const headerStyles = {
  container: {
    backgroundColor: '#0F1419',
    padding: '24px 32px',
    borderBottom: '1px solid #243044',
  },
  logo: {
    display: 'block',
  },
  tagline: {
    fontSize: '12px',
    color: '#9CA3AF',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginTop: '8px',
  },
};
```

**EmailFooter.tsx:**

```typescript
import { Section, Row, Column, Text, Link, Hr } from '@react-email/components';

interface EmailFooterProps {
  locale: 'en' | 'ar';
  email: string;
}

export function EmailFooter({ locale, email }: EmailFooterProps) {
  const isArabic = locale === 'ar';

  return (
    <Section style={footerStyles.container}>
      <Hr style={footerStyles.divider} />

      <Row>
        <Column>
          <Text style={footerStyles.heading}>
            {isArabic ? 'أفينيتي' : 'Aviniti'}
          </Text>
          <Text style={footerStyles.text}>
            {isArabic ? 'تطوير تطبيقات الذكاء الاصطناعي' : 'AI & App Development'}
          </Text>
          <Text style={footerStyles.text}>
            {isArabic ? 'عمّان، الأردن' : 'Amman, Jordan'}
          </Text>
        </Column>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Column>
          <Text style={footerStyles.text}>
            {isArabic ? 'بريد إلكتروني: ' : 'Email: '}
            <Link href="mailto:hello@aviniti.com" style={footerStyles.link}>
              hello@aviniti.com
            </Link>
          </Text>
          <Text style={footerStyles.text}>
            {isArabic ? 'هاتف: ' : 'Phone: '}
            <Link href="tel:+962790685302" style={footerStyles.link}>
              +962 79 068 5302
            </Link>
          </Text>
          <Text style={footerStyles.text}>
            {isArabic ? 'واتساب: ' : 'WhatsApp: '}
            <Link href="https://wa.me/962790685302" style={footerStyles.link}>
              +962 79 068 5302
            </Link>
          </Text>
        </Column>
      </Row>

      <Row style={{ marginTop: '16px' }}>
        <Column>
          <Link href="https://linkedin.com/company/aviniti" style={footerStyles.socialLink}>
            LinkedIn
          </Link>
          {' | '}
          <Link href="https://wa.me/962790685302" style={footerStyles.socialLink}>
            WhatsApp
          </Link>
        </Column>
      </Row>

      <Hr style={footerStyles.divider} />

      <Row>
        <Column>
          <Text style={footerStyles.smallText}>
            {isArabic
              ? `تم إرسال هذا البريد الإلكتروني إلى ${email} لأنك استخدمت إحدى أدواتنا أو تواصلت معنا عبر موقعنا.`
              : `This email was sent to ${email} because you used one of our AI tools or contacted us via our website.`}
          </Text>
          <Text style={footerStyles.smallText}>
            <Link href={`https://aviniti.com/${locale}/unsubscribe?email=${encodeURIComponent(email)}`} style={footerStyles.link}>
              {isArabic ? 'إلغاء الاشتراك' : 'Unsubscribe'}
            </Link>
            {' | '}
            <Link href={`https://aviniti.com/${locale}/privacy`} style={footerStyles.link}>
              {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
          </Text>
          <Text style={footerStyles.smallText}>
            © 2026 Aviniti. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

const footerStyles = {
  container: {
    backgroundColor: '#0D1117',
    padding: '32px',
    color: '#9CA3AF',
  },
  divider: {
    borderColor: '#243044',
    margin: '24px 0',
  },
  heading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  text: {
    fontSize: '14px',
    color: '#9CA3AF',
    margin: '4px 0',
    lineHeight: '1.5',
  },
  smallText: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '4px 0',
    lineHeight: '1.5',
  },
  link: {
    color: '#C08460',
    textDecoration: 'none',
  },
  socialLink: {
    color: '#C08460',
    textDecoration: 'none',
    fontSize: '14px',
  },
};
```

**EmailButton.tsx:**

```typescript
import { Button } from '@react-email/components';

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function EmailButton({
  href,
  children,
  variant = 'primary',
  fullWidth = false,
}: EmailButtonProps) {
  const styles = variant === 'primary' ? primaryButtonStyles : secondaryButtonStyles;

  return (
    <Button
      href={href}
      style={{
        ...styles,
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {children}
    </Button>
  );
}

const primaryButtonStyles = {
  backgroundColor: '#C08460',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  border: 'none',
  textAlign: 'center' as const,
};

const secondaryButtonStyles = {
  backgroundColor: 'transparent',
  color: '#C08460',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  border: '2px solid #C08460',
  textAlign: 'center' as const,
};
```

### 4.6 Localization Strategy

**Approach:**

Each template accepts a `locale` prop (`'en'` or `'ar'`) and conditionally renders content based on the locale.

**Example:**

```typescript
interface EmailProps {
  locale: 'en' | 'ar';
  // ... other props
}

export function SomeEmail({ locale, ...props }: EmailProps) {
  const isArabic = locale === 'ar';

  return (
    <Html dir={isArabic ? 'rtl' : 'ltr'}>
      <Head>
        <style>{`
          body {
            font-family: ${isArabic ? "'Noto Sans Arabic', " : ""}'Inter', -apple-system, sans-serif;
          }
        `}</style>
      </Head>
      <Body>
        <EmailHeader locale={locale} />

        <Section>
          <Text>
            {isArabic ? 'مرحباً' : 'Hello'} {props.name}
          </Text>
        </Section>

        <EmailFooter locale={locale} email={props.email} />
      </Body>
    </Html>
  );
}
```

**Translation management:**

For larger projects, consider extracting strings to JSON files:

```
app/
  emails/
    locales/
      en.json
      ar.json
```

```json
// en.json
{
  "contact_confirmation": {
    "subject": "We received your message - Ticket #{{ticketId}}",
    "headline": "Message Received",
    "body": "Thank you for reaching out..."
  }
}
```

### 4.7 PDF Generation

For templates that include PDF attachments (Estimate, ROI Report, Analyzer), use `@react-pdf/renderer`:

**Installation:**

```bash
npm install @react-pdf/renderer
```

**Example PDF generation:**

```typescript
// app/api/ai/estimate/generate-pdf.ts
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { renderToBuffer } from '@react-pdf/renderer';

interface EstimatePDFProps {
  // ... props matching email template
}

function EstimatePDF(props: EstimatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Aviniti - Project Estimate</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Project Summary</Text>
          <Text>Project Type: {props.projectType}</Text>
          {/* ... more content ... */}
        </View>

        {/* ... more sections ... */}
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export async function generateEstimatePDF(props: EstimatePDFProps): Promise<Buffer> {
  const pdf = <EstimatePDF {...props} />;
  return await renderToBuffer(pdf);
}
```

**Usage in API route:**

```typescript
import { generateEstimatePDF } from './generate-pdf';

// ... in API route after generating estimate ...

const pdfBuffer = await generateEstimatePDF({
  name: body.name,
  projectType: body.projectType,
  // ... all necessary props
});

await sendEmail({
  to: body.email,
  subject: 'Your AI Estimate...',
  template: EstimateDelivery({ /* props */ }),
  attachments: [
    {
      filename: `Aviniti-Estimate-${body.name}-${new Date().toISOString().split('T')[0]}.pdf`,
      content: pdfBuffer,
    },
  ],
});
```

---

## 5. Environment Variables

Add the following to `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email sender configuration
EMAIL_FROM_NAME=Aviniti
EMAIL_FROM_ADDRESS=hello@aviniti.com

# Reply-to addresses
EMAIL_REPLY_TO=hello@aviniti.com

# Internal notification recipients
EMAIL_SALES_NOTIFY=sales@aviniti.com
EMAIL_ADMIN_NOTIFY=admin@aviniti.com

# Public URLs
NEXT_PUBLIC_SITE_URL=https://aviniti.com
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/aliodat-aviniti/30min
NEXT_PUBLIC_WHATSAPP_NUMBER=962790685302
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/962790685302
```

**Resend setup:**

1. Sign up at https://resend.com
2. Verify domain: `aviniti.com`
3. Create API key
4. Add DNS records (SPF, DKIM, DMARC) for email authentication

---

## 6. Testing Strategy

### 6.1 Development Preview

Use React Email's preview server to view all templates:

```bash
npm run email:dev
```

Navigate to `http://localhost:3000` to see a list of all email templates with hot reload.

### 6.2 Test Sending

Create a test endpoint to send sample emails:

```typescript
// app/api/email/test/route.ts
import { sendEmail } from '@/app/emails/utils/send-email';
import ContactConfirmation from '@/app/emails/templates/ContactConfirmation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template');
  const to = searchParams.get('to') || 'test@example.com';

  if (template === 'contact-confirmation') {
    await sendEmail({
      to,
      subject: 'Test: Contact Confirmation',
      template: ContactConfirmation({
        name: 'Test User',
        ticketId: 'AVN-TEST123',
        topic: 'General Inquiry',
        locale: 'en',
      }),
    });
  }

  // ... other templates ...

  return Response.json({ success: true, message: `Test email sent to ${to}` });
}
```

**Usage:**

```
GET /api/email/test?template=contact-confirmation&to=your-email@example.com
```

### 6.3 Cross-Client Testing

Test emails in multiple email clients:

**Required clients:**

- Gmail (web, mobile app)
- Apple Mail (macOS, iOS)
- Outlook (desktop, web)
- Yahoo Mail
- Proton Mail

**Tools:**

- **Litmus** (https://litmus.com) - Paid service for automated testing across 100+ clients
- **Email on Acid** (https://www.emailonacid.com) - Similar to Litmus
- **Testi@** (https://testi.at) - Free tool to send test emails to multiple addresses

**Testing checklist:**

- [ ] Subject line displays correctly (no truncation)
- [ ] Preview text appears (first 90-100 chars)
- [ ] Header logo renders (fallback text if image blocked)
- [ ] All buttons are clickable and correctly styled
- [ ] Tables render properly (especially on Outlook)
- [ ] Dark mode support (Gmail, Apple Mail)
- [ ] RTL layout (Arabic emails)
- [ ] Links are tracked (if using UTM parameters)
- [ ] Unsubscribe link present and functional
- [ ] Mobile responsive (320px minimum width)
- [ ] Attachments open correctly (PDF)

### 6.4 A/B Testing

For key conversion emails (Estimate Delivery, Analyzer Results), consider A/B testing:

**Variables to test:**

- Subject line length (short vs. descriptive)
- CTA button text ("Get Started" vs. "Book a Call")
- CTA button color (Bronze vs. tool-specific accent)
- Email length (concise vs. detailed)
- Tone (formal vs. conversational)

**Implementation:**

Use Resend's tagging feature to track email performance:

```typescript
await resend.emails.send({
  from: 'Aviniti <hello@aviniti.com>',
  to: recipient.email,
  subject: subjectVariant,
  html,
  tags: [
    { name: 'template', value: 'estimate-delivery' },
    { name: 'variant', value: 'A' },
  ],
});
```

Track open rates, click rates, and conversion rates in Resend dashboard.

### 6.5 Accessibility Testing

**Tools:**

- **Litmus Accessibility Check** - Checks contrast ratios, alt text, semantic HTML
- **WAVE** (https://wave.webaim.org) - Paste email HTML to check accessibility

**Checklist:**

- [ ] All images have descriptive `alt` text
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] Links have descriptive text (not "click here")
- [ ] Headings use semantic HTML (`<h1>`, `<h2>`, etc.)
- [ ] Tables have proper headers (`<th>` elements)
- [ ] Buttons are actual `<a>` tags with `href`, not `<div>` with `onclick`

---

## End of Email Templates Design Specification

**Document Status:** Complete
**Next Steps:**

1. Set up Resend account and verify domain
2. Implement shared components (Header, Footer, Button)
3. Build each template using React Email
4. Integrate email sending into API routes
5. Test across email clients
6. Deploy and monitor delivery rates

**Maintainer:** Ali Odat
**Last Updated:** February 2026

---

**Appendix: Quick Reference**

**Contact Information:**

- Email: hello@aviniti.com
- Phone: +962 79 068 5302
- WhatsApp: +962 79 068 5302
- Calendly: https://calendly.com/aliodat-aviniti/30min

**Brand Colors:**

- Deep Navy: `#0F1419`
- Bronze: `#C08460`
- Off-White: `#F4F4F2`
- Tool Orange: `#F97316`
- Tool Blue: `#3B82F6`
- Tool Green: `#22C55E`
- Tool Purple: `#A855F7`

**Email Dimensions:**

- Max width: 600px
- Desktop padding: 32px
- Mobile padding: 20px
- Button height: 48px (primary), 44px (secondary)
- Logo height: 40px (desktop), 32px (mobile)
