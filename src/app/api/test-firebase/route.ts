import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '../../../lib/firebase-admin';
import { db, storage } from '../../../lib/firebase';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const testResults = {
    clientSide: {
      db: null,
      storage: null
    },
    serverSide: {
      db: null,
      storage: null
    },
    envVariables: {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "Set" : "Not set",
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "Set" : "Not set",
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "Set" : "Not set"
    }
  };

  // Test server-side Firestore
  try {
    if (adminDb) {
      const snapshot = await adminDb.collection('_test').add({
        timestamp: new Date().toISOString(),
        message: 'Test data'
      });
      
      if (snapshot && snapshot.id) {
        testResults.serverSide.db = {
          status: 'success',
          documentId: snapshot.id
        };
        
        // Clean up test document
        await adminDb.collection('_test').doc(snapshot.id).delete();
      }
    } else {
      testResults.serverSide.db = {
        status: 'error',
        message: 'adminDb is not initialized'
      };
    }
  } catch (error) {
    testResults.serverSide.db = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
  }

  // Test server-side Storage
  try {
    if (adminStorage) {
      const bucket = adminStorage.bucket();
      const testFileName = `test/test-${Date.now()}.txt`;
      const file = bucket.file(testFileName);
      
      await file.save('Test content', {
        contentType: 'text/plain',
      });
      
      const [exists] = await file.exists();
      
      if (exists) {
        testResults.serverSide.storage = {
          status: 'success',
          fileName: testFileName
        };
        
        // Clean up test file
        await file.delete();
      }
    } else {
      testResults.serverSide.storage = {
        status: 'error',
        message: 'adminStorage is not initialized'
      };
    }
  } catch (error) {
    testResults.serverSide.storage = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
  }

  return NextResponse.json(testResults);
} 