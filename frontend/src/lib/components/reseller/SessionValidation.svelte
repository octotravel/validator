<script lang="ts">
	import ScenarioDetail from './ScenarioDetail.svelte';
	import ScenarioList from './ScenarioList.svelte';
	import SessionMiniDetails from './SessionMiniDetails.svelte';
</script>

<div class="grid grid-cols-4 mt-10 w-full gap-2">
	<div>
		<SessionMiniDetails />
		<ScenarioList />
	</div>
	<div class="col-span-3">
		<ScenarioDetail />
	</div>
</div>
