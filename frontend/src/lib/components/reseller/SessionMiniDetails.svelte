<script lang="ts">
	import IconCopy from '$lib/icons/IconCopy.svelte';
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
	<div class="card w-full mb-2 sticky top-2 z-10">
		<div class="card-header text-center">
			<h3 class="card-title font-bold">Session Details</h3>
		</div>

		<div class="grid grid-cols-1 gap-1 p-2">
			<div class="badge variant-soft-primary w-full">Id</div>
			<div class="w-full flex">
				<button
					class="badge cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 w-full"
					on:click={() => copyToClipboard()}
					>{$resellerSessionStore.session.id}
					<div class="my-auto ms-2">
						<IconCopy size={'18'} />
					</div>
				</button>
			</div>
			<div class="badge variant-soft-primary w-full">Name</div>
			<div class="badge overflow-x-auto">
				{$resellerSessionStore.session.name}
			</div>
			<div class="badge variant-soft-primary w-full">Capabilities</div>
			<div class="overflow-x-auto">
				<div class="badge">
					{$resellerSessionStore.session.capabilities?.join(', ')}
				</div>
			</div>
		</div>
	</div>
{/if}
