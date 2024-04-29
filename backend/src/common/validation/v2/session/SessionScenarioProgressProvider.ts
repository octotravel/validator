import { inject, singleton } from 'tsyringe';
import { Session, SessionScenarioProgress, SessionScenarioProgressStepStatus } from '../../../../types/Session';
import { ScenarioService } from '../scenario/ScenarioService';
import { RequestLogRepository } from '../../../requestLog/RequestLogRepository';

@singleton()
export class SessionScenarioProgressProvider {
  public constructor(
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
    @inject('RequestLogRepository') private readonly requestLogRepository: RequestLogRepository,
  ) {}

  public async getSessionScenarioProgress(session: Session): Promise<SessionScenarioProgress[]> {
    const requestLogScenarioProgress = await this.getScenarioProgressFromRequestLog(session.id);
    let scenarioProgress = requestLogScenarioProgress;

    if (requestLogScenarioProgress.length === 0) {
      scenarioProgress = await this.getScenarioProgressFromSession(session);
    }

    return scenarioProgress;
  }

  private async getScenarioProgressFromSession(session: Session): Promise<SessionScenarioProgress[]> {
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

  private async getScenarioProgressFromRequestLog(sessionId: string): Promise<SessionScenarioProgress[]> {
    const requestLogs = await this.requestLogRepository.getAllForProgress(sessionId);
    const scenariosProgress: Record<string, SessionScenarioProgress> = {};

    for (const requestLog of requestLogs) {
      const { scenarioId, stepId, isValid } = requestLog;
      if (!scenariosProgress[scenarioId]) {
        scenariosProgress[scenarioId] = { id: scenarioId, steps: [] };
      }
      scenariosProgress[scenarioId].steps.push({
        id: stepId,
        status: isValid ? SessionScenarioProgressStepStatus.COMPLETED : SessionScenarioProgressStepStatus.PENDING,
      });
    }

    return Object.values(scenariosProgress);
  }
}
