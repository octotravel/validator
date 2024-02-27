import { singleton, inject } from 'tsyringe';
import { IRequest } from 'itty-router';
import { SessionData } from '../../../types/Session';
import { SchemaValidator } from '../../util/SchemaValidator';
import { BodyParser } from '../../util/BodyParser';
import { UpdateSessionSchema, updateSessionSchema } from './UpdateSessionSchema';
import { SessionResponse } from './SessionResponse';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { ErrorCode } from '../../http/error/ErrorCode';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { ValidationError } from 'yup';
import { RequestHandler } from '../../http/request/RequestHandler';

@singleton()
export class UpdateSessionHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const requestPayload = {
      ...(await BodyParser.parseBody(request)),
      id: request.params.sessionId ?? '',
    };
    try {
      const updateSessionData = (await SchemaValidator.validateSchema<UpdateSessionSchema>(
        updateSessionSchema,
        requestPayload,
      )) as SessionData;

      const session = await this.sessionFacade.updateSession(updateSessionData);

      return this.jsonResponseFactory.create(SessionResponse.create(session));
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(ErrorCode.SESSION_NOT_FOUND, e);
      }

      return this.errorResponseFactory.createInternalServerErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, e);
    }
  }
}
