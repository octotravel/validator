import { describe, expect, it, vi } from 'vitest';

const proxyToValidator = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
vi.mock('$lib/server/validatorApi', () => ({ proxyToValidator }));

const { POST } = await import('../+server');

describe('POST /api/supplier', () => {
	it('runs the supplier validation without the default request timeout', async () => {
		const request = new Request('http://frontend.test/api/supplier', {
			method: 'POST',
			body: JSON.stringify({ endpoint: 'https://supplier.test', apiKey: 'k' })
		});

		await POST({ request } as never);

		expect(proxyToValidator).toHaveBeenCalledWith('/v1/validate', {
			method: 'POST',
			body: { backend: { endpoint: 'https://supplier.test', apiKey: 'k' } },
			timeoutMs: null
		});
	});
});
