/**
 * Analytics event names — single source of truth.
 * All event names follow snake_case convention (Firebase requirement).
 */

// ─── Page / Navigation ────────────────────────────────────────────────────────
export const EVT_PAGE_VIEW = 'page_view' as const;

// ─── AI Tool Lifecycle ────────────────────────────────────────────────────────
export const EVT_AI_TOOL_STARTED = 'ai_tool_started' as const;
export const EVT_AI_TOOL_SUBMITTED = 'ai_tool_submitted' as const;
export const EVT_AI_TOOL_COMPLETED = 'ai_tool_completed' as const;
export const EVT_AI_TOOL_ERROR = 'ai_tool_error' as const;
export const EVT_AI_TOOL_CROSS_SELL_CLICKED = 'ai_tool_cross_sell_clicked' as const;

// ─── PDF / Report ─────────────────────────────────────────────────────────────
export const EVT_PDF_DOWNLOADED = 'pdf_downloaded' as const;

// ─── CTA Clicks ───────────────────────────────────────────────────────────────
export const EVT_CTA_CLICKED = 'cta_clicked' as const;

// ─── Contact Capture ──────────────────────────────────────────────────────────
export const EVT_CONTACT_CAPTURE_STARTED = 'contact_capture_started' as const;
export const EVT_CONTACT_CAPTURE_SUBMITTED = 'contact_capture_submitted' as const;

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const EVT_NEWSLETTER_SUBSCRIBED = 'newsletter_subscribed' as const;

// ─── Exit Intent ──────────────────────────────────────────────────────────────
export const EVT_EXIT_INTENT_SHOWN = 'exit_intent_shown' as const;
export const EVT_EXIT_INTENT_DISMISSED = 'exit_intent_dismissed' as const;

// ─── Language ─────────────────────────────────────────────────────────────────
export const EVT_LANGUAGE_CHANGED = 'language_changed' as const;

// ─── Solutions / Services ─────────────────────────────────────────────────────
export const EVT_SOLUTION_VIEWED = 'solution_viewed' as const;

// ─── Tool slugs (AI tools) ────────────────────────────────────────────────────
export type AiToolSlug = 'idea_lab' | 'ai_analyzer' | 'get_estimate' | 'roi_calculator';

// ─── CTA locations ────────────────────────────────────────────────────────────
export type CtaLocation =
  | 'hero'
  | 'navbar'
  | 'footer'
  | 'consultation'
  | 'cross_sell'
  | 'final_cta'
  | 'ai_tool_top'
  | 'ai_tool_bottom';

// ─── Errors / Exceptions ──────────────────────────────────────────────────────
export const EVT_EXCEPTION = 'exception' as const;
export const EVT_CLIENT_ERROR = 'client_error' as const;

// ─── Engagement ───────────────────────────────────────────────────────────────
export const EVT_SCROLL_DEPTH = 'scroll_depth' as const;
export const EVT_FAQ_EXPANDED = 'faq_question_expanded' as const;
export const EVT_WHATSAPP_CLICKED = 'whatsapp_clicked' as const;
export const EVT_LEAD_CAPTURED = 'lead_captured' as const;
export const EVT_USER_CONVERTED = 'user_converted' as const;
