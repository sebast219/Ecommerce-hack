// backend/test/unit/domain/money.spec.ts - NUEVO
import { Money } from '../../../src/domain/entities/user.entity';

describe('Money Value Object', () => {
  describe('constructor', () => {
    it('should create money with valid positive amount', () => {
      const money = new Money(100);
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should create money with custom currency', () => {
      const money = new Money(50, 'EUR');
      expect(money.currency).toBe('EUR');
    });

    it('should accept zero amount', () => {
      const money = new Money(0);
      expect(money.amount).toBe(0);
    });

    it('should handle decimal precision correctly', () => {
      const money = new Money(99.99);
      expect(money.amount).toBe(99.99);
    });

    it('should handle very small decimals', () => {
      const money = new Money(0.01);
      expect(money.amount).toBe(0.01);
    });

    it('should throw for negative amounts', () => {
      expect(() => new Money(-1)).toThrow();
    });

    it('should throw for NaN', () => {
      expect(() => new Money(NaN)).toThrow();
    });

    it('should throw for Infinity', () => {
      expect(() => new Money(Infinity)).toThrow();
    });
  });

  describe('add()', () => {
    it('should add two Money objects with same currency', () => {
      const a = new Money(100, 'USD');
      const b = new Money(50, 'USD');
      const result = a.add(b);
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should return new Money instance (immutability)', () => {
      const a = new Money(100);
      const b = new Money(50);
      const result = a.add(b);
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
      expect(a.amount).toBe(100); // Original unchanged
    });

    it('should throw when adding different currencies', () => {
      const usd = new Money(100, 'USD');
      const eur = new Money(50, 'EUR');
      expect(() => usd.add(eur)).toThrow();
    });

    it('should handle floating point precision', () => {
      const a = new Money(0.1);
      const b = new Money(0.2);
      const result = a.add(b);
      // Debe manejar el famoso 0.1 + 0.2 !== 0.3
      expect(result.amount).toBeCloseTo(0.3, 2);
    });
  });

  describe('multiply()', () => {
    it('should multiply by integer', () => {
      const money = new Money(10);
      const result = money.multiply(3);
      expect(result.amount).toBe(30);
    });

    it('should multiply by decimal', () => {
      const money = new Money(100);
      const result = money.multiply(0.1); // 10% tax
      expect(result.amount).toBeCloseTo(10, 2);
    });
  });

  describe('equals()', () => {
    it('should return true for equal Money', () => {
      const a = new Money(100, 'USD');
      const b = new Money(100, 'USD');
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const a = new Money(100, 'USD');
      const b = new Money(200, 'USD');
      expect(a.equals(b)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const a = new Money(100, 'USD');
      const b = new Money(100, 'EUR');
      expect(a.equals(b)).toBe(false);
    });
  });
});
