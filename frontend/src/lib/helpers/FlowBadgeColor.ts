import { ValidationResult } from '$lib/types/SupplierFlow';

export const FlowBadgeColor = (result: ValidationResult): string => {
	switch (result) {
		case ValidationResult.SUCCESS:
			return 'variant-soft-success';
		case ValidationResult.FAILED:
			return 'variant-soft-error';
		case ValidationResult.WARNING:
			return 'variant-soft-warning';
	}
};

export const StatusBadgeColor = (status: number): string => {
	switch (status) {
		case 200:
			return 'variant-soft-success';
		case 400:
			return 'variant-soft-error';
		case 500:
			return 'variant-soft-error';
		default:
			return 'variant-soft-warning';
	}
};
