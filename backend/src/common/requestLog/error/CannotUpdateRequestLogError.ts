import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotUpdateRequestLogError extends DatabaseError {
  public readonly requestLogRowId: string;
  public readonly requestLogUpdateData: unknown;

  private constructor(message: string, requestLogRowId: string, requestLogRowData: unknown, previousError: unknown) {
    super(message, previousError);

    this.requestLogRowId = requestLogRowId;
    this.requestLogUpdateData = requestLogRowData;
  }

  public static create(
    requestLogRowId: string,
    requestLogUpdateData: unknown,
    previousError: unknown,
  ): CannotUpdateRequestLogError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotUpdateRequestLogError(
      `Request log id ${requestLogRowId} can not be updated with data ${JSON.stringify(
        requestLogUpdateData,
      )}, because of "${message}" error.`,
      requestLogRowId,
      requestLogUpdateData,
      previousError,
    );
  }
}
