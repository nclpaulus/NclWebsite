import { writable, get as getStoreValue } from 'svelte/store';
import type { Invoice, CreateInvoiceRequest } from '$lib/types/garage';

interface BillingState {
	invoices: Invoice[];
	loading: boolean;
	error: string | null;
	selectedInvoiceId: string | null;
}

const initialState: BillingState = {
	invoices: [],
	loading: false,
	error: null,
	selectedInvoiceId: null
};

// Mock data for demonstration
const mockInvoices: Invoice[] = [
	{
		id: '1',
		appointmentId: '3',
		customerId: '1',
		invoiceNumber: 'INV-2024-001',
		issueDate: new Date('2024-12-10'),
		dueDate: new Date('2024-12-24'),
		status: 'paid',
		subtotal: 120.0,
		tax: 25.2,
		total: 145.2,
		parts: [
			{
				id: '1',
				description: 'Alternateur',
				quantity: 1,
				unitPrice: 100.0,
				totalPrice: 100.0,
				type: 'part'
			}
		],
		services: [
			{
				id: '1',
				description: 'Diagnostic électrique (1h)',
				quantity: 1,
				unitPrice: 20.0,
				totalPrice: 20.0,
				type: 'service'
			}
		],
		laborCost: 0,
		notes: 'Alternateur remplacé, batterie testée',
		paymentMethod: 'card',
		paidAt: new Date('2024-12-10'),
		createdAt: new Date('2024-12-10'),
		updatedAt: new Date('2024-12-10')
	},
	{
		id: '2',
		appointmentId: '1',
		customerId: '1',
		invoiceNumber: 'INV-2024-002',
		issueDate: new Date('2024-12-11'),
		dueDate: new Date('2024-12-25'),
		status: 'sent',
		subtotal: 180.0,
		tax: 37.8,
		total: 217.8,
		parts: [
			{
				id: '2',
				description: 'Huile moteur 5W-30',
				quantity: 1,
				unitPrice: 12.5,
				totalPrice: 12.5,
				type: 'part'
			},
			{
				id: '3',
				description: 'Filtre à huile',
				quantity: 1,
				unitPrice: 8.75,
				totalPrice: 8.75,
				type: 'part'
			}
		],
		services: [
			{
				id: '2',
				description: 'Entretien complet (2h)',
				quantity: 1,
				unitPrice: 158.75,
				totalPrice: 158.75,
				type: 'service'
			}
		],
		laborCost: 0,
		notes: 'Vidange, filtres, contrôle général',
		paymentMethod: undefined,
		paidAt: undefined,
		createdAt: new Date('2024-12-11'),
		updatedAt: new Date('2024-12-11')
	},
	{
		id: '3',
		appointmentId: '2',
		customerId: '2',
		invoiceNumber: 'INV-2024-003',
		issueDate: new Date('2024-12-12'),
		dueDate: new Date('2024-12-26'),
		status: 'draft',
		subtotal: 250.0,
		tax: 52.5,
		total: 302.5,
		parts: [
			{
				id: '4',
				description: 'Plaquettes de frein avant',
				quantity: 2,
				unitPrice: 45.0,
				totalPrice: 90.0,
				type: 'part'
			},
			{
				id: '5',
				description: 'Disques de frein avant',
				quantity: 2,
				unitPrice: 55.0,
				totalPrice: 110.0,
				type: 'part'
			}
		],
		services: [
			{
				id: '3',
				description: 'Réparation freinage (1.5h)',
				quantity: 1,
				unitPrice: 50.0,
				totalPrice: 50.0,
				type: 'service'
			}
		],
		laborCost: 0,
		notes: 'Changement plaquettes et disques avant',
		paymentMethod: undefined,
		paidAt: undefined,
		createdAt: new Date('2024-12-12'),
		updatedAt: new Date('2024-12-12')
	}
];

