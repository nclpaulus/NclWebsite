import { writable, get as getStoreValue } from 'svelte/store';
import { SvelteDate } from 'svelte/reactivity';
import type {
	Appointment,
	Customer,
	Vehicle,
	Mechanic,
	AppointmentFilters,
	CreateAppointmentRequest,
	AppointmentSlot
} from '$lib/types/garage';

interface AppointmentState {
	appointments: Appointment[];
	customers: Customer[];
	vehicles: Vehicle[];
	mechanics: Mechanic[];
	slots: AppointmentSlot[];
	loading: boolean;
	error: string | null;
	filters: AppointmentFilters;
	selectedDate: Date | null;
}

const initialState: AppointmentState = {
	appointments: [],
	customers: [],
	vehicles: [],
	mechanics: [],
	slots: [],
	loading: false,
	error: null,
	filters: {},
	selectedDate: null
};

// Mock data for demonstration
const mockCustomers: Customer[] = [
	{
		id: '1',
		firstName: 'Jean',
		lastName: 'Dupont',
		email: 'jean.dupont@email.com',
		phone: '0471 23 45 67',
		address: '123 Rue Principale, 4000 Liège',
		vehicles: [],
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15')
	},
	{
		id: '2',
		firstName: 'Marie',
		lastName: 'Martin',
		email: 'marie.martin@email.com',
		phone: '0472 34 56 78',
		address: '456 Avenue Secondaire, 4020 Liège',
		vehicles: [],
		createdAt: new Date('2024-02-20'),
		updatedAt: new Date('2024-02-20')
	}
];

const mockVehicles: Vehicle[] = [
	{
		id: '1',
		make: 'Volkswagen',
		model: 'Golf',
		year: 2018,
		licensePlate: '1-ABC-123',
		color: 'Noir',
		mileage: 85000,
		ownerId: '1',
		createdAt: new Date('2024-01-15'),
		updatedAt: new Date('2024-01-15')
	},
	{
		id: '2',
		make: 'Renault',
		model: 'Clio',
		year: 2020,
		licensePlate: '2-DEF-456',
		color: 'Blanc',
		mileage: 45000,
		ownerId: '2',
		createdAt: new Date('2024-02-20'),
		updatedAt: new Date('2024-02-20')
	}
];

const mockMechanics: Mechanic[] = [
	{
		id: '1',
		firstName: 'Pierre',
		lastName: 'Lefebvre',
		email: 'pierre@autopro.be',
		phone: '0473 45 67 89',
		specializations: ['Moteur', 'Freinage'],
		hourlyRate: 65,
		isActive: true,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	},
	{
		id: '2',
		firstName: 'Sophie',
		lastName: 'Bernard',
		email: 'sophie@autopro.be',
		phone: '0474 56 78 90',
		specializations: ['Électricité', 'Climatisation'],
		hourlyRate: 70,
		isActive: true,
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01')
	}
];

