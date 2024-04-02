<script lang="ts">
	import { resellerScenarioSelectedStore } from '$lib/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { IconFileDescription } from '@tabler/icons-svelte';
	import ScenarioStep from './ScenarioStep.svelte';
</script>

{#if $resellerScenarioSelectedStore.scenario}
	<div class="card text-center">
		<header class="card-header">
			<h3 class="h3">{$resellerScenarioSelectedStore.scenario.name}</h3>
		</header>
		<section class="p-4">
			<div class="accordion-border">
				<Accordion>
					<AccordionItem open>
						<svelte:fragment slot="lead"><IconFileDescription /></svelte:fragment>
						<svelte:fragment slot="summary">Description</svelte:fragment>
						<svelte:fragment slot="content"
							>{$resellerScenarioSelectedStore.scenario.description}</svelte:fragment
						>
					</AccordionItem>
				</Accordion>
			</div>
			<hr class="my-4" />
			<div class="space-y-1">
				<h3 class="h3 mb-2">Steps</h3>
				<Accordion>
					{#each $resellerScenarioSelectedStore.scenario.steps as step, index}
						<ScenarioStep {step} {index} />
					{/each}
				</Accordion>
			</div>
		</section>
	</div>
{:else}
	<div class="text-center py-5 card">Select scenario to begin</div>
{/if}
