import { apiRequest, showError } from '$lib/services/api';
import { resellerSessionStore } from '$lib/stores';
import type { Session } from '$lib/types/Session';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { get } from 'svelte/store';

export abstract class SessionService {
	public static createSession = async (toastStore: ToastStore) => {
		resellerSessionStore.set({ session: null, isLoading: true, error: null });

		const result = await apiRequest<Session>('/api/reseller/session', { method: 'POST' });

		if (!result.ok) {
			resellerSessionStore.set({ session: null, isLoading: false, error: result.error });
			showError(toastStore, 'Could not create session', result.error);
			return;
		}

		resellerSessionStore.set({ session: result.data, isLoading: false, error: null });
	};

	public static findSession = async (id: string, toastStore: ToastStore) => {
		if (!id) {
			return;
		}

		resellerSessionStore.set({ session: null, isLoading: true, error: null });

		const result = await apiRequest<Session>(`/api/reseller/session?id=${encodeURIComponent(id)}`);

		if (!result.ok) {
			const error = result.status === 404 ? `Session "${id}" was not found.` : result.error;

			resellerSessionStore.set({ session: null, isLoading: false, error });
			showError(toastStore, 'Could not load session', error);
			return;
		}

		resellerSessionStore.set({ session: result.data, isLoading: false, error: null });
	};

	public static updateSession = async (toastStore: ToastStore) => {
		const sessionStore = get(resellerSessionStore);

		const body = {
			id: sessionStore.session?.id,
			name: sessionStore.session?.name,
			capabilities: sessionStore.session?.capabilities,
			currentScenario: sessionStore.session?.currentScenario
		};

		const result = await apiRequest<Session>('/api/reseller/session', {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		if (!result.ok) {
			resellerSessionStore.update((s) => ({ ...s, error: result.error }));
			showError(toastStore, 'Could not save session', result.error);
		}

		return result.ok;
	};
}
