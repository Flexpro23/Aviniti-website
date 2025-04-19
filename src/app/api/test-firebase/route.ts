import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '../../../lib/firebase-admin';
// Client-side imports are not used in this GET handler, but might be in others
// import { db, storage } from '../../../lib/firebase';

// Define interfaces for the result structures
interface TestResultSuccess {
  status: 'success';
  [key: string]: any; // Allow other success properties like documentId or fileName
}

interface TestResultError {
  status: 'error';
  message: string;
  stack?: string;
}

type TestResult = TestResultSuccess | TestResultError | null;

interface TestResultsStructure {
  clientSide: {
    db: TestResult;
    storage: TestResult;
  };
  serverSide: {
    db: TestResult;
    storage: TestResult;
  };
  envVariables: {
    [key: string]: string; // Keep this simple as it only checks Set/Not Set
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Initialize with the explicit type and null values
  const testResults: TestResultsStructure = {
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
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "Set" : "Not set", // Should likely be ADMIN_CLIENT_EMAIL if used for admin
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
        // This assignment is now valid according to TestResult type
        testResults.serverSide.db = {
          status: 'success',
          documentId: snapshot.id
        };
        
        await adminDb.collection('_test').doc(snapshot.id).delete();
      } else {
         // Handle case where snapshot or snapshot.id is unexpectedly missing
         testResults.serverSide.db = {
           status: 'error',
           message: 'Firestore test document creation succeeded but returned no ID.'
         };
      }
    } else {
      // This assignment is now valid
      testResults.serverSide.db = {
        status: 'error',
        message: 'adminDb is not initialized'
      };
    }
  } catch (error) {
    // This assignment is now valid
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
      
      await file.save('Test content', { contentType: 'text/plain' });
      
      const [exists] = await file.exists();
      
      if (exists) {
        // This assignment is now valid
        testResults.serverSide.storage = {
          status: 'success',
          fileName: testFileName
        };
        
        await file.delete();
      } else {
        // Handle case where file unexpectedly doesn't exist after save
        testResults.serverSide.storage = {
          status: 'error',
          message: 'Storage test file upload succeeded but file not found immediately after.'
        };
      }
    } else {
      // This assignment is now valid
      testResults.serverSide.storage = {
        status: 'error',
        message: 'adminStorage is not initialized'
      };
    }
  } catch (error) {
    // This assignment is now valid
    testResults.serverSide.storage = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    };
  }

  return NextResponse.json(testResults);
} 