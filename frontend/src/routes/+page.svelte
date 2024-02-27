<script>
	import { goto } from '$app/navigation';
	import { pageTitleStore } from '$lib/stores';

	$pageTitleStore = 'Validation Tool';
</script>

<div class="container h-screen mx-auto flex justify-center mt-20">
	<div class="space-y-5 text-center">
		<h1 class="h1">I am ...</h1>
		<button
			type="button"
			class="btn btn-xl variant-soft-success w-36 me-2"
			on:click={() => goto('/reseller')}>Reseller</button
		>
		<button
			type="button"
			class="btn btn-xl variant-soft-success w-36 ms-2"
			on:click={() => goto('/supplier')}>Supplier</button
		>
	</div>
</div>
