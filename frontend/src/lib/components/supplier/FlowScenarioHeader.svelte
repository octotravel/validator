<script lang="ts">
	import { supplierFlowResultStore } from '$lib/stores';
	import { ValidationResult } from '$lib/types/SupplierFlow';

	const totalScenarios = $supplierFlowResultStore?.flows.reduce(
		(count, current) => count + current.scenarios.length,
		0
	);

	const successScenarios =
		$supplierFlowResultStore?.flows.length ?? 0 > 0
			? $supplierFlowResultStore?.flows
					?.map((item) => {
						return item.scenarios.filter((el) => el.success === true);
					})
					.flat(1).length
			: '';

	const warningScenarios =
		$supplierFlowResultStore?.flows.length ?? 0 > 0
			? $supplierFlowResultStore?.flows
					.map((flow) => {
						return flow.scenarios.filter(
							(scenario) => scenario.validationResult === ValidationResult.WARNING
						);
					})
					.flat(1).length
			: '';

	const errorScenarios =
		$supplierFlowResultStore?.flows.length ?? 0 > 0
			? $supplierFlowResultStore?.flows
					.map((flow) => {
						return flow.scenarios.filter(
							(scenario) => scenario.validationResult === ValidationResult.FAILED
						);
					})
					.flat(1).length
			: '';
</script>

{#if $supplierFlowResultStore}
	<div class="flex gap-5">
		<div class="flex">
			<span class="badge variant-soft-secondary w-10 me-1">{totalScenarios}</span>
			Total Scenarios
		</div>
		<div>
			<span class="badge variant-soft-success w-10 me-1">{successScenarios}</span>
			Successful
		</div>
		<div>
			<span class="badge variant-soft-warning w-10 me-1">{warningScenarios}</span>
			Warnings
		</div>
		<div>
			<span class="badge variant-soft-error w-10 me-1">{errorScenarios}</span>
			Critical Errors
		</div>
	</div>
{/if}
