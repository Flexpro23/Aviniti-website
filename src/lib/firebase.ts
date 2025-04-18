'use client';

import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGSNtARRddytr_ktUSqVOdgzkmqR0OwuE",
  authDomain: "aviniti-website.firebaseapp.com",
  databaseURL: "https://aviniti-website-default-rtdb.firebaseio.com",
  projectId: "aviniti-website",
  storageBucket: "aviniti-website.firebasestorage.app",
  messagingSenderId: "402215685347",
  appId: "1:402215685347:web:25b0591b34fde886cb89d6",
  measurementId: "G-ZYXBPXPJDN"
};

console.log('Initializing Firebase with configuration', { ...firebaseConfig, apiKey: '[REDACTED]' });

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