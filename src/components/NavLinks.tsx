'use client';

interface NavLinksProps {
  isScrolled: boolean;
  onContactClick: () => void;
}

export default function NavLinks({ isScrolled, onContactClick }: NavLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <a 
        href="/"
        className={`font-medium text-base transition-colors ${
          isScrolled 
            ? 'text-gray-700 hover:text-blue-600' 
            : 'text-white hover:text-blue-200'
        }`}
      >
        Home
      </a>
      <a 
        href="#services"
        className={`font-medium text-base transition-colors ${
          isScrolled 
            ? 'text-gray-700 hover:text-blue-600' 
            : 'text-white hover:text-blue-200'
        }`}
      >
        Services
      </a>
      <a 
        href="#about"
        className={`font-medium text-base transition-colors ${
          isScrolled 
            ? 'text-gray-700 hover:text-blue-600' 
            : 'text-white hover:text-blue-200'
        }`}
      >
        About
      </a>
      <button 
        onClick={onContactClick}
        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
          isScrolled
            ? 'text-gray-700 hover:text-blue-600'
            : 'text-white hover:text-blue-200'
        }`}
      >
        Contact Us
      </button>
    </div>
  );
} 