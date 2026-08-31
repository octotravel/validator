<script lang="ts">
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';
	import { SessionService } from '$lib/services/reseller/SessionService';
	import { resellerSessionStore } from '$lib/stores';
	import { ProgressRadial, getToastStore } from '@skeletonlabs/skeleton';

	let sessionID = '';

	const toastStore = getToastStore();

	$: isLoading = $resellerSessionStore.isLoading;

	const createSession = () => SessionService.createSession(toastStore);
	const findSession = () => SessionService.findSession(sessionID, toastStore);
</script>

<div class="card w-full">
	<section class="p-4 text-center">
		<p>You can create a new session or search for an existing session by ID.</p>
		<div class="flex mt-10">
			<div class="w-full text-end my-auto">
				<button class="btn variant-ghost-success" disabled={isLoading} on:click={createSession}>
					{#if isLoading}
						<span class="me-2">
							<ProgressRadial
								width="w-4"
								stroke={140}
								meter="stroke-success-500"
								track="stroke-success-500/30"
								value={undefined}
							/>
						</span>
						Creating session...
					{:else}
						Create Session
					{/if}
				</button>
			</div>
			<span class="divider-vertical h-20 mx-20" />
			<div class="w-full text-start my-auto">
				<div class="input-group input-group-divider grid-cols-[1fr_auto]">
					<input
						type="text"
						placeholder="Search session by ID..."
						bind:value={sessionID}
						disabled={isLoading}
						on:keydown={(e) => e.key === 'Enter' && findSession()}
					/>
					<button
						class="variant-soft-primary"
						disabled={isLoading || !sessionID}
						on:click={findSession}
					>
						{isLoading ? 'Searching...' : 'Search'}
					</button>
				</div>
			</div>
		</div>

		<ErrorAlert
			message={$resellerSessionStore.error}
			title="Session error"
			onRetry={() => (sessionID ? findSession() : createSession())}
			onDismiss={() => resellerSessionStore.update((s) => ({ ...s, error: null }))}
		/>
	</section>
</div>
