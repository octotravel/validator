import { resellerSessionStore } from '$lib/stores';
import type { ToastSettings } from '@skeletonlabs/skeleton';

export const createSession = async (toastStore: any) => {
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
			background: 'variant-filled-error',
		};
		toastStore.trigger(t);

		return;
	}

	const session = await response.json();

	resellerSessionStore.set({ session, isLoading: false, error: null });
};

export const findSession = async (id: string, toastStore: any) => {
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
			background: 'variant-filled-warning',
		};
		toastStore.trigger(t);

		return;
	}

	const session = await response.json();
	console.log(session);
	resellerSessionStore.set({ session, isLoading: false, error: null });
};