<script lang="ts">
	import { ListBox, ListBoxItem, getToastStore } from '@skeletonlabs/skeleton';
	import { resellerCapabilitiesStore } from '$lib/stores';
	import { IconSquare, IconSquareCheck } from '@tabler/icons-svelte';
	import type { Capability } from '$lib/types/Capabilities';

	let selectedCapabilities: Capability[] = [];
</script>

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
