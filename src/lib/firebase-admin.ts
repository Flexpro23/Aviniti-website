import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import admin from 'firebase-admin';

// Initialize Firebase Admin
const apps = getApps();

// Properly typed admin services
let adminDb: admin.firestore.Firestore | undefined = undefined;
let adminStorage: admin.storage.Storage | undefined = undefined;

// Service account configuration
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!apps.length) {
  try {
    const app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "aviniti-website.firebasestorage.app"
    });
    
    // Initialize services
    adminDb = getFirestore(app);
    adminStorage = getStorage(app);
    
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    // Throw error to prevent undefined behavior
    throw new Error('Firebase Admin initialization failed');
  }
}

// Export initialized services
export { adminDb, adminStorage };

// Helper function to get Firestore admin instance
export function getFirestoreAdmin(): Firestore {
  if (!adminDb) {
    if (!apps.length) {
      const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "aviniti-website.firebasestorage.app"
      });
      adminDb = getFirestore(app);
    } else {
      adminDb = getFirestore();
    }
  }
  return adminDb;
}

// Helper function to get Storage admin instance
export function getStorageAdmin(): Storage {
  if (!adminStorage) {
    if (!apps.length) {
      const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "aviniti-website.firebasestorage.app"
      });
      adminStorage = getStorage(app);
    } else {
      adminStorage = getStorage();
    }
  }
  return adminStorage;
}

// Initialize Firebase Admin SDK if not already initialized
export async function initializeFirebaseAdmin() {
  try {
    if (!admin.apps.length) {
      // Get environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'aviniti-website.firebasestorage.app';

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
    }

    if (!adminDb) {
      adminDb = admin.firestore();
    }

    if (!adminStorage) {
      adminStorage = admin.storage();
    }
  } catch (error) {
    console.error('Error initializing Firebase admin:', error);
    throw error;
  }
} 