<script lang="ts">
	import { Haptics, ImpactStyle } from '@capacitor/haptics';

	import { goto } from '$app/navigation';
	import { Capacitor } from '@capacitor/core';
	import type { EpubBook } from '$lib/book';

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
			goto(`/details/?id=${id}`);
		} else {
			goto(`/reader/?id=${id}`);
		}
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
			<div class="h-full w-full bg-emerald-500" />
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
