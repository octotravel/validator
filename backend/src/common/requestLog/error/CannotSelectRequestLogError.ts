import { DatabaseError } from '../../database/error/DatabaseError';

export class CannotSelectRequestLogError extends DatabaseError {
  public readonly query: string;

  private constructor(message: string, query: string, previousError: unknown) {
    super(message, previousError);

    this.query = query;
  }

  public static create(query: string, previousError: unknown): CannotSelectRequestLogError {
    const message = previousError instanceof Error ? previousError.message : 'unknown';

    return new CannotSelectRequestLogError(
      `Request log datta can not be selected with query "${query}", because of error "${message}".`,
      query,
      previousError,
    );
  }
}
