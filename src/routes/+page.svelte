<script lang="ts">
	import Gear from '$lib/components/icons/Gear.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Book from '$lib/components/Book.svelte';

	import { ToastConfig } from '$lib/toast/constants';

	import type { EpubBook } from '$lib/types';

	import { Directory, Filesystem } from '@capacitor/filesystem';
	import { FilePicker } from '@capawesome/capacitor-file-picker';

	import type { PickFilesResult, PickedFile } from '@capawesome/capacitor-file-picker';

	import toast from 'svelte-french-toast';
	import Layout from '$lib/components/Layout.svelte';

	const books: EpubBook[] = [
		{
			title: 'Charlie and the Chocolate Factory',
			authors: ['Roald Dahl'],
			progress: 30,
			image_url: 'https://m.media-amazon.com/images/I/81Dp5Of3zeL._AC_UF894,1000_QL80_.jpg'
		},
		{
			title: 'Charlie and the Great Glass Elevator',
			authors: ['Roald Dahl'],
			progress: 60,
			image_url: 'https://m.media-amazon.com/images/I/91sAxVbwXiL._AC_UF894,1000_QL80_.jpg'
		},
		{
			title: 'The Fine Print',
			authors: ['Lauren Asher'],
			progress: 70,
			image_url: 'https://m.media-amazon.com/images/I/81pzRUTin6L._AC_UF894,1000_QL80_.jpg'
		},
		{
			title: 'Final Offer',
			authors: ['Lauren Asher'],
			progress: 20,
			image_url: 'https://i.ebayimg.com/images/g/-IgAAOSwb3tjz4Ts/s-l1600.jpg'
		},
		{
			title: 'Terms and Conditions',
			authors: ['Lauren Asher'],
			progress: 100,
			image_url: 'https://m.media-amazon.com/images/I/91HWpZXBJnL._AC_UF894,1000_QL80_.jpg'
		}
	];

	async function addBooks(): Promise<void> {
		const result = await pickBook();

		if (result === null) {
			return;
		}

		if (result.files.length !== 1 && result.files[0]) {
			alert('Invalid ammount');
		}

		const book = result.files[0];

		if (!book.data) {
			toast.error("The selected file isn't a valid book, please select another!", ToastConfig);
			return;
		}

		const desintation = 'library/' + book.name;

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

		try {
			await Filesystem.writeFile({
				path: 'library/' + book.name,
				data: book.data,
				directory: Directory.Data,
				recursive: true
			});
		} catch (error) {
			console.error(error);

			toast.error('Failed to save the book to your library, please try again', ToastConfig);
			return;
		}

		toast.success('Added the book to your library', ToastConfig);
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

	async function loadBooks() {
		// todo
	}
</script>

<Layout>
	<svelte:fragment slot="title">Library</svelte:fragment>

	<svelte:fragment slot="actions">
		<button class="w-fit h-fit bg-accent text-base-100 p-1 rounded-full" on:click={addBooks}>
			<Plus />
		</button>

		<a class="w-fit h-fit" href="/settings"><Gear /></a>
	</svelte:fragment>

	<article class="grid grid-cols-2 gap-4">
		{#each books as book}
			<Book {book} />
		{/each}
	</article>
</Layout>
