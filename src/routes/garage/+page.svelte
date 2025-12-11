<script lang="ts">
	import { onMount } from 'svelte';
	import { appointmentStore } from '$lib/stores/garage/appointments.svelte';
	import { inventoryStore } from '$lib/stores/garage/inventory.svelte';
	import { billingStore } from '$lib/stores/garage/billing.svelte';
	import { notificationStore } from '$lib/stores/garage/notifications.svelte';
	import type { DashboardStats } from '$lib/types/garage';

	let stats = $state<DashboardStats>({
		totalAppointments: 0,
		todayAppointments: 0,
		totalRevenue: 0,
		monthlyRevenue: 0,
		pendingInvoices: 0,
		lowStockParts: 0,
		activeMechanics: 0,
		avgServiceTime: 0
	});

	let loading = $state(true);

	onMount(async () => {
		// Initialize all stores
		appointmentStore.initializeAppointments();
		inventoryStore.initializeInventory();
		billingStore.initializeBilling();
		notificationStore.initializeNotifications();

		// Calculate dashboard stats
		await loadDashboardStats();
		loading = false;
	});

	async function loadDashboardStats() {
		const appointments = appointmentStore.get();
		const billing = billingStore.get();

		const today = new Date();
		const todayAppointments = appointments.appointments.filter((apt) => {
			const aptDate = new Date(apt.date);
			return aptDate.toDateString() === today.toDateString();
		});

		const currentMonth = new Date().getMonth();
		const monthlyInvoices = billing.invoices.filter(
			(inv) => inv.status === 'paid' && inv.issueDate.getMonth() === currentMonth
		);

		stats = {
			totalAppointments: appointments.appointments.length,
			todayAppointments: todayAppointments.length,
			totalRevenue: billing.invoices
				.filter((inv) => inv.status === 'paid')
				.reduce((sum, inv) => sum + inv.total, 0),
			monthlyRevenue: monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0),
			pendingInvoices: billing.invoices.filter((inv) => inv.status === 'sent').length,
			lowStockParts: inventoryStore.getLowStockParts().length,
			activeMechanics: appointments.mechanics.filter((m) => m.isActive).length,
			avgServiceTime: 120 // Average in minutes
		};
	}
</script>

