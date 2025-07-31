import { CapabilityId } from '@octocloud/types';
import config from '../../../common/config/config';
import { Session, SessionScenarioProgress, SessionWithProgress } from '../../../types/Session';

export class SessionResponse {
  public readonly url: string;

  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly capabilities: CapabilityId[] | null,
    public readonly currentScenario: string | null,
    public readonly scenariosProgress: SessionScenarioProgress[] | undefined = undefined,
  ) {
    this.url = `${config.BASE_URL}/session/${id}`;
  }

  public static create(session: Session): SessionResponse {
    return new SessionResponse(session.id, session.name, session.capabilities, session.currentScenario);
  }

  public static createWithProgress(session: SessionWithProgress): SessionResponse {
    return new SessionResponse(
      session.id,
      session.name,
      session.capabilities,
      session.currentScenario,
      session.scenariosProgress,
    );
  }
}
