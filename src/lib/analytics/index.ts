/**
 * Analytics module — client-side only.
 *
 * All functions silently no-op when:
 *  - Running on the server
 *  - Analytics is not supported / configured
 *
 * Import pattern:
 *   import { trackAiToolStarted } from '@/lib/analytics';
 */

import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '@/lib/firebase/client';
import type { AiToolSlug, CtaLocation } from './events';
import {
  EVT_PAGE_VIEW,
  EVT_AI_TOOL_STARTED,
  EVT_AI_TOOL_SUBMITTED,
  EVT_AI_TOOL_COMPLETED,
  EVT_AI_TOOL_ERROR,
  EVT_AI_TOOL_CROSS_SELL_CLICKED,
  EVT_PDF_DOWNLOADED,
  EVT_CTA_CLICKED,
  EVT_CONTACT_CAPTURE_STARTED,
  EVT_CONTACT_CAPTURE_SUBMITTED,
  EVT_NEWSLETTER_SUBSCRIBED,
  EVT_EXIT_INTENT_SHOWN,
  EVT_EXIT_INTENT_DISMISSED,
  EVT_LANGUAGE_CHANGED,
  EVT_SOLUTION_VIEWED,
  EVT_EXCEPTION,
  EVT_CLIENT_ERROR,
} from './events';

/** Internal helper — resolves analytics instance and logs an event */
async function track(
  eventName: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics();
    if (!analytics) return;
    logEvent(analytics, eventName, params);
  } catch {
    // Never throw from analytics — it must not break the app
  }
}

// ─── Page / Navigation ────────────────────────────────────────────────────────

export function trackPageView(params: {
  page_path: string;
  page_title?: string;
  locale: string;
}): void {
  void track(EVT_PAGE_VIEW, params);
}

// ─── AI Tool Lifecycle ────────────────────────────────────────────────────────

export function trackAiToolStarted(tool: AiToolSlug, locale: string): void {
  void track(EVT_AI_TOOL_STARTED, { tool, locale });
}

export function trackAiToolSubmitted(tool: AiToolSlug, locale: string): void {
  void track(EVT_AI_TOOL_SUBMITTED, { tool, locale });
}

export function trackAiToolCompleted(
  tool: AiToolSlug,
  locale: string,
  durationMs?: number
): void {
  void track(EVT_AI_TOOL_COMPLETED, {
    tool,
    locale,
    ...(durationMs !== undefined && { duration_ms: durationMs }),
  });
}

export function trackAiToolError(
  tool: AiToolSlug,
  locale: string,
  errorCode?: string
): void {
  void track(EVT_AI_TOOL_ERROR, {
    tool,
    locale,
    ...(errorCode && { error_code: errorCode }),
  });
}

export function trackAiToolCrossSellClicked(
  sourceTool: AiToolSlug,
  targetTool: AiToolSlug,
  locale: string
): void {
  void track(EVT_AI_TOOL_CROSS_SELL_CLICKED, {
    source_tool: sourceTool,
    target_tool: targetTool,
    locale,
  });
}

// ─── PDF / Report ─────────────────────────────────────────────────────────────

export function trackPdfDownloaded(tool: AiToolSlug, locale: string): void {
  void track(EVT_PDF_DOWNLOADED, { tool, locale });
}

// ─── CTA Clicks ───────────────────────────────────────────────────────────────

export function trackCtaClicked(location: CtaLocation, label: string, locale: string): void {
  void track(EVT_CTA_CLICKED, { location, label, locale });
}

// ─── Contact Capture ──────────────────────────────────────────────────────────

export function trackContactCaptureStarted(source: string, locale: string): void {
  void track(EVT_CONTACT_CAPTURE_STARTED, { source, locale });
}

