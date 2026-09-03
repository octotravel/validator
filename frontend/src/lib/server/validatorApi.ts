import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const VALIDATOR_BASE_URL = env.PRIVATE_VALIDATOR_BASE_URL || PUBLIC_VALIDATOR_BASE_URL;
const REQUEST_TIMEOUT_MS = 15_000;
const NULL_BODY_STATUSES = [101, 204, 205, 304];

if (!env.PRIVATE_VALIDATOR_BASE_URL) {
	console.warn(
		`PRIVATE_VALIDATOR_BASE_URL is not set; falling back to PUBLIC_VALIDATOR_BASE_URL (${PUBLIC_VALIDATOR_BASE_URL}). When the frontend runs in Docker this must be reachable from inside the container, e.g. http://host.docker.internal:13000.`
	);
}

export interface ProxyOptions {
	method?: string;
	body?: unknown;
	headers?: Record<string, string>;
}

export interface ValidatorResult<T> {
	ok: boolean;
	status: number;
	data: T | null;
	message: string | null;
	code: string | null;
}

const MESSAGE_KEYS = ['message', 'errorMessage', 'detail', 'error'];

const extractMessage = (json: unknown, text: string, status: number): string => {
	if (json && typeof json === 'object') {
		const record = json as Record<string, unknown>;

		for (const key of MESSAGE_KEYS) {
			if (typeof record[key] === 'string' && record[key]) {
				return record[key] as string;
			}
		}
	}

	const trimmed = text.trim();

	if (trimmed && !trimmed.startsWith('<')) {
		return trimmed.slice(0, 300);
	}

	return `The validator backend responded with HTTP ${status}.`;
};

const describeError = (error: unknown): string => {
	if (!(error instanceof Error)) {
		return String(error);
	}

	const cause = (error as Error & { cause?: { code?: string; message?: string } }).cause;
	const causeText = cause
		? ` (cause: ${[cause.code, cause.message].filter(Boolean).join(' ')})`
		: '';

	return `${error.name}: ${error.message}${causeText}`;
};

const transportFailure = <T>(error: unknown, method: string, url: string): ValidatorResult<T> => {
	const timedOut = error instanceof Error && error.name === 'TimeoutError';
	const detail = dev ? ` (${url})` : '';

	console.error(`[validatorApi] ${method} ${url} failed: ${describeError(error)}`);

	return {
		ok: false,
		status: timedOut ? 504 : 502,
		data: null,
		code: timedOut ? 'VALIDATOR_TIMEOUT' : 'VALIDATOR_UNREACHABLE',
		message: timedOut
			? `The validator backend did not respond within ${REQUEST_TIMEOUT_MS / 1000}s${detail}. Please try again shortly.`
			: `The validator backend is currently unreachable${detail}. Please try again shortly.`
	};
};

export const callValidator = async <T>(
	path: string,
	options: ProxyOptions = {}
): Promise<ValidatorResult<T>> => {
	const { method = 'GET', body, headers = {} } = options;
	const url = `${VALIDATOR_BASE_URL}${path}`;

	let response: Response;
	let text: string;

	try {
		response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
		});
		text = NULL_BODY_STATUSES.includes(response.status) ? '' : await response.text();
	} catch (error) {
		return transportFailure<T>(error, method, url);
	}

	let json: unknown = null;

	if (text !== '') {
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}
	}

	if (!response.ok) {
		return {
			ok: false,
			status: response.status,
			data: null,
			code: 'VALIDATOR_ERROR',
			message: extractMessage(json, text, response.status)
		};
	}

	if (text === '') {
		return { ok: true, status: 200, data: null, message: null, code: null };
	}

	if (json === null) {
		return {
			ok: false,
			status: 502,
			data: null,
			code: 'VALIDATOR_MALFORMED_RESPONSE',
			message: 'The validator backend returned a malformed (non-JSON) response.'
		};
	}

	return { ok: true, status: response.status, data: json as T, message: null, code: null };
};

export const proxyToValidator = async (
	path: string,
	options: ProxyOptions = {}
): Promise<Response> => {
	const result = await callValidator<unknown>(path, options);

	const payload = result.ok
		? (result.data ?? {})
		: { message: result.message, code: result.code, status: result.status };

	return new Response(JSON.stringify(payload), {
		status: result.status,
		headers: { 'content-type': 'application/json' }
	});
};
