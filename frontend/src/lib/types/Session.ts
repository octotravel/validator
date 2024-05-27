import { CapabilityId } from '@octocloud/types';
import type { Question } from './Scenarios';

export interface Session {
	id: string;
	name: string;
	capabilities: CapabilityId[] | null;
	currentScenario: string | null;
	scenariosProgress: ScenarioProgress[];
	url: string;
}

export interface UpdateSessionData {
	id: string;
	name?: string;
	capabilities?: CapabilityId[];
	currentScenario?: string | null;
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
	questions: Question[];
	endpointMethod: string;
	endpointUrl: string;
	docsUrl: string;
	status: ScenarioProgressStepStatus;
}

export enum ScenarioProgressStepStatus {
	COMPLETED = 'completed',
	PENDING_VALIDATION = 'pending_validatiton',
	PENDING_QUESTIONS = 'pending_questions'
}

export interface ScenarioStore {
	scenario: ScenarioProgress | null;
	error: string | null;
	stepsHistory: ScenarioStepsHistory[];
	isLoading: boolean;
	isLoadingSteps: boolean;
}

export interface ScenarioStepsHistory {
	stepId: string;
	status: ScenarioProgressStepStatus;
}
