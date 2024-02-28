<script lang="ts">
	import { supplierValidate } from '$lib/services/supplier/Validate';
	import {
		supplierFormEndpointStore,
		supplierFormApiKeyStore
	} from '$lib/stores/localStorageStores';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	const resetForm = () => {
		supplierFormEndpointStore.set('');
		supplierFormApiKeyStore.set('');
	};

	const validate = () => {
		supplierValidate({
			endpoint: $supplierFormEndpointStore,
			apiKey: $supplierFormApiKeyStore
		}, toastStore);
	};
</script>

<div class="card mt-10 w-full">
	<section class="p-4">
		<div class="flex gap-4">
			<div class="w-96">
				<label class="label">
					<span>Endpoint</span>
					<input
						class="input"
						name="endpoint"
						type="text"
						bind:value={$supplierFormEndpointStore}
					/>
				</label>
			</div>
			<div class="w-96">
				<label class="label">
					<span>Api Key</span>
					<input class="input" name="apikey" type="text" bind:value={$supplierFormApiKeyStore} />
				</label>
			</div>
		</div>
	</section>
	<footer class="card-footer">
		<button type="submit" class="btn variant-soft-secondary" on:click={validate}>Validate</button>
		<button type="button" class="btn variant-soft-surface" on:click={resetForm}>Reset</button>
	</footer>
</div>
