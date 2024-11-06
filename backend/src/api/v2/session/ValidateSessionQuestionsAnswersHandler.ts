import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';
import { ValidationError } from 'yup';
import { SchemaValidator } from '../../util/SchemaValidator';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { BodyParser } from '../../util/BodyParser';
import {
  ValidateSessionQuestionAnswersSchema,
  validateSessionQuestionAnswersSchema,
} from './ValidateSessionQuestionAnswersSchema';
import { ValidateSessionQuestionsAnswersResponse } from './ValidateSessionQuestionsAnswersResponse';
import { inject } from '@needle-di/core';

export class ValidateSessionQuestionsAnswersHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade: SessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    const requestPayload = {
      ...parsedBody,
      sessionId: request.params.sessionId ?? '',
      scenarioId: request.params.scenarioId ?? '',
      stepId: request.params.stepId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<ValidateSessionQuestionAnswersSchema>(
        validateSessionQuestionAnswersSchema,
        requestPayload,
      );
      const validationResult = await this.sessionFacade.validateQuestionAnswers(
        validatedSchema.sessionId,
        validatedSchema.scenarioId,
        validatedSchema.stepId,
        validatedSchema.answers,
      );
      const validationResponsee = {
        data: validationResult.getData(),
        errors: validationResult.getErrors(),
        warnings: validationResult.getWarnings(),
        isValid: validationResult.isValid(),
      } as ValidateSessionQuestionsAnswersResponse;

      return this.jsonResponseFactory.create(validationResponsee);
    } catch (e: any) {
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
