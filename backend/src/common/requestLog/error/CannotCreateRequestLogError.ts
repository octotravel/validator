import { RequestLogRowData } from '../../../types/RequestLog';
import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotCreateRequestLogError extends DatabaseError {
  public readonly requestLogRowData: RequestLogRowData;

  private constructor(message: string, requestLogRowData: RequestLogRowData, previousError: any) {
    super(message, previousError);

    this.requestLogRowData = requestLogRowData;
  }

  public static create(requestLogRowData: RequestLogRowData, previousError: any): CannotCreateRequestLogError {
    return new this(
      `Request log with data ${JSON.stringify(requestLogRowData)} can not be created, because of error "${
        previousError.message ?? ''
      }".`,
      requestLogRowData,
      previousError,
    );
  }
}
