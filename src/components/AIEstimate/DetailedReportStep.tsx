'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { DetailedReport, Feature, SuccessPotentialScores, StrategicAnalysis, PersonalDetails } from './AIEstimateModal';
import { useRef, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { motion } from 'framer-motion';
import KeyMetricCards from './KeyMetricCards';
import SuccessPotentialRadarChart from './SuccessPotentialRadarChart';
import CostBreakdownPieChart from './CostBreakdownPieChart';
import StrategicAnalysisCards from './StrategicAnalysisCards';
import TimelineVisualization from './TimelineVisualization';
import PDFBlueprint from './PDFBlueprint';

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
  // New prop for contact button
  onContactClick?: () => void;
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
  onContactClick
}: DetailedReportStepProps) {
  const { language } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(initialDownloadSuccess);
  
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

  // For time display, make sure it's clear we're showing days or months
  const getTimeLabel = (time: string) => {
    // Time will already be formatted as "X days" or "X-Y months" from AIEstimateModal
    // This is just an extra safeguard for any legacy "weeks" references
    return time.replace('weeks', 'days');
  };

  // Function to generate and download PDF - World-Class Page-by-Page Approach
  const handleDownloadReport = async () => {
    if (!pdfRef.current || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      console.log('Starting pixel-perfect PDF generation...');
      
      // Dynamically import the libraries only when needed
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      console.log('PDF libraries loaded successfully');
      
      // Create a new PDF document in A4 portrait format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Select all the individual page elements from our hidden blueprint
      const pages = pdfRef.current.querySelectorAll('.pdf-page');
      
      console.log(`Found ${pages.length} pages to render`);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        console.log(`Rendering page ${i + 1}/${pages.length}...`);
        
        // Capture each page as its own canvas
        const canvas = await html2canvas(page, {
          scale: 2, // Use a high scale for crisp quality
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Calculate the aspect ratio to fit the A4 page width perfectly
        const aspectRatio = canvas.height / canvas.width;
        const imgHeight = pdfWidth * aspectRatio;

        // Add a new page to the PDF for all pages after the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Add the captured page image to the current PDF page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        
        console.log(`Page ${i + 1} rendered successfully`);
      }

      // Generate dynamic filename based on user's name
      const userName = userInfo?.fullName
        ? userInfo.fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
        : 'User';
      const fileName = `${userName}-Aviniti-Project-Blueprint.pdf`;
      
      console.log('PDF generation complete, saving...');
      
      // Get the PDF as a blob for upload if needed
      const pdfBlob = pdf.output('blob');
      
      // If onUploadPdf is provided, upload the PDF first
      if (onUploadPdf) {
        try {
          console.log('Uploading PDF...');
          const downloadUrl = await onUploadPdf(pdfBlob);
          console.log('PDF uploaded successfully:', downloadUrl);
          
          // Save the PDF locally after successful upload with dynamic filename
          pdf.save(fileName);
          
          // Show success message using state instead of alert
          setDownloadSuccess(true);
          
          // Automatically hide the success message after 5 seconds
          setTimeout(() => {
            setDownloadSuccess(false);
          }, 5000);
        } catch (error) {
          console.error('Error uploading PDF:', error);
          // Still save the PDF locally even if upload fails with dynamic filename
          pdf.save(fileName);
          
          alert(language === 'en' 
            ? 'Your report was saved locally but could not be uploaded to the server. Please try again later.' 
            : 'تم حفظ تقريرك محليًا ولكن لم نتمكن من تحميله إلى الخادم. يرجى المحاولة مرة أخرى لاحقًا.');
        }
      } else {
        // If no upload function provided, just save locally with dynamic filename
        console.log('No upload function provided, saving PDF locally...');
        pdf.save(fileName);
        
        // Show success message
        setDownloadSuccess(true);
        setTimeout(() => {
          setDownloadSuccess(false);
        }, 5000);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'en' 
        ? 'There was an error generating your PDF. Please try again.' 
        : 'حدث خطأ في إنشاء ملف PDF الخاص بك. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Function to open the server-generated PDF
  const openServerReport = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
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
      
      <div id="printable-report" ref={reportRef} className="bg-gray-50 min-h-screen p-8">
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
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-slate-blue-400 to-slate-blue-600 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Project Overview</h3>
              </div>
              <p className="text-sm text-gray-600">Strategic analysis of your application concept</p>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{report.appOverview}</p>
          </motion.div>

          {/* Strategic Analysis Cards */}
          {report.strategicAnalysis && (
            <StrategicAnalysisCards strategicAnalysis={report.strategicAnalysis} />
          )}

          {/* Success Potential Radar Chart - Full Width */}
          {report.successPotentialScores && (
            <div className="mb-8">
              <SuccessPotentialRadarChart successScores={report.successPotentialScores} />
            </div>
          )}

          {/* Data Visualizations - Stacked Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Cost Breakdown - 2 columns */}
            <div className="lg:col-span-2">
              <CostBreakdownPieChart costBreakdown={report.costBreakdown} />
            </div>
            
            {/* Timeline - 3 columns */}
            <div className="lg:col-span-3">
              <TimelineVisualization timelinePhases={report.timelinePhases} />
            </div>
          </div>

          {/* Selected Features Table - Full Width */}
          <motion.div 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-gradient-to-r from-bronze-400 to-bronze-600 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Selected Features Breakdown</h3>
              </div>
              <p className="text-sm text-gray-600">Comprehensive feature specifications and development estimates</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Feature</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Purpose</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Cost</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {report.selectedFeatures.map((feature, index) => (
                    <tr 
                      key={feature.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="py-5 px-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{feature.name}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-slate-blue-50 text-slate-blue-800 border border-slate-blue-200">
                          {feature.purpose}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="font-semibold text-gray-900 text-lg">{feature.costEstimate}</span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span className="text-gray-700 font-medium">{feature.timeEstimate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-blue-50 border-t-2 border-slate-blue-200">
                    <td className="py-4 px-6 font-bold text-slate-blue-900" colSpan={2}>
                      Total Project Investment
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-blue-900 text-xl">
                      {report.totalCost}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-blue-900 text-lg">
                      {report.totalTime}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>

          {/* Project Insights */}
          <motion.div 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Market Analysis</h3>
                <p className="text-gray-700 leading-relaxed">{report.marketComparison}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Complexity</h3>
                <p className="text-gray-700 leading-relaxed">{report.complexityAnalysis}</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Hidden PDF Blueprint Component */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, opacity: 0, pointerEvents: 'none' }}>
        <div data-pdf-blueprint>
          <PDFBlueprint ref={pdfRef} data={report} />
        </div>
      </div>

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
          <button
            onClick={handleContactClick}
            className="px-8 py-3 bg-bronze-500 hover:bg-bronze-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center font-semibold"
          >
            {language === 'en' ? 'Contact Us Now' : 'اتصل بنا الآن'}
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
              onClick={handleDownloadReport}
              className="px-8 py-3 border border-slate-blue-600 text-slate-blue-600 hover:bg-slate-blue-600 hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center font-medium"
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
        
        {/* Loading helper text - now centered below both buttons */}
        {isGeneratingPDF && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {language === 'en' 
                ? 'This may take a moment. Please wait...' 
                : 'قد يستغرق هذا بضع لحظات. يرجى الانتظار...'}
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