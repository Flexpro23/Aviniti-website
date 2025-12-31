import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Message } from './ChatMessage';

interface AudioInputButtonProps {
  onTranscription: (message: Message) => void;
  onError: (error: string) => void;
  onSpeechPause?: (transcript: string) => void;
  isAIResponding?: boolean;
  disabled?: boolean;
  className?: string;
}

const WS_URL = process.env.NEXT_PUBLIC_TRANSCRIPTION_WS_URL || 'ws://localhost:8080';

const AudioInputButton: React.FC<AudioInputButtonProps> = ({
  onTranscription,
  onError,
  onSpeechPause,
  isAIResponding = false,
  disabled = false,
  className = ''
}) => {
  const [conversationActive, setConversationActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const vadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef('');

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const cleanup = useCallback(() => {
    // Stop VAD timer
    if (vadTimerRef.current) {
      clearTimeout(vadTimerRef.current);
      vadTimerRef.current = null;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    mediaRecorderRef.current = null;

    // Stop tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }

    // Close WS
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try { wsRef.current.close(); } catch {}
    }
    wsRef.current = null;

    setIsSpeaking(false);
    setCurrentTranscript('');
    lastTranscriptRef.current = '';
    setIsConnecting(false);
  }, []);

  const startRecording = async () => {
    try {
      setIsConnecting(true);

      // Request microphone permission and stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Establish WebSocket connection
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConversationActive(true);
        setIsConnecting(false);
        // Optionally notify backend start
        try { ws.send(JSON.stringify({ type: 'start' })); } catch {}

        // Setup MediaRecorder after WS is open
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (event) => {
          if (!event.data || event.data.size === 0) return;

          // Send raw audio chunk through WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            try {
              const arrayBuffer = await event.data.arrayBuffer();
              wsRef.current.send(arrayBuffer);
            } catch (err) {
              console.error('Failed to send audio chunk:', err);
            }
          }
        };

        mediaRecorder.onerror = (e: any) => {
          console.error('MediaRecorder error:', e?.error || e);
          onError('Recording error occurred.');
        };

        // Emit chunks frequently for low latency
        try { mediaRecorder.start(250); } catch (e) {
          console.error('Failed to start MediaRecorder:', e);
          onError('Failed to start microphone recording.');
          cleanup();
          setConversationActive(false);
          return;
        }
      };

      ws.onmessage = (event) => {
        try {
          // Backend might send JSON control/status or raw transcript strings
          let payload: any;
          try {
            payload = JSON.parse(event.data);
          } catch {
            payload = event.data; // could be plain text
          }

          if (typeof payload === 'string') {
            // Treat as transcript text
            const text = payload.trim();
            if (text) {
              setCurrentTranscript(text);
              lastTranscriptRef.current = text;
              setIsSpeaking(true);

              // Reset VAD timer to simulate pause-driven sending to parent
              if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
              vadTimerRef.current = setTimeout(() => {
                setIsSpeaking(false);
                if (lastTranscriptRef.current.trim()) {
                  const message: Message = {
                    id: generateMessageId(),
                    sender: 'user',
                    text: lastTranscriptRef.current.trim(),
                    timestamp: Date.now(),
                    isFinal: true,
                  };
                  onTranscription(message);
                  if (onSpeechPause) onSpeechPause(lastTranscriptRef.current);
                  setCurrentTranscript('');
                  lastTranscriptRef.current = '';
                }
              }, 1500);
            }
            return;
          }

          if (payload?.type === 'transcription') {
            const text = (payload.text || '').trim();
            const isFinal = !!payload.isFinal;
            if (!text) return;
            setCurrentTranscript(text);
            lastTranscriptRef.current = text;
            setIsSpeaking(true);
            if (isFinal) {
              if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
              vadTimerRef.current = setTimeout(() => {
                setIsSpeaking(false);
                const message: Message = {
                  id: generateMessageId(),
                  sender: 'user',
                  text,
                  timestamp: Date.now(),
                  isFinal: true,
                };
                onTranscription(message);
                if (onSpeechPause) onSpeechPause(text);
                setCurrentTranscript('');
                lastTranscriptRef.current = '';
              }, 200);
            }
          } else if (payload?.type === 'status') {
            // Optional: display status in UI later
          } else if (payload?.type === 'error') {
            onError(payload?.message || 'Transcription service error');
          }
        } catch (err) {
          console.error('WS onmessage processing error:', err);
        }
      };

      ws.onerror = (event: any) => {
        console.error('WebSocket error:', event?.message || event);
        onError('Connection error with transcription service.');
      };

      ws.onclose = () => {
        setConversationActive(false);
        cleanup();
      };
    } catch (error: any) {
      console.error('Error starting recording:', error);
      setIsConnecting(false);

      if (error?.name === 'NotAllowedError') {
        onError('Microphone permission denied. Please allow microphone access and try again.');
      } else if (error?.name === 'NotFoundError') {
        onError('No microphone found. Please connect a microphone and try again.');
      } else {
        onError(`Error starting recording: ${error?.message || 'Unknown error'}`);
      }
    }
  };

  const endConversation = () => {
    setConversationActive(false);
    cleanup();
  };

  const handleClick = () => {
    if (conversationActive) {
      endConversation();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled || isConnecting || isAIResponding}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
          isAIResponding
            ? 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300'
            : isSpeaking
            ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
            : conversationActive
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
            : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300'
        } ${disabled || isConnecting || isAIResponding ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isConnecting ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isAIResponding ? (
          <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
        ) : (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {conversationActive ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            )}
          </svg>
        )}
        {isSpeaking && !isAIResponding && (
          <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-pulse"></div>
        )}
        {isAIResponding && (
          <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping"></div>
        )}
        {conversationActive && !isSpeaking && !isAIResponding && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-pulse opacity-50"></div>
        )}
      </button>
      <div className="text-center">
        <p className={`text-sm font-medium ${
          isAIResponding ? 'text-purple-600' : isSpeaking ? 'text-green-600' : conversationActive ? 'text-red-600' : 'text-gray-600'
        }`}>
          {isConnecting
            ? 'Connecting...'
            : isAIResponding
            ? 'AI is thinking...'
            : isSpeaking
            ? 'Listening... Keep talking'
            : conversationActive
            ? 'Ready to listen... Click to end conversation'
            : 'Click to start conversation'
          }
        </p>
        {currentTranscript && (
          <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
            "{currentTranscript}"
          </p>
        )}
      </div>
    </div>
  );
};

export default AudioInputButton;