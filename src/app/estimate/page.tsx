'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import UserInfoStep from '@/components/AIEstimate/UserInfoStep';
import AppDescriptionStep from '@/components/AIEstimate/AppDescriptionStep';
import FeatureSelectionStep from '@/components/AIEstimate/FeatureSelectionStep';
import DetailedReportStep from '@/components/AIEstimate/DetailedReportStep';
import WorldClassProcessingAnimation from '@/components/AIEstimate/WorldClassProcessingAnimation';

import { analyzeAppWithGemini, generateMockAnalysis, testGeminiApiConnection, GEMINI_MODEL, generateExecutiveDashboard } from '@/lib/services/GeminiService';
import { collection, addDoc, getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserDocument } from '@/lib/firebase-utils';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import ContactPopup from '@/components/ContactPopup';
import Navbar from '@/components/Navbar';

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

export type CostBreakdown = {
  [category: string]: number;
};

export type TimelinePhase = {
  phase: string;
  duration: string;
  description: string;
};

export type SuccessPotentialScores = {
  innovation: number;
  marketViability: number;
  monetization: number;
  technicalFeasibility: number;
};

export type StrategicAnalysis = {
  strengths: string;
  challenges: string;
  recommendedMonetization: string;
};

export type DetailedReport = {
  appOverview: string;
  selectedFeatures: Feature[];
  totalCost: string;
  totalTime: string;
  costBreakdown: CostBreakdown;
  timelinePhases: TimelinePhase[];
  marketComparison: string;
  complexityAnalysis: string;
  // New executive dashboard fields
  successPotentialScores?: SuccessPotentialScores;
  strategicAnalysis?: StrategicAnalysis;
};

