<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import {
		AppBar,
		AppShell,
		Toast,
		initializeStores,
		storeHighlightJs
	} from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import { pageTitleStore } from '$lib/stores';

	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { modeCurrent } from '@skeletonlabs/skeleton';

	import logo_light from '$lib/assets/images/logo_light.png';
	import logo from '$lib/assets/images/logo.png';

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
</script>

<Toast position="tr" />

<svelte:head>
	<title>OCTO Validation Tool</title>
</svelte:head>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<a href="/">
					{#if $modeCurrent}
						<img src={logo} class="h-10 m-2" alt="" />
					{:else}
						<img src={logo_light} class="h-10 m-2" alt="" />
					{/if}
				</a>
			</svelte:fragment>
			<h3 class="h3">
				{$pageTitleStore}
			</h3>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<div class="container mx-auto justify-center">
		<slot />
	</div>
</AppShell>
