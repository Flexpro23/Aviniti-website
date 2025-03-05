'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { PersonalDetails } from './AIEstimateModal';

interface UserInfoStepProps {
  onSubmit: (data: PersonalDetails) => void;
  onCancel: () => void;
  initialData: PersonalDetails;
}

export default function UserInfoStep({ onSubmit, onCancel, initialData }: UserInfoStepProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<PersonalDetails>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PersonalDetails, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = t.aiEstimate.steps.userInfo.errors.fullName;
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = t.aiEstimate.steps.userInfo.errors.emailRequired;
    } else if (!emailRegex.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = t.aiEstimate.steps.userInfo.errors.emailInvalid;
    }

    // Phone is completely optional (no validation)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {t.aiEstimate.steps.userInfo.title}
      </h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
        {t.aiEstimate.steps.userInfo.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              {t.aiEstimate.steps.userInfo.fullName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              required
              className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder={language === 'en' ? "John Doe" : "محمد أحمد"}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">
              {t.aiEstimate.steps.userInfo.emailAddress} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="emailAddress"
              required
              className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                errors.emailAddress ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder={language === 'en' ? "john@example.com" : "محمد@مثال.com"}
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            />
            {errors.emailAddress && (
              <p className="mt-1 text-sm text-red-500">{errors.emailAddress}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {t.aiEstimate.steps.userInfo.phoneNumber} <span className="text-gray-400 text-xs font-normal">{t.aiEstimate.steps.userInfo.optional}</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={language === 'en' ? "+1 (234) 567-8900" : "+٩٦٢ ٧٩ ١٢٣ ٤٥٦٧"}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              {t.aiEstimate.steps.userInfo.companyName} <span className="text-gray-400 text-xs font-normal">{t.aiEstimate.steps.userInfo.optional}</span>
            </label>
            <input
              type="text"
              id="companyName"
              className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={language === 'en' ? "Your Company" : "شركتك"}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {t.aiEstimate.steps.userInfo.cancel}
          </button>
          <button
            type="submit"
            className={`w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
              isSubmitting ? 'opacity-70 cursor-wait' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.aiEstimate.steps.userInfo.processing}
              </span>
            ) : (
              <span className="flex items-center">
                {t.aiEstimate.steps.userInfo.continue}
                <svg className={`ml-2 w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 