import { inject } from '@needle-di/core';
import { GetProductPathParams, getProductPathParamsSchema } from '@octocloud/types';
import { IRequest } from 'itty-router';
import { ProductFacade } from '../../../../../common/validation/reseller/facade/product/ProductFacade';
import { SessionNotFoundError } from '../../../../../common/validation/reseller/session/error/SessionNotFoundError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/reseller/session/error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/reseller/session/error/SessionScenarioStepNotAllowedError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../../util/SchemaValidator';

export class GetProductHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly productFacade = inject(ProductFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      id: request.params.productId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetProductPathParams>(
        getProductPathParamsSchema,
        requestPayload,
      );
      const product = await this.productFacade.getProduct(validatedSchema.id);

      return this.jsonResponseFactory.create(product);
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
