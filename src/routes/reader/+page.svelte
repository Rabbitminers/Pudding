<script lang="ts">
	import Sun from './../../lib/components/icons/Sun.svelte';
	import Loading from './../../lib/components/ui/Loading.svelte';
	import Moon from '../../lib/components/icons/Moon.svelte';
	import Type from '../../lib/components/icons/Type.svelte';
	import Scale from '../../lib/components/icons/Scale.svelte';
	import Home from '$lib/components/icons/Home.svelte';
	import { library, loadLibary, libraryLoaded } from '$lib/library';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { EpubBook } from '$lib/book';
	import { fade, slide } from 'svelte/transition';
	import { mode, toggleMode } from 'mode-watcher';
	import type { ReaderTheme } from '$lib/types';
	import type { Rendition } from 'epubjs';

	let path = $page.url.searchParams.get('id');
	let books = $library;

	let epub: EpubBook | undefined;
	let rendition: Rendition | undefined;
	let overlay = true;

	let tab: string;

	let loaded = false;
	let failed = false;

	const TABS = {
		FONT_SIZE: 'font_size',
		FONT_FAMILY: 'font_family',
		CLOSED: 'closed'
	};

	const LIGHT_THEME: ReaderTheme = {
		body: {
			background: 'white',
			color: 'black'
		}
	};

	const DARK_THEME: ReaderTheme = {
		body: {
			background: 'black',
			color: 'white'
		}
	};

	$: setReaderTheme($mode);

	async function loadBook(): Promise<void> {
		if (!path || path === '') {
			failed = true;
			return;
		}

		if (!$libraryLoaded) {
			await loadLibary();
		}

		epub = books.get(path);

		if (!epub) {
			failed = true;
			return;
		}

		if (!epub?.loadAttempted) {
			await epub.loadEpubFile();
		}
	}

	async function renderBook(): Promise<void> {
		await loadBook();

		if (!epub?.book) {
			return;
		}

		loaded = true;

		rendition = epub.book.renderTo('page', {
			manager: 'continuous',
			flow: 'paginated',
			width: '100%',
			height: '100%',
			snap: true
		});

		rendition.on('click', toggleOverlay);

		rendition.on('relocated', (location: Location) => {
			// overlay = false;
		});

		setReaderTheme($mode);

		rendition.display();
	}

	function toggleOverlay() {
		overlay = !overlay;
	}

	function setReaderTheme(theme: string | undefined) {
		const dark = theme === 'dark';

		rendition?.themes.default(dark ? DARK_THEME : LIGHT_THEME);
	}

	onMount(() => {
		renderBook();
	});
</script>

<article class="w-full h-full">
	{#if overlay}
		<div id="overlay" class="flex flex-col h-full w-full absolute z-10 pointer-events-none">
			<header
				class="p-6 pt-12 shadow-lg flex flex-row justify-between bg-neutral pointer-events-auto"
				transition:slide={{ delay: 300, duration: 600 }}
			>
				<h1 class="text-xl font-bold text-nowrap truncate">
					{epub?.metadata.title}
				</h1>

				<section class="flex flex-row justify-end gap-4">
					<a href="/"><Home /></a>
				</section>
			</header>

			<section class="flex-grow bg-black opacity-30 dark:opacity-50" transition:fade />

			<footer class="absolute w-full bottom-0">
				{#if tab === 'font-size'}
					<section class="h-24 w-full bg-neutral" transition:slide={{ delay: 0, duration: 600 }}>
						Font Size
					</section>
				{/if}

				<section
					class="w-full h-24 bg-neutral shadow-lg grid grid-cols-3 pointer-events-auto"
					transition:slide={{ delay: 300, duration: 600 }}
				>
					<button class="m-auto">
						<Type />
					</button>

					<button
						class="m-auto"
						on:click={() => {
							tab = tab !== 'test' ? 'test' : '';
						}}
					>
						<Scale />
					</button>

					<button class="m-auto" on:click={toggleMode}>
						{#if $mode === 'light'}
							<Moon />
						{:else}
							<Sun />
						{/if}
					</button>
				</section>
			</footer>
		</div>
	{/if}

	{#if loaded}
		<div id="page" class="w-full h-full pt-6 bg-neutral" />
	{:else}
		<div class="w-full h-full grid place-items-center">
			<Loading />
		</div>
	{/if}
</article>
