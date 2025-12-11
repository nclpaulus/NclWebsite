<script lang="ts">
	import { kanbanStore } from '$lib/stores/kanban.svelte';
	import type { Card } from '$lib/types/kanban';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	interface Props {
		card: Card;
		draggable?: boolean;
	}

	let { card, draggable = true }: Props = $props();

	let isDragging = $state(false);
	let showCardModal = $state(false);

	function handleDragStart(event: DragEvent) {
		if (!draggable) return;

		isDragging = true;
		event.dataTransfer?.setData('text/plain', card.id);
		event.dataTransfer?.setData('cardId', card.id);
		event.dataTransfer?.setData('sourceColumnId', card.columnId);

		// Add visual feedback
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}

		// Add drag class to element
		const target = event.target as HTMLElement;
		target.classList.add('opacity-50');
	}

	function handleDragEnd(event: DragEvent) {
		isDragging = false;
		const target = event.target as HTMLElement;
		target.classList.remove('opacity-50');
	}

	function openCardModal() {
		showCardModal = true;
	}

	function getDueDateStatus(dueDate?: Date) {
		if (!dueDate) return null;

		const today = new Date();
		const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays < 0) return { status: 'overdue', color: 'text-destructive', text: 'En retard' };
		if (diffDays === 0) return { status: 'today', color: 'text-orange-600', text: "Aujourd'hui" };
		if (diffDays <= 3) return { status: 'soon', color: 'text-yellow-600', text: 'Bientôt' };
		return { status: 'normal', color: 'text-muted-foreground', text: '' };
	}

	const dueDateStatus = $derived(getDueDateStatus(card.dueDate));
</script>

<button
	type="button"
	class="bg-background border border-border rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all text-left w-full {isDragging
		? 'opacity-50'
		: ''}"
	{draggable}
	ondragstart={handleDragStart}
	ondragend={handleDragEnd}
	onclick={openCardModal}
