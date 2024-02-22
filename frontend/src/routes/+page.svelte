<script>
	import { goto } from '$app/navigation';
</script>

<div class="container h-screen mx-auto flex justify-center items-center">
	<div class="space-y-5 text-center">
		<h1 class="h1">Octo Validator</h1>
		<button type="button" class="btn variant-filled" on:click={() => goto('/reseller')}
			>Reseller</button
		>
		<button type="button" class="btn variant-filled" on:click={() => goto('/supplier')}
			>Supplier</button
		>
	</div>
</div>
