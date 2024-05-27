<script lang="ts">
	import { PUBLIC_VALIDATOR_BASE_URL } from '$env/static/public';
	import IconCircleCheck from '$lib/icons/IconCircleCheck.svelte';
	import IconCircleDashed from '$lib/icons/IconCircleDashed.svelte';
	import IconX from '$lib/icons/IconX.svelte';
	import {
		resellerScenarioQuestionsValidationStore,
		resellerScenarioSelectedStore,
		resellerScenarioValidationResultStore,
		resellerSessionStore
	} from '$lib/stores';
	import { ScenarioProgressStepStatus, type ScenarioProgressStep } from '$lib/types/Session';
	import type { ResultsStore } from '$lib/types/Validation';
	import { Accordion, AccordionItem, getToastStore } from '@skeletonlabs/skeleton';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import { format } from 'date-fns';
	import IconSearch from '$lib/icons/IconSearch.svelte';
	import QuestionsList from './questions/QuestionsList.svelte';
	import { ScenariosService } from '$lib/services/reseller/ScenarioService';

	export let step: ScenarioProgressStep;
	export let index: number;

	const toastStore = getToastStore();

	const nextStep = () => {
		$resellerScenarioSelectedStore.scenario!.steps[index].status =
			ScenarioProgressStepStatus.COMPLETED;

		if (($resellerSessionStore.session?.scenariosProgress.length ?? 0) >= index) {
			return;
		}

		if ($resellerScenarioSelectedStore.scenario?.steps.length === index + 1) {
			return;
		}

		const nextStep = $resellerScenarioSelectedStore.scenario?.steps[index + 1].id;
		if (nextStep === undefined) {
			return;
		}

		const scenarioIndex = $resellerSessionStore.session?.scenariosProgress.findIndex(
			(scenario) => scenario.id === $resellerScenarioSelectedStore.scenario?.id
		);
		if (scenarioIndex !== undefined) {
			$resellerSessionStore.session!.scenariosProgress[scenarioIndex].steps[index].status =
				ScenarioProgressStepStatus.COMPLETED;
		}
	};

	let results: ResultsStore[] = [];
	let isStepValid = false;

	const pendingStatuses = [
		ScenarioProgressStepStatus.PENDING_VALIDATION,
		ScenarioProgressStepStatus.PENDING_QUESTIONS
	];

	$: updateResults = () => {
		results = $resellerScenarioValidationResultStore.results.filter(
			(result) =>
				result.stepId === step.id &&
				result.scenarioId === $resellerScenarioSelectedStore?.scenario?.id
		);
		isStepValid = results.some((result) => result.isValid);
	};

	$: isOpen = () => {
		const pendingSteps =
			$resellerScenarioSelectedStore.scenario?.steps.filter((step) =>
				pendingStatuses.includes(step.status)
			) ?? [];
		if (pendingSteps?.length > 0) {
			return pendingSteps[0].id === step.id;
		}
		return false;
	};

	$: isLocked = () => {
		const pendingSteps =
			$resellerScenarioSelectedStore.scenario?.steps.filter((step) =>
				pendingStatuses.includes(step.status)
			) ?? [];
		if (pendingSteps?.length > 0) {
			return (
				$resellerScenarioSelectedStore.scenario?.steps.filter((step) =>
					pendingStatuses.includes(step.status)
				)[0].id !== step.id && !(step.status === ScenarioProgressStepStatus.COMPLETED)
			);
		}
		return false;
	};

	$: isQuestionsValid = () => {
		const questions = $resellerScenarioQuestionsValidationStore.questions;

		if (step.questions.length === 0) {
			return true;
		}

		if (questions.length === 0 || questions.length !== step.questions.length) {
			return false;
		}

		const valid = questions.every((question) => question.isValid);

		return valid;
	};

	const validateQuestions = () => {
		ScenariosService.postValidateQuestions(
			$resellerSessionStore.session?.id ?? '',
			$resellerScenarioSelectedStore.scenario?.id ?? '',
			step.id,
			toastStore
		);
	};

	$: $resellerScenarioValidationResultStore.results, updateResults();
</script>

