import { DatabaseError } from './DatabaseError';

export class CannotCreateRowError<T> extends DatabaseError {
  public readonly rowData: T;

  private constructor(message: string, rowData: T, previousError: any) {
    super(message, previousError);

    this.rowData = rowData;
  }

  public static create<T>(tableName: string, rowData: T, previousError: any): CannotCreateRowError<T> {
    return new this(
      `${tableName} with data ${JSON.stringify(rowData)} can not be created, because of error "${
        previousError.message ?? ''
      }".`,
      rowData,
      previousError,
    );
  }
}
