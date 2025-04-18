// Simple script to test Firebase connection
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
const { getStorage, ref, uploadString, getDownloadURL } = require('firebase/storage');

async function testFirebase() {
  console.log('Starting Firebase connection test...');
  
  // Firebase configuration with direct values
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