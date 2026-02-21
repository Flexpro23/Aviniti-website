// Client-side Firebase SDK initialization
// This module is safe to import in client components only.
// It must NEVER be imported in Server Components or API routes.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Get (or lazily initialize) the Firebase client app.
 * Safe to call multiple times — returns the same instance.
 */
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}

/**
 * Get Firebase Analytics instance.
 * Returns null when:
 *  - Running on the server (SSR)
 *  - Browser does not support the Analytics SDK (e.g. blocked by privacy settings)
 *  - measurementId env var is not set
 *
 * Always await this before calling logEvent / setUserProperties.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  // Guard: Analytics is browser-only
  if (typeof window === 'undefined') return null;

  // Guard: measurementId must be configured
  if (!firebaseConfig.measurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Firebase Analytics] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is not set. Analytics disabled.');
    }
    return null;
  }

  const supported = await isSupported();
  if (!supported) return null;

  const app = getFirebaseApp();
  return getAnalytics(app);
}
