'use client';

import { useLanguage } from '@/lib/context/LanguageContext';

interface DirectionalArrowProps {
  direction: 'forward' | 'back';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * RTL-aware directional arrow component
 * In LTR: forward = right arrow, back = left arrow
 * In RTL: forward = left arrow, back = right arrow
 */
export function DirectionalArrow({ 
  direction, 
  className = '', 
  size = 'md' 
}: DirectionalArrowProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  // Determine which arrow to show based on direction and RTL
  const showRightArrow = 
    (direction === 'forward' && !isRTL) || 
    (direction === 'back' && isRTL);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const combinedClassName = `${sizeClasses[size]} ${className}`;
  
  if (showRightArrow) {
    return (
      <svg 
        className={combinedClassName} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5l7 7-7 7" 
        />
      </svg>
    );
  }
  
  return (
    <svg 
      className={combinedClassName} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M15 19l-7-7 7-7" 
      />
    </svg>
  );
}

/**
 * RTL-aware chevron component (for dropdowns, expandables, etc.)
 */
interface DirectionalChevronProps {
  direction: 'up' | 'down' | 'left' | 'right';
  className?: string;
  isRTLAware?: boolean; // If true, left/right will flip in RTL
}

export function DirectionalChevron({
  direction,
  className = 'w-5 h-5',
  isRTLAware = true
}: DirectionalChevronProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  let finalDirection = direction;
  
  // Flip horizontal directions in RTL mode if RTL-aware
  if (isRTLAware && isRTL) {
    if (direction === 'left') finalDirection = 'right';
    else if (direction === 'right') finalDirection = 'left';
  }
  
  const pathMap = {
    up: 'M5 15l7-7 7 7',
    down: 'M19 9l-7 7-7-7',
    left: 'M15 19l-7-7 7-7',
    right: 'M9 5l7 7-7 7'
  };
  
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={pathMap[finalDirection]} 
      />
    </svg>
  );
}
