<script lang="ts">
    import { createSession } from '$lib/services/reseller/Session';
</script>

<div class="card mt-10 w-full text-slate-700">
	<header class="card-header text-center">
        <h3 class="h3">Reseller</h3>
	</header>
	<section class="mt-5 p-4 text-center">
		<p>
            You can create a new session or search for an existing session by ID.
        </p>
		<div class="grid grid-cols-3 place-items-center mt-10">
			<div>
				<button class="btn variant-ghost-success" on:click={() => createSession()}>Create Session</button>
			</div>
			<span class="divider-vertical h-20" />
			<div>
				<div class="input-group input-group-divider grid-cols-[1fr_auto]">
					<input type="text" placeholder="Search session by ID..." />
					<button class="variant-soft-primary">Search</button>
				</div>
			</div>
		</div>
	</section>
</div>
