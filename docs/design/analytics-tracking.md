# Google Analytics 4 -- Event Tracking Plan

**Version:** 1.0
**Date:** February 2026
**Owner:** Ali Odat
**Stack:** GA4 with gtag.js via Next.js
**Status:** Specification

---

## Table of Contents

1. [Setup and Configuration](#1-setup-and-configuration)
2. [Page-Level Events](#2-page-level-events)
3. [AI Tool Events](#3-ai-tool-events)
4. [Chatbot Events](#4-chatbot-events)
5. [Conversion Events](#5-conversion-events)
6. [Navigation Events](#6-navigation-events)
7. [Custom Dimensions (User Properties)](#7-custom-dimensions-user-properties)
8. [Conversion Funnel Definitions](#8-conversion-funnel-definitions)
9. [Implementation Notes](#9-implementation-notes)

---

## 1. Setup and Configuration

### 1.1 Script Loading

GA4 is loaded via `next/script` using the `afterInteractive` strategy. This ensures the tracking script does not block initial page render or hydration while still loading early enough to capture the majority of user interactions.

```tsx
// app/layout.tsx (root layout)
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="gtag-init" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      anonymize_ip: true,
      send_page_view: true
    });
  `}
</Script>
```

### 1.2 Enhanced Measurement

The following enhanced measurement features are enabled in the GA4 property settings:

| Feature | Status | Notes |
|---------|--------|-------|
| Page views | Enabled | Automatic on route changes (via History API detection) |
| Scrolls | Enabled | Fires at 90% scroll depth; supplemented by custom `scroll_depth` thresholds |
| Outbound clicks | Enabled | Tracks clicks to external domains (WhatsApp deep links, Calendly, App Store, etc.) |
| Site search | Enabled | Detects query parameter `q` on `/faq` and `/blog` search |
| Form interactions | Disabled | We use custom form events for finer control |
| Video engagement | Disabled | No video content at launch |
| File downloads | Enabled | Tracks PDF estimate and ROI report downloads |

### 1.3 IP Anonymization

IP anonymization is enabled via the `anonymize_ip: true` config flag. This truncates the last octet of IPv4 addresses and the last 80 bits of IPv6 addresses before storage. This is required for GDPR compliance and aligns with Aviniti's privacy posture.

### 1.4 Consent Mode v2

Consent mode v2 is configured with default-deny for `analytics_storage` and `ad_storage`. When the cookie consent banner is implemented (future iteration), consent signals will update these values dynamically. Until then, the default configuration respects the strictest interpretation:

```js
gtag('consent', 'default', {
  analytics_storage: 'granted',    // Update to 'denied' when cookie banner is live
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
```

When the cookie banner is deployed, the `analytics_storage` default will switch to `'denied'` and the banner callback will invoke `gtag('consent', 'update', { ... })` upon user acceptance.

### 1.5 Additional Integrations

| Integration | Purpose | Implementation |
|-------------|---------|----------------|
| Google Ads | Conversion tracking for paid campaigns | Linked via GA4 property; conversion events shared |
| Meta Pixel | Facebook/Instagram ad conversion tracking | Separate script, mirrors key conversion events |
| Calendly | Booking tracking | Track `calendly_booking_started` via Calendly embed event listener |

---

## 2. Page-Level Events

These events fire automatically or semi-automatically on every page.

### 2.1 page_view (Automatic)

| Property | Value |
|----------|-------|
| Event name | `page_view` |
| Trigger | Automatic via GA4 enhanced measurement on every route change |
| Parameters | `page_location`, `page_title`, `page_referrer` (all automatic) |
| Notes | Next.js client-side navigation triggers History API changes which GA4 detects. No manual `gtag('event', 'page_view')` calls needed unless custom parameters are required. |

### 2.2 scroll_depth (Custom Enhancement)

| Property | Value |
|----------|-------|
| Event name | `scroll_depth` |
| Trigger | When user scrolls past 25%, 50%, 75%, and 100% of page height |
| Parameters | `percent_scrolled`: 25 / 50 / 75 / 100 |
| Implementation | Custom `IntersectionObserver` on sentinel elements placed at each threshold. Each threshold fires only once per page view. |
| Notes | GA4 enhanced measurement only tracks 90% scroll. This custom event provides finer granularity needed to measure engagement on long pages like the homepage (10 sections) and solution detail pages. |

---

## 3. AI Tool Events

The Aviniti website includes four AI-powered tools that serve as the primary lead generation funnel. Each tool follows an identical event taxonomy, with the tool name as a prefix. This consistency enables cross-tool comparison in GA4 Explore reports.

**Tools:**

| Tool | Prefix | Route |
|------|--------|-------|
| Idea Lab | `idea_lab` | `/idea-lab` |
| AI Idea Analyzer | `analyzer` | `/ai-analyzer` |
| Get AI Estimate | `estimate` | `/get-estimate` |
| AI ROI Calculator | `roi_calculator` | `/roi-calculator` |

### 3.1 Event Definitions

For each tool, replace `{tool}` with the tool prefix from the table above.

#### {tool}_started

| Property | Value |
|----------|-------|
| Event name | `{tool}_started` |
| Trigger | User clicks the "Start" / "Begin" CTA on the tool landing/intro screen, initiating the multi-step form |
| Parameters | `locale`: `'en'` or `'ar'`; `entry_source`: `'homepage_card'` / `'navbar'` / `'chatbot'` / `'cross_sell'` / `'exit_intent'` / `'direct'` |
| Notes | The `entry_source` parameter is critical for understanding which acquisition channels drive tool engagement. Determined by the `ref` query parameter or `sessionStorage` tracking. |

#### {tool}_step_completed

| Property | Value |
|----------|-------|
| Event name | `{tool}_step_completed` |
| Trigger | User successfully advances to the next step in the multi-step form |
| Parameters | `step_number`: integer (1-based); `step_name`: string describing the step (e.g., `'background'`, `'industry'`, `'problem'`, `'email_capture'` for Idea Lab) |
| Notes | Enables funnel drop-off analysis. Combined with `{tool}_started`, reveals which step loses the most users. |

#### {tool}_step_back

| Property | Value |
|----------|-------|
| Event name | `{tool}_step_back` |
| Trigger | User navigates backward within the multi-step form |
| Parameters | `from_step`: integer; `to_step`: integer |
| Notes | High back-navigation rates on a specific step suggest confusion or friction in that step's UX. |

#### {tool}_submitted

| Property | Value |
|----------|-------|
| Event name | `{tool}_submitted` |
| Trigger | User completes the final form step and the request is sent to the backend API (Gemini) |
| Parameters | `locale`: `'en'` or `'ar'` |
| Notes | Fires on API request initiation, not on API response. Paired with `{tool}_completed` or `{tool}_failed` to measure API reliability. |

#### {tool}_completed

| Property | Value |
|----------|-------|
| Event name | `{tool}_completed` |
| Trigger | API response received successfully and results are displayed to the user |
| Parameters | `processing_time_ms`: integer (time from submission to results render); `locale`: `'en'` or `'ar'` |
| Notes | The `processing_time_ms` parameter enables monitoring of AI response performance. Alert if p95 exceeds 10,000ms. |

#### {tool}_failed

| Property | Value |
|----------|-------|
| Event name | `{tool}_failed` |
| Trigger | API call returns an error or times out |
| Parameters | `error_code`: string (e.g., `'timeout'`, `'500'`, `'rate_limit'`, `'network_error'`) |
| Notes | Used to calculate tool reliability rate: `completed / (completed + failed)`. Target: >99%. |

#### {tool}_result_action

| Property | Value |
|----------|-------|
| Event name | `{tool}_result_action` |
| Trigger | User interacts with the results page by clicking a CTA |
| Parameters | `action`: one of `'book_call'` / `'download_pdf'` / `'whatsapp'` / `'try_another_tool'` / `'view_solution'` |
| Notes | Reveals which post-result actions are most compelling. `book_call` and `whatsapp` are the highest-value actions. |

#### {tool}_cross_sell_click

| Property | Value |
|----------|-------|
| Event name | `{tool}_cross_sell_click` |
| Trigger | User clicks a cross-sell CTA suggesting another AI tool (e.g., "Now get an estimate" on Idea Lab results) |
| Parameters | `destination_tool`: string (the tool prefix being navigated to) |
| Notes | Measures the effectiveness of the tool-to-tool funnel. High cross-sell rates indicate strong tool interconnection. |

### 3.2 Tool Step Names Reference

For consistent `step_name` values across implementations:

**Idea Lab:**
1. `background` -- User selects their background
2. `industry` -- User selects industry of interest
3. `problem` -- User describes the problem/opportunity
4. `email_capture` -- Email collection
5. `processing` -- AI processing (no user action; not tracked as a step)
6. `results` -- Results displayed (tracked via `idea_lab_completed`)

**AI Idea Analyzer:**
1. `idea_input` -- User describes their idea
2. `email_capture` -- Email collection
3. `processing` -- AI processing
4. `results` -- Results displayed

**Get AI Estimate:**
1. `project_type` -- User selects project type
2. `features` -- User selects desired features
3. `timeline` -- User selects ideal timeline
4. `contact_info` -- Name, email, company, phone, description
5. `processing` -- AI processing
6. `results` -- Results displayed

**AI ROI Calculator:**
1. `current_process` -- User selects the manual process
2. `time_spent` -- Hours and employees involved
3. `costs` -- Hourly cost and issue selection
4. `revenue_impact` -- Customer and retention estimates
5. `email_capture` -- Email collection
6. `processing` -- AI processing
7. `results` -- Results displayed

---

## 4. Chatbot Events

The Avi chatbot (powered by Google Gemini) is a global widget that appears on every page. These events track chatbot engagement, usage patterns, and conversion contribution.

### 4.1 Event Definitions

#### chatbot_opened

| Property | Value |
|----------|-------|
| Event name | `chatbot_opened` |
| Trigger | Chat window transitions from collapsed (bubble) to expanded (chat window) state |
| Parameters | `trigger`: `'user_click'` (user clicked the bubble) or `'proactive'` (user opened after seeing proactive message badge) |
| Notes | Distinguishing trigger type reveals whether proactive messages are effective at driving engagement. |

#### chatbot_message_sent

| Property | Value |
|----------|-------|
| Event name | `chatbot_message_sent` |
| Trigger | User sends a message (presses Enter or clicks Send) |
| Parameters | `message_count`: integer (the nth message in this session, starting at 1); `page`: current page path (e.g., `/en/solutions`) |
| Notes | Do NOT track message content for privacy reasons. The `message_count` parameter reveals conversation depth. The `page` parameter reveals which pages generate the most questions. |

#### chatbot_quick_reply_clicked

| Property | Value |
|----------|-------|
| Event name | `chatbot_quick_reply_clicked` |
| Trigger | User clicks one of the quick reply suggestion buttons |
| Parameters | `reply_text`: the display text of the quick reply (e.g., `'I want to build an app'`, `'How much does it cost?'`) |
| Notes | Reveals which conversation starters are most popular and which intents are most common. |

#### chatbot_link_clicked

| Property | Value |
|----------|-------|
| Event name | `chatbot_link_clicked` |
| Trigger | User clicks any link rendered within the chat conversation (solution cards, page links, CTAs) |
| Parameters | `link_type`: `'solution_card'` / `'tool_link'` / `'page_link'` / `'cta_button'` / `'whatsapp'` / `'calendly'`; `destination`: the URL or route being navigated to |
| Notes | Measures the chatbot's effectiveness as a navigation aid. High `solution_card` and `tool_link` clicks indicate successful intent matching. |

#### chatbot_closed

| Property | Value |
|----------|-------|
| Event name | `chatbot_closed` |
| Trigger | User closes the chat window (clicks X button) |
| Parameters | `message_count`: total messages sent in this conversation; `duration_seconds`: integer, time from `chatbot_opened` to close |
| Notes | Average `duration_seconds` and `message_count` reveal conversation quality. Very short durations with 0 messages suggest the widget was opened accidentally or the greeting was not engaging. |

#### chatbot_rate_limited

| Property | Value |
|----------|-------|
| Event name | `chatbot_rate_limited` |
| Trigger | User hits the rate limit (30 messages per session or 5 per minute) |
| Parameters | `message_count`: total messages sent when rate limit was hit |
| Notes | Should be a rare event. Frequent occurrences may indicate the rate limits are too restrictive or users are experiencing issues requiring many messages. |

---

## 5. Conversion Events

These events represent high-value user actions that directly contribute to business goals. All events in this section should be marked as **conversions** in the GA4 property settings.

### 5.1 Event Definitions

#### lead_captured

| Property | Value |
|----------|-------|
| Event name | `lead_captured` |
| Trigger | An email address is successfully collected from any source (AI tool form, exit intent, chatbot lead qualification) |
| Parameters | `source`: `'idea_lab'` / `'analyzer'` / `'estimate'` / `'roi_calculator'` / `'exit_intent'` / `'contact_form'` / `'chatbot'`; `locale`: `'en'` or `'ar'` |
| Mark as conversion | Yes |
| Notes | This is the primary conversion event. The `source` parameter enables attribution analysis across all lead capture touchpoints. |

#### contact_form_submitted

| Property | Value |
|----------|-------|
| Event name | `contact_form_submitted` |
| Trigger | Contact page form is successfully submitted (validated and sent) |
| Parameters | `topic`: the selected topic/category if applicable (e.g., `'general'`, `'project_inquiry'`, `'support'`) |
| Mark as conversion | Yes |
| Notes | Separate from `lead_captured` because the contact form collects richer data (name, company, message) and indicates higher intent. |

#### calendly_booking_started

| Property | Value |
|----------|-------|
| Event name | `calendly_booking_started` |
| Trigger | User interacts with the Calendly embed (iframe loads and user selects a time slot) |
| Parameters | None (Calendly event listener provides limited data) |
| Mark as conversion | Yes |
| Notes | Calendly provides a `Calendly.initInlineWidget` API with event callbacks. Listen for the `calendly.event_scheduled` postMessage event. If only embed interaction is detectable, track the click that opens/scrolls to the Calendly section. |

#### whatsapp_clicked

| Property | Value |
|----------|-------|
| Event name | `whatsapp_clicked` |
| Trigger | User clicks any WhatsApp link or button on the site |
| Parameters | `context`: `'floating'` (floating button, bottom-left) / `'contact'` (contact page) / `'exit_intent'` (exit intent Variation D) / `'tool_result'` (CTA on AI tool results page) / `'footer'` (footer link) / `'chatbot'` (WhatsApp link within Avi conversation) |
| Mark as conversion | Yes |
| Notes | WhatsApp has >90% penetration in the MENA region (Jordan/Gulf). This is a critical conversion path for the target market. The `context` parameter reveals which WhatsApp placement drives the most engagement. |

#### exit_intent_shown

| Property | Value |
|----------|-------|
| Event name | `exit_intent_shown` |
| Trigger | Exit intent popup becomes visible to the user |
| Parameters | `variant`: `'A'` (lead magnet) / `'B'` (consultation) / `'C'` (quick estimate) / `'D'` (WhatsApp) / `'E'` (chatbot activation); `page`: current page path |
| Mark as conversion | No (this is an impression, not a conversion) |
| Notes | Combined with `exit_intent_converted` and `exit_intent_dismissed`, this enables conversion rate calculation per variant and per page. |

#### exit_intent_converted

| Property | Value |
|----------|-------|
| Event name | `exit_intent_converted` |
| Trigger | User completes the exit intent action (submits email, clicks CTA that leads to Calendly/WhatsApp/chatbot) |
| Parameters | `variant`: same as `exit_intent_shown` |
| Mark as conversion | Yes |
| Notes | Conversion rate = `exit_intent_converted` / `exit_intent_shown` per variant. Target: >5% conversion rate on exit intent popups. |

#### exit_intent_dismissed

| Property | Value |
|----------|-------|
| Event name | `exit_intent_dismissed` |
| Trigger | User closes the exit intent popup without converting |
| Parameters | `variant`: same as `exit_intent_shown`; `dismiss_method`: `'close_button'` / `'overlay_click'` / `'escape_key'` / `'no_thanks_link'` / `'swipe_down'` (mobile) |
| Mark as conversion | No |
| Notes | The `dismiss_method` reveals how users prefer to close the popup. High `overlay_click` rates suggest users find the popup intrusive. High `no_thanks_link` rates suggest users read the content but were not compelled by the offer. |

---

## 6. Navigation Events

These events track how users navigate and explore the site, revealing content engagement patterns and navigation preferences.

### 6.1 Event Definitions

#### language_switched

| Property | Value |
|----------|-------|
| Event name | `language_switched` |
| Trigger | User changes the language via the navbar or footer language switcher |
| Parameters | `from_locale`: `'en'` or `'ar'`; `to_locale`: `'en'` or `'ar'`; `page`: current page path |
| Notes | Reveals the percentage of users who switch languages and which direction the switch happens. A high en-to-ar switch rate may indicate the site should default to Arabic for certain traffic sources. |

#### solution_viewed

| Property | Value |
|----------|-------|
| Event name | `solution_viewed` |
| Trigger | User navigates to an individual solution detail page |
| Parameters | `solution_slug`: string (e.g., `'delivery-app'`, `'kindergarten'`, `'hypermarket'`, `'office-suite'`, `'gym-fitness'`, `'airbnb-rental'`, `'hair-transplant-ai'`); `price`: integer (starting price in USD, e.g., `10000`) |
| Notes | Combined with conversion events, reveals which solutions have the highest view-to-lead ratio. The `price` parameter enables segmentation by price tier. |

#### solution_filtered

| Property | Value |
|----------|-------|
| Event name | `solution_filtered` |
| Trigger | User clicks a filter tab on the Solutions catalog page |
| Parameters | `filter_category`: `'all'` / `'delivery'` / `'management'` / `'e-commerce'` / `'health-ai'` |
| Notes | Reveals which solution categories attract the most interest. Informs future solution development priorities. |

#### blog_article_read

| Property | Value |
|----------|-------|
| Event name | `blog_article_read` |
| Trigger | User navigates to a blog post page |
| Parameters | `slug`: blog post slug; `category`: blog post category |
| Notes | Combined with scroll depth data, reveals which blog content drives the deepest engagement. |

#### faq_question_expanded

| Property | Value |
|----------|-------|
| Event name | `faq_question_expanded` |
| Trigger | User expands an FAQ accordion item |
| Parameters | `question_id`: unique identifier for the question; `category`: `'general'` / `'services'` / `'pricing'` / `'process'` / `'technical'` |
| Notes | Reveals which questions are most commonly opened. High expansion rates on pricing questions may indicate the pricing page needs more upfront information. |

#### cta_clicked

| Property | Value |
|----------|-------|
| Event name | `cta_clicked` |
| Trigger | User clicks any CTA button across the site (hero CTAs, section CTAs, card CTAs, etc.) |
| Parameters | `cta_text`: the visible text of the button (e.g., `'Get Instant AI Estimate'`, `'View All Solutions'`, `'Book a Call'`); `page`: current page path; `section`: section identifier (e.g., `'hero'`, `'ai_tools'`, `'final_cta'`, `'case_studies'`) |
| Notes | This is a catch-all event for measuring CTA effectiveness across the site. Combined with page and section parameters, it enables heatmap-like analysis without third-party tools. |

---

## 7. Custom Dimensions (User Properties)

User properties are set once per session (or updated on change) and attached to all subsequent events. They enable user-level segmentation in GA4 reports.

### 7.1 Definitions

#### preferred_locale

| Property | Value |
|----------|-------|
| Scope | User |
| Type | String |
| Values | `'en'` or `'ar'` |
| Set when | On page load, based on the URL locale prefix (`/en/` or `/ar/`). Updated if user switches language. |
| GA4 config | `gtag('set', 'user_properties', { preferred_locale: 'en' });` |
| Usage | Segment all reports by language to compare engagement and conversion rates between English and Arabic audiences. |

#### session_tool_count

| Property | Value |
|----------|-------|
| Scope | User (session-level, but set as user property for reporting) |
| Type | Integer |
| Values | `0`, `1`, `2`, `3`, `4` |
| Set when | Incremented each time a `{tool}_started` event fires. Stored in `sessionStorage` and synced to GA4. |
| GA4 config | `gtag('set', 'user_properties', { session_tool_count: count });` |
| Usage | Segment users by tool engagement depth. Users who try 2+ tools are likely higher-intent leads. |

#### has_converted

| Property | Value |
|----------|-------|
| Scope | User |
| Type | Boolean (stored as string: `'true'` or `'false'`) |
| Values | `'true'` or `'false'` |
| Set when | Set to `'true'` when any `lead_captured` event fires. Also stored in `localStorage` as `aviniti_converted` to suppress exit intent popups. |
| GA4 config | `gtag('set', 'user_properties', { has_converted: 'true' });` |
| Usage | Exclude converted users from acquisition analysis. Compare behavior of converted vs. non-converted users. |

---

## 8. Conversion Funnel Definitions

The following funnels should be configured in GA4 Explore (Funnel Exploration report) to monitor the core user journeys defined in the PRD (Appendix B).

### 8.1 Funnel 1: Homepage to AI Tool to Lead

**Name:** "AI Tool Lead Funnel"

| Step | Event | Condition |
|------|-------|-----------|
| 1 | `page_view` | `page_location` contains `/en` or `/ar` (homepage) |
| 2 | `{tool}_started` | Any tool (idea_lab, analyzer, estimate, roi_calculator) |
| 3 | `{tool}_completed` | Matching tool |
| 4 | `lead_captured` | `source` matches the tool |

**Expected insight:** Overall conversion rate from homepage visit to qualified lead via AI tools. Identify which funnel step has the highest drop-off.

### 8.2 Funnel 2: Homepage to Solutions to Contact

**Name:** "Solutions Browse Funnel"

| Step | Event | Condition |
|------|-------|-----------|
| 1 | `page_view` | Homepage |
| 2 | `page_view` | `page_location` contains `/solutions` |
| 3 | `solution_viewed` | Any solution slug |
| 4 | `contact_form_submitted` OR `whatsapp_clicked` OR `calendly_booking_started` | Any |

**Expected insight:** How effectively the solutions catalog converts browsers into leads. Compare WhatsApp vs. contact form vs. Calendly as conversion endpoints.

### 8.3 Funnel 3: AI Tool Cross-Sell

**Name:** "Tool-to-Tool Cross-Sell"

| Step | Event | Condition |
|------|-------|-----------|
| 1 | `{tool_A}_completed` | Any tool |
| 2 | `{tool_A}_cross_sell_click` | `destination_tool` = any |
| 3 | `{tool_B}_started` | Matching destination tool |
| 4 | `{tool_B}_completed` | Matching tool |

**Expected insight:** Cross-sell effectiveness between tools. The most common path is expected to be Idea Lab -> Analyzer -> Estimate (top-of-funnel to bottom-of-funnel progression).

### 8.4 Funnel 4: Exit Intent Conversion

**Name:** "Exit Intent Recovery"

| Step | Event | Condition |
|------|-------|-----------|
| 1 | `exit_intent_shown` | Any variant |
| 2 | `exit_intent_converted` | Matching variant |

**Expected insight:** Recovery rate per exit intent variant. Use this to determine which variant to prioritize in A/B tests.

**Breakdown dimension:** `variant` parameter (A through E).

### 8.5 Funnel 5: Chatbot to Conversion

**Name:** "Chatbot Assisted Conversion"

| Step | Event | Condition |
|------|-------|-----------|
| 1 | `chatbot_opened` | Any trigger |
| 2 | `chatbot_message_sent` | `message_count` >= 1 |
| 3 | `chatbot_link_clicked` | `link_type` is `'tool_link'` or `'solution_card'` |
| 4 | `lead_captured` | Any source |

**Expected insight:** The chatbot's contribution to lead generation. Measures whether chatbot interactions lead to downstream conversions.

---

## 9. Implementation Notes

### 9.1 Helper Function

Create a centralized analytics utility to enforce consistent event naming and parameter structure:

```typescript
// lib/analytics.ts

type ToolPrefix = 'idea_lab' | 'analyzer' | 'estimate' | 'roi_calculator';

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackToolEvent(
  tool: ToolPrefix,
  action: string,
  params?: Record<string, string | number | boolean>
) {
  trackEvent(`${tool}_${action}`, params);
}

export function setUserProperty(
  properties: Record<string, string | number>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', properties);
  }
}
```

### 9.2 Event Naming Convention

- All event names use `snake_case`
- Tool events use the pattern `{tool_prefix}_{action}`
- Parameter names use `snake_case`
- String parameter values use `snake_case` where possible (e.g., `'user_click'`, not `'userClick'`)
- Boolean values are stored as strings (`'true'` / `'false'`) for GA4 compatibility

### 9.3 Testing and Validation

| Method | Purpose |
|--------|---------|
| GA4 DebugView | Real-time event validation during development |
| Google Tag Assistant | Chrome extension for verifying gtag.js firing |
| GA4 Realtime Report | Verify events in production |
| Custom event log | In development mode, log all `trackEvent` calls to console |

Enable debug mode in development:

```js
gtag('config', GA_MEASUREMENT_ID, { debug_mode: true });
```

### 9.4 Data Retention

| Setting | Value |
|---------|-------|
| Event data retention | 14 months |
| User data retention | 14 months |
| Reset on new activity | Enabled |

### 9.5 Excluded Referrals

Add the following to GA4 property settings to prevent self-referrals:

- `aviniti.com`
- `calendly.com` (Calendly embed redirects)
- `wa.me` (WhatsApp deep links that may trigger referral)

### 9.6 KPI Dashboard (Recommended GA4 Reports)

Based on the success metrics defined in PRD Section 9, configure the following saved reports:

**Primary KPIs:**

| KPI | GA4 Metric/Event | Target |
|-----|-------------------|--------|
| Lead form submissions | `lead_captured` count | Track weekly growth |
| Calendly bookings | `calendly_booking_started` count | Track weekly growth |
| Average time on site | Engagement > Average engagement time | >2 minutes |
| Pages per session | Engagement > Views per session | >3 pages |
| Chatbot conversations initiated | `chatbot_opened` count | Track weekly growth |
| WhatsApp conversations started | `whatsapp_clicked` count | Track weekly growth |
| Exit intent conversion rate | `exit_intent_converted` / `exit_intent_shown` | >5% |

**Secondary KPIs:**

| KPI | GA4 Metric/Event | Target |
|-----|-------------------|--------|
| Bounce rate | Engagement > Bounce rate | <40% |
| AI tool completion rate | `{tool}_completed` / `{tool}_started` | >60% |
| Solutions page views | `page_view` filtered to `/solutions` | Track growth |
| Blog engagement | `blog_article_read` + scroll depth | Track top articles |
| ROI Calculator completions | `roi_calculator_completed` count | Track weekly |
| Case study page views | `page_view` filtered to `/case-studies/*` | Track growth |
| Chatbot-to-conversion rate | Funnel 5 completion rate | >10% |

---

**End of Analytics Tracking Plan**
