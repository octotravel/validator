import { CapabilityId } from '@octocloud/types';
import type { Scenario } from './Scenarios';

export interface Session {
	id: string;
	name: string;
	capabilities: CapabilityId[] | null;
	currentScenario: string | null;
	currentStep: string | null;
	scenariosProgress: ScenarioProgress[];
	url: string;
}

export interface UpdateSessionData {
	id: string;
	name?: string;
	capabilities?: CapabilityId[];
	currentScenario?: string | null;
	currentStep?: string | null;
}

export interface SessionStore {
	session: Session | null;
	isLoading: boolean;
	error: string | null;
}

export interface ScenarioProgress {
	id: string;
	name: string;
	description: string;
	requiredCapabilities: CapabilityId[];
	optionalCapabilities: CapabilityId[];
	steps: ScenarioProgressStep[];
  }
  
  export interface ScenarioProgressStep {
	id: string;
	name: string;
	description: string;
	endpointUrl: string;
	docsUrl: string;
	status: ScenarioProgressStepStatus;
  }
  
  export enum ScenarioProgressStepStatus {
	COMPLETED = 'completed',
	PENDING = 'pending',
  }

  export interface ScenarioStore {
	scenario: ScenarioProgress | null;
	isLoading: boolean;
  }