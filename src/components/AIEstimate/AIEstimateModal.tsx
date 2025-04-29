'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import UserInfoStep from '@/components/AIEstimate/UserInfoStep';
import AppDescriptionStep from '@/components/AIEstimate/AppDescriptionStep';
import FeatureSelectionStep from '@/components/AIEstimate/FeatureSelectionStep';
import DetailedReportStep from '@/components/AIEstimate/DetailedReportStep';
import { analyzeAppWithGemini, generateMockAnalysis, testGeminiApiConnection, GEMINI_MODEL } from '@/lib/services/GeminiService';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { createUserDocument } from '@/lib/firebase-utils';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export type PersonalDetails = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
};

export type AppDescription = {
  description: string;
  selectedPlatforms: string[];
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  purpose: string;
  costEstimate: string;
  timeEstimate: string;
  selected: boolean;
};

export type AIAnalysisResult = {
  appOverview: string;
  essentialFeatures: Feature[];
  enhancementFeatures: Feature[];
};

export type DetailedReport = {
  appOverview: string;
  selectedFeatures: Feature[];
  totalCost: string;
  totalTime: string;
};

interface DetailedReportStepProps {
  report: DetailedReport;
  onBack: () => void;
  onClose: () => void;
  isGeneratingServerReport: boolean;
  reportError: string | null;
  onUploadPdf?: (pdfBlob: Blob) => Promise<string>;
}

