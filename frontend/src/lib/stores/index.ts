import type { SupplierValidationData } from '$lib/types/SupplierFlow';
import { writable } from 'svelte/store';

export const supplierFlowResultStore = writable<SupplierValidationData | null>(null);
