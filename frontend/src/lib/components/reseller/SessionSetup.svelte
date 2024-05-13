<script lang="ts">
	import { ListBox, ListBoxItem, Step, Stepper, getToastStore } from '@skeletonlabs/skeleton';
	import { resellerCapabilitiesStore, resellerSessionStore } from '$lib/stores';
	import { IconSquare, IconSquareCheck } from '@tabler/icons-svelte';
	import { CapabilityService } from '$lib/services/reseller/CapabilityService';
	import { onMount } from 'svelte';
	import { SessionService } from '$lib/services/reseller/SessionService';
	import type { Capability } from '$lib/types/Capabilities';

	const toastStore = getToastStore();

	onMount(() => {
		CapabilityService.getCapabilities();
	});

	const updateSession = () => {
		if (!$resellerSessionStore.session) {
			return;
		}
		$resellerSessionStore.session.capabilities = selectedCapabilities.map(
			(capability) => capability.id
		);
		SessionService.updateSession(toastStore);
	};

	let selectedCapabilities: Capability[] = [];
</script>

{#if $resellerSessionStore.session}
	<div class="card p-4 text-center">
		<div class="mt-10">
			<Stepper stepTerm="Session Setup" on:complete={updateSession}>
				<Step>
					<svelte:fragment slot="header">Name</svelte:fragment>
					Define a custom session name (optional). If left blank, the default session ID will be used.

					<div class="w-96 mx-auto mt-5">
						<input
							class="input"
							type="text"
							placeholder="Name"
							bind:value={$resellerSessionStore.session.name}
						/>
					</div>
				</Step>
				<Step>
					<svelte:fragment slot="header">Capabilities</svelte:fragment>
					Please select the capabilities you'd like to test within your implementation.
					<!--todo: move to seperate component-->
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
				</Step>
				<!-- ... -->
			</Stepper>
		</div>
	</div>
{/if}
