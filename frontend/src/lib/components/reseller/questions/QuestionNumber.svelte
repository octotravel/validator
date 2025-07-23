<script lang="ts">
	import { resellerScenarioQuestionsValidationStore } from '$lib/stores';
	import { QuestionValidationStatus, type Question } from '$lib/types/Scenarios';

	export let question: Question;
	// eslint-disable-next-line
	export let handleBlur: (question: Question, answer: number) => void;

	let answer = 0;

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

	$: answer, handleBlur(question, Number(answer) || 0);
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

		<input class="input" type="number" bind:value={answer} placeholder="Your answer..." />
	</label>
</div>
