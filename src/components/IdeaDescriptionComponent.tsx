'use client';

import { useState, useRef, useEffect } from 'react';

interface IdeaDescriptionComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (ideaDetails: IdeaDetails) => void;
  initialData?: IdeaDetails;
}

interface IdeaDetails {
  description: string;
  audioUrl: string | null;
}

export default function IdeaDescriptionComponent({ 
  isOpen, 
  onClose, 
  onBack,
  onContinue,
  initialData 
}: IdeaDescriptionComponentProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialData?.audioUrl || null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('ideaDescription');
    if (savedData && !initialData) {
      const parsed = JSON.parse(savedData);
      setDescription(parsed.description || '');
      setAudioUrl(parsed.audioUrl || null);
    }
  }, [initialData]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Save to localStorage
        const savedData = {
          description,
          audioUrl: url
        };
        localStorage.setItem('ideaDescription', JSON.stringify(savedData));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleContinue = () => {
    const ideaDetails: IdeaDetails = {
      description,
      audioUrl
    };
    
    // Save to localStorage before continuing
    localStorage.setItem('ideaDescription', JSON.stringify(ideaDetails));
    onContinue(ideaDetails);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    // Save to localStorage as user types
    const savedData = {
      description: e.target.value,
      audioUrl
    };
    localStorage.setItem('ideaDescription', JSON.stringify(savedData));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl">
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
          <h2 className="heading-lg mb-6 text-center">Describe Your App Idea</h2>
          <p className="text-neutral-600 text-center mb-8">
            Tell us about your app idea in detail. You can type it out or record a voice message.
          </p>

          <div className="space-y-8">
            {/* Text Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Describe Your App Idea *
              </label>
              <textarea
                id="description"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                placeholder="Describe your app idea in detail. What problem does it solve? Who is it for? What are the main features you envision?"
                value={description}
                onChange={handleDescriptionChange}
              ></textarea>
            </div>

            {/* Voice Recording */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Voice Recording</h3>
              
              <div className="flex flex-col items-center space-y-4">
                {/* Recording Controls */}
                <div className="flex items-center gap-4">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Start Recording
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop Recording
                    </button>
                  )}
                </div>

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="flex items-center text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    Recording in progress...
                  </div>
                )}

                {/* Audio Playback */}
                {audioUrl && (
                  <div className="w-full max-w-md">
                    <audio 
                      controls 
                      src={audioUrl}
                      className="w-full mt-4"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary px-6 py-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary px-8 py-3"
              disabled={!description.trim()}
            >
              Continue
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 