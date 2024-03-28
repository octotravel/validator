<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
</script>

{#if $modalStore[0]}
	<header>{$modalStore[0].title}</header>
	<article>{$modalStore[0].body}</article>
{/if}
