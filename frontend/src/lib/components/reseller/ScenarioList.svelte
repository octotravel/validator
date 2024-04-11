<script lang="ts">
	import { ScenariosService } from '$lib/services/reseller/ScenarioService';
	import { SessionService } from '$lib/services/reseller/SessionService';
	import { resellerScenarioSelectedStore, resellerSessionStore } from '$lib/stores';
	import type { ScenarioProgress } from '$lib/types/Session';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();

	onMount(() => {
		ScenariosService.getScenarios(toastStore);
	});

	const selectScenario = (scenario: ScenarioProgress) => {
		ScenariosService.getScenario(scenario.id, toastStore);

		if ($resellerSessionStore.session) {
			$resellerSessionStore.session.currentScenario = scenario.id;
			SessionService.updateSession(toastStore);
		}
	};
</script>

<div class="card">
	<div class="p-2">
		<h3 class="font-bold text-center">Scenarios</h3>
	</div>
	<div class="btn-group-vertical variant-soft w-full">
		{#if $resellerSessionStore.session}
			{#each $resellerSessionStore.session.scenariosProgress as scenario}
				<button
					on:click={() => selectScenario(scenario)}
					class={scenario.id === $resellerScenarioSelectedStore?.scenario?.id
						? 'variant-ghost-secondary'
						: ''}
				>
					{#if scenario.name}
						<span>
							{scenario.name}
						</span>
					{:else}
						<span class="text-neutral-500"> Loading... </span>
					{/if}
					<!-- {#if scenario.steps.every((step) => step.status === 'completed')}
						<span class="badge variant-success">
							Completed
						</span>
					{:else}
						<span class="badge variant-soft-surface">
							Pending
						</span>
					{/if} -->
				</button>
			{/each}
		{:else}
			<section class="card w-full">
				<div class="space-y-1">
					<div class="placeholder h-10 text-stone-500 text-center">Loading...</div>
					<div class="placeholder h-10" />
					<div class="placeholder h-10" />
					<div class="placeholder h-10" />
				</div>
			</section>
		{/if}
	</div>
</div>
