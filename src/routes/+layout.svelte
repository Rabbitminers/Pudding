<script lang="ts">
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { App } from '@capacitor/app';
	import { Capacitor } from '@capacitor/core';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Toaster } from 'svelte-french-toast';
	import { ModeWatcher, mode } from 'mode-watcher';

	$: styleStatusBar($mode);

	function styleStatusBar(mode: string | undefined) {
		const platform = Capacitor.getPlatform();

		const style = mode === 'light' ? Style.Light : Style.Dark;

		if (platform === 'android' || platform === 'ios') {
			StatusBar.setOverlaysWebView({ overlay: true });
			StatusBar.setStyle({ style: style });
		}
	}

	onMount(() => {
		let backlistener = App.addListener('backButton', () => {
			let currentPage = get(page);

			// This is a bit 'cheaty' but since we have no heavy
			// route nesting you are almost always going back to
			// return to your library so not only is this simpler
			// to implement but likely also nicer to use
			if (currentPage.route.id !== '/') {
				goto('/');
			} else {
				// Recreate the natvie functionality of returning
				// in an empty navigation stack
				App.exitApp();
			}
		});

		return () => {
			backlistener.remove();
		};
	});
</script>

<ModeWatcher />
<Toaster />

<article class="w-screen h-screen bg-base">
	<slot />
</article>
