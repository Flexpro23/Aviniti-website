import React from 'react';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  isFinal: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        {/* Message content */}
        <div className="text-sm">
          {message.text}
        </div>
        
        {/* Timestamp and status */}
        <div className={`text-xs mt-1 opacity-70 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {isUser && message.isFinal === false && (
            <span className="ml-2 animate-pulse">●</span>
          )}
        </div>
      </div>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 ml-2 mr-2 ${
        isUser ? 'order-first mr-2 ml-0' : 'order-last'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;