function createAppointmentStore() {
	const { subscribe, update } = writable<AppointmentState>(initialState);

	// Initialize with mock data
	function initializeAppointments() {
		update((state) => ({
			...state,
			customers: mockCustomers,
			vehicles: mockVehicles,
			mechanics: mockMechanics,
			appointments: generateMockAppointments(),
			loading: false
		}));
	}

	// Generate mock appointments
	function generateMockAppointments(): Appointment[] {
		const today = new SvelteDate();
		const tomorrow = new SvelteDate(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		return [
			{
				id: '1',
				customerId: '1',
				vehicleId: '1',
				date: new SvelteDate(today.setHours(9, 0, 0, 0)),
				duration: 120,
				status: 'confirmed',
				serviceType: 'Entretien complet',
				description: 'Vidange, filtres, contrôle général',
				estimatedCost: 180,
				mechanicId: '1',
				notes: 'Client demande vérification climatisation',
				createdAt: new SvelteDate('2024-12-01'),
				updatedAt: new SvelteDate('2024-12-01')
			},
			{
				id: '2',
				customerId: '2',
				vehicleId: '2',
				date: new SvelteDate(tomorrow.setHours(14, 0, 0, 0)),
				duration: 90,
				status: 'scheduled',
				serviceType: 'Réparation freinage',
				description: 'Changement plaquettes et disques avant',
				estimatedCost: 250,
				mechanicId: '1',
				createdAt: new SvelteDate('2024-12-02'),
				updatedAt: new SvelteDate('2024-12-02')
			},
			{
				id: '3',
				customerId: '1',
				vehicleId: '1',
				date: new SvelteDate(today.setHours(15, 30, 0, 0)),
				duration: 60,
				status: 'completed',
				serviceType: 'Diagnostic électrique',
				description: 'Problème alternateur',
				estimatedCost: 80,
				actualCost: 120,
				mechanicId: '2',
				notes: 'Alternateur remplacé, batterie testée',
				createdAt: new SvelteDate('2024-12-01'),
				updatedAt: new SvelteDate('2024-12-10')
			}
		];
	}

	// Create new appointment
	async function createAppointment(request: CreateAppointmentRequest): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			const newAppointment: Appointment = {
				id: Date.now().toString(),
				...request,
				estimatedCost: 0, // Default value, should be calculated based on service
				status: 'scheduled',
				createdAt: new SvelteDate(),
				updatedAt: new SvelteDate()
			};

			update((state) => ({
				...state,
				appointments: [...state.appointments, newAppointment],
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la création du rendez-vous',
				loading: false
			}));
			return false;
		}
	}

	// Update appointment
	async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				appointments: state.appointments.map((apt) =>
					apt.id === id ? { ...apt, ...updates, updatedAt: new SvelteDate() } : apt
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

	// Delete appointment
	async function deleteAppointment(id: string): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			update((state) => ({
				...state,
				appointments: state.appointments.filter((apt) => apt.id !== id),
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

	// Filter appointments
	function filterAppointments(filters: AppointmentFilters) {
		update((state) => ({ ...state, filters }));
	}

	// Get filtered appointments
	function getFilteredAppointments(): Appointment[] {
		const state = getStoreValue(appointmentStore);
		let filtered = [...state.appointments];

		if (state.filters.status) {
			filtered = filtered.filter((apt) => apt.status === state.filters.status);
		}

		if (state.filters.mechanicId) {
			filtered = filtered.filter((apt) => apt.mechanicId === state.filters.mechanicId);
		}

		if (state.filters.customerId) {
			filtered = filtered.filter((apt) => apt.customerId === state.filters.customerId);
		}

		if (state.filters.dateFrom) {
			filtered = filtered.filter((apt) => apt.date >= state.filters.dateFrom!);
		}

		if (state.filters.dateTo) {
			filtered = filtered.filter((apt) => apt.date <= state.filters.dateTo!);
		}

		return filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
	}

	// Get appointments for specific date
	function getAppointmentsForDate(date: Date): Appointment[] {
		const state = getStoreValue(appointmentStore);
		return state.appointments.filter((apt) => {
			const aptDate = new SvelteDate(apt.date);
			return aptDate.toDateString() === date.toDateString();
		});
	}

	// Get available slots for date
	function getAvailableSlots(date: Date): AppointmentSlot[] {
		const appointments = getAppointmentsForDate(date);
		const slots: AppointmentSlot[] = [];

		// Generate slots from 8:00 to 18:00 with 30-minute intervals
		for (let hour = 8; hour < 18; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const startTime = new SvelteDate(date);
				startTime.setHours(hour, minute, 0, 0);

				const endTime = new SvelteDate(startTime);
				endTime.setMinutes(endTime.getMinutes() + 30);

				const hasConflict = appointments.some((apt) => {
					const aptStart = new SvelteDate(apt.date);
					const aptEnd = new SvelteDate(aptStart);
					aptEnd.setMinutes(aptEnd.getMinutes() + apt.duration);

					return startTime < aptEnd && endTime > aptStart;
				});

				slots.push({
					id: `${hour}-${minute}`,
					startTime,
					endTime,
					isAvailable: !hasConflict
				});
			}
		}

		return slots;
	}

	// Get customer by ID
	function getCustomerById(id: string): Customer | undefined {
		const state = getStoreValue(appointmentStore);
		return state.customers.find((c) => c.id === id);
	}

	// Get vehicle by ID
	function getVehicleById(id: string): Vehicle | undefined {
		const state = getStoreValue(appointmentStore);
		return state.vehicles.find((v) => v.id === id);
	}

	// Get mechanic by ID
	function getMechanicById(id: string): Mechanic | undefined {
		const state = getStoreValue(appointmentStore);
		return state.mechanics.find((m) => m.id === id);
	}

	return {
		subscribe,
		initializeAppointments,
		createAppointment,
		updateAppointment,
		deleteAppointment,
		filterAppointments,
		getFilteredAppointments,
		getAppointmentsForDate,
		getAvailableSlots,
		getCustomerById,
		getVehicleById,
		getMechanicById,
		get: () => getStoreValue(appointmentStore)
	};
}

export const appointmentStore = createAppointmentStore();
