import { RuntimeError } from '@octocloud/core';

export class SessionScenarioNotSetError extends RuntimeError {
  public constructor() {
    super(
      'Current session does not have a scenario set. Please update the session\'s "currentScenario" field with a valid scenario id.',
    );
  }
}
