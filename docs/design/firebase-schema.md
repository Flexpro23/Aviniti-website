# Firebase Schema & Data Architecture

**Version:** 1.0
**Date:** February 2026
**Firebase Project:** Aviniti Website
**Database:** Cloud Firestore (NoSQL document database)
**Status:** Design Specification

---

## Table of Contents

1. [Overview](#1-overview)
2. [Collections](#2-collections)
3. [Security Rules](#3-security-rules)
4. [Composite Indexes](#4-composite-indexes)
5. [Data Retention Policy](#5-data-retention-policy)
6. [PII Handling & GDPR Compliance](#6-pii-handling--gdpr-compliance)
7. [Backup & Recovery](#7-backup--recovery)

---

## 1. Overview

### Firebase Services Used

| Service | Purpose |
|---------|---------|
| Cloud Firestore | Primary database for leads, AI tool submissions, chatbot conversations, contact form submissions, exit intent captures |
| Firebase Admin SDK | Server-side access from Next.js API routes (the ONLY access method) |

### Services NOT Used

| Service | Reason |
|---------|--------|
| Firebase Authentication | No user accounts. This is a public website with lead capture forms. No visitor login or registration. |
| Firebase Hosting | Website is hosted on Vercel (Next.js deployment target) |
| Firebase Storage | Not needed for v1. If PDF report generation is added later, storage may be introduced. |
| Firebase Realtime Database | Firestore is the sole database. Realtime Database is not used. |
| Firebase Cloud Messaging | No push notifications in v1. |

### Access Pattern

All Firestore operations go through Next.js API routes running on the server. The Firebase Admin SDK, initialized with a service account, is the sole interface to Firestore. No client-side Firebase SDK is initialized for Firestore reads or writes.

```
Browser (Client)
    |
    v
Next.js API Routes (/api/*)
    |
    v
Firebase Admin SDK (Service Account)
    |
    v
Cloud Firestore
```

This architecture ensures:
- No Firestore credentials are exposed to the client
- All writes are validated and sanitized server-side
- Rate limiting is enforced at the API route level
- No direct client reads are possible (security rules deny all client access)

---

## 2. Collections

### 2.1 `leads` -- Primary Lead Collection

The central collection for all captured leads across the website. Every form submission, AI tool usage, chatbot conversion, and exit intent capture creates or updates a lead document.

**Path:** `leads/{leadId}`

**Document ID:** Auto-generated Firestore document ID.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | `string` | Yes | -- | Primary identifier. Validated email address. |
| `name` | `string` | No | `null` | Full name if provided. |
| `company` | `string` | No | `null` | Company name if provided. |
| `phone` | `string` | No | `null` | Phone number in international format (e.g., `+962791234567`). |
| `countryCode` | `string` | No | `null` | ISO country code for the phone number (e.g., `JO`, `AE`, `US`). |
| `whatsapp` | `boolean` | Yes | `false` | Whether the lead opted in to WhatsApp communication. |
| `source` | `string` | Yes | -- | Origin of the lead. Enum: `'idea-lab'`, `'analyzer'`, `'estimate'`, `'roi-calculator'`, `'contact'`, `'exit-intent'`, `'chatbot'`. |
| `locale` | `string` | Yes | `'en'` | Language context when the lead was captured. Enum: `'en'`, `'ar'`. |
| `createdAt` | `Timestamp` | Yes | Server timestamp | When the lead was first created. |
| `updatedAt` | `Timestamp` | Yes | Server timestamp | Last modification time. Updated on every change. |
| `converted` | `boolean` | Yes | `false` | Whether this lead has been marked as a paying customer or qualified prospect. Set manually or via CRM integration. |
| `notes` | `string` | No | `null` | Internal notes. Added by team members or via CRM. |
| `metadata` | `object` | Yes | `{}` | Tracking and attribution metadata (see sub-fields below). |

**`metadata` sub-fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `metadata.referrer` | `string` | No | HTTP referrer URL at time of lead capture. |
| `metadata.utmSource` | `string` | No | UTM source parameter (e.g., `google`, `linkedin`). |
| `metadata.utmMedium` | `string` | No | UTM medium parameter (e.g., `cpc`, `organic`, `social`). |
| `metadata.utmCampaign` | `string` | No | UTM campaign parameter (e.g., `spring2026_ai_tools`). |
| `metadata.userAgent` | `string` | No | Browser user agent string. Useful for debugging and analytics. |
| `metadata.ipCountry` | `string` | No | Country derived from IP address (e.g., `JO`, `AE`). Used for regional analytics. IP address itself is NOT stored (PII minimization). |

**Deduplication logic:** Before creating a new lead, the API route queries for an existing lead with the same `email`. If found, the existing document is updated (`updatedAt`, `source` may be appended to an array if tracking multi-touch, and any newly provided fields are merged). If not found, a new document is created.

---

### 2.2 `ai_submissions` -- AI Tool Usage Records

Stores every AI tool interaction, including the full request and response payloads. This collection is essential for debugging, analytics, and understanding tool usage patterns.

**Path:** `ai_submissions/{submissionId}`

**Document ID:** Auto-generated Firestore document ID.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `tool` | `string` | Yes | -- | Which AI tool was used. Enum: `'idea-lab'`, `'analyzer'`, `'estimate'`, `'roi-calculator'`. |
| `leadId` | `string` | Yes | -- | Reference to the `leads` collection document ID. Links the submission to the lead who initiated it. |
| `request` | `object` | Yes | -- | Full request payload sent to the Gemini API. Structure varies by tool (see sub-schemas below). |
| `response` | `object` | Yes | -- | Full AI response received from Gemini. Stored as-is for auditability. |
| `processingTimeMs` | `number` | Yes | -- | Time in milliseconds from API request initiation to response receipt. Used for performance monitoring. |
| `model` | `string` | Yes | -- | Gemini model identifier used for this request (e.g., `gemini-2.0-flash`, `gemini-2.0-pro`). |
| `locale` | `string` | Yes | `'en'` | Language context. Enum: `'en'`, `'ar'`. |
| `createdAt` | `Timestamp` | Yes | Server timestamp | When the submission was created. |
| `status` | `string` | Yes | -- | Outcome of the AI request. Enum: `'completed'`, `'failed'`, `'timeout'`. |
| `errorMessage` | `string` | No | `null` | Error details if `status` is `'failed'` or `'timeout'`. |

**`request` sub-schema by tool:**

**Idea Lab:**
```
request: {
  background: string       // "entrepreneur", "professional", etc.
  industry: string         // "health", "finance", etc.
  problem: string          // Free-text problem description
}
```

**AI Idea Analyzer:**
```
request: {
  ideaDescription: string  // Free-text idea description
  prefilledFrom?: string   // "idea-lab" if pre-filled from Idea Lab results
}
```

**Get AI Estimate:**
```
request: {
  projectType: string      // "mobile", "web", "ai-ml", "cloud", "full-stack"
  features: string[]       // Array of selected feature IDs
  customFeatures?: string  // Free-text additional features
  timeline: string         // "asap", "standard", "flexible", "not-sure"
  description?: string     // Free-text project description
}
```

**ROI Calculator:**
```
request: {
  currentProcess: string   // "orders", "operations", etc.
  hoursPerWeek: number     // 1-100+
  employeesInvolved: number // 1-50+
  hourlyCost: number       // Average hourly cost
  currency: string         // "USD", "JOD", "AED", "SAR"
  issues: string[]         // Array of selected issue IDs
  canServeMore: {
    answer: string         // "yes", "no", "not-sure"
    estimatePercent?: number
  }
  canRetainMore: {
    answer: string         // "yes", "no", "not-sure"
    estimatePercent?: number
  }
}
```

---

### 2.3 `chatbot_conversations` -- Avi Chatbot Sessions

Stores complete conversation histories for the Avi chatbot. Each document represents a single browser session's conversation.

**Path:** `chatbot_conversations/{sessionId}`

**Document ID:** Client-generated UUID (created when the chatbot session starts, stored in `sessionStorage`).

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `messages` | `array` | Yes | `[]` | Array of message objects (see sub-schema below). |
| `startPage` | `string` | Yes | -- | URL path where the chatbot conversation was initiated (e.g., `/en/solutions`). |
| `locale` | `string` | Yes | `'en'` | Language context when the conversation started. Enum: `'en'`, `'ar'`. |
| `createdAt` | `Timestamp` | Yes | Server timestamp | When the conversation session was created (first message). |
| `updatedAt` | `Timestamp` | Yes | Server timestamp | When the last message was added. |
| `messageCount` | `number` | Yes | `0` | Total number of messages in the conversation. Maintained as a denormalized count for query efficiency. |
| `convertedToLead` | `boolean` | Yes | `false` | Whether this conversation resulted in a lead capture (user provided email or was routed to a form). |
| `leadId` | `string` | No | `null` | Reference to the `leads` collection if the conversation converted. |

**`messages` array item sub-schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | `string` | Yes | Who sent this message. Enum: `'user'`, `'assistant'`. |
| `content` | `string` | Yes | Message text content. Markdown formatting may be present in assistant messages. |
| `timestamp` | `Timestamp` | Yes | When this individual message was sent. |

**Size considerations:** Firestore documents have a 1MB limit. With an average message size of 200 bytes, this supports approximately 5,000 messages per conversation. Given the rate limit of 30 messages per session (defined in the chatbot spec), this is well within bounds.

---

### 2.4 `contact_submissions` -- Contact Form Submissions

Stores submissions from the Contact page form. Each submission is linked to a lead and carries the full form payload plus a workflow status.

**Path:** `contact_submissions/{submissionId}`

**Document ID:** Auto-generated Firestore document ID.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `leadId` | `string` | Yes | -- | Reference to the `leads` collection document ID. |
| `name` | `string` | Yes | -- | Full name from the form. |
| `email` | `string` | Yes | -- | Email address from the form. |
| `company` | `string` | No | `null` | Company name (optional field). |
| `phone` | `string` | No | `null` | Phone number in international format (optional field). |
| `countryCode` | `string` | Yes | `'JO'` | ISO country code for the phone number. Defaults to Jordan. |
| `topic` | `string` | Yes | -- | Selected topic. Enum: `'general-inquiry'`, `'project-discussion'`, `'ready-made-solution'`, `'partnership'`, `'support'`, `'other'`. |
| `message` | `string` | Yes | -- | Free-text message content. Minimum 10 characters (validated server-side). |
| `whatsapp` | `boolean` | Yes | `false` | Whether the user opted in to WhatsApp follow-up. |
| `status` | `string` | Yes | `'new'` | Workflow status. Enum: `'new'`, `'responded'`, `'closed'`. |
| `createdAt` | `Timestamp` | Yes | Server timestamp | When the form was submitted. |

---

### 2.5 `exit_intent_captures` -- Exit Intent Popup Conversions

Stores successful conversions from the exit intent popup system. Only created when a visitor actually submits the popup form (not on popup impression -- impressions are tracked via Google Analytics events).

**Path:** `exit_intent_captures/{captureId}`

**Document ID:** Auto-generated Firestore document ID.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `leadId` | `string` | Yes | -- | Reference to the `leads` collection document ID. |
| `variant` | `string` | Yes | -- | Which exit intent variant was displayed. Enum: `'A'`, `'B'`, `'C'`, `'D'`, `'E'`. |
| `email` | `string` | Yes | -- | Email address captured. |
| `projectType` | `string` | No | `null` | Only populated for Variant C (Quick Estimate). Selected project type from the dropdown. |
| `page` | `string` | Yes | -- | URL path where the exit intent was triggered (e.g., `/en/solutions`). |
| `createdAt` | `Timestamp` | Yes | Server timestamp | When the capture occurred. |

**Variant reference:**

| Variant | Name | Form Fields |
|---------|------|-------------|
| A | Lead Magnet Offer | Email only |
| B | Consultation Offer | No form (CTA links to Calendly) |
| C | Quick Estimate | Project type dropdown + Email |
| D | WhatsApp Connect | No form (CTA links to WhatsApp) |
| E | Chatbot Activation | No form (CTA opens chatbot) |

Note: Variants B, D, and E do not capture form data directly. For Variant B, the capture document records that the user clicked through to Calendly. For Variant D, it records the WhatsApp link click. For Variant E, it records the chatbot activation. The `email` field may be empty for these variants unless the user had previously been identified.

---

## 3. Security Rules

All Firestore access is server-side only via the Firebase Admin SDK. The security rules below deny ALL client-side reads and writes. This is the strictest possible configuration.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // =============================================================
    // GLOBAL DENY RULE
    // =============================================================
    // All client-side access is denied. No exceptions.
    // The Firebase Admin SDK bypasses these rules entirely
    // (Admin SDK uses service account credentials, not client auth).
    //
    // This means:
    // - No browser-based reads (get, list)
    // - No browser-based writes (create, update, delete)
    // - Only server-side code using Admin SDK can access data
    // =============================================================

    // Deny access to all documents at any path
    match /{document=**} {
      allow read: if false;
      allow write: if false;
    }

    // ---------------------------------------------------------
    // Collection-specific rules (all deny, for documentation)
    // ---------------------------------------------------------

    // Leads collection
    match /leads/{leadId} {
      allow read: if false;
      allow write: if false;
    }

    // AI submissions collection
    match /ai_submissions/{submissionId} {
      allow read: if false;
      allow write: if false;
    }

    // Chatbot conversations collection
    match /chatbot_conversations/{sessionId} {
      allow read: if false;
      allow write: if false;
    }

    // Contact form submissions collection
    match /contact_submissions/{submissionId} {
      allow read: if false;
      allow write: if false;
    }

    // Exit intent captures collection
    match /exit_intent_captures/{captureId} {
      allow read: if false;
      allow write: if false;
    }
  }
}
```

**Why deny everything?** Since the website has no user accounts and no client-side Firebase SDK initialization for Firestore, there is zero legitimate reason for any client-side access. The Firebase Admin SDK (used in Next.js API routes) bypasses security rules entirely because it authenticates with a service account. This is the most secure configuration possible.

**Deployment:** These rules should be deployed via the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 4. Composite Indexes

Firestore automatically creates single-field indexes. Composite indexes must be manually defined for queries that filter or order on multiple fields.

### Required Composite Indexes

| # | Collection | Fields | Query Use Case |
|---|------------|--------|----------------|
| 1 | `leads` | `source` (ASC) + `createdAt` (DESC) | Dashboard: "Show all leads from the AI Estimate tool, newest first." |
| 2 | `leads` | `converted` (ASC) + `createdAt` (DESC) | Dashboard: "Show all unconverted leads, newest first." |
| 3 | `leads` | `source` (ASC) + `converted` (ASC) + `createdAt` (DESC) | Dashboard: "Show unconverted leads from a specific source, newest first." |
| 4 | `leads` | `locale` (ASC) + `createdAt` (DESC) | Analytics: "Show all Arabic leads, newest first." |
| 5 | `leads` | `metadata.utmSource` (ASC) + `createdAt` (DESC) | Attribution: "Show leads from a specific UTM source, newest first." |
| 6 | `ai_submissions` | `tool` (ASC) + `createdAt` (DESC) | Analytics: "Show all Idea Lab submissions, newest first." |
| 7 | `ai_submissions` | `tool` (ASC) + `status` (ASC) + `createdAt` (DESC) | Debugging: "Show all failed ROI Calculator submissions, newest first." |
| 8 | `ai_submissions` | `leadId` (ASC) + `createdAt` (DESC) | Lead detail: "Show all AI submissions for a specific lead." |
| 9 | `chatbot_conversations` | `convertedToLead` (ASC) + `createdAt` (DESC) | Analytics: "Show all chatbot conversations that converted." |
| 10 | `chatbot_conversations` | `locale` (ASC) + `createdAt` (DESC) | Analytics: "Show Arabic chatbot conversations." |
| 11 | `contact_submissions` | `status` (ASC) + `createdAt` (DESC) | Inbox: "Show all new contact submissions, newest first." |
| 12 | `exit_intent_captures` | `variant` (ASC) + `createdAt` (DESC) | A/B testing: "Show all Variant A captures, newest first." |

### Firestore Index Definition (firestore.indexes.json)

```json
{
  "indexes": [
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "source", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "converted", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "source", "order": "ASCENDING" },
        { "fieldPath": "converted", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "locale", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leads",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "metadata.utmSource", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ai_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tool", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ai_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tool", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ai_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "leadId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "chatbot_conversations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "convertedToLead", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "chatbot_conversations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "locale", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "contact_submissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "exit_intent_captures",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "variant", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

**Deployment:**
```bash
firebase deploy --only firestore:indexes
```

---

## 5. Data Retention Policy

Different collections have different retention requirements based on business value, storage costs, and privacy considerations.

| Collection | Retention Period | Action After Period | Rationale |
|------------|-----------------|---------------------|-----------|
| `leads` | Indefinite | None (kept permanently) | Core business data. Leads are the primary asset of the website. Required for long-term sales pipeline and re-engagement campaigns. |
| `contact_submissions` | Indefinite | None (kept permanently) | Business correspondence. May be needed for legal or contractual reference. |
| `ai_submissions` | 90 days | Archive to cold storage, then delete from Firestore | Large documents (full request/response payloads). After 90 days, the operational value diminishes. Aggregate analytics are preserved separately. |
| `chatbot_conversations` | 30 days | Delete from Firestore | Conversation data has short operational value. Key insights (conversion, common questions) are extracted into analytics before deletion. |
| `exit_intent_captures` | Indefinite | None (kept permanently) | Small documents. Needed for long-term A/B test analysis and conversion tracking. |

### Archival Process (ai_submissions)

After 90 days, `ai_submissions` documents are:
1. Exported to a JSON file in Google Cloud Storage (cold storage bucket)
2. The export includes all fields for audit purposes
3. The original Firestore document is deleted
4. The archival job runs weekly via a Cloud Scheduler trigger calling a Cloud Function

### Deletion Process (chatbot_conversations)

After 30 days, `chatbot_conversations` documents are:
1. Checked for `convertedToLead === true` -- if converted, key metadata (session ID, lead ID, message count, start page) is logged to an analytics summary before deletion
2. The full conversation document is permanently deleted from Firestore
3. The cleanup job runs daily via a Cloud Scheduler trigger calling a Cloud Function

### Implementation

Retention enforcement is handled by scheduled Cloud Functions (Firebase Cloud Functions or Google Cloud Functions):

```
// Pseudo-code for retention cleanup
exports.cleanupAiSubmissions = onSchedule("every monday 02:00", async () => {
  const cutoff = Timestamp.fromDate(subtractDays(new Date(), 90));
  const snapshot = await db.collection("ai_submissions")
    .where("createdAt", "<", cutoff)
    .limit(500)  // Process in batches
    .get();

  // Archive to Cloud Storage, then delete from Firestore
});

exports.cleanupChatConversations = onSchedule("every day 03:00", async () => {
  const cutoff = Timestamp.fromDate(subtractDays(new Date(), 30));
  const snapshot = await db.collection("chatbot_conversations")
    .where("createdAt", "<", cutoff)
    .limit(500)
    .get();

  // Extract analytics summary if converted, then delete
});
```

---

## 6. PII Handling & GDPR Compliance

### PII Fields Inventory

| Collection | PII Fields | Sensitivity |
|------------|-----------|-------------|
| `leads` | `email`, `name`, `phone`, `company` | High |
| `contact_submissions` | `email`, `name`, `phone`, `company`, `message` | High |
| `chatbot_conversations` | `messages[].content` (may contain PII shared by user) | Medium |
| `ai_submissions` | `request` (may contain PII in free-text fields) | Medium |
| `exit_intent_captures` | `email` | High |

### Encryption

- **At rest:** Firestore encrypts all data at rest by default using Google-managed encryption keys (AES-256). No additional configuration needed.
- **In transit:** All connections to Firestore use TLS 1.2+. The Firebase Admin SDK enforces HTTPS.
- **Application-level encryption:** Not implemented for v1. If required by future compliance needs, sensitive fields (phone, name) can be encrypted at the application layer before writing to Firestore.

### Access Control

- **Firebase Admin SDK:** Accessed only via a service account. The service account JSON key is stored as an environment variable (not committed to version control).
- **Team access:** Firestore Console access is restricted to the project owner and authorized developers via Google Cloud IAM roles.
- **Audit logging:** Google Cloud Audit Logs are enabled for all Firestore data access operations. This provides a record of who accessed what data and when.

### GDPR Right to Erasure (Right to be Forgotten)

When a data subject requests deletion of their personal data:

1. **Identify all documents:** Query across all collections for the email address:
   - `leads` where `email == requestedEmail`
   - `contact_submissions` where `email == requestedEmail`
   - `exit_intent_captures` where `email == requestedEmail`
   - `ai_submissions` where `leadId` matches the lead document found above
   - `chatbot_conversations` where `leadId` matches the lead document found above

2. **Delete or anonymize:**
   - Delete the `leads` document
   - Delete all `contact_submissions` documents for this lead
   - Delete all `exit_intent_captures` documents for this email
   - Delete or anonymize `ai_submissions` (replace PII fields with `[REDACTED]`, keep anonymized data for aggregate analytics)
   - Delete `chatbot_conversations` linked to this lead

3. **Confirm deletion:** Send confirmation email to the requester within 30 days (GDPR requirement).

4. **Implementation:** A dedicated API endpoint or admin tool handles erasure requests:
   ```
   POST /api/admin/gdpr-erasure
   Body: { email: "user@example.com", requestId: "..." }
   ```

### GDPR Right to Access (Data Portability)

When a data subject requests a copy of their data:

1. Query all collections for the email address (same as erasure)
2. Compile all data into a structured JSON export
3. Deliver via secure download link sent to the requestor's email
4. Response time: within 30 days

### Data Minimization

- IP addresses are NOT stored. Only the derived country code (`metadata.ipCountry`) is stored.
- User agent strings are stored for debugging but can be omitted in future versions.
- Chatbot conversations are deleted after 30 days.
- AI submission payloads are archived and deleted after 90 days.

---

## 7. Backup & Recovery

### Firestore Automated Backups

- **Frequency:** Daily automated exports via Google Cloud Scheduler
- **Destination:** Google Cloud Storage bucket (`gs://aviniti-firestore-backups/`)
- **Retention:** 30 days of daily backups, then weekly backups for 90 days
- **Format:** Firestore native export format (Protocol Buffers)

### Recovery Procedure

In the event of data loss or corruption:

1. Identify the most recent clean backup
2. Use `gcloud firestore import` to restore from the Cloud Storage backup
3. Import can target specific collections if only partial restoration is needed

```bash
gcloud firestore import gs://aviniti-firestore-backups/2026-02-06/
```

### Backup Monitoring

- Cloud Monitoring alerts are configured for backup job failures
- Alert sent to the project owner email if a daily backup does not complete within the expected window

---

**End of Firebase Schema & Data Architecture Specification**
