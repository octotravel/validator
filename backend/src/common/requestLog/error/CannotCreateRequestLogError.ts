import { RequestLogRowData } from '../../../types/RequestLog';
import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotCreateRequestLogError extends DatabaseError {
  public readonly requestLogRowData: RequestLogRowData;

  private constructor(message: string, requestLogRowData: RequestLogRowData, previousError: unknown) {
    super(message, previousError);

    this.requestLogRowData = requestLogRowData;
  }

  public static create(requestLogRowData: RequestLogRowData, previousError: unknown): CannotCreateRequestLogError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotCreateRequestLogError(
      `Request log with data ${JSON.stringify(requestLogRowData)} can not be created, because of error "${message}".`,
      requestLogRowData,
      previousError,
    );
  }
}
