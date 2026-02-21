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
  EVT_LANGUAGE_CHANGED,
  EVT_SOLUTION_VIEWED,
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

// ─── Language ─────────────────────────────────────────────────────────────────

export function trackLanguageChanged(from: string, to: string): void {
  void track(EVT_LANGUAGE_CHANGED, { from_locale: from, to_locale: to });
}

// ─── Solutions / Services ─────────────────────────────────────────────────────

export function trackSolutionViewed(solutionId: string, locale: string): void {
  void track(EVT_SOLUTION_VIEWED, { solution_id: solutionId, locale });
}
