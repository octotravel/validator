import type { CapabilitiesStore } from '$lib/types/Capabilities';
import type { ScenarioProgress, ScenarioStore, SessionStore } from '$lib/types/Session';
import type { SupplierValidationStore } from '$lib/types/SupplierFlow';
import type { ValidationResultStore } from '$lib/types/Validation';
import { writable } from 'svelte/store';

export const pageTitleStore = writable<string>('');

export const supplierFlowResultStore = writable<SupplierValidationStore>({
	flows: [],
	isLoading: false,
	error: null
});

export const resellerSessionStore = writable<SessionStore>({
	session: null,
	isLoading: false,
	error: null
});

export const resellerCapabilitiesStore = writable<CapabilitiesStore>({
	capabilities: [],
	isLoading: false,
	error: null
});

export const resellerScenarioSelectedStore = writable<ScenarioStore>({
	scenario: null,
	error: null,
	stepsHistory: [],
	isLoading: false,
	isLoadingSteps: false
});

export const resellerScenarioValidationResultStore = writable<ValidationResultStore>({
	results: [],
	isLoading: false
});

export const resellerScenariosListLoadingStore = writable<boolean>(false);

interface ResellerScenarioAnswer {
	questionId: string;
	answer: any;
}

export const resellerScenarioAnswersStore = writable<ResellerScenarioAnswer[]>([]);