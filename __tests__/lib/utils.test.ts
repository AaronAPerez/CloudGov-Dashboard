import {
  formatCurrency,
  formatNumber,
  formatBytes,
  formatRelativeTime,
  cn,
  truncate,
  isEmpty,
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should support different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toContain('1,234.56');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with K suffix', () => {
      expect(formatNumber(1234)).toBe('1.2K');
    });

    it('should format numbers with M suffix', () => {
      expect(formatNumber(1234567)).toBe('1.2M');
    });

    it('should format numbers with B suffix', () => {
      expect(formatNumber(1234567890)).toBe('1.2B');
    });

    it('should handle numbers under 1000', () => {
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
      expect(formatBytes(1024)).toBe('1.00 KB');
      expect(formatBytes(1048576)).toBe('1.00 MB');
      expect(formatBytes(1073741824)).toBe('1.00 GB');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 3600000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
    });

    it('should handle just now', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('just now');
    });
  });

  describe('cn (class name merger)', () => {
    it('should merge class names', () => {
      expect(cn('base', 'additional')).toContain('base');
      expect(cn('base', 'additional')).toContain('additional');
    });

    it('should handle conditional classes', () => {
      expect(cn('base', false && 'conditional')).not.toContain('conditional');
      expect(cn('base', true && 'conditional')).toContain('conditional');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(truncate('This is a long text', 10)).toBe('This is a...');
    });

    it('should not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });
  });

  describe('isEmpty', () => {
    it('should detect empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should detect non-empty values', () => {
      expect(isEmpty('text')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });
  });
});