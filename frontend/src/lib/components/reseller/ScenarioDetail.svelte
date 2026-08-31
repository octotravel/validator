<script lang="ts">
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { resellerScenarioSelectedStore } from '$lib/stores';
	import { Accordion, AccordionItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import ScenarioStep from './ScenarioStep.svelte';
	import IconFileDescription from '$lib/icons/IconFileDescription.svelte';

	const dismissError = () => resellerScenarioSelectedStore.update((s) => ({ ...s, error: null }));
</script>

{#if $resellerScenarioSelectedStore.isLoading}
	<div class="card">
		<div class="flex flex-col items-center gap-3 py-10">
			<ProgressRadial
				width="w-12"
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				value={undefined}
			/>
			<p class="text-sm opacity-70">Loading scenario...</p>
		</div>
	</div>
{:else if $resellerScenarioSelectedStore.scenario}
	<div class="card text-center">
		<header class="card-header">
			<h3 class="h3">{$resellerScenarioSelectedStore.scenario.name}</h3>
		</header>
		<section class="p-4">
			<ErrorAlert
				message={$resellerScenarioSelectedStore.error}
				title="Scenario error"
				onDismiss={dismissError}
			/>
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
{:else if $resellerScenarioSelectedStore.error}
	<div class="card p-4">
		<ErrorAlert
			message={$resellerScenarioSelectedStore.error}
			title="Scenario error"
			onDismiss={dismissError}
		/>
	</div>
{:else}
	<div class="text-center py-5 card">Select scenario to begin</div>
{/if}
