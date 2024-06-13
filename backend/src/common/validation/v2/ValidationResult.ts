import { ValidationFailure } from './ValidationFailure';

export class ValidationResult {
  private readonly errors: ValidationFailure[] = [];
  private readonly warnings: ValidationFailure[] = [];

  public constructor(private readonly data: unknown) {}

  public getData(): unknown {
    return this.data;
  }

  public getErrors(): ValidationFailure[] {
    return this.errors;
  }

  public addErrors(errors: ValidationFailure[]): void {
    errors.forEach((error) => this.errors.push(error));
  }

  public addError(error: ValidationFailure): void {
    this.errors.push(error);
  }

  public getWarnings(): ValidationFailure[] {
    return this.warnings;
  }

  public addWarnings(warnings: ValidationFailure[]): void {
    warnings.forEach((warning) => this.warnings.push(warning));
  }

  public addWarning(warning: ValidationFailure): void {
    this.warnings.push(warning);
  }

  public hasErrors(): boolean {
    return this.errors.length > 0;
  }

  public hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  public isValid(): boolean {
    return !this.hasErrors();
  }
}
