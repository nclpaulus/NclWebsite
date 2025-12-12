<script lang="ts">
	/** Page inventaire garage avec gestion des pièces, filtres et modals. */
	import { onMount } from 'svelte';
	import { inventoryStore } from '$lib/stores/garage/inventory.svelte';
	import { notificationStore } from '$lib/stores/garage/notifications.svelte';
	import type { Part, InventoryFilters } from '$lib/types/garage';

	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let selectedPart = $state<Part | null>(null);
	let searchTerm = $state('');
	let filters = $state<InventoryFilters>({});

	onMount(() => {
		inventoryStore.initializeInventory();
	});

	// Filter parts based on search and filters
	const filteredParts = $derived(inventoryStore.getFilteredParts());

	// Apply search
	$effect(() => {
		if (searchTerm) {
			inventoryStore.searchParts(searchTerm);
		}
	});

	// Get categories and brands
	const categories = $derived(inventoryStore.getCategories());
	const brands = $derived(inventoryStore.getBrands());

	// Get inventory stats
	const stats = $derived(inventoryStore.getInventoryStats());

	// Create part
	async function handleCreatePart(formData: FormData) {
		const success = await inventoryStore.createPart({
			name: formData.get('name') as string,
			reference: formData.get('reference') as string,
			category: formData.get('category') as string,
			brand: formData.get('brand') as string,
			price: parseFloat(formData.get('price') as string),
			stockQuantity: parseInt(formData.get('stockQuantity') as string),
			minStockLevel: parseInt(formData.get('minStockLevel') as string),
			supplier: formData.get('supplier') as string,
			description: formData.get('description') as string
		});

		if (success) {
			showCreateModal = false;
			// Check if we need to notify about low stock
			const newPart = inventoryStore.get().parts[inventoryStore.get().parts.length - 1];
			if (newPart && newPart.stockQuantity <= newPart.minStockLevel) {
				await notificationStore.notifyLowStock(
					'admin@autopro.be',
					newPart.name,
					newPart.reference,
					newPart.stockQuantity,
					newPart.minStockLevel
				);
			}
		}
	}

	// Update part
	async function handleUpdatePart(formData: FormData) {
		if (!selectedPart) return;

		const success = await inventoryStore.updatePart(selectedPart.id, {
			name: formData.get('name') as string,
			reference: formData.get('reference') as string,
			category: formData.get('category') as string,
			brand: formData.get('brand') as string,
			price: parseFloat(formData.get('price') as string),
			stockQuantity: parseInt(formData.get('stockQuantity') as string),
			minStockLevel: parseInt(formData.get('minStockLevel') as string),
			supplier: formData.get('supplier') as string,
			description: formData.get('description') as string
		});

		if (success) {
			showEditModal = false;
			selectedPart = null;
		}
	}

	// Update stock
	async function updateStock(partId: string, quantity: number, operation: 'add' | 'subtract') {
		const success = await inventoryStore.updateStock(partId, quantity, operation);

		if (success) {
			const part = inventoryStore.getPartById(partId);
			if (part && operation === 'subtract' && part.stockQuantity <= part.minStockLevel) {
				await notificationStore.notifyLowStock(
					'admin@autopro.be',
					part.name,
					part.reference,
					part.stockQuantity,
					part.minStockLevel
				);
			}
		}
	}

	// Delete part
	async function deletePart(id: string) {
		if (confirm('Êtes-vous sûr de vouloir supprimer cette pièce ?')) {
			await inventoryStore.deletePart(id);
		}
	}

	// Apply filters
	function applyFilters() {
		inventoryStore.filterParts(filters);
	}

	// Reset filters
	function resetFilters() {
		searchTerm = '';
		filters = {};
		inventoryStore.filterParts({});
	}

	// Get stock status color
	function getStockStatusColor(part: Part): string {
		if (part.stockQuantity === 0) return 'text-red-600 bg-red-50';
		if (part.stockQuantity <= part.minStockLevel) return 'text-yellow-600 bg-yellow-50';
		return 'text-green-600 bg-green-50';
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
	}
</script>

