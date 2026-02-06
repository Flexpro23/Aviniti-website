// Utility functions for formatting data

/**
 * Format phone number with international format
 * Removes all non-digit characters and ensures + prefix
 *
 * @param phone - Phone number to format
 * @returns Formatted phone number
 *
 * @example
 * formatPhone("0791234567") // "+0791234567"
 * formatPhone("+962 79 123 4567") // "+96279123456"
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Ensure + prefix if not present
  if (!cleaned.startsWith('+')) {
    return `+${cleaned}`;
  }

  return cleaned;
}

/**
 * Create URL-safe slug from text
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 *
 * @param text - Text to slugify
 * @returns URL-safe slug
 *
 * @example
 * slugify("Hello World!") // "hello-world"
 * slugify("AI & ML Solutions") // "ai-ml-solutions"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

/**
 * Truncate text to maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length (including ellipsis)
 * @returns Truncated text
 *
 * @example
 * truncate("This is a long text", 10) // "This is..."
 * truncate("Short", 10) // "Short"
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format price with currency symbol and thousands separators
 *
 * @param amount - Numeric amount
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 *
 * @example
 * formatPrice(12000) // "$12,000"
 * formatPrice(12000, "JOD") // "JOD 12,000"
 * formatPrice(12500.50, "AED") // "AED 12,500.50"
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  // Handle USD separately with $ symbol
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // For other currencies, format with currency code prefix
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${currency} ${formattedNumber}`;
}

/**
 * Format number with thousands separators
 *
 * @param num - Number to format
 * @returns Formatted number string
 *
 * @example
 * formatNumber(12000) // "12,000"
 * formatNumber(1234567.89) // "1,234,567.89"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 *
 * @param value - Decimal value (e.g., 0.638 for 63.8%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(0.638) // "64%"
 * formatPercentage(0.638, 1) // "63.8%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format date to locale-specific string
 *
 * @param date - Date to format
 * @param locale - Locale code (default: en)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date("2026-02-06"), "en") // "Feb 6, 2026"
 * formatDate(new Date("2026-02-06"), "ar") // "٦ فبراير ٢٠٢٦"
 */
export function formatDate(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format relative time (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale code (default: en)
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export function formatRelativeTime(date: Date, locale: string = 'en'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  // Less than a minute
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  // Less than a month
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  // Years
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}

/**
 * Capitalize first letter of string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 *
 * @example
 * capitalize("hello world") // "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case or kebab-case to Title Case
 *
 * @param str - String to convert
 * @returns Title case string
 *
 * @example
 * toTitleCase("hello-world") // "Hello World"
 * toTitleCase("user_profile_settings") // "User Profile Settings"
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[_-]/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
