'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePrefersReducedMotion } from '@/lib/motion/hooks';
import { logClientError } from '@/lib/utils/client-error-logger';
import type { ChatMessage } from '@/types/api';

interface ChatSession {
  messages: ChatMessage[];
  sessionId: string;
  isOpen: boolean;
  messageCount: number;
}

export default function ChatbotWidget() {
  const t = useTranslations('chatbot');
  const [session, setSession] = useState<ChatSession>(() => {
    // Initialize from sessionStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('avi_chat_session');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Malformed data – fall through to default
      }
    }

    return {
      messages: [],
      sessionId: typeof window !== 'undefined' ? crypto.randomUUID() : '',
      isOpen: false,
      messageCount: 0,
    };
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [showProactive, setShowProactive] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Hydrate hasInteracted from sessionStorage on mount
  useEffect(() => {
    setHasInteracted(!!sessionStorage.getItem('avi_interacted'));
  }, []);

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
    setSession(prev => ({ ...prev, isOpen: true }));
    setUnreadCount(0);
    setHasInteracted(true);
    sessionStorage.setItem('avi_interacted', 'true');
  };

  const handleCloseChat = () => {
    setSession(prev => ({ ...prev, isOpen: false }));
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      messageCount: prev.messageCount + 1,
    }));

    setIsTyping(true);
    try {
      // Call chat API — read current session for conversationHistory
      const currentMessages = [...session.messages, userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: currentMessages,
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

        setSession(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
      }
    } catch (error) {
      logClientError('chatbot-widget', 'Failed to send chat message', error);
      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t('widget.error_message'),
        timestamp: new Date().toISOString(),
      };

      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const bubbleRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {session.isOpen ? (
        <ChatWindow
          messages={session.messages}
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
          sessionId={session.sessionId}
          isTyping={isTyping}
          returnFocusRef={bubbleRef}
        />
      ) : (
        <ChatBubble
          ref={bubbleRef}
          unreadCount={unreadCount}
          onClick={handleBubbleClick}
          showPulse={showProactive && !hasInteracted}
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

import { forwardRef } from 'react';

const ChatBubble = forwardRef<HTMLButtonElement, ChatBubbleProps>(
  function ChatBubble({ unreadCount, onClick, showPulse }, ref) {
    const t = useTranslations('chatbot');
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
      <button
        ref={ref}
        onClick={onClick}
        className="fixed bottom-6 end-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-bronze to-bronze-hover shadow-lg shadow-bronze/25 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        aria-label={t('widget.open_chat_aria')}
      >
        {showPulse && !prefersReducedMotion && (
          <span className="absolute inset-0 rounded-full bg-bronze/30 animate-ping" />
        )}

        <Sparkles className="h-7 w-7 text-white" />

        {/* Online indicator */}
        <span className="absolute bottom-0 end-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-navy" aria-hidden="true" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 h-5 w-5 rounded-full bg-error flex items-center justify-center text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }
);

// ChatWindow Component (simplified - should be in separate file)
interface ChatWindowProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  sessionId: string;
  isTyping: boolean;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}

function ChatWindow({ messages, onClose, onSendMessage, isTyping, returnFocusRef }: ChatWindowProps) {
  const t = useTranslations('chatbot');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Restore focus on close
  useEffect(() => {
    return () => {
      returnFocusRef.current?.focus();
    };
  }, [returnFocusRef]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !chatWindowRef.current) return;

    const focusableElements = chatWindowRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div
      ref={chatWindowRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('widget.chat_window_aria')}
      onKeyDown={handleKeyDown}
      className="fixed bottom-24 end-6 z-40 w-[calc(100vw-7rem)] sm:w-[380px] h-[520px] max-h-[70dvh] sm:max-h-[70vh] bg-slate-blue border border-slate-blue-light rounded-2xl shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-blue-light">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{t('widget.name')}</div>
            <div className="text-xs text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {t('widget.status')}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-lg flex items-center justify-center text-muted hover:text-white hover:bg-slate-blue-light transition-colors"
          aria-label={t('widget.close_chat_aria')}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label={t('widget.messages_label')}
      >
        {messages.length === 0 && (
          <div className="text-sm text-muted text-center mt-8">
            {t('widget.greeting')}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2.5 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
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
                  ? 'bg-bronze/20 ltr:rounded-tr-sm rtl:rounded-tl-sm'
                  : 'bg-slate-blue-light ltr:rounded-tl-sm rtl:rounded-tr-sm'
              }`}
            >
              <div className="text-sm text-off-white leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-bronze to-bronze-hover flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-slate-blue-light ltr:rounded-tl-sm rtl:rounded-tr-sm">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <span className="sr-only" aria-live="polite">
              {isTyping ? t('widget.typing_indicator') : ''}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-slate-blue-light">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('widget.input_placeholder')}
          className="flex-1 h-10 px-3 py-2 bg-navy/50 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze transition-all outline-none"
          aria-label={t('widget.input_aria')}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="h-10 w-10 rounded-lg bg-bronze flex items-center justify-center text-white hover:bg-bronze-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('widget.send_aria')}
        >
          <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
