import { Session } from '../../../../types/Session';
import { Step } from '../step/Step';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionScenarioNotSetError } from './error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { SessionIsInInvalidState } from './error/SessionIsInInvalidState';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';
import { inject } from '@needle-di/core';

export class SessionStepGuard {
  public constructor(
    private readonly scenarioService: ScenarioService = inject(ScenarioService),
    private readonly sessionScenarioProgressProvider: SessionScenarioProgressProvider = inject(
      SessionScenarioProgressProvider,
    ),
  ) {}

  public async check(session: Session, targetStep: Step): Promise<void> {
    if (session.currentScenario === null) {
      throw new SessionScenarioNotSetError();
    }

    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);
    const scenarioId = scenario.getId();
    const scenarioSteps = scenario.getSteps();
    const targetStepIndexInScenario = scenarioSteps.indexOf(targetStep);

    if (targetStepIndexInScenario === -1) {
      throw SessionScenarioStepNotAllowedError.createForNonExistingStep(scenarioId, targetStep.getId());
    }

    const scenarioFirstStepId = scenarioSteps.getNodeAt(0)!.value.getId();
    const targetStepId = targetStep.getId();
    const sessionScenarioProgress = await this.sessionScenarioProgressProvider.getSessionScenarioProgress(session);
    const specificSessionScenarioProgress = sessionScenarioProgress.find(
      (scenarioProgress) => scenarioProgress.id === scenarioId,
    )!;
    const currentStepId =
      specificSessionScenarioProgress.steps[specificSessionScenarioProgress.steps.length - 1]?.id ?? null;

    if (currentStepId === null) {
      if (targetStepIndexInScenario !== 0) {
        throw SessionScenarioStepNotAllowedError.createForInvalidFirstStep(
          scenarioId,
          scenarioFirstStepId,
          targetStepId,
        );
      }
    } else {
      const currentStep = scenarioSteps.find((step) => step.getId() === currentStepId);

      if (currentStep === undefined) {
        throw new SessionIsInInvalidState(session.id, session.currentScenario, currentStepId);
      }

      const isStepInCurrentScenarioProgress =
        specificSessionScenarioProgress?.steps.some((stepProgress) => stepProgress.id === targetStepId) ?? false;

      const currentStepIndexInScenario = scenarioSteps.indexOf(currentStep);

      if (
        targetStepIndexInScenario !== currentStepIndexInScenario &&
        targetStepIndexInScenario !== currentStepIndexInScenario + 1 &&
        targetStepIndexInScenario >= currentStepIndexInScenario &&
        !isStepInCurrentScenarioProgress
      ) {
        throw SessionScenarioStepNotAllowedError.createForInvalidStep(scenario.getId(), targetStepId);
      }
    }
  }
}
