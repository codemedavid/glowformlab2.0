import { describe, it, expect } from 'vitest';
import { formatPrice, formatPriceWithDecimals, CURRENCY_SYMBOL, CURRENCY_CODE } from '../../utils/currency';

describe('currency utilities', () => {
  describe('formatPrice', () => {
    it('formats a whole number price with peso sign', () => {
      expect(formatPrice(1000)).toMatch(/₱/);
      expect(formatPrice(1000)).toMatch(/1,000|1000/);
    });

    it('formats zero', () => {
      expect(formatPrice(0)).toBe('₱0');
    });

    it('rounds down decimal values (no fraction digits)', () => {
      const result = formatPrice(1500.75);
      expect(result).not.toContain('.');
      expect(result).toMatch(/₱/);
    });

    it('formats large numbers with commas', () => {
      const result = formatPrice(1000000);
      expect(result).toMatch(/₱/);
      expect(result).toMatch(/1,000,000|1000000/);
    });

    it('handles small prices', () => {
      const result = formatPrice(50);
      expect(result).toMatch(/₱50/);
    });

    it('handles negative prices', () => {
      const result = formatPrice(-500);
      expect(result).toContain('₱');
    });
  });

  describe('formatPriceWithDecimals', () => {
    it('includes two decimal places', () => {
      const result = formatPriceWithDecimals(1500);
      expect(result).toMatch(/₱/);
      expect(result).toMatch(/\.00/);
    });

    it('preserves decimal values', () => {
      const result = formatPriceWithDecimals(1500.50);
      expect(result).toMatch(/₱/);
      expect(result).toMatch(/\.50/);
    });

    it('formats zero with decimals', () => {
      const result = formatPriceWithDecimals(0);
      expect(result).toBe('₱0.00');
    });

    it('rounds to two decimal places', () => {
      const result = formatPriceWithDecimals(99.999);
      expect(result).toMatch(/₱/);
      expect(result).toMatch(/100\.00/);
    });
  });

  describe('exported constants', () => {
    it('exports the PHP currency symbol', () => {
      expect(CURRENCY_SYMBOL).toBe('₱');
    });

    it('exports the PHP currency code', () => {
      expect(CURRENCY_CODE).toBe('PHP');
    });
  });
});
