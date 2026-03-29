<script lang="ts">
	import { pageTitleStore } from '$lib/stores';

	$pageTitleStore = 'Sign In';
</script>

<div class="container mx-auto flex justify-center mt-10">
	<div class="card p-10 w-full max-w-md space-y-5 text-center">
		<h1 class="h1">Sign In</h1>
		<p class="text-sm opacity-75">Sign in to access the Validation Tool</p>

		<form action="/auth/signin/outseta" method="POST">
			<button type="submit" class="btn variant-filled-primary w-full">Sign in with Outseta</button>
		</form>
	</div>
</div>
