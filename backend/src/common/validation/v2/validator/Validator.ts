import { ValidationResult } from '../ValidationResult';

export interface Validator {
  validate(...args: any[]): Promise<ValidationResult>;
}
