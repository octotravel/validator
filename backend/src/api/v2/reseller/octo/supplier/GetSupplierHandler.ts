import { IRequest } from 'itty-router';
import { SupplierFacade } from '../../../../../common/validation/v2/facade/supplier/SupplierFacade';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { inject } from '@needle-di/core';

export class GetSupplierHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly supplierFacade: SupplierFacade = inject(SupplierFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    try {
      const supplier = await this.supplierFacade.getSupplier();

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
