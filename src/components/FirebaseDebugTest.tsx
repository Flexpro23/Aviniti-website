'use client';

import { useState } from 'react';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FirebaseDebugTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      addResult('🧪 Starting Firebase test...');

      if (!db) {
        addResult('❌ Firebase database is not initialized');
        return;
      }

      // Test 1: Create document
      addResult('📝 Step 1: Creating test document...');
      const docRef = doc(collection(db, 'users'));
      const testData = {
        fullName: 'Test User',
        emailAddress: 'test@example.com',
        phoneNumber: '+1234567890',
        companyName: 'Test Company',
        createdAt: serverTimestamp(),
        status: 'pending-description'
      };

      await setDoc(docRef, testData);
      addResult(`✅ Document created with ID: ${docRef.id}`);

      // Test 2: Update document
      addResult('📝 Step 2: Updating document with app description...');
      const updateData = {
        appDescription: 'Test app description for debugging',
        selectedPlatforms: ['ios', 'android'],
        detectedKeywords: ['test', 'debug'],
        status: 'pending-features',
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      addResult('✅ Document updated successfully');

      addResult('🎉 All tests passed! Firebase is working correctly.');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addResult(`❌ Error: ${errorMessage}`);
      console.error('Firebase test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Firebase Debug Test</h3>
      
      <button
        onClick={runTest}
        disabled={isRunning}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isRunning ? 'Running Test...' : 'Run Firebase Test'}
      </button>

      <div className="mt-4 bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
        <h4 className="font-semibold mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-500">Click "Run Firebase Test" to start</p>
        ) : (
          <ul className="space-y-1 text-sm font-mono">
            {testResults.map((result, index) => (
              <li key={index} className="whitespace-pre-wrap">
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>What this test does:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Creates a new document in the 'users' collection (Step 1 simulation)</li>
          <li>Updates the document with app description data (Step 2 simulation)</li>
          <li>Verifies Firebase operations are working correctly</li>
        </ul>
      </div>
    </div>
  );
}