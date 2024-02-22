import { singleton, inject } from 'tsyringe';
import { validationConfigSchema, ValidationEndpoint } from './ValidationSchema';
import { ValidationController } from '../../../common/validation/v1/services/validation/Controller';
import { Context } from '../../../common/validation/v1/services/validation/context/Context';
import { FlowResult } from '../../../common/validation/v1/services/validation/Flows/Flow';
import { BodyParser } from '../../util/BodyParser';
import { IRequest } from 'itty-router';

@singleton()
export class ValidateHandler {
  public constructor(@inject(ValidationController) private readonly validatorController: ValidationController) {}

  public async handleRequest(request: IRequest): Promise<FlowResult[]> {
    const context = new Context();

    const requestBody = await BodyParser.parseBody(request);
    await validationConfigSchema.validate(requestBody);
    const schema = validationConfigSchema.cast(requestBody) as ValidationEndpoint;
    context.setSchema(schema);
    return await this.validatorController.validate(context);
  }
}
