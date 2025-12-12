<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import Board from '$lib/components/kanban/Board.svelte';

	let id = $derived($page.params.id || '');

	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			await kanbanStore.init();

			// Check if board exists
			if (id) {
				const board = kanbanStore.getBoardById(id);
				if (!board) {
					error = 'Tableau introuvable';
				}
			} else {
				error = 'ID de tableau manquant';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur lors du chargement';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Kanban Board - NPaulusWebsite</title>
	<meta
		name="description"
		content="Tableau Kanban collaboratif avec drag & drop et gestion de projet"
	/>
</svelte:head>

{#if loading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
	</div>
{:else if error}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="text-6xl mb-4">❌</div>
			<h3 class="text-xl font-semibold mb-2">Erreur</h3>
			<p class="text-muted-foreground mb-6">{error}</p>
			<a
				href="/kanban"
				class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Retour aux tableaux
			</a>
		</div>
	</div>
{:else}
	<Board boardId={id} />
{/if}
