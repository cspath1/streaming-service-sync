// filepath: /Users/josiah_mccracken/Documents/boostpoint/bp_ats/apps/api/src/utils/stripString.spec.ts
import { describe, expect, it } from 'vitest';
import { stripString } from './stripString';

describe('stripString', () => {
  it('should strip non-alphanumeric characters and convert to lowercase', () => {
    expect(stripString('Hello World!')).toBe('helloworld');
    expect(stripString('Test-123')).toBe('test123');
    expect(stripString('A_B c')).toBe('abc');
  });

  it('should handle empty strings', () => {
    expect(stripString('')).toBe('');
  });

  it('should handle strings with only non-alphanumeric characters', () => {
    expect(stripString('!@#$%^&*()')).toBe('');
    expect(stripString('   ')).toBe('');
  });

  it('should preserve numbers', () => {
    expect(stripString('123456')).toBe('123456');
    expect(stripString('abc123')).toBe('abc123');
  });

  it('should handle mixed case strings', () => {
    expect(stripString('AbCdEf')).toBe('abcdef');
    expect(stripString('TEST')).toBe('test');
  });

  it('should handle special characters and spaces', () => {
    expect(stripString('user.name@example.com')).toBe('usernameexamplecom');
    expect(stripString('phone: (123) 456-7890')).toBe('phone1234567890');
  });
});
