import { describe, expect, it } from 'vitest';
import { safeJson } from '../SafeJson'; // Update the import path

describe('safeJson', () => {
  it('should return null when input is null', () => {
    expect(safeJson(null)).toBeNull();
  });

  it('should return null when input is undefined', () => {
    expect(safeJson(undefined)).toBeNull();
  });

  it('should stringify a simple object', () => {
    const obj = { name: 'John', age: 30 };
    expect(safeJson(obj)).toBe('{"name":"John","age":30}');
  });

  it('should stringify an array', () => {
    const arr = [1, 2, 3];
    expect(safeJson(arr)).toBe('[1,2,3]');
  });

  it('should stringify a string', () => {
    expect(safeJson('hello')).toBe('"hello"');
  });

  it('should stringify a number', () => {
    expect(safeJson(42)).toBe('42');
  });

  it('should stringify a boolean', () => {
    expect(safeJson(true)).toBe('true');
    expect(safeJson(false)).toBe('false');
  });

  it('should handle empty objects', () => {
    expect(safeJson({})).toBe('{}');
  });

  it('should handle empty arrays', () => {
    expect(safeJson([])).toBe('[]');
  });

  it('should handle nested objects', () => {
    const nested = {
      person: {
        name: 'example',
        contacts: {
          email: 'example@example.com',
        },
      },
    };
    expect(safeJson(nested)).toBe('{"person":{"name":"example","contacts":{"email":"example@example.com"}}}');
  });

  it('should handle special characters in strings', () => {
    const withSpecialChars = { message: 'Line 1\nLine 2\t"Quoted"' };
    expect(safeJson(withSpecialChars)).toBe('{"message":"Line 1\\nLine 2\\t\\"Quoted\\""}');
  });

  it('should handle Date objects', () => {
    const date = new Date('2023-01-01T00:00:00.000Z');
    expect(safeJson(date)).toBe('"2023-01-01T00:00:00.000Z"');
  });

  it('should handle NaN and Infinity as null', () => {
    expect(safeJson(Number.NaN)).toBe('null');
    expect(safeJson(Number.POSITIVE_INFINITY)).toBe('null');
    expect(safeJson(Number.NEGATIVE_INFINITY)).toBe('null');
  });
});
