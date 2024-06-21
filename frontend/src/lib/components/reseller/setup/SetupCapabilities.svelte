<script lang="ts">
	import IconSquare from '$lib/icons/IconSquare.svelte';
	import IconSquareCheck from '$lib/icons/IconSquareCheck.svelte';
	import { resellerCapabilitiesStore, resellerSessionSetupSelectedCapabilities } from '$lib/stores';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
</script>

<div class="w-96 mx-auto mt-5">
	{#if $resellerCapabilitiesStore}
		<div class="flex gap-4">
			<ListBox multiple>
				{#each $resellerCapabilitiesStore.capabilities.slice(0, 9) as capability}
					<ListBoxItem
						bind:group={$resellerSessionSetupSelectedCapabilities}
						name={capability.name}
						value={capability}
						active="variant-ghost-secondary"
					>
						<svelte:fragment slot="lead">
							{#if $resellerSessionSetupSelectedCapabilities.includes(capability)}
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
						bind:group={$resellerSessionSetupSelectedCapabilities}
						name={capability.id}
						value={capability}
						active="variant-ghost-secondary"
					>
						<svelte:fragment slot="lead">
							{#if $resellerSessionSetupSelectedCapabilities.includes(capability)}
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
						bind:group={$resellerSessionSetupSelectedCapabilities}
						name={capability.id}
						value={capability}
						active="variant-ghost-secondary"
					>
						<svelte:fragment slot="lead">
							{#if $resellerSessionSetupSelectedCapabilities.includes(capability)}
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
