import { Resend } from 'resend';
import { fail } from '@sveltejs/kit';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const subject = data.get('subject');
		const message = data.get('message');

		// Validation basique
		if (!name || !email || !subject || !message) {
			return fail(400, {
				error: 'Tous les champs sont requis',
				name,
				email,
				subject,
				message
			});
		}

		// Validation de l'email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email as string)) {
			return fail(400, {
				error: 'Veuillez entrer une adresse email valide',
				name,
				email,
				subject,
				message
			});
		}

		// Vérifier le honeypot (protection anti-spam)
		const honeypot = data.get('website');
		if (honeypot) {
			// Si le honeypot est rempli, c'est probablement un bot
			// On retourne un succès pour ne pas alerter le bot
			return { success: true };
		}

		// Échapper le HTML pour prévenir les attaques XSS
		const escapeHtml = (text: string) => {
			const map: Record<string, string> = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#039;'
			};
			return text.replace(/[&<>"']/g, (m) => map[m]);
		};

		const safeName = escapeHtml(name as string);
		const safeEmail = escapeHtml(email as string);
		const safeSubject = escapeHtml(subject as string);
		const safeMessage = escapeHtml(message as string);

		try {
			// Envoi de l'email via Resend
			await resend.emails.send({
				from: 'contact@npaulus.website',
				to: 'ncl.paulus@proton.me',
				subject: `Nouveau message de ${safeName}: ${safeSubject}`,
				html: `
					<h2>Nouveau message depuis le formulaire de contact</h2>
					<p><strong>Nom:</strong> ${safeName}</p>
					<p><strong>Email:</strong> ${safeEmail}</p>
					<p><strong>Sujet:</strong> ${safeSubject}</p>
					<br>
					<p><strong>Message:</strong></p>
					<p>${safeMessage.replace(/\n/g, '<br>')}</p>
				`
			});

			// Email de confirmation pour l'expéditeur
			await resend.emails.send({
				from: 'contact@npaulus.website',
				to: safeEmail,
				subject: 'Confirmation de votre message - Nicolas Paulus',
				html: `
					<h2>Merci pour votre message !</h2>
					<p>Bonjour ${safeName},</p>
					<p>Nous avons bien reçu votre message et nous vous en remercions.</p>
					<p>Nous vous répondrons dans les plus brefs délais (généralement sous 24-48h ouvrables).</p>
					<br>
					<p><strong>Votre message:</strong></p>
					<p><em>${safeMessage.replace(/\n/g, '<br>')}</em></p>
					<br>
					<p>Cordialement,</p>
					<p>L'équipe Nicolas Paulus</p>
				`
			});

			return { success: true };
		} catch (error) {
			console.error("Erreur lors de l'envoi de l'email:", error);
			return fail(500, {
				error: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
				name,
				email,
				subject,
				message
			});
		}
	}
};
