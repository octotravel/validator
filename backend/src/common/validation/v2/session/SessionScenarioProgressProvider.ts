import { inject } from '@needle-di/core';
import { $enum } from 'ts-enum-util';
import { Session, SessionScenarioProgress, SessionScenarioProgressStepStatus } from '../../../../types/Session';
import { RequestLogProgress, RequestLogRepository } from '../../../requestLog/RequestLogRepository';
import { ScenarioId } from '../scenario/ScenarioId';
import { ScenarioService } from '../scenario/ScenarioService';

export class SessionScenarioProgressProvider {
  public constructor(
    private readonly scenarioService: ScenarioService = inject(ScenarioService),
    private readonly requestLogRepository: RequestLogRepository = inject<RequestLogRepository>('RequestLogRepository'),
  ) {}

  public async getSessionScenarioProgress(session: Session): Promise<SessionScenarioProgress[]> {
    const requestLogs = await this.requestLogRepository.getAllForProgress(session.id);
    let scenarioProgress = await this.convertRequestLogsToScenarioProgress(session.currentScenario, requestLogs);
    scenarioProgress = await this.orderAndCorrectScenarioProgress(scenarioProgress);

    return scenarioProgress;
  }

  private async convertRequestLogsToScenarioProgress(
    currentScenarioId: ScenarioId | null,
    requestLogProgress: RequestLogProgress[],
  ): Promise<SessionScenarioProgress[]> {
    const scenariosProgress: Record<string, SessionScenarioProgress> = {};

    if (currentScenarioId !== null && requestLogProgress.length === 0) {
      const scenario = await this.scenarioService.getResellerScenarioById(currentScenarioId);
      const scenarioSteps = scenario.getSteps();
      const firstStepId = scenarioSteps.getNodeAt(0)!.value.getId();
      scenariosProgress[currentScenarioId] = {
        id: currentScenarioId,
        steps: [{ id: firstStepId, status: SessionScenarioProgressStepStatus.PENDING_VALIDATION }],
      };
      return Object.values(scenariosProgress);
    }

    for (const requestLogProgressItem of requestLogProgress) {
      const { scenarioId, stepId, isValid, hasCorrectlyAnsweredQuestions } = requestLogProgressItem;

      if (!scenariosProgress[scenarioId]) {
        scenariosProgress[scenarioId] = { id: scenarioId, steps: [] };
      }

      let status: SessionScenarioProgressStepStatus;

      if (isValid && hasCorrectlyAnsweredQuestions) {
        status = SessionScenarioProgressStepStatus.COMPLETED;
      } else if (isValid && !hasCorrectlyAnsweredQuestions) {
        status = SessionScenarioProgressStepStatus.PENDING_QUESTIONS;
      } else {
        status = SessionScenarioProgressStepStatus.PENDING_VALIDATION;
      }

      scenariosProgress[scenarioId].steps.push({
        id: stepId,
        status: status,
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
      const latestScenarioStepProgress = scenarioProgressItem.steps[scenarioProgressItem.steps.length - 1];

      const latestScenarioStep = scenarioSteps.find((step) => {
        return step.getId() === latestScenarioStepProgress.id;
      });
      const latestScenarioStepNode = scenarioSteps.getNode(latestScenarioStep)!;
      const nextScenarioStepNode = latestScenarioStepNode?.next;

      if (
        latestScenarioStepProgress.status !== SessionScenarioProgressStepStatus.PENDING_VALIDATION &&
        latestScenarioStepProgress.status !== SessionScenarioProgressStepStatus.PENDING_QUESTIONS &&
        nextScenarioStepNode !== undefined
      ) {
        scenarioProgressItem.steps.push({
          id: nextScenarioStepNode.value.getId(),
          status: SessionScenarioProgressStepStatus.PENDING_VALIDATION,
        });
      }
    }

    return scenarioProgress;
  }
}
