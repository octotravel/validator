import { SessionData } from '../../../../types/Session';

export interface SessionRepository {
  create: (sessionData: SessionData) => Promise<void>;
  update: (sessionData: SessionData) => Promise<void>;
  get: (id: string) => Promise<SessionData | null>;
  delete: (id: string) => Promise<void>;
}
