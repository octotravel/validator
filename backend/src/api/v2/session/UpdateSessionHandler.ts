import { singleton, inject } from 'tsyringe';
import { SessionFacade } from '../../../common/session/SessionFacade';
import { IRequest } from 'itty-router';
import { Session, SessionData } from '../../../types/Session';
import { SchemaValidator } from '../../util/SchemaValidator';
import { BodyParser } from '../../util/BodyParser';
import { UpdateSessionSchema, updateSessionSchema } from './UpdateSessionSchema';

@singleton()
export class UpdateSessionHandler {
  public constructor(@inject(SessionFacade) private readonly sessionFacade: SessionFacade) {}

  public async handleRequest(request: IRequest): Promise<Session> {
    const requestPayload = {
      ...(await BodyParser.parseBody(request)),
      id: request.params.sessionId ?? '',
    };
    const updateSessionData = (await SchemaValidator.validateSchema<UpdateSessionSchema>(
      updateSessionSchema,
      requestPayload,
    )) as SessionData;
    const session = await this.sessionFacade.updateSession(updateSessionData);

    return session;
  }
}
