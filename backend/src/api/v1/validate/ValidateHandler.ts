import { singleton, inject } from 'tsyringe';
import { validationConfigSchema, ValidationEndpoint } from './ValidationSchema';
import { ValidationController } from '../../../common/validation/v1/services/validation/Controller';
import { Context } from '../../../common/validation/v1/services/validation/context/Context';
import { FlowResult } from '../../../common/validation/v1/services/validation/Flows/Flow';

@singleton()
export class ValidateHandler {
  public constructor(@inject(ValidationController) private readonly validatorController: ValidationController) {}

  public async handleRequest(request: Request): Promise<FlowResult[]> {
    const context = new Context();

    const reqBody = request.body;
    await validationConfigSchema.validate(reqBody);
    const schema = validationConfigSchema.cast(reqBody) as ValidationEndpoint;
    context.setSchema(schema);
    return await this.validatorController.validate(context);
  }
}
