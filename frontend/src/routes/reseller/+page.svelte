<script lang="ts">
	import CreateSession from '$lib/components/reseller/CreateSession.svelte';
	import SessionDetails from '$lib/components/reseller/SessionDetails.svelte';
	import { pageTitleStore } from '$lib/stores';

	$pageTitleStore = 'Reseller';
</script>

<div class="container mx-auto justify-center">
	<CreateSession />
	<SessionDetails />
</div>
