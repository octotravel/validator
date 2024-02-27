import { CapabilityId } from '@octocloud/types';
import { ScenarioId } from '../common/validation/v2/types/ScenarioId';
import { StepId } from '../common/validation/v2/types/StepId';

export interface Session {
  id: string;
  name: string;
  capabilities: CapabilityId[];
  currentScenario: ScenarioId | null;
  currentStep: StepId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateSessionData {
  id: string;
  name?: string;
  capabilities?: CapabilityId[];
  currentScenario?: ScenarioId | null;
  currentStep?: StepId | null;
}

export interface SessionData {
  id: string;
  name: string;
  capabilities: CapabilityId[];
  currentScenario: ScenarioId | null;
  currentStep: StepId | null;
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
