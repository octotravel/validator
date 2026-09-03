import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/public', () => ({ PUBLIC_VALIDATOR_BASE_URL: 'http://public.test' }));
vi.mock('$env/dynamic/private', () => ({
	env: { PRIVATE_VALIDATOR_BASE_URL: 'http://backend.test' }
}));
vi.mock('$app/environment', () => ({ dev: false }));

const { callValidator, proxyToValidator } = await import('../validatorApi');

const respond = (body: string | null, init: ResponseInit) =>
	vi.fn().mockResolvedValueOnce(new Response(body, init));

describe('callValidator', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns parsed data on success', async () => {
		global.fetch = respond(JSON.stringify({ id: 'abc' }), { status: 200 });

		const result = await callValidator<{ id: string }>('/v2/session');

		expect(result.ok).toBe(true);
		expect(result.data).toEqual({ id: 'abc' });
	});

	it('targets PRIVATE_VALIDATOR_BASE_URL, not the public one', async () => {
		const fetchMock = respond(JSON.stringify({}), { status: 200 });
		global.fetch = fetchMock;

		await callValidator('/v2/session');

		expect(fetchMock.mock.calls[0][0]).toBe('http://backend.test/v2/session');
	});

	it('prefers errorMessage over the error code', async () => {
		global.fetch = respond(
			JSON.stringify({ error: 'NOT_FOUND', errorMessage: 'Resource not found' }),
			{ status: 404 }
		);

		const result = await callValidator('/v2/session/x');

		expect(result.ok).toBe(false);
		expect(result.status).toBe(404);
		expect(result.message).toBe('Resource not found');
	});

	it('falls back to the error code when there is no human message', async () => {
		global.fetch = respond(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404 });

		expect((await callValidator('/v2/session/x')).message).toBe('NOT_FOUND');
	});

	it('never forwards a backend stack trace', async () => {
		global.fetch = respond(
			JSON.stringify({ error: 'BAD_REQUEST', errorMessage: 'Nope', stack: 'at secret.ts:1' }),
			{ status: 400 }
		);

		const result = await callValidator('/v2/session');

		expect(JSON.stringify(result)).not.toContain('secret.ts');
	});

	it('handles a 204 without throwing and normalises the status', async () => {
		global.fetch = respond(null, { status: 204 });

		const result = await callValidator('/v2/session');

		expect(result.ok).toBe(true);
		expect(result.status).toBe(200);
		expect(result.data).toBe(null);
	});

	it('reports a malformed non-JSON success body as 502', async () => {
		global.fetch = respond('<!doctype html><h1>hi</h1>', { status: 200 });

		const result = await callValidator('/v2/session');

		expect(result.ok).toBe(false);
		expect(result.status).toBe(502);
		expect(result.code).toBe('VALIDATOR_MALFORMED_RESPONSE');
	});

	it('reports an unreachable backend without leaking the internal URL in production', async () => {
		global.fetch = vi
			.fn()
			.mockRejectedValueOnce(
				Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } })
			);

		const result = await callValidator('/v2/session');

		expect(result.ok).toBe(false);
		expect(result.status).toBe(502);
		expect(result.code).toBe('VALIDATOR_UNREACHABLE');
		expect(result.message).not.toContain('backend.test');
	});

	it('reports a timeout as 504', async () => {
		global.fetch = vi
			.fn()
			.mockRejectedValueOnce(Object.assign(new Error('timed out'), { name: 'TimeoutError' }));

		const result = await callValidator('/v2/session');

		expect(result.status).toBe(504);
		expect(result.code).toBe('VALIDATOR_TIMEOUT');
	});
});

describe('proxyToValidator', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('preserves a non-200 success status', async () => {
		global.fetch = respond(JSON.stringify({ id: 'x' }), { status: 201 });

		const response = await proxyToValidator('/v2/session', { method: 'POST' });

		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({ id: 'x' });
	});

	it('forwards the backend status and a structured error body', async () => {
		global.fetch = respond(JSON.stringify({ error: 'NOT_FOUND', errorMessage: 'Gone' }), {
			status: 404
		});

		const response = await proxyToValidator('/v2/session/x');

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({
			message: 'Gone',
			code: 'VALIDATOR_ERROR',
			status: 404
		});
	});

	it('returns valid JSON for a 204 rather than throwing', async () => {
		global.fetch = respond(null, { status: 204 });

		const response = await proxyToValidator('/v2/session');

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({});
	});
});
