'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { DetailedReport, Feature } from './AIEstimateModal';
import { useRef, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface DetailedReportStepProps {
  report: DetailedReport;
  onBack: () => void;
  onClose: () => void;
  // New props for server-generated reports
  isGeneratingServerReport?: boolean;
  reportUrl?: string | null;
  reportError?: string | null;
  onRegenerateReport?: () => void;
  onUploadPdf?: (pdfBlob: Blob) => Promise<string>;
  initialDownloadSuccess?: boolean;
}

export default function DetailedReportStep({ 
  report, 
  onBack, 
  onClose, 
  isGeneratingServerReport = false,
  reportUrl = null,
  reportError = null,
  onRegenerateReport,
  onUploadPdf,
  initialDownloadSuccess = false
}: DetailedReportStepProps) {
  const { language } = useLanguage();
  const reportRef = useRef<HTMLDivElement>(null);
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

  // Function to generate and download PDF
  const handleDownloadReport = async () => {
    if (!reportRef.current || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    try {
      console.log('Starting PDF generation...');
      
      // Dynamically import the libraries only when needed
      let jsPDF, html2canvas;
      try {
        const [jspdfModule, html2canvasModule] = await Promise.all([
          import('jspdf'),
          import('html2canvas')
        ]);
        jsPDF = jspdfModule.default;
        html2canvas = html2canvasModule.default;
        console.log('PDF libraries loaded successfully');
      } catch (error) {
        console.error('Failed to load PDF generation libraries:', error);
        throw new Error('Failed to initialize PDF generation');
      }
      
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
      reportRef.current.appendChild(tempDiv);
      
      console.log('Creating canvas...');
      
      // Create a canvas from the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for any images
        logging: true, // Enable logging for debugging
        onclone: (clonedDoc) => {
          // You can modify the cloned document before rendering if needed
          const element = clonedDoc.getElementById('report-container');
          if (element) {
            element.style.padding = '20px';
          }
        }
      });
      
      console.log('Canvas created successfully');
      
      // Remove the temporary contact information div after canvas creation
      reportRef.current.removeChild(tempDiv);
      
      const imgData = canvas.toDataURL('image/png');
      
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
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      console.log('PDF created successfully, getting blob...');
      
      // Get the PDF as a blob
      const pdfBlob = pdf.output('blob');
      
      console.log('PDF blob created, size:', pdfBlob.size);
      
      // If onUploadPdf is provided, upload the PDF first
      if (onUploadPdf) {
        try {
          console.log('Uploading PDF...');
          const downloadUrl = await onUploadPdf(pdfBlob);
          console.log('PDF uploaded successfully:', downloadUrl);
          
          // Save the PDF locally after successful upload
          pdf.save('Aviniti_App_Development_Report.pdf');
          
          // Show success message using state instead of alert
          setDownloadSuccess(true);
          
          // Automatically hide the success message after 5 seconds
          setTimeout(() => {
            setDownloadSuccess(false);
          }, 5000);
        } catch (error) {
          console.error('Error uploading PDF:', error);
          // Still save the PDF locally even if upload fails
          pdf.save('Aviniti_App_Development_Report.pdf');
          
          alert(language === 'en' 
            ? 'Your report was saved locally but could not be uploaded to the server. Please try again later.' 
            : 'تم حفظ تقريرك محليًا ولكن لم نتمكن من تحميله إلى الخادم. يرجى المحاولة مرة أخرى لاحقًا.');
        }
      } else {
        // If no upload function provided, just save locally
        console.log('No upload function provided, saving PDF locally...');
        pdf.save('Aviniti_App_Development_Report.pdf');
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

  return (
    <div>
      {/* Success Message Notification */}
      {downloadSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {language === 'en' 
                  ? 'Your report has been successfully downloaded and saved!' 
                  : 'تم تنزيل تقريرك وحفظه بنجاح!'}
              </h3>
            </div>
          </div>
        </div>
      )}
      
      <div id="report-container" ref={reportRef}>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          {language === 'en' ? 'Detailed App Development Report' : 'تقرير مفصل عن تطوير التطبيق'}
        </h2>
        <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
          {language === 'en'
            ? "Here's a detailed breakdown of your app development estimate based on your selected features."
            : 'إليك تفصيل مفصل لتقدير تطوير تطبيقك بناءً على الميزات التي اخترتها.'}
        </p>

        <div className="space-y-8">
          {/* App Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {language === 'en' ? 'App Overview' : 'نظرة عامة على التطبيق'}
            </h3>
            <p className="text-gray-700">{report.appOverview}</p>
          </div>

          {/* Feature Details */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              {language === 'en' ? 'Feature Details and Estimates' : 'تفاصيل الميزات والتقديرات'}
            </h3>
            
            {/* Table Header */}
            <div className="hidden sm:grid sm:grid-cols-5 bg-gray-100 p-3 rounded-t-lg font-medium text-sm text-gray-700">
              <div className="col-span-2">
                {language === 'en' ? 'Feature Name & Description' : 'اسم الميزة والوصف'}
              </div>
              <div>
                {language === 'en' ? 'Purpose in App' : 'الغرض في التطبيق'}
              </div>
              <div className="text-center">
                {language === 'en' ? 'Cost Estimate' : 'تقدير التكلفة'}
              </div>
              <div className="text-center">
                {language === 'en' ? 'Time Estimate' : 'تقدير الوقت'}
              </div>
            </div>
            
            {/* Feature Rows */}
            <div className="border border-gray-200 rounded-lg sm:rounded-t-none divide-y divide-gray-200">
              {report.selectedFeatures.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className={`p-4 sm:grid sm:grid-cols-5 gap-3 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* Feature Name & Description */}
                  <div className="col-span-2 mb-3 sm:mb-0">
                    <h4 className="font-medium text-gray-900">{feature.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                  
                  {/* Purpose */}
                  <div className="mb-3 sm:mb-0">
                    <p className="text-sm text-gray-600">{feature.purpose}</p>
                  </div>
                  
                  {/* Cost */}
                  <div className="text-center mb-3 sm:mb-0">
                    <p className="text-sm font-medium text-gray-900">{feature.costEstimate}</p>
                  </div>
                  
                  {/* Time */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{feature.timeEstimate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-blue-100 p-5 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {language === 'en' ? 'Project Summary' : 'ملخص المشروع'}
            </h3>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Total Estimated Cost:' : 'التكلفة الإجمالية المقدرة:'}
                </p>
                <p className="text-xl font-bold text-blue-900">{report.totalCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Total Estimated Time:' : 'الوقت الإجمالي المقدر:'}
                </p>
                <p className="text-xl font-bold text-blue-900" data-testid="detailed-time">
                  {getTimeLabel(report.totalTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'en' ? 'Number of Features:' : 'عدد الميزات:'}
                </p>
                <p className="text-xl font-bold text-blue-900">{report.selectedFeatures.length}</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-4">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {language === 'en' 
                ? 'Ready to get started? Contact us to discuss your project further!' 
                : 'هل أنت مستعد للبدء؟ اتصل بنا لمناقشة مشروعك بالتفصيل!'}
            </p>
          </div>
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
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
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
            className="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            disabled={isGeneratingPDF || isGeneratingServerReport}
          >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            {language === 'en' ? 'Download Report' : 'تحميل التقرير'}
          </button>
        )}
      </div>

      <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-sm sm:text-base border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 flex items-center justify-center"
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