import { SessionRowData } from '../../../../../types/Session';
import { DatabaseError } from '../../../../database/error/DatabaseError';

export class CannotCreateSessionError extends DatabaseError {
  public readonly sessionRowData: SessionRowData;

  private constructor(message: string, sessionRowData: SessionRowData, previousError: unknown) {
    super(message, previousError);

    this.sessionRowData = sessionRowData;
  }

  public static create(sessionRowData: SessionRowData, previousError: unknown): CannotCreateSessionError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotCreateSessionError(
      `Session with data ${JSON.stringify(sessionRowData)} can not be created, because of "${message}" error.`,
      sessionRowData,
      previousError,
    );
  }
}
