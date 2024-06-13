<script lang="ts">
	import {
		resellerScenarioAnswersStore,
		resellerScenarioQuestionsValidationStore
	} from '$lib/stores';
	import { QuestionValidationStatus, type Question } from '$lib/types/Scenarios';

	export let question: Question;

	let answer = '';

	const handleBlur = () => {
		$resellerScenarioAnswersStore = [
			...$resellerScenarioAnswersStore.filter((q) => q.questionId !== question.id),
			{ questionId: question.id, answer }
		];
	};

	$: status = () => {
		const q =
			$resellerScenarioQuestionsValidationStore.questions.find(
				(q) => q.questionId === question.id
			) ?? null;

		if ($resellerScenarioQuestionsValidationStore.isLoading) {
			return QuestionValidationStatus.LOADING;
		}

		if (q === null) {
			return QuestionValidationStatus.NOT_VALIDATED;
		}

		if (q.isValid) {
			return QuestionValidationStatus.CORRECT;
		} else if (q.isValid === false) {
			return QuestionValidationStatus.INCORRECT;
		}
		return QuestionValidationStatus.NOT_VALIDATED;
	};

	$: answer, handleBlur();
</script>

<div class="accordion-border p-4">
	<label class="label">
		<span>{question.label}</span>
		{#if status() === QuestionValidationStatus.CORRECT}
			<span class="badge variant-soft-success">Correct</span>
		{:else if status() === QuestionValidationStatus.INCORRECT}
			<span class="badge variant-soft-error">Incorrect</span>
		{:else if status() === QuestionValidationStatus.NOT_VALIDATED}
			<span class="badge variant-soft-surface">Not validated</span>
		{:else if status() === QuestionValidationStatus.LOADING}
			<span class="badge variant-soft-surface">Loading...</span>
		{/if}
		<input class="input" bind:value={answer} placeholder="Your answer..." />
	</label>
</div>
