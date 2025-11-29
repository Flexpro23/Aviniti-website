'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaShare, FaCopy, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';


interface Opportunity {
  id: string;
  title: string;
  oneLine: string;
  targetUsers: string[];
  coreValue: string;
  keyFeatures: string[];
  businessModel: string;
  differentiators: string[];
  riskNotes: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/opportunity/${opportunity.id}`;
  
  const socialShareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing app idea: ${opportunity.title}! 🚀 Discovered with @AvinitiTech's AI Strategy Bot. #AppIdeas #Innovation`)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this amazing app idea: ${opportunity.title}! 🚀 Discovered with Aviniti's AI Strategy Bot. ${shareUrl}`)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openSocialShare = (platform: keyof typeof socialShareUrls) => {
    window.open(socialShareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg rounded-xl p-6 w-80 flex-shrink-0 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-bronze rounded-full flex items-center justify-center">
            <FaLightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-blue">{opportunity.title}</h3>
            <p className="text-sm text-gray-600">{opportunity.oneLine}</p>
          </div>
        </div>
        
        {/* Share Button */}
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="p-2 text-gray-400 hover:text-slate-blue transition-colors"
        >
          <FaShare className="w-4 h-4" />
        </button>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-blue">Share This Opportunity</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-slate-blue text-white rounded text-sm hover:bg-slate-blue-600 transition-colors"
                >
                  {copied ? 'Copied!' : <FaCopy className="w-3 h-3" />}
                </button>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => openSocialShare('facebook')}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openSocialShare('twitter')}
                  className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openSocialShare('linkedin')}
                  className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openSocialShare('whatsapp')}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

      {/* Core Value */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-blue mb-2">Core Value</h4>
        <p className="text-sm text-gray-700">{opportunity.coreValue}</p>
      </div>

      {/* Target Users */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-blue mb-2">Target Users</h4>
        <div className="flex flex-wrap gap-1">
          {opportunity.targetUsers.map((user, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-blue-100 text-slate-blue text-xs rounded-full"
            >
              {user}
            </span>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-blue mb-2">Key Features</h4>
        <ul className="space-y-1">
          {opportunity.keyFeatures.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="text-bronze mr-2 mt-1">•</span>
              {feature}
            </li>
          ))}
          {opportunity.keyFeatures.length > 3 && (
            <li className="text-sm text-gray-500">
              +{opportunity.keyFeatures.length - 3} more features
            </li>
          )}
        </ul>
      </div>

      {/* Business Model */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-blue mb-2">Business Model</h4>
        <p className="text-sm text-gray-700">{opportunity.businessModel}</p>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-bronze text-white py-3 px-4 rounded-lg font-semibold hover:bg-bronze-600 transition-colors mb-3">
        Build This Blueprint
      </button>

      {/* Risk Notes */}
      {opportunity.riskNotes && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Note:</strong> {opportunity.riskNotes}
        </div>
      )}
    </motion.div>
  );
};

export default OpportunityCard;
