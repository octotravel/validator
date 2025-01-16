import { inject, injectable } from '@needle-di/core';
import { OctoError } from '@octocloud/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { BadRequestError, InternalServerError } from '../../../common/validation/v1/models/Error';
import { ValidationController } from '../../../common/validation/v1/services/validation/Controller';
import { Context } from '../../../common/validation/v1/services/validation/context/Context';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { BodyParser } from '../../util/BodyParser';
import { ValidationEndpoint, validationConfigSchema } from './ValidationSchema';

@injectable()
export class ValidateHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly validatorController = inject(ValidationController),
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
