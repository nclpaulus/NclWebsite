<script lang="ts">
	import { onMount } from 'svelte';
	import { appointmentStore } from '$lib/stores/garage/appointments.svelte';
	import { notificationStore } from '$lib/stores/garage/notifications.svelte';
	import type { Appointment, AppointmentFilters } from '$lib/types/garage';

	let selectedDate = $state(new Date());
	let showCreateModal = $state(false);
	let filters = $state<AppointmentFilters>({});

	onMount(() => {
		appointmentStore.initializeAppointments();
	});

	// Get appointments for selected date
	const appointmentsForDate = $derived(appointmentStore.getAppointmentsForDate(selectedDate));

	// Get available slots for selected date
	const availableSlots = $derived(appointmentStore.getAvailableSlots(selectedDate));

	// Filter appointments
	function applyFilters() {
		appointmentStore.filterAppointments(filters);
	}

	// Create appointment
	async function handleCreateAppointment(formData: FormData) {
		const success = await appointmentStore.createAppointment({
			customerId: formData.get('customerId') as string,
			vehicleId: formData.get('vehicleId') as string,
			date: new Date(formData.get('date') as string),
			duration: parseInt(formData.get('duration') as string),
			serviceType: formData.get('serviceType') as string,
			description: formData.get('description') as string,
			mechanicId: formData.get('mechanicId') as string
		});

		if (success) {
			showCreateModal = false;
			// Send notification
			const customer = appointmentStore.getCustomerById(formData.get('customerId') as string);
			if (customer) {
				const appointmentDate = new Date(formData.get('date') as string);
				await notificationStore.notifyAppointmentReminder(
					customer.email,
					customer.phone,
					customer.firstName,
					appointmentDate.toLocaleDateString('fr-FR'),
					appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
					'' // Will be set after creation
				);
			}
		}
	}

	// Update appointment status
	async function updateAppointmentStatus(id: string, status: Appointment['status']) {
		const success = await appointmentStore.updateAppointment(id, { status });

		if (success && status === 'completed') {
			const appointment = appointmentStore.get().appointments.find((a) => a.id === id);
			if (appointment) {
				const customer = appointmentStore.getCustomerById(appointment.customerId);
				if (customer) {
					await notificationStore.notifyServiceCompleted(customer.phone, customer.firstName, id);
				}
			}
		}
	}

	// Format time
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
	}

	// Get status color
	function getStatusColor(status: Appointment['status']): string {
		switch (status) {
			case 'scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'confirmed':
				return 'bg-green-100 text-green-800';
			case 'in-progress':
				return 'bg-yellow-100 text-yellow-800';
			case 'completed':
				return 'bg-gray-100 text-gray-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>AutoPro Garage - Rendez-vous</title>
	<meta name="description" content="Gestion des rendez-vous et planning" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-foreground mb-2">📅 Rendez-vous</h1>
		<p class="text-muted-foreground">Gérer le planning et les rendez-vous clients</p>
	</div>

	<!-- Filters and Actions -->
	<div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
		<div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
			<div class="flex flex-col sm:flex-row gap-4 flex-1">
				<input
					type="date"
					bind:value={selectedDate}
					class="px-3 py-2 border border-border rounded-md bg-background"
				/>

				<select
					bind:value={filters.status}
					class="px-3 py-2 border border-border rounded-md bg-background"
				>
					<option value="">Tous les statuts</option>
					<option value="scheduled">Planifié</option>
					<option value="confirmed">Confirmé</option>
					<option value="in-progress">En cours</option>
					<option value="completed">Terminé</option>
					<option value="cancelled">Annulé</option>
				</select>

				<select
					bind:value={filters.mechanicId}
					class="px-3 py-2 border border-border rounded-md bg-background"
				>
					<option value="">Tous les mécaniciens</option>
					{#each appointmentStore.get().mechanics as mechanic (mechanic.id)}
						<option value={mechanic.id}>{mechanic.firstName} {mechanic.lastName}</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-2">
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
					+ Nouveau rendez-vous
				</button>
			</div>
		</div>
	</div>

	<!-- Calendar View -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Appointments List -->
		<div class="lg:col-span-2">
			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-foreground mb-4">
					Rendez-vous du {selectedDate.toLocaleDateString('fr-FR')}
				</h2>

				<div class="space-y-4">
					{#each appointmentsForDate as appointment (appointment.id)}
						<div class="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="font-semibold text-foreground">{appointment.serviceType}</h3>
										<span class="px-2 py-1 text-xs rounded {getStatusColor(appointment.status)}">
											{appointment.status}
										</span>
									</div>

									<p class="text-sm text-muted-foreground mb-2">{appointment.description}</p>

									<div class="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span class="font-medium">Client:</span>
											{appointmentStore.getCustomerById(appointment.customerId)?.firstName}
											{appointmentStore.getCustomerById(appointment.customerId)?.lastName}
										</div>
										<div>
											<span class="font-medium">Véhicule:</span>
											{appointmentStore.getVehicleById(appointment.vehicleId)?.make}
											{appointmentStore.getVehicleById(appointment.vehicleId)?.model}
										</div>
										<div>
											<span class="font-medium">Heure:</span>
											{formatTime(appointment.date)}
										</div>
										<div>
											<span class="font-medium">Durée:</span>
											{appointment.duration} min
										</div>
										<div>
											<span class="font-medium">Mécanicien:</span>
											{appointmentStore.getMechanicById(appointment.mechanicId || '')?.firstName}
											{appointmentStore.getMechanicById(appointment.mechanicId || '')?.lastName}
										</div>
										<div>
											<span class="font-medium">Coût:</span>
											{appointment.estimatedCost}€
										</div>
									</div>

									{#if appointment.notes}
										<div class="mt-3 p-2 bg-muted/50 rounded text-sm">
											<span class="font-medium">Notes:</span>
											{appointment.notes}
										</div>
									{/if}
								</div>

								<div class="flex flex-col gap-2 ml-4">
									{#if appointment.status === 'scheduled'}
										<button
											onclick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
											class="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
										>
											Confirmer
										</button>
									{/if}

									{#if appointment.status === 'confirmed'}
										<button
											onclick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
											class="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
										>
											Démarrer
										</button>
									{/if}

									{#if appointment.status === 'in-progress'}
										<button
											onclick={() => updateAppointmentStatus(appointment.id, 'completed')}
											class="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
										>
											Terminer
										</button>
									{/if}

									<button
										onclick={() => {
											// TODO: Implement appointment selection functionality
										}}
										class="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
									>
										Détails
									</button>
								</div>
							</div>
						</div>
					{/each}

					{#if appointmentsForDate.length === 0}
						<div class="text-center py-8 text-muted-foreground">
							Aucun rendez-vous pour cette date
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Available Slots -->
		<div>
			<div class="bg-card border border-border rounded-lg p-6 shadow-sm">
				<h2 class="text-lg font-semibold text-foreground mb-4">Créneaux disponibles</h2>

				<div class="space-y-2 max-h-96 overflow-y-auto">
					{#each availableSlots.filter((slot) => slot.isAvailable) as slot (slot.id)}
						<div
							class="flex items-center justify-between p-2 bg-muted/50 rounded hover:bg-muted transition-colors cursor-pointer"
						>
							<span class="text-sm">
								{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
							</span>
							<button
								onclick={() => {
									showCreateModal = true;
									// Pre-fill the date and time
								}}
								class="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
							>
								Réserver
							</button>
						</div>
					{/each}

					{#if availableSlots.filter((slot) => slot.isAvailable).length === 0}
						<div class="text-center py-4 text-muted-foreground text-sm">
							Aucun créneau disponible
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Create Appointment Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div
			class="bg-background border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-foreground">Nouveau rendez-vous</h2>
				<button
					onclick={() => (showCreateModal = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
				>
					✕
				</button>
			</div>

			<form
				onsubmit={async (e: Event) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					await handleCreateAppointment(formData);
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="customerId" class="block text-sm font-medium text-foreground mb-1"
							>Client</label
						>
						<select
							id="customerId"
							name="customerId"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						>
							{#each appointmentStore.get().customers as customer (customer.id)}
								<option value={customer.id}>{customer.firstName} {customer.lastName}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="vehicleId" class="block text-sm font-medium text-foreground mb-1"
							>Véhicule</label
						>
						<select
							id="vehicleId"
							name="vehicleId"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						>
							{#each appointmentStore.get().vehicles as vehicle (vehicle.id)}
								<option value={vehicle.id}
									>{vehicle.make} {vehicle.model} ({vehicle.licensePlate})</option
								>
							{/each}
						</select>
					</div>

					<div>
						<label for="appointmentDate" class="block text-sm font-medium text-foreground mb-1"
							>Date et heure</label
						>
						<input
							id="appointmentDate"
							type="datetime-local"
							name="date"
							required
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="duration" class="block text-sm font-medium text-foreground mb-1"
							>Durée (minutes)</label
						>
						<input
							id="duration"
							type="number"
							name="duration"
							required
							min="30"
							step="30"
							value="60"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="serviceType" class="block text-sm font-medium text-foreground mb-1"
							>Type de service</label
						>
						<input
							id="serviceType"
							type="text"
							name="serviceType"
							required
							placeholder="Ex: Entretien complet"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						/>
					</div>

					<div>
						<label for="mechanicId" class="block text-sm font-medium text-foreground mb-1"
							>Mécanicien</label
						>
						<select
							id="mechanicId"
							name="mechanicId"
							class="w-full px-3 py-2 border border-border rounded-md bg-background"
						>
							{#each appointmentStore.get().mechanics as mechanic (mechanic.id)}
								<option value={mechanic.id}>{mechanic.firstName} {mechanic.lastName}</option>
							{/each}
						</select>
					</div>

					<div class="md:col-span-2">
						<label for="description" class="block text-sm font-medium text-foreground mb-1"
							>Description</label
						>
						<textarea
							id="description"
							name="description"
							required
							rows="3"
							placeholder="Description des travaux à effectuer"
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
						Créer le rendez-vous
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
