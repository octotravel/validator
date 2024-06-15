<script lang="ts">
	import IconCheck from '$lib/icons/IconCheck.svelte';
	import { resellerSessionSetupStepIndex } from '$lib/stores';
	import type { SessionSetupStep } from '$lib/types/Setup';

	export let steps: SessionSetupStep[];

	$: getVariant = (index: number) => {
		if (index < $resellerSessionSetupStepIndex) {
			return 'variant-soft-success';
		} else if (index === $resellerSessionSetupStepIndex) {
			return 'variant-soft-primary';
		} else if (index > $resellerSessionSetupStepIndex) {
			return 'variant-soft-surface';
		}
	};
</script>

<div class="flex justify-center mb-4">
	{#each steps as step, index}
		<div class="mx-2">
			<span class="chip {getVariant(index)} cursor-default">
				{#if index < $resellerSessionSetupStepIndex}
					<span class="me-2">
						<IconCheck size="14" />
					</span>
				{/if}
				{index + 1}.
				{step.name}
			</span>
		</div>
	{/each}
</div>
