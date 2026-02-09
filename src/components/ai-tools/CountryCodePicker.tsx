'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Check, Search } from 'lucide-react';

interface CountryCodePickerProps {
  value: string; // e.g. "+962"
  onChange: (code: string) => void;
  disabled?: boolean;
  labels?: {
    searchPlaceholder: string;
    popular: string;
    allCountries: string;
    noResults: string;
    selectCountryCode: string;
  };
}

interface Country {
  name: string;
  code: string;
  dial: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  // Popular MENA countries
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Bahrain', code: 'BH', dial: '+973', flag: '🇧🇭' },
  { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Iraq', code: 'IQ', dial: '+964', flag: '🇮🇶' },
  { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
  { name: 'Palestine', code: 'PS', dial: '+970', flag: '🇵🇸' },

  // Other common countries (alphabetically)
  { name: 'Algeria', code: 'DZ', dial: '+213', flag: '🇩🇿' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Libya', code: 'LY', dial: '+218', flag: '🇱🇾' },
  { name: 'Morocco', code: 'MA', dial: '+212', flag: '🇲🇦' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Sudan', code: 'SD', dial: '+249', flag: '🇸🇩' },
  { name: 'Syria', code: 'SY', dial: '+963', flag: '🇸🇾' },
  { name: 'Tunisia', code: 'TN', dial: '+216', flag: '🇹🇳' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Yemen', code: 'YE', dial: '+967', flag: '🇾🇪' },
];

const POPULAR_CODES = ['JO', 'AE', 'SA', 'EG', 'QA', 'KW', 'BH', 'OM', 'IQ', 'LB', 'PS'];

export function CountryCodePicker({ value, onChange, disabled = false, labels }: CountryCodePickerProps) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Keyboard handlers
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Find selected country (default to Jordan if not found)
  const selected = COUNTRIES.find(c => c.dial === value) || COUNTRIES[0];

  // Filter countries by search
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter(c => POPULAR_CODES.includes(c.code));
  const others = filtered.filter(c => !POPULAR_CODES.includes(c.code));

  const handleSelect = (country: Country) => {
    onChange(country.dial);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="h-12 px-3 bg-navy border border-slate-blue-light rounded-lg flex items-center gap-2 hover:border-slate-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={labels?.selectCountryCode ?? t('country_picker.select_country_code')}
        aria-expanded={open}
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-off-white font-medium">{selected.dial}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute top-full inset-inline-start-0 mt-2 w-80 bg-slate-blue border border-slate-blue-light rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Search Input */}
          <div className="bg-navy border-b border-slate-blue-light p-3">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={labels?.searchPlaceholder ?? t('country_picker.search_placeholder')}
                className="w-full h-10 ps-10 pe-3 bg-slate-blue border border-slate-blue-light rounded-lg text-off-white placeholder:text-muted focus:outline-none focus:border-bronze transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-80 overflow-y-auto">
            {/* Popular Section */}
            {popular.length > 0 && (
              <>
                <div className="text-xs text-muted uppercase tracking-wider px-3 py-2 bg-navy/50">
                  {labels?.popular ?? t('country_picker.popular')}
                </div>
                {popular.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-slate-blue-light/50 transition-colors cursor-pointer text-start"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="flex-1 text-off-white">
                      {country.name}
                    </span>
                    <span className="text-muted text-sm">{country.dial}</span>
                    {selected.code === country.code && (
                      <Check className="w-4 h-4 text-bronze" />
                    )}
                  </button>
                ))}
              </>
            )}

            {/* Divider */}
            {popular.length > 0 && others.length > 0 && (
              <div className="border-t border-slate-blue-light my-1" />
            )}

            {/* All Countries Section */}
            {others.length > 0 && (
              <>
                <div className="text-xs text-muted uppercase tracking-wider px-3 py-2 bg-navy/50">
                  {labels?.allCountries ?? t('country_picker.all_countries')}
                </div>
                {others.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className="w-full px-3 py-2 flex items-center gap-3 hover:bg-slate-blue-light/50 transition-colors cursor-pointer text-start"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="flex-1 text-off-white">
                      {country.name}
                    </span>
                    <span className="text-muted text-sm">{country.dial}</span>
                    {selected.code === country.code && (
                      <Check className="w-4 h-4 text-bronze" />
                    )}
                  </button>
                ))}
              </>
            )}

            {/* No Results */}
            {filtered.length === 0 && (
              <div className="px-3 py-8 text-center text-muted">
                {labels?.noResults ?? t('country_picker.no_countries_found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
