import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { SchemaValidator } from '../../util/SchemaValidator';
import { GetSessionSchema, getSessionSchema } from './GetSessionSchema';
import { SessionResponse } from './SessionResponse';

export class GetSessionHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      id: request.params.sessionId ?? '',
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<GetSessionSchema>(getSessionSchema, requestPayload);
      const session = await this.sessionFacade.getSession(validatedSchema.id);

      return this.jsonResponseFactory.create(SessionResponse.createWithProgress(session));
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
