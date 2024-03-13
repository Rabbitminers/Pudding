<main class="flex flex-col h-full overflow-hidden">
	<header class="p-6 pt-12 shadow-lg flex flex-row justify-between bg-neutral">
		<h1 class="text-xl font-bold text-center"><slot name="title" /></h1>

		<section class="flex flex-row justify-end gap-4">
			<slot name="actions" />
		</section>
	</header>

	<article id="body" class="flex-grow overflow-scroll p-4 flex flex-col gap-4">
		<slot />
	</article>
</main>
