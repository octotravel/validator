import { resellerSessionStore } from '$lib/stores';

export const createSession = async () => {
	resellerSessionStore.set({ session: null, isLoading: true, error: null });

	const response = await fetch(`/api/reseller/session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
	});

	if (!response.ok) {
		resellerSessionStore.set({ session: null, isLoading: false, error: response.statusText });
		return;
	}

	const session = await response.json();
console.log(session);
	resellerSessionStore.set({ session, isLoading: false, error: null });
};
