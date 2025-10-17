/**
 * Utility Functions
 * 
 * Core helper functions used throughout the application.
 * These utilities handle common tasks like class name merging,
 * formatting, and data manipulation.
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * Merges multiple class names using clsx
 * Handles conditional classes and removes duplicates
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * cn('base-class', isActive && 'active', 'another-class')
 * // Returns: 'base-class active another-class'
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format currency values
 *
 * @param amount - Numeric amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56) // Returns: '$1,234.56'
 * formatCurrency(1234.56, 'EUR') // Returns: '€1,234.56'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format currency with compact notation for large amounts
 *
 * @param amount - Numeric amount to format
 * @param currency - Currency code (default: USD)
 * @returns Compact formatted currency string
 *
 * @example
 * formatCompactCurrency(1234.56) // Returns: '$1.2K'
 * formatCompactCurrency(35719) // Returns: '$35.7K'
 * formatCompactCurrency(1234567) // Returns: '$1.2M'
 */
export function formatCompactCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  // For amounts under 10K, show full amount
  if (amount < 10000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // For larger amounts, use compact notation
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Format large numbers with abbreviations (K, M, B)
 * 
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234) // Returns: '1.2K'
 * formatNumber(1234567) // Returns: '1.2M'
 * formatNumber(1234567890) // Returns: '1.2B'
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  return num.toString();
}

/**
 * Format bytes to human-readable sizes
 * 
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted size string
 * 
 * @example
 * formatBytes(1024) // Returns: '1.00 KB'
 * formatBytes(1048576) // Returns: '1.00 MB'
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
}

/**
 * Format relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // Returns: '1 hour ago'
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Debounce function to limit execution rate
 * Useful for search inputs and resize handlers
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((query) => search(query), 300);
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 * 
 * @example
 * truncate('This is a long text', 10) // Returns: 'This is a...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate unique ID for accessibility purposes
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * 
 * @example
 * generateId('input') // Returns: 'input-abc123'
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 * 
 * @param value - Value to check
 * @returns True if empty
 * 
 * @example
 * isEmpty(null) // Returns: true
 * isEmpty('') // Returns: true
 * isEmpty([]) // Returns: true
 * isEmpty('text') // Returns: false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Sleep/delay function for async operations
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * 
 * @example
 * await sleep(1000); // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}