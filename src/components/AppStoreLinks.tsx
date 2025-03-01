'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';

interface AppStoreLinksProps {
  iosUrl?: string;
  androidUrl?: string;
  className?: string;
}

export default function AppStoreLinks({ iosUrl, androidUrl, className = '' }: AppStoreLinksProps) {
  const { dir } = useLanguage();
  
  const handleStoreClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render anything if no URLs are provided
  if (!iosUrl && !androidUrl) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${dir === 'rtl' ? 'sm:flex-row-reverse' : ''} ${className}`}>
      {iosUrl && (
        <button
          onClick={() => handleStoreClick(iosUrl)}
          className="flex items-center justify-center bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
          aria-label="Download on the App Store"
        >
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.0266 12.5719C17.0111 10.7428 18.0045 9.39807 19.0223 8.56491C18.0001 7.11491 16.4001 6.80491 15.6489 6.76791C14.0133 6.60002 12.4311 7.71028 11.6045 7.71028C10.7645 7.71028 9.46001 6.78735 8.10445 6.81835C6.32668 6.84935 4.69779 7.82102 3.80223 9.34402C1.91112 12.4307 3.31112 17.0252 5.12668 19.5307C6.01779 20.7563 7.06223 22.1329 8.43779 22.074C9.78668 22.0107 10.3089 21.2107 11.9334 21.2107C13.5422 21.2107 14.0355 22.074 15.4533 22.038C16.9156 22.0107 17.8111 20.7963 18.6644 19.5618C19.3867 18.5618 19.9311 17.4896 20.2533 16.3663C18.9178 15.8052 17.0356 14.4329 17.0266 12.5719Z" />
              <path d="M14.3378 5.01333C15.0954 4.09467 15.5243 2.878 15.3732 1.66667C14.2243 1.75733 12.9143 2.508 12.1132 3.40533C11.3854 4.20533 10.8765 5.45333 11.0487 6.644C12.3132 6.688 13.5587 5.94867 14.3378 5.01333Z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-light">Download on the</span>
            <span className="text-sm font-semibold">App Store</span>
          </div>
        </button>
      )}
      
      {androidUrl && (
        <button
          onClick={() => handleStoreClick(androidUrl)}
          className="flex items-center justify-center bg-black text-white rounded-xl px-4 py-3 hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform duration-300"
          aria-label="Get it on Google Play"
        >
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.66667 2.66667C3.29848 2.66667 3 2.96514 3 3.33333V20.6667C3 21.0349 3.29848 21.3333 3.66667 21.3333H20.3333C20.7015 21.3333 21 21.0349 21 20.6667V3.33333C21 2.96514 20.7015 2.66667 20.3333 2.66667H3.66667ZM12.5812 6.66667C12.7604 6.66751 12.9321 6.74465 13.0542 6.87733L16.6563 10.8543C16.7789 10.9905 16.8422 11.1738 16.8327 11.3616C16.8232 11.5494 16.7421 11.7253 16.6063 11.8483L13.0625 15.1273C12.9384 15.238 12.7785 15.3 12.6141 15.301C12.4496 15.302 12.2886 15.2417 12.1629 15.1323C12.0371 15.0229 11.9563 14.8724 11.9355 14.7088C11.9147 14.5453 11.9555 14.3795 12.0498 14.2433L15.2125 11.3333L12.0542 8.05333C11.971 7.96299 11.9172 7.84955 11.9003 7.7281C11.8835 7.60664 11.9043 7.48337 11.9599 7.37511C12.0154 7.26686 12.1031 7.17954 12.2111 7.12519C12.319 7.07085 12.4417 7.05212 12.5625 7.07133L12.5812 6.66667ZM11.474 7.07133C11.5948 7.05212 11.7175 7.07085 11.8255 7.1252C11.9334 7.17954 12.0211 7.26686 12.0767 7.37511C12.1322 7.48337 12.153 7.60664 12.1362 7.7281C12.1194 7.84955 12.0655 7.96299 11.9823 8.05333L8.82398 11.3333L11.9823 14.2433C12.0766 14.3795 12.1174 14.5453 12.0966 14.7088C12.0759 14.8724 11.995 15.0229 11.8693 15.1323C11.7436 15.2417 11.5825 15.302 11.4181 15.301C11.2536 15.3 11.0938 15.238 10.9697 15.1273L7.42586 11.8483C7.29004 11.7253 7.20894 11.5494 7.19944 11.3616C7.18995 11.1738 7.25321 10.9905 7.37586 10.8543L10.9781 6.87733C11.1002 6.74465 11.2719 6.66751 11.4511 6.66667H11.474Z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-light">Get it on</span>
            <span className="text-sm font-semibold">Google Play</span>
          </div>
        </button>
      )}
    </div>
  );
} 