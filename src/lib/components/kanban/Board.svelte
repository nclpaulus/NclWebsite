<script lang="ts">
	import { onMount } from 'svelte';
	import { setContext } from 'svelte';
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import { goto } from '$app/navigation';
	import type { Board, Column as ColumnType, Card } from '$lib/types/kanban';
	import Column from './Column.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	/**
	 * Board (vue principale d'un tableau Kanban).
	 *
	 * - Charge l'état via `kanbanStore` (in-memory/mock dans l'implémentation actuelle).
	 * - Gère les filtres UI (recherche / labels / assignation / échéance).
	 */
	interface Props {
		boardId: string;
	}

	let { boardId }: Props = $props();

	let board = $state<Board | null>(null);
	let columns = $state<ColumnType[]>([]);
	let cards = $state<Card[]>([]);
	let filteredCards = $state<Card[]>([]);
	let loading = $state(true);
	let showCreateColumnForm = $state(false);
	let newColumnTitle = $state('');
	let createColumnInput = $state<HTMLInputElement>();
	let showBoardSettings = $state(false);
	let showFilters = $state(false);
	let searchQuery = $state('');
	let selectedLabels = $state<string[]>([]);
	let selectedUsers = $state<string[]>([]);
	let selectedDueDate = $state<string>('');
	let boardSettingsDialog = $state<HTMLDialogElement>();
	let boardSettingsTitleInput = $state<HTMLInputElement>();
	let boardSettingsOpener = $state<HTMLElement | null>(null);
	let a11yAnnouncement = $state('');
	let announceTimeout: ReturnType<typeof setTimeout> | undefined;

	function announce(message: string) {
		if (announceTimeout) clearTimeout(announceTimeout);
		a11yAnnouncement = '';
		announceTimeout = setTimeout(() => {
			a11yAnnouncement = message;
		}, 10);
	}

	setContext('kanban-announce', announce);

	// Reactive derived state
	const boardCards = $derived(filteredCards.filter((card) => card.boardId === boardId));
	const boardColumns = $derived(
		columns.filter((column) => column.boardId === boardId).sort((a, b) => a.position - b.position)
	);

	// Apply filters when filter state changes with debouncing
	$effect(() => {
		if (
			searchQuery !== undefined ||
			selectedLabels !== undefined ||
			selectedUsers !== undefined ||
			selectedDueDate !== undefined
		) {
			applyFilters();
		}
	});

	// Focus input when create column form is shown
	$effect(() => {
		if (showCreateColumnForm && createColumnInput) {
			createColumnInput.focus();
		}
	});

	let filterTimeout: ReturnType<typeof setTimeout>;

	function applyFilters() {
		// Clear existing timeout
		if (filterTimeout) {
			clearTimeout(filterTimeout);
		}

		// Debounce filter application
		filterTimeout = setTimeout(() => {
			const filters = {
				search: searchQuery || undefined,
				labels: selectedLabels.length > 0 ? selectedLabels : undefined,
				assignedTo: selectedUsers.length > 0 ? selectedUsers : undefined,
				dueDate: selectedDueDate as 'overdue' | 'today' | 'week' | 'month' | 'none' | undefined
			};

			kanbanStore.filterCards(filters);
			filteredCards = kanbanStore.getFilteredCards();
		}, 100);
	}

	function clearFilters() {
		searchQuery = '';
		selectedLabels = [];
		selectedUsers = [];
		selectedDueDate = '';
		kanbanStore.filterCards({});
		filteredCards = cards;
	}

	onMount(async () => {
		await loadBoard();
	});

	async function loadBoard() {
		loading = true;
		kanbanStore.setCurrentBoard(boardId);

		const state = kanbanStore.get();
		board = state.currentBoard;
		columns = state.columns;
		cards = state.cards;
		filteredCards = cards; // Initialize filtered cards
		loading = false;
	}

	async function handleCreateColumn() {
		if (!newColumnTitle.trim() || !board) return;

		const success = await kanbanStore.createColumn(board.id, {
			title: newColumnTitle.trim()
		});

		if (success) {
			newColumnTitle = '';
			showCreateColumnForm = false;
			await loadBoard(); // Refresh the board
		}
	}

	async function handleUpdateBoard(formData: FormData) {
		if (!board) return;

		const success = await kanbanStore.updateBoard(board.id, {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			isPublic: formData.get('isPublic') === 'on'
		});

		if (success) {
			showBoardSettings = false;
			await loadBoard();
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showCreateColumnForm = false;
			newColumnTitle = '';
		}
	}

	function getFocusableElements(container: HTMLElement) {
		const selector =
			'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
			(el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
		);
	}

	function trapDialogTab(event: KeyboardEvent, dialog: HTMLDialogElement) {
		if (event.key !== 'Tab') return;

		const focusables = getFocusableElements(dialog);
		if (focusables.length === 0) return;

		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (event.shiftKey) {
			if (!active || active === first) {
				event.preventDefault();
				last.focus();
			}
		} else {
			if (active === last) {
				event.preventDefault();
				first.focus();
			}
		}
	}

	function openBoardSettings() {
		boardSettingsOpener = document.activeElement as HTMLElement | null;
		showBoardSettings = true;
	}

	function closeBoardSettings() {
		showBoardSettings = false;
		if (boardSettingsDialog?.open) {
			boardSettingsDialog.close();
		}
		boardSettingsOpener?.focus();
		boardSettingsOpener = null;
	}

	$effect(() => {
		if (!boardSettingsDialog) return;

		if (showBoardSettings) {
			if (!boardSettingsDialog.open) {
				boardSettingsDialog.showModal();
			}
			boardSettingsTitleInput?.focus();
		} else {
			if (boardSettingsDialog.open) {
				boardSettingsDialog.close();
			}
		}
	});

	function getBoardStats() {
		if (!board) return null;

		const totalCards = boardCards.length;
		const completedCards = boardCards.filter((card) => {
			const column = boardColumns.find((col) => col.id === card.columnId);
			return (
				column?.title.toLowerCase().includes('terminé') ||
				column?.title.toLowerCase().includes('done')
			);
		}).length;

		const overdueCards = boardCards.filter((card) => {
			if (!card.dueDate) return false;
			const today = new Date();
			const diffDays = Math.ceil(
				(card.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
			);
			return diffDays < 0;
		}).length;

		return { totalCards, completedCards, overdueCards };
	}

	const stats = $derived(getBoardStats());
</script>

<div class="sr-only" aria-live="polite" aria-atomic="true">{a11yAnnouncement}</div>

<div class="min-h-screen bg-background">
	{#if loading}
		<div class="flex items-center justify-center py-20">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else if !board}
		<div class="flex items-center justify-center py-20">
			<div class="text-center">
				<div class="text-6xl mb-4">📋</div>
				<h3 class="text-xl font-semibold mb-2">Tableau introuvable</h3>
				<p class="text-muted-foreground mb-6">Ce tableau n'existe pas ou vous n'y avez pas accès</p>
				<Button onclick={() => goto('/kanban')}>Retour aux tableaux</Button>
			</div>
		</div>
	{:else}
		<!-- Board Header -->
		<div
			class="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10"
		>
			<div class="container mx-auto px-4 py-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							onclick={() => goto('/kanban')}
							class="flex items-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Retour
						</Button>

						<div>
							<h1 class="text-2xl font-bold flex items-center gap-2">
								{board.title}
								{#if board.isPublic}
									<Badge variant="secondary" class="text-xs">
										<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Public
									</Badge>
								{/if}
							</h1>
							{#if board.description}
								<p class="text-muted-foreground">{board.description}</p>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-3">
						<!-- Filter Button -->
						<Button
							variant="outline"
							size="sm"
							onclick={() => (showFilters = !showFilters)}
							class="flex items-center gap-2"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
								/>
							</svg>
							Filtres
							{#if searchQuery || selectedLabels.length > 0 || selectedUsers.length > 0 || selectedDueDate}
								<Badge variant="secondary" class="text-xs">
									{[
										searchQuery ? 1 : 0,
										selectedLabels.length,
										selectedUsers.length,
										selectedDueDate ? 1 : 0
									].reduce((a, b) => a + b, 0)}
								</Badge>
							{/if}
						</Button>

						<!-- Stats -->
						{#if stats}
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								<div class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
										/>
									</svg>
									{stats.totalCards} cartes
								</div>
								{#if stats.completedCards > 0}
									<div class="flex items-center gap-1 text-green-600">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{stats.completedCards} terminées
									</div>
								{/if}
								{#if stats.overdueCards > 0}
									<div class="flex items-center gap-1 text-red-600">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{stats.overdueCards} en retard
									</div>
								{/if}
							</div>
						{/if}

						<!-- Members -->
						<div class="flex items-center gap-2">
							<span class="text-sm text-muted-foreground">Membres:</span>
							<div class="flex -space-x-2">
								{#each board.members.slice(0, 5) as member (member.id)}
									<img
										src={member.avatar ||
											`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
										alt={member.name}
										title={member.name}
										class="w-6 h-6 rounded-full border-2 border-background"
									/>
								{/each}
								{#if board.members.length > 5}
									<div
										class="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium"
										title="Plus de membres"
									>
										+{board.members.length - 5}
									</div>
								{/if}
							</div>
						</div>

						<!-- Actions -->
						<Button variant="outline" onclick={openBoardSettings}>
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							Paramètres
						</Button>
					</div>
				</div>

				<!-- Filters Panel -->
				{#if showFilters}
					<div class="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
						<div class="flex items-center justify-between mb-4">
							<h3 class="font-medium">Filtres</h3>
							<div class="flex gap-2">
								<Button variant="ghost" size="sm" onclick={clearFilters}>Effacer tout</Button>
								<button
									onclick={() => (showFilters = false)}
									class="text-muted-foreground hover:text-foreground transition-colors"
									aria-label="Fermer les filtres"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<!-- Search -->
							<div>
								<label for="search" class="block text-sm font-medium mb-1">Recherche</label>
								<input
									id="search"
									type="text"
									placeholder="Rechercher dans les cartes..."
									bind:value={searchQuery}
									class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<!-- Labels -->
							<div>
								<label for="labels" class="block text-sm font-medium mb-1">Étiquettes</label>
								<select
									id="labels"
									bind:value={selectedLabels}
									multiple
									class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
								>
									{#each kanbanStore.get().labels as label (label.id)}
										<option value={label.id}>{label.name}</option>
									{/each}
								</select>
							</div>

							<!-- Users -->
							<div>
								<label for="users" class="block text-sm font-medium mb-1">Assigné à</label>
								<select
									id="users"
									bind:value={selectedUsers}
									multiple
									class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
								>
									{#each kanbanStore.get().users as user (user.id)}
										<option value={user.id}>{user.name}</option>
									{/each}
								</select>
							</div>

							<!-- Due Date -->
							<div>
								<label for="dueDate" class="block text-sm font-medium mb-1">Date d'échéance</label>
								<select
									id="dueDate"
									bind:value={selectedDueDate}
									class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
								>
									<option value="">Toutes</option>
									<option value="overdue">En retard</option>
									<option value="today">Aujourd'hui</option>
									<option value="week">Cette semaine</option>
									<option value="month">Ce mois</option>
									<option value="none">Sans date</option>
								</select>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Board Content -->
	<div class="container mx-auto px-4 py-6">
		<!-- Columns Container -->
		<div class="flex gap-4 overflow-x-auto pb-6">
			{#each boardColumns as column (column.id)}
				<Column {column} cards={boardCards} />
			{/each}

			<!-- Add Column -->
			{#if showCreateColumnForm}
				<div class="bg-background border border-border rounded-lg p-4 min-w-[300px] max-w-[300px]">
					<input
						bind:value={newColumnTitle}
						bind:this={createColumnInput}
						type="text"
						placeholder="Saisir un titre de colonne..."
						class="w-full text-sm border-none outline-none bg-transparent mb-3"
						onkeypress={handleKeyPress}
					/>
					<div class="flex gap-2">
						<Button size="sm" onclick={handleCreateColumn} disabled={!newColumnTitle.trim()}>
							Ajouter
						</Button>
						<Button variant="ghost" size="sm" onclick={() => (showCreateColumnForm = false)}>
							Annuler
						</Button>
					</div>
				</div>
			{:else}
				<button
					onclick={() => (showCreateColumnForm = true)}
					class="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 min-w-[300px] max-w-[300px] text-left text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 border-2 border-dashed border-border"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Ajouter une colonne
				</button>
			{/if}
		</div>
	</div>
</div>

<!-- Board Settings Modal -->
{#if board}
	<dialog
		bind:this={boardSettingsDialog}
		class="bg-background border border-border rounded-lg max-w-md w-full p-0"
		aria-labelledby="board-settings-title"
		oncancel={(e) => {
			e.preventDefault();
			closeBoardSettings();
		}}
		onclick={(e) => {
			if (e.target === boardSettingsDialog) closeBoardSettings();
		}}
		onkeydown={(e) => {
			if (boardSettingsDialog) trapDialogTab(e, boardSettingsDialog);
		}}
	>
		<div class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 id="board-settings-title" class="text-xl font-semibold">Paramètres du tableau</h2>
				<button
					onclick={closeBoardSettings}
					class="text-muted-foreground hover:text-foreground transition-colors"
					aria-label="Fermer les paramètres du tableau"
					type="button"
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
					handleUpdateBoard(new FormData(e.target as HTMLFormElement));
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
						bind:this={boardSettingsTitleInput}
						bind:value={board.title}
						class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium mb-1">Description</label>
					<textarea
						id="description"
						name="description"
						rows="3"
						bind:value={board.description}
						placeholder="Description du projet..."
						class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
					></textarea>
				</div>

				<div>
					<label class="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							name="isPublic"
							checked={board.isPublic}
							class="rounded border-border"
						/>
						<span class="text-sm">Rendre ce tableau public</span>
					</label>
				</div>

				<div class="flex gap-3 pt-4">
					<Button type="button" variant="outline" onclick={closeBoardSettings} class="flex-1">
						Annuler
					</Button>
					<Button type="submit" class="flex-1">Enregistrer</Button>
				</div>
			</form>
		</div>
	</dialog>
{/if}
