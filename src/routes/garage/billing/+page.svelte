<script lang="ts">
	/** Page facturation garage avec création, gestion et suivi des factures. */
	import { onMount } from 'svelte';
	import { billingStore } from '$lib/stores/garage/billing.svelte';
	import { appointmentStore } from '$lib/stores/garage/appointments.svelte';
	import { inventoryStore } from '$lib/stores/garage/inventory.svelte';
	import { notificationStore } from '$lib/stores/garage/notifications.svelte';
	import type { Invoice, InvoiceItem } from '$lib/types/garage';

	let showCreateModal = $state(false);
	let showViewModal = $state(false);
	let selectedInvoice = $state<Invoice | null>(null);
	let selectedStatus = $state<string>('all');

	onMount(() => {
		billingStore.initializeBilling();
	});

	// Filter invoices by status
	const filteredInvoices = $derived(
		selectedStatus === 'all'
			? billingStore.get().invoices
			: billingStore.getInvoicesByStatus(selectedStatus as Invoice['status'])
	);

	// Get billing stats
	const stats = $derived(billingStore.getBillingStats());

	// Create invoice from appointment
	async function createInvoiceFromAppointment(appointmentId: string) {
		const appointment = appointmentStore.get().appointments.find((a) => a.id === appointmentId);
		if (!appointment) return;

		// Get parts used for this appointment
		const partUsages = inventoryStore.getPartUsagesForAppointment(appointmentId);

		const parts: Omit<InvoiceItem, 'id'>[] = partUsages.map((usage) => ({
			description: `${inventoryStore.getPartById(usage.partId)?.name} (${usage.quantity}x)`,
			quantity: usage.quantity,
			unitPrice: usage.unitPrice,
			totalPrice: usage.totalPrice,
			type: 'part' as const
		}));

		const services: Omit<InvoiceItem, 'id'>[] = [
			{
				description: appointment.serviceType,
				quantity: 1,
				unitPrice: appointment.estimatedCost,
				totalPrice: appointment.estimatedCost,
				type: 'service' as const
			}
		];

		const invoiceId = await billingStore.createInvoice({
			appointmentId,
			parts,
			services,
			laborCost: 0,
			notes: `Facture pour ${appointment.serviceType} - ${appointmentStore.getVehicleById(appointment.vehicleId)?.make} ${appointmentStore.getVehicleById(appointment.vehicleId)?.model}`
		});

		if (invoiceId) {
			// Update customer ID on invoice
			await billingStore.updateInvoice(invoiceId, { customerId: appointment.customerId });

			// Send notification
			const customer = appointmentStore.getCustomerById(appointment.customerId);
			if (customer) {
				const invoice = billingStore.getInvoiceById(invoiceId);
				if (invoice) {
					await notificationStore.notifyInvoiceSent(
						customer.email,
						customer.firstName,
						invoice.invoiceNumber,
						invoice.total,
						invoice.dueDate.toLocaleDateString('fr-FR'),
						invoiceId
					);
				}
			}
		}
	}

	// Send invoice
	async function sendInvoice(id: string) {
		const success = await billingStore.sendInvoice(id);
		if (success) {
			const invoice = billingStore.getInvoiceById(id);
			if (invoice) {
				const customer = appointmentStore.getCustomerById(invoice.customerId);
				if (customer) {
					await notificationStore.notifyInvoiceSent(
						customer.email,
						customer.firstName,
						invoice.invoiceNumber,
						invoice.total,
						invoice.dueDate.toLocaleDateString('fr-FR'),
						id
					);
				}
			}
		}
	}

	// Mark as paid
	async function markAsPaid(id: string) {
		await billingStore.markAsPaid(id, 'card');
	}

	// Delete invoice
	async function deleteInvoice(id: string) {
		if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
			await billingStore.deleteInvoice(id);
		}
	}

	// View invoice details
	function viewInvoice(invoice: Invoice) {
		selectedInvoice = invoice;
		billingStore.selectInvoice(invoice.id);
		showViewModal = true;
	}

	// Get status color
	function getStatusColor(status: Invoice['status']): string {
		switch (status) {
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'sent':
				return 'bg-blue-100 text-blue-800';
			case 'paid':
				return 'bg-green-100 text-green-800';
			case 'overdue':
				return 'bg-red-100 text-red-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
	}

	// Get customer info
	function getCustomerInfo(customerId: string): string {
		const customer = appointmentStore.getCustomerById(customerId);
		return customer ? `${customer.firstName} ${customer.lastName}` : 'Client inconnu';
	}

	// Get appointment info
	function getAppointmentInfo(appointmentId: string): string {
		const appointment = appointmentStore.get().appointments.find((a) => a.id === appointmentId);
		if (!appointment) return 'Rendez-vous inconnu';

		const vehicle = appointmentStore.getVehicleById(appointment.vehicleId);
		const vehicleInfo = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Véhicule inconnu';

		return `${appointment.serviceType} - ${vehicleInfo}`;
	}
</script>

<svelte:head>
	<title>AutoPro Garage - Facturation</title>
	<meta name="description" content="Gestion des factures et paiements" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground mb-2">💰 Facturation</h1>
		<p class="text-muted-foreground">Créer et gérer les factures, suivre les paiements</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Total factures</p>
					<p class="text-2xl font-bold text-foreground">{stats.totalInvoices}</p>
				</div>
				<div class="text-2xl">📄</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Payées</p>
					<p class="text-2xl font-bold text-green-600">{stats.paidInvoices}</p>
				</div>
				<div class="text-2xl">✅</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">En attente</p>
					<p class="text-2xl font-bold text-blue-600">{stats.pendingInvoices}</p>
				</div>
				<div class="text-2xl">⏳</div>
			</div>
		</div>

		<div class="bg-card border border-border rounded-lg p-4 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm text-muted-foreground">Chiffre d'affaires</p>
					<p class="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
				</div>
				<div class="text-2xl">💵</div>
			</div>
		</div>
	</div>

	<!-- Filters and Actions -->
	<div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
		<div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
			<div class="flex gap-4 flex-1">
				<select
					bind:value={selectedStatus}
					class="px-3 py-2 border border-border rounded-md bg-background"
				>
					<option value="all">Toutes les factures</option>
					<option value="draft">Brouillons</option>
					<option value="sent">Envoyées</option>
					<option value="paid">Payées</option>
					<option value="overdue">En retard</option>
					<option value="cancelled">Annulées</option>
				</select>
			</div>

			<button
				onclick={() => (showCreateModal = true)}
				class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
			>
				+ Nouvelle facture
			</button>
		</div>
	</div>

	<!-- Invoices Table -->
	<div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Facture</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Client</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Rendez-vous</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Date</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Échéance</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Total</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Statut</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
							>Actions</th
						>
					</tr>
				</thead>
				<tbody class="bg-background divide-y divide-border">
					{#each filteredInvoices as invoice (invoice.id)}
						<tr class="hover:bg-muted/50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-foreground">{invoice.invoiceNumber}</div>
								<div class="text-xs text-muted-foreground">
									Créée le {invoice.issueDate.toLocaleDateString('fr-FR')}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{getCustomerInfo(invoice.customerId)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								<div class="max-w-xs truncate">{getAppointmentInfo(invoice.appointmentId)}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{invoice.issueDate.toLocaleDateString('fr-FR')}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
								{invoice.dueDate.toLocaleDateString('fr-FR')}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
								{formatCurrency(invoice.total)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span class="px-2 py-1 text-xs rounded {getStatusColor(invoice.status)}">
									{invoice.status}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm">
								<div class="flex items-center gap-1">
									<button
										onclick={() => viewInvoice(invoice)}
										class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
									>
										Voir
									</button>

									{#if invoice.status === 'draft'}
										<button
											onclick={() => sendInvoice(invoice.id)}
											class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
										>
											Envoyer
										</button>
									{/if}

									{#if invoice.status === 'sent'}
										<button
											onclick={() => markAsPaid(invoice.id)}
											class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
										>
											Payer
										</button>
									{/if}

									<button
										onclick={() => deleteInvoice(invoice.id)}
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

		{#if filteredInvoices.length === 0}
			<div class="text-center py-8 text-muted-foreground">Aucune facture trouvée</div>
		{/if}
	</div>
</div>

<!-- Create Invoice Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div
			class="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-foreground">Créer une facture</h2>
				<button
					onclick={() => (showCreateModal = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
				>
					✕
				</button>
			</div>

			<div class="space-y-4">
				<h3 class="font-medium text-foreground">Rendez-vous terminés sans facture</h3>

				<div class="space-y-2 max-h-60 overflow-y-auto">
					{#each appointmentStore
						.get()
						.appointments.filter((apt) => apt.status === 'completed') as appointment (appointment.id)}
						{#if !billingStore.get().invoices.find((inv) => inv.appointmentId === appointment.id)}
							<div class="flex items-center justify-between p-3 border border-border rounded">
								<div>
									<div class="font-medium">{appointment.serviceType}</div>
									<div class="text-sm text-muted-foreground">
										{getCustomerInfo(appointment.customerId)} - {appointmentStore.getVehicleById(
											appointment.vehicleId
										)?.make}
										{appointmentStore.getVehicleById(appointment.vehicleId)?.model}
									</div>
									<div class="text-xs text-muted-foreground">
										{appointment.date.toLocaleDateString('fr-FR')}
									</div>
								</div>
								<button
									onclick={() => {
										createInvoiceFromAppointment(appointment.id);
										showCreateModal = false;
									}}
									class="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
								>
									Créer facture
								</button>
							</div>
						{/if}
					{/each}

					{#if appointmentStore
						.get()
						.appointments.filter((apt) => apt.status === 'completed')
						.every((apt) => billingStore
								.get()
								.invoices.find((inv) => inv.appointmentId === apt.id))}
						<div class="text-center py-4 text-muted-foreground">
							Tous les rendez-vous terminés ont été facturés
						</div>
					{/if}
				</div>
			</div>

			<div class="flex justify-end mt-6">
				<button
					onclick={() => (showCreateModal = false)}
					class="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
				>
					Fermer
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- View Invoice Modal -->
{#if showViewModal && selectedInvoice}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div
			class="bg-background border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
		>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold text-foreground">
					Facture {selectedInvoice.invoiceNumber}
				</h2>
				<button
					onclick={() => {
						showViewModal = false;
						selectedInvoice = null;
					}}
					class="text-muted-foreground hover:text-foreground transition-colors"
				>
					✕
				</button>
			</div>

			<div class="space-y-6">
				<!-- Invoice Header -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h3 class="font-medium text-foreground mb-2">Client</h3>
						<p class="text-sm text-muted-foreground">
							{getCustomerInfo(selectedInvoice.customerId)}
						</p>
					</div>
					<div class="text-right">
						<p class="text-sm text-muted-foreground">Date d'émission</p>
						<p class="font-medium">{selectedInvoice.issueDate.toLocaleDateString('fr-FR')}</p>
						<p class="text-sm text-muted-foreground mt-1">Date d'échéance</p>
						<p class="font-medium">{selectedInvoice.dueDate.toLocaleDateString('fr-FR')}</p>
					</div>
				</div>

				<!-- Invoice Items -->
				<div>
					<h3 class="font-medium text-foreground mb-3">Détails de la facture</h3>

					{#if selectedInvoice.parts.length > 0}
						<div class="mb-4">
							<h4 class="text-sm font-medium text-muted-foreground mb-2">Pièces</h4>
							<div class="border border-border rounded">
								<table class="w-full">
									<thead class="bg-muted/50">
										<tr>
											<th class="px-4 py-2 text-left text-xs">Description</th>
											<th class="px-4 py-2 text-right text-xs">Quantité</th>
											<th class="px-4 py-2 text-right text-xs">Prix unitaire</th>
											<th class="px-4 py-2 text-right text-xs">Total</th>
										</tr>
									</thead>
									<tbody>
										{#each selectedInvoice.parts as part (part.id)}
											<tr class="border-t border-border">
												<td class="px-4 py-2 text-sm">{part.description}</td>
												<td class="px-4 py-2 text-sm text-right">{part.quantity}</td>
												<td class="px-4 py-2 text-sm text-right"
													>{formatCurrency(part.unitPrice)}</td
												>
												<td class="px-4 py-2 text-sm text-right font-medium"
													>{formatCurrency(part.totalPrice)}</td
												>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}

					{#if selectedInvoice.services.length > 0}
						<div class="mb-4">
							<h4 class="text-sm font-medium text-muted-foreground mb-2">Services</h4>
							<div class="border border-border rounded">
								<table class="w-full">
									<thead class="bg-muted/50">
										<tr>
											<th class="px-4 py-2 text-left text-xs">Description</th>
											<th class="px-4 py-2 text-right text-xs">Quantité</th>
											<th class="px-4 py-2 text-right text-xs">Prix unitaire</th>
											<th class="px-4 py-2 text-right text-xs">Total</th>
										</tr>
									</thead>
									<tbody>
										{#each selectedInvoice.services as service (service.id)}
											<tr class="border-t border-border">
												<td class="px-4 py-2 text-sm">{service.description}</td>
												<td class="px-4 py-2 text-sm text-right">{service.quantity}</td>
												<td class="px-4 py-2 text-sm text-right"
													>{formatCurrency(service.unitPrice)}</td
												>
												<td class="px-4 py-2 text-sm text-right font-medium"
													>{formatCurrency(service.totalPrice)}</td
												>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/if}

					{#if selectedInvoice.laborCost > 0}
						<div class="mb-4">
							<h4 class="text-sm font-medium text-muted-foreground mb-2">Main d'œuvre</h4>
							<div class="flex justify-between p-3 bg-muted/50 rounded">
								<span class="text-sm">Main d'œuvre</span>
								<span class="text-sm font-medium">{formatCurrency(selectedInvoice.laborCost)}</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Totals -->
				<div class="border-t border-border pt-4">
					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span>Sous-total</span>
							<span>{formatCurrency(selectedInvoice.subtotal)}</span>
						</div>
						<div class="flex justify-between text-sm">
							<span>TVA (21%)</span>
							<span>{formatCurrency(selectedInvoice.tax)}</span>
						</div>
						<div
							class="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border"
						>
							<span>Total</span>
							<span>{formatCurrency(selectedInvoice.total)}</span>
						</div>
					</div>
				</div>

				{#if selectedInvoice.notes}
					<div>
						<h4 class="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
						<p class="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
							{selectedInvoice.notes}
						</p>
					</div>
				{/if}

				<!-- Payment Info -->
				<div class="flex items-center justify-between border-t border-border pt-4">
					<div>
						<span class="px-2 py-1 text-xs rounded {getStatusColor(selectedInvoice.status)}">
							{selectedInvoice.status}
						</span>
						{#if selectedInvoice.paymentMethod}
							<span class="ml-2 text-sm text-muted-foreground">
								Paiement: {selectedInvoice.paymentMethod}
							</span>
						{/if}
					</div>
					<div class="flex gap-2">
						{#if selectedInvoice.status === 'draft'}
							<button
								onclick={() => {
									sendInvoice(selectedInvoice!.id);
									showViewModal = false;
								}}
								class="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
							>
								Envoyer la facture
							</button>
						{/if}

						{#if selectedInvoice.status === 'sent'}
							<button
								onclick={() => {
									markAsPaid(selectedInvoice!.id);
									showViewModal = false;
								}}
								class="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
							>
								Marquer comme payée
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
