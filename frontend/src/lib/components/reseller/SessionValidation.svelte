<script lang="ts">
	import type { Session } from '$lib/types/Session';
	import ScenarioDetail from './ScenarioDetail.svelte';
	import ScenarioList from './ScenarioList.svelte';
</script>

<div class="grid grid-cols-4 mt-10 w-full">
	<div>
		<ScenarioList />
	</div>
	<div class="col-span-3">
		<ScenarioDetail />
	</div>
</div>
