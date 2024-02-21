import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotDeleteSessionError extends DatabaseError {
  public readonly sessionId: string;

  private constructor(message: string, sessionId: string, previousError: any) {
    super(message, previousError);

    this.sessionId = sessionId;
  }

  public static create(sessionId: string, previousError: any): CannotDeleteSessionError {
    return new this(
      `Session with id '${sessionId}' can not be deleted, because of error "${previousError.message ?? ''}.`,
      sessionId,
      previousError,
    );
  }
}
