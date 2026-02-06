# Global Components -- Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Inter
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Navigation Bar (Navbar)](#1-navigation-bar)
2. [Mobile Navigation Drawer](#2-mobile-navigation-drawer)
3. [Footer](#3-footer)
4. [Chatbot "Avi" Widget](#4-chatbot-avi-widget)
5. [Exit Intent Popup](#5-exit-intent-popup)
6. [WhatsApp Floating Button](#6-whatsapp-floating-button)
7. [Breadcrumbs](#7-breadcrumbs)
8. [404 Page](#8-404-page)

---

## 1. Navigation Bar

### 1.1 Purpose

The navbar is the persistent wayfinding element across all pages. It must balance functional navigation with brand presence while maintaining a premium, minimal aesthetic. It is the most-seen component on the entire website.

### 1.2 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                                                                    |
|  [Logo]          Home  Get AI Estimate  FAQ  Blog  [Idea Lab]  [EN v]  |
|                                                                    |
+------------------------------------------------------------------+
```

**Detailed structure:**

```
+----------------------------------------------------------------------+
|  h-16 (64px), fixed top-0, w-full, z-50                              |
|  bg-navy/80 backdrop-blur-md                                         |
|  border-b border-slate-blue-light/50                                 |
|                                                                      |
|  max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8                        |
|  flex items-center justify-between h-full                            |
|                                                                      |
|  +--------+                          +---------------------------+   |
|  | Logo   |                          | Nav Links + Lang + Menu  |   |
|  | area   |                          |                           |   |
|  +--------+                          +---------------------------+   |
|                                                                      |
|  Left: Logo (flex-shrink-0)                                          |
|  Center/Right: Nav links (hidden lg:flex)                            |
|  Right: Language switcher + Hamburger (lg:hidden)                    |
|                                                                      |
+----------------------------------------------------------------------+
```

### 1.3 Component Specifications

#### Logo Area

| Property | Value |
|----------|-------|
| Component | `<Link href="/">` wrapping the logo |
| Logo height | 28-32px (auto width preserving aspect ratio) |
| Logo image | Bronze infinity symbol + "AVINITI" text. Uses `next/image` with priority. |
| Container | `flex-shrink-0` to prevent compression |
| `aria-label` | "Aviniti - Home" |
| Click | Navigates to homepage |

#### Navigation Links

| Property | Value |
|----------|-------|
| Container | `hidden lg:flex items-center gap-8` |
| Link style (default) | `text-sm font-medium text-muted hover:text-white transition-colors duration-200` |
| Link style (active) | `text-white` (determined by current route matching) |
| Idea Lab link | Special treatment: `bg-bronze/15 text-bronze px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-bronze/25 transition-colors` |
| Focus style | `focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy rounded-sm` |

**Nav items (in order):**

| Label | Route | Treatment |
|-------|-------|-----------|
| Home | `/` | Standard |
| Get AI Estimate | `/get-estimate` | Standard |
| FAQ | `/faq` | Standard |
| Blog | `/blog` | Standard |
| Idea Lab | `/idea-lab` | Bronze highlight |

#### Language Switcher

| Property | Value |
|----------|-------|
| Container | `flex items-center gap-1` |
| Globe icon | `h-4 w-4 text-muted` (Lucide `Globe`) |
| Current language | `text-sm font-medium text-muted` -- "EN" or "AR" |
| Dropdown | On click: compact dropdown below. `bg-slate-blue border border-slate-blue-light rounded-lg shadow-xl py-1 min-w-[120px]` |
| Dropdown item | `px-3 py-2 text-sm text-muted hover:text-white hover:bg-slate-blue-light transition-colors`. Active: `text-bronze` |
| Options | "English" / "العربية" |
| Behavior | Preserves current route, switches locale prefix (`/en/` to `/ar/` or vice versa) |

#### Mobile Menu Button

| Property | Value |
|----------|-------|
| Visibility | `lg:hidden` (only shows on mobile/tablet) |
| Button | Icon button: `h-10 w-10 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-slate-blue-light/60 transition-all` |
| Icon | Hamburger icon (Lucide `Menu`), 20px |
| `aria-label` | "Open navigation menu" |
| `aria-expanded` | "true" when drawer is open, "false" when closed |
| `aria-controls` | Points to the drawer panel ID |

### 1.4 Scroll Behavior

| State | Background | Border |
|-------|-----------|--------|
| At top of page | `bg-transparent` (or `bg-navy/0`) | `border-transparent` |
| After scrolling (> 10px) | `bg-navy/80 backdrop-blur-md` | `border-slate-blue-light/50` |
| Transition | `transition-all duration-200` |

Implementation: Use `useScroll` from Framer Motion or a custom `useEffect` with scroll listener. Toggle a `scrolled` state boolean at 10px threshold.

### 1.5 Responsive Behavior

**Desktop (1024px+):** Full horizontal nav with all links visible. Language switcher as dropdown. No hamburger.

**Tablet/Mobile (<1024px):** Logo left. Language switcher compact. Hamburger menu button right. All nav links hidden -- accessed through mobile drawer.

### 1.6 Animation Specifications

| Element | Animation | Duration |
|---------|-----------|----------|
| Scroll background transition | Background opacity + blur | 200ms ease |
| Nav link hover | Color transition | 200ms |
| Idea Lab button hover | Background opacity transition | 200ms |
| Language dropdown | Fade in + translateY(-4px to 0) | 150ms ease-out |
| Language dropdown close | Fade out + translateY(0 to -4px) | 100ms ease-in |

### 1.7 Accessibility

- Navbar: `<header role="banner">` containing `<nav aria-label="Main navigation">`
- Skip-to-content link: First focusable element inside `<body>`. Hidden by default: `sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-bronze focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold`. Text: "Skip to main content". Target: `#main-content`
- Active page: `aria-current="page"` on active nav link
- Language switcher: `aria-label="Select language"` on button, `role="menu"` on dropdown, `role="menuitem"` on items
- Keyboard: Tab through links. Enter/Space on language switcher opens dropdown. Escape closes dropdown. Arrow keys navigate dropdown items.
- Focus trapping: Language dropdown traps focus when open. Tab from last item returns to first.

### 1.8 RTL Considerations

- Logo stays at the start (right side in RTL)
- Nav links flow from right-to-left
- Language switcher moves to start (left in RTL)
- Hamburger menu button moves to start (left in RTL)
- Use CSS `flex-direction` that automatically adjusts with `dir="rtl"` on `<html>` -- no explicit RTL classes needed for flexbox
- Idea Lab button maintains its highlighted style regardless of direction

---

## 2. Mobile Navigation Drawer

### 2.1 Purpose

The mobile drawer provides access to all navigation items on screens below 1024px. It must feel smooth, accessible, and not jarring. The drawer is the mobile user's primary navigation surface.

### 2.2 Layout -- Wireframe

```
+------------------------------------------------------------------+
|                                                                    |
|  +--- overlay (bg-navy/90) ---+  +--- drawer panel ---+           |
|  |                            |  |                     |           |
|  |                            |  |  [X] Close          |           |
|  |                            |  |                     |           |
|  |   (tap to close)           |  |  Home               |           |
|  |                            |  |  ---------          |           |
|  |                            |  |  Get AI Estimate    |           |
|  |                            |  |  ---------          |           |
|  |                            |  |  FAQ                |           |
|  |                            |  |  ---------          |           |
|  |                            |  |  Blog               |           |
|  |                            |  |  ---------          |           |
|  |                            |  |  Idea Lab           |           |
|  |                            |  |  ---------          |           |
|  |                            |  |                     |           |
|  |                            |  |  Solutions          |           |
|  |                            |  |  Case Studies       |           |
|  |                            |  |  Contact            |           |
|  |                            |  |  ---------          |           |
|  |                            |  |                     |           |
|  |                            |  |  [EN] [العربية]     |           |
|  |                            |  |                     |           |
|  +----------------------------+  +---------------------+           |
|                                                                    |
+------------------------------------------------------------------+
```

### 2.3 Component Specifications

#### Overlay

| Property | Value |
|----------|-------|
| Background | `bg-navy/90 backdrop-blur-md` |
| Position | `fixed inset-0 z-50` |
| Click | Closes the drawer |
| Animation | Fade in 200ms ease-out. Fade out 150ms ease-in. |

#### Drawer Panel

| Property | Value |
|----------|-------|
| Position | `fixed top-0 right-0 h-full z-50` (slides from right in LTR) |
| Width | `w-[300px] max-w-[80vw]` |
| Background | `bg-slate-blue` |
| Border | `border-l border-slate-blue-light` |
| Shadow | `shadow-2xl` |
| Padding | `p-6` |
| Animation | Slide in from right: `translateX(100% to 0)`, 300ms, ease-out. Slide out: `translateX(0 to 100%)`, 200ms, ease-in. |

#### Close Button

| Property | Value |
|----------|-------|
| Position | Top-right of drawer panel |
| Style | Icon button: `h-10 w-10 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-slate-blue-light/60` |
| Icon | `X` (Lucide), 20px |
| `aria-label` | "Close navigation menu" |

#### Navigation Links

| Property | Value |
|----------|-------|
| Container | `space-y-0 mt-8` |
| Primary links | Each: `block w-full text-left py-3 text-lg font-medium text-off-white border-b border-slate-blue-light hover:text-white transition-colors` |
| Active link | `text-bronze` |
| Idea Lab link | Bronze text: `text-bronze font-semibold` with small sparkle icon |
| Secondary links | Below a divider gap. `text-base font-medium text-muted py-2.5` for: Solutions, Case Studies, Contact |

#### Language Switcher (in Drawer)

| Property | Value |
|----------|-------|
| Position | Bottom of link list, `mt-6` |
| Style | `flex items-center gap-3` |
| Buttons | Two pill buttons: Active: `px-4 py-2 rounded-lg bg-bronze/15 text-bronze text-sm font-medium`. Inactive: `px-4 py-2 rounded-lg bg-slate-blue-light/50 text-muted text-sm font-medium hover:text-off-white` |
| Labels | "English" / "العربية" |

### 2.4 Animation Specifications

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Overlay | Opacity 0 to 1 | 200ms | ease-out |
| Drawer panel | translateX(100% to 0) | 300ms | ease-out (cubic-bezier(0.16, 1, 0.3, 1)) |
| Nav links (stagger) | Opacity 0 to 1 + translateX(20px to 0) | 200ms each, 50ms stagger | ease-out |
| Close: overlay | Opacity 1 to 0 | 150ms | ease-in |
| Close: drawer | translateX(0 to 100%) | 200ms | ease-in |

### 2.5 Accessibility

- Drawer: `<div role="dialog" aria-modal="true" aria-label="Navigation menu">`
- Focus trap: When drawer opens, focus moves to the close button. Tab cycles through: close button > nav links > language switcher. Tab from last element wraps to close button.
- Escape key: Closes drawer and returns focus to the hamburger button
- Body scroll lock: When drawer is open, `body` gets `overflow: hidden` to prevent background scrolling
- Links: All links are `<a>` or `<Link>` elements (not `<div>`). Include `onClick` to close drawer after navigation.
- Active state: `aria-current="page"` on the active link

### 2.6 RTL Considerations

- Drawer slides from the LEFT side instead of right (in Arabic/RTL layout)
- Close button moves to top-left corner
- Nav link text aligns right
- Language switcher button order: "العربية" first (active), "English" second
- CSS: Use `ltr:right-0 rtl:left-0` and `ltr:translate-x-full rtl:-translate-x-full` for animation
- Border changes from `border-l` (LTR) to `border-r` (RTL)

---

## 3. Footer

### 3.1 Purpose

The footer is the site's navigation anchor and information hub. It contains all secondary navigation, contact information, legal links, and social links. It should feel authoritative and complete without being overwhelming.

### 3.2 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|  border-top: 1px solid #243044                                     |
|  bg-slate-dark (#0D1117)                                           |
|                                                                    |
|  max-w-[1320px] centered                                           |
|                                                                    |
|  +--------+                                                        |
|  | [Logo] |                                                        |
|  | YOUR IDEAS, OUR REALITY                                         |
|  +--------+                                                        |
|                                                                    |
|  A brief description: Aviniti is an AI & App Development           |
|  company helping SMBs go digital. Based in Amman, Jordan.          |
|                                                                    |
|  +----------+  +----------+  +----------+  +----------+            |
|  |QUICK LINKS|  |AI TOOLS  |  |CONTACT   |  |FOLLOW US |            |
|  |----------|  |----------|  |----------|  |----------|            |
|  | Home     |  | Idea Lab |  | hello@.. |  | LinkedIn |            |
|  | Services |  | AI       |  | +962..   |  | WhatsApp |            |
|  | Solutions|  | Analyzer |  | WhatsApp |  |          |            |
|  | Blog     |  | Get Est. |  | Amman,   |  |          |            |
|  | FAQ      |  | ROI Calc |  | Jordan   |  |          |            |
|  | Case     |  |          |  |          |  |          |            |
|  | Studies  |  |          |  |          |  |          |            |
|  | Contact  |  |          |  |          |  |          |            |
|  +----------+  +----------+  +----------+  +----------+            |
|                                                                    |
|  ---------------------------------------------------------------   |
|  (c) 2026 Aviniti. All rights reserved.                            |
|                            Privacy Policy | Terms of Service       |
|                                 [EN / AR]                          |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.3 Component Specifications

#### Top Section (Logo + Description)

| Property | Value |
|----------|-------|
| Logo | Same as navbar: bronze infinity symbol + "AVINITI" text, 24px height |
| Tagline | `text-xs font-medium uppercase tracking-[0.1em] text-muted mt-2` -- "YOUR IDEAS, OUR REALITY" |
| Description | `text-sm text-muted mt-4 max-w-[320px]` -- "AI and app development company helping SMBs digitally transform. Based in Amman, Jordan." |
| Margin bottom | `mb-12` |

#### Link Columns

| Property | Value |
|----------|-------|
| Layout | `grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12` |
| Column heading | `text-sm font-semibold text-off-white uppercase tracking-[0.05em]` |
| Links | `space-y-3 mt-4`. Each link: `block text-sm text-muted hover:text-off-white transition-colors duration-200` |
| Active hover | Text brightens + subtle underline slides in from left |

**Column 1 -- Quick Links:**
Home, Services, Solutions, Blog, FAQ, Case Studies, Contact

**Column 2 -- AI Tools:**
Idea Lab, AI Idea Analyzer, Get AI Estimate, ROI Calculator

**Column 3 -- Contact:**
- `hello@aviniti.com` (mailto link, with Mail icon)
- `+962 XX XXX XXXX` (tel link, with Phone icon)
- "WhatsApp" (wa.me link, with MessageCircle icon)
- "Amman, Jordan" (text only, with MapPin icon)

**Column 4 -- Follow Us:**
- "LinkedIn" (external link, with LinkedIn icon from Lucide or custom SVG)
- "WhatsApp" (wa.me link, with WhatsApp icon)

Contact and Follow Us items have icons: `h-4 w-4 text-muted inline mr-2`.

#### Bottom Bar

| Property | Value |
|----------|-------|
| Divider | `h-px bg-slate-blue-light my-8` |
| Layout | `flex flex-col md:flex-row items-center justify-between gap-4` |
| Copyright | `text-sm text-muted` -- "(c) 2026 Aviniti. All rights reserved." |
| Legal links | `flex items-center gap-4`. Each: `text-sm text-muted hover:text-off-white transition-colors`. Separator: `text-slate-blue-light` pipe "|" |
| Language switcher | `flex items-center gap-2 text-sm`. Active: `text-off-white font-medium`. Inactive: `text-muted hover:text-off-white cursor-pointer` |

### 3.4 Responsive Behavior

**Desktop (1024px+):** Logo and description top-left. Four link columns in a row below. Bottom bar horizontal.

**Tablet (768px-1023px):** Logo top-left. Link columns in 2x2 grid. Bottom bar horizontal.

**Mobile (<768px):**
- Logo centered
- Description centered, `text-center`
- Link columns: each column heading becomes an accordion toggle. Tap heading to expand/collapse links. Chevron icon rotates.
- Accordion saves vertical space on mobile
- Bottom bar: stacked vertically, centered. Copyright first, legal links second, language switcher third.

### 3.5 Accessibility

- Footer: `<footer role="contentinfo">`
- Link columns: each wrapped in `<nav aria-label="[Column heading]">`
- Social links: `aria-label="Visit Aviniti on LinkedIn"`, `target="_blank" rel="noopener noreferrer"`
- Legal links: standard navigation, no special treatment needed
- Mobile accordion: Same accessibility pattern as FAQ accordion (button with `aria-expanded`, panel with `role="region"`)
- Language switcher: `aria-label="Select language"`, `aria-pressed` on active language
- All contact links: descriptive `aria-label` (e.g., "Send email to hello@aviniti.com")

### 3.6 RTL Considerations

- Link columns flow right-to-left in grid
- Logo and description align right
- Bottom bar: copyright right, legal links left
- Mobile accordion chevrons move to left side
- Contact info icons move to right side of text
- Social icons: no directional change

### 3.7 Animation

The footer has NO scroll-triggered animations. It renders immediately and completely. Per the homepage design spec: "Animating the footer would feel unnecessary and delay access to functional links."

The only animations are interactive:
- Link hover: color transition 200ms
- Social icon hover: color transition to brand color (LinkedIn blue, WhatsApp green)
- Mobile accordion: height expand/collapse 200ms ease-out

---

## 4. Chatbot "Avi" Widget

### 4.1 Purpose and Conversion Goal

The chatbot named "Avi" (referred to as "Vanity" in the PRD, but renamed to "Avi" per the user brief) provides 24/7 intelligent assistance. It serves as a lead qualification tool, FAQ answerer, and navigation aid. Demonstrating Aviniti's AI capabilities live on the website is itself a trust signal.

**Primary KPI:** Conversations initiated.
**Secondary KPI:** Chatbot-to-conversion rate (users who interact with Avi and then submit a form or book a call).

### 4.2 Layout -- Collapsed State (Floating Bubble)

```
                                        +------------------+
                                        |                  |
                                        |  [WhatsApp btn]  |  <-- bottom-left
                                        |                  |
                                        +------------------+

                                                           +--------+
                                                           |        |
                                                           |  [Avi] |  <-- bottom-right
                                                           |  bubble|
                                                           |        |
                                                           +--------+
```

#### Floating Bubble

| Property | Value |
|----------|-------|
| Position | `fixed bottom-6 right-6 z-40` |
| Size | `h-14 w-14` (56px) |
| Shape | `rounded-full` |
| Background | `bg-gradient-to-br from-bronze to-bronze-hover` |
| Shadow | `shadow-lg shadow-bronze/25` |
| Icon | Sparkles icon (Lucide `Sparkles`), `h-7 w-7 text-white` |
| Hover | `hover:scale-110 transition-transform duration-200` |
| Active | `active:scale-95` |
| `aria-label` | "Open chat with Avi, Aviniti's AI assistant" |
| Online indicator | `absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-navy` |

#### Attention Pulse (First Visit Only)

| Property | Value |
|----------|-------|
| Ring | `absolute inset-0 rounded-full animate-ping bg-bronze/30` |
| Duration | CSS `animate-ping` runs 3 times then stops (controlled via JS, set `animation-iteration-count: 3`) |
| Trigger | Only on first visit (checked via `localStorage` or session) |

#### Unread Indicator

| Property | Value |
|----------|-------|
| Position | `absolute -top-1 -right-1` |
| Size | `h-5 w-5 rounded-full bg-error flex items-center justify-center` |
| Content | `text-xs font-bold text-white` -- number of unread messages |
| Visibility | Only shown when chatbot has sent a proactive message and user has not opened the chat |

### 4.3 Layout -- Expanded State (Chat Window)

```
+--------------------------------------+
|  Avi - Aviniti AI Assistant    [-][X] |
|  Online now                           |
+--------------------------------------+
|                                      |
|  [Avi avatar] Hi! I'm Avi, your     |
|  AI assistant. I can help you        |
|  explore our services, get           |
|  estimates, or answer questions.     |
|  What brings you here today?         |
|                                      |
|  +----------------+ +---------------+|
|  | I want to      | | How much does ||
|  | build an app   | | it cost?      ||
|  +----------------+ +---------------+|
|  +----------------+ +---------------+|
|  | Show me        | | I have a      ||
|  | examples       | | question      ||
|  +----------------+ +---------------+|
|                                      |
|  [User avatar] I want to build a    |
|  delivery app                        |
|                                      |
|  [Avi avatar] Great choice! We have |
|  a ready-made Delivery App Solution  |
|  starting from $10,000 that can be   |
|  deployed in 35 days.                |
|                                      |
|  [Delivery App Solution Card]       |
|  $10,000 | 35 days                  |
|  [View Solution ->]                 |
|                                      |
|  Would you like to:                  |
|  [Get an estimate] [Learn more]     |
|                                      |
+--------------------------------------+
|  [Type your message...]        [Send] |
+--------------------------------------+
```

#### Chat Window

| Property | Value |
|----------|-------|
| Position | `fixed bottom-24 right-6 z-40` (above the floating bubble) |
| Width | `w-[380px]` (desktop). `w-[calc(100vw-32px)] max-w-[380px]` (mobile) |
| Height | `h-[520px] max-h-[70vh]` |
| Background | `bg-slate-blue` |
| Border | `border border-slate-blue-light` |
| Radius | `rounded-2xl` (20px) |
| Shadow | `shadow-2xl` |
| Layout | Flex column: header (fixed) + messages (scrollable) + input (fixed) |

#### Chat Header

| Property | Value |
|----------|-------|
| Container | `flex items-center justify-between px-4 py-3 border-b border-slate-blue-light` |
| Avatar | `h-10 w-10 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center`. Icon: `Sparkles h-5 w-5 text-white` |
| Title | `text-sm font-semibold text-white ml-3` -- "Avi" |
| Subtitle | `text-xs text-success ml-3` -- "Online now" (with green dot: `h-1.5 w-1.5 rounded-full bg-success inline-block mr-1`) |
| Minimize button | Icon button `h-8 w-8 rounded-lg text-muted hover:text-white hover:bg-slate-blue-light`. Icon: `Minus h-4 w-4`. `aria-label="Minimize chat"` |
| Close button | Icon button `h-8 w-8 rounded-lg text-muted hover:text-white hover:bg-slate-blue-light`. Icon: `X h-4 w-4`. `aria-label="Close chat"` |

#### Messages Area

| Property | Value |
|----------|-------|
| Container | `flex-1 overflow-y-auto p-4 space-y-4` |
| Scroll behavior | Smooth auto-scroll to bottom on new messages |

**Bot Message:**

| Property | Value |
|----------|-------|
| Layout | `flex items-start gap-2.5` |
| Avatar | `h-8 w-8 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center flex-shrink-0`. Icon: `Sparkles h-4 w-4 text-white` |
| Bubble | `bg-slate-blue-light rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]` |
| Text | `text-sm text-off-white leading-relaxed` |
| Timestamp | `text-xs text-muted-light mt-1` -- "Just now" |

**User Message:**

| Property | Value |
|----------|-------|
| Layout | `flex items-start gap-2.5 flex-row-reverse` |
| Bubble | `bg-bronze/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]` |
| Text | `text-sm text-off-white leading-relaxed` |
| Timestamp | `text-xs text-muted-light mt-1 text-right` |

**Quick Reply Buttons:**

| Property | Value |
|----------|-------|
| Container | `flex flex-wrap gap-2 mt-3` |
| Button | `px-3 py-2 rounded-lg bg-slate-blue border border-slate-blue-light text-sm text-off-white hover:bg-slate-blue-light hover:text-white transition-colors cursor-pointer` |

**Link Card (Solution/Tool reference):**

| Property | Value |
|----------|-------|
| Container | `bg-navy/50 border border-slate-blue-light rounded-lg p-3 mt-2` |
| Title | `text-sm font-semibold text-white` |
| Description | `text-xs text-muted mt-1` |
| CTA | `text-xs text-bronze font-medium mt-2 inline-flex items-center gap-1` with arrow |

**Typing Indicator:**

| Property | Value |
|----------|-------|
| Container | `flex items-start gap-2.5` (same layout as bot message) |
| Dots | Three dots inside the bubble: `flex items-center gap-1 px-4 py-3`. Each dot: `h-2 w-2 rounded-full bg-muted`. Animation: sequential bounce with 200ms stagger (`animate-bounce`) |
| Duration | Displayed while API call is in progress |

#### Input Area

| Property | Value |
|----------|-------|
| Container | `flex items-center gap-2 px-4 py-3 border-t border-slate-blue-light` |
| Input | `flex-1 h-10 px-3 py-2 bg-navy/50 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus:border-bronze focus:ring-1 focus:ring-bronze transition-all` |
| Placeholder | "Type your message..." |
| Send button | `h-10 w-10 rounded-lg bg-bronze flex items-center justify-center text-white hover:bg-bronze-hover transition-colors disabled:opacity-50`. Icon: `Send h-4 w-4`. Disabled when input is empty. |
| `aria-label` | Input: "Chat message". Send: "Send message". |

### 4.4 Proactive Messages

Context-aware messages triggered after a configurable delay. Only trigger once per session per page type.

| Page Context | Delay | Message |
|-------------|-------|---------|
| Any page (first visit) | 30 seconds | "Hi! I'm Avi, Aviniti's AI assistant. Need help finding what you're looking for?" |
| Solutions page | 20 seconds | "Looking for a specific solution? I can help you find the right fit." |
| Pricing/Estimate pages | 25 seconds | "Have questions about pricing? I can explain how our estimates work." |
| After 50% scroll (any page) | On scroll | "Finding what you need? I'm here if you have questions." |

**Implementation:** Proactive messages appear as an unread indicator on the bubble (the badge with count "1"). If the user opens the chat, the proactive message is the first message displayed. The bubble does NOT auto-expand to show the chat window. This avoids being intrusive.

### 4.5 Responsive Behavior

**Desktop:** Floating bubble and chat window as specified above. Window is 380px wide.

**Mobile (<768px):**
- Bubble position: `bottom-20 right-4` (above WhatsApp button position)
- Chat window: Expands to near-full-screen. `fixed inset-x-4 bottom-4 top-20 z-50 rounded-2xl` or `fixed inset-0 z-50` with rounded corners only on mobile landscape
- Animation: Slides up from bottom (like a bottom sheet) instead of appearing in-place
- Close button more prominent
- Input: `text-base` (16px to prevent iOS zoom)

### 4.6 Animation Specifications

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Bubble appearance | Scale(0 to 1) + opacity | 400ms | spring (cubic-bezier(0.34, 1.56, 0.64, 1)) |
| Attention pulse | Ping animation (3 iterations) | 1s per ping | ease-out |
| Chat window open | Scale(0.95 to 1) + opacity + translateY(10px to 0) | 300ms | ease-out |
| Chat window close | Scale(1 to 0.95) + opacity + translateY(0 to 10px) | 200ms | ease-in |
| New message (bot) | translateY(10px to 0) + opacity | 300ms | ease-out |
| New message (user) | translateY(10px to 0) + opacity | 200ms | ease-out |
| Typing dots | Bounce animation, 200ms stagger per dot | 600ms per cycle | ease-in-out |
| Quick reply buttons | Fade in + translateY(5px), stagger 50ms | 200ms each | ease-out |

### 4.7 Accessibility

- Bubble: `<button>` with descriptive `aria-label`
- Chat window: `role="dialog" aria-modal="false" aria-label="Chat with Avi, AI assistant"` (not modal -- user can still interact with page behind it)
- Messages: `role="log" aria-live="polite" aria-label="Chat messages"` on messages container. New messages announced to screen readers.
- Each message: `<div role="article" aria-label="Message from Avi">`
- Input: `<input aria-label="Chat message" autocomplete="off">`
- Quick replies: `role="group" aria-label="Suggested responses"`. Each button is a `<button>`.
- Typing indicator: `aria-label="Avi is typing"` with `role="status"`
- Keyboard: Tab navigates between close button, messages area, quick replies, input, send button. Enter sends message. Escape minimizes (does not close completely).
- Focus: When chat opens, focus moves to the input field. When chat closes, focus returns to the bubble button.
- Minimize vs Close: Minimize keeps chat in memory (conversation persists). Close resets conversation. Both return to bubble state.

### 4.8 RTL Considerations

- Bubble moves to `bottom-6 left-6` (RTL reverses left/right positioning)
- Chat window anchors to bottom-left
- Bot messages: avatar on right, bubble aligns right, rounded-tl becomes rounded-tr
- User messages: bubble aligns left, rounded-tr becomes rounded-tl
- Input area: Send button moves to left of input
- Quick reply buttons: flow right-to-left naturally
- Header: Close/minimize buttons move to left side

### 4.9 Technical Notes

- **Lazy loaded:** The chatbot widget JS bundle is loaded after page interactive (use `next/dynamic` with `ssr: false` and `loading` placeholder)
- **Gemini API integration:** Messages sent to backend API route (`/api/chat`) which proxies to Google Gemini. System prompt includes Aviniti context, current page, available tools, and user language.
- **Session persistence:** Conversation history stored in `sessionStorage`. Cleared on session end.
- **Rate limiting:** Maximum 30 messages per session, 5 messages per minute. After limit: "I'm getting a lot of questions! For detailed discussions, please [book a call](/contact) or [message us on WhatsApp](wa.me link)."
- **Language detection:** Avi responds in the same language as the user's message. If the site is in Arabic mode, the initial greeting is in Arabic.
- **Fallback:** If Gemini API fails, display: "I'm having trouble connecting. Please try again in a moment, or [contact us directly](/contact)."

---

## 5. Exit Intent Popup

### 5.1 Purpose and Conversion Goal

The exit intent popup is the last-chance conversion mechanism. It fires when a visitor shows signs of leaving without converting. The goal is to capture at least an email address through a value exchange (free guide, consultation, or quick estimate).

**Primary KPI:** Exit intent conversion rate (email captures).
**Secondary KPI:** CTA click-through (Calendly bookings, WhatsApp initiations).

### 5.2 Trigger Conditions

| Condition | Platform | Detection Method |
|-----------|----------|-----------------|
| Mouse moves to close/back area | Desktop | `mouseleave` on `<html>` element, checking `e.clientY < 0` |
| Tab switching | Desktop | `visibilitychange` event, `document.hidden` becomes true |
| Fast scroll to top | Mobile | Scroll velocity detection: user scrolls up > 500px within 300ms after being on page > 30 seconds |
| Back button | Mobile | `popstate` event (intercept with history API) |

**Suppression rules (popup does NOT trigger if):**

| Rule | Check |
|------|-------|
| User has already converted | `localStorage.getItem('aviniti_converted') === 'true'` |
| Popup was dismissed this session | `sessionStorage.getItem('exit_intent_dismissed') === 'true'` |
| User is on legal pages | Current route matches `/privacy-policy` or `/terms-of-service` |
| Page visit < 5 seconds | Time-on-page check (prevents false positives from accidental triggers) |
| User came from an internal link click | Track internal navigation (user clicking to another Aviniti page should not trigger) |

### 5.3 Layout -- Desktop Wireframe

```
+------------------------------------------------------------------+
|                                                                    |
|  bg-navy/85 backdrop-blur-sm (overlay)                             |
|                                                                    |
|     +--------------------------------------------------+          |
|     |                                        [X close] |          |
|     |                                                  |          |
|     |  +-------------------+  +--------------------+   |          |
|     |  |                   |  |                    |   |          |
|     |  |  [Visual /        |  |  Wait! Before     |   |          |
|     |  |   eBook cover /   |  |  You Go...        |   |          |
|     |  |   calendar icon]  |  |                    |   |          |
|     |  |                   |  |  Subheadline text  |   |          |
|     |  |                   |  |                    |   |          |
|     |  |                   |  |  [Email input]     |   |          |
|     |  |                   |  |  [CTA button]      |   |          |
|     |  |                   |  |                    |   |          |
|     |  |                   |  |  No thanks link    |   |          |
|     |  +-------------------+  +--------------------+   |          |
|     |                                                  |          |
|     +--------------------------------------------------+          |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.4 Popup Variants

#### Variation A: Lead Magnet Offer

**Trigger context:** First-time visitors on non-specific pages (homepage, blog, FAQ).

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Wait! Before You Go..." |
| Subheadline | `text-base text-muted mt-3` -- "Get our free guide: '10 AI App Ideas That Are Changing Industries'" |
| Visual | Left column: eBook cover mockup image (`aspect-[3/4] rounded-lg shadow-lg max-w-[200px]`) |
| Form | Email input: design system text input. Placeholder: "your@email.com" |
| CTA | `Button variant="primary" size="lg" w-full mt-3` -- "Send Me the Guide" |
| Dismiss | `text-sm text-muted mt-4 hover:text-off-white cursor-pointer text-center` -- "No thanks, I'll pass" |

#### Variation B: Consultation Offer

**Trigger context:** Visitors on services or solutions pages.

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Have Questions?" |
| Subheadline | `text-base text-muted mt-3` -- "Book a free 15-minute consultation with our team. No commitment, just answers." |
| Visual | Calendar icon or team illustration |
| CTA | `Button variant="primary" size="lg" w-full mt-4` -- "Book Free Consultation" (links to Calendly) |
| Dismiss | `text-sm text-muted mt-4` -- "Maybe Later" |

#### Variation C: Quick Estimate

**Trigger context:** Visitors who viewed pricing or estimate content.

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Get Your Estimate in 60 Seconds" |
| Subheadline | `text-base text-muted mt-3` -- "Our AI can give you a ballpark figure right now." |
| Form fields | Select: "Project Type" (dropdown: Mobile App, Web App, AI Solution, Other). Email input. |
| CTA | `Button variant="primary" size="lg" w-full mt-3` -- "Get Quick Estimate" |
| Dismiss | `text-sm text-muted mt-4` -- "I need more time" |

#### Variation D: WhatsApp Connect

**Trigger context:** Mobile visitors or MENA region detection.

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Prefer WhatsApp?" |
| Subheadline | `text-base text-muted mt-3` -- "Chat with us directly. We respond within minutes." |
| Visual | Large WhatsApp icon in `#25D366`, 64px |
| CTA | `mt-4 h-11 px-5 bg-[#25D366] text-white font-semibold rounded-lg` -- "Open WhatsApp" |
| Dismiss | `text-sm text-muted mt-4` -- "Send Email Instead" (converts to Variation A) |

#### Variation E: Chatbot Activation

**Trigger context:** Visitors who have not interacted with Avi.

| Element | Spec |
|---------|------|
| Headline | `text-h3 text-white` -- "Need Help Finding What You're Looking For?" |
| Subheadline | `text-base text-muted mt-3` -- "Our AI assistant Avi can help guide you to exactly what you need." |
| Visual | Avi avatar (large, 64px) with sparkle animation |
| CTA | `Button variant="primary" size="lg" w-full mt-4` -- "Chat with Avi" (opens chatbot) |
| Dismiss | `text-sm text-muted mt-4` -- "No thanks" |

### 5.5 Component Specifications

#### Overlay

| Property | Value |
|----------|-------|
| Position | `fixed inset-0 z-[60]` (above chatbot z-40) |
| Background | `bg-navy/85 backdrop-blur-sm` |
| Click behavior | Clicking overlay dismisses popup |
| Animation | Fade in 200ms |

#### Modal Card

| Property | Value |
|----------|-------|
| Position | Centered in viewport: `flex items-center justify-center` on overlay |
| Width | `max-w-lg` (512px) for single-column variants, `max-w-2xl` (672px) for two-column (lead magnet with image) |
| Background | `bg-slate-blue` |
| Border | `border border-slate-blue-light` |
| Radius | `rounded-xl` (16px) |
| Shadow | `shadow-2xl` |
| Padding | `p-6 md:p-8` |
| Close button | Top-right: Icon button with `X` icon. `absolute top-4 right-4 h-8 w-8 rounded-lg text-muted hover:text-white hover:bg-slate-blue-light transition-colors`. `aria-label="Close popup"` |

#### Form Elements

All form elements use design system tokens exactly as specified in the design-system.md Form Inputs section (7.3).

#### Success State

After form submission:

| Property | Value |
|----------|-------|
| Animation | Content fades out (200ms), success content fades in (300ms) |
| Icon | `CheckCircle h-12 w-12 text-success mx-auto` |
| Heading | `text-h4 text-white mt-4 text-center` -- "You're all set!" |
| Description | `text-base text-muted mt-2 text-center` -- "Check your inbox for the guide." or "Your estimate is on the way." |
| Auto-dismiss | Modal auto-closes after 3 seconds |

### 5.6 Mobile Behavior

On mobile, the exit intent popup slides up from the bottom as a bottom sheet instead of centering as a modal.

| Property | Value |
|----------|-------|
| Position | `fixed bottom-0 inset-x-0 z-[60]` |
| Radius | `rounded-t-2xl` (top corners only) |
| Max height | `max-h-[85vh]` |
| Animation | Slide up from bottom, 300ms ease-out |
| Dismiss | Swipe down gesture or close button or "No thanks" link |
| Drag handle | `w-10 h-1 bg-muted-light rounded-full mx-auto mt-3` at top |

### 5.7 Animation Specifications

**Desktop:**

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Overlay | Opacity 0 to 1 | 200ms | ease-out |
| Modal card | Scale(0.95 to 1) + opacity + translateY(10px to 0) | 300ms | ease-out-expo |
| Close: modal | Scale(1 to 0.95) + opacity + translateY(0 to 10px) | 200ms | ease-in |
| Close: overlay | Opacity 1 to 0 | 150ms | ease-in |
| Form success transition | Cross-fade | 300ms | ease-in-out |

**Mobile:**

| Element | Animation | Duration |
|---------|-----------|----------|
| Overlay | Fade in | 200ms |
| Bottom sheet | translateY(100% to 0) | 300ms ease-out |
| Dismiss | translateY(0 to 100%) | 200ms ease-in |

### 5.8 Accessibility

- Overlay: `role="dialog" aria-modal="true" aria-label="Special offer"` (or descriptive label per variant)
- Focus trap: When popup opens, focus moves to the first focusable element (close button or first form input). Tab cycles within popup. Tab from last element wraps to first.
- Escape key: Closes popup
- Body scroll lock: `overflow: hidden` on `<body>` when popup is visible
- Close button: `aria-label="Close popup"`
- Dismiss link: Clearly focusable and keyboard-accessible
- Form labels: All inputs have associated `<label>` elements
- Success announcement: `role="status" aria-live="polite"` on success message container
- Motion: If `prefers-reduced-motion: reduce`, replace scale/translate animations with simple opacity fade

### 5.9 RTL Considerations

- Close button moves from top-right to top-left
- Two-column layout (lead magnet): image column moves from left to right
- Form field text direction: RTL for text inputs, but email input stays LTR internally
- CTA button text: centered (no directional concern)
- Bottom sheet on mobile: no directional change needed

### 5.10 A/B Testing Support

The exit intent system should support A/B testing between variants:

| Property | Value |
|----------|-------|
| Variant selection | Based on random assignment stored in `sessionStorage` |
| Tracking | Each variant impression and conversion tracked via Google Analytics custom events: `exit_intent_shown` (with variant label) and `exit_intent_converted` |
| Override | Query param `?exit_variant=A` forces a specific variant (for testing) |

---

## 6. WhatsApp Floating Button

### 6.1 Purpose

The WhatsApp button provides instant access to WhatsApp messaging -- the dominant communication channel in the MENA region. It must be always visible but never intrusive, complementing the Avi chatbot bubble on the opposite corner.

### 6.2 Layout

```
+--------+
|        |
| [WA]   |  <-- bottom-left corner
|        |
+--------+
                                        +--------+
                                        |        |
                                        | [Avi]  |  <-- bottom-right corner
                                        |        |
                                        +--------+
```

### 6.3 Component Specifications

| Property | Value |
|----------|-------|
| Position | `fixed bottom-6 left-6 z-40` |
| Size | `h-14 w-14` (56px) -- matches Avi bubble size for visual balance |
| Shape | `rounded-full` |
| Background | `bg-[#25D366]` (WhatsApp green) |
| Shadow | `shadow-lg shadow-[#25D366]/25` |
| Icon | WhatsApp icon SVG (white), `h-7 w-7` |
| Hover | `hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-200` |
| Active | `active:scale-95` |
| `aria-label` | "Message us on WhatsApp" |
| Click action | Opens `https://wa.me/962XXXXXXXXX?text=Hi! I'm interested in learning more about Aviniti's services.` |
| Target | `target="_blank" rel="noopener noreferrer"` |

#### Subtle Pulse (First Visit)

| Property | Value |
|----------|-------|
| Ring | `absolute inset-0 rounded-full bg-[#25D366]/20` with single gentle pulse on load |
| Duration | Runs once on first load (2s duration), then stops |
| Purpose | Draw attention without being as aggressive as the chatbot pulse |

#### Tooltip on Hover (Desktop Only)

| Property | Value |
|----------|-------|
| Content | "Chat on WhatsApp" |
| Position | Above the button, centered |
| Style | Design system Tooltip: `bg-slate-dark text-xs text-off-white px-2.5 py-1.5 rounded-lg shadow-lg` |
| Animation | Fade in + translateY(4px to 0), 150ms |
| Delay | 200ms show delay |

### 6.4 Responsive Behavior

**Desktop:** Position fixed bottom-left. Tooltip on hover.

**Mobile:** Position `fixed bottom-6 left-4`. Slightly smaller if needed (`h-12 w-12`). No tooltip. Consider moving up if it overlaps with mobile browser UI elements.

**Coordination with chatbot:** Both buttons are at `z-40`. They are positioned on opposite sides (WhatsApp bottom-left, Avi bottom-right) to avoid overlap. On very small screens (< 375px), both buttons may reduce to `h-12 w-12` (48px).

### 6.5 Accessibility

- Element: `<a>` tag (external link), not `<button>`
- `aria-label`: "Message us on WhatsApp (opens in new tab)"
- Focus style: `focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-navy`
- No keyboard trap -- standard link behavior
- Screen reader: Announces as a link, destination clear from label

### 6.6 RTL Considerations

- Position swaps to `fixed bottom-6 right-6` in RTL
- The Avi chatbot correspondingly moves to `fixed bottom-6 left-6`
- This swap ensures both buttons maintain their relative positions (WhatsApp on the natural "start" side, Avi on the "end" side)
- WhatsApp pre-filled message: Arabic version for Arabic locale -- "مرحبا! أنا مهتم بمعرفة المزيد عن خدمات أفينيتي."

### 6.7 Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Initial appearance | Scale(0 to 1), delayed 1s after page load | 400ms, spring easing |
| Hover | Scale to 1.1 | 200ms |
| Active/press | Scale to 0.95 | 100ms |
| First-visit pulse | Single gentle ring expansion | 2s, once |

---

## 7. Breadcrumbs

### 7.1 Purpose

Breadcrumbs provide wayfinding context on all pages except the homepage. They reduce disorientation, improve SEO through structured data, and provide quick navigation to parent pages.

### 7.2 Component Specification

| Property | Value |
|----------|-------|
| Container | `<nav aria-label="Breadcrumb">` |
| Inner wrapper | `flex items-center gap-2 text-sm` within page container (`max-w-[1320px]` or `max-w-[768px]` for narrow pages) |
| Padding | `pt-4 pb-2` (compact, just below navbar space) |

#### Breadcrumb Items

| Element | Spec |
|---------|------|
| Link (non-current) | `text-muted hover:text-bronze transition-colors duration-200` |
| Separator | Lucide `ChevronRight` icon, `h-4 w-4 text-muted-light` |
| Current page | `text-off-white` (not a link) |
| `aria-current` | `"page"` on the last (current page) item |

#### HTML Structure

```html
<nav aria-label="Breadcrumb" class="pt-4 pb-2">
  <ol class="flex items-center gap-2 text-sm">
    <li>
      <a href="/" class="text-muted hover:text-bronze transition-colors">Home</a>
    </li>
    <li class="flex items-center gap-2">
      <ChevronRight class="h-4 w-4 text-muted-light" aria-hidden="true" />
      <a href="/solutions" class="text-muted hover:text-bronze transition-colors">Solutions</a>
    </li>
    <li class="flex items-center gap-2">
      <ChevronRight class="h-4 w-4 text-muted-light" aria-hidden="true" />
      <span class="text-off-white" aria-current="page">Delivery App</span>
    </li>
  </ol>
</nav>
```

#### JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviniti.com/" },
    { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://aviniti.com/solutions" },
    { "@type": "ListItem", "position": 3, "name": "Delivery App" }
  ]
}
```

### 7.3 Breadcrumb Paths (All Pages)

| Page | Breadcrumb Path |
|------|----------------|
| Solutions Catalog | Home > Solutions |
| Solution Detail | Home > Solutions > [Solution Name] |
| Blog Listing | Home > Blog |
| Blog Post | Home > Blog > [Post Title] |
| Case Studies Listing | Home > Case Studies |
| Case Study Detail | Home > Case Studies > [Case Study Title] |
| FAQ | Home > FAQ |
| Contact | Home > Contact |
| Privacy Policy | Home > Privacy Policy |
| Terms of Service | Home > Terms of Service |
| Get AI Estimate | Home > Get AI Estimate |
| Idea Lab | Home > Idea Lab |
| AI Idea Analyzer | Home > AI Idea Analyzer |
| ROI Calculator | Home > ROI Calculator |
| 404 | (no breadcrumbs) |

### 7.4 Responsive Behavior

**Desktop/Tablet:** Full breadcrumb path visible.

**Mobile:** If breadcrumb path exceeds available width, use truncation:
- Show: Home > ... > Current Page
- The "..." is a clickable element that expands to show full path
- Alternatively, show only the immediate parent: "< Back to Solutions" (mobile-friendly back link pattern)

### 7.5 RTL Considerations

- Breadcrumb items flow right-to-left
- Separator chevrons flip to `ChevronLeft` (pointing from current to parent, reading right-to-left)
- Text alignment: right
- "Home" label translates to Arabic equivalent

### 7.6 Accessibility

- `<nav aria-label="Breadcrumb">` as the wrapper
- `<ol>` for ordered list semantics (breadcrumbs have inherent order)
- `aria-current="page"` on the current page item
- Separators: `aria-hidden="true"` (decorative, screen readers should not announce them)
- Screen reader experience: "Breadcrumb navigation: Home, link; Solutions, link; Delivery App, current page"

---

## 8. 404 Page

### 8.1 Purpose

The 404 page handles navigation errors gracefully. Instead of a dead end, it should feel on-brand, helpful, and provide clear paths forward. A well-designed 404 page reduces bounce and demonstrates attention to detail.

**Conversion goal:** Redirect lost visitors to useful pages. Prevent abandonment.

### 8.2 URL

All unmatched routes render this page. Next.js handles this via `app/not-found.tsx`.

### 8.3 SEO

```html
<title>Page Not Found | Aviniti</title>
<meta name="robots" content="noindex, nofollow" />
```

No indexing, no following. The 404 page should not appear in search results.

### 8.4 Layout -- Wireframe

```
+------------------------------------------------------------------+
|                       [Sticky Navbar]                              |
+------------------------------------------------------------------+
|                                                                    |
|                                                                    |
|           [Branded Illustration]                                   |
|        (Infinity symbol + geometric)                               |
|                                                                    |
|                Page Not Found                                      |
|             الصفحة غير موجودة (AR)                                 |
|                                                                    |
|         The page you're looking for doesn't exist                  |
|         or has been moved. Let's get you back on track.            |
|                                                                    |
|            [Go to Homepage]    [Get AI Estimate]                   |
|                                                                    |
|         Or try one of these:                                       |
|         * Our AI Tools                                             |
|         * Ready-Made Solutions                                     |
|         * Blog                                                     |
|         * Contact Us                                               |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+
|                         [Footer]                                   |
+------------------------------------------------------------------+
```

### 8.5 Branded Illustration Concept

The 404 page features a custom illustration that maintains brand identity while being friendly and non-alarming.

#### Illustration Composition

**Visual concept:** Abstract geometric pattern with bronze infinity symbol centerpiece

```
+-----------------------------------------------------+
|                                                     |
|         ╱◇╲      ╱◇╲      ╱◇╲                      |
|        ◇   ◇    ◇   ◇    ◇   ◇                     |
|         ╲◇╱      ╲◇╱      ╲◇╱                      |
|                                                     |
|                  ∞                                  |
|            (Bronze Infinity)                        |
|                                                     |
|         ╱◇╲      ╱◇╲      ╱◇╲                      |
|        ◇   ◇    ◇   ◇    ◇   ◇                     |
|         ╲◇╱      ╲◇╱      ╲◇╱                      |
|                                                     |
+-----------------------------------------------------+
```

**Elements:**

1. **Bronze Infinity Symbol (Centerpiece)**
   - Size: 120px x 60px
   - Color: `#C08460` (Bronze)
   - Stroke width: 4px
   - Glow effect: `drop-shadow(0 0 20px rgba(192, 132, 96, 0.4))`
   - Position: Centered in illustration area

2. **Floating Geometric Shapes (Background)**
   - 6-8 abstract diamond/circle shapes
   - Sizes: 40px - 80px
   - Colors:
     - `#243044` (Slate Blue Light) at 60% opacity
     - `#C08460` (Bronze) at 15% opacity
   - Scattered around infinity symbol
   - Soft blur: `filter: blur(1px)` for depth

3. **Connecting Lines (Optional)**
   - Thin dotted lines connecting some shapes
   - Color: `#243044` at 30% opacity
   - Stroke width: 1px
   - Stroke: dashed (4px dash, 8px gap)

**Dimensions:**
- Illustration container: 480px x 320px (desktop)
- Illustration container: 280px x 200px (mobile)
- Maintains aspect ratio on all breakpoints

**Implementation approach:**
- SVG inline for sharpness and animation control
- Or React component with Framer Motion for animated entrance

### 8.6 Component Specifications

| Element | Spec |
|---------|------|
| Container | `min-h-[70vh] flex flex-col items-center justify-center` within main content area, `py-16 md:py-24` |
| Content wrapper | `max-w-[680px] mx-auto text-center px-4` |
| Illustration area | `w-full max-w-[480px] h-[320px] md:h-[320px] sm:h-[200px] mx-auto mb-8 md:mb-12 relative` |
| Infinity symbol | `w-[120px] h-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-bronze` with glow filter |
| Geometric shapes | Absolute positioned within illustration area, `opacity-60` for slate blue, `opacity-15` for bronze accents |
| Headline (EN) | `text-h2 text-white mt-6` -- "Page Not Found" |
| Headline (AR) | `text-h3 text-muted mt-2` -- "الصفحة غير موجودة" |
| Description | `text-lg text-muted mt-4 max-w-[480px] mx-auto` -- "The page you're looking for doesn't exist or has been moved. Let's get you back on track." |
| Primary CTA | `Button variant="primary" size="lg"` -- "Go to Homepage" / "العودة للرئيسية" |
| Secondary CTA | `Button variant="outline" size="lg"` -- "Get AI Estimate" / "احصل على تقدير" |
| Button layout | `flex flex-col sm:flex-row items-center justify-center gap-3 mt-8` |
| Helpful links section | `mt-12`. Heading: `text-sm font-semibold uppercase tracking-[0.1em] text-muted mb-5` -- "OR TRY ONE OF THESE" / "أو جرّب أحد هذه" |
| Helpful links | `flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap`. Each link: `text-sm text-bronze hover:text-bronze-light transition-colors inline-flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-blue-light/30` with icon |
| Background | `bg-navy` (standard page background) |

#### Helpful Links

Quick navigation options with icons:

| Link Text (EN) | Link Text (AR) | Route | Icon (Lucide) |
|----------------|---------------|-------|---------------|
| Our AI Tools | أدواتنا الذكية | `/get-estimate` | `Sparkles` |
| Ready-Made Solutions | حلول جاهزة | `/solutions` | `Package` |
| Blog | المدونة | `/blog` | `FileText` |
| Contact Us | اتصل بنا | `/contact` | `Mail` |

**Icon styling:** 16px size, bronze color, aligned inline with text

### 8.7 Animated Elements

#### Floating Shapes Animation

The geometric shapes in the illustration have subtle continuous animation:

**Animation: Gentle float**
- Vertical translation: `translateY(0) → translateY(-12px) → translateY(0)`
- Duration: 4-6 seconds per shape (vary durations for organic feel)
- Easing: `ease-in-out`
- Loop: Infinite
- Stagger: Each shape has different start delay (0ms, 800ms, 1600ms, etc.)

**Implementation with Framer Motion:**

```jsx
<motion.div
  animate={{
    y: [0, -12, 0],
    rotate: [0, 2, 0], // Subtle rotation
  }}
  transition={{
    duration: 5,
    ease: "easeInOut",
    repeat: Infinity,
    delay: shapeIndex * 0.8, // Stagger
  }}
>
  {/* Shape SVG */}
</motion.div>
```

#### Infinity Symbol Animation

**Animation: Glow pulse**
- Glow intensity pulses subtly
- `drop-shadow` filter animates opacity: `0.3 → 0.5 → 0.3`
- Duration: 3 seconds
- Loop: Infinite
- Easing: `ease-in-out`

**Implementation:**

```jsx
<motion.svg
  animate={{
    filter: [
      'drop-shadow(0 0 20px rgba(192, 132, 96, 0.3))',
      'drop-shadow(0 0 24px rgba(192, 132, 96, 0.5))',
      'drop-shadow(0 0 20px rgba(192, 132, 96, 0.3))',
    ],
  }}
  transition={{
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  }}
>
  {/* Infinity path */}
</motion.svg>
```

### 8.8 Responsive Behavior

**Desktop (1024px+):**
- Illustration: 480px x 320px
- Headline: `text-h2` (42px)
- Two-column button layout
- Helpful links in horizontal row

**Tablet (768px - 1023px):**
- Illustration: 360px x 240px
- Headline: `text-h2` (38px)
- Two-column button layout
- Helpful links wrap to 2 columns

**Mobile (<768px):**
- Illustration: 280px x 200px
- Headline: `text-h3` (30px)
- Buttons: stacked full-width (within max-w-xs constraint)
- Helpful links: stacked vertically, full-width tappable area
- Arabic headline: `text-2xl` for better readability

### 8.9 Page Load Animation Sequence

Choreographed entrance animations create a polished, premium feel:

| Element | Animation | Duration | Delay | Easing |
|---------|-----------|----------|-------|--------|
| Geometric shapes | Fade in + scale(0.8 to 1) | 500ms | 0ms (stagger 50ms each) | ease-out |
| Infinity symbol | Fade in + scale(1.2 to 1) with rotation (360° to 0°) | 800ms | 300ms | ease-out |
| Headline (EN) | Fade in + translateY(20px to 0) | 400ms | 600ms | ease-out |
| Headline (AR) | Fade in + translateY(15px to 0) | 350ms | 750ms | ease-out |
| Description | Fade in + translateY(15px to 0) | 400ms | 900ms | ease-out |
| CTAs | Fade in + translateY(15px to 0) | 400ms | 1100ms | ease-out |
| Helpful links | Fade in, stagger 60ms | 300ms each | 1300ms | ease-out |

**Reduced motion:** All animations convert to simple opacity fade (0 to 1) over 200ms

**Framer Motion implementation pattern:**

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
>
  <h1>Page Not Found</h1>
</motion.div>
```

### 8.10 Accessibility

- Page: `<main id="main-content" aria-label="Page not found">`
- Illustration: Entire SVG has `aria-hidden="true"` and `role="presentation"` (decorative visual, no semantic meaning)
- Infinity symbol: `aria-hidden="true"` (decorative)
- Heading: `<h1>` -- "Page Not Found" (English primary), `<p lang="ar">` for Arabic translation
- Description: Standard paragraph with `lang="en"` attribute
- Buttons: Standard button accessibility with `aria-label` for clarity
  - Primary: `aria-label="Return to Aviniti homepage"`
  - Secondary: `aria-label="Get an AI project estimate"`
- Helpful links: `<nav aria-label="Suggested pages">` wrapping the link list
- Each link: `<a>` with descriptive text + icon with `aria-hidden="true"` on icon
- Screen reader experience: "Page not found. الصفحة غير موجودة. The page you're looking for doesn't exist or has been moved. Let's get you back on track. Go to Homepage button. Get AI Estimate button. Suggested pages navigation: Our AI Tools, Ready-Made Solutions, Blog, Contact Us."
- Focus management: No focus trap. Standard tab order: CTAs → helpful links → footer links
- Animations: Respect `prefers-reduced-motion` - disable floating shapes and replace entrance animations with simple fade

### 8.11 RTL Layout Considerations

**Direction handling for `/ar/` routes:**

- Container and content wrapper: Inherits `dir="rtl"` from `<html>` element
- All text remains center-aligned: no visual change needed
- Illustration: Symmetric design (infinity symbol), no mirroring needed
- Geometric shapes: Random scatter pattern, no directional concern
- Helpful links (mobile): When stacked vertically, icon position flips
  - LTR: Icon → Text
  - RTL: Text ← Icon
  - Implementation: `flex-row-reverse` on RTL locale
- Button layout: Maintains center alignment, no change
- Icons on helpful links: Use `dir-aware` styling
  - LTR: `ArrowRight` icon
  - RTL: `ArrowLeft` icon
  - Implementation: Conditional icon based on locale

**Arabic text styling:**

```css
[lang="ar"] {
  font-family: 'Inter', 'Noto Sans Arabic', sans-serif;
  line-height: 1.6; /* Slightly increased for Arabic script */
}
```

**Arabic headline:**
- Font-size: Slightly larger than English equivalent for better legibility (`text-3xl` vs English `text-h3`)
- Weight: 600 (Arabic text appears lighter than Latin at same weight)
- Color: `#9CA3AF` (Muted) to differentiate from primary English headline

### 8.12 No Exit Intent on 404

The exit intent popup does NOT trigger on the 404 page. The user is already lost -- showing a popup would compound frustration. The chatbot bubble remains visible for assistance.

**Exception:** If the user has been on the 404 page for more than 30 seconds AND hovers over the helpful links area, the chatbot could proactively send a message: "Having trouble finding what you need? I can help guide you." This is gentler than an exit popup and contextually relevant.

### 8.13 SEO and Metadata

**HTTP Status Code:** 404 (properly returned by Next.js `notFound()` function)

**Meta tags:**

```tsx
export const metadata: Metadata = {
  title: 'Page Not Found | Aviniti',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};
```

**No Open Graph image:** 404 pages should not be shared socially, so no OG tags needed.

**Canonical:** None (404 is not a real page to be indexed)

### 8.14 Error Tracking

Log 404 errors to analytics to identify broken links and common navigation mistakes:

**Tracked data:**
- Requested URL (the broken path)
- Referrer (where the user came from)
- Timestamp
- User locale (EN/AR)
- Device type (mobile/desktop)

**Implementation:**

```tsx
// app/not-found.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function NotFound() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackEvent('404_error', {
      path: pathname,
      query: searchParams.toString(),
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return (
    // 404 page component
  );
}
```

**Action items from 404 tracking:**
- Review most-requested broken URLs monthly
- Set up redirects for frequently accessed invalid paths
- Identify typos in external links pointing to the site
- Discover outdated URLs shared on social media

### 8.15 Mobile-Specific Enhancements

**Touch interactions:**
- All helpful links: Min touch target 44px x 44px (met via padding)
- Buttons: Full-width on mobile for easy tapping (max-width: 320px to avoid excessively wide buttons on tablets)
- Generous spacing between interactive elements (minimum 12px gap)

**Performance:**
- Illustration SVG: Inline (no additional HTTP request)
- Geometric shapes: Use CSS transforms for animation (GPU-accelerated)
- Lazy-load footer images if any (user unlikely to scroll down)

**Mobile viewport consideration:**
- Min-height: `70vh` ensures content doesn't feel cramped on short mobile screens
- Padding: `py-12` on mobile provides breathing room

### 8.16 A/B Testing Opportunities (Future)

Test different 404 page variants to optimize navigation recovery:

**Variant A (Current):** Branded illustration + helpful links
**Variant B:** Search bar + suggested pages (based on URL similarity)
**Variant C:** Chatbot auto-opens with message "Looks like you're lost. Can I help you find what you need?"
**Variant D:** Minimal design with large "Go Home" button only (reducing cognitive load)

**Success metric:** % of 404 visitors who navigate to another page (vs bouncing)

**Hypothesis:** Variant C (proactive chatbot) may have highest recovery rate for first-time visitors, while Variant B (search) may work better for returning visitors with specific intent.

---

## Component Interaction Map

Summary of how global components interact with each other and coexist:

```
+----------------------------------------------------------------------+
|                          VIEWPORT                                     |
|                                                                      |
|  [Navbar]                                        z-50, fixed top     |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |  [Breadcrumbs]                               within content   |  |
|  |                                                                |  |
|  |  [Page Content]                                                |  |
|  |                                                                |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|  [Footer]                                        bottom of page     |
|                                                                      |
|  [WhatsApp]        z-40, fixed bottom-left                           |
|                                            [Avi Chatbot]  z-40,     |
|                                            fixed bottom-right        |
|                                                                      |
|  [Exit Intent Popup]  z-60, fixed center (when triggered)           |
|  [Avi Chat Window]    z-40, fixed above bubble (when open)          |
|                                                                      |
+----------------------------------------------------------------------+
```

**Z-index hierarchy:**

| Layer | Z-index | Component |
|-------|---------|-----------|
| Exit intent overlay | `z-[60]` | Highest -- blocks everything |
| Navbar | `z-50` | Always visible above content |
| Mobile drawer overlay | `z-50` | Blocks page, same level as navbar |
| Mobile drawer panel | `z-50` | Above overlay |
| Language dropdown | `z-50` | Within navbar context |
| Avi chat window | `z-40` | Below navbar, above content |
| Avi bubble | `z-40` | Floating, always visible |
| WhatsApp button | `z-40` | Floating, always visible |
| Toast notifications | `z-[100]` | Above everything |
| Page content | Default | Normal document flow |

**Conflict resolution:**
- When the exit intent popup is visible, both floating buttons (WhatsApp and Avi) remain visible but are behind the overlay (their z-40 is below the popup's z-60)
- When the mobile drawer is open, floating buttons are hidden behind the drawer overlay
- When the Avi chat window is open, it does not overlap with the WhatsApp button (opposite corners)
- Toast notifications appear above everything, including the exit intent popup

---

**End of Global Components Specification**
