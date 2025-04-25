import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Set runtime config for Next.js
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// In-memory cache
const cache = new Map();

// Firebase initialization
let firebaseApp: admin.app.App | undefined;
let firestore: admin.firestore.Firestore | undefined;
let storage: admin.storage.Storage | undefined;

// Initialize Firebase
const initializeFirebase = async () => {
  if (admin.apps.length === 0) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });

      firestore = admin.firestore();
      storage = admin.storage();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  } else {
    firestore = admin.firestore();
    storage = admin.storage();
  }
};

// Simple GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    await initializeFirebase();
    
    if (!firestore) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }
    
    const userId = params.userId;
    
    // Check cache first
    if (cache.has(userId)) {
      return NextResponse.json(cache.get(userId));
    }
    
    // Get data from Firestore
    const reportDoc = await firestore.collection('reports').doc(userId).get();
    
    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    
    const data = reportDoc.data();
    cache.set(userId, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Simple POST handler
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    await initializeFirebase();
    
    if (!firestore || !storage) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }
    
    const userId = params.userId;
    const body = await request.json();
    
    // Simple validation
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    // For now, just return a success response
    // We'll implement the actual PDF generation after the build succeeds
    return NextResponse.json({ 
      success: true,
      message: 'PDF generation endpoint will be implemented after successful build',
      userId
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 