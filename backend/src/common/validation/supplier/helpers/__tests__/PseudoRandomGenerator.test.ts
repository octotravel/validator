import { describe, expect, it, vi } from 'vitest';
import { PseudoRandomGenerator } from '../PseudoRandomGenerator';
import { StringHelper } from '../StringHelper';

describe('PseudoRandomGenerator', () => {
  describe('constructor', () => {
    it('should initialize with a number seed', () => {
      const generator = new PseudoRandomGenerator(12345);
      expect(generator['seed']).toBe(12345);
    });

    it('should initialize with a string seed by converting it to an integer', () => {
      const mockSeed = 'test-seed';
      const mockIntValue = 42;

      const toIntSpy = vi.spyOn(StringHelper, 'toInt').mockReturnValue(mockIntValue);

      const generator = new PseudoRandomGenerator(mockSeed);

      expect(toIntSpy).toHaveBeenCalledWith(mockSeed);
      expect(generator['seed']).toBe(mockIntValue);

      toIntSpy.mockRestore();
    });
  });

  describe('next', () => {
    it('should generate a pseudo-random number between 0 and 1', () => {
      const generator = new PseudoRandomGenerator(12345);
      const randomNumber = generator.next();

      expect(randomNumber).toBeGreaterThanOrEqual(0);
      expect(randomNumber).toBeLessThan(1);
    });

    it('should generate deterministic sequence for the same seed', () => {
      const seed = 12345;
      const generator1 = new PseudoRandomGenerator(seed);
      const generator2 = new PseudoRandomGenerator(seed);

      const results1 = Array.from({ length: 5 }, () => generator1.next());
      const results2 = Array.from({ length: 5 }, () => generator2.next());

      expect(results1).toEqual(results2);
    });

    it('should generate different sequences for different seeds', () => {
      const generator1 = new PseudoRandomGenerator(12345);
      const generator2 = new PseudoRandomGenerator(54321);

      const results1 = Array.from({ length: 3 }, () => generator1.next());
      const results2 = Array.from({ length: 3 }, () => generator2.next());

      expect(results1).not.toEqual(results2);
    });
  });

  describe('nextInt', () => {
    it('should generate integers within the specified range', () => {
      const generator = new PseudoRandomGenerator(12345);
      const min = 10;
      const max = 20;

      for (let i = 0; i < 100; i++) {
        const randomInt = generator.nextInt(min, max);
        expect(randomInt).toBeGreaterThanOrEqual(min);
        expect(randomInt).toBeLessThanOrEqual(max);
        expect(Number.isInteger(randomInt)).toBe(true);
      }
    });

    it('should handle min equal to max', () => {
      const generator = new PseudoRandomGenerator(12345);
      const value = 42;

      const result = generator.nextInt(value, value);

      expect(result).toBe(value);
    });

    it('should generate deterministic integer sequences for the same seed', () => {
      const seed = 12345;
      const min = 1;
      const max = 100;

      const generator1 = new PseudoRandomGenerator(seed);
      const generator2 = new PseudoRandomGenerator(seed);

      const results1 = Array.from({ length: 5 }, () => generator1.nextInt(min, max));
      const results2 = Array.from({ length: 5 }, () => generator2.nextInt(min, max));

      expect(results1).toEqual(results2);
    });
  });

  describe('distribution properties', () => {
    it('should have a relatively uniform distribution', () => {
      const generator = new PseudoRandomGenerator(12345);
      const min = 1;
      const max = 10;
      const sampleSize = 10000;

      const counts = new Array(max - min + 1).fill(0);
      for (let i = 0; i < sampleSize; i++) {
        const randomInt = generator.nextInt(min, max);
        counts[randomInt - min]++;
      }

      const expectedPerBucket = sampleSize / (max - min + 1);
      const tolerance = 0.2;

      for (let i = 0; i < counts.length; i++) {
        const lowerBound = expectedPerBucket * (1 - tolerance);
        const upperBound = expectedPerBucket * (1 + tolerance);

        expect(counts[i]).toBeGreaterThanOrEqual(lowerBound);
        expect(counts[i]).toBeLessThanOrEqual(upperBound);
      }
    });
  });
});
