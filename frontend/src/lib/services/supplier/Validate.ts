import type { SupplierValidationRequestData } from '$lib/types/SupplierFlow';
import { supplierFlowResultStore } from '$lib/stores';
import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

export const supplierValidate = async (data: SupplierValidationRequestData) => {
	supplierFlowResultStore.set({ flows: [], isLoading: true, error: null });

	const response = await fetch(`/api/supplier`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		supplierFlowResultStore.set({ flows: [], isLoading: false, error: response.statusText });
		const toastStore = getToastStore();

		const t: ToastSettings = {
			message: `Error: ${response.statusText}`,
			background: 'variant-filled-error'
		};

		toastStore.trigger(t);
		return;
	}

	const flows = await response.json();

	supplierFlowResultStore.set({ flows, isLoading: false, error: null });
};
