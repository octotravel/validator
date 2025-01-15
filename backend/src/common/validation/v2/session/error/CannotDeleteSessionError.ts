import { DatabaseError } from '../../../../database/error/DatabaseError';

export class CannotDeleteSessionError extends DatabaseError {
  public readonly sessionId: string;

  private constructor(message: string, sessionId: string, previousError: unknown) {
    super(message, previousError);

    this.sessionId = sessionId;
  }

  public static create(sessionId: string, previousError: unknown): CannotDeleteSessionError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotDeleteSessionError(
      `Session with id '${sessionId}' can not be deleted, because of "${message}" error.`,
      sessionId,
      previousError,
    );
  }
}
