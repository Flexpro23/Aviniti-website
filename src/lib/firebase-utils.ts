import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface PersonalDetails {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName?: string;
}

export interface ProjectAnswers {
  problem: string[];
  targetAudience: string[];
  keyFeatures: string[];
  competitors: string;
  platforms: string[];
  integrations: string[];
}

export interface ProjectDetails {
  description: string;
  answers: ProjectAnswers;
}

export interface Feature {
  name: string;
  description: string;
}

export interface SelectedFeatures {
  core: string[];
  suggested: Feature[];
}

export interface UserData {
  personalDetails: PersonalDetails;
  projectDetails?: ProjectDetails;
  selectedFeatures?: SelectedFeatures;
  reportURL?: string;
  status: 'pending' | 'description_submitted' | 'features_selected' | 'report_generated';
  createdAt: string;
  updatedAt: string;
}

export async function createUserDocument(userId: string, personalDetails: PersonalDetails): Promise<void> {
  try {
    const userData: UserData = {
      personalDetails,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateProjectDetails(
  userId: string,
  projectDetails: ProjectDetails
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      projectDetails,
      status: 'description_submitted',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating project details:', error);
    throw error;
  }
}

export async function updateSelectedFeatures(
  userId: string,
  selectedFeatures: SelectedFeatures
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      selectedFeatures,
      status: 'features_selected',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating selected features:', error);
    throw error;
  }
}

export async function uploadReport(userId: string, reportBlob: Blob): Promise<string> {
  try {
    const storage = getStorage();
    const reportRef = ref(storage, `reports/${userId}/${new Date().toISOString()}.pdf`);
    
    await uploadBytes(reportRef, reportBlob);
    const downloadURL = await getDownloadURL(reportRef);
    
    await updateDoc(doc(db, 'users', userId), {
      reportURL: downloadURL,
      status: 'report_generated',
      updatedAt: new Date().toISOString(),
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading report:', error);
    throw error;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return null;
    }
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
} 