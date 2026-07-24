<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pageTitleStore } from '$lib/stores';

	$pageTitleStore = 'Validation Tool';
</script>

{#if $page.data.session?.user}
	<div class="container mx-auto flex justify-center mt-10">
		<div class="card p-10 w-full space-y-5 text-center">
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
{:else}
	<div class="container mx-auto flex items-center justify-center" style="min-height: 60vh;">
		<div class="card p-8 max-w-sm w-full text-center space-y-6">
			<p class="opacity-60">You must be logged in to access this tool.</p>
			<form action="/auth/signin/outseta" method="POST">
				<button
					type="submit"
					class="gradient-btn w-full px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white"
				>
					Sign in with Outseta
				</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.gradient-btn {
		background: linear-gradient(
			90deg,
			oklch(70% 0.16 239.6deg) 55%,
			oklch(39.92% 0.25 271.99deg) 80%
		);
		border: none;
	}
	.gradient-btn:hover {
		background: linear-gradient(
			90deg,
			oklch(63.53% 0.15 241.9deg) 55%,
			oklch(36.18% 0.22 271.13deg) 80%
		);
	}
	.gradient-btn:active {
		background: linear-gradient(
			90deg,
			oklch(56.91% 0.14 244.57deg) 55%,
			oklch(32.34% 0.2 270.45deg) 80%
		);
	}
</style>
