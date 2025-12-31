import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  PersonalDetails, 
  AppDescription, 
  Feature, 
  DetailedReport, 
  CostBreakdown, 
  TimelinePhase 
} from '@/types/estimate';
import { reportConversion } from '@/lib/gtag';
import { reportMetaLeadConversion } from '@/lib/meta';

export const createUserDocument = async (userInfo: PersonalDetails): Promise<string | null> => {
  console.log('🔍 DEBUG: createUserDocument called with:', userInfo);
  try {
    if (!db) {
      console.warn('⚠️ Firebase not initialized, skipping user document creation');
      return null;
    }
    
    // Use email as the document ID to ensure uniqueness and consistency
    const docRef = doc(db, 'users', userInfo.emailAddress);
    console.log('🔍 DEBUG: Using document ID (email):', docRef.id);
    
    const docData = {
      ...userInfo,
      createdAt: serverTimestamp(),
      status: 'pending-description',
      updatedAt: serverTimestamp()
    };
    
    console.log('🔍 DEBUG: Document data to save:', docData);
    // Use merge: true to prevent overwriting existing data if user returns
    await setDoc(docRef, docData, { merge: true });
    
    console.log("✅ User document created with ID: ", docRef.id);
    try {
      reportConversion();
      reportMetaLeadConversion();
    } catch (e) {
      console.warn('Conversion reporting failed (non-blocking):', e);
    }
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating user document: ", error);
    return null;
  }
};

export const updateUserAppDescription = async (
  userDocumentId: string, 
  appData: { description: string; platforms: string[]; keywords: string[] }
): Promise<boolean> => {
  console.log('🔍 DEBUG: updateUserAppDescription called');

  if (!userDocumentId) {
    console.error("❌ No user document ID found to update.");
    return false;
  }

  if (!db) {
    console.warn('⚠️ Firebase not initialized, skipping user document update');
    return false;
  }

  try {
    const userDocRef = doc(db, 'users', userDocumentId);
    const updateData = {
      appDescription: appData.description,
      selectedPlatforms: appData.platforms,
      detectedKeywords: appData.keywords, 
      status: 'pending-features',
      updatedAt: serverTimestamp()
    };

    await updateDoc(userDocRef, updateData);
    console.log("✅ User document successfully updated with app description.");
    return true;
  } catch (error) {
    console.error("❌ Error updating user document: ", error);
    return false;
  }
};

export const updateUserFeaturesAndReport = async (
  userDocumentId: string,
  data: {
    selectedFeatures: Feature[];
    basicReport: DetailedReport;
    totalCost: string;
    totalTime: string;
    costBreakdown: CostBreakdown;
    timelinePhases: TimelinePhase[];
  }
): Promise<void> => {
  if (!userDocumentId || !db) return;

  try {
    const userDocRef = doc(db, 'users', userDocumentId);
    await updateDoc(userDocRef, {
      ...data,
      status: 'report-generated',
      updatedAt: serverTimestamp()
    });
    console.log('User document updated with feature selection and complete report data');
  } catch (error) {
    console.error('Error updating user document with features:', error);
    throw error;
  }
};

export const uploadReportPdf = async (
  pdfBlob: Blob, 
  email: string, 
  userDocumentId?: string
): Promise<{ reportId: string; downloadURL: string } | null> => {
  try {
    if (!db || !storage) {
      throw new Error('Firebase is not initialized');
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}.pdf`;
    
    // Create a unique ID for this report using timestamp and email
    const reportId = `${email.replace(/[^a-zA-Z0-9]/g, '')}_${timestamp}`;
    
    // Create storage reference
    // Using email as folder is okay if we sanitised it, but let's check if we have userId
    // Ideally we should use the userDocumentId if available
    const storagePath = userDocumentId 
      ? `reports/${userDocumentId}/${fileName}`
      : `reports/${reportId}/${fileName}`; // Fallback to reportId based path if no user doc

    const storageRef = ref(storage, storagePath);
    
    // Upload the file
    console.log(`Uploading PDF to ${storagePath}...`);
    await uploadBytes(storageRef, pdfBlob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('PDF uploaded successfully, URL:', downloadURL);
    
    // Update user document with the report URL if we have the ID
    if (userDocumentId) {
      const userDocRef = doc(db, 'users', userDocumentId);
      await updateDoc(userDocRef, {
        reportURL: downloadURL,
        reportId: reportId,
        updatedAt: serverTimestamp()
      });
    }
    
    return { reportId, downloadURL };
  } catch (error) {
    console.error('Error uploading PDF and creating report record:', error);
    throw error;
  }
};
