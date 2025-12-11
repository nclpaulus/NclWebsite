import { writable, get as getStoreValue } from 'svelte/store';
import { SvelteDate } from 'svelte/reactivity';
import type { Notification, NotificationTemplate } from '$lib/types/garage';

interface NotificationState {
	notifications: Notification[];
	templates: NotificationTemplate[];
	loading: boolean;
	error: string | null;
}

const initialState: NotificationState = {
	notifications: [],
	templates: [],
	loading: false,
	error: null
};

// Mock notification templates
const mockTemplates: NotificationTemplate[] = [
	{
		id: '1',
		name: 'Rappel rendez-vous',
		type: 'sms',
		message:
			'Bonjour {firstName}, ceci est un rappel pour votre rendez-vous du {date} à {time} chez AutoPro Garage.',
		variables: ['firstName', 'date', 'time'],
		isActive: true
	},
	{
		id: '2',
		name: 'Confirmation rendez-vous',
		type: 'email',
		subject: 'Confirmation de votre rendez-vous - AutoPro Garage',
		message:
			'Bonjour {firstName},\n\nVotre rendez-vous du {date} à {time} a été confirmé.\n\nService: {service}\nVéhicule: {vehicle}\n\nCordialement,\nAutoPro Garage',
		variables: ['firstName', 'date', 'time', 'service', 'vehicle'],
		isActive: true
	},
	{
		id: '3',
		name: 'Facture envoyée',
		type: 'email',
		subject: 'Votre facture {invoiceNumber} - AutoPro Garage',
		message:
			"Bonjour {firstName},\n\nVotre facture {invoiceNumber} d'un montant de {total}€ est disponible.\n\nDate d'échéance: {dueDate}\n\nVous pouvez la consulter en pièce jointe.\n\nCordialement,\nAutoPro Garage",
		variables: ['firstName', 'invoiceNumber', 'total', 'dueDate'],
		isActive: true
	},
	{
		id: '4',
		name: 'Service terminé',
		type: 'sms',
		message:
			'Bonjour {firstName}, votre véhicule est prêt. Vous pouvez venir le récupérer à AutoPro Garage.',
		variables: ['firstName'],
		isActive: true
	},
	{
		id: '5',
		name: 'Stock faible',
		type: 'email',
		subject: 'Alerte stock faible - {partName}',
		message:
			'Le stock de la pièce {partName} ({reference}) est faible.\n\nStock actuel: {currentStock}\nStock minimum: {minStock}\n\nMerci de réapprovisionner.',
		variables: ['partName', 'reference', 'currentStock', 'minStock'],
		isActive: true
	}
];

