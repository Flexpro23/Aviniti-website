'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface NavItem {
  id: string;
  label: string;
}

interface ResultsNavProps {
  sections: NavItem[];
}

export function ResultsNav({ sections }: ResultsNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 400px (roughly past summary cards)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (!isVisible) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-md border-b border-slate-blue-light/30">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeId === id
                  ? 'bg-bronze/20 text-bronze-light'
                  : 'text-muted hover:text-off-white hover:bg-slate-blue-light/30'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
