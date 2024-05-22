import { it, expect, vi, describe } from 'vitest';
import { resellerCapabilitiesStore } from '../../../stores';
import { get } from 'svelte/store';
import { CapabilityService } from '../CapabilityService';

describe('CapabilityService', () => {
	it('should handle successful fetch', async () => {
		const mockCapabilities = ['capability1', 'capability2'];

		global.fetch = vi
			.fn()
			.mockReturnValueOnce(
				new Response(JSON.stringify({ capabilities: mockCapabilities }), { status: 200 })
			);

		await CapabilityService.getCapabilities();

		expect(get(resellerCapabilitiesStore).capabilities).toEqual(mockCapabilities);
		expect(get(resellerCapabilitiesStore).isLoading).toBe(false);
		expect(get(resellerCapabilitiesStore).error).toBe(null);
	});

	it('should handle failed fetch', async () => {
		global.fetch = vi
			.fn()
			.mockReturnValueOnce(
				new Response(null, { status: 500, statusText: 'Internal Server Error' })
			);

		await CapabilityService.getCapabilities();

		expect(get(resellerCapabilitiesStore).capabilities).toEqual([]);
		expect(get(resellerCapabilitiesStore).isLoading).toBe(false);
		expect(get(resellerCapabilitiesStore).error).toBe('Internal Server Error');
	});
});
