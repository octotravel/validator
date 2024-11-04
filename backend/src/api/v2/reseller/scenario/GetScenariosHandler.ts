import { GetScenariosSchema, getScenariosSchema } from './GetScenariosSchema';
import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { ScenarioFacade } from '../../../../common/validation/v2/scenario/ScenarioFacade';
import { IRequest } from 'itty-router';
import { GetScenariosResponseFactory } from './GetScenariosResponseFactory';
import { ValidationError } from 'yup';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../util/SchemaValidator';
import { CapabilitiesParser } from '../../../../common/util/CapabilitiesParser';
import { inject } from '@needle-di/core';

export class GetScenariosHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly scenarioFacade: ScenarioFacade = inject(ScenarioFacade),
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

      return this.jsonResponseFactory.create(scenarios.map((scenario) => GetScenariosResponseFactory.create(scenario)));
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      throw e;
    }
  }
}
