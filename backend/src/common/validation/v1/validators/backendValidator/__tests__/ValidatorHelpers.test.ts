import { describe, expect, it } from 'vitest';
import {
  StringArrayValidator,
  NumberValidator,
  NumberArrayValidator,
  NullValidator,
  ArrayValidator,
  StringValidator,
  ValidatorError,
  BooleanValidator,
  EnumValidator,
  EnumArrayValidator,
  RegExpArrayValidator,
} from '../ValidatorHelpers';

describe('ValidatorHelpers', () => {
  describe('StringValidator', () => {
    it('should validate string', () => {
      expect(StringValidator.validate('id', 123)).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', {})).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', undefined)).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', '123')).toBeNull();
    });
    it('should validate nullable string', () => {
      expect(StringValidator.validate('id', 123, { nullable: true })).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', {}, { nullable: true })).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', undefined, { nullable: true })).toBeInstanceOf(ValidatorError);
      expect(StringValidator.validate('id', null, { nullable: true })).toBeNull();
    });
  });

  describe('NullValidator', () => {
    it('should validate null', () => {
      expect(NullValidator.validate('id', 123)).toBeInstanceOf(ValidatorError);
      expect(NullValidator.validate('id', {})).toBeInstanceOf(ValidatorError);
      expect(NullValidator.validate('id', undefined)).toBeInstanceOf(ValidatorError);
      expect(NullValidator.validate('id', null)).toBeNull();
    });
  });

  describe('BooleanValidator', () => {
    it('should validate boolean', () => {
      expect(BooleanValidator.validate('isAvailable', 123)).toBeInstanceOf(ValidatorError);
      expect(BooleanValidator.validate('isAvailable', {})).toBeInstanceOf(ValidatorError);
      expect(BooleanValidator.validate('isAvailable', undefined)).toBeInstanceOf(ValidatorError);
      expect(BooleanValidator.validate('isAvailable', true)).toBeNull();
      expect(BooleanValidator.validate('isAvailable', false)).toBeNull();
    });
  });

  describe('EnumValidator', () => {
    const availabilityTypes = ['START_TIMES', 'OPENING_HOURS'];
    it('should validate enum', () => {
      expect(EnumValidator.validate('availabilityType', 'start_times', availabilityTypes)).toBeInstanceOf(
        ValidatorError,
      );
      expect(EnumValidator.validate('availabilityType', 123, availabilityTypes)).toBeInstanceOf(ValidatorError);
      expect(EnumValidator.validate('availabilityType', {}, availabilityTypes)).toBeInstanceOf(ValidatorError);
      expect(EnumValidator.validate('availabilityType', undefined, availabilityTypes)).toBeInstanceOf(ValidatorError);
      expect(EnumValidator.validate('availabilityType', 'START_TIMES', availabilityTypes)).toBeNull();
      expect(EnumValidator.validate('availabilityType', 'OPENING_HOURS', availabilityTypes)).toBeNull();
    });
  });

  describe('EnumArrayValidator', () => {
    const deliveryFormats = ['PDF_URL', 'QRCODE'];
    it('should validate enum array', () => {
      expect(EnumArrayValidator.validate('formats', 'start_times', deliveryFormats)).toBeInstanceOf(ValidatorError);
      expect(EnumArrayValidator.validate('formats', 123, deliveryFormats)).toBeInstanceOf(ValidatorError);
      expect(EnumArrayValidator.validate('formats', {}, deliveryFormats)).toBeInstanceOf(ValidatorError);
      expect(EnumArrayValidator.validate('formats', undefined, deliveryFormats)).toBeInstanceOf(ValidatorError);
      expect(
        EnumArrayValidator.validate('formats', ['QRCODE', 'PDF_URL', 'random string'], deliveryFormats),
      ).toBeInstanceOf(ValidatorError);
      expect(EnumArrayValidator.validate('formats', ['PDF_URL'], deliveryFormats)).toBeNull();
      expect(EnumArrayValidator.validate('formats', ['QRCODE', 'PDF_URL'], deliveryFormats)).toBeNull();
    });
  });

  describe('RegExpArrayValidator', () => {
    it('should validate regexp array', () => {
      const regExp = /^\d{2}:\d{2}$/;

      expect(RegExpArrayValidator.validate('times', [], regExp, { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(RegExpArrayValidator.validate('times', ['12:00:00', '15:00'], regExp)).toBeInstanceOf(ValidatorError);
      expect(RegExpArrayValidator.validate('times', ['00:00'], regExp)).toBeNull();
      expect(RegExpArrayValidator.validate('times', ['12:00', '15:00'], regExp)).toBeNull();
    });
  });

  describe('StringArrayValidator', () => {
    it('should validate string array', () => {
      expect(StringArrayValidator.validate('strings', [123], { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(StringArrayValidator.validate('strings', [null], { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(StringArrayValidator.validate('strings', [undefined], { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(StringArrayValidator.validate('strings', {})).toBeInstanceOf(ValidatorError);
      expect(StringArrayValidator.validate('strings', [{}])).toBeInstanceOf(ValidatorError);
      expect(StringArrayValidator.validate('strings', ['123', '456'])).toBeNull();
      expect(StringArrayValidator.validate('strings', ['12:00', '15:00'])).toBeNull();
    });
  });

  describe('NumberValidator', () => {
    it('should validate number', () => {
      expect(NumberValidator.validate('number', undefined)).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', null)).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', [])).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', {})).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', '123')).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', 123.123, { integer: true })).toBeInstanceOf(ValidatorError);
      expect(NumberValidator.validate('number', 123)).toBeNull();
    });
  });

  describe('NumberArrayValidator', () => {
    it('should validate number array', () => {
      expect(NumberArrayValidator.validate('numberArray', undefined)).toBeInstanceOf(ValidatorError);
      expect(NumberArrayValidator.validate('numberArray', null)).toBeInstanceOf(ValidatorError);
      expect(NumberArrayValidator.validate('numberArray', [], { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(NumberArrayValidator.validate('numberArray', [123, 123.123], { integer: true })).toBeInstanceOf(
        ValidatorError,
      );
      expect(NumberArrayValidator.validate('numberArray', [])).toBeNull();
      expect(NumberArrayValidator.validate('numberArray', [123.1])).toBeNull();
    });
  });

  describe('ArrayValidator', () => {
    it('should validate array', () => {
      expect(ArrayValidator.validate('strings', [], { min: 1 })).toBeInstanceOf(ValidatorError);
      expect(ArrayValidator.validate('strings', [1, 2, 3, 4], { max: 3 })).toBeInstanceOf(ValidatorError);
      expect(ArrayValidator.validate('strings', [null], { empty: true })).toBeInstanceOf(ValidatorError);
      expect(ArrayValidator.validate('strings', ['123', '456'], { max: 2 })).toBeNull();
    });
  });
});
