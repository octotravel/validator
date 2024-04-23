import { pg as named } from 'yesql';
import { subDays } from 'date-fns';
import { inject, injectable } from 'inversify';
import { Database } from '../database/Database';

@injectable()
export class PostgresRequestLogRepository {
  public constructor(@inject(Database) private readonly database: Database) {}

  /*
  public async create(requestLogRowData: RequestLogRowData): Promise<void> {
    const query = `
    INSERT INTO request_log(
      id,
      parent_id,
      service_id,
      account_id,
      connection_id,
      created_at,
      env,
      action,
      success,
      status,
      req_body,
      req_method,
      req_url,
      req_headers,
      res_status,
      res_headers,
      res_body,
      res_duration,
      res_error,
      product_ids
    ) VALUES(
      :id,
      :parent_id,
      :service_id,
      :account_id,
      :connection_id,
      :created_at,
      :env,
      :action,
      :success,
      :status,
      :req_body,
      :req_method,
      :req_url,
      :req_headers,
      :res_status,
      :res_headers,
      :res_body,
      :res_duration,
      :res_error,
      :product_ids
    )
    `;

    const updatedRequesRowData: any = requestLogRowData;
    if (requestLogRowData.product_ids !== null) {
      // updatedRequesRowData.product_ids = this.convertToPostgresArray(requestLogRowData.product_ids);
    }

    await this.database
      .getConnection()
      .query(named(query)(requestLogRowData))
      .catch((e: any) => {
        // throw CannotCreateRequestLogError.create(requestLogRowData, e);
      });
  }

  public async get(id: string): Promise<RequestLogRowData | null> {
    const queryResult = await this.database.getConnection().query('SELECT * FROM request_log WHERE id = $1', [id]);

    if (queryResult.rowCount === 0) {
      return null;
    }

    const requestLogRowData = queryResult.rows[0] as RequestLogRowData;

    return requestLogRowData;
  }

  public async deleteOldRequests(): Promise<void> {
    const query = `
      DELETE FROM request_log
        WHERE
          (
            (created_at < :created_at_success AND success = true)
            OR (created_at < :created_at_error AND success = false)
          ) AND service_id != :service
    `;
    const queryValues = {
      created_at_success: subDays(new Date(), 3),
      created_at_error: subDays(new Date(), 28),
      service: Service.VALIDATION,
    };

    await this.database
      .getConnection()
      .query(named(query)(queryValues))
      .catch((e: any) => {
        throw CannotDeleteRequestLogError.create(new Date(), e);
      });
  }

  private convertToPostgresArray(arr: string[]): string {
    return `{${arr.join(',')}}`;
  } */
}
