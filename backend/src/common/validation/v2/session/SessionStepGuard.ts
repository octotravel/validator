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

    const currentSessionStepId = session.currentStep;
    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);
    const scenarioSteps = scenario.getSteps();
    const firstScenarioStepId = scenarioSteps.getNodeAt(0)?.value.getId();
    const previousScenarioStepId = scenarioSteps.getNode(currentStep)?.prev?.value.getId();

    if (
      (currentSessionStepId === null && firstScenarioStepId !== currentStep.getId()) ||
      (currentSessionStepId !== null &&
        currentSessionStepId !== previousScenarioStepId &&
        currentSessionStepId !== currentStep.getId())
    ) {
      throw new SessionScenarioStepNotAllowedError(session.id, currentStep.getId());
    }
  }
}
