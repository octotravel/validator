import { JsonResponseFactory } from '../../../http/json/JsonResponseFactory';
import { ScenarioFacade } from '../../../../common/validation/v2/scenario/ScenarioFacade';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { ErrorResponseFactory } from '../../../http/error/ErrorResponseFactory';
import { RequestHandler } from '../../../http/request/RequestHandler';
import { SchemaValidator } from '../../../util/SchemaValidator';
import { GetScenarioSchema, getScenarioSchema } from './GetScenarioSchema';
import { GetScenarioResponseFactory } from './GetScenarioResponseFactory';
import { inject } from '@needle-di/core';

export class GetScenarioHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly scenarioFacade: ScenarioFacade = inject(ScenarioFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      scenarioId: request.params.scenarioId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetScenarioSchema>(
        getScenarioSchema,
        requestPayload,
      );
      const scenario = await this.scenarioFacade.getScenarioById(validatedSchema.scenarioId);

      return this.jsonResponseFactory.create(GetScenarioResponseFactory.create(scenario));
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      throw e;
    }
  }
}
