/**
 * Aviniti App Feature Catalog & Cost Estimator
 *
 * 243 features across 22 categories with exact pricing from
 * Aviniti's official pricing spreadsheet.
 *
 * Feature names/descriptions are stored in i18n JSON files:
 *   messages/en/features.json
 *   messages/ar/features.json
 */

// ============================================================
// Types
// ============================================================
export type FeatureComplexity = 'Low' | 'Medium' | 'High';

export interface FeatureCategory {
  id: string;
  nameKey: string; // i18n key in common.json
  icon: string;    // Lucide icon name
}

export interface CatalogFeature {
  id: string;
  categoryId: string;
  price: number;          // USD
  timelineDays: number;   // business days
  complexity: FeatureComplexity;
  notes?: string;
}

// ============================================================
// Categories (22)
// ============================================================
export const FEATURE_CATEGORIES: FeatureCategory[] = [
  { id: 'auth', nameKey: 'categories.auth', icon: 'Shield' },
  { id: 'profile', nameKey: 'categories.profile', icon: 'User' },
  { id: 'navigation', nameKey: 'categories.navigation', icon: 'Layout' },
  { id: 'content', nameKey: 'categories.content', icon: 'Image' },
  { id: 'communication', nameKey: 'categories.communication', icon: 'MessageSquare' },
  { id: 'notifications', nameKey: 'categories.notifications', icon: 'Bell' },
  { id: 'payments', nameKey: 'categories.payments', icon: 'CreditCard' },
  { id: 'ecommerce', nameKey: 'categories.ecommerce', icon: 'ShoppingCart' },
  { id: 'booking', nameKey: 'categories.booking', icon: 'Calendar' },
  { id: 'maps', nameKey: 'categories.maps', icon: 'MapPin' },
  { id: 'social', nameKey: 'categories.social', icon: 'Users' },
  { id: 'admin', nameKey: 'categories.admin', icon: 'Settings' },
  { id: 'analytics', nameKey: 'categories.analytics', icon: 'BarChart3' },
  { id: 'security', nameKey: 'categories.security', icon: 'Lock' },
  { id: 'localization', nameKey: 'categories.localization', icon: 'Globe' },
  { id: 'ai', nameKey: 'categories.ai', icon: 'Brain' },
  { id: 'backend', nameKey: 'categories.backend', icon: 'Server' },
  { id: 'testing', nameKey: 'categories.testing', icon: 'TestTube' },
  { id: 'deployment', nameKey: 'categories.deployment', icon: 'Rocket' },
  { id: 'integrations', nameKey: 'categories.integrations', icon: 'Plug' },
  { id: 'offline', nameKey: 'categories.offline', icon: 'WifiOff' },
  { id: 'misc', nameKey: 'categories.misc', icon: 'Sparkles' },
];

