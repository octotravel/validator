import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotSelectRequestLogError extends DatabaseError {
  public readonly query: string;

  private constructor(message: string, query: string, previousError: any) {
    super(message, previousError);

    this.query = query;
  }

  public static create(query: string, previousError: any): CannotSelectRequestLogError {
    return new this(
      `Request log datta can not be selected with query "${query}", because of error "${previousError.message ?? ''}".`,
      query,
      previousError,
    );
  }
}
