'use client';

import { useState } from 'react';

interface EstimateComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (userDetails: UserDetails) => void;
}

interface UserDetails {
  fullName: string;
  phoneNumber: string;
  companyName: string;
  emailAddress: string;
}

export default function EstimateComponent({ isOpen, onClose, onContinue }: EstimateComponentProps) {
  const [formData, setFormData] = useState<UserDetails>({
    fullName: '',
    phoneNumber: '',
    companyName: '',
    emailAddress: ''
  });

  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<UserDetails> = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onContinue(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="heading-lg mb-6 text-center">Get Your AI Estimate</h2>
          <p className="text-neutral-600 text-center mb-8">
            Please provide your details to receive an instant AI-powered estimate for your project.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  placeholder="+1 (234) 567-8900"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Your Company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.emailAddress ? 'border-red-500' : 'border-neutral-300'} focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                />
                {errors.emailAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.emailAddress}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-6 py-2"
              >
                Back to Home
              </button>
              <button
                type="submit"
                className={`btn-primary px-8 py-3 ${
                  !formData.fullName || !formData.phoneNumber || !formData.emailAddress
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={!formData.fullName || !formData.phoneNumber || !formData.emailAddress}
              >
                Continue
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 