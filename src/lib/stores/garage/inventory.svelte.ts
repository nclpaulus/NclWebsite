import { writable, get as getStoreValue } from 'svelte/store';
import type { Part, PartUsage, InventoryFilters, CreatePartRequest } from '$lib/types/garage';

interface InventoryState {
	parts: Part[];
	partUsages: PartUsage[];
	loading: boolean;
	error: string | null;
	filters: InventoryFilters;
	searchTerm: string;
}

const initialState: InventoryState = {
	parts: [],
	partUsages: [],
	loading: false,
	error: null,
	filters: {},
	searchTerm: ''
};

// Mock data for demonstration
const mockParts: Part[] = [
	{
		id: '1',
		name: 'Huile moteur 5W-30',
		reference: 'OIL5W30-001',
		category: 'Lubrifiants',
		brand: 'Castrol',
		price: 12.5,
		stockQuantity: 25,
		minStockLevel: 10,
		supplier: 'AutoParts Pro',
		description: 'Huile synthétique pour moteurs essence et diesel',
		imageUrl: '/images/oil-5w30.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	},
	{
		id: '2',
		name: 'Filtre à huile',
		reference: 'FILTER-OIL-002',
		category: 'Filtres',
		brand: 'Bosch',
		price: 8.75,
		stockQuantity: 8,
		minStockLevel: 15,
		supplier: 'AutoParts Pro',
		description: 'Filtre à huile standard pour véhicules européens',
		imageUrl: '/images/oil-filter.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	},
	{
		id: '3',
		name: 'Plaquettes de frein avant',
		reference: 'BRAKE-PAD-003',
		category: 'Freinage',
		brand: 'Brembo',
		price: 45.0,
		stockQuantity: 12,
		minStockLevel: 8,
		supplier: 'Brembo Belgium',
		description: 'Plaquettes de frein céramique pour freins à disque',
		imageUrl: '/images/brake-pads.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	},
	{
		id: '4',
		name: 'Batterie 12V 60Ah',
		reference: 'BATTERY-12V-004',
		category: 'Électricité',
		brand: 'Varta',
		price: 89.99,
		stockQuantity: 3,
		minStockLevel: 5,
		supplier: 'Varta Distribution',
		description: 'Batterie automobile 12V 60Ah avec garantie 3 ans',
		imageUrl: '/images/car-battery.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	},
	{
		id: '5',
		name: 'Ampoule phare H7',
		reference: 'BULB-H7-005',
		category: 'Éclairage',
		brand: 'Philips',
		price: 15.25,
		stockQuantity: 50,
		minStockLevel: 20,
		supplier: 'Philips Auto',
		description: 'Ampoule halogène H7 pour phares avant',
		imageUrl: '/images/headlight-bulb.jpg',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	}
];

const mockPartUsages: PartUsage[] = [
	{
		id: '1',
		partId: '1',
		appointmentId: '1',
		quantity: 1,
		unitPrice: 12.5,
		totalPrice: 12.5,
		usedAt: new Date('2024-12-10')
	},
	{
		id: '2',
		partId: '2',
		appointmentId: '1',
		quantity: 1,
		unitPrice: 8.75,
		totalPrice: 8.75,
		usedAt: new Date('2024-12-10')
	},
	{
		id: '3',
		partId: '3',
		appointmentId: '2',
		quantity: 2,
		unitPrice: 45.0,
		totalPrice: 90.0,
		usedAt: new Date('2024-12-11')
	}
];

function createInventoryStore() {
	const { subscribe, update } = writable<InventoryState>(initialState);

	// Initialize with mock data
	function initializeInventory() {
		update((state) => ({
			...state,
			parts: mockParts,
			partUsages: mockPartUsages,
			loading: false
		}));
	}

	// Create new part
	async function createPart(request: CreatePartRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const newPart: Part = {
				id: Date.now().toString(),
				...request,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			update((state) => ({
				...state,
				parts: [...state.parts, newPart],
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création de la pièce',
				loading: false
			}));
			return false;
		}
	}

	// Update part
	async function updatePart(id: string, updates: Partial<Part>): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				parts: state.parts.map((part) =>
					part.id === id ? { ...part, ...updates, updatedAt: new Date() } : part
				),
				loading: false
			}));
			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
				loading: false
			}));
			return false;
		}
	}

	// Delete part
	async function deletePart(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				parts: state.parts.filter((part) => part.id !== id),
				loading: false
			}));
			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
				loading: false
			}));
			return false;
		}
	}

	// Update stock quantity
	async function updateStock(
		id: string,
		quantity: number,
		operation: 'add' | 'subtract' | 'set'
	): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				parts: state.parts.map((part) => {
					if (part.id === id) {
						const newQuantity =
							operation === 'add'
								? part.stockQuantity + quantity
								: operation === 'subtract'
									? Math.max(0, part.stockQuantity - quantity)
									: quantity;

						return { ...part, stockQuantity: newQuantity, updatedAt: new Date() };
					}
					return part;
				}),
				loading: false
			}));
			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du stock',
				loading: false
			}));
			return false;
		}
	}

	// Record part usage
	async function recordPartUsage(
		partId: string,
		appointmentId: string,
		quantity: number
	): Promise<boolean> {
		update((currentState) => ({ ...currentState, loading: true, error: null }));

		try {
			const currentState = getStoreValue(inventoryStore);
			const part = currentState.parts.find((p: Part) => p.id === partId);
			if (!part) {
				throw new Error('Pièce non trouvée');
			}

			// Check stock availability
			if (part.stockQuantity < quantity) {
				throw new Error('Stock insuffisant');
			}

			const usage: PartUsage = {
				id: Date.now().toString(),
				partId,
				appointmentId,
				quantity,
				unitPrice: part.price,
				totalPrice: part.price * quantity,
				usedAt: new Date()
			};

			update((currentState) => ({
				...currentState,
				partUsages: [...currentState.partUsages, usage],
				parts: currentState.parts.map((part: Part) =>
					part.id === partId
						? { ...part, stockQuantity: part.stockQuantity - quantity, updatedAt: new Date() }
						: part
				),
				loading: false
			}));

			return true;
		} catch (error) {
			update((currentState) => ({
				...currentState,
				error:
					error instanceof Error
						? error.message
						: "Erreur lors de l'enregistrement de l'utilisation",
				loading: false
			}));
			return false;
		}
	}

	// Filter parts
	function filterParts(filters: InventoryFilters) {
		update((state) => ({ ...state, filters }));
	}

	// Search parts
	function searchParts(term: string) {
		update((state) => ({ ...state, searchTerm: term }));
	}

	// Get filtered parts
	function getFilteredParts(): Part[] {
		const state = getStoreValue(inventoryStore);
		let filtered = [...state.parts];

		// Apply search
		if (state.searchTerm) {
			const searchLower = state.searchTerm.toLowerCase();
			filtered = filtered.filter(
				(part) =>
					part.name.toLowerCase().includes(searchLower) ||
					part.reference.toLowerCase().includes(searchLower) ||
					part.brand.toLowerCase().includes(searchLower) ||
					part.category.toLowerCase().includes(searchLower)
			);
		}

		// Apply filters
		if (state.filters.category) {
			filtered = filtered.filter((part) => part.category === state.filters.category);
		}

		if (state.filters.brand) {
			filtered = filtered.filter((part) => part.brand === state.filters.brand);
		}

		if (state.filters.lowStock) {
			filtered = filtered.filter((part) => part.stockQuantity <= part.minStockLevel);
		}

		return filtered.sort((a, b) => a.name.localeCompare(b.name));
	}

	// Get parts with low stock
	function getLowStockParts(): Part[] {
		const state = getStoreValue(inventoryStore);
		return state.parts.filter((part) => part.stockQuantity <= part.minStockLevel);
	}

	// Get part by ID
	function getPartById(id: string): Part | undefined {
		const state = getStoreValue(inventoryStore);
		return state.parts.find((part) => part.id === id);
	}

	// Get part usages for appointment
	function getPartUsagesForAppointment(appointmentId: string): PartUsage[] {
		const state = getStoreValue(inventoryStore);
		return state.partUsages.filter((usage) => usage.appointmentId === appointmentId);
	}

	// Get categories
	function getCategories(): string[] {
		const state = getStoreValue(inventoryStore);
		return [...new Set(state.parts.map((part) => part.category))].sort();
	}

	// Get brands
	function getBrands(): string[] {
		const state = getStoreValue(inventoryStore);
		return [...new Set(state.parts.map((part) => part.brand))].sort();
	}

	// Get inventory statistics
	function getInventoryStats() {
		const state = getStoreValue(inventoryStore);
		const totalParts = state.parts.length;
		const lowStockCount = getLowStockParts().length;
		const totalValue = state.parts.reduce((sum, part) => sum + part.price * part.stockQuantity, 0);
		const totalStockItems = state.parts.reduce((sum, part) => sum + part.stockQuantity, 0);

		return {
			totalParts,
			lowStockCount,
			totalValue,
			totalStockItems
		};
	}

	return {
		subscribe,
		initializeInventory,
		createPart,
		updatePart,
		deletePart,
		updateStock,
		recordPartUsage,
		filterParts,
		searchParts,
		getFilteredParts,
		getLowStockParts,
		getPartById,
		getPartUsagesForAppointment,
		getCategories,
		getBrands,
		getInventoryStats,
		get: () => getStoreValue(inventoryStore)
	};
}

export const inventoryStore = createInventoryStore();
