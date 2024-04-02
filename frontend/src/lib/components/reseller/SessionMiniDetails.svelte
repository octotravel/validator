<script lang="ts">
	import { resellerSessionStore } from '$lib/stores';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	const copyToast: ToastSettings = {
		message: 'Session ID copied to clipboard',
		background: 'variant-filled-tertiary'
	};

	const copyToClipboard = () => {
		toastStore.trigger(copyToast);
		navigator.clipboard.writeText($resellerSessionStore.session?.id ?? '');
	};
</script>

{#if $resellerSessionStore.session}
	<div class="card w-full mb-2">
		<div class="card-header text-center">
			<h3 class="card-title font-bold">Session Details</h3>
		</div>

		<div class="grid grid-cols-1 gap-4 text-center p-2">
			<div class="flex justify-between gap-1">
				<div class="badge variant-soft-primary w-24">Id</div>
				<button
					class="badge cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900"
					on:click={() => copyToClipboard()}>{$resellerSessionStore.session.id}</button
				>
			</div>
			<div class="flex justify-between gap-1">
				<div class="badge variant-soft-primary w-24">Name</div>
				<div class="badge">{$resellerSessionStore.session.name}</div>
			</div>
			<div class="flex justify-between gap-1">
				<div class="badge variant-soft-primary max-w-24 min-w-24">Capabilities</div>
				<div class="badge overflow-y-scroll w-full">
					{$resellerSessionStore.session.capabilities?.join(', ')}
				</div>
			</div>
		</div>
	</div>
{/if}
