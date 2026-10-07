import { describe, expect, it } from 'vitest';
import { Client } from '../Client';
import { Result } from '../types';

class TestClient extends Client {
  public callSetResponse = (response: Response): Promise<Result<unknown>> =>
    this.setResponse({ url: 'https://supplier.test/bookings', method: 'POST', body: null, headers: {} }, response);
}

const client = new TestClient({ url: 'https://supplier.test', headers: {} });

describe('Client.setResponse', () => {
  it.each([200, 201])('should not set response.error for %i', async (status) => {
    const result = await client.callSetResponse(new Response(JSON.stringify({ uuid: 'u' }), { status }));
    expect(result.response?.status).toBe(status);
    expect(result.response?.error).toBeNull();
    expect(result.data).toEqual({ uuid: 'u' });
  });

  it.each([400, 404, 500])('should set response.error for %i', async (status) => {
    const body = JSON.stringify({ error: 'BAD_REQUEST', errorMessage: 'x' });
    const result = await client.callSetResponse(new Response(body, { status }));
    expect(result.response?.error).toEqual({ status, body });
  });
});
