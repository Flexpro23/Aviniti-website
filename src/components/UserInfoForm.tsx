'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDoc, doc, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { createUserDocument, type PersonalDetails } from '../lib/firebase-utils';

interface UserInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (userInfo: PersonalDetails, userId: string) => void;
}

export default function UserInfoForm({ isOpen, onClose, onContinue }: UserInfoFormProps) {
  const [formData, setFormData] = useState<PersonalDetails>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    companyName: ''
  });

  const [errors, setErrors] = useState<Partial<PersonalDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Test Firebase connection on component mount
  useEffect(() => {
    async function checkFirebaseConnection() {
      try {
        console.log('Testing Firebase connection...');
        if (!db) {
          console.error('Firebase DB is not initialized');
          setFirebaseStatus('error');
          return;
        }

        // Attempt to query Firestore
        const testQuery = query(collection(db, 'users'), limit(1));
        await getDocs(testQuery);
        console.log('Firebase connection successful');
        setFirebaseStatus('connected');
      } catch (error) {
        console.error('Firebase connection test failed:', error);
        setFirebaseStatus('error');
      }
    }

    if (isOpen) {
      checkFirebaseConnection();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Partial<PersonalDetails> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (firebaseStatus !== 'connected') {
      setErrors({
        fullName: 'Firebase connection error. Please try again later.'
      });
      alert('Cannot connect to the database. Please check your internet connection and try again.');
      return;
    }

    setIsSubmitting(true);
    console.log('Starting form submission...', formData);

    try {
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase database is not initialized');
      }

      console.log('Creating user document in Firestore...');
      // Create user document in Firestore
      const usersRef = collection(db, 'users');
      console.log('Collection reference created');

      const docData = {
        personalDetails: formData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Document data prepared:', docData);
      const docRef = await addDoc(usersRef, docData);
      console.log('Document created with ID:', docRef.id);

      // Verify the document was created by trying to read it back
      try {
        const docSnap = await getDoc(doc(db, 'users', docRef.id));
        if (docSnap.exists()) {
          console.log('Verified document was created successfully');
        } else {
          console.error('Document creation verification failed - document not found');
        }
      } catch (verifyError) {
        console.error('Error verifying document creation:', verifyError);
      }

      onContinue(formData, docRef.id);
    } catch (error) {
      console.error('Error saving user info:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      setErrors({
        fullName: 'Failed to save information. Please try again. Error: ' + 
                  (error instanceof Error ? error.message : 'Unknown error')
      });
      
      // Show an alert with the error to make it more visible
      alert('Error saving data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Get Your AI Estimate</h2>
          <p className="text-neutral-600 text-center text-sm sm:text-base mb-8">
            Please provide your details to receive an instant AI-powered estimate for your project.
          </p>

          {firebaseStatus === 'error' && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              Warning: There seems to be an issue connecting to our database. Your data might not be saved properly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                    errors.fullName ? 'border-red-500' : 'border-neutral-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
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
                  className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-neutral-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
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
                  className="w-full px-4 py-2 text-sm sm:text-base rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
                  className={`w-full px-4 py-2 text-sm sm:text-base rounded-lg border ${
                    errors.emailAddress ? 'border-red-500' : 'border-neutral-300'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                  placeholder="john@example.com"
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                />
                {errors.emailAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.emailAddress}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 hover:text-neutral-900 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`w-full sm:w-auto btn-primary px-8 py-3 text-sm sm:text-base ${
                  isSubmitting || !formData.fullName || !formData.phoneNumber || !formData.emailAddress
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={isSubmitting || !formData.fullName || !formData.phoneNumber || !formData.emailAddress}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    Continue
                    <svg className="ml-2 w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 