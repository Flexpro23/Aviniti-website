'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '@/types/api';

interface ChatSession {
  messages: ChatMessage[];
  sessionId: string;
  isOpen: boolean;
  messageCount: number;
}

export default function ChatbotWidget() {
  const [session, setSession] = useState<ChatSession>(() => {
    // Initialize from sessionStorage if available
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('avi_chat_session');
      if (stored) {
        return JSON.parse(stored);
      }
    }

    return {
      messages: [],
      sessionId: crypto.randomUUID(),
      isOpen: false,
      messageCount: 0,
    };
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [showProactive, setShowProactive] = useState(false);

  // Persist session to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('avi_chat_session', JSON.stringify(session));
    }
  }, [session]);

  // Proactive message logic (30s delay for first visit)
  useEffect(() => {
    const hasShownProactive = sessionStorage.getItem('avi_proactive_shown');

    if (!hasShownProactive && !session.isOpen && session.messages.length === 0) {
      const timer = setTimeout(() => {
        setUnreadCount(1);
        setShowProactive(true);
        sessionStorage.setItem('avi_proactive_shown', 'true');
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [session.isOpen, session.messages.length]);

  const handleBubbleClick = () => {
    setSession({ ...session, isOpen: true });
    setUnreadCount(0);
  };

  const handleCloseChat = () => {
    setSession({ ...session, isOpen: false });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, userMessage];
    setSession({
      ...session,
      messages: updatedMessages,
      messageCount: session.messageCount + 1,
    });

    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: updatedMessages,
          currentPage: window.location.pathname,
          locale: document.documentElement.lang || 'en',
          sessionId: session.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.data.reply,
          timestamp: new Date().toISOString(),
        };

        setSession({
          ...session,
          messages: [...updatedMessages, assistantMessage],
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again or contact us directly.",
        timestamp: new Date().toISOString(),
      };

      setSession({
        ...session,
        messages: [...updatedMessages, errorMessage],
      });
    }
  };

  return (
    <>
      {session.isOpen ? (
        <ChatWindow
          messages={session.messages}
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
          sessionId={session.sessionId}
        />
      ) : (
        <ChatBubble
          unreadCount={unreadCount}
          onClick={handleBubbleClick}
          showPulse={showProactive && !sessionStorage.getItem('avi_interacted')}
        />
      )}
    </>
  );
}

// ChatBubble Component
interface ChatBubbleProps {
  unreadCount: number;
  onClick: () => void;
  showPulse: boolean;
}

function ChatBubble({ unreadCount, onClick, showPulse }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-bronze to-bronze-hover shadow-lg shadow-bronze/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
      aria-label="Open chat with Avi, Aviniti's AI assistant"
    >
      {showPulse && (
        <span className="absolute inset-0 rounded-full bg-bronze/30 animate-ping" />
      )}

      <Sparkles className="h-7 w-7 text-white" />

      {/* Online indicator */}
      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-navy" />

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-error flex items-center justify-center text-xs font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

// ChatWindow Component (simplified - should be in separate file)
interface ChatWindowProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  sessionId: string;
}

function ChatWindow({ messages, onClose, onSendMessage }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 w-[380px] h-[520px] max-h-[70vh] bg-slate-blue border border-slate-blue-light rounded-2xl shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-blue-light">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Avi</div>
            <div className="text-xs text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online now
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg text-muted hover:text-white hover:bg-slate-blue-light transition-colors"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted text-center mt-8">
            Hi! I'm Avi, your AI assistant. How can I help you today?
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                message.role === 'user'
                  ? 'bg-bronze/20 rounded-tr-sm'
                  : 'bg-slate-blue-light rounded-tl-sm'
              }`}
            >
              <div className="text-sm text-off-white leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-slate-blue-light">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 h-10 px-3 py-2 bg-navy/50 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus:border-bronze focus:ring-1 focus:ring-bronze transition-all outline-none"
          aria-label="Chat message"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="h-10 w-10 rounded-lg bg-bronze flex items-center justify-center text-white hover:bg-bronze-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}
