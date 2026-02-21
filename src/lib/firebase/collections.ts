// Firestore collection references and helper functions
// Server-only - uses Firebase Admin SDK

import { getAdminDb } from './admin';
import type { Locale } from '@/types/common';
import type {
  Background,
  Industry,
  ProcessType,
  ProcessIssue,
  Currency,
  ContactTopic,
  ExitIntentVariant,
  ProjectType,
  GrowthEstimate,
} from '@/types/api';

// ============================================================
// Collection References
// ============================================================

/**
 * Get leads collection reference
 */
export function getLeadsCollection() {
  const db = getAdminDb();
  return db.collection('leads');
}

/**
 * Get AI submissions collection reference
 */
export function getAISubmissionsCollection() {
  const db = getAdminDb();
  return db.collection('ai_submissions');
}

/**
 * Get chatbot conversations collection reference
 */
export function getChatbotConversationsCollection() {
  const db = getAdminDb();
  return db.collection('chatbot_conversations');
}

/**
 * Get contact submissions collection reference
 */
export function getContactSubmissionsCollection() {
  const db = getAdminDb();
  return db.collection('contact_submissions');
}

/**
 * Get exit intent captures collection reference
 */
export function getExitIntentCapturesCollection() {
  const db = getAdminDb();
  return db.collection('exit_intent_captures');
}

// ============================================================
// Type Definitions
// ============================================================

export interface LeadData {
  phone: string;
  name: string;
  email?: string | null;
  company?: string | null;
  whatsapp: boolean;
  source:
    | 'idea-lab'
    | 'analyzer'
    | 'estimate'
    | 'roi-calculator'
    | 'contact'
    | 'exit-intent'
    | 'chatbot';
  locale: Locale;
  converted: boolean;
  notes?: string | null;
  metadata: {
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    userAgent?: string;
    ipCountry?: string;
  };
  // Tool-specific fields
  background?: Background;
  industry?: Industry;
  problem?: string;
  idea?: string;
  targetAudience?: string;
  projectType?: ProjectType;
  features?: string[];
  customFeatures?: string[];
  timeline?: string;
  description?: string;
  processType?: ProcessType;
  customProcess?: string;
  hoursPerWeek?: number;
  employees?: number;
  hourlyCost?: number;
  currency?: Currency;
  issues?: ProcessIssue[];
  customerGrowth?: GrowthEstimate;
  retentionImprovement?: GrowthEstimate;
  monthlyRevenue?: number;
}

export interface AISubmissionData {
  tool: 'idea-lab' | 'analyzer' | 'estimate' | 'roi-calculator';
  leadId: string;
  request: Record<string, unknown>;
  response: Record<string, unknown>;
  processingTimeMs: number;
  model: string;
  locale: Locale;
  status: 'completed' | 'failed' | 'timeout';
  errorMessage?: string | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: FirebaseFirestore.Timestamp;
}

export interface ChatbotConversationData {
  sessionId: string;
  messages: ChatMessage[];
  startPage: string;
  locale: Locale;
  messageCount: number;
  convertedToLead: boolean;
  leadId?: string | null;
}

export interface ContactSubmissionData {
  leadId: string;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  topic: ContactTopic;
  message: string;
  whatsapp: boolean;
  status: 'new' | 'responded' | 'closed';
}

export interface ExitIntentCaptureData {
  leadId: string;
  variant: ExitIntentVariant;
  email?: string;
  phone?: string;
  projectType?: string | null;
  page: string;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Save or update a lead in Firestore
 * Implements deduplication logic based on phone number (E.164 format)
 */
export async function saveLeadToFirestore(
  leadData: Omit<LeadData, 'converted' | 'notes'>
): Promise<string> {
  const leadsCollection = getLeadsCollection();

  const now = new Date();

  // Check for existing lead with same phone number (phone is always provided in E.164 format)
  const existingLeadsSnapshot = await leadsCollection
    .where('phone', '==', leadData.phone)
    .limit(1)
    .get();

  if (!existingLeadsSnapshot.empty) {
    // Update existing lead
    const existingLead = existingLeadsSnapshot.docs[0];
    const existingData = existingLead.data();

    // Merge new data with existing, preserving non-null values
    const mergedData = {
      ...leadData,
      updatedAt: now,
      // Preserve existing values if new data doesn't have them
      email: leadData.email || existingData.email || null,
      company: leadData.company || existingData.company || null,
      // Merge metadata
      metadata: {
        ...existingData.metadata,
        ...leadData.metadata,
      },
    };

    await existingLead.ref.update(mergedData);
    return existingLead.id;
  } else {
    // Create new lead
    const newLeadData: Omit<LeadData, 'notes'> & {
      createdAt: Date;
      updatedAt: Date;
    } = {
      ...leadData,
      converted: false,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await leadsCollection.add(newLeadData);
    return docRef.id;
  }
}

/**
 * Save an AI tool submission to Firestore
 */
export async function saveAISubmission(
  submissionData: Omit<AISubmissionData, 'createdAt'>
): Promise<string> {
  const aiSubmissionsCollection = getAISubmissionsCollection();

  const docRef = await aiSubmissionsCollection.add({
    ...submissionData,
    createdAt: new Date(),
  });

  return docRef.id;
}

/**
 * Save a chat message to a conversation
 * Creates conversation if it doesn't exist
 */
export async function saveChatMessage(
  sessionId: string,
  message: Omit<ChatMessage, 'timestamp'>,
  startPage: string,
  locale: Locale
): Promise<void> {
  const chatCollection = getChatbotConversationsCollection();
  const conversationRef = chatCollection.doc(sessionId);
  const conversationDoc = await conversationRef.get();

  const db = getAdminDb();
  const admin = await import('firebase-admin/firestore');
  const timestamp = admin.FieldValue.serverTimestamp();

  const messageWithTimestamp = {
    ...message,
    timestamp,
  };

  if (!conversationDoc.exists) {
    // Create new conversation
    await conversationRef.set({
      sessionId,
      messages: [messageWithTimestamp],
      startPage,
      locale,
      createdAt: timestamp,
      updatedAt: timestamp,
      messageCount: 1,
      convertedToLead: false,
      leadId: null,
    });
  } else {
    // Update existing conversation
    await conversationRef.update({
      messages: admin.FieldValue.arrayUnion(messageWithTimestamp),
      updatedAt: timestamp,
      messageCount: admin.FieldValue.increment(1),
    });
  }
}

/**
 * Save a contact form submission to Firestore
 */
export async function saveContactSubmission(
  submissionData: Omit<ContactSubmissionData, 'createdAt' | 'status'>
): Promise<string> {
  const contactCollection = getContactSubmissionsCollection();

  const docRef = await contactCollection.add({
    ...submissionData,
    status: 'new',
    createdAt: new Date(),
  });

  return docRef.id;
}

/**
 * Save an exit intent capture to Firestore
 */
export async function saveExitIntentCapture(
  captureData: Omit<ExitIntentCaptureData, 'createdAt'>
): Promise<string> {
  const exitIntentCollection = getExitIntentCapturesCollection();

  const docRef = await exitIntentCollection.add({
    ...captureData,
    createdAt: new Date(),
  });

  return docRef.id;
}

/**
 * Link a chatbot conversation to a lead
 */
export async function linkChatbotToLead(
  sessionId: string,
  leadId: string
): Promise<void> {
  const chatCollection = getChatbotConversationsCollection();
  const conversationRef = chatCollection.doc(sessionId);

  await conversationRef.update({
    convertedToLead: true,
    leadId,
  });
}
