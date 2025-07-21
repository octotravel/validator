import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { BodyParser } from '../../util/BodyParser';
import { SchemaValidator } from '../../util/SchemaValidator';
import {
  ValidateSessionQuestionAnswersSchema,
  validateSessionQuestionAnswersSchema,
} from './ValidateSessionQuestionAnswersSchema';
import { ValidateSessionQuestionsAnswersResponse } from './ValidateSessionQuestionsAnswersResponse';

export class ValidateSessionQuestionsAnswersHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade = inject(SessionFacade),
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
