import { inject } from '@needle-di/core';
import { OctoError, RequestContext } from '@octocloud/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { BadRequestError, InternalServerError } from '../../../common/validation/supplier/models/Error';
import { ValidationController } from '../../../common/validation/supplier/services/validation/Controller';
import { Context } from '../../../common/validation/supplier/services/validation/context/Context';
import {
  ValidationEndpoint,
  validationConfigSchema,
} from '../../../common/validation/supplier/validators/backendValidator/ValidationSchema';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { BodyParser } from '../../util/BodyParser';
import { SupplierRequestLogService } from '../../../common/requestLog/supplier/SupplierRequestLogService';

export class ValidateHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly validatorController = inject(ValidationController),
    private readonly supplierRequestLogService = inject(SupplierRequestLogService)
  ) {}

  private handleError(err: Error): Response {
    if (err instanceof OctoError) {
      return this.jsonResponseFactory.create(err.body, err.status);
    } else if (err instanceof ValidationError) {
      const error = new BadRequestError(err.message);
      return this.jsonResponseFactory.create(error, error.status);
    } else {
      const error = new InternalServerError(err.message);
      return this.jsonResponseFactory.create(error, error.status);
    }
  }

  public async handleRequest(request: IRequest, requestContext?: RequestContext): Promise<Response> {
    const context = new Context();

    if (requestContext !== undefined) {
      context.requestContext = requestContext;
    }

    try {
      const requestBody = await BodyParser.parseBody(request);
      await validationConfigSchema.validate(requestBody);
      const schema = validationConfigSchema.cast(requestBody) as ValidationEndpoint;
      context.setSchema(schema);

      const flowResult = await this.validatorController.validate(context);

      for (const scenario of flowResult.flatMap(fr => fr.scenarios)) {
        this.supplierRequestLogService.logScenario(scenario, context);
      }

      return this.jsonResponseFactory.create(flowResult);
    } catch (e) {
      console.error(e);
      return this.handleError(e as Error);
    }
  }
}
