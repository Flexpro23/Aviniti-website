'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/processing-animations.css';

interface ProcessingComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  userDetails: {
    fullName: string;
    phoneNumber: string;
    companyName: string;
    emailAddress: string;
  };
  ideaDetails: {
    description: string;
    audioUrl: string | null;
  };
  questionnaireAnswers: {
    targetAudience: string[];
    platformType: string;
    developmentTimeline: string;
    budget: string;
    keyFeatures: string[];
    monetizationStrategy: string[];
    competitorNames: string;
    securityRequirements: string[];
    scalabilityNeeds: string;
    integrationRequirements: string[];
    customization: string;
    maintenanceSupport: string[];
  };
}

interface ProcessingStatus {
  step: 'transcribing' | 'analyzing' | 'complete' | 'error';
  message: string;
  progress: number;
  timeRemaining?: number;
  retryCount?: number;
}

interface ErrorSubmissionForm {
  preferredContact: 'phone' | 'email';
  phoneNumber: string;
  emailAddress: string;
  additionalNotes?: string;
}

export default function ProcessingComponent({
  isOpen,
  onClose,
  onBack,
  userDetails,
  ideaDetails,
  questionnaireAnswers
}: ProcessingComponentProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ProcessingStatus>({
    step: 'transcribing',
    message: 'Transcribing audio...',
    progress: 0,
    timeRemaining: 60
  });
  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<ErrorSubmissionForm>({
    preferredContact: 'email',
    phoneNumber: userDetails?.phoneNumber || '',
    emailAddress: userDetails?.emailAddress || '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer effect for countdown
  useEffect(() => {
    if (!isOpen || status.step === 'complete' || status.step === 'error') return;

    const timer = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        timeRemaining: prev.timeRemaining && prev.timeRemaining > 0 ? prev.timeRemaining - 1 : 0
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, status.step]);

  // Update error form when userDetails changes
  useEffect(() => {
    if (userDetails) {
      setErrorForm(prev => ({
        ...prev,
        phoneNumber: userDetails.phoneNumber,
        emailAddress: userDetails.emailAddress
      }));
    }
  }, [userDetails]);

  useEffect(() => {
    if (!isOpen) return;

    const processData = async () => {
      try {
        // Reset state
        setError(null);
        setStatus({
          step: 'transcribing',
          message: 'Preparing to process your request...',
          progress: 0,
          timeRemaining: 60
        });

        // Delay to show initial state
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 1: Process audio if exists
        let transcribedText = '';
        if (ideaDetails.audioUrl) {
          setStatus({
            step: 'transcribing',
            message: 'Processing voice recording...',
            progress: 25,
            timeRemaining: 45
          });

          try {
            const audioBlob = await fetch(ideaDetails.audioUrl).then(r => r.blob());
            const formData = new FormData();
            formData.append('audio', audioBlob);
            formData.append('userDetails', JSON.stringify(userDetails));
            formData.append('ideaDetails', JSON.stringify(ideaDetails));
            formData.append('questionnaireAnswers', JSON.stringify(questionnaireAnswers));

            const transcriptionResponse = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData
            });

            if (!transcriptionResponse.ok) {
              const errorData = await transcriptionResponse.json();
              throw new Error(errorData.error || 'Failed to transcribe audio');
            }

            const transcriptionData = await transcriptionResponse.json();
            transcribedText = transcriptionData.text;
          } catch (transcriptionError) {
            console.error('Transcription error:', transcriptionError);
            throw new Error('Failed to process audio recording. Please try again.');
          }
        }

        // Step 2: Analyze all data
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 2000; // 2 seconds

        const analyzeData = async (): Promise<any> => {
          try {
            setStatus(prev => ({
              ...prev,
              step: 'analyzing',
              message: retryCount > 0 
                ? `Retrying analysis (Attempt ${retryCount + 1}/${maxRetries})...`
                : 'Analyzing your project requirements...',
              progress: 50,
              timeRemaining: 30,
              retryCount
            }));

            const analysisResponse = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userDetails,
                ideaDetails: {
                  ...ideaDetails,
                  transcribedText
                },
                questionnaireAnswers
              })
            });

            let responseData;
            try {
              const responseText = await analysisResponse.text();
              console.log('Raw API Response:', responseText); // Log raw response for debugging
              
              try {
                responseData = JSON.parse(responseText);
              } catch (parseError) {
                console.error('Failed to parse API response:', parseError);
                throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
              }
            } catch (parseError) {
              console.error('Failed to read API response:', parseError);
              if (retryCount < maxRetries) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return analyzeData();
              }
              throw new Error('Failed to process API response after multiple attempts.');
            }

            if (!analysisResponse.ok) {
              const errorMessage = responseData?.error || 'Unknown error occurred';
              const errorDetails = responseData?.details || '';
              const errorInfo = {
                status: analysisResponse.status,
                statusText: analysisResponse.statusText,
                error: errorMessage,
                details: errorDetails,
                response: responseData,
                timestamp: new Date().toISOString()
              };
              
              // Log the complete error information
              console.error('Analysis error response:', JSON.stringify(errorInfo, null, 2));

              if (retryCount < maxRetries) {
                console.log(`Retrying analysis (Attempt ${retryCount + 1}/${maxRetries})...`);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return analyzeData();
              }

              // Include more context in the error message
              const fullErrorMessage = [
                errorMessage,
                errorDetails,
                `Status: ${analysisResponse.status} ${analysisResponse.statusText}`,
                responseData?.errorType ? `Error Type: ${responseData.errorType}` : null
              ].filter(Boolean).join('\n');

              throw new Error(fullErrorMessage);
            }

            // Validate the response structure
            if (!responseData || typeof responseData !== 'object') {
              console.error('Invalid response format:', responseData);
              throw new Error('Invalid response format received.');
            }

            if (!responseData.requestedFeatures || !responseData.overview) {
              console.error('Invalid response structure:', responseData);
              if (retryCount < maxRetries) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return analyzeData();
              }
              throw new Error('Invalid analysis results structure.');
            }

            // Save initial analysis data to localStorage
            localStorage.setItem('initialAnalysis', JSON.stringify({
              userDetails,
              ideaDetails: {
                ...ideaDetails,
                transcribedText
              },
              questionnaireAnswers
            }));

            // Save analysis results to localStorage
            localStorage.setItem('analysisResults', JSON.stringify(responseData));

            return responseData;
          } catch (error) {
            if (retryCount < maxRetries) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return analyzeData();
            }
            throw error;
          }
        };

        try {
          const analysisResults = await analyzeData();

          // Update status to complete
          setStatus({
            step: 'complete',
            message: 'Analysis complete! Redirecting to results...',
            progress: 100
          });

          // Short delay before redirect
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Navigate to feature selection page
          router.push('/feature-selection');

        } catch (analysisError) {
          console.error('Analysis error:', analysisError);
          const errorMessage = analysisError instanceof Error
            ? analysisError.message
            : 'An unexpected error occurred during analysis.';
          
          setError(`${errorMessage} Please try submitting your request manually.`);
          setStatus({
            step: 'error',
            message: 'Error processing data',
            progress: 0,
            timeRemaining: 0
          });
        }

      } catch (err) {
        console.error('Processing error:', err);
        const errorMessage = err instanceof Error
          ? err.message
          : 'An unexpected error occurred.';
        
        setError(`${errorMessage} Please try submitting your request manually.`);
        setStatus({
          step: 'error',
          message: 'Error processing data',
          progress: 0,
          timeRemaining: 0
        });
      }
    };

    processData();
  }, [isOpen, userDetails, ideaDetails, questionnaireAnswers, router]);

  const handleErrorSubmission = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl">
        <div className="p-8">
          <h2 className="heading-lg mb-6 text-center">
            {error ? 'Error Processing Request' : 'Processing Your Request'}
          </h2>

          {!error ? (
            <>
              {/* AI-styled Progress Bar */}
              <div className="mb-8">
                <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 animate-gradient"></div>
                  
                  {/* Progress Overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                    style={{ width: `${status.progress}%` }}
                  >
                    {/* Pulse Effect */}
                    <div className="absolute right-0 top-0 h-full w-4 bg-white opacity-20 animate-pulse-flow"></div>
                    
                    {/* Data Flow Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="data-flow-animation"></div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-neutral-700 mb-2">
                    {status.message}
                  </p>
                  {status.timeRemaining !== undefined && status.timeRemaining > 0 && (
                    <p className="text-sm text-neutral-500">
                      Estimated time remaining: {status.timeRemaining} seconds
                    </p>
                  )}
                </div>
              </div>

              {/* Processing Animation */}
              <div className="flex justify-center mb-8">
                {status.step !== 'complete' && (
                  <div className="relative">
                    {/* Neural Network Animation */}
                    <div className="neural-network-animation">
                      <div className="nodes">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="node"></div>
                        ))}
                      </div>
                      <div className="connections">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="connection"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {status.step === 'complete' && (
                  <div className="w-24 h-24 flex items-center justify-center text-primary-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Error Handling UI
            <div className="space-y-6">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-full bg-red-100 mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-600 font-medium mb-2">{error}</p>
                    <p className="text-neutral-600">
                      We apologize for the inconvenience. Let us process your request manually.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={errorForm.preferredContact === 'email'}
                            onChange={() => setErrorForm({ ...errorForm, preferredContact: 'email' })}
                            className="form-radio h-4 w-4 text-primary-600"
                          />
                          <span className="ml-2">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={errorForm.preferredContact === 'phone'}
                            onChange={() => setErrorForm({ ...errorForm, preferredContact: 'phone' })}
                            className="form-radio h-4 w-4 text-primary-600"
                          />
                          <span className="ml-2">Phone</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={errorForm.emailAddress}
                        onChange={(e) => setErrorForm({ ...errorForm, emailAddress: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={errorForm.phoneNumber}
                        onChange={(e) => setErrorForm({ ...errorForm, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={errorForm.additionalNotes}
                        onChange={(e) => setErrorForm({ ...errorForm, additionalNotes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 resize-none"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={onBack}
                      className="btn-secondary px-6 py-2"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleErrorSubmission}
                      disabled={isSubmitting}
                      className={`btn-primary px-8 py-3 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // Success Message after submission
                <div className="text-center py-8">
                  <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">Request Submitted Successfully</h3>
                  <p className="text-neutral-600 mb-6">
                    Our team will process your request and contact you via your preferred method ({errorForm.preferredContact}) within 24 hours.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="btn-primary px-8 py-3"
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 