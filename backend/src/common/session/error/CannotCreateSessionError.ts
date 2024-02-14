import { SessionRowData } from '../../../types/Session';

import { DatabaseError } from '../../database/error/DatabaseError';
export class CannotCreateSessionError extends DatabaseError {
  public readonly sessionRowData: SessionRowData;

  private constructor(message: string, sessionRowData: SessionRowData, previousError: any) {
    super(message, previousError);

    this.sessionRowData = sessionRowData;
  }

  public static create(sessionRowData: SessionRowData, previousError: any): CannotCreateSessionError {
    return new this(
      `Session with data ${JSON.stringify(sessionRowData)} can not be created, because of error "${
        previousError.message ?? ''
      }".`,
      sessionRowData,
      previousError,
    );
  }
}
