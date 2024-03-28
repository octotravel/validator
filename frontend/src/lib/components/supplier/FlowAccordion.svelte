<script lang="ts">
	import { FlowBadgeColor } from '$lib/helpers/FlowBadgeColor';
	import { type SupplierFlowResult } from '$lib/types/SupplierFlow';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import ScenarioAccordion from './ScenarioAccordion.svelte';

	export let flow: SupplierFlowResult;
</script>

<div class="accordion-border">
	<AccordionItem>
		<svelte:fragment slot="lead">
			<span class="badge variant-soft-secondary w-12">
				{flow.succesScenarios}/{flow.totalScenarios}
			</span>
			<span class="badge w-24 {FlowBadgeColor(flow.validationResult)}">
				{flow.success ? 'SUCCESS' : 'FAILED'}
			</span>
		</svelte:fragment>
		<svelte:fragment slot="summary">
			<div class="grid grid-cols-2">
				<div class="font-semibold">
					{flow.name}
				</div>
				<div>
					<a href={flow.docs} class="anchor" target="_blank">View documentation</a>
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="content">
			<div>
				<Accordion>
					{#each flow.scenarios as scenario}
						<ScenarioAccordion {scenario} />
					{/each}
				</Accordion>
			</div>
		</svelte:fragment>
	</AccordionItem>
</div>
