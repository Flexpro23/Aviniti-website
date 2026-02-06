# Contact & Legal Pages -- Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Inter
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Contact Page](#1-contact-page)
2. [Privacy Policy Page](#2-privacy-policy-page)
3. [Terms of Service Page](#3-terms-of-service-page)

---

## 1. Contact Page

### 1.1 Purpose and Conversion Goal

The contact page is the human connection point. It serves visitors who want to speak with a real person before committing -- the relational buyer who values personal interaction over self-service tools.

**User mindset:** "I want to talk to someone." These visitors have either already explored the site and have specific questions, or they prefer direct communication as their first step. The page must make reaching Aviniti as frictionless as possible across multiple channels.

**Primary KPI:** Contact form submissions.
**Secondary KPI:** Calendly call bookings, WhatsApp initiations.

### 1.2 URL Structure

```
/en/contact
/ar/contact
```

### 1.3 SEO Metadata

```html
<title>Contact Us - Get in Touch | Aviniti</title>
<meta name="description" content="Contact Aviniti for AI app development inquiries. Book a call, send a message, or reach us on WhatsApp. We respond within 24 hours. Based in Amman, Jordan." />
<meta property="og:title" content="Contact Aviniti" />
<meta property="og:description" content="Get in touch with our team. We respond within 24 hours." />
<meta property="og:type" content="website" />
<link rel="canonical" href="https://aviniti.com/en/contact" />
```

**JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Aviniti",
  "url": "https://aviniti.com",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+962-XX-XXX-XXXX",
    "contactType": "customer service",
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "Arabic"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Amman",
    "addressCountry": "JO"
  }
}
```

### 1.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Contact                                       |
+------------------------------------------------------------------+
|                                                                    |
|                     Get in Touch                                   |
|    We'd love to hear from you. Reach out and we'll respond         |
|    within 24 hours.                                                |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  +--- Contact Form (55%) ---+  +--- Calendly + Info (45%) ---+   |
|  |                          |  |                              |   |
|  |  Full Name *             |  |  BOOK A CALL                 |   |
|  |  [________________]      |  |                              |   |
|  |                          |  |  Skip the form. Book a free  |   |
|  |  Email Address *         |  |  15-minute consultation.     |   |
|  |  [________________]      |  |                              |   |
|  |                          |  |  +------------------------+  |   |
|  |  Company Name            |  |  |                        |  |   |
|  |  [________________]      |  |  |  Calendly Embed        |  |   |
|  |                          |  |  |  (inline widget)       |  |   |
|  |  Phone (optional)        |  |  |                        |  |   |
|  |  [________________]      |  |  +------------------------+  |   |
|  |                          |  |                              |   |
|  |  [] Send via WhatsApp    |  |  --------------------------  |   |
|  |                          |  |                              |   |
|  |  How can we help? *      |  |  CONTACT INFO               |   |
|  |  [Select a topic   v]    |  |                              |   |
|  |                          |  |  @ hello@aviniti.com         |   |
|  |  Message *               |  |  P +962 XX XXX XXXX         |   |
|  |  [                  ]    |  |  W WhatsApp                  |   |
|  |  [                  ]    |  |  L Amman, Jordan             |   |
|  |  [                  ]    |  |                              |   |
|  |                          |  |  --------------------------  |   |
|  |  [Send Message]          |  |                              |   |
|  |                          |  |  WHATSAPP QUICK CONTACT      |   |
|  |  We respond within       |  |                              |   |
|  |  24 hours.               |  |  [Message us on WhatsApp]   |   |
|  |                          |  |  Fastest response.           |   |
|  +---------------------------+  +-----------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  OPTIONAL: Map Section                                             |
|  [Google Maps embed showing Amman, Jordan]                         |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 1.5 Content Hierarchy and Component Specs

#### Hero Section

| Element | Spec |
|---------|------|
| Section label | `text-sm font-semibold uppercase tracking-[0.1em] text-bronze` -- "CONTACT US" |
| Headline | `text-h1 text-white mt-3 text-center` -- "Get in Touch" |
| Description | `text-lg text-muted mt-4 max-w-[560px] mx-auto text-center` -- "We'd love to hear from you. Reach out through any channel and we'll respond within 24 hours." |
| Background | `bg-navy` |
| Padding | `py-16 md:py-24 text-center` |

#### Two-Column Layout

| Element | Spec |
|---------|------|
| Container | `max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8` |
| Grid | `grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12` |
| Left column (form) | `lg:col-span-7` |
| Right column (Calendly + info) | `lg:col-span-5` |

#### Contact Form

| Element | Spec |
|---------|------|
| Form container | `bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8` |
| Form heading | `text-h4 text-white mb-6` -- "Send Us a Message" |
| Field layout | `space-y-5` (20px vertical gap between fields) |
| Full Name | Required. Design system Text Input. Label: "Full Name". Placeholder: "Your full name" |
| Email | Required. `type="email"`. Label: "Email Address". Placeholder: "you@company.com" |
| Company | Optional. Label: "Company Name". Placeholder: "Your company (optional)" |
| Phone | Optional. Label: "Phone Number". Uses Phone Input with country code selector. |
| WhatsApp checkbox | Design system Checkbox. Label: "Also send updates via WhatsApp". Only visible if phone is filled. |
| Topic select | Required. Design system Select. Label: "How can we help?". Options: "General Inquiry", "Project Discussion", "Ready-Made Solution", "Partnership", "Support", "Other" |
| Message | Required. Design system Textarea (min-h-[120px]). Label: "Your Message". Placeholder: "Tell us about your project or question..." |
| Submit button | `Button variant="primary" size="lg" w-full` -- "Send Message". Loading state: spinner + "Sending..." |
| Response time | `text-sm text-muted mt-4 flex items-center gap-2`. Clock icon + "We typically respond within 24 hours." |
| Success state | Replace form with success message in green: Check icon + "Message sent successfully! We'll get back to you within 24 hours." + "Send another message" link |
| Error state | Inline field errors using design system error pattern. Generic error: toast notification at top |

**Form validation rules:**

| Field | Validation | Error Message |
|-------|-----------|---------------|
| Full Name | Required, min 2 chars | "Please enter your name" |
| Email | Required, valid email format | "Please enter a valid email address" |
| Topic | Required, must select | "Please select a topic" |
| Message | Required, min 10 chars | "Please enter a message (at least 10 characters)" |
| Phone | Optional, but if filled must be valid | "Please enter a valid phone number" |

#### Calendly Section (Right Column, Top)

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-6 md:p-8` |
| Heading | `text-h4 text-white` -- "Book a Call" |
| Description | `text-sm text-muted mt-2` -- "Skip the form. Book a free 15-minute consultation directly." |
| Calendly embed | `mt-6`. Uses Calendly inline embed widget. Container: `min-h-[400px] rounded-lg overflow-hidden`. Calendly theme: dark mode if available, otherwise wrap in dark-styled container. |
| Fallback | If Calendly fails to load: "Having trouble? [Open Calendly in a new tab](calendly-link)" link |

#### Contact Info (Right Column, Middle)

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-xl p-6 mt-6` |
| Heading | `text-sm font-semibold uppercase tracking-[0.1em] text-muted mb-4` -- "CONTACT INFORMATION" |
| Info items | `space-y-4`. Each: `flex items-center gap-3`. Icon: `h-5 w-5 text-bronze flex-shrink-0`. Text: `text-sm text-off-white` |
| Email | Mail icon + "hello@aviniti.com" (clickable `mailto:`) |
| Phone | Phone icon + "+962 XX XXX XXXX" (clickable `tel:`) |
| WhatsApp | MessageCircle icon (green) + "WhatsApp" (clickable, opens wa.me link) |
| Location | MapPin icon + "Amman, Jordan" |
| Hours | Clock icon + "Sun-Thu, 9:00 AM - 6:00 PM (GMT+3)" |

#### WhatsApp Quick Contact (Right Column, Bottom)

| Element | Spec |
|---------|------|
| Container | `bg-[#1a3a2a] border border-[#25D366]/20 rounded-xl p-6 mt-6` (green-tinted dark background) |
| WhatsApp icon | `h-10 w-10 text-[#25D366]` |
| Heading | `text-lg font-semibold text-white mt-3` -- "Prefer WhatsApp?" |
| Description | `text-sm text-muted mt-2` -- "Get the fastest response. We're typically online and respond within minutes." |
| CTA | `mt-4 h-11 px-5 py-2.5 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20BD5A] transition-colors` -- "Message on WhatsApp" |
| Click action | Opens `https://wa.me/962XXXXXXXXX?text=Hi! I'm interested in learning more about Aviniti's services.` |

#### Map Section (Optional)

| Element | Spec |
|---------|------|
| Container | `w-full h-[300px] md:h-[400px] bg-slate-blue rounded-xl overflow-hidden mt-12` |
| Map | Google Maps embed or static map image showing Amman, Jordan pin. Dark map theme if using Google Maps Styling API. |
| Fallback | If map fails: static image of Amman skyline with "Amman, Jordan" text overlay |

### 1.6 Responsive Behavior

**Desktop (1024px+):** Two-column layout (7/5 split). Form left, Calendly/info stacked on right. Map full width below.

**Tablet (768px-1023px):** Two-column layout with tighter spacing, or single column with form first, Calendly second, info third.

**Mobile (<768px):** Single column, stacked vertically:
1. Hero
2. Contact Form (full width)
3. WhatsApp Quick Contact (full width, moved up for mobile users who prefer WhatsApp)
4. Contact Info
5. Calendly embed
6. Map

Order changes on mobile because WhatsApp is the preferred channel for MENA mobile users. Putting it above Calendly increases WhatsApp conversion on mobile.

Form fields stack vertically. Submit button full width. Calendly embed may show limited dates. Map hidden on mobile (save bandwidth) or replaced with a static linked image.

### 1.7 Animation Specifications

| Element | Animation | Trigger | Duration |
|---------|-----------|---------|----------|
| Hero | Fade in + translateY | Page load | 500ms |
| Form container | Fade in + translateX(-20px) | Page load + 200ms | 500ms |
| Right column items | Fade in + translateX(20px), stagger 100ms | Page load + 300ms | 500ms |
| Form submission | Button loading spinner. Success: form fades out, success message fades in (300ms) |
| Map | Fade in on scroll | Scroll trigger | 500ms |

### 1.8 Accessibility

- Form: All inputs have associated `<label>` elements linked via `htmlFor`/`id`
- Required fields: `aria-required="true"`, asterisk in label with `<span aria-hidden="true">*</span>` + visually hidden "required" text
- Error states: `aria-invalid="true"` on invalid inputs, `aria-describedby` linking to error message `<p id="error-id">`
- Submit button: Disabled state with `aria-disabled="true"` during submission
- Success message: `role="status" aria-live="polite"` for screen reader announcement
- Calendly iframe: `title="Book a consultation call"` on iframe
- Map iframe: `title="Aviniti office location in Amman, Jordan"` on iframe, or `role="img" aria-label` for static map
- Phone links: `aria-label="Call Aviniti at +962..."` for clarity
- WhatsApp button: `aria-label="Message Aviniti on WhatsApp"`
- Tab order: Form fields in logical order > Submit > Right column links > Map
- Focus management: After form submission, focus moves to success message

### 1.9 RTL Considerations

- Two-column layout: Form moves to right column, Calendly/info to left column (CSS `lg:flex-row-reverse` or `lg:order-*`)
- Form field labels: Right-aligned above inputs
- Input text direction: RTL for Arabic text, but email/phone inputs remain LTR internally (`dir="ltr"` on email and phone inputs)
- Select dropdown: Chevron moves from right to left
- WhatsApp button: Icon stays before text in both directions
- Contact info icons: Move to right side of text
- Map: No directional change needed
- Phone format: International format remains the same
- WhatsApp pre-filled message: Arabic version for Arabic locale

---

## 2. Privacy Policy Page

### 2.1 Purpose and Conversion Goal

The privacy policy is a legal requirement and a trust signal. While not a direct conversion page, a well-presented privacy policy builds confidence, especially for visitors submitting personal data through the AI tools and chatbot.

**Conversion goal:** None directly. But its existence and accessibility are required for trust, GDPR compliance, and app store submissions.

### 2.2 URL Structure

```
/en/privacy-policy
/ar/privacy-policy
```

### 2.3 SEO Metadata

```html
<title>Privacy Policy | Aviniti</title>
<meta name="description" content="Aviniti's privacy policy. Learn how we collect, use, and protect your personal data." />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="https://aviniti.com/en/privacy-policy" />
```

Note: `noindex` keeps legal pages out of search results to avoid cluttering SERPs, while `follow` ensures any outbound links are still crawled.

### 2.4 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|  Breadcrumbs: Home > Privacy Policy                                |
+------------------------------------------------------------------+
|                                                                    |
|                     max-w-[768px] centered                         |
|                                                                    |
|  Privacy Policy                                                    |
|  Last updated: February 2026                                       |
|                                                                    |
|  +--- Table of Contents (optional sidebar) ---+                    |
|  | 1. Information We Collect                   |                    |
|  | 2. How We Use Your Information              |                    |
|  | 3. Data Storage and Security                |                    |
|  | 4. Third-Party Services                     |                    |
|  | 5. Cookies and Tracking                     |                    |
|  | 6. Your Rights                              |                    |
|  | 7. AI Tools and Data Processing             |                    |
|  | 8. Changes to This Policy                   |                    |
|  | 9. Contact Us                               |                    |
|  +---------------------------------------------+                   |
|                                                                    |
|  1. Information We Collect                                         |
|  -------------------------                                         |
|                                                                    |
|  When you use our website and tools, we may collect:               |
|                                                                    |
|  * Personal information you provide (name, email...)              |
|  * Usage data and analytics                                       |
|  * Information provided to our AI tools                           |
|  * Device and browser information                                  |
|                                                                    |
|  (continues with remaining sections...)                            |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 2.5 Content Hierarchy and Component Specs

#### Page Header

| Element | Spec |
|---------|------|
| Container | `max-w-[768px] mx-auto px-4 sm:px-6 py-16 md:py-24` |
| Title | `text-h1 text-white` -- "Privacy Policy" |
| Last updated | `text-sm text-muted mt-3` -- "Last updated: February 2026" |
| Divider | `h-px bg-slate-blue-light mt-8` |

#### Table of Contents (Optional)

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-lg p-6 mt-8` |
| Heading | `text-sm font-semibold uppercase tracking-[0.05em] text-muted mb-4` -- "TABLE OF CONTENTS" |
| Links | `space-y-2`. Each: `text-sm text-bronze hover:text-bronze-light transition-colors` -- clickable, smooth-scrolls to section |

#### Body Content

Uses the narrow-content typography system (same as blog post). Legal text has specific styling needs:

| Element | Spec |
|---------|------|
| Section heading (H2) | `text-h3 text-white mt-12 mb-4` |
| Sub-heading (H3) | `text-h4 text-white mt-8 mb-3` |
| Paragraph | `text-base text-off-white leading-[1.75] mt-4` |
| Lists | `space-y-2 my-4 ml-6`. Each: `text-base text-off-white`. Bullets: `list-disc marker:text-muted` |
| Bold terms | `font-semibold text-white` |
| Links | Standard bronze link treatment |
| Emphasis/definitions | `text-off-white italic` |

### 2.6 Privacy Policy Content Outline

**1. Information We Collect**
- Personal information (name, email, phone, company) provided through forms
- Information submitted to AI tools (Idea Lab, Analyzer, Estimate, ROI Calculator)
- Chatbot conversation data
- Usage analytics (pages visited, time on site, clicks)
- Device and browser information
- Cookies and similar technologies

**2. How We Use Your Information**
- To provide and improve our services
- To process your inquiries and deliver AI tool results
- To send requested information (estimates, reports, ideas)
- To improve our AI models and services (anonymized, aggregated)
- To communicate updates if opted in
- To comply with legal obligations

**3. Data Storage and Security**
- Data stored on Google Cloud / Firebase infrastructure
- Encryption in transit (TLS) and at rest
- Access controls and security monitoring
- Data retention periods
- Data deletion procedures

**4. Third-Party Services**
- Google Analytics (usage tracking)
- Google Gemini AI (AI processing)
- Firebase (database and authentication)
- Calendly (scheduling)
- WhatsApp Business (messaging)
- Stripe (if payment processing applies)
- Their respective privacy policies linked

**5. Cookies and Tracking**
- Essential cookies (session management)
- Analytics cookies (Google Analytics)
- Marketing cookies (Google Ads, Meta Pixel)
- Cookie consent mechanism
- How to manage cookies

**6. Your Rights**
- Right to access your data
- Right to correct your data
- Right to delete your data
- Right to export your data
- Right to opt out of marketing
- How to exercise these rights (email contact)

**7. AI Tools and Data Processing**
- How submitted data is processed by AI
- Data used for AI responses is not used to train models
- Conversation data with chatbot
- Retention periods for AI interactions
- Option to request deletion

**8. Changes to This Policy**
- We may update this policy
- Users notified of material changes
- Effective date displayed

**9. Contact Us**
- Email for privacy inquiries
- Physical address
- Response time

### 2.7 Responsive Behavior

Single-column layout throughout. The narrow container (`max-w-[768px]`) naturally adapts across breakpoints. On mobile, padding reduces to `px-4`. Table of contents may collapse into an accordion on mobile to save vertical space.

### 2.8 Accessibility

- Heading hierarchy: H1 (title) > H2 (sections) > H3 (sub-sections)
- Table of contents links: `<nav aria-label="Table of contents">`
- Long-form content: proper list semantics (`<ul>`, `<ol>`, `<li>`)
- Links to third-party policies: `target="_blank" rel="noopener noreferrer"` with `aria-label` including "(opens in new tab)"
- Readability: 16px body text, 28px line-height, 768px max-width ensures ~65-75 characters per line (optimal reading width)

### 2.9 RTL Considerations

- All text flows right-to-left
- List bullets move to right side
- Table of contents alignment flips
- Legal terms and defined phrases remain properly formatted
- Links to English-only resources (third-party policies) may retain LTR direction

---

## 3. Terms of Service Page

### 3.1 Purpose and Conversion Goal

The terms of service define the legal relationship between Aviniti and its website users, particularly those who use the AI tools and submit information. Like the privacy policy, it is a trust and compliance requirement.

**Conversion goal:** None directly. Required for legal compliance and trust.

### 3.2 URL Structure

```
/en/terms-of-service
/ar/terms-of-service
```

### 3.3 SEO Metadata

```html
<title>Terms of Service | Aviniti</title>
<meta name="description" content="Aviniti's terms of service. Read the terms and conditions for using our website, AI tools, and services." />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="https://aviniti.com/en/terms-of-service" />
```

### 3.4 Layout

Identical layout to the Privacy Policy page. Uses the same narrow-content template with:
- Page header (title + last updated date)
- Optional table of contents
- Numbered sections with clear headings
- Same typography system

### 3.5 Content Hierarchy

Same styling as Privacy Policy:

| Element | Spec |
|---------|------|
| Title | `text-h1 text-white` -- "Terms of Service" |
| Last updated | `text-sm text-muted mt-3` -- "Last updated: February 2026" |
| Section headings | `text-h3 text-white mt-12 mb-4` |
| Body text | `text-base text-off-white leading-[1.75]` |
| Numbered lists | `list-decimal marker:text-muted` |
| Defined terms | `font-semibold text-white` |

### 3.6 Terms of Service Content Outline

**1. Acceptance of Terms**
- By using the website, you agree to these terms
- Must be 18+ to use services
- Additional terms may apply to specific services

**2. Description of Services**
- Website and its content
- AI tools (Idea Lab, Analyzer, Estimate, ROI Calculator)
- AI chatbot (Avi)
- Ready-made solutions catalog
- Blog and educational content

**3. AI Tools Disclaimer**
- AI-generated estimates are approximations, not binding quotes
- AI analysis results are for informational purposes
- Final pricing determined through formal consultation
- AI-generated ideas do not constitute legal or business advice
- Results may vary and are not guaranteed

**4. User Obligations**
- Provide accurate information
- Do not misuse AI tools (spam, harmful content, reverse engineering)
- Do not scrape or copy content
- Respect intellectual property

**5. Intellectual Property**
- Website content, design, and code are Aviniti property
- AI-generated results may be used by the user for personal/business evaluation
- Ready-made solution descriptions and pricing are subject to change
- User-submitted content remains user property

**6. Limitation of Liability**
- AI estimates are non-binding approximations
- Aviniti is not liable for decisions made based on AI tool output
- Website provided "as is"
- Maximum liability limited to direct damages

**7. Privacy**
- Reference and link to Privacy Policy
- Data handling for AI tools

**8. Third-Party Links and Services**
- Links to third-party sites (App Store, Google Play, Calendly, WhatsApp)
- Aviniti not responsible for third-party content

**9. Communication**
- By submitting forms, user consents to being contacted
- WhatsApp opt-in is separate and explicit
- Unsubscribe options

**10. Governing Law**
- Laws of the Hashemite Kingdom of Jordan
- Dispute resolution process

**11. Changes to Terms**
- Right to modify terms
- Notification of material changes
- Continued use constitutes acceptance

**12. Contact**
- Email for legal inquiries
- Physical address

### 3.7 Responsive, Accessibility, RTL

All identical to the Privacy Policy page specifications (Section 2.7, 2.8, 2.9 above). The template is shared.

### 3.8 Shared Legal Page Template Component

Both Privacy Policy and Terms of Service use a shared `<LegalPage>` component:

```
Props:
  title: string          -- "Privacy Policy" or "Terms of Service"
  lastUpdated: string    -- "February 2026"
  content: MDX/Markdown  -- The legal text content
  toc: TOCItem[]         -- Table of contents items (auto-generated from headings)
```

| Component | Spec |
|-----------|------|
| `<LegalPage>` | Wraps everything in `<main>` > `<article>` with proper `aria-labelledby` |
| `<LegalPageHeader>` | Title, date, breadcrumbs |
| `<LegalTOC>` | Table of contents with smooth-scroll links |
| `<LegalContent>` | MDX-rendered content with proper typography classes applied via `@apply` or `prose` customization |

This ensures both legal pages are visually identical and can be maintained through a single template.

### 3.9 Design Notes for Legal Pages

1. **No exit intent triggers on legal pages.** The PRD explicitly states this. Legal pages are utility -- do not interrupt the user.
2. **No chatbot proactive messages on legal pages.** The chatbot bubble remains visible but does not trigger proactive engagement.
3. **No decorative animations.** Content appears immediately. No scroll-triggered animations on legal pages. These are reference documents -- users want to find information quickly.
4. **Print-friendly.** Add `@media print` styles that strip the dark background and render text in black on white. This is important for users who need to print legal terms.
5. **Last updated date is critical.** Always visible at the top. This is a legal requirement in many jurisdictions.

---

**End of Contact & Legal Pages Specification**