<div class="text-start {isOpen() ? 'border border-primary-500' : 'accordion-border'}">
	<AccordionItem open={isOpen()} disabled={isLocked()}>
		<svelte:fragment slot="lead">
			{#if step.status === ScenarioProgressStepStatus.COMPLETED}
				<IconCircleCheck />
			{:else}
				<IconCircleDashed />
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="summary">
			{step.name}
			{#if isLocked()}
				<span class="badge variant-soft-surface text-neutral-500 ms-2">Locked</span>
			{:else if step.status === ScenarioProgressStepStatus.PENDING_VALIDATION}
				<span class="badge variant-soft-warning text-neutral-500 ms-2">Pending validation</span>
			{:else if step.status === ScenarioProgressStepStatus.PENDING_QUESTIONS}
				<span class="badge variant-soft-tertiary text-neutral-500 ms-2">Pending questions</span>
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="content">
			<div class="grid grid-cols-4 gap-2 w-full">
				<div class="col-span-3">
					<div class="p-2 square border w-full accordion-border">
						{step.description}
					</div>
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
								{PUBLIC_VALIDATOR_BASE_URL}/v2/reseller/octo{step.endpointUrl}
							</span>
						</div>
					</div>
				</div>
				<div class="col-span-4">
					<div class="my-auto py-1">
						<span class="font-semibold">Validations</span>
						<span class="badge variant-soft">{results.length}</span>
					</div>
					<div class="accordion-border p-2 max-h-96 overflow-y-scroll">
						{#each results.sort((a, b) => new Date(b.utcCreatedAt).getTime() - new Date(a.utcCreatedAt).getTime()) as result, index}
							<div class="accordion-border mb-1">
								<Accordion>
									<AccordionItem>
										<svelte:fragment slot="iconClosed"><IconX size={'18'} /></svelte:fragment>
										<svelte:fragment slot="iconOpen"><IconSearch size={'18'} /></svelte:fragment>
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
												{#if result.data}
													<div class="mt-2">
														<div class="label">
															<span class="font-semibold">Data</span>
															<div class="border text-neutral-500 p-2">
																<JsonView json={result.data} />
															</div>
														</div>
													</div>
												{/if}
												{#if result.warnings.length > 0}
													<div class="mt-2">
														<div class="label">
															<span class="font-semibold">Warnings</span>
															<span class="badge variant-soft-warning"
																>{result.warnings.length}</span
															>
															<div class="border text-neutral-500 p-2">
																{#each result.warnings as warning}
																	<li class="ms-3">{warning}</li>
																{/each}
															</div>
														</div>
													</div>
												{/if}
												{#if result.errors.length > 0}
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
												{/if}
												{#if result.warnings.length === 0 && result.errors.length === 0}
													<div class="mt-2">
														<div class="label">
															<span class="font-semibold">No issues found</span>
														</div>
													</div>
												{/if}
											</div>
										</svelte:fragment>
									</AccordionItem>
								</Accordion>
							</div>
						{/each}
					</div>
				</div>
				{#if step.questions.length > 0}
					{#if isStepValid && step.status !== ScenarioProgressStepStatus.COMPLETED}
						<div class="col-span-4">
							<div class="my-auto py-1">
								<span class="font-semibold">Questions</span>
								<span class="badge variant-soft">{step.questions.length}</span>
							</div>
							<div class="grid grid-cols-1">
								<QuestionsList questions={step.questions} />
							</div>
							{#if $resellerScenarioQuestionsValidationStore.isLoading}
								loading
							{/if}
						</div>
						<div class="col-span-3"></div>
						<div>
							{#if !isQuestionsValid()}
								{#if $resellerScenarioQuestionsValidationStore.isLoading}
									<button class="btn variant-ghost-tertiary w-full" disabled>Validating...</button>
								{:else}
									<button
										class="btn variant-ghost-tertiary w-full"
										disabled={!isStepValid}
										on:click={() => validateQuestions()}>Validate answers</button
									>
								{/if}
							{/if}
						</div>
					{:else if step.status === ScenarioProgressStepStatus.COMPLETED}
						<div class="col-span-4">
							<div class="my-auto py-1">
								<span class="font-semibold">Questions</span>
								<span class="badge variant-soft">{step.questions.length}</span>
							</div>
							<div class="accordion-border p-2 text-center">
								<span class="h4"> All questions validated </span>
							</div>
						</div>
					{:else}
						<div class="col-span-4">
							<div class="my-auto py-1">
								<span class="font-semibold">Questions</span>
								<span class="badge variant-soft">{step.questions.length}</span>
							</div>
							<div>Send valid request first</div>
						</div>
					{/if}
				{/if}
				<div class="col-span-3"></div>
				<div>
					{#if isStepValid && pendingStatuses.includes(step.status) && isQuestionsValid()}
						<button class="btn variant-ghost-success w-full" on:click={() => nextStep()}
							>Next step</button
						>
					{:else}
						<button class="btn variant-soft-surface w-full" disabled>Next step</button>
					{/if}
				</div>
			</div>
		</svelte:fragment>
	</AccordionItem>
</div>

<style>
	.border {
		border-radius: 0.375rem;
	}
</style>