function createNotificationStore() {
	const { subscribe, update } = writable<NotificationState>(initialState);

	// Initialize with mock data
	function initializeNotifications() {
		update((state) => ({
			...state,
			templates: mockTemplates,
			loading: false
		}));
	}

	// Send notification
	async function sendNotification(
		type: 'sms' | 'email',
		recipient: string,
		message: string,
		subject?: string,
		relatedEntityId?: string,
		relatedEntityType?: 'appointment' | 'invoice' | 'vehicle'
	): Promise<boolean> {
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			// Simulate sending notification
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const notification: Notification = {
				id: Date.now().toString(),
				type,
				recipient,
				subject,
				message,
				status: 'sent',
				relatedEntityId,
				relatedEntityType,
				sentAt: new Date(),
				createdAt: new Date(),
				updatedAt: new Date()
			};

			update((state) => ({
				...state,
				notifications: [...state.notifications, notification],
				loading: false
			}));

			return true;
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : "Erreur lors de l'envoi de la notification",
				loading: false
			}));
			return false;
		}
	}

	// Send notification using template
	async function sendTemplateNotification(
		templateId: string,
		recipient: string,
		variables: Record<string, string>,
		relatedEntityId?: string,
		relatedEntityType?: 'appointment' | 'invoice' | 'vehicle'
	): Promise<boolean> {
		const state = getStoreValue(notificationStore);
		const template = state.templates.find((t) => t.id === templateId);

		if (!template) {
			update((state) => ({
				...state,
				error: 'Template de notification non trouvé'
			}));
			return false;
		}

		// Replace variables in message
		let message = template.message;
		let subject = template.subject;

		Object.entries(variables).forEach(([key, value]) => {
			const placeholder = `{${key}}`;
			message = message.replace(new RegExp(placeholder, 'g'), value);
			if (subject) {
				subject = subject.replace(new RegExp(placeholder, 'g'), value);
			}
		});

		return sendNotification(
			template.type,
			recipient,
			message,
			subject,
			relatedEntityId,
			relatedEntityType
		);
	}

	// Convenience methods for common notifications
	async function notifyAppointmentReminder(
		customerEmail: string,
		customerPhone: string,
		firstName: string,
		date: string,
		time: string,
		appointmentId: string
	): Promise<boolean> {
		// Send SMS reminder
		await sendTemplateNotification(
			'1',
			customerPhone,
			{
				firstName,
				date,
				time
			},
			appointmentId,
			'appointment'
		);

		// Send email confirmation
		return sendTemplateNotification(
			'2',
			customerEmail,
			{
				firstName,
				date,
				time,
				service: 'Entretien',
				vehicle: 'Véhicule'
			},
			appointmentId,
			'appointment'
		);
	}

	async function notifyInvoiceSent(
		customerEmail: string,
		firstName: string,
		invoiceNumber: string,
		total: number,
		dueDate: string,
		invoiceId: string
	): Promise<boolean> {
		return sendTemplateNotification(
			'3',
			customerEmail,
			{
				firstName,
				invoiceNumber,
				total: total.toFixed(2),
				dueDate
			},
			invoiceId,
			'invoice'
		);
	}

	async function notifyServiceCompleted(
		customerPhone: string,
		firstName: string,
		appointmentId: string
	): Promise<boolean> {
		return sendTemplateNotification(
			'4',
			customerPhone,
			{
				firstName
			},
			appointmentId,
			'appointment'
		);
	}

	async function notifyLowStock(
		adminEmail: string,
		partName: string,
		reference: string,
		currentStock: number,
		minStock: number
	): Promise<boolean> {
		return sendTemplateNotification('5', adminEmail, {
			partName,
			reference,
			currentStock: currentStock.toString(),
			minStock: minStock.toString()
		});
	}

	// Get notifications by type
	function getNotificationsByType(type: 'sms' | 'email'): Notification[] {
		const state = getStoreValue(notificationStore);
		return state.notifications.filter((n) => n.type === type);
	}

	// Get notifications by status
	function getNotificationsByStatus(status: Notification['status']): Notification[] {
		const state = getStoreValue(notificationStore);
		return state.notifications.filter((n) => n.status === status);
	}

	// Get notifications for entity
	function getNotificationsForEntity(
		entityId: string,
		entityType?: 'appointment' | 'invoice' | 'vehicle'
	): Notification[] {
		const state = getStoreValue(notificationStore);
		return state.notifications.filter(
			(n) => n.relatedEntityId === entityId && (!entityType || n.relatedEntityType === entityType)
		);
	}

	// Get notification statistics
	function getNotificationStats() {
		const state = getStoreValue(notificationStore);
		const total = state.notifications.length;
		const sent = state.notifications.filter((n) => n.status === 'sent').length;
		const pending = state.notifications.filter((n) => n.status === 'pending').length;
		const failed = state.notifications.filter((n) => n.status === 'failed').length;
		const smsCount = state.notifications.filter((n) => n.type === 'sms').length;
		const emailCount = state.notifications.filter((n) => n.type === 'email').length;

		return {
			total,
			sent,
			pending,
			failed,
			smsCount,
			emailCount
		};
	}

	// Clear old notifications (older than 30 days)
	function clearOldNotifications() {
		update((currentState) => {
			const thirtyDaysAgo = new SvelteDate();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

			return {
				...currentState,
				notifications: currentState.notifications.filter((n) => n.createdAt > thirtyDaysAgo)
			};
		});
	}

	return {
		subscribe,
		initializeNotifications,
		sendNotification,
		sendTemplateNotification,
		notifyAppointmentReminder,
		notifyInvoiceSent,
		notifyServiceCompleted,
		notifyLowStock,
		getNotificationsByType,
		getNotificationsByStatus,
		getNotificationsForEntity,
		getNotificationStats,
		clearOldNotifications,
		get: () => getStoreValue(notificationStore)
	};
}

export const notificationStore = createNotificationStore();
