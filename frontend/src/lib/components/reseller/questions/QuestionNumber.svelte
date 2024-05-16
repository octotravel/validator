<script lang="ts">
	import { resellerScenarioAnswersStore } from "$lib/stores";
	import type { Question } from "$lib/types/Scenarios";

    export let question: Question;

    let answer = '';

    const handleBlur = () => {
        $resellerScenarioAnswersStore = [
            ...$resellerScenarioAnswersStore.filter((q) => q.questionId !== question.id),
            { questionId: question.id, answer }
        ];
    };

    $: answer, handleBlur();
</script>

<div class="accordion-border p-4">
    <label class="label">
        <span>{question.label}</span>
        <input class="input" bind:value={answer} placeholder="Your answer..." />
    </label>
</div>