import type { SupplierValidationRequestData } from '$lib/types/SupplierFlow';
import { supplierFlowResultStore } from '$lib/stores';
import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

export const supplierValidate = async (
	data: SupplierValidationRequestData,
	toastStore: ToastStore
) => {
	supplierFlowResultStore.set({ flows: [], isLoading: true, error: null });

	const response = await fetch(`/api/supplier`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	const flows = await response.json();

	if (response.status !== 200) {
		supplierFlowResultStore.set({ flows: [], isLoading: false, error: flows.errorMessage });

		const t: ToastSettings = {
			message: flows.errorMessage,
			background: 'variant-filled-error'
		};

		toastStore.trigger(t);
		return;
	}

	supplierFlowResultStore.set({ flows, isLoading: false, error: null });
};
