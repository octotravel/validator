import type { CapabilityId } from '@octocloud/types';

export type ScenariosResponse = Scenario[];

export interface Scenario {
	id: string;
	name: string;
	description: string;
	requiredCapabilities: CapabilityId[];
	optionalCapabilities: CapabilityId[];
	steps: Step[];
}

export interface ScenariosStore {
	scenarios: Scenario[] | null;
	isLoading: boolean;
	error: string | null;
}

export interface ScenarioStore {
	scenario: Scenario | null;
	isLoading: boolean;
	error: string | null;
}

export interface Step {
	id: string;
	name: string;
	description: string;
	endpointUrl: string;
	docsUrl: string;
}
