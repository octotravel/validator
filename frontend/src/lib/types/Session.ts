import { CapabilityId } from '@octocloud/types';

export interface Session {
  id: string;
  name: string;
  capabilities: CapabilityId[];
  currentScenario: string | null;
  currentStep: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSessionData {
  id: string;
  name?: string;
  capabilities?: CapabilityId[];
  currentScenario?: string | null;
  currentStep?: string | null;
}

export interface SessionData {
  id: string;
  name: string;
  capabilities: CapabilityId[];
  currentScenario: string | null;
  currentStep: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionRowData {
  id: string;
  name: string;
  capabilities: string;
  current_scenario: string | null;
  current_step: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SessionStore {
	session: Session | null;
	isLoading: boolean;
	error: string | null;
}