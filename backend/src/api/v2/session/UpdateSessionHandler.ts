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
import { SessionMissingRequiredScenarioCapabilities } from '../../../common/validation/v2/session/error/SessionMissingRequiredScenarioCapabilities';

@singleton()
export class UpdateSessionHandler implements RequestHandler {
  public constructor(
    @inject(JsonResponseFactory) private readonly jsonResponseFactory: JsonResponseFactory,
    @inject(ErrorResponseFactory) private readonly errorResponseFactory: ErrorResponseFactory,
    @inject(SessionFacade) private readonly sessionFacade: SessionFacade,
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    const requestPayload = {
      id: request.params.sessionId ?? '',
      name: parsedBody.name ?? undefined,
      capabilities: parsedBody.capabilities ?? undefined,
      currentScenario: parsedBody.currentScenario !== undefined ? parsedBody.currentScenario : undefined,
    };

    try {
      const validatedSchema = await SchemaValidator.validateSchema<UpdateSessionSchema>(
        updateSessionSchema,
        requestPayload,
      );
      const updateSessionData = validatedSchema as SessionData;
      const session = await this.sessionFacade.updateSession(updateSessionData);

      return this.jsonResponseFactory.create(SessionResponse.create(session));
    } catch (e: any) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(ErrorCode.SESSION_NOT_FOUND, e);
      } else if (e instanceof SessionMissingRequiredScenarioCapabilities) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      throw e;
    }
  }
}
