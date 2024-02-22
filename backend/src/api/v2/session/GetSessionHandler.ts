import { singleton, inject } from 'tsyringe';
import { SessionFacade } from '../../../common/session/SessionFacade';
import { IRequest } from 'itty-router';
import { SchemaValidator } from '../../util/SchemaValidator';
import { GetSessionSchema, getSessionSchema } from './GetSessionSchema';
import { SessionResponse } from './SessionResponse';

@singleton()
export class GetSessionHandler {
  public constructor(@inject(SessionFacade) private readonly sessionFacade: SessionFacade) {}

  public async handleRequest(request: IRequest): Promise<SessionResponse> {
    const requestPayload = {
      id: request.params.sessionId ?? '',
    };
    const validatedSchema = await SchemaValidator.validateSchema<GetSessionSchema>(getSessionSchema, requestPayload);
    const session = await this.sessionFacade.getSession(validatedSchema.id);

    return SessionResponse.create(session);
  }
}
