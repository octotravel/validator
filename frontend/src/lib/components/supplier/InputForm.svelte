<script lang="ts">
	import { supplierValidate } from '$lib/services/supplier/Validate';
	import {
		supplierFormEndpointStore,
		supplierFormApiKeyStore,
		supplierFormHeadersStore
	} from '$lib/stores/localStorageStores';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();

	const resetForm = () => {
		supplierFormEndpointStore.set('');
		supplierFormApiKeyStore.set('');
	};

	const validate = () => {
		const headers: Record<string, string> = {
			Authorization: `Bearer ${$supplierFormApiKeyStore}`,
			...$supplierFormHeadersStore.reduce(
				(acc, header) => {
					if (header.key) {
						acc[header.key] = header.value;
					}
					return acc;
				},
				{} as Record<string, string>
			)
		};

		console.log(headers);
		supplierValidate(
			{
				endpoint: $supplierFormEndpointStore,
				headers
			},
			toastStore
		);
	};

	const addHeader = () => {
		$supplierFormHeadersStore = [
			...$supplierFormHeadersStore,
			{
				key: '',
				value: ''
			}
		];
	};
</script>

<div class="card mt-10 w-full">
	<section class="p-4">
		<div class="">
			<label class="label">
				<span>Endpoint</span>
				<input class="input" name="endpoint" type="text" bind:value={$supplierFormEndpointStore} />
			</label>
		</div>
		<div class="mt-2">
			<span>Headers</span>
			<div class="my-1">
				<div class="flex grid grid-cols-12 gap-4">
					<div class="col-span-6">
						<input type="text" placeholder="Authorization" class="input" disabled />
					</div>
					<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] col-span-6">
						<div class="input-group-shim">Bearer</div>
						<input
							type="text"
							placeholder="www.example.com"
							bind:value={$supplierFormApiKeyStore}
						/>
					</div>
				</div>
				<!-- todo-->
				{#each $supplierFormHeadersStore as header, i}
					<div class="flex grid grid-cols-12 gap-4 mt-2">
						<div class="col-span-6">
							<input type="text" placeholder="Key" class="input" bind:value={header.key} />
						</div>
						<div class="col-span-5">
							<input type="text" placeholder="Value" class="input" bind:value={header.value} />
						</div>
						<div>
							<button
								class="btn variant-ghost-error w-full"
								on:click={() =>
									($supplierFormHeadersStore = $supplierFormHeadersStore.filter(
										(_, index) => index !== i
									))}><span>Remove</span></button
							>
						</div>
					</div>
				{/each}
				<div class="mt-2">
					<button class="btn variant-ghost-surface w-full" on:click={addHeader}
						><span>Add header</span></button
					>
				</div>
			</div>
		</div>
	</section>
	<footer class="card-footer">
		<button type="submit" class="btn variant-ghost-secondary" on:click={validate}>Validate</button>
		<button type="button" class="btn variant-ghost-surface" on:click={resetForm}>Reset</button>
	</footer>
</div>
