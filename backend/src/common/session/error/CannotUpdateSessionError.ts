import { DatabaseError } from '../../database/error/DatabaseError';
import { SessionRowData } from '../../../types/Session';

export class CannotUpdateSessionError extends DatabaseError {
  public readonly sessionRowData: SessionRowData;

  private constructor(message: string, sessionRowData: SessionRowData, previousError: any) {
    super(message, previousError);

    this.sessionRowData = sessionRowData;
  }

  public static create(sessionRowData: SessionRowData, previousError: any): CannotUpdateSessionError {
    return new this(
      `Session with id ${sessionRowData.id} can not be updated with data ${JSON.stringify(
        sessionRowData,
      )}, because of error "${previousError.message ?? ''}.`,
      sessionRowData,
      previousError,
    );
  }
}
