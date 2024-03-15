<script lang="ts">
    import { ListBox, ListBoxItem, getToastStore } from '@skeletonlabs/skeleton';

    export let data:
</script>

<ListBox multiple>
    {#each $capabilitiesStore.capabilities.slice(0, 9) as capability}
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