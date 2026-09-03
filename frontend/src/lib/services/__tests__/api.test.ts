import { describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../api';

const respond = (body: string | null, init: ResponseInit) =>
	vi.fn().mockResolvedValueOnce(new Response(body, init));

describe('apiRequest', () => {
	it('returns parsed data on success', async () => {
		global.fetch = respond(JSON.stringify({ id: 'abc' }), { status: 200 });

		const result = await apiRequest<{ id: string }>('/api/thing');

		expect(result.ok).toBe(true);
		expect(result.data).toEqual({ id: 'abc' });
		expect(result.error).toBe(null);
	});

	it('prefers a human message over a machine code', async () => {
		global.fetch = respond(
			JSON.stringify({ error: 'NOT_FOUND', errorMessage: 'Resource not found' }),
			{
				status: 404
			}
		);

		const result = await apiRequest('/api/thing');

		expect(result.ok).toBe(false);
		expect(result.error).toBe('Resource not found');
	});

	it('falls back to the machine code when no human message exists', async () => {
		global.fetch = respond(JSON.stringify({ error: 'NOT_FOUND' }), { status: 404 });

		expect((await apiRequest('/api/thing')).error).toBe('NOT_FOUND');
	});

	it('uses a friendly message for 401 regardless of statusText', async () => {
		global.fetch = respond(null, { status: 401, statusText: 'Unauthorized' });

		expect((await apiRequest('/api/thing')).error).toBe(
			'You are not signed in. Please sign in and try again.'
		);
	});

	it('ignores HTML error pages and falls back', async () => {
		global.fetch = respond('<!doctype html><h1>Bad Gateway</h1>', {
			status: 502,
			statusText: 'Bad Gateway'
		});

		expect((await apiRequest('/api/thing')).error).toBe('Bad Gateway');
	});

	it('falls back to a generic message when nothing else is available', async () => {
		global.fetch = respond(null, { status: 500 });

		expect((await apiRequest('/api/thing')).error).toBe('Request failed with HTTP 500.');
	});

	it('reports a network error instead of throwing when fetch rejects', async () => {
		global.fetch = vi.fn().mockRejectedValueOnce(new TypeError('fetch failed'));

		const result = await apiRequest('/api/thing');

		expect(result.ok).toBe(false);
		expect(result.status).toBe(null);
		expect(result.error).toContain('Network error');
	});

	it('returns null data for an empty successful body', async () => {
		global.fetch = respond('', { status: 200 });

		const result = await apiRequest('/api/thing');

		expect(result.ok).toBe(true);
		expect(result.data).toBe(null);
	});
});
