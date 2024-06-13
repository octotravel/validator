import { RuntimeError } from '@octocloud/core';
import { ScenarioId } from '../../scenario/ScenarioId';
import { StepId } from '../../step/StepId';

export class SessionScenarioStepNotAllowedError extends RuntimeError {
  public readonly scenarioId: ScenarioId;
  public readonly stepId: StepId;

  private constructor(message: string, scenarioId: ScenarioId, stepId: StepId) {
    super(message);

    this.scenarioId = scenarioId;
    this.stepId = stepId;
  }

  public static createForInvalidFirstStep(
    scenarioId: ScenarioId,
    scenarioFirstStepId: StepId,
    stepId: StepId,
  ): SessionScenarioStepNotAllowedError {
    return new this(
      `Current session does not have a step set. Step ${scenarioFirstStepId} is expected initial step for current session, but ${stepId} was called instead.`,
      scenarioId,
      stepId,
    );
  }

  public static createForNonExistingStep(scenarioId: ScenarioId, stepId: StepId): SessionScenarioStepNotAllowedError {
    return new this(
      `The specified step "${stepId}" does not exist within the scenario "${scenarioId}".`,
      scenarioId,
      stepId,
    );
  }

  public static createForInvalidStep(scenarioId: ScenarioId, stepId: StepId): SessionScenarioStepNotAllowedError {
    return new this(
      `The specified step "${stepId}" is not allowed within the current scenario "${scenarioId}" and session.`,
      scenarioId,
      stepId,
    );
  }
}
