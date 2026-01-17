import { inject } from '@needle-di/core';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionData, UpdateSessionData } from '../../../../types/Session';
import { ScenarioService } from '../scenario/ScenarioService';
import { SessionMissingRequiredScenarioCapabilities } from './error/SessionMissingRequiredScenarioCapabilities';
import { SessionNotFoundError } from './error/SessionNotFoundError';
import { SessionRepository } from './SessionRepository';

export class SessionService {
  public constructor(
    private readonly sessionRepository: SessionRepository = inject('SessionRepository'),
    private readonly scenarioService = inject(ScenarioService),
  ) {}

  public async createSession(): Promise<Session> {
    const sessionId = uuidv4();
    const sessionData: SessionData = {
      id: sessionId,
      name: sessionId,
      capabilities: null,
      currentScenario: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionRepository.create(sessionData);
    return sessionData as Session;
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    const session = await this.sessionRepository.get(updateSessionData.id);

    if (session === null) {
      throw new SessionNotFoundError(updateSessionData.id);
    }

    const capabilities = updateSessionData.capabilities ?? session.capabilities;

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
    }

    const updatedSessionData: SessionData = {
      ...session,
      name: updateSessionData.name ?? session.name,
      capabilities: capabilities,
      currentScenario:
        updateSessionData.currentScenario !== undefined ? updateSessionData.currentScenario : session.currentScenario,
    };

    await this.sessionRepository.update(updatedSessionData);
    return updatedSessionData;
  }

  public async getSession(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.get(sessionId);

    if (session === null) {
      throw new SessionNotFoundError(sessionId);
    }

    return session;
  }
}
