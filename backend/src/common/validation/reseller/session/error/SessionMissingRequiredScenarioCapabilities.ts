import { RuntimeError } from '@octocloud/core';
import { CapabilityId } from '@octocloud/types';

export class SessionMissingRequiredScenarioCapabilities extends RuntimeError {
  public constructor(
    public readonly sessionId: string,
    public readonly requiredCapabilities: CapabilityId[],
  ) {
    super(`Current session is missing required scenario capabilities "${requiredCapabilities.join(', ')}".`);
  }
}
