'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import UserInfoStep from '@/components/AIEstimate/UserInfoStep';
import AppDescriptionStep from '@/components/AIEstimate/AppDescriptionStep';
import FeatureSelectionStep from '@/components/AIEstimate/FeatureSelectionStep';
import DetailedReportStep from '@/components/AIEstimate/DetailedReportStep';
import { analyzeAppWithGemini, generateMockAnalysis, testGeminiApiConnection, GEMINI_MODEL } from '@/lib/services/GeminiService';
import { collection, addDoc, getDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserDocument } from '@/lib/firebase-utils';
import { db } from '@/lib/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import ContactPopup from '@/components/ContactPopup';
import { reportConversion } from '@/lib/gtag';

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
  const [autoDownloadSuccess, setAutoDownloadSuccess] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [userDocumentId, setUserDocumentId] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to avoid visual glitches during closing animation
      const timer = setTimeout(() => {
        console.log('🔍 DEBUG: Modal closing, resetting state');
        setStep(1);
        setAiAnalysisResult(null);
        setDetailedReport(null);
        setIsProcessing(false);
        setUserDocumentId(null);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      console.log('🔍 DEBUG: Modal opening');
    }
  }, [isOpen]);

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
    try {
      if (!db) {
        console.warn('⚠️ Firebase not initialized, skipping user document creation');
        return null;
      }
      
      const docRef = doc(collection(db, 'users')); // Creates a ref with a new ID
      console.log('🔍 DEBUG: Generated document ID:', docRef.id);
      
      const docData = {
        ...userInfo,
        createdAt: serverTimestamp(),
        status: 'pending-description' // A new status to show they've started
      };
      
      console.log('🔍 DEBUG: Document data to save:', docData);
      await setDoc(docRef, docData);
      
      console.log("✅ User document created with ID: ", docRef.id);
      try {
        reportConversion();
      } catch (e) {
        console.warn('Conversion reporting failed (non-blocking):', e);
      }
      setUserDocumentId(docRef.id); // Save the ID to state
      console.log('🔍 DEBUG: userDocumentId set in state:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error creating user document: ", error);
      // Handle error appropriately
      return null;
    }
  };

  const handleUpdateUserDocument = async (appData: { description: string; platforms: string[]; keywords: string[] }) => {
    console.log('🔍 DEBUG: handleUpdateUserDocument called');
    console.log('🔍 DEBUG: Received appData:', appData);
    console.log('🔍 DEBUG: Current userDocumentId:', userDocumentId);
    console.log('🔍 DEBUG: Database reference:', db);

    // Ensure we have a document ID to update
    if (!userDocumentId) {
      console.error("❌ No user document ID found to update.");
      alert("A session error occurred. Please try again from Step 1.");
      return false; // Indicate failure
    }

    if (!db) {
      console.warn('⚠️ Firebase not initialized, skipping user document update');
      return false;
    }

    try {
      console.log('🔍 DEBUG: Creating document reference...');
      const userDocRef = doc(db, 'users', userDocumentId);
      console.log('🔍 DEBUG: Document reference created:', userDocRef.path);

      const updateData = {
        appDescription: appData.description,
        selectedPlatforms: appData.platforms,
        detectedKeywords: appData.keywords, // Store the keywords for analysis
        status: 'pending-features', // Update the status
        updatedAt: serverTimestamp()
      };

      console.log('🔍 DEBUG: Update data prepared:', updateData);
      console.log('🔍 DEBUG: Calling updateDoc...');

      await updateDoc(userDocRef, updateData);
      
      console.log("✅ User document successfully updated with app description.");
      console.log('🔍 DEBUG: Document should now contain Step 2 data');
      return true; // Indicate success
    } catch (error) {
      console.error("❌ Error updating user document: ", error);
      if (error instanceof Error) {
        console.error("❌ Error details:", {
          message: error.message,
          stack: error.stack
        });
      }
      return false; // Indicate failure
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

    console.log('✅ Document update successful, proceeding to AI analysis');
    
    try {
      console.log(`Submitting app description to ${GEMINI_MODEL} (length: ${description.description.length})`, description.description.substring(0, 100) + '...');
      console.log('Selected platforms:', description.selectedPlatforms);
      
      // Try to get analysis from the Gemini API
      const analysis = await analyzeAppWithGemini(description.description, undefined, description.selectedPlatforms, language);
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
        totalCost: `$${totalCost.toLocaleString()}`,
        totalTime: timeDisplay,
        costBreakdown,
        timelinePhases: generateTimelinePhases(),
        marketComparison,
        complexityAnalysis
      };
      
      setDetailedReport(detailedReport);

      // Update user document with feature selection and basic report
      if (userDocumentId && db) {
        try {
          const userDocRef = doc(db, 'users', userDocumentId);
          await updateDoc(userDocRef, {
            selectedFeatures,
            basicReport: detailedReport,
            totalCost: `$${totalCost.toLocaleString()}`,
            totalTime: timeDisplay,
            costBreakdown,
            timelinePhases: generateTimelinePhases(),
            status: 'report-generated',
            updatedAt: serverTimestamp()
          });
          console.log('User document updated with feature selection and complete report data');
        } catch (error) {
          console.error('Error updating user document with features:', error);
        }
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
              // Create the reference to DetailedReportStep for PDF generation
              const reportRef = document.getElementById('report-container');
              
              if (!reportRef) {
                console.error('Report container element not found');
                return;
              }
              
              // Check if device is mobile
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
              console.log('Device detection:', { isMobile, userAgent: navigator.userAgent });
              
              // Dynamically import the libraries only when needed
              const [jspdfModule, html2canvasModule] = await Promise.all([
                import('jspdf'),
                import('html2canvas')
              ]);
              const jsPDF = jspdfModule.default;
              const html2canvas = html2canvasModule.default;
              
              // Create a temporary div for the contact information
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = `
                <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                  <h3 style="font-size: 18px; color: #1e40af; margin-bottom: 15px;">Contact Information</h3>
                  <p style="margin-bottom: 10px;">Ready to get started? Contact us to discuss your project further!</p>
                  <div style="margin-top: 15px;">
                    <p style="margin-bottom: 8px;"><strong>Email:</strong> Aliodat@aviniti.app</p>
                    <p style="margin-bottom: 8px;"><strong>Phone:</strong> +962 790 685 302</p>
                    <p style="margin-bottom: 8px;"><strong>Website:</strong> www.aviniti.app</p>
                  </div>
                  <div style="margin-top: 20px; text-align: center;">
                    <p style="font-size: 20px; color: #1e40af; margin-bottom: 5px;">AVINITI</p>
                    <p style="font-style: italic; color: #64748b;">Your Ideas, Our Reality</p>
                  </div>
                </div>
              `;
              
              console.log('Appending contact information...');
              
              // Append the contact information to the report container
              reportRef.appendChild(tempDiv);
              
              console.log('Creating canvas with mobile optimization:', isMobile);
              
              try {
                // Create a canvas from the report content - reduce quality on mobile
                const canvas = await html2canvas(reportRef, {
                  scale: isMobile ? 1.0 : 2.0, // Lower scale on mobile for better performance
                  useCORS: true, // Enable CORS for any images
                  logging: true, // Enable logging for debugging
                  onclone: (clonedDoc) => {
                    // You can modify the cloned document before rendering if needed
                    const element = clonedDoc.getElementById('report-container');
                    if (element) {
                      element.style.padding = '20px';
                      
                      // If mobile, simplify the content for better performance
                      if (isMobile) {
                        const tables = element.querySelectorAll('.sm\\:grid');
                        tables.forEach(table => {
                          // Simplify complex grid layouts on mobile
                          if (table.className.includes('sm:grid-cols-5')) {
                            table.className = table.className.replace('sm:grid-cols-5', 'grid-cols-1');
                          }
                        });
                      }
                    }
                  }
                });
                
                console.log('Canvas created successfully, dimensions:', { width: canvas.width, height: canvas.height });
                
                // Remove the temporary contact information div after canvas creation
                reportRef.removeChild(tempDiv);
                
                const imgData = canvas.toDataURL('image/jpeg', isMobile ? 0.7 : 0.9); // Use JPEG with lower quality on mobile
                
                console.log('Creating PDF...');
                
                // Calculate PDF dimensions (A4 format)
                const pdf = new jsPDF({
                  orientation: 'portrait',
                  unit: 'mm',
                  format: 'a4'
                });
                
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                
                // Add the image to the first page
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight); // Use JPEG instead of PNG
                heightLeft -= pageHeight;
                
                // Add new pages if the content is longer than one page
                while (heightLeft > 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight); // Use JPEG instead of PNG
                  heightLeft -= pageHeight;
                }
                
                console.log('PDF created successfully, getting blob...');
                
                // Get the PDF as a blob
                let pdfBlob = pdf.output('blob');
                console.log('PDF blob created, size:', pdfBlob.size);
                
                // On mobile, try a simpler approach if the blob is very large
                if (isMobile && pdfBlob.size > 5000000) { // 5MB threshold
                  console.log('PDF is too large for mobile, trying simpler approach...');
                  
                  // Create a simpler PDF with just text
                  const simplePdf = new jsPDF();
                  simplePdf.setFontSize(22);
                  simplePdf.text('Aviniti App Development Report', 20, 20);
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('App Overview:', 20, 40);
                  simplePdf.setFontSize(12);
                  
                  const appOverview = detailedReport?.appOverview || '';
                  const splitOverview = simplePdf.splitTextToSize(appOverview, 170);
                  simplePdf.text(splitOverview, 20, 50);
                  
                  let yPos = 50 + splitOverview.length * 7;
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('Selected Features:', 20, yPos);
                  simplePdf.setFontSize(12);
                  
                  yPos += 10;
                  
                  // Add features
                  detailedReport?.selectedFeatures.forEach((feature: Feature, i: number) => {
                    if (yPos > 270) {
                      simplePdf.addPage();
                      yPos = 20;
                    }
                    
                    // Set font style to bold
                    simplePdf.setFont(simplePdf.getFont().fontName, 'bold');
                    simplePdf.text(`${i+1}. ${feature.name}`, 20, yPos);
                    yPos += 7;
                    
                    // Set font style back to normal
                    simplePdf.setFont(simplePdf.getFont().fontName, 'normal');
                    const descText = simplePdf.splitTextToSize(`Description: ${feature.description}`, 170);
                    simplePdf.text(descText, 25, yPos);
                    yPos += descText.length * 7;
                    
                    simplePdf.text(`Cost: ${feature.costEstimate} • Time: ${feature.timeEstimate}`, 25, yPos);
                    yPos += 10;
                  });
                  
                  // Add summary
                  if (yPos > 250) {
                    simplePdf.addPage();
                    yPos = 20;
                  }
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('Project Summary:', 20, yPos);
                  yPos += 10;
                  
                  simplePdf.setFontSize(12);
                  simplePdf.text(`Total Cost: ${detailedReport?.totalCost || ''}`, 20, yPos);
                  yPos += 7;
                  simplePdf.text(`Total Time: ${detailedReport?.totalTime || ''}`, 20, yPos);
                  yPos += 7;
                  simplePdf.text(`Number of Features: ${detailedReport?.selectedFeatures.length || 0}`, 20, yPos);
                  yPos += 15;
                  
                  // Contact info
                  simplePdf.setFontSize(16);
                  simplePdf.text('Contact Information:', 20, yPos);
                  yPos += 10;
                  
                  simplePdf.setFontSize(12);
                  simplePdf.text('Email: Aliodat@aviniti.app', 20, yPos);
                  yPos += 7;
                  simplePdf.text('Phone: +962 790 685 302', 20, yPos);
                  yPos += 7;
                  simplePdf.text('Website: www.aviniti.app', 20, yPos);
                  yPos += 15;
                  
                  simplePdf.setFontSize(14);
                  simplePdf.setTextColor(29, 64, 175); // Blue color
                  simplePdf.text('AVINITI - Your Ideas, Our Reality', 20, yPos);
                  
                  const simplePdfBlob = simplePdf.output('blob');
                  console.log('Simple PDF created for mobile, size:', simplePdfBlob.size);
                  
                  // Use this simpler PDF instead
                  pdfBlob = simplePdfBlob;
                }
                
                // Upload the PDF
                await uploadPdfAndCreateReport(pdfBlob, personalDetails.emailAddress);
                
                // Save the PDF locally
                if (isMobile) {
                  // On mobile, open in a new tab rather than triggering download
                  const pdfUrl = URL.createObjectURL(pdfBlob);
                  window.open(pdfUrl, '_blank');
                } else {
                  pdf.save('Aviniti_App_Development_Report.pdf');
                }
                
                // Show a success message without requiring user interaction
                setAutoDownloadSuccess(true);
                
                // Hide the success message after 5 seconds
                setTimeout(() => {
                  setAutoDownloadSuccess(false);
                }, 5000);
                
                console.log('PDF has been generated and saved successfully');
                
                // Close the modal and navigate to the detailed report page after a short delay
                setTimeout(() => {
                  console.log('Auto-closing modal and navigating to detailed report page');
                  autoDownloadCompleted = true; // Mark as completed
                  onClose(); // Close the modal
                  
                  // Optional: Navigate to a detailed report page if you have one
                  // window.location.href = '/reports'; // Uncomment this line to navigate to a reports page
                }, isMobile ? 500 : 2000); // Shorter delay on mobile
                
              } catch (canvasError) {
                // Canvas generation failed, try the basic approach for mobile
                console.error('Canvas generation failed:', canvasError);
                
                if (isMobile) {
                  console.log('Attempting simplified PDF generation for mobile...');
                  
                  // Create a simple text-based PDF instead
                  const simplePdf = new jsPDF();
                  simplePdf.setFontSize(22);
                  simplePdf.text('Aviniti App Development Report', 20, 20);
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('App Overview:', 20, 40);
                  simplePdf.setFontSize(12);
                  
                  const appOverview = detailedReport?.appOverview || '';
                  const splitOverview = simplePdf.splitTextToSize(appOverview, 170);
                  simplePdf.text(splitOverview, 20, 50);
                  
                  let yPos = 50 + splitOverview.length * 7;
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('Selected Features:', 20, yPos);
                  simplePdf.setFontSize(12);
                  
                  yPos += 10;
                  
                  // Add features
                  detailedReport?.selectedFeatures.forEach((feature: Feature, i: number) => {
                    if (yPos > 270) {
                      simplePdf.addPage();
                      yPos = 20;
                    }
                    
                    // Set font style to bold
                    simplePdf.setFont(simplePdf.getFont().fontName, 'bold');
                    simplePdf.text(`${i+1}. ${feature.name}`, 20, yPos);
                    yPos += 7;
                    
                    // Set font style back to normal
                    simplePdf.setFont(simplePdf.getFont().fontName, 'normal');
                    const descText = simplePdf.splitTextToSize(`Description: ${feature.description}`, 170);
                    simplePdf.text(descText, 25, yPos);
                    yPos += descText.length * 7;
                    
                    simplePdf.text(`Cost: ${feature.costEstimate} • Time: ${feature.timeEstimate}`, 25, yPos);
                    yPos += 10;
                  });
                  
                  // Add summary
                  if (yPos > 250) {
                    simplePdf.addPage();
                    yPos = 20;
                  }
                  
                  simplePdf.setFontSize(16);
                  simplePdf.text('Project Summary:', 20, yPos);
                  yPos += 10;
                  
                  simplePdf.setFontSize(12);
                  simplePdf.text(`Total Cost: ${detailedReport?.totalCost || ''}`, 20, yPos);
                  yPos += 7;
                  simplePdf.text(`Total Time: ${detailedReport?.totalTime || ''}`, 20, yPos);
                  yPos += 7;
                  simplePdf.text(`Number of Features: ${detailedReport?.selectedFeatures.length || 0}`, 20, yPos);
                  yPos += 15;
                  
                  // Contact info
                  simplePdf.setFontSize(16);
                  simplePdf.text('Contact Information:', 20, yPos);
                  yPos += 10;
                  
                  simplePdf.setFontSize(12);
                  simplePdf.text('Email: Aliodat@aviniti.app', 20, yPos);
                  yPos += 7;
                  simplePdf.text('Phone: +962 790 685 302', 20, yPos);
                  yPos += 7;
                  simplePdf.text('Website: www.aviniti.app', 20, yPos);
                  yPos += 15;
                  
                  simplePdf.setFontSize(14);
                  simplePdf.setTextColor(29, 64, 175); // Blue color
                  simplePdf.text('AVINITI - Your Ideas, Our Reality', 20, yPos);
                  
                  const simplePdfBlob = simplePdf.output('blob');
                  
                  // Upload the simple PDF
                  await uploadPdfAndCreateReport(simplePdfBlob, personalDetails.emailAddress);
                  
                  // On mobile, open in a new tab rather than triggering download
                  const pdfUrl = URL.createObjectURL(simplePdfBlob);
                  window.open(pdfUrl, '_blank');
                  
                  // Show success and close
                  setAutoDownloadSuccess(true);
                  setTimeout(() => {
                    setAutoDownloadSuccess(false);
                    autoDownloadCompleted = true;
                    onClose();
                  }, 1000);
                } else {
                  throw canvasError; // Re-throw for desktop to show error
                }
              }
            } catch (error) {
              console.error('Error in auto PDF generation:', error);
              setError('Error generating PDF report. You can try downloading it manually.');
              autoDownloadCompleted = true; // Mark as completed even on error
            } finally {
              // If for some reason the autoDownloadCompleted flag wasn't set to true
              // (this should rarely happen, but we're being defensive),
              // we'll set isProcessing to false after a timeout
              setTimeout(() => {
                if (!autoDownloadCompleted) {
                  setIsProcessing(false);
                }
              }, 5000); // 5 second safety timeout
            }
          };
          
          // Execute the auto-download function
          autoDownloadPdf();
        } else {
          // If we don't have personal details, set processing to false
          setIsProcessing(false);
        }
      }, 1000); // Wait 1 second for the UI to fully render
      
    } catch (error) {
      console.error('Error generating detailed report:', error);
      setIsProcessing(false); // Only set to false here on immediate errors
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

      // Create a unique ID for the report
      const timestamp = Date.now();
      const fileName = `${timestamp}.pdf`;
      
      // Initialize storage
      const storage = getStorage();
      
      // Create a unique ID for this report using timestamp and email
      const reportId = `${email.replace(/[^a-zA-Z0-9]/g, '')}_${timestamp}`;
      const storageRef = ref(storage, `reports/${reportId}/${fileName}`);
      
      // Upload the PDF
      const snapshot = await uploadBytes(storageRef, pdfBlob);
      console.log('File uploaded successfully');
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      
      // Create a report document in Firestore
      const reportsRef = collection(db, 'reports');
      const reportDoc = await addDoc(reportsRef, {
        reportId,
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