// ============================================================
// Feature Catalog (243 features)
// ============================================================
export const FEATURE_CATALOG: CatalogFeature[] = [
  // ── 1. Authentication & User Management ──
  { id: 'auth-email-password', categoryId: 'auth', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'auth-social-google', categoryId: 'auth', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'auth-social-facebook', categoryId: 'auth', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'auth-social-apple', categoryId: 'auth', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'auth-social-twitter', categoryId: 'auth', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'auth-phone-otp', categoryId: 'auth', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'auth-biometric', categoryId: 'auth', price: 450, timelineDays: 3, complexity: 'Medium' },
  { id: 'auth-2fa', categoryId: 'auth', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'auth-magic-link', categoryId: 'auth', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'auth-multi-tenant', categoryId: 'auth', price: 1200, timelineDays: 7, complexity: 'High' },
  { id: 'auth-session-management', categoryId: 'auth', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'auth-account-deletion', categoryId: 'auth', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'auth-guest-access', categoryId: 'auth', price: 300, timelineDays: 2, complexity: 'Low' },

  // ── 2. User Profile & Settings ──
  { id: 'profile-basic', categoryId: 'profile', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'profile-extended-fields', categoryId: 'profile', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'profile-verification', categoryId: 'profile', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'profile-account-settings', categoryId: 'profile', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'profile-preferences', categoryId: 'profile', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'profile-dark-mode', categoryId: 'profile', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'profile-address-book', categoryId: 'profile', price: 450, timelineDays: 3, complexity: 'Low' },
  { id: 'profile-onboarding', categoryId: 'profile', price: 700, timelineDays: 5, complexity: 'Medium' },

  // ── 3. Navigation & UI Framework ──
  { id: 'nav-bottom-tabs', categoryId: 'navigation', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'nav-side-drawer', categoryId: 'navigation', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'nav-splash-screen', categoryId: 'navigation', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'nav-app-icon', categoryId: 'navigation', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'nav-search-filters', categoryId: 'navigation', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'nav-dashboard', categoryId: 'navigation', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'nav-pull-refresh', categoryId: 'navigation', price: 150, timelineDays: 1, complexity: 'Low' },
  { id: 'nav-infinite-scroll', categoryId: 'navigation', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'nav-skeleton-loading', categoryId: 'navigation', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'nav-fab', categoryId: 'navigation', price: 150, timelineDays: 1, complexity: 'Low' },
  { id: 'nav-deep-linking', categoryId: 'navigation', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 4. Content & Media ──
  { id: 'content-image-upload', categoryId: 'content', price: 450, timelineDays: 3, complexity: 'Low' },
  { id: 'content-multi-image', categoryId: 'content', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'content-video-upload', categoryId: 'content', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'content-video-editing', categoryId: 'content', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'content-audio', categoryId: 'content', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'content-document-upload', categoryId: 'content', price: 450, timelineDays: 3, complexity: 'Low' },
  { id: 'content-pdf-viewer', categoryId: 'content', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'content-rich-text', categoryId: 'content', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'content-image-gallery', categoryId: 'content', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'content-stories', categoryId: 'content', price: 1500, timelineDays: 10, complexity: 'High' },
  { id: 'content-qr-scanner', categoryId: 'content', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'content-qr-generator', categoryId: 'content', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'content-file-manager', categoryId: 'content', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 5. Communication & Messaging ──
  { id: 'comm-chat-1to1', categoryId: 'communication', price: 1200, timelineDays: 7, complexity: 'High' },
  { id: 'comm-group-chat', categoryId: 'communication', price: 1500, timelineDays: 10, complexity: 'High' },
  { id: 'comm-chat-media', categoryId: 'communication', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'comm-chat-reactions', categoryId: 'communication', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'comm-voice-call', categoryId: 'communication', price: 2000, timelineDays: 14, complexity: 'High' },
  { id: 'comm-video-call', categoryId: 'communication', price: 2500, timelineDays: 14, complexity: 'High' },
  { id: 'comm-inbox', categoryId: 'communication', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'comm-contact-list', categoryId: 'communication', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'comm-chatbot', categoryId: 'communication', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'comm-email-transactional', categoryId: 'communication', price: 400, timelineDays: 3, complexity: 'Low' },

  // ── 6. Push Notifications ──
  { id: 'notif-basic-push', categoryId: 'notifications', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'notif-preferences', categoryId: 'notifications', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'notif-scheduled', categoryId: 'notifications', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'notif-rich', categoryId: 'notifications', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'notif-segmented', categoryId: 'notifications', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'notif-badge', categoryId: 'notifications', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'notif-silent', categoryId: 'notifications', price: 350, timelineDays: 2, complexity: 'Low' },

  // ── 7. Payments & Monetization ──
  { id: 'pay-stripe', categoryId: 'payments', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'pay-paypal', categoryId: 'payments', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'pay-apple-google', categoryId: 'payments', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'pay-iap', categoryId: 'payments', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'pay-subscriptions', categoryId: 'payments', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'pay-wallet', categoryId: 'payments', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'pay-promo-codes', categoryId: 'payments', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'pay-invoices', categoryId: 'payments', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'pay-multi-currency', categoryId: 'payments', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'pay-payouts', categoryId: 'payments', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'pay-tipping', categoryId: 'payments', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'pay-ads', categoryId: 'payments', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'pay-refunds', categoryId: 'payments', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 8. E-Commerce & Marketplace ──
  { id: 'ecom-product-listing', categoryId: 'ecommerce', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'ecom-product-detail', categoryId: 'ecommerce', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'ecom-cart', categoryId: 'ecommerce', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'ecom-checkout', categoryId: 'ecommerce', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'ecom-orders-user', categoryId: 'ecommerce', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'ecom-orders-admin', categoryId: 'ecommerce', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'ecom-wishlist', categoryId: 'ecommerce', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'ecom-reviews', categoryId: 'ecommerce', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'ecom-inventory', categoryId: 'ecommerce', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'ecom-shipping', categoryId: 'ecommerce', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'ecom-vendor-dashboard', categoryId: 'ecommerce', price: 1200, timelineDays: 7, complexity: 'High' },
  { id: 'ecom-comparison', categoryId: 'ecommerce', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'ecom-barcode', categoryId: 'ecommerce', price: 400, timelineDays: 3, complexity: 'Low' },

  // ── 9. Booking & Appointments ──
  { id: 'booking-calendar', categoryId: 'booking', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'booking-appointment', categoryId: 'booking', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'booking-provider-scheduling', categoryId: 'booking', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'booking-modifications', categoryId: 'booking', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'booking-recurring', categoryId: 'booking', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'booking-waitlist', categoryId: 'booking', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'booking-calendar-sync', categoryId: 'booking', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'booking-reminders', categoryId: 'booking', price: 400, timelineDays: 3, complexity: 'Low' },

  // ── 10. Maps & Location ──
  { id: 'maps-view', categoryId: 'maps', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'maps-user-location', categoryId: 'maps', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'maps-search', categoryId: 'maps', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'maps-geofencing', categoryId: 'maps', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'maps-directions', categoryId: 'maps', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'maps-live-tracking', categoryId: 'maps', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'maps-store-locator', categoryId: 'maps', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'maps-heatmap', categoryId: 'maps', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'maps-nearby', categoryId: 'maps', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 11. Social & Community ──
  { id: 'social-feed', categoryId: 'social', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'social-post-creation', categoryId: 'social', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'social-likes', categoryId: 'social', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'social-comments', categoryId: 'social', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'social-share', categoryId: 'social', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'social-follow', categoryId: 'social', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'social-blocking', categoryId: 'social', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'social-hashtags', categoryId: 'social', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'social-groups', categoryId: 'social', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'social-events', categoryId: 'social', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'social-polls', categoryId: 'social', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'social-gamification', categoryId: 'social', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 12. Admin Panel / CMS ──
  { id: 'admin-dashboard', categoryId: 'admin', price: 1500, timelineDays: 7, complexity: 'High' },
  { id: 'admin-user-management', categoryId: 'admin', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'admin-content-management', categoryId: 'admin', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'admin-rbac', categoryId: 'admin', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'admin-analytics', categoryId: 'admin', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'admin-push-sender', categoryId: 'admin', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'admin-reports-export', categoryId: 'admin', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'admin-audit-log', categoryId: 'admin', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'admin-support-tickets', categoryId: 'admin', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'admin-cms-dynamic', categoryId: 'admin', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'admin-remote-config', categoryId: 'admin', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 13. Analytics & Tracking ──
  { id: 'analytics-firebase', categoryId: 'analytics', price: 400, timelineDays: 2, complexity: 'Low' },
  { id: 'analytics-crash-reporting', categoryId: 'analytics', price: 350, timelineDays: 2, complexity: 'Low' },
  { id: 'analytics-custom-events', categoryId: 'analytics', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'analytics-ab-testing', categoryId: 'analytics', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'analytics-behavior', categoryId: 'analytics', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'analytics-attribution', categoryId: 'analytics', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'analytics-performance', categoryId: 'analytics', price: 400, timelineDays: 2, complexity: 'Low' },

  // ── 14. Security & Compliance ──
  { id: 'security-ssl', categoryId: 'security', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'security-encryption', categoryId: 'security', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'security-gdpr', categoryId: 'security', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'security-legal-pages', categoryId: 'security', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'security-rate-limiting', categoryId: 'security', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'security-content-moderation', categoryId: 'security', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'security-e2ee', categoryId: 'security', price: 1500, timelineDays: 10, complexity: 'High' },
  { id: 'security-backup', categoryId: 'security', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'security-ip-blocking', categoryId: 'security', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'security-audit-trail', categoryId: 'security', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 15. Localization & Accessibility ──
  { id: 'l10n-multi-language', categoryId: 'localization', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'l10n-rtl', categoryId: 'localization', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'l10n-accessibility', categoryId: 'localization', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'l10n-dynamic-font', categoryId: 'localization', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'l10n-voiceover', categoryId: 'localization', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'l10n-auto-translation', categoryId: 'localization', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 16. AI & Smart Features ──
  { id: 'ai-chatbot', categoryId: 'ai', price: 2400, timelineDays: 7, complexity: 'High' },
  { id: 'ai-recommendations', categoryId: 'ai', price: 3000, timelineDays: 10, complexity: 'High' },
  { id: 'ai-image-recognition', categoryId: 'ai', price: 2000, timelineDays: 7, complexity: 'High' },
  { id: 'ai-nlp', categoryId: 'ai', price: 2400, timelineDays: 7, complexity: 'High' },
  { id: 'ai-speech-to-text', categoryId: 'ai', price: 1600, timelineDays: 5, complexity: 'Medium' },
  { id: 'ai-text-to-speech', categoryId: 'ai', price: 1200, timelineDays: 4, complexity: 'Medium' },
  { id: 'ai-content-generation', categoryId: 'ai', price: 2000, timelineDays: 7, complexity: 'High' },
  { id: 'ai-smart-search', categoryId: 'ai', price: 2000, timelineDays: 7, complexity: 'High' },
  { id: 'ai-facial-recognition', categoryId: 'ai', price: 3000, timelineDays: 10, complexity: 'High' },
  { id: 'ai-ocr', categoryId: 'ai', price: 1600, timelineDays: 5, complexity: 'Medium' },
  // Custom AI Solutions (Built & Trained by Aviniti)
  { id: 'ai-custom-model', categoryId: 'ai', price: 12000, timelineDays: 30, complexity: 'High' },
  { id: 'ai-custom-nlp', categoryId: 'ai', price: 15000, timelineDays: 35, complexity: 'High' },
  { id: 'ai-custom-vision', categoryId: 'ai', price: 14000, timelineDays: 30, complexity: 'High' },
  { id: 'ai-document-pipeline', categoryId: 'ai', price: 10000, timelineDays: 21, complexity: 'High' },
  { id: 'ai-predictive-analytics', categoryId: 'ai', price: 12000, timelineDays: 28, complexity: 'High' },
  { id: 'ai-recommendation-engine', categoryId: 'ai', price: 10000, timelineDays: 21, complexity: 'High' },
  { id: 'ai-conversational-agent', categoryId: 'ai', price: 15000, timelineDays: 35, complexity: 'High' },
  { id: 'ai-data-extraction', categoryId: 'ai', price: 8000, timelineDays: 14, complexity: 'High' },
  { id: 'ai-sentiment-analysis', categoryId: 'ai', price: 7000, timelineDays: 14, complexity: 'High' },
  { id: 'ai-anomaly-detection', categoryId: 'ai', price: 10000, timelineDays: 21, complexity: 'High' },
  { id: 'ai-image-generation', categoryId: 'ai', price: 12000, timelineDays: 28, complexity: 'High' },
  { id: 'ai-workflow-automation', categoryId: 'ai', price: 18000, timelineDays: 42, complexity: 'High' },
  { id: 'ai-pricing-optimization', categoryId: 'ai', price: 10000, timelineDays: 21, complexity: 'High' },
  { id: 'ai-voice-assistant', categoryId: 'ai', price: 14000, timelineDays: 30, complexity: 'High' },
  { id: 'ai-translation-model', categoryId: 'ai', price: 8000, timelineDays: 14, complexity: 'High' },
  { id: 'ai-quality-control', categoryId: 'ai', price: 15000, timelineDays: 35, complexity: 'High' },
  { id: 'ai-knowledge-graph', categoryId: 'ai', price: 12000, timelineDays: 28, complexity: 'High' },
  { id: 'ai-rag-system', categoryId: 'ai', price: 8000, timelineDays: 14, complexity: 'High' },
  { id: 'ai-model-monitoring', categoryId: 'ai', price: 6000, timelineDays: 10, complexity: 'High' },
  { id: 'ai-custom-api', categoryId: 'ai', price: 5000, timelineDays: 10, complexity: 'Medium' },

  // ── 17. Backend & Infrastructure ──
  { id: 'backend-rest-api', categoryId: 'backend', price: 1500, timelineDays: 7, complexity: 'High' },
  { id: 'backend-database', categoryId: 'backend', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'backend-cloud-hosting', categoryId: 'backend', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'backend-cdn', categoryId: 'backend', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'backend-rate-limiting', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-websocket', categoryId: 'backend', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'backend-background-jobs', categoryId: 'backend', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'backend-file-storage', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-email-service', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-sms-service', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-cicd', categoryId: 'backend', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'backend-staging', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-migrations', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-api-docs', categoryId: 'backend', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'backend-microservices', categoryId: 'backend', price: 2000, timelineDays: 14, complexity: 'High' },
  { id: 'backend-serverless', categoryId: 'backend', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 18. Testing & QA ──
  { id: 'testing-unit', categoryId: 'testing', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'testing-integration', categoryId: 'testing', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'testing-ui-manual', categoryId: 'testing', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'testing-e2e', categoryId: 'testing', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'testing-performance', categoryId: 'testing', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'testing-security', categoryId: 'testing', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'testing-beta', categoryId: 'testing', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'testing-bug-tracking', categoryId: 'testing', price: 300, timelineDays: 2, complexity: 'Low' },

  // ── 19. Deployment & App Store ──
  { id: 'deploy-ios', categoryId: 'deployment', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'deploy-android', categoryId: 'deployment', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'deploy-aso', categoryId: 'deployment', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'deploy-ota-updates', categoryId: 'deployment', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'deploy-feature-flags', categoryId: 'deployment', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'deploy-versioning', categoryId: 'deployment', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'deploy-pwa', categoryId: 'deployment', price: 600, timelineDays: 4, complexity: 'Medium' },

  // ── 20. Third-Party Integrations ──
  { id: 'integ-google-maps', categoryId: 'integrations', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'integ-firebase', categoryId: 'integrations', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'integ-twilio', categoryId: 'integrations', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'integ-sendgrid', categoryId: 'integrations', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'integ-algolia', categoryId: 'integrations', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'integ-stripe-connect', categoryId: 'integrations', price: 1000, timelineDays: 7, complexity: 'High' },
  { id: 'integ-social-sharing', categoryId: 'integrations', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'integ-calendar', categoryId: 'integrations', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'integ-crm', categoryId: 'integrations', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'integ-zapier', categoryId: 'integrations', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'integ-whatsapp', categoryId: 'integrations', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'integ-custom-api', categoryId: 'integrations', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 21. Offline & Performance ──
  { id: 'offline-basic', categoryId: 'offline', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'offline-sync', categoryId: 'offline', price: 1200, timelineDays: 7, complexity: 'High' },
  { id: 'offline-image-cache', categoryId: 'offline', price: 300, timelineDays: 2, complexity: 'Low' },
  { id: 'offline-optimization', categoryId: 'offline', price: 500, timelineDays: 3, complexity: 'Medium' },
  { id: 'offline-background-sync', categoryId: 'offline', price: 500, timelineDays: 3, complexity: 'Medium' },

  // ── 22. Miscellaneous / Add-Ons ──
  { id: 'misc-animations', categoryId: 'misc', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'misc-haptic', categoryId: 'misc', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'misc-rating-prompt', categoryId: 'misc', price: 200, timelineDays: 1, complexity: 'Low' },
  { id: 'misc-referral', categoryId: 'misc', price: 700, timelineDays: 5, complexity: 'Medium' },
  { id: 'misc-loyalty', categoryId: 'misc', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'misc-multi-platform', categoryId: 'misc', price: 600, timelineDays: 4, complexity: 'Medium' },
  { id: 'misc-print', categoryId: 'misc', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'misc-ar', categoryId: 'misc', price: 2000, timelineDays: 14, complexity: 'High' },
  { id: 'misc-bluetooth', categoryId: 'misc', price: 1500, timelineDays: 10, complexity: 'High' },
  { id: 'misc-nfc', categoryId: 'misc', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'misc-wearable', categoryId: 'misc', price: 2000, timelineDays: 14, complexity: 'High' },
  { id: 'misc-widget', categoryId: 'misc', price: 800, timelineDays: 5, complexity: 'Medium' },
  { id: 'misc-clipboard', categoryId: 'misc', price: 400, timelineDays: 3, complexity: 'Low' },
  { id: 'misc-custom-keyboard', categoryId: 'misc', price: 1200, timelineDays: 7, complexity: 'High' },
];

// ============================================================
// Lookup Helpers
// ============================================================
const featureMap = new Map(FEATURE_CATALOG.map(f => [f.id, f]));

export function getFeatureById(id: string): CatalogFeature | undefined {
  return featureMap.get(id);
}

export function getFeaturesByCategory(categoryId: string): CatalogFeature[] {
  return FEATURE_CATALOG.filter(f => f.categoryId === categoryId);
}

export function getCategoryById(id: string): FeatureCategory | undefined {
  return FEATURE_CATEGORIES.find(c => c.id === id);
}

/**
 * Build a compressed catalog string for AI prompts.
 * Format: "featureId|categoryId" per line (~4KB total)
 */
export function buildCompressedCatalog(): string {
  return FEATURE_CATALOG.map(f => `${f.id}|${f.categoryId}`).join('\n');
}
