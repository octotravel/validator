import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';
import { ValidationError } from 'yup';
import { SchemaValidator } from '../../util/SchemaValidator';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { BodyParser } from '../../util/BodyParser';
import { SessionAnswerQuestionsSchema, sessionAnswerQuestionsSchema } from './SessionAnswerQuestionsSchema';

@singleton()
export class SessionAnswerQuestionsHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
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
      const validatedSchema = await SchemaValidator.validateSchema<SessionAnswerQuestionsSchema>(
        sessionAnswerQuestionsSchema,
        requestPayload,
      );
      const validationResult = await this.sessionFacade.validateQuestionAnswers(
        validatedSchema.sessionId,
        validatedSchema.scenarioId,
        validatedSchema.stepId,
        validatedSchema.answers,
      );

      return this.jsonResponseFactory.create(validationResult);
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
