'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { ReportData as DetailedReport } from '@/types/report';
import { PersonalDetails } from '@/types/estimate';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import KeyMetricCards from './KeyMetricCards';
import SuccessPotentialRadarChart from './SuccessPotentialRadarChart';
import CostBreakdownPieChart from './CostBreakdownPieChart';
import StrategicAnalysisCards from './StrategicAnalysisCards';
import TimelineVisualization from './TimelineVisualization';
import { generateClientSidePDF } from '@/services/pdfService';
import { ScheduleButton } from '@/components/CalendarBooking';

interface DetailedReportStepProps {
  report: DetailedReport;
  userInfo: PersonalDetails;
  onBack: () => void;
  onClose: () => void;
  // New props for server-generated reports
  isGeneratingServerReport?: boolean;
  reportUrl?: string | null;
  reportError?: string | null;
  onRegenerateReport?: () => void;
  onUploadPdf?: (pdfBlob: Blob) => Promise<string>;
  initialDownloadSuccess?: boolean;
  onContactClick?: () => void;
  // New prop for testing or customization
  generationDelay?: number;
}

export default function DetailedReportStep({
  report,
  userInfo,
  onBack,
  onClose,
  isGeneratingServerReport = false,
  reportUrl = null,
  reportError = null,
  onRegenerateReport,
  onUploadPdf,
  initialDownloadSuccess = false,
  onContactClick,
  generationDelay = 1000
}: DetailedReportStepProps) {
  const { language } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(initialDownloadSuccess);

  // New state for proactive background generation
  const [isGeneratingInBackground, setIsGeneratingInBackground] = useState(false);
  const [serverReportUrl, setServerReportUrl] = useState<string | null>(null);

  // Set downloadSuccess when initialDownloadSuccess changes
  useEffect(() => {
    if (initialDownloadSuccess) {
      setDownloadSuccess(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setDownloadSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [initialDownloadSuccess]);

  // Convert report to ReportData format for native PDF
  const getReportData = () => {
    return {
      appOverview: report.appOverview,
      totalCost: report.totalCost,
      totalTime: report.totalTime,
      userName: userInfo.fullName,
      userEmail: userInfo.emailAddress,
      userCompany: userInfo.companyName,
      selectedFeatures: report.selectedFeatures.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        category: f.purpose || 'General',
        timeEstimate: f.timeEstimate,
        costEstimate: f.costEstimate,
        purpose: f.purpose,
      })),
      successPotentialScores: report.successPotentialScores || {
        innovation: 7,
        marketViability: 7,
        monetization: 7,
        technicalFeasibility: 7,
      },
      costBreakdown: report.costBreakdown,
      strategicAnalysis: report.strategicAnalysis || {
        strengths: 'Strong market potential',
        challenges: 'Competition in the market',
        recommendedMonetization: 'Subscription-based model',
      },
      timelinePhases: report.timelinePhases,
    };
  };

  // Reusable function to generate and upload PDF (for background and on-demand generation)
  const generateAndUploadPdf = async (): Promise<string | null> => {
    try {
      console.log('Starting PDF generation service...');

      // Use native PDF generation with report data for vector-based output
      const pdfBlob = await generateClientSidePDF({
        reportData: getReportData(),
        elementId: 'pdf-blueprint-hidden-container', // Fallback if native fails
        fileName: 'blueprint.pdf',
        onProgress: (msg) => console.log(msg)
      });

      console.log('PDF generation complete, preparing for upload...');

      // If onUploadPdf is provided, upload the PDF and return the URL
      if (onUploadPdf) {
        try {
          console.log('Uploading PDF to server...');
          const downloadUrl = await onUploadPdf(pdfBlob);
          console.log('PDF uploaded successfully:', downloadUrl);
          return downloadUrl; // Return the Firebase Storage URL
        } catch (error) {
          console.error('Error uploading PDF:', error);
          return null; // Return null on upload failure
        }
      } else {
        console.log('No upload function provided');
        return null;
      }

    } catch (error) {
      console.error('Background PDF generation failed:', error);
      return null; // Return null on generation failure
    }
  };

  // Proactive PDF generation on component mount
  useEffect(() => {
    const proactivelyGenerateReport = async () => {
      console.log('Starting proactive PDF generation in background...');
      setIsGeneratingInBackground(true);

      try {
        const url = await generateAndUploadPdf();
        if (url) {
          setServerReportUrl(url); // Save the Firebase Storage URL on success
          console.log('Background PDF generation completed successfully:', url);
        } else {
          console.log('Background PDF generation failed, will fall back to on-demand generation');
        }
      } catch (error) {
        console.error('Error in proactive PDF generation:', error);
      } finally {
        setIsGeneratingInBackground(false);
      }
    };

    // Only run proactive generation if onUploadPdf function is available
    // and we don't already have a server report URL
    // And wait a bit for render
    if (onUploadPdf && !serverReportUrl && !isGeneratingInBackground) {
      setTimeout(proactivelyGenerateReport, generationDelay);
    }
  }, []);


  // Function to generate PDF locally and download immediately (fallback method)
  const generateLocalPdfBlob = async (): Promise<Blob | null> => {
    try {
      console.log('Generating PDF locally for immediate download...');
      return await generateClientSidePDF({
        reportData: getReportData(),
        elementId: 'pdf-blueprint-hidden-container', // Fallback
        fileName: 'blueprint.pdf'
      });
    } catch (error) {
      console.error('Error generating local PDF:', error);
      throw error;
    }
  };

  // Function to open the server-generated PDF
  const openServerReport = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  // Intelligent download click handler - checks if report is ready or falls back to local generation
  const handleDownloadClick = async () => {
    // If the report is already generated and uploaded, download it instantly
    if (serverReportUrl) {
      console.log('Downloading pre-generated report from server:', serverReportUrl);

      try {
        // Generate dynamic filename based on user's name
        const userName = userInfo?.fullName
          ? userInfo.fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
          : 'User';
        const fileName = `${userName}-Aviniti-Project-Blueprint.pdf`;

        // Fetch the PDF blob from the server URL and force download
        const response = await fetch(serverReportUrl);
        const pdfBlob = await response.blob();

        // Create a blob URL and trigger download
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

        // Show success message
        setDownloadSuccess(true);
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 5000);
      } catch (error) {
        console.error('Error downloading pre-generated PDF:', error);
        // If direct download fails, open in new tab as fallback
        window.open(serverReportUrl, '_blank');
      }
      return;
    }

    // If the background process is still running, let the user know
    if (isGeneratingInBackground) {
      alert(language === 'en'
        ? 'Your report is being prepared in the background. Please wait a moment and try again.'
        : 'يتم إعداد تقريرك في الخلفية. يرجى الانتظار لحظة والمحاولة مرة أخرى.');
      return;
    }

    // If background generation failed, fall back to local generation and download
    console.log('Falling back to local PDF generation...');
    setIsGeneratingPDF(true);

    try {
      const pdfBlob = await generateLocalPdfBlob();

      if (pdfBlob) {
        // Generate dynamic filename based on user's name
        const userName = userInfo?.fullName
          ? userInfo.fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
          : 'User';
        const fileName = `${userName}-Aviniti-Project-Blueprint.pdf`;

        // Create a temporary URL and trigger download
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success message
        setDownloadSuccess(true);
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error in fallback PDF generation:', error);
      alert(language === 'en'
        ? 'There was an error generating your PDF. Please try again.'
        : 'حدث خطأ في إنشاء ملف PDF الخاص بك. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Function to handle contact button click
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      onClose(); // Fallback to onClose if onContactClick is not provided
    }
  };

  // Calculate average success score for metrics
  const averageSuccessScore = report.successPotentialScores ?
    Math.round(
      (report.successPotentialScores.innovation +
        report.successPotentialScores.marketViability +
        report.successPotentialScores.monetization +
        report.successPotentialScores.technicalFeasibility) / 4
    ) : 7;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      {/* Success Message Notification */}
      {downloadSuccess && (
        <motion.div
          className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {language === 'en'
                  ? 'Your Project Blueprint has been successfully generated!'
                  : 'تم إنشاء مخطط مشروعك بنجاح!'}
              </h3>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        id="printable-report"
        ref={reportRef}
        className="bg-gray-50 min-h-screen p-3 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Executive Dashboard Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Executive Project Blueprint' : 'مخطط المشروع التنفيذي'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'en'
              ? "Strategic analysis and comprehensive development roadmap for your application"
              : 'تحليل استراتيجي وخارطة طريق شاملة لتطوير تطبيقك'}
          </p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-bronze-400 to-bronze-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Key Metrics Cards */}
          <KeyMetricCards
            totalCost={report.totalCost}
            totalTime={report.totalTime}
            successScore={averageSuccessScore}
            featuresCount={report.selectedFeatures.length}
          />

          {/* App Overview Section */}
          <motion.div
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-slate-blue-400 to-slate-blue-600 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Project Overview</h3>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{report.appOverview}</p>
          </motion.div>

          {/* Strategic Analysis Cards (Replaces Market & Complexity Sections) */}
          {report.strategicAnalysis && (
            <StrategicAnalysisCards
              strategicAnalysis={{
                ...report.strategicAnalysis,
                marketComparison: report.marketComparison,
                complexityAnalysis: report.complexityAnalysis
              }}
            />
          )}

          {/* Success Potential Radar Chart - Full Width */}
          {report.successPotentialScores && (
            <div className="mb-6">
              <SuccessPotentialRadarChart successScores={report.successPotentialScores} />
            </div>
          )}

          {/* Data Visualizations - Stacked Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 mb-6">
            {/* Cost Breakdown - 2 columns */}
            <div className="lg:col-span-2">
              <CostBreakdownPieChart costBreakdown={report.costBreakdown} />
            </div>

            {/* Timeline - 3 columns */}
            <div className="lg:col-span-3">
              <TimelineVisualization timelinePhases={report.timelinePhases} />
            </div>
          </div>

          {/* Selected Features Table - Minimal Grid */}
          <motion.div
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-lg mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-bronze-400 to-bronze-600 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Selected Features Breakdown</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {report.selectedFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:border-bronze-200 transition-colors flex flex-col justify-between h-full"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 leading-tight">{feature.name}</h4>
                  </div>
                  <div className="flex justify-between items-end pt-2 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Cost</span>
                      <span className="text-sm font-bold text-bronze-600">{feature.costEstimate}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Time</span>
                      <span className="text-xs font-medium text-gray-700">{feature.timeEstimate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-slate-blue-900">Total Project Investment</span>
              <div className="text-right">
                <span className="block font-bold text-slate-blue-900 text-xl">{report.totalCost.replace(/^\$+/g, '$')}</span>
                <span className="text-sm text-gray-500">{report.totalTime}</span>
              </div>
            </div>
          </motion.div>



        </motion.div>
      </motion.div>

      {/* Loading State */}
      {isGeneratingServerReport && !reportError && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {language === 'en' ? 'Generating report...' : 'جاري إنشاء التقرير...'}
              </h3>
              <p className="mt-1 text-sm text-blue-600">
                {language === 'en'
                  ? 'This may take a few moments. Please wait...'
                  : 'قد يستغرق هذا بضع لحظات. يرجى الانتظار...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex flex-col items-center gap-4 mt-8">
        {/* Main action buttons row */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          {/* Schedule Consultation Button */}
          <ScheduleButton
            prefillName={userInfo?.fullName ?? ''}
            prefillEmail={userInfo?.emailAddress ?? ''}
            source="detailed-report"
            variant="primary"
            className="px-8 py-3"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {language === 'en' ? 'Schedule Consultation' : 'حجز استشارة'}
            </span>
          </ScheduleButton>

          <button
            onClick={handleContactClick}
            className="px-8 py-3 border border-slate-blue-300 hover:border-slate-blue-400 text-slate-blue-600 hover:bg-slate-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {language === 'en' ? 'Send Message' : 'أرسل رسالة'}
          </button>

          {reportUrl ? (
            <button
              onClick={openServerReport}
              className="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {language === 'en' ? 'View Generated Report' : 'عرض التقرير المولد'}
            </button>
          ) : (
            <button
              onClick={handleDownloadClick}
              className={`px-8 py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-medium ${serverReportUrl
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' // Ready state - green
                : isGeneratingInBackground
                  ? 'border border-blue-600 text-blue-600 bg-blue-50 cursor-not-allowed' // Preparing state - blue
                  : 'border border-slate-blue-600 text-slate-blue-600 hover:bg-slate-blue-600 hover:text-white' // Default state
                }`}
              disabled={isGeneratingPDF || isGeneratingServerReport}
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'en' ? 'Generating Blueprint...' : 'إنشاء المخطط...'}
                </>
              ) : serverReportUrl ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {language === 'en' ? 'Download Report' : 'تحميل التقرير'}
                </>
              ) : isGeneratingInBackground ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'en' ? 'Preparing Blueprint...' : 'إعداد المخطط...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {language === 'en' ? 'Download Report' : 'تحميل التقرير'}
                </>
              )}
            </button>
          )}
        </div>

        {/* Loading helper text - shows different messages based on state */}
        {(isGeneratingPDF || isGeneratingInBackground) && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isGeneratingInBackground
                ? (language === 'en'
                  ? 'Preparing your report in the background for instant access...'
                  : 'إعداد تقريرك في الخلفية للوصول الفوري...')
                : (language === 'en'
                  ? 'This may take a moment. Please wait...'
                  : 'قد يستغرق هذا بضع لحظات. يرجى الانتظار...')
              }
            </p>
          </div>
        )}

        {/* Success indicator when report is ready */}
        {serverReportUrl && !isGeneratingInBackground && (
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">
              {language === 'en'
                ? '✅ Your report is ready for instant download!'
                : '✅ تقريرك جاهز للتحميل الفوري!'}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-sm sm:text-base border border-gray-300 hover:border-gray-400 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          <svg className={`w-5 h-5 ${language === 'ar' ? '' : 'mr-2'} ${language === 'ar' ? 'ml-2 transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {language === 'en' ? 'Back to Features' : 'العودة إلى الميزات'}
        </button>
      </div>
    </div>
  );
}
