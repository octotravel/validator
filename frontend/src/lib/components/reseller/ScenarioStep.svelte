<script lang="ts">
	import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';
	import {
	resellerScenarioSelectedStore,
		resellerScenarioValidationResultStore,
		resellerSessionStore
	} from '$lib/stores';
	import type { Step } from '$lib/types/Scenarios';
	import { ScenarioProgressStepStatus, type ScenarioProgressStep } from '$lib/types/Session';
	import type { ResultsStore } from '$lib/types/Validation';
	import { Accordion, AccordionItem, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { IconCircle, IconCircleCheck, IconCircleDashed, IconFileDescription, IconLock, IconSearch, IconX, IconZoomCancel } from '@tabler/icons-svelte';
	import { format } from 'date-fns';
						
	export let step: ScenarioProgressStep;
	export let index: number;

	let isOpen = $resellerScenarioSelectedStore.scenario?.steps.filter(step => step.status === 'pending')[0].id === step.id;
	let isLocked = $resellerScenarioSelectedStore.scenario?.steps.filter(step => step.status === 'pending')[0].id !== step.id;

	const nextStep = () => {
		$resellerScenarioSelectedStore.scenario!.steps[index].status = ScenarioProgressStepStatus.COMPLETED;
		$resellerSessionStore.session!.currentStep = $resellerScenarioSelectedStore.scenario?.steps[index + 1].id ?? '';
		const scenarioIndex = $resellerSessionStore.session?.scenariosProgress.findIndex(scenario => scenario.id === $resellerScenarioSelectedStore.scenario?.id);
		if (scenarioIndex !== undefined) {
			$resellerSessionStore.session!.scenariosProgress[scenarioIndex].steps[index].status = ScenarioProgressStepStatus.COMPLETED; 
		}

		updateResults();
	};


	let results: ResultsStore[] = [];
	let isStepValid = false;

	const updateResults = () => {
		results = $resellerScenarioValidationResultStore.results.filter(
			(result) =>
				result.stepId === step.id && result.scenarioId === $resellerScenarioSelectedStore?.scenario?.id
		);
		isStepValid = results.some(result => result.isValid);

		isOpen = $resellerScenarioSelectedStore.scenario?.steps.filter(step => step.status === 'pending')[0].id === step.id;
		isLocked = $resellerScenarioSelectedStore.scenario?.steps.filter(step => step.status === 'pending')[0].id !== step.id;
	};

	$: $resellerScenarioValidationResultStore.results, updateResults();
</script>

<div class="accordion-border text-start">
	<AccordionItem>
		<svelte:fragment slot="lead">
				{#if step.status === 'completed'}
					<IconCircleCheck class="text-success-500" />
					{:else}
					<IconCircleDashed />
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="summary">
				{step.name}
				{#if step.status === 'pending'}
					<span class="badge variant-soft-warning text-neutral-500 ms-2">Pending</span>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="content">
				<div class="grid grid-cols-4 gap-2 w-full">
					<div class="col-span-3">
						<Accordion>
							<div class="accordion-border">
								<AccordionItem>
									<svelte:fragment slot="lead"><IconFileDescription /></svelte:fragment>
									<svelte:fragment slot="summary">Description</svelte:fragment>
									<svelte:fragment slot="content">{step.description}</svelte:fragment>
								</AccordionItem>
							</div>
						</Accordion>
					</div>
					<div>
						<a href={step.docsUrl} target="_blank">
							<button class="btn variant-ghost-primary w-full">
								<span>View documentation</span>
							</button>
						</a>
					</div>
					<div class="col-span-4">
						<div class="label">
							<span class="font-semibold">URL</span>
							<div class="p-2 square border w-full text-neutral-500 accordion-border">
								<span class="badge variant-soft-surface">GET</span>
								<span>
									{PUBLIC_VALIDATOR_BASE_URL}{step.endpointUrl}
								</span>
							</div>
						</div>
					</div>
					<div class="col-span-4">
						<div class="my-auto py-1">
							<span class="font-semibold">Validations</span>
							<span class="badge variant-soft">{results.length}</span>
						</div>
						<div class="accordion-border p-2 max-h-64 overflow-y-scroll">
							{#each results.reverse() as result, index}
							<div class="accordion-border mb-1">
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="iconClosed"><IconX size={18} /></svelte:fragment>
										<svelte:fragment slot="iconOpen"><IconSearch size={18} /></svelte:fragment>
										<svelte:fragment slot="lead">
											{#if result.errors.length > 0}
													<span class="badge variant-soft-error">Errors</span>
												{:else if result.warnings.length > 0}
													<span class="badge variant-soft-warning">Warnings</span>
												{:else}
													<span class="badge variant-soft-success">Valid</span>
												{/if}
										</svelte:fragment>
										<svelte:fragment slot="summary">
												<span class="badge variant-soft-secondary">
													{format(new Date(result.utcCreatedAt), 'yyyy-MM-dd HH:mm:ss')}
												</span>
	
											{#if index === 0}
												<span class="badge variant-soft-tertiary">Latest</span>
											{/if}
										</svelte:fragment>
										<svelte:fragment slot="content">
											<div>
												<div class="mt-2">
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

												<div class="mt-2">
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
											</div>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
							</div>
							{/each}
						</div>
					</div>
					<div class="col-span-3">
					</div>
					<div>
						{#if isStepValid && step.status === 'pending'}
						<button class="btn variant-ghost-success w-full" on:click={() => nextStep()}>Next step</button>
						{:else}
						<button class="btn variant-soft-surface w-full" disabled>Next step</button>
						{/if}
					</div>
				</div>
			</svelte:fragment>
	</AccordionItem>
</div>