'use client';

import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://aviniti-website-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Initializing Firebase with configuration', { 
  ...Object.fromEntries(
    Object.entries(firebaseConfig).filter(([key]) => key !== 'apiKey')
  ), 
  apiKey: '[REDACTED]' 
});

// Initialize Firebase services
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
  
  // Initialize Storage
  storage = getStorage(app);
  console.log('Storage initialized successfully');
  
  // Initialize Analytics if supported
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.log('Firebase Analytics not supported in this environment');
    }
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { db, storage, analytics }; 