'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useExitIntent } from './ExitIntentProvider';

type ExitIntentVariant = 'A' | 'B' | 'C' | 'D' | 'E';

async function trackExitIntent(payload: Record<string, unknown>) {
  try {
    await fetch('/api/exit-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail - non-critical tracking
  }
}

// --- Variant A: Email capture with free consultation ---
function VariantA({ onConvert }: { onConvert: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await trackExitIntent({ variant: 'A', action: 'email_capture', email });
    setSubmitted(true);
    onConvert();
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-semibold text-off-white">Thank you!</p>
        <p className="text-sm text-muted mt-1">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-off-white">Before you go...</h2>
      <p className="text-sm text-muted">
        Get a free consultation with our team. We&apos;ll help you find the right
        solution for your business.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full h-11 pl-10 pr-4 bg-navy/60 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted focus:border-bronze focus:ring-1 focus:ring-bronze outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-gradient-to-r from-bronze to-bronze-hover text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Get a Free Consultation
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

// --- Variant B: Solutions navigation ---
function VariantB({ onConvert }: { onConvert: () => void }) {
  const handleClick = async (destination: string) => {
    await trackExitIntent({ variant: 'B', action: 'navigate', destination });
    onConvert();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-off-white">See Our Solutions</h2>
      <p className="text-sm text-muted">
        Explore how we can help transform your business with tailored technology
        solutions.
      </p>
      <div className="space-y-3">
        <a
          href="/solutions"
          onClick={() => handleClick('/solutions')}
          className="flex items-center justify-between w-full h-11 px-4 bg-navy/60 border border-slate-blue-light rounded-lg text-sm text-off-white hover:border-bronze hover:text-bronze transition-colors"
        >
          Browse Solutions
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="/get-estimate"
          onClick={() => handleClick('/get-estimate')}
          className="flex items-center justify-between w-full h-11 px-4 bg-gradient-to-r from-bronze to-bronze-hover rounded-lg text-sm text-white font-medium hover:opacity-90 transition-opacity"
        >
          Get a Free Estimate
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// --- Variant C: Quick estimate form ---
function VariantC({ onConvert }: { onConvert: () => void }) {
  const [projectType, setProjectType] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !projectType) return;

    await trackExitIntent({
      variant: 'C',
      action: 'quick_estimate',
      projectType,
      email,
    });
    setSubmitted(true);
    onConvert();
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-semibold text-off-white">Request received!</p>
        <p className="text-sm text-muted mt-1">
          We&apos;ll send your estimate within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-off-white">Get a Quick Estimate</h2>
      <p className="text-sm text-muted">
        Tell us what you need and we&apos;ll get back to you with a ballpark
        estimate.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          required
          className="w-full h-11 px-3 bg-navy/60 border border-slate-blue-light rounded-lg text-sm text-off-white focus:border-bronze focus:ring-1 focus:ring-bronze outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select project type
          </option>
          <option value="web-app">Web Application</option>
          <option value="mobile-app">Mobile Application</option>
          <option value="ai-integration">AI Integration</option>
          <option value="cloud-infra">Cloud Infrastructure</option>
          <option value="consulting">Consulting</option>
          <option value="other">Other</option>
        </select>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full h-11 pl-10 pr-4 bg-navy/60 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted focus:border-bronze focus:ring-1 focus:ring-bronze outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-gradient-to-r from-bronze to-bronze-hover text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Get My Estimate
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

// --- Variant D: Blog post links ---
function VariantD({ onConvert }: { onConvert: () => void }) {
  const handleClick = async (post: string) => {
    await trackExitIntent({ variant: 'D', action: 'blog_click', post });
    onConvert();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-off-white">Read Our Latest</h2>
      <p className="text-sm text-muted">
        Explore insights from our team on technology, AI, and digital
        transformation.
      </p>
      <div className="space-y-3">
        <a
          href="/blog/ai-transforming-business-2025"
          onClick={() => handleClick('ai-transforming-business-2025')}
          className="block w-full p-4 bg-navy/60 border border-slate-blue-light rounded-lg hover:border-bronze transition-colors group"
        >
          <p className="text-sm font-medium text-off-white group-hover:text-bronze transition-colors">
            How AI is Transforming Business Operations
          </p>
          <p className="text-xs text-muted mt-1">5 min read</p>
        </a>
        <a
          href="/blog/choosing-right-tech-stack"
          onClick={() => handleClick('choosing-right-tech-stack')}
          className="block w-full p-4 bg-navy/60 border border-slate-blue-light rounded-lg hover:border-bronze transition-colors group"
        >
          <p className="text-sm font-medium text-off-white group-hover:text-bronze transition-colors">
            Choosing the Right Tech Stack for Your Startup
          </p>
          <p className="text-xs text-muted mt-1">7 min read</p>
        </a>
      </div>
    </div>
  );
}

// --- Variant E: Direct contact options ---
function VariantE({ onConvert }: { onConvert: () => void }) {
  const handleClick = async (action: string) => {
    await trackExitIntent({ variant: 'E', action });
    onConvert();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-off-white">Still Deciding?</h2>
      <p className="text-sm text-muted">
        No pressure. Let&apos;s have a quick chat to see if we&apos;re the right fit
        for your project.
      </p>
      <div className="space-y-3">
        <a
          href="https://wa.me/962790685302?text=Hi%2C%20I%27m%20interested%20in%20Aviniti%27s%20services"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleClick('whatsapp')}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#25D366] text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
        <a
          href="/contact?booking=true"
          onClick={() => handleClick('book_call')}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-gradient-to-r from-bronze to-bronze-hover text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Phone className="h-4 w-4" />
          Book a Call
        </a>
      </div>
    </div>
  );
}

// --- Variant renderer map ---
const VARIANT_MAP: Record<ExitIntentVariant, React.FC<{ onConvert: () => void }>> = {
  A: VariantA,
  B: VariantB,
  C: VariantC,
  D: VariantD,
  E: VariantE,
};

// --- Main Popup Component ---
export default function ExitIntentPopup() {
  const { isVisible, variant, dismiss, markConverted } = useExitIntent();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    },
    [dismiss],
  );

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isVisible, handleEscape]);

  const VariantComponent = VARIANT_MAP[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'relative z-10 w-full max-w-md',
              'bg-slate-blue border border-slate-blue-light',
              'rounded-2xl shadow-2xl p-6',
            )}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Special offer"
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-off-white hover:bg-slate-blue-light transition-colors"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Variant content */}
            <VariantComponent onConvert={markConverted} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
