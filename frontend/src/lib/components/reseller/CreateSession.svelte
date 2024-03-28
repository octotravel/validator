<script lang="ts">
	import { SessionService } from '$lib/services/reseller/SessionService';
	import { getToastStore } from '@skeletonlabs/skeleton';

	let sessionID = '';

	const toastStore = getToastStore();
</script>

<div class="card mt-10 w-full">
	<section class="mt-5 p-4 text-center">
		<p>You can create a new session or search for an existing session by ID.</p>
		<div class="flex mt-10">
			<div class="w-full text-end my-auto">
				<button
					class="btn variant-ghost-success"
					on:click={() => SessionService.createSession(toastStore)}>Create Session</button
				>
			</div>
			<span class="divider-vertical h-20 mx-20" />
			<div class="w-full text-start my-auto">
				<div class="input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="text" placeholder="Search session by ID..." bind:value={sessionID} />
					<button
						class="variant-soft-primary"
						on:click={() => SessionService.findSession(sessionID, toastStore)}>Search</button
					>
				</div>
			</div>
		</div>
	</section>
</div>
