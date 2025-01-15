import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { SchemaValidator } from '../../util/SchemaValidator';
import { GetSessionValidationHistoryResponse } from './GetSessionValidationHistoryResponse';
import {
  GetSessionValidationHistorySchema,
  getSessionValidationHistorySchema,
} from './GetSessionValidationHistorySchema';

export class GetSessionValidationHistoryHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade: SessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      sessionId: request.params.sessionId ?? '',
      scenarioId: request.params.scenarioId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetSessionValidationHistorySchema>(
        getSessionValidationHistorySchema,
        requestPayload,
      );
      const validationHistory = (await this.sessionFacade.getValidationHistoryForScenario(
        validatedSchema.sessionId,
        validatedSchema.scenarioId,
      )) as GetSessionValidationHistoryResponse[];

      return this.jsonResponseFactory.create(validationHistory);
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      }

      throw e;
    }
  }
}