export function trackContactCaptureSubmitted(source: string, locale: string): void {
  void track(EVT_CONTACT_CAPTURE_SUBMITTED, { source, locale });
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export function trackNewsletterSubscribed(locale: string): void {
  void track(EVT_NEWSLETTER_SUBSCRIBED, { locale });
}

// ─── Exit Intent ──────────────────────────────────────────────────────────────

export function trackExitIntentShown(variant: string, locale: string): void {
  void track(EVT_EXIT_INTENT_SHOWN, { variant, locale });
}

export function trackExitIntentDismissed(variant: string, locale: string): void {
  void track(EVT_EXIT_INTENT_DISMISSED, { variant, locale });
}

// ─── Language ─────────────────────────────────────────────────────────────────

export function trackLanguageChanged(from: string, to: string): void {
  void track(EVT_LANGUAGE_CHANGED, { from_locale: from, to_locale: to });
}

// ─── Solutions / Services ─────────────────────────────────────────────────────

export function trackSolutionViewed(solutionId: string, locale: string): void {
  void track(EVT_SOLUTION_VIEWED, { solution_id: solutionId, locale });
}

// ─── Errors / Exceptions ──────────────────────────────────────────────────────

/**
 * Track a GA4 native exception event.
 * Appears in GA4 under Reports → App stability → Crashes & exceptions.
 *
 * @param description - Short error description (max 150 chars)
 * @param fatal - true if the error crashed the page, false for handled errors
 */
export function trackException(description: string, fatal: boolean): void {
  void track(EVT_EXCEPTION, {
    description: description.substring(0, 150),
    fatal,
  });
}

/**
 * Track a custom client_error event with structured details.
 * Use for component-level error reporting alongside trackException.
 */
export function trackClientError(
  source: string,
  message: string,
  errorName?: string,
  errorStack?: string
): void {
  const params: Record<string, string | number | boolean> = { source, message };
  if (errorName) params.error_name = errorName;
  if (errorStack) params.error_stack = errorStack.substring(0, 200);
  void track(EVT_CLIENT_ERROR, params);
}

// ─── User Properties ──────────────────────────────────────────────────────────

/**
 * Set a GA4 user property for segmentation.
 * Properties persist across sessions within GA4's retention window.
 */
export function setUserProperty(name: string, value: string | number): void {
  void track('set' as never, { [name]: value } as never);
}

/**
 * Mark the current user as converted (lead captured).
 * Persists in localStorage so repeat visits are identified.
 */
export function markUserAsConverted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('aviniti_converted', 'true');
  void track('user_converted', { has_converted: true });
}

/**
 * Returns true if the user has previously converted (lead captured).
 */
export function hasUserConverted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('aviniti_converted') === 'true';
}

// ─── Engagement ───────────────────────────────────────────────────────────────

/**
 * Track scroll depth milestones (25 / 50 / 75 / 100 %).
 * Call this when the user crosses each threshold.
 */
export function trackScrollDepth(percent: 25 | 50 | 75 | 100, page: string): void {
  void track('scroll_depth', { percent_scrolled: percent, page });
}

/**
 * Track FAQ accordion expansion.
 */
export function trackFaqExpanded(questionId: string, category: string): void {
  void track('faq_question_expanded', { question_id: questionId, category });
}

// ─── Communication ────────────────────────────────────────────────────────────

/**
 * Track WhatsApp CTA clicks.
 */
export function trackWhatsAppClick(
  context: 'floating' | 'contact' | 'exit_intent' | 'tool_result' | 'footer' | 'chatbot'
): void {
  void track('whatsapp_clicked', { context });
}

/**
 * Track chatbot widget interactions.
 */
export function trackChatbotEvent(
  action: 'opened' | 'closed' | 'message_sent' | 'quick_reply_clicked' | 'link_clicked' | 'rate_limited',
  params?: Record<string, string | number | boolean>
): void {
  void track(`chatbot_${action}`, params);
}

// ─── Lead Capture ─────────────────────────────────────────────────────────────

/**
 * Track a lead capture event (unified conversion event).
 * Fire this whenever a user submits contact info in any form/tool.
 */
export function trackLeadCapture(
  source: 'idea_lab' | 'analyzer' | 'estimate' | 'roi_calculator' | 'exit_intent' | 'contact_form' | 'chatbot',
  locale: string
): void {
  void track('lead_captured', { source, locale });
}
