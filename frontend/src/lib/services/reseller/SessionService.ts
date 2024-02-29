import { resellerSessionStore } from '$lib/stores';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

export abstract class ResellerService {
	public static createSession = async (toastStore: any) => {
		resellerSessionStore.set({ session: null, isLoading: true, error: null });

		const response = await fetch(`/api/reseller/session`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			resellerSessionStore.set({ session: null, isLoading: false, error: response.statusText });

			const t: ToastSettings = {
				message: 'There was an error creating the session. Please try again later.',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);

			return;
		}

		const session = await response.json();

		resellerSessionStore.set({ session, isLoading: false, error: null });
	};

	public static findSession = async (id: string, toastStore: any) => {
		if (!id) {
			return;
		}
		resellerSessionStore.set({ session: null, isLoading: true, error: null });

		const response = await fetch(`/api/reseller/session/?id=${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			resellerSessionStore.set({ session: null, isLoading: false, error: response.statusText });

			const t: ToastSettings = {
				message: `Session "${id}" not found.`,
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);

			return;
		}

		const session = await response.json();

		resellerSessionStore.set({ session, isLoading: false, error: null });
	};

	public static updateSession = async (toastStore: any) => {
		const body = get(resellerSessionStore).session;
		const response = await fetch(`/api/reseller/session`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'applicati,on/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const t: ToastSettings = {
				message: 'There was an error updating the session. Please try again later.',
				background: 'variant-filled-error'
			};
			toastStore.trigger(t);
		}
	};
}
