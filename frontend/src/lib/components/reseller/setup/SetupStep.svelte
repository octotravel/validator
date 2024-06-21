<script lang="ts">
	import type { SessionSetupStep } from '$lib/types/Setup';
	import { resellerSessionSetupSelectedCapabilities, resellerSessionSetupStepIndex, resellerSessionStore } from '$lib/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { SessionService } from '$lib/services/reseller/SessionService';
	import SetupName from './SetupName.svelte';
	import SetupCapabilities from './SetupCapabilities.svelte';

	export let step: SessionSetupStep;

	const toastStore = getToastStore();

	const backStep = () => {
		if ($resellerSessionSetupStepIndex === 0) {
			return;
		}
		$resellerSessionSetupStepIndex -= 1;
	};

	const completeSetup = () => {
		updateSession();
	};

	const nextStep = () => {
		$resellerSessionSetupStepIndex += 1;
	};

	const updateSession = () => {
		if (!$resellerSessionStore.session) {
			return;
		}
		$resellerSessionStore.session.capabilities = $resellerSessionSetupSelectedCapabilities.map(
			(capability) => capability.id
		);
		SessionService.updateSession(toastStore);
	};
</script>

{#if $resellerSessionStore.session}
	<div>
		<h3 class="h3 font-bold">{step.name}</h3>
		<p class="my-4">{step.description}</p>

		{#if step.name === 'Name'}
			<SetupName />
		{/if}

		{#if step.name === 'Capabilities'}
			<SetupCapabilities />
		{/if}

		<div class="mt-4 grid grid-cols-2">
			<div class="justify-self-start">
				{#if step.controls.back}
					<button class="btn variant-ghost-surface w-24" on:click={backStep}>Back</button>
				{/if}
			</div>
			<div class="justify-self-end">
				{#if step.controls.isLast}
					<button class="btn variant-ghost-success w-24" on:click={completeSetup}>Complete</button>
				{:else if step.controls.forward}
					<button class="btn variant-ghost-secondary w-24" on:click={nextStep}>Next</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
