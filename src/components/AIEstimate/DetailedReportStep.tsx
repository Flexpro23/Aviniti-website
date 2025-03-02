'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { DetailedReport, Feature } from './AIEstimateModal';

interface DetailedReportStepProps {
  report: DetailedReport;
  onBack: () => void;
  onClose: () => void;
}

export default function DetailedReportStep({ report, onBack, onClose }: DetailedReportStepProps) {
  const { language } = useLanguage();
  
  // Function to mock downloading a PDF report
  const handleDownloadReport = () => {
    alert(language === 'en' 
      ? 'Report download functionality would be implemented here in production. This is a mock-up.' 
      : 'سيتم تنفيذ وظيفة تنزيل التقرير هنا في الإنتاج. هذا نموذج.');
  };

  return (
    <div>
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
              <p className="text-xl font-bold text-blue-900">{report.totalTime}</p>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              {language === 'en' ? 'Contact Us Now' : 'اتصل بنا الآن'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="px-8 py-3 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {language === 'en' ? 'Download Report' : 'تنزيل التقرير'}
            </button>
          </div>
        </div>
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
          {language === 'en' ? 'Back to Feature Selection' : 'العودة إلى اختيار الميزات'}
        </button>
      </div>
    </div>
  );
} 