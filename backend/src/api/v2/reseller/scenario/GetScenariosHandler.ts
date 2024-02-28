import { inject, singleton } from 'tsyringe';
import { GetScenariosSchema, getScenariosSchema } from './GetScenariosSchema';
import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { ScenarioFacade } from '../../../../common/validation/v2/scenario/ScenarioFacade';
import { IRequest } from 'itty-router';
import { ScenarioResponseFactory } from './ScenarioResponseFactory';
import { ValidationError } from 'yup';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { ErrorCode } from '../../../http/error/ErrorCode';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../util/SchemaValidator';
import { CapabilitiesParser } from '../../../../common/util/CapabilitiesParser';

@singleton()
export class GetScenariosHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(ScenarioFacade) private readonly scenarioFacade: ScenarioFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      'Octo-Capabilities': request.headers.get('Octo-Capabilities') ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetScenariosSchema>(
        getScenariosSchema,
        requestPayload,
      );
      const scenarios = await this.scenarioFacade.getAllResellerScenariosAvailableForCapabilities(
        CapabilitiesParser.parseCapabilities(validatedSchema['Octo-Capabilities']),
      );

      return this.jsonResponseFactory.create(scenarios.map((scenario) => ScenarioResponseFactory.create(scenario)));
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      return this.errorResponseFactory.createInternalServerErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, e);
    }
  }
}
