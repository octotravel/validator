<script lang="ts">
	import type { PageData } from './$types';
	import { resellerSessionStore } from '$lib/stores';
	import SessionSetup from '$lib/components/reseller/SessionSetup.svelte';
	import ScenarioList from '$lib/components/reseller/ScenarioList.svelte';

	export let data: PageData;
	$resellerSessionStore.session = data.session;
</script>

{#if $resellerSessionStore.session?.capabilities === null}
	<SessionSetup />
{:else}
	<ScenarioList />
{/if}
