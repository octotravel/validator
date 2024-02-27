<script lang="ts">
	import CreateSession from '$lib/components/reseller/CreateSession.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto justify-center">
	<CreateSession />
</div>
