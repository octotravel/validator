import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SupplierFacade } from '../../../../../common/validation/v2/facade/supplier/SupplierFacade';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';

@singleton()
export class GetSupplierHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SupplierFacade) private readonly supplierFacade: SupplierFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const sessionId = request.sessionId;
    const headers = request.headers;

    try {
      const supplier = await this.supplierFacade.getSupplier(sessionId, headers);

      return this.jsonResponseFactory.create(supplier);
    } catch (e: any) {
      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      } else if (e instanceof SessionScenarioNotSetError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionScenarioStepNotAllowedError) {
        return this.errorResponseFactory.createForbiddenResponse(e.message, e);
      }

      throw e;
    }
  }
}
