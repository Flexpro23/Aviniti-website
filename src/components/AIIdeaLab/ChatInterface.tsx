'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
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
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typingMessages = [
    "Analyzing market trends...",
    "Formulating a strategic question...",
    "Evaluating opportunity potential...",
    "Crafting personalized insights...",
    "Mapping your unique path...",
    "Identifying growth opportunities..."
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

  return (
    <div className="flex flex-col h-screen bg-off-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-blue rounded-full flex items-center justify-center">
            <FaRobot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-blue">Aviniti AI Strategist</h1>
            <p className="text-sm text-gray-600">Let's discover your perfect app idea together</p>
          </div>
        </div>
      </div>

      {/* Chat History Area - Main scrollable content */}
      <div className="flex-grow overflow-y-auto p-8 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-slate-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FaRobot className="w-8 h-8 text-slate-blue" />
            </div>
            <h2 className="text-xl font-semibold text-slate-blue mb-2">
              Welcome to the Aviniti Idea Lab!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm here to help you discover the perfect app idea. Tell me about your interests, 
              goals, or any problems you'd like to solve, and let's start this exciting journey together.
            </p>
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
                      ? 'bg-slate-blue text-white p-3 rounded-xl max-w-lg self-end'
                      : 'bg-white text-slate-blue border border-gray-200 px-4 py-3 rounded-2xl'
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

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="w-8 h-8 bg-slate-blue rounded-full flex items-center justify-center flex-shrink-0">
                <Image
                  src="/justLogo.webp"
                  alt="Aviniti AI"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-blue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{typingText}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your interests, goals, or any problems you'd like to solve..."
              className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
            className="bg-bronze text-white rounded-lg p-3 hover:bg-bronze-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
