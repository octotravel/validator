import { resellerCapabilitiesStore } from '$lib/stores';

export abstract class CapabilityService {
	public static getCapabilities = async () => {
		resellerCapabilitiesStore.set({ capabilities: [], isLoading: true, error: null });

		const response = await fetch(`/api/reseller/capabilities`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			resellerCapabilitiesStore.set({
				capabilities: [],
				isLoading: false,
				error: response.statusText
			});
			return null;
		}

		const capabilities = (await response.json()).capabilities;

		resellerCapabilitiesStore.set({ capabilities, isLoading: false, error: null });
	};
}
