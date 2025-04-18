// Simple script to test Firebase connection
// IMPORTANT: Must be run with proper environment variables

// Load environment variables if running locally
require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');

async function testFirebase() {
  console.log('Starting Firebase connection test...');
  
  // Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
  
  // Verify environment variables are set
  const missingVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.error(`Error: Missing environment variables: ${missingVars.join(', ')}`);
    console.error('Please set them in your .env.local file or environment before running this script.');
    process.exit(1);
  }
  
  // Log config for verification (without sensitive info)
  console.log('Using Firebase config with project ID:', firebaseConfig.projectId);
  
  try {
    // Initialize Firebase
    console.log('Initializing Firebase app...');
    const app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
    
    // Test Firestore
    console.log('\nTesting Firestore connection...');
    const db = getFirestore(app);
    
    // Add a test document
    const testData = {
      testField: 'This is a test',
      timestamp: new Date().toISOString()
    };
    
    console.log('Adding test document...');
    const docRef = await addDoc(collection(db, 'test_collection'), testData);
    console.log('Test document added with ID:', docRef.id);
    
    // List documents to verify
    console.log('Retrieving documents from collection...');
    const querySnapshot = await getDocs(collection(db, 'test_collection'));
    console.log('Documents in collection:');
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
    
    // Test Storage
    console.log('\nTesting Firebase Storage connection...');
    const storage = getStorage(app);
    
    // Upload a test string
    const storageRef = ref(storage, 'test_files/test.txt');
    console.log('Uploading test file...');
    await uploadString(storageRef, 'Hello, World!');
    console.log('Test file uploaded successfully');
    
    // Get download URL
    console.log('Getting download URL...');
    try {
      const url = await getDownloadURL(storageRef);
      console.log('File download URL:', url);
    } catch (urlError) {
      console.error('Error getting download URL:', urlError);
    }
    
    console.log('\nFirebase connection test completed successfully!');
  } catch (error) {
    console.error('Error during Firebase test:', error);
  }
}

testFirebase(); 