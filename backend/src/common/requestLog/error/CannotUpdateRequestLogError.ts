import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotUpdateRequestLogError extends DatabaseError {
  public readonly requestLogRowId: string;
  public readonly requestLogUpdateData: any;

  private constructor(message: string, requestLogRowId: string, requestLogRowData: any, previousError: any) {
    super(message, previousError);

    this.requestLogRowId = requestLogRowId;
    this.requestLogUpdateData = requestLogRowData;
  }

  public static create(
    requestLogRowId: string,
    requestLogUpdateData: any,
    previousError: any,
  ): CannotUpdateRequestLogError {
    return new this(
      `Request log id ${requestLogRowId} can not be updated with data ${JSON.stringify(
        requestLogUpdateData,
      )}, because of error "${previousError.message ?? ''}".`,
      requestLogRowId,
      requestLogUpdateData,
      previousError,
    );
  }
}
