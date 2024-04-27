import { beforeEach, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { resellerCapabilitiesStore } from './../../stores';
import { get } from 'svelte/store';
import { CapabilityService } from './CapabilityService';

import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    http.get('http://localhost:5173/api/reseller/capabilities', () => {
        return HttpResponse.json({ capabilities: ['capability1', 'capability2'] });
    }
));

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('should handle successful fetch', async () => {
  const mockCapabilities = ['capability1', 'capability2'];

  await CapabilityService.getCapabilities();

  expect(get(resellerCapabilitiesStore).capabilities).toEqual(mockCapabilities);
  expect(get(resellerCapabilitiesStore).isLoading).toBe(false);
  expect(get(resellerCapabilitiesStore).error).toBe(null);
});

it('should handle failed fetch', async () => {

    await CapabilityService.getCapabilities();

    expect(get(resellerCapabilitiesStore).capabilities).toEqual([]);
    expect(get(resellerCapabilitiesStore).isLoading).toBe(false);
    expect(get(resellerCapabilitiesStore).error).not.toBe(null);
});