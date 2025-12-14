<script lang="ts">
	import { onMount } from 'svelte';
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import type { Board } from '$lib/types/kanban';
	import BoardCard from '$lib/components/kanban/BoardCard.svelte';
	import Button from '$lib/components/ui/button.svelte';

	let boards = $state<Board[]>([]);
	let loading = $state(true);
	let showCreateModal = $state(false);

	onMount(() => {
		kanbanStore.initializeBoards();
		boards = kanbanStore.get().boards;
		loading = false;
	});

	// Create board
	async function handleCreateBoard(formData: FormData) {
		const success = await kanbanStore.createBoard({
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			isPublic: formData.get('isPublic') === 'on'
		});

		if (success) {
			showCreateModal = false;
			boards = kanbanStore.get().boards;
		}
	}
</script>

<svelte:head>
	<title>Kanban Boards - NPaulusWebsite</title>
	<meta
		name="description"
		content="Système de gestion de projet Kanban avec drag & drop et collaboration en temps réel"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1
					class="text-4xl font-bold mb-2 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
				>
					📋 Kanban Boards
				</h1>
				<p class="text-lg text-muted-foreground">
					Gérez vos projets avec des tableaux Kanban collaboratifs
				</p>
			</div>
			<Button onclick={() => (showCreateModal = true)} class="flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Nouveau tableau
			</Button>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else if boards.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="text-6xl mb-4">📋</div>
				<h3 class="text-xl font-semibold mb-2">Aucun tableau Kanban</h3>
				<p class="text-muted-foreground mb-6">
					Créez votre premier tableau pour commencer à organiser vos projets
				</p>
				<Button onclick={() => (showCreateModal = true)} variant="outline">Créer un tableau</Button>
			</div>
		{:else}
			<!-- Boards Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each boards as board (board.id)}
					<BoardCard {board} />
				{/each}

				<!-- Create New Board Card -->
				<button
					type="button"
					class="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center min-h-[200px] hover:border-primary/50 transition-colors cursor-pointer w-full text-left"
					onclick={() => (showCreateModal = true)}
				>
					<div class="text-center">
						<svg
							class="w-12 h-12 mx-auto mb-3 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<p class="text-muted-foreground">Créer un nouveau tableau</p>
					</div>
				</button>
			</div>
		{/if}
	</div>
</div>

<!-- Create Board Modal -->
{#if showCreateModal}
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="bg-background border border-border rounded-lg p-6 w-full max-w-md" role="document">
			<div class="flex items-center justify-between mb-4">
				<h2 id="modal-title" class="text-xl font-semibold">Créer un nouveau tableau</h2>
				<button
					onclick={() => (showCreateModal = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Fermer la fenêtre de création de tableau"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleCreateBoard(new FormData(e.target as HTMLFormElement));
				}}
				class="space-y-4"
			>
				<div>
					<label for="title" class="block text-sm font-medium mb-1">Titre</label>
					<input
						id="title"
						name="title"
						type="text"
						required
						placeholder="Mon projet Kanban"
						class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium mb-1">Description</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						placeholder="Description du projet..."
						class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
					></textarea>
				</div>

				<div>
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" name="isPublic" class="rounded border-border" />
						<span class="text-sm">Rendre ce tableau public</span>
					</label>
				</div>

				<div class="flex gap-3 pt-4">
					<Button
						type="button"
						variant="outline"
						onclick={() => (showCreateModal = false)}
						class="flex-1"
					>
						Annuler
					</Button>
					<Button type="submit" class="flex-1">Créer</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
