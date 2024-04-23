import { inject, injectable } from 'inversify';
import { Database } from '../database/Database';

@injectable()
export class PostgresRequestLogViewRepository {
  public constructor(@inject(Database) private readonly database: Database) {}

  private addQueryCondition(queryConditions: string, queryCondition: string): string {
    let composedQueryCondition = queryConditions.length === 0 ? ' WHERE ' : ' AND ';
    composedQueryCondition = composedQueryCondition.concat(queryCondition);

    return queryConditions.concat(composedQueryCondition);
  }
}
