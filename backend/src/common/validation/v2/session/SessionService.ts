import { inject, singleton } from 'tsyringe';
import { SessionRepository } from './SessionRepository';
import { v4 as uuidv4 } from 'uuid';
import { SessionNotFoundError } from './error/SessionNotFoundError';
import { Session, SessionData, SessionScenarioProgressStepStatus, UpdateSessionData } from '../../../../types/Session';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionMissingRequiredScenarioCapabilities } from './error/SessionMissingRequiredScenarioCapabilities';
import { SessionScenarioNotSetError } from './error/SessionScenarioNotSetError';
import { StepId } from '../step/StepId';
import { SessionScenarioStepNotAllowedError } from './error/SessionScenarioStepNotAllowedError';
import { SessionScenarioProgressProvider } from './SessionScenarioProgressProvider';

@singleton()
export class SessionService {
  public constructor(
    @inject('SessionRepository') private readonly sessionRepository: SessionRepository,
    @inject(ScenarioService) private readonly scenarioService: ScenarioService,
    @inject(SessionScenarioProgressProvider)
    private readonly sessionScenarioProgressProvider: SessionScenarioProgressProvider,
  ) {}

  public async createSession(): Promise<Session> {
    const sessionId = uuidv4();
    const sessionData: SessionData = {
      id: sessionId,
      name: sessionId,
      capabilities: null,
      currentScenario: null,
      currentStep: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionRepository.create(sessionData);
    return sessionData as Session;
  }

  public async updateSessionStep(sessionId: string, targetStepId: StepId): Promise<void> {
    const session = await this.sessionRepository.get(sessionId);

    if (session === null) {
      throw new SessionNotFoundError(sessionId);
    }

    const currentScenarioId = session.currentScenario;

    if (currentScenarioId === null) {
      throw new SessionScenarioNotSetError();
    }

    const scenario = await this.scenarioService.getResellerScenarioById(currentScenarioId);
    const scenarioSteps = scenario.getSteps();
    const targetStep = scenarioSteps.find((step) => step.getId() === targetStepId) ?? null;

    if (targetStep === null) {
      throw SessionScenarioStepNotAllowedError.createForNonExistingStep(currentScenarioId, targetStepId);
    }

    const targetStepIndex = scenarioSteps.indexOf(targetStep);
    const currentStep = scenarioSteps.find((step) => step.getId() === session.currentStep)!;
    const currentStepIndex = scenarioSteps.indexOf(currentStep);

    if (targetStepIndex <= currentStepIndex) {
      return;
    }

    await this.sessionRepository.update({
      ...session,
      currentStep: targetStepId,
    });
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    const session = await this.sessionRepository.get(updateSessionData.id);

    if (session === null) {
      throw new SessionNotFoundError(updateSessionData.id);
    }

    const capabilities = updateSessionData.capabilities ?? session.capabilities;
    let currentStep = session.currentStep;

    if (updateSessionData.currentScenario === null) {
      currentStep = null;
    }

    if (updateSessionData.currentScenario && updateSessionData.currentScenario !== session.currentScenario) {
      const scenario = await this.scenarioService.getScenarioById(updateSessionData.currentScenario);
      const scenarioRequiredCapabilities = scenario.getRequiredCapabilities();

      if (scenario.getRequiredCapabilities().length !== 0) {
        for (const scenarioRequiredCapability of scenarioRequiredCapabilities) {
          if (capabilities?.includes(scenarioRequiredCapability)) {
            continue;
          }

          throw new SessionMissingRequiredScenarioCapabilities(session.id, scenarioRequiredCapabilities);
        }
      }

      const requestLogScenarioProgress = await this.sessionScenarioProgressProvider.getSessionScenarioProgress(session);
      const currentScenarioProgress = requestLogScenarioProgress.find((scenarioProgress) => {
        return scenarioProgress.id === updateSessionData.currentScenario;
      });

      const lastCompletedStepInScenarioProgress =
        currentScenarioProgress?.steps
          .reverse()
          .find((step) => step.status === SessionScenarioProgressStepStatus.COMPLETED) ?? null;

      if (lastCompletedStepInScenarioProgress !== null) {
        currentStep = lastCompletedStepInScenarioProgress.id;
      } else {
        currentStep = null;
      }
    }

    const updatedSessionData: SessionData = {
      ...session,
      name: updateSessionData.name ?? session.name,
      capabilities: capabilities,
      currentScenario:
        updateSessionData.currentScenario !== undefined ? updateSessionData.currentScenario : session.currentScenario,
      currentStep: currentStep,
    };

    await this.sessionRepository.update(updatedSessionData);
    return updatedSessionData;
  }

  private async handleScenarioUpdate(updateSessionData: UpdateSessionData): Promise<UpdateSessionData> {
    return updateSessionData;
  }

  public async getSession(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.get(sessionId);

    if (session === null) {
      throw new SessionNotFoundError(sessionId);
    }

    return session;
  }
}
