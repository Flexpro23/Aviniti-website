'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaPaperPlane, FaRobot, FaDownload } from 'react-icons/fa';
import Image from 'next/image';
import OpportunityCarousel from './OpportunityCarousel';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  opportunities?: any[];
  isCarousel?: boolean;
}

const ChatInterface: React.FC = () => {
  const { t, language, dir } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Localized typing messages
  const typingMessages = language === 'ar' 
    ? [
        "تحليل اتجاهات السوق...",
        "صياغة سؤال استراتيجي...",
        "تقييم إمكانات الفرصة...",
        "إعداد رؤى مخصصة...",
        "رسم مسارك الفريد...",
        "تحديد فرص النمو..."
      ]
    : [
        "Analyzing market trends...",
        "Formulating a strategic question...",
        "Evaluating opportunity potential...",
        "Crafting personalized insights...",
        "Mapping your unique path...",
        "Identifying growth opportunities..."
      ];

  // Quick prompts for users who don't know where to start
  const quickPrompts = language === 'ar'
    ? [
        { id: 'uber', text: 'أريد بناء تطبيق مثل أوبر ولكن لـ...' },
        { id: 'ai', text: 'أحتاج ذكاء اصطناعي يمكنه تحليل...' },
        { id: 'mobile', text: 'يحتاج عملي إلى تطبيق جوال لـ...' },
      ]
    : [
        { id: 'uber', text: 'I want to build an app like Uber but for...' },
        { id: 'ai', text: 'I need an AI that can analyze...' },
        { id: 'mobile', text: 'My business needs a mobile app to...' },
      ];

  const scrollToBottom = () => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      let index = 0;
      const interval = setInterval(() => {
        setTypingText(typingMessages[index]);
        index = (index + 1) % typingMessages.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-strategy-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: userMessage.content,
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        opportunities: data.opportunities,
        isCarousel: data.final
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Auto-focus the input field after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResizeTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [userInput]);

  // Export conversation as PDF
  const handleExportConversation = async () => {
    if (messages.length === 0) return;
    
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(53, 70, 93); // slate-blue-600
      doc.text('Aviniti AI Idea Lab - Conversation', margin, yPosition);
      yPosition += 12;
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exported on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPosition);
      yPosition += 15;
      
      // Divider line
      doc.setDrawColor(192, 132, 96); // bronze
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      // Messages
      doc.setFontSize(11);
      messages.forEach((message) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Sender label
        const sender = message.sender === 'user' 
          ? (language === 'ar' ? 'أنت:' : 'You:') 
          : (language === 'ar' ? 'مستشار الذكاء الاصطناعي:' : 'AI Strategist:');
        
        doc.setTextColor(message.sender === 'user' ? 53 : 192, message.sender === 'user' ? 70 : 132, message.sender === 'user' ? 93 : 96);
        doc.setFont('helvetica', 'bold');
        doc.text(sender, margin, yPosition);
        yPosition += 6;
        
        // Message content
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(message.content, maxWidth);
        splitText.forEach((line: string) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 8; // Space between messages
      });
      
      // Footer
      yPosition = 285;
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Aviniti AI Idea Lab - aviniti.app', margin, yPosition);
      
      // Save
      doc.save(`aviniti-idea-lab-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting conversation:', error);
      alert(language === 'ar' 
        ? 'حدث خطأ أثناء تصدير المحادثة. يرجى المحاولة مرة أخرى.'
        : 'Error exporting conversation. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-off-white" dir={dir}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-slate-blue-600 rounded-full flex items-center justify-center">
              <FaRobot className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-blue-600">
                {language === 'ar' ? 'مستشار أفينيتي الذكي' : 'Aviniti AI Strategist'}
              </h1>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'دعنا نكتشف فكرة تطبيقك المثالية معًا' : "Let's discover your perfect app idea together"}
              </p>
            </div>
          </div>
          
          {/* Export button - only show when there are messages */}
          {messages.length > 0 && (
            <button
              onClick={handleExportConversation}
              disabled={isExporting}
              className={`flex items-center gap-2 px-3 py-2 text-sm text-slate-blue-600 hover:bg-slate-blue-50 rounded-lg transition-colors disabled:opacity-50 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              aria-label={language === 'ar' ? 'تصدير كـ PDF' : 'Export as PDF'}
            >
              <FaDownload className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">
                {isExporting 
                  ? (language === 'ar' ? 'جاري التصدير...' : 'Exporting...') 
                  : (language === 'ar' ? 'تصدير PDF' : 'Export PDF')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Chat History Area - Main scrollable content */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="w-16 h-16 bg-slate-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaRobot className="w-8 h-8 text-slate-blue-600" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-slate-blue-600 mb-2">
              {language === 'ar' ? 'مرحبًا بك في مختبر أفكار أفينيتي!' : 'Welcome to the Aviniti Idea Lab!'}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              {language === 'ar' 
                ? 'أنا هنا لمساعدتك في اكتشاف فكرة التطبيق المثالية. أخبرني عن اهتماماتك أو أهدافك أو أي مشاكل تريد حلها.'
                : "I'm here to help you discover the perfect app idea. Tell me about your interests, goals, or any problems you'd like to solve."}
            </p>
            
            {/* Quick Prompts */}
            <div className="max-w-lg mx-auto">
              <p className="text-sm text-gray-500 mb-3">
                {language === 'ar' ? 'لست متأكداً من أين تبدأ؟ جرب:' : 'Not sure where to start? Try:'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => setUserInput(prompt.text)}
                    className="px-4 py-2 bg-slate-blue-50 text-slate-blue-600 rounded-full text-sm hover:bg-slate-blue-100 transition-colors border border-slate-blue-200"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 bg-slate-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/justLogo.webp"
                      alt="Aviniti AI"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div
                  className={`${
                    message.sender === 'user'
                      ? 'bg-slate-blue-600 text-white p-3 rounded-xl max-w-lg self-end shadow-md'
                      : 'bg-white text-slate-blue-800 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm'
                  }`}
                >
                  {message.isCarousel && message.opportunities ? (
                    <OpportunityCarousel opportunities={message.opportunities} />
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-slate-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Loading Indicator with Bronze Colors */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-slate-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Image
                  src="/justLogo.webp"
                  alt="Aviniti AI"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className={`flex items-center ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                  {/* Bronze animated dots */}
                  <div className="flex space-x-1">
                    <span 
                      className="w-2.5 h-2.5 bg-bronze-500 rounded-full animate-bounce" 
                      style={{ animationDelay: '0ms' }} 
                    />
                    <span 
                      className="w-2.5 h-2.5 bg-bronze-500 rounded-full animate-bounce" 
                      style={{ animationDelay: '150ms' }} 
                    />
                    <span 
                      className="w-2.5 h-2.5 bg-bronze-500 rounded-full animate-bounce" 
                      style={{ animationDelay: '300ms' }} 
                    />
                  </div>
                  <span className="text-sm text-gray-600">{typingText}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className={`flex items-end ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'ar' 
                ? 'أخبرني عن اهتماماتك أو أهدافك أو أي مشاكل تريد حلها...'
                : "Tell me about your interests, goals, or any problems you'd like to solve..."}
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze-500 focus:border-transparent min-h-[44px] max-h-[120px] text-slate-blue-800"
              rows={1}
              disabled={isLoading}
              dir={dir}
              aria-label={language === 'ar' ? 'اكتب رسالتك' : 'Type your message'}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
            className="bg-bronze-500 text-white rounded-xl p-3 hover:bg-bronze-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md focus:ring-2 focus:ring-bronze-500 focus:ring-offset-2"
            aria-label={language === 'ar' ? 'إرسال الرسالة' : 'Send message'}
          >
            <FaPaperPlane className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
