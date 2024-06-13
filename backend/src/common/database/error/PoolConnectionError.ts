import { DatabaseError } from './DatabaseError';

export class PoolConnectionError extends DatabaseError {
  public static create(message: string, previousError: any): PoolConnectionError {
    return new PoolConnectionError(message, previousError);
  }
}
