import { RuntimeError } from '@octocloud/core';

export class SessionScenarioStepNotAllowedError extends RuntimeError {
  public constructor(
    public readonly scenarioId: string,
    public readonly stepId: string,
  ) {
    super(`The specified step "${stepId}" is not allowed within the current scenario "${scenarioId}".`);
  }
}
