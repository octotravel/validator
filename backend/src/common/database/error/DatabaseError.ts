import { RuntimeError } from '@octocloud/core';

export class DatabaseError extends RuntimeError {
  public readonly previousError: unknown;

  protected constructor(message: string, previousError: unknown) {
    super(message);

    this.previousError = previousError;
  }
}
