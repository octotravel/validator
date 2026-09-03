<script lang="ts">
	export let message: string | null = null;
	export let title = 'Something went wrong';
	export let onRetry: (() => void) | null = null;
	export let onDismiss: (() => void) | null = null;
</script>

{#if message}
	<aside class="alert variant-filled-error mt-4 text-left" role="alert" aria-live="assertive">
		<div class="alert-message">
			<h3 class="h4">{title}</h3>
			<p class="break-words">{message}</p>
		</div>
		<div class="alert-actions">
			{#if onRetry}
				<button class="btn btn-sm variant-filled" on:click={onRetry}>Retry</button>
			{/if}
			{#if onDismiss}
				<button class="btn btn-sm variant-soft" on:click={onDismiss}>Dismiss</button>
			{/if}
		</div>
	</aside>
{/if}
