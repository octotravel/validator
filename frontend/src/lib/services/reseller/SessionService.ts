import { resellerSessionStore } from '$lib/stores';
import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

export abstract class SessionService {
	public static createSession = async (toastStore: ToastStore) => {
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

	public static findSession = async (id: string, toastStore: ToastStore) => {
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

	public static updateSession = async (toastStore: ToastStore) => {
		const sessionStore = get(resellerSessionStore);
		const body = {
			id: sessionStore.session?.id,
			name: sessionStore.session?.name,
			capabilities: sessionStore.session?.capabilities,
			currentScenario: sessionStore.session?.currentScenario
		};
		const response = await fetch(`/api/reseller/session`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
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
