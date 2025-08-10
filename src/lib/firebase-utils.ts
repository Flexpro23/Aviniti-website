"use client";

import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc, Firestore } from 'firebase/firestore';
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
  competitors: string[];
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

// Client-side Firebase functions
export async function createUserDocument(userId: string, personalDetails: PersonalDetails): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    const userData: UserData = {
      personalDetails,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db as Firestore, 'users', userId), userData);
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
    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    await updateDoc(doc(db as Firestore, 'users', userId), {
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
    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    await updateDoc(doc(db as Firestore, 'users', userId), {
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
    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    const storage = getStorage();
    const reportRef = ref(storage, `reports/${userId}/${new Date().toISOString()}.pdf`);
    
    await uploadBytes(reportRef, reportBlob);
    const downloadURL = await getDownloadURL(reportRef);
    
    await updateDoc(doc(db as Firestore, 'users', userId), {
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

// API functions
export async function getUserData(userId: string) {
  try {
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
      return null;
    }
}

export async function getReportData(userId: string) {
  try {
    const response = await fetch(`/api/report/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching report data:', error);
    return null;
  }
} 