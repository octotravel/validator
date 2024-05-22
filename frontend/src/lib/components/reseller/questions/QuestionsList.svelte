<script lang="ts">
	import { QuestionInputType, type Question } from '$lib/types/Scenarios';
	import QuestionBoolean from './QuestionBoolean.svelte';
	import QuestionNumber from './QuestionNumber.svelte';
	import QuestionOption from './QuestionOption.svelte';
	import QuestionString from './QuestionString.svelte';

	export let questions: Question[];
</script>

<div class="accordion-border p-2">
	{#each questions as question}
		{#if question.input.type === QuestionInputType.NUMBER}
			<QuestionNumber {question} />
		{:else if question.input.type === QuestionInputType.BOOLEAN}
			<QuestionBoolean {question} />
		{:else if question.input.type === QuestionInputType.STRING}
			<QuestionString {question} />
		{:else if question.input.type === QuestionInputType.OPTION}
			<QuestionOption {question} />
		{/if}
	{/each}
</div>
