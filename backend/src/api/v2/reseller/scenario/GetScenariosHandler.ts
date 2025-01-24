import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { CapabilitiesParser } from '../../../../common/util/CapabilitiesParser';
import { ScenarioFacade } from '../../../../common/validation/v2/scenario/ScenarioFacade';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../util/SchemaValidator';
import { GetScenariosResponseFactory } from './GetScenariosResponseFactory';
import { GetScenariosSchema, getScenariosSchema } from './GetScenariosSchema';

export class GetScenariosHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly scenarioFacade = inject(ScenarioFacade),
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
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      throw e;
    }
  }
}
