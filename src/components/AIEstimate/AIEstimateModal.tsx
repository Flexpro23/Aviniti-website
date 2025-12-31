'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import UserInfoStep from '@/components/AIEstimate/UserInfoStep';
import AppDescriptionStep from '@/components/AIEstimate/AppDescriptionStep';
import FeatureSelectionStep from '@/components/AIEstimate/FeatureSelectionStep';
import DetailedReportStep from '@/components/AIEstimate/DetailedReportStep';
import { generateMockAnalysis } from '@/lib/services/GeminiService';
import { 
  createUserDocument, 
  updateUserAppDescription, 
  updateUserFeaturesAndReport, 
  uploadReportPdf 
} from '@/services/estimateService';
import { db } from '@/lib/firebase'; // Kept for checking initialization only
import ContactPopup from '@/components/ContactPopup';
import { useEstimatePersistence } from './useEstimatePersistence';
import { 
  AIAnalysisResult, 
  Feature, 
  ReportData as DetailedReport,
  CostBreakdown,
  StrategicAnalysis,
  AnalysisScores as SuccessPotentialScores,
  TimelinePhase
} from '@/types/report';
import {
  AppDescription,
  PersonalDetails
} from '@/types/estimate';

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
  const [autoDownloadSuccess, setAutoDownloadSuccess] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [userDocumentId, setUserDocumentId] = useState<string | null>(null);

  // Auto-save persistence hook
  const { saveState, loadState, clearState } = useEstimatePersistence(personalDetails, appDescription);
  const [isResumed, setIsResumed] = useState(false);

  // Reset state when modal opens/closes - Modified to support resumption
  useEffect(() => {
    if (!isOpen) {
      // Only reset if we haven't saved state or if we want to force reset (not implemented yet)
      // But for now, we keep the state in memory to allow quick re-open without losing data
      // unless we explicitly want to clear it. 
      // If the user actually *closes* (e.g. finishes), we might clear it elsewhere.
      
      // Logic: If we have valid progress (step > 1), we don't reset.
      // If we are at step 1 and empty, we can reset.
      
      // Actually, to support "Resume", we should Load state when opening.
    } else {
      console.log('🔍 DEBUG: Modal opening');
      // Try to load state
      const saved = loadState();
      if (saved && saved.step > 1) {
         console.log('🔄 Restoring saved estimate session', saved);
         setStep(saved.step);
         setPersonalDetails(saved.personalDetails);
         setAppDescription(saved.appDescription);
         setAiAnalysisResult(saved.aiAnalysisResult);
         setDetailedReport(saved.detailedReport);
         setUserDocumentId(saved.userDocumentId);
         setIsResumed(true);
         setTimeout(() => setIsResumed(false), 3000);
      }
    }
  }, [isOpen, loadState]);

  // Save state when relevant data changes
  useEffect(() => {
    if (isOpen && step > 1) {
      saveState(step, personalDetails, appDescription, aiAnalysisResult, detailedReport, userDocumentId);
    }
  }, [isOpen, step, personalDetails, appDescription, aiAnalysisResult, detailedReport, userDocumentId, saveState]);

  // Debug: Watch userDocumentId changes
  useEffect(() => {
    console.log('🔍 DEBUG: userDocumentId changed to:', userDocumentId);
  }, [userDocumentId]);

  // Debug: Watch step changes
  useEffect(() => {
    console.log('🔍 DEBUG: step changed to:', step);
  }, [step]);

  const handleCreateUserDocument = async (userInfo: PersonalDetails) => {
    console.log('🔍 DEBUG: handleCreateUserDocument called with:', userInfo);
    
    const docId = await createUserDocument(userInfo);
    
    if (docId) {
      setUserDocumentId(docId);
      console.log('🔍 DEBUG: userDocumentId set in state:', docId);
      return docId;
    } else {
      console.error("❌ Error creating user document");
      return null;
    }
  };

  const handleUpdateUserDocument = async (appData: { description: string; platforms: string[]; keywords: string[] }) => {
    console.log('🔍 DEBUG: handleUpdateUserDocument called');
    
    if (!userDocumentId) {
      console.error("❌ No user document ID found to update.");
      alert("A session error occurred. Please try again from Step 1.");
      return false;
    }

    const success = await updateUserAppDescription(userDocumentId, appData);
    
    if (success) {
      console.log("✅ User document successfully updated with app description.");
      return true;
    } else {
      console.error("❌ Error updating user document");
      return false;
    }
  };

  const handleUserInfoSubmit = async (details: PersonalDetails) => {
    setPersonalDetails(details);
    setIsProcessing(true);
    try {
      console.log('Creating user document with data:', details);
      
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase database is not initialized');
      }
      
      // Create user document and get the ID
      const docId = await handleCreateUserDocument(details);
      if (!docId) {
        // If creation fails, show an error and don't proceed
        alert("Could not save your information. Please try again.");
        return;
      }
      
      // Stop processing before changing steps to prevent the next step from showing a loading state immediately
      setIsProcessing(false);
      setStep(2);
    } catch (error) {
      console.error('Error saving user data to Firebase:', error);
      setIsProcessing(false); // Ensure processing is stopped on error
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
    }
    // Removed finally block to manually control isProcessing transition
  };

  const handleAppDescriptionSubmit = async (description: AppDescription & { keywords: string[] }) => {
    console.log('🔍 DEBUG: handleAppDescriptionSubmit called with:', description);
    console.log('🔍 DEBUG: Current userDocumentId:', userDocumentId);
    console.log('🔍 DEBUG: Current step:', step);

    if (!description || !description.description || description.description.trim() === '') {
      console.error('❌ No app description provided or empty description');
      return;
    }

    if (!description.selectedPlatforms || description.selectedPlatforms.length === 0) {
      console.error('❌ No platforms selected for deployment');
      return;
    }

    console.log('✅ Validation passed, proceeding with submission');
    setAppDescription(description);
    setIsProcessing(true);

    // Update user document with app description and keywords
    const appData = {
      description: description.description,
      platforms: description.selectedPlatforms,
      keywords: description.keywords || [] // Use detected keywords from the component
    };

    console.log('🔍 DEBUG: App data to save:', appData);
    console.log('🔍 DEBUG: About to call handleUpdateUserDocument...');

    const updateSuccess = await handleUpdateUserDocument(appData);

    console.log('🔍 DEBUG: handleUpdateUserDocument result:', updateSuccess);

    if (!updateSuccess) {
      // If the update fails, show an error and stop
      setIsProcessing(false);
      alert("Could not save your app description. Please try again.");
      return;
    }

    console.log('✅ Document update successful, proceeding to next step immediately');
    
    // Skip Gemini analysis completely and proceed immediately using mock/static data
    // This ensures the next steps have necessary data structure without making API calls
    const mockAnalysis = generateMockAnalysis(description.description, description.selectedPlatforms);
    setAiAnalysisResult(mockAnalysis);
    setIsProcessing(false);
    setStep(3);
  };

  const handleFeatureSelectionSubmit = async (features: Feature[]) => {
    setIsProcessing(true);
    
    try {
      // Calculate totals
      const selectedFeatures = features.filter(f => f.isSelected);
      
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
      
      // Generate cost breakdown by purpose/category
      const costBreakdown: CostBreakdown = selectedFeatures.reduce((breakdown, feature) => {
        const cost = extractCostRange(feature.costEstimate);
        const category = feature.purpose || 'Development';
        
        if (breakdown[category]) {
          breakdown[category] += cost;
        } else {
          breakdown[category] = cost;
        }
        
        return breakdown;
      }, {} as CostBreakdown);

      // Generate timeline phases based on feature complexity
      const generateTimelinePhases = (): TimelinePhase[] => {
        const phases: TimelinePhase[] = [];
        
        // Always start with Design phase
        phases.push({
          phase: "Phase 1: Design & Planning",
          duration: "Weeks 1-2",
          description: "UI/UX design, wireframing, and technical architecture planning"
        });

        // Core Development phase
        phases.push({
          phase: "Phase 2: Core Development",
          duration: totalMinTime <= 30 ? "Weeks 3-6" : "Weeks 3-8",
          description: "Implementation of essential features and core functionality"
        });

        // Enhancement phase (if enhancement features are selected)
        const hasEnhancements = selectedFeatures.some(f => f.id.includes('enhancement'));
        if (hasEnhancements) {
          phases.push({
            phase: "Phase 3: Advanced Features",
            duration: totalMinTime <= 30 ? "Weeks 7-8" : "Weeks 9-10",
            description: "Implementation of enhancement features and integrations"
          });
        }

        // Testing and Deployment
        phases.push({
          phase: `Phase ${hasEnhancements ? '4' : '3'}: Testing & Deployment`,
          duration: totalMinTime <= 30 ? "Weeks 9-10" : "Weeks 11-12",
          description: "Quality assurance, bug fixes, and platform deployment"
        });

        return phases;
      };

      // Generate AI insights
      const marketComparison = `For an app with ${selectedFeatures.length} features, typical market estimates range from $${Math.round(totalCost * 0.8).toLocaleString()} to $${Math.round(totalCost * 1.3).toLocaleString()}. Your estimate represents excellent value for the comprehensive feature set.`;
      
      const complexityLevel = totalCost > 15000 ? 'High' : totalCost > 8000 ? 'Medium' : 'Low';
      const complexityAnalysis = `This project has ${complexityLevel.toLowerCase()} technical complexity. ${
        complexityLevel === 'High' 
          ? 'The combination of advanced features requires sophisticated architecture and experienced developers.' 
          : complexityLevel === 'Medium'
          ? 'The feature set requires solid development expertise with moderate architectural considerations.'
          : 'The straightforward feature set allows for efficient development with standard practices.'
      }`;

      // Generate detailed report
      const detailedReport: DetailedReport = {
        appOverview: aiAnalysisResult?.appOverview || '',
        selectedFeatures,
        totalCost: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        totalTime: timeDisplay,
        costBreakdown,
        timelinePhases: generateTimelinePhases(),
        marketComparison,
        complexityAnalysis,
        successPotentialScores: {
          innovation: 8,
          marketViability: 8,
          monetization: 7,
          technicalFeasibility: 9
        },
        strategicAnalysis: {
          strengths: "Strong core functionality and user-centric design.",
          challenges: "Initial user acquisition and market penetration.",
          recommendedMonetization: "Freemium model with premium features."
        }
      };
      
      setDetailedReport(detailedReport);

      // Update user document with feature selection and basic report
      if (userDocumentId) {
        await updateUserFeaturesAndReport(userDocumentId, {
          selectedFeatures,
          basicReport: detailedReport,
          totalCost: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          totalTime: timeDisplay,
          costBreakdown,
          timelinePhases: generateTimelinePhases()
        });
      }

      setStep(4);
      
      // Reference to track if the auto download process is completed
      let autoDownloadCompleted = false;
      
      // Automatically trigger PDF generation after a short delay to allow the UI to render
      setTimeout(() => {
        console.log('Auto-triggering PDF generation...');
        if (personalDetails && personalDetails.emailAddress) {
          // This variable is used to manage the automatic download flow
          const autoDownloadPdf = async () => {
            try {
              // Check if device is mobile
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
              
              // Import service
              const { generateClientSidePDF } = await import('@/services/pdfService');
              
              // Prepare report data for PDF
              // Map DetailedReport to the ReportData expected by the PDF service
              const pdfReportData = {
                appOverview: detailedReport.appOverview,
                totalCost: detailedReport.totalCost,
                totalTime: detailedReport.totalTime,
                userName: personalDetails.fullName,
                userEmail: personalDetails.emailAddress,
                userCompany: personalDetails.companyName,
                selectedFeatures: detailedReport.selectedFeatures.map(f => ({
                    ...f,
                    category: f.purpose || 'General',
                    isSelected: true
                })),
                successPotentialScores: detailedReport.successPotentialScores || {
                    innovation: 0,
                    marketViability: 0,
                    monetization: 0,
                    technicalFeasibility: 0
                },
                costBreakdown: detailedReport.costBreakdown,
                strategicAnalysis: detailedReport.strategicAnalysis || {
                    strengths: '',
                    challenges: '',
                    recommendedMonetization: ''
                },
                timelinePhases: detailedReport.timelinePhases,
                timestamp: new Date().toLocaleDateString()
              };
              
              console.log('Generating PDF using service...');
              const pdfBlob = await generateClientSidePDF({
                reportData: pdfReportData,
                fileName: 'Aviniti_App_Development_Report.pdf',
                isMobile
              });
              
              console.log('PDF generated, size:', pdfBlob.size);
              
              // Upload the PDF
              await uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress);
              
              // Save the PDF locally
              if (isMobile) {
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
              } else {
                // Helper for download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfBlob);
                link.download = 'Aviniti_App_Development_Report.pdf';
                link.click();
              }
              
              // Show success message
              setAutoDownloadSuccess(true);
              setTimeout(() => {
                setAutoDownloadSuccess(false);
              }, 5000);
              
              // Auto close
              setTimeout(() => {
                autoDownloadCompleted = true; 
                // onClose(); // Maybe don't close automatically to let them see the result
              }, 2000);

            } catch (error) {
              console.error('Error in auto PDF generation:', error);
              setError('Error generating PDF report. You can try downloading it manually.');
              autoDownloadCompleted = true; 
            } finally {
               setTimeout(() => {
                if (!autoDownloadCompleted) {
                  setIsProcessing(false);
                }
              }, 5000);
            }
          };
          
          autoDownloadPdf();
        } else {
          setIsProcessing(false);
        }
      }, 1000); 

      
    } catch (error) {
      console.error('Error generating detailed report:', error);
      setIsProcessing(false); // Only set to false here on immediate errors
    }
  };

  const uploadPdfAndCreateReport = async (pdfBlob: Blob, email: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await uploadReportPdf(pdfBlob, email, userDocumentId || undefined);
      
      if (result) {
        console.log('✅ Report uploaded and record created with ID:', result.reportId);
        // Clear local storage state on successful completion
        clearState();
        return result.downloadURL;
      }
      return '';
    } catch (error) {
      console.error('Error uploading report:', error);
      setError('Failed to upload report. Please try again.');
      return '';
    } finally {
      setIsProcessing(false);
    }
  };



  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to generate app description summary for contact form
  const generateAppSummary = (): string => {
    if (!detailedReport) return '';
    
    const platforms = appDescription.selectedPlatforms.join(', ');
    const featureCount = detailedReport.selectedFeatures.length;
    const cost = detailedReport.totalCost;
    const time = detailedReport.totalTime;
    
    return `App Development Inquiry: I'm interested in building a ${platforms} app with ${featureCount} features. The estimated cost is ${cost} and timeframe is ${time}. I'd like to discuss this further.`;
  };
  
  // Function to handle contact button click
  const handleContactClick = () => {
    setIsContactOpen(true);
    // Don't close the estimate modal yet, let the user decide
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal Dialog - Bottom sheet on mobile, centered on desktop */}
      <div 
        className={`relative w-full max-w-2xl bg-white shadow-2xl transition-all transform
          sm:rounded-2xl sm:max-h-[90vh] sm:m-4
          max-h-[95vh] rounded-t-3xl sm:rounded-b-2xl
          ${dir === 'rtl' ? 'rtl' : 'ltr'}`}
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-gray-500 hover:text-gray-700 transition-colors z-10 p-2 rounded-full hover:bg-gray-100`}
          aria-label={language === 'en' ? 'Close' : 'إغلاق'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Steps Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-2rem)] sm:max-h-[calc(90vh-2rem)] p-3 sm:p-4 lg:p-6 pb-safe mobile-scroll">
          {isResumed && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center animate-fade-in-down">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
              {language === 'en' ? 'Session restored' : 'تم استعادة الجلسة'}
            </div>
          )}
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
              userInfo={personalDetails}
              onBack={handleBack}
              onClose={onClose}
              isGeneratingServerReport={isProcessing}
              reportError={error}
              onUploadPdf={(pdfBlob) => uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress)}
              initialDownloadSuccess={autoDownloadSuccess}
              onContactClick={handleContactClick}
            />
          )}
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
    </div>
  );
} 