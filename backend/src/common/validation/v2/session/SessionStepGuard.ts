import { inject, singleton } from 'tsyringe';
import { Session } from '../../../../types/Session';
import { Step } from '../step/Step';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionScenarioNotSetError } from './error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';

@singleton()
export class SessionStepGuard {
  public constructor(@inject(ScenarioService) private readonly scenarioService: ScenarioService) {}

  public async check(session: Session, currentStep: Step): Promise<void> {
    if (session.currentScenario === null) {
      throw new SessionScenarioNotSetError();
    }

    const currentStepId = currentStep.getId();
    const currentSessionStepId = session.currentStep;
    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);
    const scenarioSteps = scenario.getSteps();
    const scenarioFirstStepId = scenarioSteps.getNodeAt(0)!.value.getId();
    const currentStepInScenario = scenarioSteps.getNode(currentStep) ?? null;
    const previousScenarioStepId = currentStepInScenario?.prev?.value.getId();

    if (currentStepInScenario === null) {
      throw SessionScenarioStepNotAllowedError.createForNonExistingStep(scenario.getId(), currentStep.getId());
    }

    if (currentSessionStepId === null && scenarioFirstStepId !== currentStepId) {
      throw SessionScenarioStepNotAllowedError.createForInvalidFirstStep(
        scenario.getId(),
        scenarioFirstStepId,
        currentStepId,
      );
    }

    if (
      currentSessionStepId !== null &&
      currentSessionStepId !== previousScenarioStepId &&
      currentSessionStepId !== currentStep.getId()
    ) {
      throw SessionScenarioStepNotAllowedError.createForInvalidStep(scenario.getId(), currentStep.getId());
    }
  }
}
