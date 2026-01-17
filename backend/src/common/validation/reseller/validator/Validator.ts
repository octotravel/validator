import { ValidationResult } from '../ValidationResult';

export interface Validator {
  // biome-ignore lint/suspicious/noExplicitAny: <?>
  validate(...args: any[]): Promise<ValidationResult>;
}
