import { ResellerRequestLogRowData } from '../../../types/ResellerRequestLog';
import { SupplierRequestLog } from '../../../types/SupplierRequestLog';
import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotCreateRequestLogError extends DatabaseError {
  public readonly requestLogRowData: ResellerRequestLogRowData;

  private constructor(message: string, requestLogRowData: ResellerRequestLogRowData, previousError: unknown) {
    super(message, previousError);

    this.requestLogRowData = requestLogRowData;
  }

  public static create(
    requestLogRowData: ResellerRequestLogRowData,
    previousError: unknown,
  ): CannotCreateRequestLogError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotCreateRequestLogError(
      `Request log with data ${JSON.stringify(requestLogRowData)} can not be created, because of error "${message}".`,
      requestLogRowData,
      previousError,
    );
  }
}
