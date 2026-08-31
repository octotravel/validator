import { apiRequest, showError } from '$lib/services/api';
import { supplierFlowResultStore } from '$lib/stores';
import type { SupplierValidationRequestData } from '$lib/types/SupplierFlow';
import type { ToastStore } from '@skeletonlabs/skeleton';

export const supplierValidate = async (
	data: SupplierValidationRequestData,
	toastStore: ToastStore
) => {
	supplierFlowResultStore.set({ flows: [], isLoading: true, error: null });

	// eslint-disable-next-line
	const result = await apiRequest<any[]>('/api/supplier', {
		method: 'POST',
		body: JSON.stringify(data)
	});

	if (!result.ok) {
		supplierFlowResultStore.set({ flows: [], isLoading: false, error: result.error });
		showError(toastStore, 'Validation failed', result.error);
		return;
	}

	supplierFlowResultStore.set({ flows: result.data ?? [], isLoading: false, error: null });
};
