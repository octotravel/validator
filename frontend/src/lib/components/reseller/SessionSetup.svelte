<script lang="ts">
	import { resellerSessionSetupStepIndex, resellerSessionStore } from '$lib/stores';
	import { CapabilityService } from '$lib/services/reseller/CapabilityService';
	import { onMount } from 'svelte';
	import SetupStep from './setup/SetupStep.svelte';
	import type { SessionSetupStep } from '$lib/types/Setup';
	import SetupMap from './setup/SetupMap.svelte';

	onMount(() => {
		CapabilityService.getCapabilities();
	});

	const steps: SessionSetupStep[] = [
		{
			name: 'Name',
			description:
				'Define a custom session name (optional). If left blank, the default session ID will be used.',
			controls: {
				back: true,
				forward: true
			}
		},
		{
			name: 'Capabilities',
			description: 'Select the capabilities you want to enable for this session.',
			controls: {
				back: true,
				forward: true,
				isLast: true
			}
		}
	];
</script>

{#if $resellerSessionStore.session}
	<div class="card p-4 text-center">
		<div class="mt-5">
			<SetupMap {steps} />
			<SetupStep step={steps[$resellerSessionSetupStepIndex]} />
		</div>
	</div>
{/if}
