<script lang="ts">
	import { resellerScenarioQuestionsValidationStore } from '$lib/stores';
	import { QuestionValidationStatus, type Question } from '$lib/types/Scenarios';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let question: Question;
	// eslint-disable-next-line
	export let handleBlur: (question: Question, answer: any) => void;

	let answer = false;

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

	$: answer, handleBlur(question, answer);
</script>

<div class="accordion-border p-4">
	<div>
		{question.label}
		{#if status() === QuestionValidationStatus.CORRECT}
			<span class="badge variant-soft-success">Correct</span>
		{:else if status() === QuestionValidationStatus.INCORRECT}
			<span class="badge variant-soft-error">Incorrect</span>
		{:else if status() === QuestionValidationStatus.NOT_VALIDATED}
			<span class="badge variant-soft-surface">Not validated</span>
		{:else if status() === QuestionValidationStatus.LOADING}
			<span class="badge variant-soft-surface">Loading...</span>
		{/if}
	</div>
	<div class="w-36 text-center mx-auto">
		<RadioGroup>
			<RadioItem bind:group={answer} name="justify" value={true}>True</RadioItem>
			<RadioItem bind:group={answer} name="justify" value={false}>False</RadioItem>
		</RadioGroup>
	</div>
</div>