<svelte:head>
	<title>AutoPro Garage - Inventaire</title>
	<meta name="description" content="Gestion des stocks de pièces détachées" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground mb-2">📦 Inventaire</h1>
		<p class="text-muted-foreground">Gérer les stocks de pièces détachées et les fournisseurs</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Total pièces</p>
					<p class="text-2xl font-bold text-foreground">{stats.totalParts}</p>
				</div>
				<div class="text-2xl">🔧</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Stock faible</p>
					<p class="text-2xl font-bold text-destructive">{stats.lowStockCount}</p>
				</div>
				<div class="text-2xl">⚠️</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Valeur stock</p>
					<p class="text-2xl font-bold text-foreground">{formatCurrency(stats.totalValue)}</p>
				</div>
				<div class="text-2xl">💰</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Unités totales</p>
					<p class="text-2xl font-bold text-foreground">{stats.totalStockItems}</p>
				</div>
				<div class="text-2xl">📊</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
		<div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
			<div class="flex flex-col sm:flex-row gap-4 flex-1">
				<input
					type="text"
					bind:value={searchTerm}
					placeholder="Rechercher une pièce..."
					class="px-3 py-2 border border-border rounded-md bg-background flex-1"
				/>

				<select
					bind:value={filters.category}
					class="px-3 py-2 border border-border rounded-md bg-background"
				>
					<option value="">Toutes les catégories</option>
					{#each categories as category (category)}
						<option value={category}>{category}</option>
					{/each}
				</select>

				<select
					bind:value={filters.brand}
					class="px-3 py-2 border border-border rounded-md bg-background"
				>
					<option value="">Toutes les marques</option>
					{#each brands as brand (brand)}
						<option value={brand}>{brand}</option>
					{/each}
				</select>

				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={filters.lowStock} class="rounded border-border" />
					<span class="text-sm">Stock faible uniquement</span>
				</label>
			</div>

			<div class="flex gap-2">
				<button
					onclick={resetFilters}
					class="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
				>
					Réinitialiser
				</button>
				<button
					onclick={applyFilters}
					class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
				>
					Filtrer
				</button>
				<button
					onclick={() => (showCreateModal = true)}
					class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
				>
					+ Ajouter une pièce
				</button>
			</div>
		</div>
	</div>

	<!-- Parts Table -->
	<div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Pièce</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Référence</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Catégorie</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Marque</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Stock</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Prix</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Fournisseur</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="bg-background divide-y divide-border">
					{#each filteredParts as part (part.id)}
						<tr class="hover:bg-muted/50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div>
									<div class="text-sm font-medium text-foreground">{part.name}</div>
									{#if part.description}
										<div class="text-xs text-muted-foreground truncate max-w-[200px]">
											{part.description}
										</div>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{part.reference}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{part.category}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{part.brand}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center gap-2">
									<span class="px-2 py-1 text-xs rounded {getStockStatusColor(part)}">
										{part.stockQuantity}
									</span>
									<span class="text-xs text-muted-foreground">/ {part.minStockLevel}</span>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
								{formatCurrency(part.price)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{part.supplier}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm">
								<div class="flex items-center gap-1">
									<button
										onclick={() => updateStock(part.id, 1, 'add')}
										class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
										title="Ajouter 1 au stock"
									>
										+
									</button>
									<button
										onclick={() => updateStock(part.id, 1, 'subtract')}
										class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
										title="Retirer 1 du stock"
									>
										-
									</button>
									<button
										onclick={() => {
											selectedPart = part;
											showEditModal = true;
										}}
										class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
									>
										Modifier
									</button>
									<button
										onclick={() => deletePart(part.id)}
										class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
									>
										Supprimer
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if filteredParts.length === 0}
			<div class="text-center py-8 text-muted-foreground">Aucune pièce trouvée</div>
		{/if}
	</div>
</div>

<!-- Create Part Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div
			class="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-foreground">Ajouter une pièce</h2>
				<button
					onclick={() => (showCreateModal = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
				>
					✕
				</button>
			</div>

			<form
				onsubmit={(e: Event) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					handleCreatePart(formData);
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="partName" class="block text-sm font-medium text-foreground mb-1"
							>Nom de la pièce *</label
						>
						<input
							id="partName"
							type="text"
							name="name"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="partReference" class="block text-sm font-medium text-foreground mb-1"
							>Référence *</label
						>
						<input
							id="partReference"
							type="text"
							name="reference"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="partCategory" class="block text-sm font-medium text-foreground mb-1"
							>Catégorie *</label
						>
						<input
							id="partCategory"
							type="text"
							name="category"
							required
							placeholder="Ex: Moteur, Freinage, Électricité"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="partBrand" class="block text-sm font-medium text-foreground mb-1"
							>Marque *</label
						>
						<input
							id="partBrand"
							type="text"
							name="brand"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="partPrice" class="block text-sm font-medium text-foreground mb-1"
							>Prix unitaire (€) *</label
						>
						<input
							id="partPrice"
							type="number"
							name="price"
							required
							step="0.01"
							min="0"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="stockQuantity" class="block text-sm font-medium text-foreground mb-1"
							>Quantité en stock *</label
						>
						<input
							id="stockQuantity"
							type="number"
							name="stockQuantity"
							required
							min="0"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="minStockLevel" class="block text-sm font-medium text-foreground mb-1"
							>Stock minimum *</label
						>
						<input
							id="minStockLevel"
							type="number"
							name="minStockLevel"
							required
							min="0"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="partSupplier" class="block text-sm font-medium text-foreground mb-1"
							>Fournisseur *</label
						>
						<input
							id="partSupplier"
							type="text"
							name="supplier"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="partDescription" class="block text-sm font-medium text-foreground mb-1"
							>Description</label
						>
						<textarea
							id="partDescription"
							name="description"
							rows="3"
							placeholder="Description optionnelle de la pièce"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						></textarea>
					</div>
				</div>

				<div class="flex justify-end gap-3 mt-6">
					<button
						type="button"
						onclick={() => (showCreateModal = false)}
						class="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Ajouter la pièce
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Part Modal -->
{#if showEditModal && selectedPart}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div
			class="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-foreground">Modifier la pièce</h2>
				<button
					onclick={() => {
						showEditModal = false;
						selectedPart = null;
					}}
					class="text-muted-foreground hover:text-foreground transition-colors"
				>
					✕
				</button>
			</div>

			<form
				onsubmit={(e: Event) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					handleUpdatePart(formData);
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="editPartName" class="block text-sm font-medium text-foreground mb-1"
							>Nom de la pièce *</label
						>
						<input
							id="editPartName"
							type="text"
							name="name"
							required
							value={selectedPart?.name || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editPartReference" class="block text-sm font-medium text-foreground mb-1"
							>Référence *</label
						>
						<input
							id="editPartReference"
							type="text"
							name="reference"
							required
							value={selectedPart?.reference || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editPartCategory" class="block text-sm font-medium text-foreground mb-1"
							>Catégorie *</label
						>
						<input
							id="editPartCategory"
							type="text"
							name="category"
							required
							value={selectedPart?.category || ''}
							placeholder="Ex: Moteur, Freinage, Électricité"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editPartBrand" class="block text-sm font-medium text-foreground mb-1"
							>Marque *</label
						>
						<input
							id="editPartBrand"
							type="text"
							name="brand"
							required
							value={selectedPart?.brand || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editPartPrice" class="block text-sm font-medium text-foreground mb-1"
							>Prix unitaire (€) *</label
						>
						<input
							id="editPartPrice"
							type="number"
							name="price"
							required
							step="0.01"
							min="0"
							value={selectedPart?.price || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editStockQuantity" class="block text-sm font-medium text-foreground mb-1"
							>Quantité en stock *</label
						>
						<input
							id="editStockQuantity"
							type="number"
							name="stockQuantity"
							required
							min="0"
							value={selectedPart?.stockQuantity || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editMinStockLevel" class="block text-sm font-medium text-foreground mb-1"
							>Stock minimum *</label
						>
						<input
							id="editMinStockLevel"
							type="number"
							name="minStockLevel"
							required
							min="0"
							value={selectedPart?.minStockLevel || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="editPartSupplier" class="block text-sm font-medium text-foreground mb-1"
							>Fournisseur *</label
						>
						<input
							id="editPartSupplier"
							type="text"
							name="supplier"
							required
							value={selectedPart?.supplier || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="editPartDescription" class="block text-sm font-medium text-foreground mb-1"
							>Description</label
						>
						<textarea
							id="editPartDescription"
							name="description"
							rows="3"
							value={selectedPart?.description || ''}
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						></textarea>
					</div>
				</div>

				<div class="flex justify-end gap-3 mt-6">
					<button
						type="button"
						onclick={() => {
							showEditModal = false;
							selectedPart = null;
						}}
						class="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
					>
						Annuler
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Modifier la pièce
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
