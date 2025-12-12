// Core entities for AutoPro Garage management system

/** Véhicule du client (marque, modèle, immatriculation, kilométrage...). */
export interface Vehicle {
	id: string;
	make: string;
	model: string;
	year: number;
	licensePlate: string;
	vin?: string;
	color: string;
	mileage: number;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Client du garage (coordonnées, véhicules associés). */
export interface Customer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	vehicles: Vehicle[];
	createdAt: Date;
	updatedAt: Date;
}

/** Rendez-vous (client, véhicule, date, statut, mécanicien...). */
export interface Appointment {
	id: string;
	customerId: string;
	vehicleId: string;
	date: Date;
	duration: number; // in minutes
	status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
	serviceType: string;
	description: string;
	estimatedCost: number;
	actualCost?: number;
	mechanicId?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Créneau horaire disponible pour rendez-vous. */
export interface AppointmentSlot {
	id: string;
	startTime: Date;
	endTime: Date;
	isAvailable: boolean;
	mechanicId?: string;
	appointmentId?: string;
}

/** Pièce en stock (référence, catégorie, prix, stock, fournisseur...). */
export interface Part {
	id: string;
	name: string;
	reference: string;
	category: string;
	brand: string;
	price: number;
	stockQuantity: number;
	minStockLevel: number;
	supplier: string;
	description?: string;
	imageUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Utilisation d’une pièce pour un rendez-vous (quantité, prix). */
export interface PartUsage {
	id: string;
	partId: string;
	appointmentId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	usedAt: Date;
}

/** Service proposé par le garage (nom, durée, prix de base). */
export interface Service {
	id: string;
	name: string;
	description: string;
	duration: number; // in minutes
	basePrice: number;
	category: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/** Facture client (lignes, TVA, statut, paiement). */
export interface Invoice {
	id: string;
	appointmentId: string;
	customerId: string;
	invoiceNumber: string;
	issueDate: Date;
	dueDate: Date;
	status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
	subtotal: number;
	tax: number;
	total: number;
	parts: InvoiceItem[];
	services: InvoiceItem[];
	laborCost: number;
	notes?: string;
	paymentMethod?: 'cash' | 'card' | 'bank-transfer' | 'check';
	paidAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/** Ligne de facture (pièce ou service). */
export interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	type: 'part' | 'service' | 'labor';
}

/** Mécanicien (compétences, taux horaire, disponibilité). */
export interface Mechanic {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	specializations: string[];
	hourlyRate: number;
	isActive: boolean;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

/** Notification envoyée (SMS/email) avec statut de livraison. */
export interface Notification {
	id: string;
	type: 'sms' | 'email';
	recipient: string;
	subject?: string;
	message: string;
	status: 'pending' | 'sent' | 'failed' | 'delivered';
	relatedEntityId?: string;
	relatedEntityType?: 'appointment' | 'invoice' | 'vehicle';
	scheduledAt?: Date;
	sentAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/** Modèle de notification (variables, message, type). */
export interface NotificationTemplate {
	id: string;
	name: string;
	type: 'sms' | 'email';
	subject?: string;
	message: string;
	variables: string[];
	isActive: boolean;
}

/** Statistiques du dashboard garage. */
export interface DashboardStats {
	totalAppointments: number;
	todayAppointments: number;
	totalRevenue: number;
	monthlyRevenue: number;
	pendingInvoices: number;
	lowStockParts: number;
	activeMechanics: number;
	avgServiceTime: number;
}

/** Statistiques de rendez-vous par date. */
export interface AppointmentStats {
	date: string;
	count: number;
	revenue: number;
}

/** Statistiques de revenus par période. */
export interface RevenueStats {
	period: string;
	amount: number;
	invoiceCount: number;
}

/** Requête de création de rendez-vous. */
export interface CreateAppointmentRequest {
	customerId: string;
	vehicleId: string;
	date: Date;
	duration: number;
	serviceType: string;
	description: string;
	mechanicId?: string;
}

/** Requête de création de facture. */
export interface CreateInvoiceRequest {
	appointmentId: string;
	parts: Omit<InvoiceItem, 'id'>[];
	services: Omit<InvoiceItem, 'id'>[];
	laborCost: number;
	notes?: string;
}

/** Requête de création de pièce en stock. */
export interface CreatePartRequest {
	name: string;
	reference: string;
	category: string;
	brand: string;
	price: number;
	stockQuantity: number;
	minStockLevel: number;
	supplier: string;
	description?: string;
}

/** Filtres pour les rendez-vous. */
export interface AppointmentFilters {
	status?: Appointment['status'];
	dateFrom?: Date;
	dateTo?: Date;
	mechanicId?: string;
	customerId?: string;
}

/** Filtres pour l’inventaire. */
export interface InventoryFilters {
	category?: string;
	brand?: string;
	lowStock?: boolean;
	search?: string;
}

/** Réponse API générique. */
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

/** Réponse paginée générique. */
export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
