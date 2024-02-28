<script lang="ts">
	import { supplierFlowResultStore } from '$lib/stores';
	import { Accordion, ProgressRadial } from '@skeletonlabs/skeleton';
	import FlowScenarioHeader from './FlowScenarioHeader.svelte';
	import FlowAccordion from './FlowAccordion.svelte';
</script>

{#if $supplierFlowResultStore.flows.length > 0 || $supplierFlowResultStore.isLoading}
	<div class="card mt-5 p-4 flex grid grid-cols-1">
		{#if $supplierFlowResultStore.isLoading}
			<div class="flex justify-center">
				<ProgressRadial
					width="w-12"
					meter="stroke-primary-500"
					track="stroke-primary-500/30"
					value={undefined}
				/>
			</div>
		{:else}
			<div>
				<FlowScenarioHeader />
			</div>
			<div class="mt-2">
				<Accordion class="border-solid">
					{#each $supplierFlowResultStore.flows as flow}
						<FlowAccordion {flow} />
					{/each}
				</Accordion>
			</div>
		{/if}
	</div>
{/if}
