import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SchemaValidator } from '../../util/SchemaValidator';
import { GetSessionSchema, getSessionSchema } from './GetSessionSchema';
import { SessionResponse } from './SessionResponse';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { ErrorCode } from '../../http/error/ErrorCode';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { RequestHandler } from '../../http/request/RequestHandler';

@singleton()
export class GetSessionHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      id: request.params.sessionId ?? '',
    };
    const validatedSchema = await SchemaValidator.validateSchema<GetSessionSchema>(getSessionSchema, requestPayload);
    const session = await this.sessionFacade.getSession(validatedSchema.id);

    if (session === null) {
      return this.errorResponseFactory.createNotFoundResponse(ErrorCode.SESSION_NOT_FOUND);
    }

    return this.jsonResponseFactory.create(SessionResponse.create(session));
  }
}
