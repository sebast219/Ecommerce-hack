// backend/test/unit/domain/password-validation.spec.ts - NUEVO
import { validatePassword } from '../../../src/shared/validation/shared.validation';

describe('Password Validation', () => {
  describe('valid passwords', () => {
    const validPasswords = [
      'StrongP@ssw0rd123!',
      'MyP@ss1234',
      'C0mpl3x!Pass',
      'Ab1!xxxx',  // Mínimo: 8 chars, upper, lower, digit, special
    ];

    it.each(validPasswords)('should accept: %s', (password) => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('invalid passwords', () => {
    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Ab1!xxx');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('abcdefg1!');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('ABCDEFG1!');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without digit', () => {
      const result = validatePassword('Abcdefgh!');
      expect(result.isValid).toBe(false);
    });

    it('should reject password without special character', () => {
      const result = validatePassword('Abcdefg1');
      expect(result.isValid).toBe(false);
    });

    it('should reject empty string', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle very long passwords', () => {
      const longPass = 'A' + 'a'.repeat(125) + '1!';
      const result = validatePassword(longPass);
      expect(result.isValid).toBe(true);
    });

    it('should handle unicode characters', () => {
      const result = validatePassword('Pässwörd1!');
      expect(result.isValid).toBeDefined();
    });

    it('should handle passwords with spaces', () => {
      const result = validatePassword('My P@ss w0rd!');
      expect(result.isValid).toBeDefined();
    });
  });
});
