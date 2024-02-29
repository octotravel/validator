import type { CapabilityId } from '@octocloud/types';

export type ScenariosResponse = Scenario[];

export interface Scenario {
	id: string;
	name: string;
	description: string;
	requiredCapabilities: CapabilityId[];
	optionalCapabilities: CapabilityId[];
}

export interface ScenariosStore {
	scenarios: Scenario[] | null;
	isLoading: boolean;
	error: string | null;
}
