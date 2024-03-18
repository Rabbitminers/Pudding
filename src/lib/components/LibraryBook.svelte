<script lang="ts">
	import { Haptics, ImpactStyle } from '@capacitor/haptics';

	import { goto } from '$app/navigation';
	import { Capacitor } from '@capacitor/core';
	import type { EpubBook } from '$lib/book';
	import { Filesystem } from '@capacitor/filesystem';
	import { removeBookFromLibrary } from '$lib/library';
	import toast from 'svelte-french-toast';
	import { ToastConfig } from '$lib/toast/constants';

	export let book: EpubBook;

	const SCROLL_THRESHOLD = 5;

	let started: number;
	let originY: number;

	function touchDown({ targetTouches }: TouchEvent) {
		if (targetTouches.length < 1) {
			return;
		}

		const touch = targetTouches.item(0);

		if (touch === null) {
			return;
		}

		const { clientY } = touch;
		originY = clientY;

		started = new Date().getTime();
	}

	async function touchUp({ changedTouches }: TouchEvent) {
		if (changedTouches.length < 1) {
			return;
		}

		const touch = changedTouches.item(0);

		if (touch === null) {
			return;
		}

		const { clientY } = touch;

		if (Math.abs(clientY - originY) > SCROLL_THRESHOLD) {
			return;
		}

		const now = new Date().getTime();
		const duration = now - started;

		const id = book.metadata.book_id;
		if (duration >= 600) {
			await Haptics.impact({ style: ImpactStyle.Medium });
			removeBook();
		} else {
			goto(`/reader/?id=${id}`);
		}
	}

	async function removeBook(): Promise<void> {
		const confirmation = confirm(`Do you want to remove ${book.metadata.title} from your library?`);

		if (!confirmation) {
			return;
		}

		// Remove the book from the library first so that
		// if we end up with an invalid state it won't be
		// loaded
		await removeBookFromLibrary(book.metadata.book_id);

		try {
			if (book.metadata.coverImage) {
				await Filesystem.deleteFile({ path: book.metadata.coverImage });
			}

			await Filesystem.deleteFile({ path: book.metadata.file });
		} catch (error) {
			console.error(`Error removing book: ${error}`);

			toast.error('An error occured while removing the book files', ToastConfig);
			return;
		}

		toast.success('Successfully removed the book from your library', ToastConfig);
	}
</script>

<div
	class="m-auto h-72 w-full rounded-3xl bg-neutral shadow-md"
	on:touchstart={touchDown}
	on:touchend={touchUp}
>
	<section class="relative h-52 overflow-clip rounded-tl-3xl rounded-tr-3xl">
		{#if book.metadata.coverImage}
			<img
				class="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform"
				src={Capacitor.convertFileSrc(book.metadata.coverImage)}
				alt="cover"
			/>
		{:else}
			<div class="missing-image h-full w-full" />
		{/if}
	</section>

	<section class="w-full truncate text-nowrap p-3">
		<h3 class="truncate font-bold leading-3">{book.metadata.title}</h3>
		<span class="text-sm font-medium opacity-50">{book.metadata.author ?? 'Missing Author'}</span>

		<div class="h-2 w-full rounded-full bg-base">
			<div style="width: {book.metadata.completion}%" class="h-full rounded-full bg-accent" />
		</div>
	</section>
</div>

<style>
	.missing-image {
		background: wheat;
		background-image: radial-gradient(white 20%, transparent 0),
			radial-gradient(white 20%, transparent 0);
		background-size: 30px 30px;
		background-position:
			0 0,
			15px 15px;
	}
</style>
