<script lang="ts">
	import type { SessionSetupStep } from '$lib/types/Setup';
	import {
		resellerCapabilitiesStore,
		resellerSessionSetupStepIndex,
		resellerSessionStore
	} from '$lib/stores';
	import { ListBox, ListBoxItem, getToastStore } from '@skeletonlabs/skeleton';
	import type { Capability } from '$lib/types/Capabilities';
	import IconSquareCheck from '$lib/icons/IconSquareCheck.svelte';
	import IconSquare from '$lib/icons/IconSquare.svelte';
	import { SessionService } from '$lib/services/reseller/SessionService';

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

	let selectedCapabilities: Capability[] = [];

	const updateSession = () => {
		if (!$resellerSessionStore.session) {
			return;
		}
		$resellerSessionStore.session.capabilities = selectedCapabilities.map(
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
			<label class="label">
				<input
					class="input w-96"
					type="text"
					placeholder="Name"
					bind:value={$resellerSessionStore.session.name}
				/>
			</label>
		{/if}

		{#if step.name === 'Capabilities'}
			<div class="w-96 mx-auto mt-5">
				{#if $resellerCapabilitiesStore}
					<div class="flex gap-4">
						<ListBox multiple>
							{#each $resellerCapabilitiesStore.capabilities.slice(0, 9) as capability}
								<ListBoxItem
									bind:group={selectedCapabilities}
									name={capability.name}
									value={capability}
									active="variant-ghost-secondary"
								>
									<svelte:fragment slot="lead">
										{#if selectedCapabilities.includes(capability)}
											<IconSquareCheck />
										{:else}
											<IconSquare />
										{/if}
									</svelte:fragment>
									{capability.name}
									<svelte:fragment slot="trail">
										<p></p>
									</svelte:fragment>
								</ListBoxItem>
							{/each}
						</ListBox>
						<ListBox multiple>
							{#each $resellerCapabilitiesStore.capabilities.slice(10, 19) as capability}
								<ListBoxItem
									bind:group={selectedCapabilities}
									name={capability.id}
									value={capability}
									active="variant-ghost-secondary"
								>
									<svelte:fragment slot="lead">
										{#if selectedCapabilities.includes(capability)}
											<IconSquareCheck />
										{:else}
											<IconSquare />
										{/if}
									</svelte:fragment>
									{capability.name}
									<svelte:fragment slot="trail">
										<p></p>
									</svelte:fragment>
								</ListBoxItem>
							{/each}
						</ListBox>
						<ListBox multiple>
							{#each $resellerCapabilitiesStore.capabilities.slice(20, 29) as capability}
								<ListBoxItem
									bind:group={selectedCapabilities}
									name={capability.id}
									value={capability}
									active="variant-ghost-secondary"
								>
									<svelte:fragment slot="lead">
										{#if selectedCapabilities.includes(capability)}
											<IconSquareCheck />
										{:else}
											<IconSquare />
										{/if}
									</svelte:fragment>
									{capability.name}
									<svelte:fragment slot="trail">
										<p></p>
									</svelte:fragment>
								</ListBoxItem>
							{/each}
						</ListBox>
					</div>
				{/if}
			</div>
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
