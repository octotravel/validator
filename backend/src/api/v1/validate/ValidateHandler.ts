import { validationConfigSchema, ValidationEndpoint } from './ValidationSchema';
import { ValidationController } from '../../../common/validation/v1/services/validation/Controller';
import { Context } from '../../../common/validation/v1/services/validation/context/Context';
import { BodyParser } from '../../util/BodyParser';
import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { OctoError } from '@octocloud/core';
import { ValidationError } from 'yup';
import { BadRequestError, InternalServerError } from '../../../common/validation/v1/models/Error';
import { inject } from '@needle-di/core';

export class ValidateHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly validatorController: ValidationController = inject(ValidationController),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const context = new Context();

    try {
      const requestBody = await BodyParser.parseBody(request);
      await validationConfigSchema.validate(requestBody);
      const schema = validationConfigSchema.cast(requestBody) as ValidationEndpoint;
      context.setSchema(schema);

      const flowResult = await this.validatorController.validate(context);

      return this.jsonResponseFactory.create(flowResult);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      const err = e as Error;

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
  }
}
