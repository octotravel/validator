<script lang="ts">
	import { resellerSessionStore } from '$lib/stores';
</script>

{#if $resellerSessionStore.session}
	<label class="label">
		<input
			class="input w-96"
			type="text"
			placeholder="Name"
			bind:value={$resellerSessionStore.session.name}
		/>
	</label>
{/if}
