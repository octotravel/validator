import { inject, singleton } from 'tsyringe';
import { SessionService } from './SessionService';
import {
  Session,
  SessionScenarioProgress,
  SessionScenarioProgressStepStatus,
  SessionWithProgress,
  UpdateSessionData,
} from '../../../../types/Session';
import { ScenarioService } from '../scenario/ScenarioService';

@singleton()
export class SessionFacade {
  public constructor(
    @inject(SessionService) private readonly sessionService: SessionService,
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
  ) {}

  public async createSession(): Promise<Session> {
    return await this.sessionService.createSession();
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    return await this.sessionService.updateSession(updateSessionData);
  }

  public async getSession(sessionId: string): Promise<SessionWithProgress> {
    const session = await this.sessionService.getSession(sessionId);
    const sessionScenariosProgress: SessionWithProgress = {
      ...session,
      scenariosProgress: await this.getSessionScenariosProgress(session),
    };

    return sessionScenariosProgress;
  }

  private async getSessionScenariosProgress(session: Session): Promise<SessionScenarioProgress[]> {
    if (session.currentScenario === null) {
      return [];
    }

    const sessionScenariosProgress: SessionScenarioProgress[] = [];

    const sessionScenarioProgress: SessionScenarioProgress = {
      id: session.currentScenario,
      steps: [],
    };

    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);
    const scenarioSteps = scenario.getSteps();
    const step = scenarioSteps.find((step) => step.getId() === session.currentStep);

    if (step === undefined) {
      const scenarioFirstStep = scenarioSteps.getNodeAt(0)!.value;

      sessionScenarioProgress.steps.push({
        id: scenarioFirstStep.getId(),
        status: SessionScenarioProgressStepStatus.PENDING,
      });
    } else {
      let scenarioStepNode = scenarioSteps.getNode(step);
      const nextScenarioStepNode = scenarioStepNode?.next;

      while (scenarioStepNode !== undefined) {
        const scenarioStep = scenarioStepNode.value;
        const scenarioStepId = scenarioStep.getId();

        sessionScenarioProgress.steps.unshift({
          id: scenarioStepId,
          status: SessionScenarioProgressStepStatus.COMPLETED,
        });

        scenarioStepNode = scenarioStepNode.prev;
      }

      if (nextScenarioStepNode !== undefined) {
        const scenarioStep = nextScenarioStepNode.value;

        sessionScenarioProgress.steps.push({
          id: scenarioStep.getId(),
          status: SessionScenarioProgressStepStatus.PENDING,
        });
      }
    }

    sessionScenariosProgress.push(sessionScenarioProgress);

    return sessionScenariosProgress;
  }
}
