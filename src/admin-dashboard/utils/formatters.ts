// Utility Functions

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'long'): string => {
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-IN', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  }
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date time
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time ago (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};

/**
 * Mask sensitive data
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) return data;
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + data.slice(-visibleChars);
};

/**
 * Mask account number
 */
export const maskAccountNumber = (accountNumber: string): string => {
  return maskSensitiveData(accountNumber, 4);
};

/**
 * Generate trend percentage
 */
export const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals) + '%';
};

/**
 * Check if value is positive trend
 */
export const isPositiveTrend = (value: number): boolean => {
  return value > 0;
};

/**
 * Format numbers with thousand separator
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Abbreviate large numbers
 */
export const abbreviateNumber = (num: number): string => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);

  if (magnitude === 0) return formatNumber(num);

  const scaled = num / Math.pow(10, magnitude * 3);
  return scaled.toFixed(1).replace(/\.0$/, '') + suffixes[magnitude];
};

/**
 * Get status badge color
 */
export const getStatusColor = (
  status: string
): 'success' | 'warning' | 'error' | 'info' => {
  const statusMap: { [key: string]: 'success' | 'warning' | 'error' | 'info' } = {
    ACTIVE: 'success',
    APPROVED: 'success',
    VERIFIED: 'success',
    COMPLETED: 'success',
    PENDING: 'warning',
    SUSPENDED: 'error',
    CANCELLED: 'error',
    REJECTED: 'error',
    FAILED: 'error',
    INACTIVE: 'info',
  };

  return statusMap[status] || 'info';
};

/**
 * Get status label
 */
export const getStatusLabel = (status: string): string => {
  return status.split('_').join(' ');
};

/**
 * Debounce function
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: any[]) {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
    }
  };
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if phone is valid (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Check if UPI ID is valid
 */
export const isValidUPI = (upi: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
  return upiRegex.test(upi);
};

/**
 * Check if IFSC code is valid
 */
export const isValidIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

/**
 * Check if PAN is valid
 */
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};
