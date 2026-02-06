// Google Analytics 4 helper functions
// Client-side only - uses window.gtag

type ToolPrefix = 'idea_lab' | 'analyzer' | 'estimate' | 'roi_calculator';

/**
 * Check if gtag is available
 */
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Track a custom event
 *
 * @param eventName - Name of the event to track
 * @param params - Event parameters
 *
 * @example
 * trackEvent('button_click', { button_name: 'cta_hero', page: '/en' });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!isGtagAvailable()) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, params);
    }
    return;
  }

  window.gtag('event', eventName, params);
}

/**
 * Track an AI tool event
 * Convenience wrapper for tool-specific events
 *
 * @param tool - Tool identifier
 * @param action - Action performed (e.g., 'started', 'completed', 'failed')
 * @param params - Additional event parameters
 *
 * @example
 * trackToolEvent('idea_lab', 'started', { locale: 'en', entry_source: 'homepage_card' });
 * trackToolEvent('estimate', 'completed', { processing_time_ms: 2500 });
 */
export function trackToolEvent(
  tool: ToolPrefix,
  action: string,
  params?: Record<string, string | number | boolean>
): void {
  const eventName = `${tool}_${action}`;
  trackEvent(eventName, params);
}

/**
 * Set user properties
 *
 * @param properties - User properties to set
 *
 * @example
 * setUserProperty('preferred_locale', 'en');
 * setUserProperty({ session_tool_count: 2, has_converted: 'true' });
 */
export function setUserProperty(
  name: string,
  value: string | number
): void;
export function setUserProperty(
  properties: Record<string, string | number>
): void;
export function setUserProperty(
  nameOrProperties: string | Record<string, string | number>,
  value?: string | number
): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] User Property:', nameOrProperties, value);
    }
    return;
  }

  // Handle both single property and object of properties
  if (typeof nameOrProperties === 'string' && value !== undefined) {
    window.gtag('set', 'user_properties', {
      [nameOrProperties]: value,
    });
  } else if (typeof nameOrProperties === 'object') {
    window.gtag('set', 'user_properties', nameOrProperties);
  }
}

/**
 * Track page view
 * Usually called automatically by GA4, but can be manually triggered for SPAs
 *
 * @param path - Page path
 * @param title - Page title
 *
 * @example
 * trackPageView('/en/solutions', 'Solutions | Aviniti');
 */
