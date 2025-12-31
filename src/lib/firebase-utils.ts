import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import { PersonalDetails, Feature, ProjectDetails } from '@/types/estimate';
export type { PersonalDetails, Feature, ProjectDetails };

export interface SelectedFeatures {
  core: string[];
  suggested: Feature[];
}

// Helper functions
export const createUserDocument = async (personalDetails: PersonalDetails) => {
  if (!db) {
    console.error('Firebase not initialized');
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      personalDetails,
      createdAt: serverTimestamp(),
      status: 'started'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user document:', error);
    return null;
  }
};

export const updateProjectDetails = async (userId: string, projectDetails: ProjectDetails) => {
  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      projectDetails,
      updatedAt: serverTimestamp(),
      status: 'details_submitted'
    });
    return true;
  } catch (error) {
    console.error('Error updating project details:', error);
    return false;
  }
};

export const updateSelectedFeatures = async (userId: string, selectedFeatures: SelectedFeatures) => {
  if (!db) {
    console.error('Firebase not initialized');
    return false;
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      selectedFeatures,
      updatedAt: serverTimestamp(),
      status: 'features_selected'
    });
    return true;
  } catch (error) {
    console.error('Error updating selected features:', error);
    return false;
  }
};

export const getUserData = async (userId: string) => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getReportData = async (userId: string) => {
  try {
      const response = await fetch(`/api/report/${userId}`);
      if (!response.ok) {
          return null;
      }
      return await response.json();
  } catch (error) {
      console.error("Error fetching report data:", error);
      return null;
  }
};
