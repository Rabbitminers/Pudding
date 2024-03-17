<script lang="ts">
	import PlusCircle from '$lib/components/icons/PlusCircle.svelte';
	import MinusCircle from '$lib/components/icons/MinusCircle.svelte';
	import Sun from '$lib/components/icons/Sun.svelte';
	import Loading from '$lib/components/ui/Loading.svelte';
	import Moon from '$lib/components/icons/Moon.svelte';
	import Type from '$lib/components/icons/Type.svelte';
	import Scale from '$lib/components/icons/Scale.svelte';
	import Home from '$lib/components/icons/Home.svelte';
	import { library, loadLibary, libraryLoaded, saveLibrary } from '$lib/library';
	import { localStorageStore } from '$lib/helpers/localstorage';
	import type { EpubBook } from '$lib/book';
	import type { ReaderTheme } from '$lib/types';

	import type { Rendition, Location } from 'epubjs';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { mode, toggleMode } from 'mode-watcher';

	let path = $page.url.searchParams.get('id');
	let books = $library;

	const MAX_FONT_SIZE = 32;
	const MIN_FONT_SIZE = 10;
	const FONT_STEP = 1;

	const FONTS = ['Arial', 'Courier New', 'Times New Roman'];

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

	let epub: EpubBook | undefined;
	let rendition: Rendition | undefined;
	let overlay = false;

	let fontSize = localStorageStore<number>('font_size', 10);
	let fontFamily = localStorageStore<string | null>('font_family', null);
	let tab: string = TABS.FONT_FAMILY;

	let loaded = false;

	$: setReaderTheme($mode);
	$: setFontSize($fontSize);
	$: setFontFamily($fontFamily);

	function setFontFamily(family: string | null) {
		if (family === null) {
			rendition?.themes.font('');
			return;
		}

		rendition?.themes.font(family);
	}

	function chooseFontFamily(family: string) {
		const currentFamily = $fontFamily;
		$fontFamily = currentFamily == family ? null : family;
	}

	function stepUpFontSize() {
		const currentSize = $fontSize;

		if (currentSize + FONT_STEP >= MAX_FONT_SIZE) {
			$fontSize = MAX_FONT_SIZE;
			return;
		}

		$fontSize = currentSize + FONT_STEP;
	}

	function stepDownFontSize() {
		const currentSize = $fontSize;

		if (currentSize - FONT_STEP <= MIN_FONT_SIZE) {
			$fontSize = MIN_FONT_SIZE;
			return;
		}

		$fontSize = currentSize - FONT_STEP;
	}

	function setFontSize(size: number) {
		const fontsize = `${size}px`;
		rendition?.themes.fontSize(fontsize);
	}

	async function loadBook(): Promise<void> {
		if (!path || path === '') {
			return;
		}

		if (!$libraryLoaded) {
			await loadLibary();
		}

		epub = books.get(path);

		if (!epub) {
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

		epub.book.locations.generate(1024);

		loaded = true;

		rendition = epub.book.renderTo('page', {
			manager: 'continuous',
			flow: 'paginated',
			width: '100%',
			height: '100%',
			snap: true
		});

		rendition.on('click', toggleOverlay);
		rendition.on('relocated', onRelocate);

		// We manually call these now so that the initial state
		// of the stores is applied otherwise they would only
		// effect the rendition once they are mutated again later
		//
		setReaderTheme($mode);
		setFontFamily($fontFamily);
		setFontSize($fontSize);

		if (epub.metadata.location) {
			rendition.display(epub.metadata.location);
		} else {
			rendition.display();
		}
	}

	function onRelocate(location: Location) {
		tab = TABS.CLOSED;
		overlay = false;

		library.update((map) => {
			if (!epub || !epub.book) {
				return map;
			}
			const index = location.start.location;

			// todo: Look futher into these percentage calculations
			// ideally we would just use the percentage property on
			// the location but that seems to consistantly give
			// incorrect values, this method still does sometimes
			// particuarlly on initial load so perhaps some kind of
			// invalidation is needed
			const percentage = epub.book.locations.percentageFromLocation(index) * 100;

			const book_id = epub.metadata.book_id;
			epub.metadata.location = location.start.cfi;
			epub.metadata.completion = percentage ?? 0;
			epub.metadata.lastRead = new Date();

			map.set(book_id, epub);
			return map;
		});

		saveLibrary();
	}

	function toggleFontSizeTab() {
		tab = tab === TABS.FONT_SIZE ? TABS.CLOSED : TABS.FONT_SIZE;
	}

	function toggleFontFamilyTab() {
		tab = tab === TABS.FONT_FAMILY ? TABS.CLOSED : TABS.FONT_FAMILY;
	}

	function tabDelay(): number {
		// When switching between active tabs we use a delay to ensure
		// that the current open tab is visually closed before oponing
		// the next one to reduce visual clutter. However when there is
		// no tab to close this delay makes the app feel slower, hence
		// we remove it when no tab is shown.
		return tab === TABS.CLOSED ? 0 : 200;
	}

	function toggleOverlay() {
		if (overlay && tab !== TABS.CLOSED) {
			tab = TABS.CLOSED;
			return;
		}

		overlay = !overlay;
	}

	function setReaderTheme(theme: string | undefined) {
		const dark = theme === 'dark';

		// The nicer solution here would be to define a set of themes
		// along the same names as those defined in mode watcher with
		// a system fallback then roll with that but for whatever
		// reason the themes in epub.js when selected only ever apply
		// once i.e if the initial theme was dark, then light was set
		// then dark again it would become stuck on dark
		rendition?.themes.default(dark ? DARK_THEME : LIGHT_THEME);
	}

	onMount(() => {
		renderBook();
	});
</script>

{#if overlay}
	<article id="overlay" class="pointer-events-none absolute z-10 flex h-full w-full flex-col">
		<header
			class="pointer-events-auto flex flex-row justify-between bg-neutral p-6 pt-12 shadow-lg"
			transition:slide={{ delay: 300, duration: 600 }}
		>
			<h1 class="truncate text-nowrap text-xl font-bold">
				{epub?.metadata.title}
			</h1>

			<section class="flex flex-row justify-end gap-4">
				<a href="/"><Home /></a>
			</section>
		</header>

		<section
			class="flex-grow bg-black opacity-30 dark:opacity-50"
			in:fade
			out:fade={{ delay: 300 }}
		/>

		<footer class="pointer-events-auto absolute bottom-0 w-full">
			{#if tab === TABS.FONT_SIZE}
				<section
					class="grid h-24 w-full grid-cols-3 place-items-center bg-neutral"
					in:slide={{ delay: tabDelay(), duration: 600 }}
					out:slide={{ delay: 0, duration: 200 }}
				>
					<button class="transition-all duration-200 active:scale-75" on:click={stepUpFontSize}>
						<PlusCircle />
					</button>

					<span style="font-size: {$fontSize}px;" class="font-bold"> Aa </span>

					<button class="transition-all duration-200 active:scale-75" on:click={stepDownFontSize}>
						<MinusCircle />
					</button>
				</section>
			{/if}

			{#if tab === TABS.FONT_FAMILY}
				<section
					class="grid h-24 w-full grid-cols-3 place-items-center justify-around bg-neutral text-center"
					in:slide={{ delay: tabDelay(), duration: 600 }}
					out:slide={{ delay: 0, duration: 200 }}
				>
					{#each Object.values(FONTS) as font}
						<button
							style="font-family: '{font}'"
							class="h-12 w-12"
							class:active={font === $fontFamily}
							on:click={() => chooseFontFamily(font)}
						>
							Aa
						</button>
					{/each}
				</section>
			{/if}

			<section
				class="grid h-24 w-full grid-cols-3 place-items-center bg-neutral shadow-lg"
				transition:slide={{ delay: 300, duration: 600 }}
			>
				<button class="transition-all duration-200 active:scale-75" on:click={toggleFontFamilyTab}>
					<Type />
				</button>

				<button class="transition-all duration-200 active:scale-75" on:click={toggleFontSizeTab}>
					<Scale />
				</button>

				<button class="transition-all duration-200 active:scale-75" on:click={toggleMode}>
					{#if $mode === 'light'}
						<Moon />
					{:else}
						<Sun />
					{/if}
				</button>
			</section>
		</footer>
	</article>
{/if}

{#if loaded}
	<div id="page" class="h-full w-full bg-neutral pt-6" />
{:else}
	<div class="grid h-full w-full place-items-center">
		<Loading />
	</div>
{/if}

<style lang="postcss">
	.active {
		@apply rounded-full bg-accent text-neutral;
	}
</style>
