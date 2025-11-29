'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaArrowLeft, FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

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
  createdAt: Date;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const OpportunityPage: React.FC<PageProps> = ({ params }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/opportunity/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Opportunity not found');
        }
        const data = await response.json();
        setOpportunity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [params]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const socialShareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this amazing app idea: ${opportunity?.title}! 🚀 Discovered with @AvinitiTech's AI Strategy Bot. #AppIdeas #Innovation`)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this amazing app idea: ${opportunity?.title}! 🚀 Discovered with Aviniti's AI Strategy Bot. ${shareUrl}`)}`
  };

  const openSocialShare = (platform: keyof typeof socialShareUrls) => {
    window.open(socialShareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bronze mx-auto mb-4"></div>
          <p className="text-slate-blue">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-blue mb-2">Opportunity Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "This opportunity may have been removed or the link is invalid."}
          </p>
          <Link 
            href="/ai-lab"
            className="bg-bronze text-white px-6 py-3 rounded-lg font-semibold hover:bg-bronze-600 transition-colors"
          >
            Brainstorm Your Own Idea
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/ai-lab"
              className="flex items-center text-slate-blue hover:text-slate-blue-600 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Lab
            </Link>
            <div className="flex items-center space-x-4">
              <Image
                src="/justLogo.webp"
                alt="Aviniti"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-bronze rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-blue mb-2">{opportunity.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{opportunity.oneLine}</p>
            <div className="flex justify-center space-x-2">
              {opportunity.targetUsers.map((user, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-blue-100 text-slate-blue text-sm rounded-full"
                >
                  {user}
                </span>
              ))}
            </div>
          </div>

          {/* Core Value */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-blue mb-3">Core Value</h2>
            <p className="text-gray-700 leading-relaxed">{opportunity.coreValue}</p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-blue mb-3">Key Features</h2>
            <ul className="space-y-2">
              {opportunity.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-bronze mr-3 mt-1">•</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Model */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-blue mb-3">Business Model</h2>
            <p className="text-gray-700 leading-relaxed">{opportunity.businessModel}</p>
          </div>

          {/* Differentiators */}
          {opportunity.differentiators && opportunity.differentiators.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-blue mb-3">What Makes It Unique</h2>
              <ul className="space-y-2">
                {opportunity.differentiators.map((diff, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-bronze mr-3 mt-1">•</span>
                    <span className="text-gray-700">{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Notes */}
          {opportunity.riskNotes && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-700">{opportunity.riskNotes}</p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 bg-bronze text-white py-4 px-6 rounded-lg font-semibold hover:bg-bronze-600 transition-colors">
              Estimate This App's Cost
            </button>
            <Link 
              href="/ai-lab"
              className="flex-1 bg-slate-blue text-white py-4 px-6 rounded-lg font-semibold hover:bg-slate-blue-600 transition-colors text-center"
            >
              Brainstorm Your Own Idea
            </Link>
          </div>

          {/* Share Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-blue mb-4 text-center">Share This Opportunity</h3>
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
        </motion.div>
      </main>
    </div>
  );
};

export default OpportunityPage;

