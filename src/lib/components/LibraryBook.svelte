<script lang="ts">
	import { Haptics, ImpactStyle } from '@capacitor/haptics';

	import { goto } from '$app/navigation';
	import type { EpubBook } from '$lib/book';
	import { Capacitor } from '@capacitor/core';

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

		if (duration >= 600) {
			await Haptics.impact({ style: ImpactStyle.Medium });
		} else {
			const id = book.metadata.book_id;
			goto(`/reader/?id=${id}`);
		}
	}
</script>

<div
	class="h-72 m-auto bg-neutral w-full rounded-3xl shadow-md"
	on:touchstart={touchDown}
	on:touchend={touchUp}
>
	<section class="h-52 overflow-clip rounded-tl-3xl rounded-tr-3xl relative">
		{#if book.metadata.coverImage}
			<img
				class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
				src={Capacitor.convertFileSrc(book.metadata.coverImage)}
				alt="cover"
			/>
		{:else}
			<div class="h-full w-full bg-emerald-500" />
		{/if}
	</section>

	<section class="w-full p-3 text-nowrap truncate">
		<h3 class="font-bold truncate leading-3">{book.metadata.title}</h3>
		<span class="font-medium text-sm opacity-50">{book.metadata.author ?? 'Missing Author'}</span>

		<div class="w-full h-2 rounded-full bg-base">
			<div style="width: {book.metadata.completion}%" class="h-full bg-accent rounded-full" />
		</div>
	</section>
</div>
