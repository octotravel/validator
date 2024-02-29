import { scenariosStore } from '$lib/stores';
import type { ToastSettings } from '@skeletonlabs/skeleton';

export abstract class ScenariosService {
	public static getScenarios = async (toastStore: any) => {
		scenariosStore.set({ scenarios: null, isLoading: true, error: null });

		const response = await fetch(`/api/reseller/scenarios`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			scenariosStore.set({ scenarios: null, isLoading: false, error: response.statusText });

			const t: ToastSettings = {
				message: `Failed to fetch scenarios: ${response.statusText}`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			return;
		}

		const scenarios = await response.json();

		scenariosStore.set({ scenarios, isLoading: false, error: null });
	};
}
