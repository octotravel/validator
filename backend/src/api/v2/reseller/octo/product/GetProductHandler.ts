import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../../http/request/RequestHandler';
import { SessionNotFoundError } from '../../../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../../../http/error/ErrorResponseFactory';
import { SessionScenarioStepNotAllowedError } from '../../../../../common/validation/v2/session/error/SessionScenarioStepNotAllowedError';
import { SessionScenarioNotSetError } from '../../../../../common/validation/v2/session/error/SessionScenarioNotSetError';
import { ProductFacade } from '../../../../../common/validation/v2/facade/product/ProductFacade';
import { SchemaValidator } from '../../../../util/SchemaValidator';
import { GetProductPathParamsSchema, getProductPathParamsSchema } from '@octocloud/types';
import { inject } from '@needle-di/core';

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
