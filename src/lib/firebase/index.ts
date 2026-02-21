// Central export file for Firebase functionality

// Client SDK (for potential future use)
export { getFirebaseApp, getFirebaseDb, app, db } from './client';

// Admin SDK (server-only)
export { getAdminApp, getAdminDb, adminApp, adminDb } from './admin';

// Collection helpers
export {
  getLeadsCollection,
  getAISubmissionsCollection,
  getChatbotConversationsCollection,
  getContactSubmissionsCollection,
  getExitIntentCapturesCollection,
  saveLeadToFirestore,
  saveAISubmission,
  saveChatMessage,
  saveContactSubmission,
  saveExitIntentCapture,
  linkChatbotToLead,
} from './collections';

// Type exports
export type {
  LeadData,
  AISubmissionData,
  ChatMessage,
  ChatbotConversationData,
  ContactSubmissionData,
  ExitIntentCaptureData,
} from './collections';

// Error logging (server-only)
export {
  logServerError,
  logServerWarning,
  logServerInfo,
  getErrorLogsCollection,
} from './error-logging';

export type { ErrorSeverity, ErrorLogEntry } from './error-logging';
