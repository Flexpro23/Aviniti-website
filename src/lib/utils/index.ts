// Central export file for utility functions

// Formatters
export {
  formatPhone,
  slugify,
  truncate,
  formatPrice,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  capitalize,
  toTitleCase,
} from './formatters';

// Validators (Zod schemas)
export {
  emailSchema,
  phoneSchema,
  nameSchema,
  companySchema,
  whatsappSchema,
  ideaLabDiscoverSchema,
  ideaLabGenerateSchema,
  analyzerFormSchema,
  analyzeIdeaSchema,
  generateFeaturesSchema,
  estimateFormSchema,
  roiFormSchema,
  roiFormSchemaV2,
  contactFormSchema,
  exitIntentFormSchema,
  chatMessageSchema,
} from './validators';

export type {
  IdeaLabDiscoverData,
  IdeaLabGenerateData,
  AnalyzerFormData,
  AnalyzeIdeaFormData,
  GenerateFeaturesFormData,
  EstimateFormData,
  ROIFormData,
  ROIFormDataV2,
  ContactFormData,
  ExitIntentFormData,
  ChatMessageData,
} from './validators';

// Analytics
export {
  trackEvent,
  trackToolEvent,
  setUserProperty,
  trackPageView,
  trackScrollDepth,
  trackCtaClick,
  trackLeadCapture,
  trackContactFormSubmit,
  trackWhatsAppClick,
  trackExitIntent,
  trackChatbotEvent,
  trackSolutionViewed,
  trackLanguageSwitch,
  trackFaqExpanded,
  initializeAnalytics,
  incrementSessionToolCount,
  markUserAsConverted,
  hasUserConverted,
} from './analytics';

// Re-export cn utility if it exists
export { cn } from './cn';
