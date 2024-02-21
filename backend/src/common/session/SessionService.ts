import { inject, singleton } from 'tsyringe';
import { SessionData, Session, UpdateSessionData } from '../../types/Session';
import { SessionRepository } from './SessionRepository';
import { v4 as uuidv4 } from 'uuid';
import { HttpBadRequest } from '@octocloud/core';

@singleton()
export class SessionService {
  public constructor(@inject('SessionRepository') private readonly sessionRepository: SessionRepository) {}

  public async createSession(): Promise<Session> {
    const sessionId = uuidv4();
    const sessionData: SessionData = {
      id: sessionId,
      name: sessionId,
      capabilities: [],
      currentScenario: null,
      currentStep: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionRepository.create(sessionData);
    return sessionData;
  }

  public async updateSession(updateSessionData: UpdateSessionData): Promise<Session> {
    const session = await this.sessionRepository.get(updateSessionData.id);
    if (session === null) {
      throw new HttpBadRequest(`Session ${updateSessionData.id} not found.`);
    }

    const updatedSessionData: SessionData = {
      ...session,
      name: updateSessionData.name ?? session.name,
      capabilities: updateSessionData.capabilities ?? session.capabilities,
      currentScenario: updateSessionData.currentScenario ?? session.currentScenario,
      currentStep: updateSessionData.currentStep ?? session.currentStep,
    };

    await this.sessionRepository.update(updatedSessionData);
    return updatedSessionData;
  }
}
