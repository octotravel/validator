import { inject, injectable } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { SupplierFacade } from '../../../../../common/validation/v2/facade/supplier/SupplierFacade';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';

@injectable()
export class GetSupplierHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly supplierFacade = inject(SupplierFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    try {
      const supplier = await this.supplierFacade.getSupplier();

      return this.jsonResponseFactory.create(supplier);
    } catch (e: unknown) {
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
