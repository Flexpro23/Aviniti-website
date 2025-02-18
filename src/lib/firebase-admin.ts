import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  try {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aviniti-website.firebasestorage.app"
    });

    console.log('Firebase Admin initialized successfully with storage bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aviniti-website.firebasestorage.app");
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

const adminDb = getFirestore();
const adminStorage = getStorage();

export { adminDb, adminStorage }; 