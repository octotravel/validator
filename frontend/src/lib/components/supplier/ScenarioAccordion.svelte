<script lang="ts">
	import { FlowBadgeColor, StatusBadgeColor } from '$lib/helpers/FlowBadgeColor';
	import type { ScenarioResult } from '$lib/types/SupplierFlow';
	import { AccordionItem } from '@skeletonlabs/skeleton';
	import { JsonView } from '@zerodevx/svelte-json-view';

	export let scenario: ScenarioResult;

	const warnings = scenario.errors.filter((error) => error.type === 'WARNING');
	const errors = scenario.errors.filter((error) => error.type === 'CRITICAL');
</script>

<div class="accordion-border">
	<AccordionItem class="border-solid">
		<svelte:fragment slot="lead">
			<span class="badge {FlowBadgeColor(scenario.validationResult)} w-20">
				{scenario.success ? 'SUCCESS' : 'FAILED'}
			</span>
		</svelte:fragment>
		<svelte:fragment slot="summary">
			<div class="grid grid-cols-2">
				<div class="font-semibold">
					{scenario.name}
				</div>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="content">
			<div>
				<p>
					{scenario.description}
				</p>
				<div class="mt-2">
					<div class="label">
						<span class="font-semibold">URL</span>
						<div class="p-2 square border w-full text-neutral-500">
							<span class="badge variant-soft-surface">{scenario.request?.method}</span>
							{scenario.request?.url}
						</div>
					</div>
				</div>

				{#if scenario.request?.body}
					<div class="mt-2">
						<div class="label">
							<span class="font-semibold">Request body</span>
							<div class="json-wrap border p-2">
								<JsonView json={scenario.request.body} />
							</div>
						</div>
					</div>
				{/if}

				{#if scenario.response?.body}
					<div class="mt-2">
						<div class="label">
							<span class="font-semibold">Response body</span>
							<span class="ms-2 badge {StatusBadgeColor(scenario.response.status ?? 0)}"
								>{scenario.response.status}</span
							>
							<div class="json-wrap border p-2">
								<JsonView json={scenario.response.body} />
							</div>
						</div>
					</div>
				{/if}

				{#if warnings.length > 0}
					<div class="mt-2">
						<div class="label">
							<span class="font-semibold">Warnings</span>
							<div class="border text-neutral-500 p-2">
								{#each warnings as warning}
									<li class="ms-3">{warning.message}</li>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				{#if errors.length > 0}
					<div class="mt-2">
						<div class="label">
							<span class="font-semibold">Errors</span>
							<div class="border text-neutral-500 p-2">
								{#each errors as error}
									<li class="ms-3 text-stone-500">{error.message}</li>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</svelte:fragment>
	</AccordionItem>
</div>

<style>
	.json-wrap {
		max-height: 500px;
		overflow-y: auto;
		font-family: monospace;
		font-size: 14px;
		--jsonValColor: blue;
		--jsonBorderLeft: 1px dotted #ccc;
		color: gray;
	}
</style>
