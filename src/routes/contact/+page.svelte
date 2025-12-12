<script lang="ts">
	/** Page de contact avec formulaire et coordonnées. */
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let loading = false;
</script>

<svelte:head>
	<title>Contact - WeCraft</title>
	<meta name="description" content="Contactez-moi pour vos projets ou collaborations" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-6 text-primary">Contact</h1>
	<p class="text-lg text-muted-foreground mb-8">
		N'hésitez pas à me contacter pour discuter de vos projets, collaborations ou simplement échanger
		sur la technologie.
	</p>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-foreground">Envoyez un message</h2>

			<form
				class="space-y-4"
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						loading = false;
						if (result.type === 'success' && result.data?.success) {
							toast.success('Message envoyé avec succès !');
							// Réinitialiser le formulaire
							document.querySelector('form')?.reset();
						} else if (result.type === 'failure') {
							toast.error(String(result.data?.error ?? 'Une erreur est survenue'));
						}
					};
				}}
			>
				<div>
					<label for="name" class="block text-sm font-medium text-foreground mb-2"> Nom </label>
					<input
						type="text"
						id="name"
						name="name"
						class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						placeholder="Votre nom"
						required
					/>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label>
					<input
						type="email"
						id="email"
						name="email"
						class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						placeholder="votre@email.com"
						required
					/>
				</div>

				<div>
					<label for="subject" class="block text-sm font-medium text-foreground mb-2">
						Sujet
					</label>
					<input
						type="text"
						id="subject"
						name="subject"
						class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
						placeholder="Sujet de votre message"
						required
					/>
				</div>

				<div>
					<label for="message" class="block text-sm font-medium text-foreground mb-2">
						Message
					</label>
					<textarea
						id="message"
						name="message"
						rows="6"
						class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
						placeholder="Votre message..."
						required
					></textarea>
				</div>

				<!-- Honeypot field pour la protection anti-spam -->
				<input
					type="text"
					name="website"
					class="hidden"
					tabindex="-1"
					autocomplete="off"
					aria-hidden="true"
				/>

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Envoi en cours...' : 'Envoyer le message'}
				</Button>
			</form>
		</div>

		<div class="space-y-6">
			<h2 class="text-2xl font-semibold text-foreground">Informations</h2>

			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div
						class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
					>
						📧
					</div>
					<div>
						<h3 class="font-medium text-foreground">Email</h3>
						<p class="text-muted-foreground">contact@wecraft.com</p>
					</div>
				</div>

				<div class="flex items-center space-x-3">
					<div
						class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground"
					>
						📍
					</div>
					<div>
						<h3 class="font-medium text-foreground">Localisation</h3>
						<p class="text-muted-foreground">France</p>
					</div>
				</div>

				<div class="flex items-center space-x-3">
					<div
						class="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground"
					>
						💼
					</div>
					<div>
						<h3 class="font-medium text-foreground">Disponibilité</h3>
						<p class="text-muted-foreground">Ouvert aux collaborations</p>
					</div>
				</div>
			</div>

			<div class="bg-muted rounded-lg p-6">
				<h3 class="font-semibold text-foreground mb-3">Réseaux sociaux</h3>
				<div class="flex flex-wrap gap-3">
					<button
						type="button"
						class="px-4 py-2 bg-background border rounded-md hover:bg-accent transition-colors cursor-pointer"
						onclick={() => window.open('https://github.com', '_blank')}
					>
						GitHub
					</button>
					<button
						type="button"
						class="px-4 py-2 bg-background border rounded-md hover:bg-accent transition-colors cursor-pointer"
						onclick={() => window.open('https://linkedin.com', '_blank')}
					>
						LinkedIn
					</button>
					<button
						type="button"
						class="px-4 py-2 bg-background border rounded-md hover:bg-accent transition-colors cursor-pointer"
						onclick={() => window.open('https://twitter.com', '_blank')}
					>
						Twitter
					</button>
				</div>
			</div>

			<div class="bg-card border rounded-lg p-6">
				<h3 class="font-semibold text-foreground mb-3">Temps de réponse</h3>
				<p class="text-muted-foreground">
					Je m'efforce de répondre à tous les messages dans un délai de 24-48h ouvrables.
				</p>
			</div>
		</div>
	</div>
</div>
