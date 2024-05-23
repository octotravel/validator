import { CapabilityId } from '@octocloud/types';
import { ScenarioId } from '../common/validation/v2/scenario/ScenarioId';
import { StepId } from '../common/validation/v2/step/StepId';
import { ValidationResult } from '../common/validation/v2/ValidationResult';

export interface Session {
  id: string;
  name: string;
  capabilities: CapabilityId[] | null;
  currentScenario: ScenarioId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionWithProgress {
  id: string;
  name: string;
  capabilities: CapabilityId[] | null;
  currentScenario: ScenarioId | null;
  scenariosProgress: SessionScenarioProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionScenarioProgress {
  id: ScenarioId;
  steps: SessionScenarioProgressStep[];
}

export interface SessionScenarioProgressStep {
  id: StepId;
  status: SessionScenarioProgressStepStatus;
}

export enum SessionScenarioProgressStepStatus {
  COMPLETED = 'completed',
  PENDING_VALIDATION = 'pending_validatiton',
  PENDING_QUESTIONS = 'pending_questions',
}

export interface SessionValidationHistory {
  stepId: StepId;
  reqHeaders: Record<string, string>;
  reqBody: string;
  validationResult: ValidationResult;
  isValid: boolean;
}

export interface UpdateSessionData {
  id: string;
  name?: string;
  capabilities?: CapabilityId[] | null;
  currentScenario?: ScenarioId | null;
  currentStep?: StepId | null;
}

export interface SessionData {
  id: string;
  name: string;
  capabilities: CapabilityId[] | null;
  currentScenario: ScenarioId | null;
  currentStep: StepId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionRowData {
  id: string;
  name: string;
  capabilities: string | null;
  current_scenario: string | null;
  current_step: string | null;
  created_at: Date;
  updated_at: Date;
}
