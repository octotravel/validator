<script lang="ts">
	import { resellerScenarioAnswersStore } from '$lib/stores';
	import { QuestionInputType, type Question } from '$lib/types/Scenarios';
	import QuestionBoolean from './QuestionBoolean.svelte';
	import QuestionNumber from './QuestionNumber.svelte';
	import QuestionOption from './QuestionOption.svelte';
	import QuestionString from './QuestionString.svelte';

	export let questions: Question[];
	// eslint-disable-next-line
	const handleBlur = (question: Question, answer: any) => {
		$resellerScenarioAnswersStore = [
			...$resellerScenarioAnswersStore.filter((q) => q.questionId !== question.id),
			{ questionId: question.id, answer }
		];
	};
</script>

<div class="accordion-border p-2">
	{#each questions as question}
		{#if question.input.type === QuestionInputType.NUMBER}
			<QuestionNumber {question} {handleBlur} />
		{:else if question.input.type === QuestionInputType.BOOLEAN}
			<QuestionBoolean {question} {handleBlur} />
		{:else if question.input.type === QuestionInputType.STRING}
			<QuestionString {question} {handleBlur} />
		{:else if question.input.type === QuestionInputType.OPTION}
			<QuestionOption {question} {handleBlur} />
		{/if}
	{/each}
</div>
