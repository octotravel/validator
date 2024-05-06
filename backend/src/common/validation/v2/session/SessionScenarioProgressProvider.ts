import { inject, singleton } from 'tsyringe';
import { Session, SessionScenarioProgress, SessionScenarioProgressStepStatus } from '../../../../types/Session';
import { ScenarioService } from '../scenario/ScenarioService';
import { RequestLogProgress, RequestLogRepository } from '../../../requestLog/RequestLogRepository';
import { ScenarioId } from '../scenario/ScenarioId';
import { $enum } from 'ts-enum-util';

@singleton()
export class SessionScenarioProgressProvider {
  public constructor(
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
    @inject('RequestLogRepository') private readonly requestLogRepository: RequestLogRepository,
  ) {}

  public async getSessionScenarioProgress(session: Session): Promise<SessionScenarioProgress[]> {
    const requestLogScenarioProgress = await this.getScenarioProgressFromRequestLog(session);
    const sessionScenarioProgress = await this.getScenarioProgressFromSession(session);
    const scenarioProgress = requestLogScenarioProgress;

    const isSessionScenarioIncluded = scenarioProgress.find(
      (scenarioProgress) => scenarioProgress.id === session.currentScenario,
    );

    if (!isSessionScenarioIncluded && sessionScenarioProgress !== null) {
      scenarioProgress.push(sessionScenarioProgress);
    }

    return scenarioProgress;
  }

  public async getScenarioProgressFromSession(session: Session): Promise<SessionScenarioProgress | null> {
    if (session.currentScenario === null) {
      return null;
    }

    const sessionScenarioProgress: SessionScenarioProgress = {
      id: session.currentScenario,
      steps: [],
    };

    const scenario = await this.scenarioService.getResellerScenarioById(session.currentScenario);
    const scenarioSteps = scenario.getSteps();
    const step = scenarioSteps.find((step) => step.getId() === session.currentStep);
    const scenarioFirstStep = scenarioSteps.getNodeAt(0)!.value;

    if (step === undefined || scenarioFirstStep.getId() === session.currentStep) {
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
          status: SessionScenarioProgressStepStatus.COMPLETED
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

    return sessionScenarioProgress;
  }

  public async getScenarioProgressFromRequestLog(session: Session): Promise<SessionScenarioProgress[]> {
    const requestLogs = await this.requestLogRepository.getAllForProgress(session.id);
    let scenarioProgress = await this.convertRequestLogsToScenarioProgress(requestLogs);
    scenarioProgress = await this.orderAndCorrectScenarioProgress(scenarioProgress);

    return scenarioProgress;
  }

  private async convertRequestLogsToScenarioProgress(
    requestLogProgress: RequestLogProgress[],
  ): Promise<SessionScenarioProgress[]> {
    const scenariosProgress: Record<string, SessionScenarioProgress> = {};

    for (const requestLogProgressItem of requestLogProgress) {
      const { scenarioId, stepId, isValid } = requestLogProgressItem;
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

  private async orderAndCorrectScenarioProgress(
    scenarioProgress: SessionScenarioProgress[],
  ): Promise<SessionScenarioProgress[]> {
    const scenarioIds = $enum(ScenarioId);
    scenarioProgress.sort((firstScenario, secondScenario) => {
      return scenarioIds.indexOfValue(firstScenario.id) - scenarioIds.indexOfValue(secondScenario.id);
    });

    for (const scenarioProgressItem of scenarioProgress) {
      const scenario = await this.scenarioService.getResellerScenarioById(scenarioProgressItem.id);
      const scenarioSteps = scenario.getSteps();
      const scenarioStepsIds = scenarioSteps.map((step) => step.getId());
      scenarioProgressItem.steps.sort((firstStep, secondStep) => {
        return scenarioStepsIds.indexOf(firstStep.id) - scenarioStepsIds.indexOf(secondStep.id);
      });

      const latestScenarioStep = scenarioSteps.find((step) => {
        return step.getId() === scenarioProgressItem.steps[scenarioProgressItem.steps.length - 1].id;
      });
      const latestScenarioStepNode = scenarioSteps.getNode(latestScenarioStep);
      const nextScenarioStepNode = latestScenarioStepNode?.next;

      if (nextScenarioStepNode !== undefined) {
        scenarioProgressItem.steps.push({
          id: nextScenarioStepNode.value.getId(),
          status: SessionScenarioProgressStepStatus.PENDING,
        });
      }
    }

    return scenarioProgress;
  }
}