<svelte:head>
	<title>AutoPro Garage - Dashboard</title>
	<meta name="description" content="Système de gestion pour AutoPro Garage" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground mb-2">🔧 AutoPro Garage</h1>
		<p class="text-muted-foreground">Système de gestion complet pour votre garage</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center min-h-[400px]">
			<div class="animate-spin text-4xl">⚙️</div>
		</div>
	{:else}
		<!-- Dashboard Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<div class="flex items-center justify-between mb-4">
					<div class="text-2xl">📅</div>
					<div class="text-sm text-muted-foreground">Aujourd'hui</div>
				</div>
				<div class="text-2xl font-bold text-primary">{stats.todayAppointments}</div>
				<div class="text-sm text-muted-foreground">Rendez-vous</div>
				<div class="text-xs text-muted-foreground mt-2">
					Total: {stats.totalAppointments}
				</div>
			</div>

			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<div class="flex items-center justify-between mb-4">
					<div class="text-2xl">💰</div>
					<div class="text-sm text-muted-foreground">Ce mois</div>
				</div>
				<div class="text-2xl font-bold text-primary">{stats.monthlyRevenue.toFixed(2)}€</div>
				<div class="text-sm text-muted-foreground">Chiffre d'affaires</div>
				<div class="text-xs text-muted-foreground mt-2">
					Total: {stats.totalRevenue.toFixed(2)}€
				</div>
			</div>

			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<div class="flex items-center justify-between mb-4">
					<div class="text-2xl">📄</div>
					<div class="text-sm text-muted-foreground">En attente</div>
				</div>
				<div class="text-2xl font-bold text-primary">{stats.pendingInvoices}</div>
				<div class="text-sm text-muted-foreground">Factures</div>
				<div class="text-xs text-muted-foreground mt-2">À encaisser</div>
			</div>

			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<div class="flex items-center justify-between mb-4">
					<div class="text-2xl">⚠️</div>
					<div class="text-sm text-muted-foreground">Alertes</div>
				</div>
				<div class="text-2xl font-bold text-destructive">{stats.lowStockParts}</div>
				<div class="text-sm text-muted-foreground">Stock faible</div>
				<div class="text-xs text-muted-foreground mt-2">Pièces à réapprovisionner</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-foreground mb-4">🚗 Véhicules du jour</h3>
				<div class="space-y-3">
					{#each appointmentStore.get().appointments.filter((apt) => {
						const aptDate = new Date(apt.date);
						return aptDate.toDateString() === new Date().toDateString();
					}) as appointment (appointment.id)}
						<div class="flex items-center justify-between p-3 bg-muted/50 rounded">
							<div>
								<div class="font-medium">{appointment.serviceType}</div>
								<div class="text-sm text-muted-foreground">
									{appointmentStore.getCustomerById(appointment.customerId)?.firstName}
									{appointmentStore.getCustomerById(appointment.customerId)?.lastName}
								</div>
								<div class="text-xs text-muted-foreground">
									{appointmentStore.getVehicleById(appointment.vehicleId)?.make}
									{appointmentStore.getVehicleById(appointment.vehicleId)?.model}
								</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium">
									{new Date(appointment.date).toLocaleTimeString('fr-FR', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
								<div class="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
									{appointment.status}
								</div>
							</div>
						</div>
					{/each}
					{#if appointmentStore.get().appointments.filter((apt) => {
						const aptDate = new Date(apt.date);
						return aptDate.toDateString() === new Date().toDateString();
					}).length === 0}
						<div class="text-center text-muted-foreground py-4">Aucun rendez-vous aujourd'hui</div>
					{/if}
				</div>
			</div>

			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-foreground mb-4">📦 Stock critique</h3>
				<div class="space-y-3">
					{#each inventoryStore.getLowStockParts().slice(0, 5) as part (part.id)}
						<div class="flex items-center justify-between p-3 bg-muted/50 rounded">
							<div>
								<div class="font-medium">{part.name}</div>
								<div class="text-sm text-muted-foreground">{part.reference}</div>
							</div>
							<div class="text-right">
								<div class="text-sm font-medium text-destructive">
									{part.stockQuantity} en stock
								</div>
								<div class="text-xs text-muted-foreground">Min: {part.minStockLevel}</div>
							</div>
						</div>
					{/each}
					{#if inventoryStore.getLowStockParts().length === 0}
						<div class="text-center text-muted-foreground py-4">Tous les stocks sont OK</div>
					{/if}
				</div>
			</div>

			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-foreground mb-4">🔔 Notifications récentes</h3>
				<div class="space-y-3">
					{#each notificationStore
						.get()
						.notifications.slice(-5)
						.reverse() as notification (notification.id)}
						<div class="flex items-center justify-between p-3 bg-muted/50 rounded">
							<div>
								<div class="font-medium text-sm">
									{notification.type === 'sms' ? '📱 SMS' : '📧 Email'}
								</div>
								<div class="text-xs text-muted-foreground truncate max-w-[200px]">
									{notification.message}
								</div>
							</div>
							<div class="text-right">
								<div class="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
									{notification.status}
								</div>
								<div class="text-xs text-muted-foreground">
									{new Date(notification.createdAt).toLocaleDateString('fr-FR')}
								</div>
							</div>
						</div>
					{/each}
					{#if notificationStore.get().notifications.length === 0}
						<div class="text-center text-muted-foreground py-4">Aucune notification récente</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Navigation Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<a href="/garage/appointments" class="block group">
				<div
					class="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary"
				>
					<div class="flex items-center mb-4">
						<div class="text-3xl mr-3">📅</div>
						<h3 class="text-lg font-semibold text-foreground">Rendez-vous</h3>
					</div>
					<p class="text-muted-foreground mb-4">
						Gérer les prises de rendez-vous et le planning des mécaniciens
					</p>
					<div class="flex items-center text-primary group-hover:text-primary/80">
						<span class="text-sm font-medium">Accéder au planning</span>
						<span class="ml-2">→</span>
					</div>
				</div>
			</a>

			<a href="/garage/inventory" class="block group">
				<div
					class="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary"
				>
					<div class="flex items-center mb-4">
						<div class="text-3xl mr-3">📦</div>
						<h3 class="text-lg font-semibold text-foreground">Inventaire</h3>
					</div>
					<p class="text-muted-foreground mb-4">Gérer les stocks de pièces et les fournisseurs</p>
					<div class="flex items-center text-primary group-hover:text-primary/80">
						<span class="text-sm font-medium">Gérer le stock</span>
						<span class="ml-2">→</span>
					</div>
				</div>
			</a>

			<a href="/garage/billing" class="block group">
				<div
					class="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group-hover:border-primary"
				>
					<div class="flex items-center mb-4">
						<div class="text-3xl mr-3">💰</div>
						<h3 class="text-lg font-semibold text-foreground">Facturation</h3>
					</div>
					<p class="text-muted-foreground mb-4">
						Créer et gérer les factures, suivre les paiements
					</p>
					<div class="flex items-center text-primary group-hover:text-primary/80">
						<span class="text-sm font-medium">Voir les factures</span>
						<span class="ml-2">→</span>
					</div>
				</div>
			</a>
		</div>
	{/if}
</div>