interface AIEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIEstimateModal({ isOpen, onClose }: AIEstimateModalProps) {
  const { t, dir, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    companyName: ''
  });
  const [appDescription, setAppDescription] = useState<AppDescription>({
    description: '',
    selectedPlatforms: []
  });
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [detailedReport, setDetailedReport] = useState<DetailedReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to avoid visual glitches during closing animation
      const timer = setTimeout(() => {
        setStep(1);
        setAiAnalysisResult(null);
        setDetailedReport(null);
        setIsProcessing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleUserInfoSubmit = async (details: PersonalDetails) => {
    setPersonalDetails(details);
    setIsProcessing(true);
    try {
      console.log('Creating user document with data:', details);
      
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase database is not initialized');
      }
      
      // Create a user document in Firestore
      const usersRef = collection(db, 'users');
      const userDocRef = await addDoc(usersRef, {
        personalDetails: details,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      if (!userDocRef.id) {
        throw new Error('Failed to get user document ID');
      }
      
      console.log('User document created with ID:', userDocRef.id);
      
      // Verify the document was created
      const docSnapshot = await getDoc(userDocRef);
      if (!docSnapshot.exists()) {
        throw new Error('User document was not created successfully');
      }
      
      setStep(2);
    } catch (error) {
      console.error('Error saving user data to Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        alert(`Failed to save your information: ${error.message}. Please try again.`);
      } else {
        alert('Failed to save your information. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAppDescriptionSubmit = async (description: AppDescription) => {
    if (!description || !description.description || description.description.trim() === '') {
      console.error('No app description provided or empty description');
      return;
    }

    if (!description.selectedPlatforms || description.selectedPlatforms.length === 0) {
      console.error('No platforms selected for deployment');
      return;
    }

    setAppDescription(description);
    setIsProcessing(true);
    
    try {
      console.log(`Submitting app description to ${GEMINI_MODEL} (length: ${description.description.length})`, description.description.substring(0, 100) + '...');
      console.log('Selected platforms:', description.selectedPlatforms);
      
      // Try to get analysis from the Gemini API
      const analysis = await analyzeAppWithGemini(description.description, undefined, description.selectedPlatforms);
      console.log(`Successfully received ${GEMINI_MODEL} API response:`, analysis);
      
      setAiAnalysisResult(analysis);
      setStep(3);
    } catch (error) {
      // Log the specific error for debugging
      console.error(`Error submitting app description to ${GEMINI_MODEL}:`, error);
      
      // Enhanced error message
      let errorMessage = 'API connection failed: ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      console.error(errorMessage);
      
      // Fallback to mock analysis when API fails
      console.warn(`Using mock analysis due to ${GEMINI_MODEL} API failure`);
      const mockAnalysis = generateMockAnalysis(description.description, description.selectedPlatforms);
      setAiAnalysisResult(mockAnalysis);
      setStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureSelectionSubmit = async (features: Feature[]) => {
    setIsProcessing(true);
    
    try {
      // Calculate totals
      const selectedFeatures = features.filter(f => f.selected);
      
      // Helper function to extract numeric values from cost estimates
      const extractCostRange = (costEstimate: string) => {
        const costString = costEstimate.replace(/[^0-9,-]/g, '');
        const parts = costString.split('-');
        
        // For single price calculation, we'll use the maximum value or the single value
        const costValue = parseInt(parts[0].replace(/,/g, ''));
        
        return costValue;
      };
      
      // Calculate total cost as a single sum
      const totalCost = selectedFeatures.reduce(
        (acc, feature) => {
          const cost = extractCostRange(feature.costEstimate);
          return acc + cost;
        },
        0
      );
      
      // Helper function to extract time estimates in days
      const extractTimeRange = (timeEstimate: string) => {
        // Extract numbers from strings like "2-3 days" or "1 day"
        const matches = timeEstimate.match(/(\d+)(?:-(\d+))?/);
        if (!matches) return { minTime: 1, maxTime: 2 }; // Fallback
        
        const minTime = parseInt(matches[1]);
        const maxTime = matches[2] ? parseInt(matches[2]) : minTime;
        
        return { minTime, maxTime };
      };
      
      // Calculate total time range with some parallelization factor
      // Not all tasks are sequential, some can be done in parallel
      const timeEstimates = selectedFeatures.map(feature => extractTimeRange(feature.timeEstimate));
      const parallelizationFactor = 0.7; // Assume 30% efficiency from parallelization
      
      const totalMinTime = Math.ceil(
        timeEstimates.reduce((sum, time) => sum + time.minTime, 0) * parallelizationFactor
      );
      
      const totalMaxTime = Math.ceil(
        timeEstimates.reduce((sum, time) => sum + time.maxTime, 0) * parallelizationFactor
      );
      
      // Format time display (always keeping in days unless it's over 60 days)
      let timeDisplay = '';
      if (totalMaxTime >= 60) {
        // Convert to months for longer estimates
        const minMonths = Math.ceil(totalMinTime / 30);
        const maxMonths = Math.ceil(totalMaxTime / 30);
        timeDisplay = minMonths === maxMonths
          ? `${minMonths} months`
          : `${minMonths}-${maxMonths} months`;
      } else {
        // Keep in days for shorter estimates
        timeDisplay = totalMinTime === totalMaxTime
          ? `${totalMinTime} days`
          : `${totalMinTime}-${totalMaxTime} days`;
      }
      
      // Generate detailed report
      const detailedReport: DetailedReport = {
        appOverview: aiAnalysisResult?.appOverview || '',
        selectedFeatures,
        totalCost: `$${totalCost.toLocaleString()}`,
        totalTime: timeDisplay
      };
      
      setDetailedReport(detailedReport);
      setStep(4);
    } catch (error) {
      console.error('Error generating detailed report:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadPdfAndCreateReport = async (pdfBlob: Blob, email: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase database is not initialized');
      }

      // Get current user
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to upload reports');
      }

      // Initialize storage
      const storage = getStorage();
      
      const timestamp = Date.now();
      const fileName = `${timestamp}.pdf`;
      const storageRef = ref(storage, `reports/${user.uid}/${fileName}`);
      
      // Upload the PDF
      const snapshot = await uploadBytes(storageRef, pdfBlob);
      console.log('File uploaded successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      
      // Create a report document in Firestore
      const reportsRef = collection(db, 'reports');
      const reportDoc = await addDoc(reportsRef, {
        userId: user.uid,
        userEmail: email,
        personalDetails,
        appDescription,
        detailedReport,
        pdfUrl: downloadURL,
        createdAt: new Date().toISOString(),
        status: 'completed'
      });
      
      console.log('Report uploaded and document created:', reportDoc.id);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading report:', error);
      if (error instanceof Error) {
        setError(`Failed to upload report: ${error.message}`);
      } else {
        setError('Failed to upload report. Please try again.');
      }
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // New function to validate user document
  const validateUserDocument = async (userId: string): Promise<boolean> => {
    if (!db) {
      console.error('Firebase database is not initialized');
      return false;
    }
    
    try {
      const docRef = doc(db, 'users', userId);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot.exists();
    } catch (error) {
      console.error('Error validating user document:', error);
      return false;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal Dialog */}
      <div 
        className={`relative max-h-[90vh] overflow-y-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl transition-all ${
          dir === 'rtl' ? 'rtl' : 'ltr'
        }`}
        dir={dir}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-gray-500 hover:text-gray-700 transition-colors z-10`}
          aria-label={language === 'en' ? 'Close' : 'إغلاق'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Steps Content */}
        <div className="p-6 sm:p-8">
          {step === 1 && (
            <UserInfoStep 
              onSubmit={handleUserInfoSubmit} 
              onCancel={onClose} 
              initialData={personalDetails}
              isProcessing={isProcessing}
            />
          )}
          
          {step === 2 && (
            <AppDescriptionStep 
              onSubmit={handleAppDescriptionSubmit} 
              onBack={handleBack}
              isProcessing={isProcessing}
              initialData={appDescription}
            />
          )}
          
          {step === 3 && aiAnalysisResult && (
            <FeatureSelectionStep 
              aiAnalysis={aiAnalysisResult}
              onSubmit={handleFeatureSelectionSubmit}
              onBack={handleBack}
              isProcessing={isProcessing}
            />
          )}
          
          {step === 4 && detailedReport && (
            <DetailedReportStep 
              report={detailedReport}
              onBack={handleBack}
              onClose={onClose}
              isGeneratingServerReport={isProcessing}
              reportError={error}
              onUploadPdf={(pdfBlob) => uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress)}
            />
          )}
        </div>
      </div>
    </div>
  );
} 