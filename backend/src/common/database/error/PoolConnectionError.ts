import { DatabaseError } from './DatabaseError';

export class PoolConnectionError extends DatabaseError {
  public static create(message: string, previousError: unknown): PoolConnectionError {
    return new PoolConnectionError(message, previousError);
  }
}
