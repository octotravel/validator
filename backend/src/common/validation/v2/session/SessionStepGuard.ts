import { inject, singleton } from 'tsyringe';
import { Session } from '../../../../types/Session';
import { Step } from '../step/Step';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionScenarioNotSetError } from './error/SessionScenarioNotSetError';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';

@singleton()
export class SessionStepGuard {
  public constructor(@inject(ScenarioService) private readonly scenarioService: ScenarioService) {}

  public async check(session: Session, step: Step): Promise<void> {
    if (session.currentScenario === null) {
      throw new SessionScenarioNotSetError();
    }

    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);

    if (session.currentStep === null && scenario.getSteps()[0].getId() !== step.getId()) {
      throw new SessionScenarioStepNotAllowedError(session.id, step.getId());
    }
  }
}
