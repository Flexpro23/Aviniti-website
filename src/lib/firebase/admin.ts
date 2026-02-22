// Server-only Firebase Admin SDK initialization
// IMPORTANT: Never import this file in client components

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Ensure this file is only used server-side
if (typeof window !== 'undefined') {
  throw new Error(
    'Firebase Admin SDK can only be used on the server. Do not import this file in client components.'
  );
}

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

/**
 * Initialize Firebase Admin SDK
 * Lazy initialization pattern - only initializes once
 */
function initializeFirebaseAdmin() {
  // Return existing app if already initialized
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
    try { adminDb.settings({ ignoreUndefinedProperties: true }); } catch { /* already set */ }
    return { adminApp, adminDb };
  }

  // Get environment variables
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  // Validate required environment variables
  if (!projectId || !clientEmail || !privateKey) {
    const missing = [];
    if (!projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID');
    if (!clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
    if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');

    throw new Error(
      `Missing Firebase Admin configuration: ${missing.join(', ')}`
    );
  }

  // Parse private key (handle escaped newlines from environment variables)
  // Environment variables often have \\n instead of actual newline characters
  const parsedPrivateKey = privateKey.replace(/\\n/g, '\n');

  // Initialize admin app with service account credentials
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: parsedPrivateKey,
    }),
    projectId,
  });

  adminDb = getFirestore(adminApp);
  adminDb.settings({ ignoreUndefinedProperties: true });

  return { adminApp, adminDb };
}

/**
 * Get Firebase Admin app instance
 * Initializes on first call
 */
export function getAdminApp(): App {
  if (!adminApp) {
    initializeFirebaseAdmin();
  }
  return adminApp!;
}

/**
 * Get Firestore Admin instance
 * Initializes on first call
 */
export function getAdminDb(): Firestore {
  if (!adminDb) {
    initializeFirebaseAdmin();
  }
  return adminDb!;
}

// Export for direct access (will be initialized on first use)
export { adminApp, adminDb };
