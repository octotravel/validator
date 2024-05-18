<script lang="ts">
	import { resellerScenarioAnswersStore } from "$lib/stores";
	import type { Question } from "$lib/types/Scenarios";
	import { ListBox, ListBoxItem, RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

    export let question: Question;

    let answer = false;

    const handleBlur = () => {
        $resellerScenarioAnswersStore = [
            ...$resellerScenarioAnswersStore.filter((q) => q.questionId !== question.id),
            { questionId: question.id, answer }
        ];
    };

    $: answer, handleBlur();
</script>

<div class="accordion-border p-4">
    <div>
        {question.label}
    </div>
    <div class="w-36 text-center mx-auto">
        <RadioGroup>
            <RadioItem bind:group={answer} name="justify" value={true}>True</RadioItem>
            <RadioItem bind:group={answer} name="justify" value={false}>False</RadioItem>
        </RadioGroup>       
    </div>
</div>