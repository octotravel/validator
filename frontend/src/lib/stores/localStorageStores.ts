import type { SupplierAdditionalHeaders } from '$lib/types/SupplierFlow';
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
export const supplierFormHeadersStore: Writable<SupplierAdditionalHeaders[]> = localStorageStore(
	'supplierFormHeaders',
	[]
);
