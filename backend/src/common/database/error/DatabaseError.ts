import { RuntimeError } from '@octocloud/core';

export class DatabaseError extends RuntimeError {
  public readonly previousError: any;

  protected constructor(message: string, previousError: any) {
    super(message);

    this.previousError = previousError;
  }
}
