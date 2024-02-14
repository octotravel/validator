import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotUpdateRowError<T> extends DatabaseError {
  public readonly rowData: T;

  private constructor(message: string, rowData: T, previousError: any) {
    super(message, previousError);

    this.rowData = rowData;
  }

  public static create<T>(tableName: string, rowId: string, rowData: T, previousError: any): CannotUpdateRowError<T> {
    return new this(
      `${tableName} with id ${rowData.id} can not be updated with data ${JSON.stringify(rowData)}, because of error "${
        previousError.message ?? ''
      }".`,
      rowData,
      previousError,
    );
  }
}
