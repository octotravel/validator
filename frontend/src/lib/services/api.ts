import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

export interface ApiResult<T> {
	ok: boolean;
	data: T | null;
	error: string | null;
	status: number | null;
}

export interface ApiRequestInit {
	method?: string;
	body?: string;
	headers?: Record<string, string>;
}

const parse = async (response: Response): Promise<unknown> => {
	const text = await response.text();

	if (text === '') {
		return null;
	}

	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
};

const messageFrom = (payload: unknown, status: number, statusText: string): string => {
	if (payload && typeof payload === 'object') {
		const record = payload as Record<string, unknown>;

		for (const key of ['message', 'errorMessage', 'detail', 'error']) {
			if (typeof record[key] === 'string' && record[key]) {
				return record[key] as string;
			}
		}
	}

	if (status === 401) {
		return 'You are not signed in. Please sign in and try again.';
	}

	if (typeof payload === 'string' && payload.trim() && !payload.trim().startsWith('<')) {
		return payload.trim().slice(0, 300);
	}

	if (statusText) {
		return statusText;
	}

	return `Request failed with HTTP ${status}.`;
};

export const apiRequest = async <T>(
	url: string,
	init: ApiRequestInit = {}
): Promise<ApiResult<T>> => {
	let response: Response;

	try {
		response = await fetch(url, {
			method: init.method,
			body: init.body,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(init.headers ?? {})
			}
		});
	} catch {
		return {
			ok: false,
			data: null,
			status: null,
			error:
				'Network error - the validator frontend could not be reached. Check your connection and try again.'
		};
	}

	const payload = await parse(response);

	if (!response.ok) {
		return {
			ok: false,
			data: null,
			status: response.status,
			error: messageFrom(payload, response.status, response.statusText)
		};
	}

	return { ok: true, data: payload as T, status: response.status, error: null };
};

const toast = (toastStore: ToastStore, message: string, background: string, autohide: boolean) => {
	const settings: ToastSettings = { message, background, autohide, hideDismiss: false };

	toastStore.trigger(settings);
};

export const showError = (toastStore: ToastStore, title: string, detail: string | null): void => {
	toast(toastStore, detail ? `${title}: ${detail}` : title, 'variant-filled-error', false);
};

export const showWarning = (toastStore: ToastStore, message: string): void => {
	toast(toastStore, message, 'variant-filled-warning', true);
};
