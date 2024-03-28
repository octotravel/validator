<script lang="ts">
	import CreateSession from '$lib/components/reseller/CreateSession.svelte';
	import SessionDetails from '$lib/components/reseller/SessionDetails.svelte';
	import { resellerSessionStore } from '$lib/stores';
</script>

{#if $resellerSessionStore.session === null}
	<CreateSession />
{:else}
	<SessionDetails />
{/if}
