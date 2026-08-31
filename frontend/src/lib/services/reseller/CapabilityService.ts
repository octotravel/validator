import { apiRequest, showError } from '$lib/services/api';
import { resellerCapabilitiesStore } from '$lib/stores';
import type { Capability } from '$lib/types/Capabilities';
import type { ToastStore } from '@skeletonlabs/skeleton';

export abstract class CapabilityService {
	public static getCapabilities = async (toastStore: ToastStore | null = null) => {
		resellerCapabilitiesStore.set({ capabilities: [], isLoading: true, error: null });

		const result = await apiRequest<{ capabilities: Capability[] }>('/api/reseller/capabilities');

		if (!result.ok) {
			resellerCapabilitiesStore.set({ capabilities: [], isLoading: false, error: result.error });

			if (toastStore) {
				showError(toastStore, 'Could not load capabilities', result.error);
			}

			return null;
		}

		resellerCapabilitiesStore.set({
			capabilities: result.data?.capabilities ?? [],
			isLoading: false,
			error: null
		});
	};
}
