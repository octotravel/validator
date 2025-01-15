import { inject } from '@needle-di/core';
import { IRequest } from 'itty-router';
import { ValidationError } from 'yup';
import { SessionFacade } from '../../../common/validation/v2/session/SessionFacade';
import { SessionMissingRequiredScenarioCapabilities } from '../../../common/validation/v2/session/error/SessionMissingRequiredScenarioCapabilities';
import { SessionNotFoundError } from '../../../common/validation/v2/session/error/SessionNotFoundError';
import { SessionData } from '../../../types/Session';
import { ErrorResponseFactory } from '../../http/error/ErrorResponseFactory';
import { JsonResponseFactory } from '../../http/json/JsonResponseFactory';
import { RequestHandler } from '../../http/request/RequestHandler';
import { BodyParser } from '../../util/BodyParser';
import { SchemaValidator } from '../../util/SchemaValidator';
import { SessionResponse } from './SessionResponse';
import { UpdateSessionSchema, updateSessionSchema } from './UpdateSessionSchema';

export class UpdateSessionHandler implements RequestHandler {
  public constructor(
    private readonly jsonResponseFactory: JsonResponseFactory = inject(JsonResponseFactory),
    private readonly errorResponseFactory: ErrorResponseFactory = inject(ErrorResponseFactory),
    private readonly sessionFacade: SessionFacade = inject(SessionFacade),
  ) {}

  public async handleRequest(request: IRequest): Promise<Response> {
    const parsedBody = await BodyParser.parseBody(request);

    const requestPayload = {
      id: request.params.sessionId ?? '',
      name: parsedBody.name ?? undefined,
      capabilities: parsedBody.capabilities !== undefined ? parsedBody.capabilities : undefined,
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
    } catch (e: unknown) {
      if (e instanceof ValidationError) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      } else if (e instanceof SessionNotFoundError) {
        return this.errorResponseFactory.createNotFoundResponse(e.message, e);
      } else if (e instanceof SessionMissingRequiredScenarioCapabilities) {
        return this.errorResponseFactory.createBadRequestResponse(e.message, e);
      }

      throw e;
    }
  }
}