export default function AIEstimatePage() {
  const { t, dir, language } = useLanguage();
  const router = useRouter();
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
  const [autoDownloadSuccess, setAutoDownloadSuccess] = useState(false);
  const [currentKeywords, setCurrentKeywords] = useState<string[]>([]);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Check for URL parameters to pre-fill app description
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const prefilledDescription = urlParams.get('description');
      
      if (prefilledDescription) {
        setAppDescription(prev => ({
          ...prev,
          description: decodeURIComponent(prefilledDescription)
        }));
      }
    }
  }, []);

  const handleUserInfoSubmit = async (details: PersonalDetails) => {
    setPersonalDetails(details);
    setIsProcessing(true);
    
    try {
      // Test Gemini API connection
      console.log(`Testing ${GEMINI_MODEL} API connection...`);
      const isConnected = await testGeminiApiConnection();
      
      if (isConnected) {
        console.log(`${GEMINI_MODEL} API connection successful`);
      } else {
        console.warn(`${GEMINI_MODEL} API connection failed, but continuing with the flow`);
      }
      
      // Move to next step regardless of API status
      setStep(2);
      
      // Try to create user document if needed
      try {
        await createUserDocument(details.emailAddress, {
          fullName: details.fullName,
          phoneNumber: details.phoneNumber,
          companyName: details.companyName,
          emailAddress: details.emailAddress,
        });
        console.log('User document created/updated successfully');
      } catch (dbError) {
        console.warn('Failed to create/update user document:', dbError);
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
      
      // 🔥 NEW: Save app description to Firebase BEFORE AI analysis
      try {
        if (db) {
          console.log('💾 Saving app description to Firebase...');
          const userDocRef = doc(db, 'users', personalDetails.emailAddress);
          await updateDoc(userDocRef, {
            appDescription: description.description,
            selectedPlatforms: description.selectedPlatforms,
            status: 'pending-features',
            updatedAt: serverTimestamp()
          });
          console.log('✅ App description saved to Firebase successfully');
        } else {
          console.warn('⚠️ Firebase not initialized, skipping app description save');
        }
      } catch (dbError) {
        console.error('❌ Failed to save app description to Firebase:', dbError);
        // Continue with AI analysis even if Firebase update fails
      }
      
      // Try to get analysis from the Gemini API
      const analysis = await analyzeAppWithGemini(description.description, undefined, description.selectedPlatforms);
      console.log(`Successfully received ${GEMINI_MODEL} API response:`, analysis);
      
      setAiAnalysisResult(analysis);
      setStep(3);
    } catch (error) {
      console.error(`Error submitting app description to ${GEMINI_MODEL}:`, error);
      
      let errorMessage = 'API connection failed: ';
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred';
      }
      console.error(errorMessage);
      
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
      const selectedFeatures = features.filter(f => f.selected);
      
      const extractCostRange = (costEstimate: string) => {
        const costString = costEstimate.replace(/[^0-9,-]/g, '');
        const parts = costString.split('-');
        const costValue = parseInt(parts[0].replace(/,/g, ''));
        return costValue;
      };
      
      const totalCost = selectedFeatures.reduce(
        (acc, feature) => {
          const cost = extractCostRange(feature.costEstimate);
          return acc + cost;
        },
        0
      );
      
      const extractTimeRange = (timeEstimate: string) => {
        const matches = timeEstimate.match(/(\d+)(?:-(\d+))?/);
        if (!matches) return { minTime: 1, maxTime: 2 };
        
        const minTime = parseInt(matches[1]);
        const maxTime = matches[2] ? parseInt(matches[2]) : minTime;
        
        return { minTime, maxTime };
      };
      
      const timeEstimates = selectedFeatures.map(feature => extractTimeRange(feature.timeEstimate));
      const parallelizationFactor = 0.7;
      
      const totalMinTime = Math.ceil(
        timeEstimates.reduce((sum, time) => sum + time.minTime, 0) * parallelizationFactor
      );
      
      const totalMaxTime = Math.ceil(
        timeEstimates.reduce((sum, time) => sum + time.maxTime, 0) * parallelizationFactor
      );

      // Call enhanced API to generate executive dashboard data
      const dashboardReport = await generateExecutiveDashboard(
        appDescription?.description || 'App development project',
        selectedFeatures,
        totalCost,
        totalMinTime,
        totalMaxTime
      );

      const report: DetailedReport = {
        appOverview: dashboardReport.appOverview,
        totalCost: `$${totalCost.toLocaleString()}`,
        totalTime: totalMinTime === totalMaxTime ? `${totalMinTime} days` : `${totalMinTime}-${totalMaxTime} days`,
        selectedFeatures,
        costBreakdown: dashboardReport.costBreakdown,
        timelinePhases: dashboardReport.timelinePhases,
        marketComparison: dashboardReport.marketComparison,
        complexityAnalysis: dashboardReport.complexityAnalysis,
        // New executive dashboard fields
        successPotentialScores: dashboardReport.successPotentialScores,
        strategicAnalysis: dashboardReport.strategicAnalysis
      };

      setDetailedReport(report);

      // 🔥 NEW: Save selected features and report to Firebase
      try {
        if (db) {
          console.log('💾 Saving selected features and report to Firebase...');
          const userDocRef = doc(db, 'users', personalDetails.emailAddress);
          await updateDoc(userDocRef, {
            selectedFeatures,
            totalCost: `$${totalCost.toLocaleString()}`,
            totalTime: totalMinTime === totalMaxTime ? `${totalMinTime} days` : `${totalMinTime}-${totalMaxTime} days`,
            costBreakdown: dashboardReport.costBreakdown,
            timelinePhases: dashboardReport.timelinePhases,
            marketComparison: dashboardReport.marketComparison,
            complexityAnalysis: dashboardReport.complexityAnalysis,
            successPotentialScores: dashboardReport.successPotentialScores,
            strategicAnalysis: dashboardReport.strategicAnalysis,
            status: 'report-generated',
            updatedAt: serverTimestamp()
          });
          console.log('✅ Selected features and report saved to Firebase successfully');
        } else {
          console.warn('⚠️ Firebase not initialized, skipping features save');
        }
      } catch (dbError) {
        console.error('❌ Failed to save features to Firebase:', dbError);
        // Continue to next step even if Firebase update fails
      }

      setStep(4);
    } catch (error) {
      console.error('Error generating detailed report:', error);
      setError('Failed to generate detailed report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setIsProcessing(false);
      setError(null);
    }
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
  };

  const generateAppSummary = () => {
    if (!appDescription || !detailedReport) return '';
    
    return `App Description: ${appDescription.description}\n\nSelected Platforms: ${appDescription.selectedPlatforms.join(', ')}\n\nEstimated Cost: ${detailedReport.totalCost}\nEstimated Timeline: ${detailedReport.totalTime}\n\nSelected Features:\n${detailedReport.selectedFeatures.map(f => `- ${f.name}: ${f.costEstimate} (${f.timeEstimate})`).join('\n')}`;
  };

  const uploadPdfAndCreateReport = async (pdfBlob: Blob, userEmail: string): Promise<string> => {
    try {
      const storage = getStorage();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `aviniti-app-estimate-${timestamp}.pdf`;
      const storageRef = ref(storage, `reports/${userEmail}/${fileName}`);
      
      await uploadBytes(storageRef, pdfBlob);
      const downloadURL = await getDownloadURL(storageRef);
      
      const reportData = {
        userEmail,
        personalDetails,
        appDescription,
        selectedFeatures: detailedReport?.selectedFeatures || [],
        totalCost: detailedReport?.totalCost || '',
        totalTime: detailedReport?.totalTime || '',
        pdfUrl: downloadURL,
        fileName,
        createdAt: new Date(),
        status: 'completed'
      };

      if (!db) {
        throw new Error('Database not initialized');
      }
      await addDoc(collection(db, 'reports'), reportData);
      console.log('Report saved successfully');
      setAutoDownloadSuccess(true);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF and creating report:', error);
      throw error;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'App Description';
      case 3: return 'Feature Selection';
      case 4: return 'Detailed Report';
      default: return 'AI Estimate';
    }
  };

  return (
    <main dir={dir} className="min-h-screen bg-off-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-off-white text-slate-blue-600 py-16 border-b border-slate-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-blue-600 pt-8">
            Get Your AI-Powered App Estimate
          </h1>
          <p className="text-xl text-slate-blue-500 mb-8">
            Receive an instant, detailed estimate for your app development project powered by advanced AI analysis
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-bronze-500 text-white' : 'bg-slate-blue-200 text-slate-blue-600'}`}>
                1
              </div>
              <span className="hidden sm:inline text-slate-blue-600">Personal Info</span>
            </div>
            <div className="w-8 h-1 bg-slate-blue-200"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-bronze-500 text-white' : 'bg-slate-blue-200 text-slate-blue-600'}`}>
                2
              </div>
              <span className="hidden sm:inline text-slate-blue-600">App Description</span>
            </div>
            <div className="w-8 h-1 bg-slate-blue-200"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-bronze-500 text-white' : 'bg-slate-blue-200 text-slate-blue-600'}`}>
                3
              </div>
              <span className="hidden sm:inline text-slate-blue-600">Features</span>
            </div>
            <div className="w-8 h-1 bg-slate-blue-200"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 4 ? 'bg-bronze-500 text-white' : 'bg-slate-blue-200 text-slate-blue-600'}`}>
                4
              </div>
              <span className="hidden sm:inline text-slate-blue-600">Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-blue-600 mb-2">
                Step {step}: {getStepTitle()}
              </h2>
              <div className="w-full bg-slate-blue-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-bronze-500 to-bronze-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isProcessing && step === 2 && appDescription.description ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[9999]"
                >
                  <WorldClassProcessingAnimation 
                    userDescription={appDescription.description}
                    keywords={currentKeywords}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key={`step-${step}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <UserInfoStep 
                      onSubmit={handleUserInfoSubmit} 
                      onCancel={() => router.push('/')} 
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
                      onKeywordsChange={setCurrentKeywords}
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
                      onClose={() => router.push('/')}
                      isGeneratingServerReport={isProcessing}
                      reportError={error}
                      onUploadPdf={(pdfBlob) => uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress)}
                      initialDownloadSuccess={autoDownloadSuccess}
                      onContactClick={handleContactClick}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      

      
      {/* Contact Popup */}
      <ContactPopup
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialSubject={`App Development Inquiry (Estimated Cost: ${detailedReport?.totalCost || ''})`}
        initialData={{
          name: personalDetails.fullName,
          email: personalDetails.emailAddress,
          subject: `App Development Inquiry (Estimated Cost: ${detailedReport?.totalCost || ''})`,
          message: generateAppSummary()
        }}
      />
    </main>
  );
}