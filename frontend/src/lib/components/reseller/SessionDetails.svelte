<script lang="ts">
	import { resellerSessionStore } from '$lib/stores';
	import { ProgressRadial, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import IconCopy from '$lib/icons/IconCopy.svelte';
	import IconArrowNarrowRight from '$lib/icons/IconArrowNarrowRight.svelte';

	const toastStore = getToastStore();

	const copyToast: ToastSettings = {
		message: 'Session URL copied to clipboard',
		background: 'variant-filled-tertiary'
	};

	const copyToClipboard = () => {
		toastStore.trigger(copyToast);
		navigator.clipboard.writeText(`${$page.url}/session/${$resellerSessionStore.session?.id}`);
	};
</script>

{#if $resellerSessionStore.session && !$resellerSessionStore.isLoading}
	<div class="card">
		<header class="card-header text-center">
			<h1>Session details</h1>
		</header>
		<section class="p-4">
			<div class="table-container">
				<table class="table table-compact">
					<tbody>
						<tr>
							<td class="font-bold">
								<span class="badge variant-soft-primary"> ID </span>
							</td>
							<td class="text-center">{$resellerSessionStore.session.id}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-soft-primary"> Name </span>
							</td>
							<td class="text-center">{$resellerSessionStore.session.name}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-soft-primary"> URL </span>
							</td>
							<td class="text-center anchor"
								>{$page.url}/session/{$resellerSessionStore.session.id}</td
							>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-soft-primary"> Capabiltilies </span>
							</td>
							<td class="text-center">
								{#if !$resellerSessionStore.session.capabilities}
									-
								{:else}
									{$resellerSessionStore.session.capabilities?.join(', ')}
								{/if}
							</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-soft-primary"> Current scenario </span>
							</td>
							{#if $resellerSessionStore.session.currentScenario}
								<td class="text-center">{$resellerSessionStore.session.currentScenario}</td>
							{:else}
								<td class="text-center text-slate-500">-</td>
							{/if}
						</tr>
					</tbody>
				</table>
			</div>
		</section>
		<footer class="card-footer text-end">
			<button class="btn variant-ghost" on:click={copyToClipboard}
				>Copy URL<span class="ms-1"><IconCopy size={'18'} /></span></button
			>
			<a href="reseller/session/{$resellerSessionStore.session.id}">
				<button class="btn variant-ghost-secondary"
					>Setup<span class="ms-1"><IconArrowNarrowRight /></span></button
				>
			</a>
		</footer>
	</div>
{/if}

{#if $resellerSessionStore.isLoading}
	<div class="card mt-5">
		<div class="flex justify-center p-4">
			<ProgressRadial
				width="w-12"
				meter="stroke-primary-500"
				track="stroke-primary-500/30"
				value={undefined}
			/>
		</div>
	</div>
{/if}
