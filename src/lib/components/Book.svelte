<script lang="ts">
	import type { EpubBook } from '$lib/types';

	export let book: EpubBook;
</script>

<div class="h-72 m-auto bg-neutral w-full rounded-3xl shadow-md">
	<section class="h-52 overflow-clip rounded-tl-3xl rounded-tr-3xl relative">
		<img
			class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
			src={book.image_url}
			alt="cover"
		/>
	</section>

	<section class="w-full p-3 text-nowrap truncate">
		<h3 class="font-bold truncate leading-3">{book.title}</h3>
		<span class="font-medium text-sm opacity-50">{book.authors}</span>

		<div class="w-full h-2 rounded-full bg-base-100">
			<div style="width: {book.progress}%" class="h-full bg-accent rounded-full" />
		</div>
	</section>
</div>
