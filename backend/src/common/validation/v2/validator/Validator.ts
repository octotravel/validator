import { ValidationResult } from '../ValidationResult';

export interface Validator {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validate(...args: any[]): Promise<ValidationResult>;
}
