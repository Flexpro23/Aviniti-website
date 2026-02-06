// Firebase Client SDK initialization for browser-side operations
// Note: For this project, Firestore access is server-only via Admin SDK.
// This client is initialized for potential future features (Analytics, etc.)

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

/**
 * Initialize Firebase client SDK
 * Lazy initialization pattern - only initializes once
 */
function initializeFirebase() {
  if (getApps().length > 0) {
    app = getApps()[0];
    db = getFirestore(app);
    return { app, db };
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // Validate all required environment variables are present
  const missingVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing Firebase client configuration: ${missingVars.join(', ')}`
    );
  }

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  return { app, db };
}

/**
 * Get Firebase app instance
 * Initializes on first call
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    initializeFirebase();
  }
  return app!;
}

/**
 * Get Firestore instance
 * Initializes on first call
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    initializeFirebase();
  }
  return db!;
}

// Export for direct access (will be initialized on first use)
export { app, db };
