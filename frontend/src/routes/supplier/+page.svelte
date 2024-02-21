<script lang="ts">
	import FlowResult from '$lib/components/supplier/FlowResult.svelte';
	import InputForm from '$lib/components/supplier/InputForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto justify-center">
	<InputForm />
	<FlowResult />
</div>
