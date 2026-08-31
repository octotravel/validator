<script lang="ts">
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { ScenariosService } from '$lib/services/reseller/ScenarioService';
	import { SessionService } from '$lib/services/reseller/SessionService';
	import {
		resellerScenarioSelectedStore,
		resellerScenariosListLoadingStore,
		resellerSessionStore
	} from '$lib/stores';
	import type { ScenarioProgress } from '$lib/types/Session';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();

	const loadScenarios = () => ScenariosService.getScenarios(toastStore);

	onMount(loadScenarios);

	const selectScenario = (scenario: ScenarioProgress) => {
		const sessionId = $resellerSessionStore.session?.id ?? 'invalid';
		ScenariosService.getScenario(scenario.id, toastStore);
		ScenariosService.getStepsHistory(sessionId, scenario.id, toastStore);

		if ($resellerSessionStore.session) {
			$resellerSessionStore.session.currentScenario = scenario.id;
			SessionService.updateSession(toastStore);
		}
	};

	$: scenarios = $resellerSessionStore.session?.scenariosProgress ?? [];
	$: isLoading = $resellerScenariosListLoadingStore;
	$: error = $resellerSessionStore.error;
</script>

<div class="card sticky top-56 z-10">
	<div class="p-2">
		<h3 class="font-bold text-center">Scenarios</h3>
	</div>
	<div class="btn-group-vertical variant-soft w-full">
		{#if isLoading && scenarios.length === 0}
			<section class="card w-full">
				<div class="space-y-1 p-2">
					<div class="placeholder h-10 text-stone-500 text-center animate-pulse">
						Loading scenarios...
					</div>
					<div class="placeholder h-10 animate-pulse" />
					<div class="placeholder h-10 animate-pulse" />
				</div>
			</section>
		{:else if scenarios.length > 0}
			{#each scenarios as scenario}
				<button
					on:click={() => selectScenario(scenario)}
					disabled={$resellerScenarioSelectedStore.isLoading}
					class={scenario.id === $resellerScenarioSelectedStore?.scenario?.id
						? 'variant-ghost-secondary'
						: ''}
				>
					<span>{scenario.name}</span>
				</button>
			{/each}
		{:else if error}
			<div class="p-2">
				<ErrorAlert
					message={error}
					title="Could not load scenarios"
					onRetry={loadScenarios}
					onDismiss={() => resellerSessionStore.update((s) => ({ ...s, error: null }))}
				/>
			</div>
		{:else}
			<div class="p-4 text-center text-sm opacity-70">No scenarios available.</div>
		{/if}
	</div>
</div>
