import { SessionRowData } from '../../../../../types/Session';
import { DatabaseError } from '../../../../database/error/DatabaseError';

export class CannotUpdateSessionError extends DatabaseError {
  public readonly sessionRowData: SessionRowData;

  private constructor(message: string, sessionRowData: SessionRowData, previousError: unknown) {
    super(message, previousError);

    this.sessionRowData = sessionRowData;
  }

  public static create(sessionRowData: SessionRowData, previousError: unknown): CannotUpdateSessionError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotUpdateSessionError(
      `Session with id ${sessionRowData.id} can not be updated with data ${JSON.stringify(
        sessionRowData,
      )}, because of "${message}" error.`,
      sessionRowData,
      previousError,
    );
  }
}
