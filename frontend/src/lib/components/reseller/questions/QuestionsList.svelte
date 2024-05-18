<script lang="ts">
	import { QuestionInputType, type Question } from "$lib/types/Scenarios";
	import QuestionBoolean from "./QuestionBoolean.svelte";
	import QuestionNumber from "./QuestionNumber.svelte";
	import QuestionOption from "./QuestionOption.svelte";
	import QuestionString from "./QuestionString.svelte";

    export let questions: Question[];
</script>
<div class="accordion-border">
    {#each questions as question}
        {#if question.input.type === QuestionInputType.NUMBER}
            <QuestionNumber question={question} />
        {:else if question.input.type === QuestionInputType.BOOLEAN}
            <QuestionBoolean question={question} />
        {:else if question.input.type === QuestionInputType.STRING}
            <QuestionString question={question} />
        {:else if question.input.type === QuestionInputType.OPTION}
            <QuestionOption question={question} />
        {/if}
    {/each}
</div>