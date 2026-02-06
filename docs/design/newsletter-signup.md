# Newsletter Signup Component -- Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Resend Audiences
**Theme:** Dark only
**Status:** Future Feature (Post-Phase 1)

---

## Table of Contents

1. [Purpose and Strategy](#1-purpose-and-strategy)
2. [Integration: Resend Audiences](#2-integration-resend-audiences)
3. [Component Specifications](#3-component-specifications)
4. [Placement Options](#4-placement-options)
5. [Double Opt-In Flow](#5-double-opt-in-flow)
6. [Privacy and Compliance](#6-privacy-and-compliance)
7. [Implementation Notes](#7-implementation-notes)

---

## 1. Purpose and Strategy

### 1.1 Purpose

The newsletter signup component captures email addresses for Aviniti's newsletter and marketing communications. This is a long-term audience-building tool that complements the lead generation focus of Phase 1.

**Goals:**
- Build an email audience for content marketing (blog posts, case studies, product updates)
- Nurture leads who aren't ready to request estimates yet
- Provide ongoing value to subscribers (AI insights, industry trends, development tips)
- Create a channel for re-engagement and product announcements

### 1.2 Why Resend Audiences?

We're already using **Resend** for transactional emails (AI tool results, estimate confirmations, contact form submissions). Resend Audiences is their built-in email list management feature, making it the natural choice for newsletter signups.

**Benefits:**
- No additional vendor integration (already using Resend)
- Simple API for adding/managing subscribers
- Built-in unsubscribe handling
- GDPR-compliant by design
- Unified email infrastructure

**Alternative considered:** Mailchimp, ConvertKit, SendGrid. Rejected due to unnecessary complexity and additional vendor costs for a future feature.

### 1.3 Scope

This is a **brief placeholder specification** for a feature that will be implemented after Phase 1 launch. The design is kept simple and consistent with the Aviniti brand.

---

## 2. Integration: Resend Audiences

### 2.1 Resend Audiences Overview

Resend Audiences is a contact management system integrated into Resend. It allows you to:
- Create audience lists (e.g., "Aviniti Newsletter Subscribers")
- Add contacts programmatically via API
- Send broadcast emails to lists
- Manage subscriptions and unsubscribes
- Track engagement metrics

**Documentation:** https://resend.com/docs/audiences

### 2.2 API Integration

**Add a subscriber to an audience:**

```typescript
// /app/api/newsletter/subscribe/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Add contact to audience
    const contact = await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!, // Set in .env
      unsubscribed: false,
    });

    // Send double opt-in confirmation email (see Section 5)
    await sendConfirmationEmail(email, contact.id);

    return Response.json({ success: true, message: 'Please check your email to confirm subscription.' });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return Response.json({ success: false, message: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
```

**Environment variables required:**
```
RESEND_API_KEY=re_xxx
RESEND_AUDIENCE_ID=aud_xxx
```

---

## 3. Component Specifications

### 3.1 Inline Form Component

The primary newsletter signup form is a simple inline component with email input and submit button.

**Visual Design:**

```
+------------------------------------------------------------------+
|                                                                  |
|  Stay Updated with AI Insights                                   |
|  Get the latest app development tips, AI trends, and case        |
|  studies delivered to your inbox. No spam, unsubscribe anytime.  |
|                                                                  |
|  +--------------------------------------+  +----------------+    |
|  | your@email.com                       |  | Subscribe      |    |
|  +--------------------------------------+  +----------------+    |
|                                                                  |
|  [ ] I agree to receive emails from Aviniti. Privacy Policy     |
|                                                                  |
+------------------------------------------------------------------+
```

**Component Token Specifications:**

| Element | Spec |
|---------|------|
| Container | `bg-slate-blue border border-slate-blue-light rounded-lg p-6` |
| Headline | `text-lg font-semibold text-white` -- "Stay Updated with AI Insights" |
| Description | `text-sm text-muted mt-2` -- "Get the latest app development tips..." |
| Form Layout | `flex flex-col sm:flex-row gap-3 mt-4` |
| Email Input | `flex-1 h-11 px-3 py-2.5 bg-slate-dark border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light focus:border-bronze focus:ring-1 focus:ring-bronze` |
| Submit Button | `h-11 px-6 bg-bronze text-white font-semibold rounded-lg hover:bg-bronze-hover transition-all duration-200` -- "Subscribe" |
| Privacy Checkbox | `flex items-start gap-2 mt-3`. Checkbox: `h-4 w-4 rounded border-slate-blue-light text-bronze focus:ring-bronze`. Label: `text-xs text-muted` with link to Privacy Policy in `text-bronze` |

**States:**

| State | Behavior |
|-------|----------|
| Default | Input and button ready for interaction |
| Focus | Email input border changes to bronze, ring appears |
| Loading | Button shows spinner, text becomes "Subscribing...", button disabled |
| Success | Form replaced with success message: "Thanks for subscribing! Please check your email to confirm." (green text with checkmark icon) |
| Error | Error message below input: "Please enter a valid email address." (red text) |

**Code Example:**

```tsx
// /components/newsletter/NewsletterSignup.tsx
'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('Please agree to receive emails from Aviniti.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-6">
        <div className="flex items-center gap-3 text-success">
          <Check className="h-6 w-6" />
          <p className="text-base font-semibold">Thanks for subscribing!</p>
        </div>
        <p className="text-sm text-muted mt-2">
          Please check your email to confirm your subscription.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white">Stay Updated with AI Insights</h3>
      <p className="text-sm text-muted mt-2">
        Get the latest app development tips, AI trends, and case studies delivered to your inbox. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 h-11 px-3 py-2.5 bg-slate-dark border border-slate-blue-light rounded-lg
              text-base text-off-white placeholder:text-muted-light
              focus:border-bronze focus:ring-1 focus:ring-bronze focus:outline-none
              transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 bg-bronze text-white font-semibold rounded-lg
              hover:bg-bronze-hover disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Subscribe
              </>
            )}
          </button>
        </div>
        <div className="flex items-start gap-2 mt-3">
          <input
            type="checkbox"
            id="newsletter-consent"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-slate-blue-light text-bronze focus:ring-bronze"
          />
          <label htmlFor="newsletter-consent" className="text-xs text-muted">
            I agree to receive emails from Aviniti.{' '}
            <a href="/en/privacy" className="text-bronze hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        {error && (
          <p className="text-sm text-error mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}
```

---

## 4. Placement Options

### 4.1 Blog Sidebar (Primary Placement)

Place the newsletter signup component in the right sidebar of blog posts.

**Location:** Right sidebar, below the table of contents (if present), above related posts.

**Rationale:** Blog readers are already consuming Aviniti content and are warm leads for newsletter subscription.

### 4.2 Footer (Secondary Placement)

Add a newsletter signup section in the footer.

**Layout:** Two-column layout in footer (text left, form right on desktop; stacked on mobile).

**Headline:** "Stay Connected"
**Description:** "Get app development insights and AI trends delivered monthly."

**Form:** Single-line inline form (email + button, no checkbox - checkbox moves to confirmation email step).

### 4.3 Dedicated Homepage Section (Optional)

If desired, add a newsletter signup section to the homepage after the blog preview or case studies section.

**Layout:** Centered content with full-width form.

**Headline:** "Join 500+ Developers and Business Owners" (use actual subscriber count when available)
**Description:** "Get exclusive AI insights, case studies, and development tips."

**CTA:** "Subscribe to Our Newsletter"

**Note:** This placement is optional and lower priority. The blog sidebar and footer placements are sufficient for Phase 1.

### 4.4 Exit Intent Popup (Alternative to Lead Magnet)

One of the exit intent variations (see PRD Section 3.13) can be a newsletter signup instead of a lead magnet download.

**Headline:** "Before You Go..."
**Description:** "Stay updated with our latest AI insights and case studies."
**Form:** Email input + Subscribe button
**CTA:** "Subscribe"

**Note:** This is an alternative to the lead magnet exit intent. Choose one approach or A/B test both.

---

## 5. Double Opt-In Flow

To comply with GDPR and reduce spam signups, use a double opt-in process.

### 5.1 Flow Overview

1. User enters email and submits form
2. System adds email to Resend Audiences with `unsubscribed: false`
3. System sends confirmation email with unique verification link
4. User clicks link in email
5. System confirms subscription and marks as verified
6. User sees success page and receives welcome email

### 5.2 Confirmation Email

**Subject:** "Confirm your Aviniti newsletter subscription"

**Body:**

```
Hi there,

Thanks for signing up for the Aviniti newsletter!

Click the link below to confirm your subscription:

[Confirm Subscription] → https://aviniti.com/newsletter/confirm?token=xxx

If you didn't sign up for this newsletter, you can safely ignore this email.

Best,
The Aviniti Team

---
Aviniti | Your Ideas, Our Reality
aviniti.com
```

**Technical Implementation:**

```typescript
// /app/api/newsletter/confirm/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return Response.redirect('/newsletter/error');
  }

  try {
    // Verify token and mark subscriber as confirmed
    // (Store tokens in database or use signed JWTs)
    const email = verifyToken(token);

    // Update Resend contact (mark as verified in metadata)
    await resend.contacts.update({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      // Add custom field to track verification status if needed
    });

    // Send welcome email
    await sendWelcomeEmail(email);

    return Response.redirect('/newsletter/confirmed');
  } catch (error) {
    console.error('Confirmation error:', error);
    return Response.redirect('/newsletter/error');
  }
}
```

### 5.3 Welcome Email

**Subject:** "Welcome to Aviniti Insights!"

**Body:**

```
Welcome aboard!

Thanks for confirming your subscription. You'll now receive our newsletter with:

• AI development insights and trends
• Case studies from real projects
• App development tips and best practices
• Product updates and new solutions

We send emails about once a month—no spam, just valuable content.

Ready to turn your idea into an app? Get a free AI estimate:
[Get AI Estimate] → https://aviniti.com/get-estimate

Best,
The Aviniti Team

---
Not interested anymore? You can unsubscribe anytime: [Unsubscribe]
```

---

## 6. Privacy and Compliance

### 6.1 GDPR Compliance

- **Explicit Consent:** Users must check the "I agree to receive emails" checkbox before subscribing (not pre-checked).
- **Purpose Clarity:** Clearly state what emails they'll receive ("app development tips, AI trends, case studies").
- **Easy Unsubscribe:** Every email includes an unsubscribe link (Resend handles this automatically).
- **Privacy Policy Link:** Always link to the Privacy Policy near the signup form.
- **Data Minimization:** Only collect email addresses, no additional fields required.

### 6.2 Privacy Policy Update

Add a "Newsletter and Marketing Communications" section to the Privacy Policy:

**Content:**
"When you subscribe to our newsletter, we collect your email address to send you updates about app development insights, AI trends, case studies, and product announcements. You can unsubscribe at any time using the link in every email. We use Resend to manage our email list and do not share your email address with third parties."

### 6.3 Unsubscribe Handling

Resend automatically includes an unsubscribe link in broadcast emails. When a user clicks it:
1. Resend marks the contact as `unsubscribed: true`
2. User sees a confirmation page: "You've been unsubscribed from Aviniti's newsletter."
3. User can optionally provide feedback (via Resend's unsubscribe page)

**Custom Unsubscribe Page (Optional):**

If you want a branded unsubscribe experience, implement a custom unsubscribe endpoint:

```typescript
// /app/newsletter/unsubscribe/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return Response.redirect('/newsletter/error');
  }

  try {
    await resend.contacts.update({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: true,
    });

    return Response.redirect('/newsletter/unsubscribed');
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return Response.redirect('/newsletter/error');
  }
}
```

---

## 7. Implementation Notes

### 7.1 Phase and Priority

**Phase:** Post-Phase 1 (after core lead generation features are live)

**Priority:** Medium (nice-to-have, not critical for launch)

**Dependencies:**
- Resend account and API key (already set up for transactional emails)
- Create a Resend Audience for "Aviniti Newsletter"
- Privacy Policy update

### 7.2 Testing Checklist

Before going live with newsletter signup:

- [ ] Test email validation (reject invalid emails)
- [ ] Test double opt-in flow (send confirmation email, verify link works)
- [ ] Test welcome email delivery
- [ ] Test unsubscribe flow (ensure contact is marked as unsubscribed)
- [ ] Test error handling (API failure, invalid token, etc.)
- [ ] Verify GDPR compliance (consent checkbox required, privacy policy linked)
- [ ] Test mobile responsiveness (form layout on small screens)
- [ ] Test with real email address (Gmail, Outlook, ProtonMail)
- [ ] Confirm no spam folder issues (check SPF, DKIM, DMARC records)

### 7.3 Analytics and Metrics

Track these metrics for newsletter performance:

- **Signup conversion rate:** % of visitors who subscribe (by placement: blog sidebar vs footer)
- **Confirmation rate:** % of signups who complete double opt-in
- **Open rate:** % of subscribers who open newsletter emails
- **Click-through rate:** % of subscribers who click links in newsletters
- **Unsubscribe rate:** % of subscribers who unsubscribe per email sent
- **Subscriber growth:** Net new subscribers per month

**Implementation:** Use Resend's built-in analytics or integrate with Google Analytics for form submission tracking.

### 7.4 Content Strategy (Future)

Once the newsletter is live, plan a content calendar:

- **Frequency:** Monthly (first Friday of each month)
- **Content Mix:**
  - 1 featured blog post or case study
  - 1 AI/tech trend insight
  - 1 product update or new solution announcement
  - 1 CTA (Get Estimate, Book Call, Read Case Study)
- **Tone:** Educational and helpful, not salesy
- **Length:** 300-500 words max (short and scannable)

**Newsletter Topics:**
- "5 AI Features Every App Should Have in 2026"
- "Case Study: How [Industry] Increased Revenue by 40% with AI"
- "Ready-Made vs Custom: Which App Solution is Right for You?"
- "Top 3 Mistakes We See in App Development Projects"
- "New Solution Launch: [Solution Name] Now Available"

---

## 8. Success Criteria

The newsletter signup feature is successful if:

1. **Signup conversion rate** > 2% of blog readers subscribe
2. **Confirmation rate** > 60% (users complete double opt-in)
3. **Open rate** > 25% (industry average for B2B newsletters)
4. **Unsubscribe rate** < 2% per email sent
5. **Lead quality:** At least 5% of subscribers request estimates within 6 months

---

## 9. Future Enhancements (Post-MVP)

**Segmentation:** Segment subscribers by interest (AI tools, ready-made solutions, custom development) based on page visited when they signed up.

**Personalization:** Send targeted emails based on subscriber segment (e.g., "New AI Solution for Healthcare" to healthcare-interested subscribers).

**Lead Scoring:** Assign scores to subscribers based on email engagement (opens, clicks) to identify hot leads for sales follow-up.

**A/B Testing:** Test different form headlines, button copy, and placement to optimize signup rate.

**Incentive:** Offer a lead magnet (e.g., "Free Guide: 10 AI App Ideas for Your Industry") in exchange for email signup.

---

**End of Newsletter Signup Specification**

This is a lightweight spec for a future feature. Keep it simple for MVP: inline form, double opt-in, Resend integration, GDPR compliance. Enhancements come later based on performance and user feedback.
