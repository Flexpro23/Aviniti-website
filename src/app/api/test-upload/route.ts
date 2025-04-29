import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

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

// Initialize Firebase for server-side
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function POST() {
  try {
    // Test data
    const testData = {
      content: 'Test PDF content',
      timestamp: new Date().toISOString()
    };

    // Test Storage upload
    const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
    const storageRef = ref(storage, `test/test-${Date.now()}.txt`);
    await uploadString(storageRef, 'Test content');
    const downloadURL = await getDownloadURL(storageRef);

    // Test Firestore document creation
    const reportsRef = collection(db!, 'reports');
    const docRef = await addDoc(reportsRef, {
      ...testData,
      fileUrl: downloadURL,
      createdAt: new Date().toISOString(),
      status: 'test'
    });

    return NextResponse.json({
      success: true,
      message: 'Test successful',
      docId: docRef.id,
      fileUrl: downloadURL
    });
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 