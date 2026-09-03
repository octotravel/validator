<script lang="ts">
	import type { PageData } from './$types';
	import { resellerScenarioValidationResultStore, resellerSessionStore } from '$lib/stores';
	import SessionSetup from '$lib/components/reseller/SessionSetup.svelte';
	import SessionValidation from '$lib/components/reseller/SessionValidation.svelte';
	import { onMount } from 'svelte';
	import { Socketio } from '$lib/services/reseller/Socketio';

	export let data: PageData;
	$resellerSessionStore.session = data.resellerSession;

	onMount(() => {
		const socket = Socketio.openSocket(data.resellerSession.id);

		// eslint-disable-next-line
		socket.on('validationResult', (validationResult: any) => {
			$resellerScenarioValidationResultStore.results = [
				...$resellerScenarioValidationResultStore.results,
				{
					utcCreatedAt: new Date().toISOString(),
					...validationResult
				}
			];
		});
	});
</script>

{#if $resellerSessionStore.session?.capabilities === null}
	<SessionSetup />
{:else}
	<SessionValidation />
{/if}
