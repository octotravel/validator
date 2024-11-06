import { IRequest } from 'itty-router';
import { GetSessionSchema, getSessionSchema } from './GetSessionSchema';
import { SessionResponse } from './SessionResponse';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';
import { ValidationError } from 'yup';
import { SchemaValidator } from '../../util/SchemaValidator';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { inject } from '@needle-di/core';

export class GetSessionHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade: SessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      id: request.params.sessionId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetSessionSchema>(getSessionSchema, requestPayload);
      const session = await this.sessionFacade.getSession(validatedSchema.id);

      return this.jsonResponseFactory.create(SessionResponse.createWithProgress(session));
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
