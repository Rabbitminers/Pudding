<script lang="ts">
	import LibraryBook from '$lib/components/LibraryBook.svelte';
	import Sun from '$lib/components/icons/Sun.svelte';
	import Moon from '$lib/components/icons/Moon.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Layout from '$lib/components/Layout.svelte';

	import { addBookToLibrary, library, loadLibary } from '$lib/library';
	import { EpubBook } from '$lib/book';
	import { ToastConfig } from '$lib/toast/constants';
	import { LIBRARY_PATH } from '$lib/constants';

	import { Directory, Filesystem } from '@capacitor/filesystem';
	import { FilePicker } from '@capawesome/capacitor-file-picker';
	import type { PickFilesResult } from '@capawesome/capacitor-file-picker';
	import type { WriteFileResult } from '@capacitor/filesystem';

	import toast from 'svelte-french-toast';
	import { Book } from 'epubjs';
	import { nanoid } from 'nanoid';
	import { onMount } from 'svelte';
	import { toggleMode, mode } from 'mode-watcher';

	$: books = orderLibrary($library);

	function orderLibrary(library: Map<String, EpubBook>): EpubBook[] {
		const books = Array.from(library.values());

		books.sort((a, b) => {
			const second = new Date(a.metadata.lastRead);
			const first = new Date(b.metadata.lastRead);

			return first.getTime() - second.getTime();
		});

		return books;
	}

	async function addBooks(): Promise<void> {
		const result = await pickBook();

		if (result === null) {
			return;
		}

		if (result.files.length !== 1 && result.files[0]) {
			toast.error('Invalid number of books selected', ToastConfig);
		}

		const book = result.files[0];

		if (!book.data || !book.path) {
			toast.error("The selected file isn't a valid book, please select another!", ToastConfig);
			return;
		}

		const desintation = LIBRARY_PATH + book.name;

		// Check that a book with that name has not already been imported
		try {
			await Filesystem.stat({
				path: desintation,
				directory: Directory.Data
			});

			toast.error('A book with that name is already in your library', ToastConfig);
			return;
		} catch (error) {
			// Filesystem#stat throws an en error if the file does not
			// exist as such this is the inteded behaviour
		}

		const epub = await EpubBook.epubFromBase64(book.data.toString());

		if (epub === null) {
			toast.error("The selected file isn't a valid book, please select another!", ToastConfig);
			return;
		}

		const cached_cover = await cacheCoverImage(epub);

		let writeResult: WriteFileResult;

		try {
			writeResult = await Filesystem.writeFile({
				path: desintation,
				data: book.data,
				directory: Directory.Data,
				recursive: true
			});
		} catch (error) {
			console.error(error);

			toast.error('Failed to save the book to your library, please try again', ToastConfig);
			return;
		}

		const epubBook = await EpubBook.fromNewBook(epub, cached_cover, writeResult.uri);

		await addBookToLibrary(epubBook);
		toast.success('Added the book to your library', ToastConfig);
	}

	async function cacheCoverImage(book: Book): Promise<string | null> {
		// @ts-ignore
		const cover: string = book.cover;

		if (!cover) {
			return null;
		}

		let data: string;

		try {
			// This can fail, although only if the cover url isnt present,
			// still wrap it just in case the path is missing or otherwise
			// incorrect
			data = await book.archive.getBase64(cover);
		} catch (error) {
			console.error(error);
			return null;
		}

		const extension = cover.split('.').pop();
		const covername = nanoid() + '.' + extension;

		try {
			const output = await Filesystem.writeFile({
				path: 'covers/' + covername,
				data: data,
				directory: Directory.Data,
				recursive: true
			});

			return output.uri;
		} catch (error) {
			console.error(error);

			toast.error('Failed to save the books cover, please try again', ToastConfig);
			return null;
		}
	}

	async function pickBook(): Promise<PickFilesResult | null> {
		// For more information on application file types see the IANA
		// reference listed bellow
		//
		// https://www.iana.org/assignments/media-types/media-types.xhtml
		try {
			const result = await FilePicker.pickFiles({
				types: ['application/epub+zip'],
				multiple: false,
				readData: true
			});

			return result;
		} catch (error) {
			// We could display a toast here but this would likely be
			// intentionally done by the user after they accidentally
			// pressed the add to library button so it's porbably better
			// not to
			console.log('Cancelled pick file action');
			return null;
		}
	}

	onMount(() => loadLibary());
</script>

<Layout>
	<svelte:fragment slot="title">Library</svelte:fragment>

	<svelte:fragment slot="actions">
		<button
			class="h-fit w-fit rounded-full bg-accent p-1 text-base transition-all duration-200 active:scale-75"
			on:click={addBooks}
		>
			<Plus />
		</button>

		<button class="h-fit w-fit transition-all duration-200 active:scale-75" on:click={toggleMode}>
			{#if $mode === 'light'}
				<Moon />
			{:else}
				<Sun />
			{/if}
		</button>
	</svelte:fragment>

	<article class="grid grid-cols-2 gap-4">
		{#each books as book}
			<LibraryBook {book} />
		{/each}
	</article>
</Layout>
