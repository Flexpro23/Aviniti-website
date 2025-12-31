'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import AppDescriptionStep from '@/components/AIEstimate/AppDescriptionStep';
import FeatureSelectionStep from '@/components/AIEstimate/FeatureSelectionStep';
import DetailedReportStep from '@/components/AIEstimate/DetailedReportStep';
import SaveAndAccessStep from '@/components/AIEstimate/SaveAndAccessStep';
import WorldClassProcessingAnimation from '@/components/AIEstimate/WorldClassProcessingAnimation';

import { analyzeAppWithGemini, generateMockAnalysis, testGeminiApiConnection, GEMINI_MODEL, generateExecutiveDashboard } from '@/lib/services/GeminiService';
import { collection, addDoc, getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserDocument } from '@/services/estimateService';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ContactPopup from '@/components/ContactPopup';
import Navbar from '@/components/Navbar';

import { Feature, AIAnalysisResult, CostBreakdown, TimelinePhase, AnalysisScores as SuccessPotentialScores, StrategicAnalysis, ReportData } from '@/types/report';

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
  const [analysisComplete, setAnalysisComplete] = useState(false);
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
  

  // Check for URL parameters to pre-fill app description and handle Idea Lab flow
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const prefilledDescription = urlParams.get('description');
      const prefilledPlatforms = urlParams.get('platforms');
      const fromIdeaLab = urlParams.get('fromIdeaLab') === 'true';
      const autoAnalyze = urlParams.get('autoAnalyze') === 'true';
      
      // Check for Idea Lab data in sessionStorage
      const ideaLabDataStr = sessionStorage.getItem('ideaLabData');
      
      if (fromIdeaLab && ideaLabDataStr) {
        try {
          const ideaLabData = JSON.parse(ideaLabDataStr);
          
          // Set description and platforms from Idea Lab
          const newDescription: AppDescription = {
            description: ideaLabData.idea?.fullDescription || decodeURIComponent(prefilledDescription || ''),
            selectedPlatforms: ideaLabData.platforms || []
          };
          
          setAppDescription(newDescription);
          
          // If autoAnalyze is true, automatically trigger the analysis
          if (autoAnalyze && newDescription.description && newDescription.selectedPlatforms.length > 0) {
            // Small delay to ensure state is set
            setTimeout(() => {
              handleAppDescriptionSubmit(newDescription);
            }, 500);
          }
          
          // Clear the sessionStorage after reading
          sessionStorage.removeItem('ideaLabData');
          
        } catch (e) {
          console.error('Error parsing Idea Lab data:', e);
        }
      } else if (prefilledDescription) {
        // Regular pre-fill without Idea Lab
        const platforms = prefilledPlatforms ? decodeURIComponent(prefilledPlatforms).split(',') : [];
        setAppDescription({
          description: decodeURIComponent(prefilledDescription),
          selectedPlatforms: platforms
        });
      }
    }
  }, []);

  const handleUserInfoSubmit = async (details: PersonalDetails) => {
    setPersonalDetails(details);
    setIsProcessing(true);
    
    try {
      // Save user info and complete report to Firebase
      if (db && detailedReport) {
        console.log('💾 Saving user info and complete report to Firebase...');
        
        // Create/update user document
        await createUserDocument(details);
        
        console.log('✅ Complete report saved to Firebase successfully');
      }
    } catch (error) {
      console.error('Error saving complete report:', error);
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
      const analysis = await analyzeAppWithGemini(description.description, undefined, description.selectedPlatforms, language);
      console.log(`Successfully received ${GEMINI_MODEL} API response:`, analysis);
      
      setAiAnalysisResult(analysis);
      setAnalysisComplete(true);
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
      setAnalysisComplete(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureSelectionSubmit = async (features: Feature[]) => {
    setIsProcessing(true);
    
    try {
      const selectedFeatures = features.filter((f: Feature) => f.isSelected);
      
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
        totalMaxTime,
        language
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
    } catch (error) {
      console.error('Error generating detailed report:', error);
      setError('Failed to generate detailed report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setAnalysisComplete(false);
    setIsProcessing(false);
    setError(null);
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



  return (
    <main dir={dir} className="min-h-screen bg-off-white" id="main-content">
      <Navbar />
      
      {/* Header */}
      <div className="bg-off-white text-slate-blue-600 py-16 border-b border-slate-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-blue-600 pt-12">
            {language === 'ar' ? 'احصل على تقدير تطبيقك بالذكاء الاصطناعي' : 'Get Your AI-Powered App Estimate'}
          </h1>
          <p className="text-xl text-slate-blue-500 mb-8">
            {language === 'ar' 
              ? 'احصل على تقدير فوري ومفصل لمشروع تطوير تطبيقك بواسطة تحليل الذكاء الاصطناعي المتقدم'
              : 'Receive an instant, detailed estimate for your app development project powered by advanced AI analysis'}
          </p>

        </div>
      </div>

      {/* Main Content */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 ${detailedReport ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Content */}
          <div className="p-6 sm:p-8">


            <AnimatePresence mode="wait">
              {isProcessing && appDescription.description ? (
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
                  key={analysisComplete ? 'save-access' : 'idea-catcher'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!analysisComplete ? (
                      <AppDescriptionStep 
                        onSubmit={handleAppDescriptionSubmit} 
                        onBack={() => router.push('/')}
                        isProcessing={isProcessing}
                        initialData={appDescription}
                        onKeywordsChange={setCurrentKeywords}
                      />
                  ) : aiAnalysisResult && !detailedReport ? (
                    <FeatureSelectionStep 
                      aiAnalysis={aiAnalysisResult}
                      onSubmit={handleFeatureSelectionSubmit}
                      onBack={handleBack}
                      isProcessing={isProcessing}
                    />
                  ) : detailedReport ? (
                    <DetailedReportStep 
                      report={detailedReport}
                      userInfo={personalDetails}
                      onBack={handleBack}
                      onClose={() => router.push('/')}
                      isGeneratingServerReport={isProcessing}
                      reportError={error}
                      onUploadPdf={(pdfBlob) => uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress)}
                      initialDownloadSuccess={autoDownloadSuccess}
                      onContactClick={handleContactClick}
                    />
                  ) : (
                    <SaveAndAccessStep 
                      onSubmit={handleUserInfoSubmit}
                      initialData={personalDetails}
                      isProcessing={isProcessing}
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