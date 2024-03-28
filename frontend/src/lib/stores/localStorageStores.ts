import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const supplierFormEndpointStore: Writable<string> = localStorageStore(
	'supplierFormEndpoint',
	''
);
export const supplierFormApiKeyStore: Writable<string> = localStorageStore(
	'supplierFormApiKey',
	''
);