>
	<!-- Labels -->
	{#if card.labels.length > 0}
		<div class="flex flex-wrap gap-1 mb-3">
			{#each card.labels as label (label.id)}
				<Badge
					variant="secondary"
					class="text-xs px-2 py-0.5"
					style="background-color: {label.color}20; color: {label.color}; border-color: {label.color}40"
				>
					{label.name}
				</Badge>
			{/each}
		</div>
	{/if}

	<!-- Title -->
	<h4 class="font-medium text-sm mb-2 leading-tight">{card.title}</h4>

	<!-- Description -->
	{#if card.description}
		<p class="text-xs text-muted-foreground mb-3 line-clamp-2">{card.description}</p>
	{/if}

	<!-- Bottom Section -->
	<div class="flex items-center justify-between">
		<!-- Due Date -->
		{#if card.dueDate && dueDateStatus}
			<div class="flex items-center gap-1 text-xs {dueDateStatus.color}">
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				{card.dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
				{#if dueDateStatus.text}
					<span class="ml-1">({dueDateStatus.text})</span>
				{/if}
			</div>
		{:else}
			<div></div>
		{/if}

		<!-- Assigned Users & Comments -->
		<div class="flex items-center gap-2">
			<!-- Comments Count -->
			{#if card.comments.length > 0}
				<div class="flex items-center gap-1 text-xs text-muted-foreground">
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
					{card.comments.length}
				</div>
			{/if}

			<!-- Attachments Count -->
			{#if card.attachments.length > 0}
				<div class="flex items-center gap-1 text-xs text-muted-foreground">
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
						/>
					</svg>
					{card.attachments.length}
				</div>
			{/if}

			<!-- Assigned Users -->
			{#if card.assignedUsers.length > 0}
				<div class="flex -space-x-1">
					{#each card.assignedUsers.slice(0, 3) as user (user.id)}
						<img
							src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
							alt={user.name}
							title={user.name}
							class="w-5 h-5 rounded-full border border-background"
						/>
					{/each}
					{#if card.assignedUsers.length > 3}
						<div
							class="w-5 h-5 rounded-full border border-background bg-muted flex items-center justify-center text-[10px] font-medium"
							title="Plus d'utilisateurs"
						>
							+{card.assignedUsers.length - 3}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</button>

<!-- Card Modal -->
{#if showCardModal}
	<div class="fixed inset-0 flex items-center justify-center z-50 p-4">
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/50"
			onclick={() => (showCardModal = false)}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					e.preventDefault();
					showCardModal = false;
				}
			}}
			role="button"
			tabindex="0"
			aria-label="Fermer la modal"
		></div>

		<!-- Modal Content -->
		<div
			class="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10"
		>
			<div class="sticky top-0 bg-background border-b border-border p-6">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<h2 class="text-xl font-semibold mb-2">{card.title}</h2>
						<div class="flex items-center gap-2 text-sm text-muted-foreground">
							<span>Dans la colonne</span>
							<Badge variant="outline" class="text-xs">
								{kanbanStore.getColumnById(card.columnId)?.title}
							</Badge>
						</div>
					</div>
					<button
						onclick={() => (showCardModal = false)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								showCardModal = false;
							}
						}}
						class="text-muted-foreground hover:text-foreground transition-colors"
						type="button"
						aria-label="Fermer la modal"
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
			</div>

			<div class="p-6 space-y-6">
				<!-- Description -->
				{#if card.description}
					<div>
						<h3 class="font-medium mb-2">Description</h3>
						<p class="text-sm text-muted-foreground whitespace-pre-wrap">{card.description}</p>
					</div>
				{/if}

				<!-- Labels -->
				{#if card.labels.length > 0}
					<div>
						<h3 class="font-medium mb-2">Étiquettes</h3>
						<div class="flex flex-wrap gap-2">
							{#each card.labels as label (label.id)}
								<Badge
									variant="secondary"
									style="background-color: {label.color}20; color: {label.color}; border-color: {label.color}40"
								>
									{label.name}
								</Badge>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Due Date -->
				{#if card.dueDate}
					<div>
						<h3 class="font-medium mb-2">Date d'échéance</h3>
						<div class="flex items-center gap-2 text-sm">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span class={dueDateStatus?.color}>
								{card.dueDate.toLocaleDateString('fr-FR', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</span>
							{#if dueDateStatus?.text}
								<Badge variant="outline" class="text-xs">
									{dueDateStatus.text}
								</Badge>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Assigned Users -->
				{#if card.assignedUsers.length > 0}
					<div>
						<h3 class="font-medium mb-2">Assigné à</h3>
						<div class="space-y-2">
							{#each card.assignedUsers as user (user.id)}
								<div class="flex items-center gap-3">
									<img
										src={user.avatar ||
											`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
										alt={user.name}
										class="w-8 h-8 rounded-full"
									/>
									<div>
										<div class="font-medium text-sm">{user.name}</div>
										<div class="text-xs text-muted-foreground">{user.email}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Comments -->
				{#if card.comments.length > 0}
					<div>
						<h3 class="font-medium mb-2">Commentaires ({card.comments.length})</h3>
						<div class="space-y-3">
							{#each card.comments as comment (comment.id)}
								<div class="border border-border rounded-lg p-3">
									<div class="flex items-start gap-3">
										<img
											src={kanbanStore.getUserById(comment.userId)?.avatar ||
												`https://api.dicebear.com/7.x/avataaars/svg?seed=${kanbanStore.getUserById(comment.userId)?.name}`}
											alt={kanbanStore.getUserById(comment.userId)?.name}
											class="w-6 h-6 rounded-full"
										/>
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-1">
												<span class="font-medium text-sm"
													>{kanbanStore.getUserById(comment.userId)?.name}</span
												>
												<span class="text-xs text-muted-foreground">
													{comment.createdAt.toLocaleDateString('fr-FR')} à {comment.createdAt.toLocaleTimeString(
														'fr-FR',
														{ hour: '2-digit', minute: '2-digit' }
													)}
												</span>
											</div>
											<p class="text-sm">{comment.content}</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Attachments -->
				{#if card.attachments.length > 0}
					<div>
						<h3 class="font-medium mb-2">Pièces jointes ({card.attachments.length})</h3>
						<div class="space-y-2">
							{#each card.attachments as attachment (attachment.id)}
								<div class="flex items-center gap-3 p-3 border border-border rounded-lg">
									<svg
										class="w-8 h-8 text-muted-foreground"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<div class="flex-1">
										<div class="font-medium text-sm">{attachment.name}</div>
										{#if attachment.size}
											<div class="text-xs text-muted-foreground">
												{(attachment.size / 1024).toFixed(1)} KB
											</div>
										{/if}
									</div>
									<a
										href={attachment.url}
										target="_blank"
										class="text-primary hover:text-primary/80 text-sm"
									>
										Ouvrir
									</a>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Metadata -->
				<div class="pt-4 border-t border-border">
					<div class="text-xs text-muted-foreground space-y-1">
						<div>
							Créé par {kanbanStore.getUserById(card.createdBy)?.name} le {card.createdAt.toLocaleDateString(
								'fr-FR'
							)}
						</div>
						<div>Modifié le {card.updatedAt.toLocaleDateString('fr-FR')}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
