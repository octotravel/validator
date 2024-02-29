import { capabilitiesStore } from '$lib/stores';

export abstract class CapabilityService {
	public static getCapabilities = async () => {
		capabilitiesStore.set({ capabilities: [], isLoading: true, error: null });

		const response = await fetch(`/api/reseller/capabilities`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			capabilitiesStore.set({ capabilities: [], isLoading: false, error: response.statusText });
			return null;
		}

		const capabilities = await response.json();

		capabilitiesStore.set({ capabilities, isLoading: false, error: null });
	};
}