function createBillingStore() {
	const { subscribe, update } = writable<BillingState>(initialState);

	// Initialize with mock data
	function initializeBilling() {
		update((state) => ({
			...state,
			invoices: mockInvoices,
			loading: false
		}));
	}

	// Generate invoice number
	function generateInvoiceNumber(): string {
		const year = new Date().getFullYear();
		const state = getStoreValue(billingStore);
		const count = state.invoices.length + 1;
		return `INV-${year}-${count.toString().padStart(3, '0')}`;
	}

	// Create new invoice
	async function createInvoice(request: CreateInvoiceRequest): Promise<string | null> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const subtotal =
				request.parts.reduce((sum, item) => sum + item.totalPrice, 0) +
				request.services.reduce((sum, item) => sum + item.totalPrice, 0) +
				request.laborCost;

			const tax = subtotal * 0.21; // TVA 21%
			const total = subtotal + tax;

			const newInvoice: Invoice = {
				id: Date.now().toString(),
				appointmentId: request.appointmentId,
				customerId: '', // Will be set based on appointment
				invoiceNumber: generateInvoiceNumber(),
				issueDate: new Date(),
				dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
				status: 'draft',
				subtotal,
				tax,
				total,
				parts: request.parts.map((item, index) => ({
					...item,
					id: `${Date.now()}-part-${index}`
				})),
				services: request.services.map((item, index) => ({
					...item,
					id: `${Date.now()}-service-${index}`
				})),
				laborCost: request.laborCost,
				notes: request.notes,
				paymentMethod: undefined,
				paidAt: undefined,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			update((state) => ({
				...state,
				invoices: [...state.invoices, newInvoice],
				loading: false
			}));

			return newInvoice.id;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création de la facture',
				loading: false
			}));
			return null;
		}
	}

	// Update invoice
	async function updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				invoices: state.invoices.map((invoice) =>
					invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date() } : invoice
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

	// Delete invoice
	async function deleteInvoice(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				invoices: state.invoices.filter((invoice) => invoice.id !== id),
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

	// Send invoice
	async function sendInvoice(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			// Simulate sending invoice
			await new Promise((resolve) => setTimeout(resolve, 1000));

			update((state) => ({
				...state,
				invoices: state.invoices.map((invoice) =>
					invoice.id === id
						? { ...invoice, status: 'sent' as const, updatedAt: new Date() }
						: invoice
				),
				loading: false
			}));
			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : "Erreur lors de l'envoi de la facture",
				loading: false
			}));
			return false;
		}
	}

	// Mark invoice as paid
	async function markAsPaid(id: string, paymentMethod: Invoice['paymentMethod']): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				invoices: state.invoices.map((invoice) =>
					invoice.id === id
						? {
								...invoice,
								status: 'paid' as const,
								paymentMethod,
								paidAt: new Date(),
								updatedAt: new Date()
							}
						: invoice
				),
				loading: false
			}));
			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors du marquage comme payé',
				loading: false
			}));
			return false;
		}
	}

	// Get invoice by ID
	function getInvoiceById(id: string): Invoice | undefined {
		const state = getStoreValue(billingStore);
		return state.invoices.find((invoice) => invoice.id === id);
	}

	// Get invoices by status
	function getInvoicesByStatus(status: Invoice['status']): Invoice[] {
		const state = getStoreValue(billingStore);
		return state.invoices.filter((invoice) => invoice.status === status);
	}

	// Get overdue invoices
	function getOverdueInvoices(): Invoice[] {
		const state = getStoreValue(billingStore);
		const now = new Date();
		return state.invoices.filter(
			(invoice) =>
				invoice.status !== 'paid' && invoice.status !== 'cancelled' && invoice.dueDate < now
		);
	}

	// Get invoices by customer
	function getInvoicesByCustomer(customerId: string): Invoice[] {
		const state = getStoreValue(billingStore);
		return state.invoices.filter((invoice) => invoice.customerId === customerId);
	}

	// Get billing statistics
	function getBillingStats() {
		const state = getStoreValue(billingStore);
		const totalInvoices = state.invoices.length;
		const paidInvoices = state.invoices.filter((inv) => inv.status === 'paid').length;
		const pendingInvoices = state.invoices.filter((inv) => inv.status === 'sent').length;
		const draftInvoices = state.invoices.filter((inv) => inv.status === 'draft').length;
		const overdueInvoices = getOverdueInvoices().length;

		const totalRevenue = state.invoices
			.filter((inv) => inv.status === 'paid')
			.reduce((sum, inv) => sum + inv.total, 0);

		const pendingRevenue = state.invoices
			.filter((inv) => inv.status === 'sent')
			.reduce((sum, inv) => sum + inv.total, 0);

		return {
			totalInvoices,
			paidInvoices,
			pendingInvoices,
			draftInvoices,
			overdueInvoices,
			totalRevenue,
			pendingRevenue
		};
	}

	// Get monthly revenue
	function getMonthlyRevenue(): { month: string; revenue: number }[] {
		const state = getStoreValue(billingStore);
		const monthlyData: { [key: string]: number } = {};

		state.invoices
			.filter((inv) => inv.status === 'paid')
			.forEach((invoice) => {
				const month = invoice.issueDate.toLocaleDateString('fr-FR', {
					year: 'numeric',
					month: 'long'
				});
				monthlyData[month] = (monthlyData[month] || 0) + invoice.total;
			});

		return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }));
	}

	// Select invoice
	function selectInvoice(id: string | null) {
		update((state) => ({ ...state, selectedInvoiceId: id }));
	}

	// Get selected invoice
	function getSelectedInvoice(): Invoice | undefined {
		const state = getStoreValue(billingStore);
		if (!state.selectedInvoiceId) return undefined;
		return getInvoiceById(state.selectedInvoiceId);
	}

	return {
		subscribe,
		initializeBilling,
		createInvoice,
		updateInvoice,
		deleteInvoice,
		sendInvoice,
		markAsPaid,
		getInvoiceById,
		getInvoicesByStatus,
		getOverdueInvoices,
		getInvoicesByCustomer,
		getBillingStats,
		getMonthlyRevenue,
		selectInvoice,
		getSelectedInvoice,
		get: () => getStoreValue(billingStore)
	};
}

export const billingStore = createBillingStore();
