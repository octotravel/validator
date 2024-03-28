<script lang="ts">
	import { resellerSessionStore } from '$lib/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { IconArrowNarrowRight, IconCopy } from '@tabler/icons-svelte';

	const copyUrl = () => {
		if (!$resellerSessionStore.session) return;
		const url = $resellerSessionStore.session.url;
		navigator.clipboard.writeText(url);
	};
</script>

{#if $resellerSessionStore.session && !$resellerSessionStore.isLoading}
	<div class="card mt-5">
		<header class="card-header text-center">
			<h1>Session details</h1>
		</header>
		<section class="p-4">
			<div class="table-container">
				<table class="table table-compact">
					<tbody>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> ID </span>
							</td>
							<td class="text-center">{$resellerSessionStore.session.id}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> Name </span>
							</td>
							<td class="text-center">{$resellerSessionStore.session.name}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> URL </span>
							</td>
							<td class="text-center anchor">{$resellerSessionStore.session.url}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> Capabiltilies </span>
							</td>
							<td class="text-center">{$resellerSessionStore.session.capabilities?.join(', ')}</td>
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> Current scenario </span>
							</td>
							{#if $resellerSessionStore.session.currentScenario}
								<td class="text-center">{$resellerSessionStore.session.currentScenario}</td>
							{:else}
								<td class="text-center text-slate-500">-</td>
							{/if}
						</tr>
						<tr>
							<td class="font-bold">
								<span class="badge variant-ghost-primary"> Current step </span>
							</td>
							{#if $resellerSessionStore.session.currentStep}
								<td class="text-center">{$resellerSessionStore.session.currentStep}</td>
							{:else}
								<td class="text-center text-slate-500">-</td>
							{/if}
						</tr>
					</tbody>
				</table>
			</div>
		</section>
		<footer class="card-footer text-end">
			<button class="btn variant-ghost" on:click={copyUrl}
				>Copy URL<span class="ms-1"><IconCopy /></span></button
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
