<script lang="ts">
	import Layout from '$lib/components/Layout.svelte';
	import Home from '$lib/components/icons/Home.svelte';
</script>

<Layout>
	<svelte:fragment slot="title">Settings</svelte:fragment>

	<svelte:fragment slot="actions">
		<a href="/"><Home /></a>
	</svelte:fragment>

	<article class="grid grid-cols-2 gap-4">Settings!</article>
</Layout>
