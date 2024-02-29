import type { CapabilitiesStore } from '$lib/types/Capabilities';
import type { ScenariosStore } from '$lib/types/Scenarios';
import type { SessionStore } from '$lib/types/Session';
import type { SupplierValidationStore } from '$lib/types/SupplierFlow';
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

export const capabilitiesStore = writable<CapabilitiesStore>({
	capabilities: [],
	isLoading: false,
	error: null
});

export const scenariosStore = writable<ScenariosStore>({
	scenarios: null,
	isLoading: false,
	error: null
});
