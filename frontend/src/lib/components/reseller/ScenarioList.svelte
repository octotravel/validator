<script lang="ts">
	import { ScenariosService } from '$lib/services/reseller/ScenariosService';
	import { scenariosStore } from '$lib/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { IconArrowRight, IconSquare } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';

	const toastStore = getToastStore();

	onMount(() => {
		ScenariosService.getScenarios(toastStore);
	});
</script>

{#if $scenariosStore.scenarios !== null}
	<div class="card w-full mt-10 p-4 text-center">
		{#each $scenariosStore.scenarios as scenario}
			<button class="btn variant-soft-surface w-96">
				<div class="grid grid-cols-3">
					<span class="justify-self-start">
						<IconSquare />
					</span>
					{scenario.name}
					<span class="justify-self-end">
						<IconArrowRight />
					</span>
				</div>
			</button>
		{/each}
	</div>
{/if}
