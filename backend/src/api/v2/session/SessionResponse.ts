import { CapabilityId } from '@octocloud/types';
import { Session } from '../../../types/Session';
import config from '../../../common/config/config';

export class SessionResponse {
  public readonly url: string;

  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly capabilities: CapabilityId[] | null,
    public readonly currentScenario: string | null,
    public readonly currentStep: string | null,
  ) {
    this.url = `${config.BASE_URL}/session/${id}`;
  }

  public static create(session: Session): SessionResponse {
    return new this(session.id, session.name, session.capabilities, session.currentScenario, session.currentStep);
  }
}
