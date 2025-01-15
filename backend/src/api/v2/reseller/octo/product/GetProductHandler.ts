import { inject } from '@needle-di/core';
import { GetProductPathParamsSchema, getProductPathParamsSchema } from '@octocloud/types';
import { IRequest } from 'itty-router';
import { ProductFacade } from '../../../../../common/validation/v2/facade/product/ProductFacade';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../../util/SchemaValidator';

export class GetProductHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly productFacade: ProductFacade = inject(ProductFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      id: request.params.productId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetProductPathParamsSchema>(
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
