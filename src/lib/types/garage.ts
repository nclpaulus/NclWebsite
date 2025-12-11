// Core entities for AutoPro Garage management system

// Vehicle related types
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

// Appointment related types
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

export interface AppointmentSlot {
	id: string;
	startTime: Date;
	endTime: Date;
	isAvailable: boolean;
	mechanicId?: string;
	appointmentId?: string;
}

// Inventory related types
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

export interface PartUsage {
	id: string;
	partId: string;
	appointmentId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	usedAt: Date;
}

// Service related types
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

// Billing related types
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

export interface InvoiceItem {
	id: string;
	description: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	type: 'part' | 'service' | 'labor';
}

// Mechanic related types
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

// Notification related types
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

export interface NotificationTemplate {
	id: string;
	name: string;
	type: 'sms' | 'email';
	subject?: string;
	message: string;
	variables: string[];
	isActive: boolean;
}

// Dashboard and analytics types
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

export interface AppointmentStats {
	date: string;
	count: number;
	revenue: number;
}

export interface RevenueStats {
	period: string;
	amount: number;
	invoiceCount: number;
}

// Form types for creating/updating entities
export interface CreateAppointmentRequest {
	customerId: string;
	vehicleId: string;
	date: Date;
	duration: number;
	serviceType: string;
	description: string;
	mechanicId?: string;
}

export interface CreateInvoiceRequest {
	appointmentId: string;
	parts: Omit<InvoiceItem, 'id'>[];
	services: Omit<InvoiceItem, 'id'>[];
	laborCost: number;
	notes?: string;
}

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

// Filter and search types
export interface AppointmentFilters {
	status?: Appointment['status'];
	dateFrom?: Date;
	dateTo?: Date;
	mechanicId?: string;
	customerId?: string;
}

export interface InventoryFilters {
	category?: string;
	brand?: string;
	lowStock?: boolean;
	search?: string;
}

// API response types
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