export function trackPageView(path: string, title?: string): void {
  if (!isGtagAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page View:', path, title);
    }
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track scroll depth milestone
 *
 * @param percentScrolled - Percentage scrolled (25, 50, 75, 100)
 *
 * @example
 * trackScrollDepth(50);
 */
export function trackScrollDepth(percentScrolled: 25 | 50 | 75 | 100): void {
  trackEvent('scroll_depth', { percent_scrolled: percentScrolled });
}

/**
 * Track CTA click
 *
 * @param ctaText - Text of the CTA button
 * @param page - Current page path
 * @param section - Section identifier where CTA is located
 *
 * @example
 * trackCtaClick('Get Instant AI Estimate', '/en', 'hero');
 */
export function trackCtaClick(
  ctaText: string,
  page: string,
  section?: string
): void {
  trackEvent('cta_clicked', {
    cta_text: ctaText,
    page,
    ...(section && { section }),
  });
}

/**
 * Track lead capture event
 *
 * @param source - Source of the lead
 * @param locale - User's locale
 *
 * @example
 * trackLeadCapture('idea_lab', 'en');
 */
export function trackLeadCapture(
  source:
    | 'idea_lab'
    | 'analyzer'
    | 'estimate'
    | 'roi_calculator'
    | 'exit_intent'
    | 'contact_form'
    | 'chatbot',
  locale: string
): void {
  trackEvent('lead_captured', { source, locale });
}

/**
 * Track contact form submission
 *
 * @param topic - Selected topic/category
 *
 * @example
 * trackContactFormSubmit('project-discussion');
 */
export function trackContactFormSubmit(topic: string): void {
  trackEvent('contact_form_submitted', { topic });
}

/**
 * Track WhatsApp click
 *
 * @param context - Context where WhatsApp link was clicked
 *
 * @example
 * trackWhatsAppClick('floating');
 */
export function trackWhatsAppClick(
  context:
    | 'floating'
    | 'contact'
    | 'exit_intent'
    | 'tool_result'
    | 'footer'
    | 'chatbot'
): void {
  trackEvent('whatsapp_clicked', { context });
}

/**
 * Track exit intent popup events
 *
 * @param action - Action performed (shown, converted, dismissed)
 * @param variant - Popup variant
 * @param page - Current page path
 * @param dismissMethod - How popup was dismissed (only for dismissed action)
 *
 * @example
 * trackExitIntent('shown', 'A', '/en/solutions');
 * trackExitIntent('converted', 'C', '/en/get-estimate');
 * trackExitIntent('dismissed', 'B', '/en', 'close_button');
 */
export function trackExitIntent(
  action: 'shown' | 'converted' | 'dismissed',
  variant: 'A' | 'B' | 'C' | 'D' | 'E',
  page: string,
  dismissMethod?:
    | 'close_button'
    | 'overlay_click'
    | 'escape_key'
    | 'no_thanks_link'
    | 'swipe_down'
): void {
  const eventName = `exit_intent_${action}`;
  trackEvent(eventName, {
    variant,
    page,
    ...(dismissMethod && { dismiss_method: dismissMethod }),
  });
}

/**
 * Track chatbot events
 *
 * @param action - Action performed
 * @param params - Additional parameters
 *
 * @example
 * trackChatbotEvent('opened', { trigger: 'user_click' });
 * trackChatbotEvent('message_sent', { message_count: 3, page: '/en/solutions' });
 */
export function trackChatbotEvent(
  action:
    | 'opened'
    | 'closed'
    | 'message_sent'
    | 'quick_reply_clicked'
    | 'link_clicked'
    | 'rate_limited',
  params?: Record<string, string | number | boolean>
): void {
  const eventName = `chatbot_${action}`;
  trackEvent(eventName, params);
}

/**
 * Track solution viewed
 *
 * @param solutionSlug - Solution identifier
 * @param price - Starting price
 *
 * @example
 * trackSolutionViewed('delivery-app', 10000);
 */
export function trackSolutionViewed(
  solutionSlug: string,
  price: number
): void {
  trackEvent('solution_viewed', {
    solution_slug: solutionSlug,
    price,
  });
}

/**
 * Track language switch
 *
 * @param fromLocale - Original locale
 * @param toLocale - New locale
 * @param page - Current page path
 *
 * @example
 * trackLanguageSwitch('en', 'ar', '/en/solutions');
 */
export function trackLanguageSwitch(
  fromLocale: string,
  toLocale: string,
  page: string
): void {
  trackEvent('language_switched', {
    from_locale: fromLocale,
    to_locale: toLocale,
    page,
  });
}

/**
 * Track FAQ question expansion
 *
 * @param questionId - Question identifier
 * @param category - FAQ category
 *
 * @example
 * trackFaqExpanded('pricing-general', 'pricing');
 */
export function trackFaqExpanded(questionId: string, category: string): void {
  trackEvent('faq_question_expanded', {
    question_id: questionId,
    category,
  });
}

/**
 * Initialize analytics for the session
 * Call this once on app mount to set initial user properties
 *
 * @param locale - User's locale
 */
export function initializeAnalytics(locale: string): void {
  setUserProperty({
    preferred_locale: locale,
    session_tool_count: 0,
    has_converted: 'false',
  });
}

/**
 * Increment session tool count
 * Call this when a user starts using an AI tool
 */
export function incrementSessionToolCount(): void {
  if (typeof window === 'undefined') return;

  const currentCount =
    parseInt(sessionStorage.getItem('session_tool_count') || '0', 10) || 0;
  const newCount = currentCount + 1;
  sessionStorage.setItem('session_tool_count', newCount.toString());

  setUserProperty('session_tool_count', newCount);
}

/**
 * Mark user as converted
 * Call this when a lead is captured
 */
export function markUserAsConverted(): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('aviniti_converted', 'true');
  setUserProperty('has_converted', 'true');
}

/**
 * Check if user has already converted
 */
export function hasUserConverted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('aviniti_converted') === 'true';
}
