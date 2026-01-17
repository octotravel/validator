import { RuntimeError } from '@octocloud/core';
import { ScenarioId } from '../../scenario/ScenarioId';
import { StepId } from '../../step/StepId';

export class SessionIsInInvalidState extends RuntimeError {
  public constructor(
    public readonly sessionId: string,
    public readonly scenarioId: ScenarioId,
    public readonly stepId: StepId,
  ) {
    super(
      `Session "${sessionId}" is in invalid state due to invalid combination of scenario "${scenarioId}" and step "${stepId}".`,
    );
  }
}
