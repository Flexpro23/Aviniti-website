'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import UserInfoStep from './UserInfoStep';
import AppDescriptionStep from './AppDescriptionStep';
import FeatureSelectionStep from './FeatureSelectionStep';
import DetailedReportStep from './DetailedReportStep';

export type PersonalDetails = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
};

export type AppDescription = {
  description: string;
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

interface AIEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIEstimateModal({ isOpen, onClose }: AIEstimateModalProps) {
  const { t, dir, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    companyName: ''
  });
  const [appDescription, setAppDescription] = useState<AppDescription>({
    description: ''
  });
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailedReport, setDetailedReport] = useState<DetailedReport | null>(null);

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
    // Here we would typically save the user info to Firestore
    // and get back a userId to associate with this session
    setUserId('sample-user-id-' + Date.now());
    setStep(2);
  };

  const handleAppDescriptionSubmit = async (description: AppDescription) => {
    setAppDescription(description);
    setIsProcessing(true);
    
    try {
      // Simulate API call to analyze app description
      // This would be replaced with a real API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI analysis result
      const mockAiAnalysis: AIAnalysisResult = {
        appOverview: "Based on your description, you're building a mobile application for package delivery with logistics management features.",
        essentialFeatures: [
          {
            id: '1',
            name: 'User Authentication',
            description: 'Secure login system with multiple user roles',
            purpose: 'Ensure secure access for different user types',
            costEstimate: '$2,000-$3,000',
            timeEstimate: '2-3 weeks',
            selected: true
          },
          {
            id: '2',
            name: 'Package Tracking',
            description: 'Real-time package location tracking',
            purpose: 'Allow customers to track their deliveries',
            costEstimate: '$3,000-$4,000',
            timeEstimate: '3-4 weeks',
            selected: true
          }
        ],
        enhancementFeatures: [
          {
            id: '3',
            name: 'Payment Gateway',
            description: 'Integration with popular payment providers',
            purpose: 'Enable in-app payments and transactions',
            costEstimate: '$2,500-$3,500',
            timeEstimate: '2-3 weeks',
            selected: false
          },
          {
            id: '4',
            name: 'Analytics Dashboard',
            description: 'Comprehensive analytics and reporting',
            purpose: 'Provide insights into delivery performance',
            costEstimate: '$4,000-$5,000',
            timeEstimate: '3-4 weeks',
            selected: false
          }
        ]
      };
      
      setAiAnalysisResult(mockAiAnalysis);
      setStep(3);
    } catch (error) {
      console.error('Error analyzing app description:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeatureSelectionSubmit = async (features: Feature[]) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to generate detailed report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate totals
      const selectedFeatures = features.filter(f => f.selected);
      const totalCostMin = selectedFeatures.reduce((sum, feature) => {
        const costRange = feature.costEstimate.replace(/[^0-9,-]/g, '');
        const minCost = parseInt(costRange.split('-')[0].replace(',', ''));
        return sum + minCost;
      }, 0);
      
      const totalCostMax = selectedFeatures.reduce((sum, feature) => {
        const costRange = feature.costEstimate.replace(/[^0-9,-]/g, '');
        const parts = costRange.split('-');
        const maxCost = parseInt(parts[1] ? parts[1].replace(',', '') : parts[0].replace(',', ''));
        return sum + maxCost;
      }, 0);
      
      // Mock detailed report
      const mockDetailedReport: DetailedReport = {
        appOverview: aiAnalysisResult?.appOverview || '',
        selectedFeatures,
        totalCost: `$${totalCostMin.toLocaleString()}-$${totalCostMax.toLocaleString()}`,
        totalTime: '2-4 months'
      };
      
      setDetailedReport(mockDetailedReport);
      setStep(4);
    } catch (error) {
      console.error('Error generating detailed report:', error);
    } finally {
      setIsProcessing(false);
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
            />
          )}
        </div>
      </div>
    </div>
  );
} 