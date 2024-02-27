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

  public addError(error: ValidationFailure): void {
    this.errors.push(error);
  }

  public getWarnings(): ValidationFailure[] {
    return this.warnings;
  }

  public addWarning(warning: ValidationFailure): void {
    this.warnings.push(warning);
  }
}
