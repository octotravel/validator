<script lang="ts">
	import type { ResultsStore } from '$lib/types/Validation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { JsonView } from '@zerodevx/svelte-json-view';

	const modalStore = getModalStore();

	const result: ResultsStore = $modalStore[0].meta.result;
</script>

{#if $modalStore[0]}
	<div class="card w-modal-wide py-5">
		<div class="text-center">
			<h3 class="h3">Validation Result</h3>
		</div>
		<div class="accordion-border py-5 mt-2">
			{#if result.data}
				<div class="mt-2 px-5">
					<div class="label">
						<span class="font-semibold">Data</span>
						<div class="border text-neutral-500 p-2">
							<JsonView json={result.data} />
						</div>
					</div>
				</div>
			{/if}
			{#if result.warnings.length > 0}
				<div class="mt-2 px-5">
					<div class="label">
						<span class="font-semibold">Warnings</span>
						<span class="badge variant-soft-warning">{result.warnings.length}</span>
						<div class="border text-neutral-500 p-2">
							{#each result.warnings as warning}
								<li class="ms-3">{warning}</li>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			{#if result.errors.length > 0}
				<div class="mt-2 px-5">
					<div class="label">
						<span class="font-semibold">Errors</span>
						<span class="badge variant-soft-error">{result.errors.length}</span>
						<div class="border text-neutral-500 p-2">
							{#each result.errors as error}
								<li class="ms-3">{error.message}</li>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			{#if result.warnings.length === 0 && result.errors.length === 0}
				<div class="mt-2 text-center">
					<div class="label">
						<span class="font-semibold">No issues found</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
