import { RuntimeError } from '@octocloud/core';
import { ValidationResult } from '../../ValidationResult';

export class ValidationError extends RuntimeError {
  public readonly validationResult: ValidationResult;

  public constructor(validationResult: ValidationResult) {
    super('');

    this.validationResult = validationResult;
  }
}
