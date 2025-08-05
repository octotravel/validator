import { RuntimeError } from '@octocloud/core';

export class SessionNotFoundError extends RuntimeError {
  public constructor(public readonly sessionId: string) {
    super(`Session with id "${sessionId}" not found.`);
  }
}
