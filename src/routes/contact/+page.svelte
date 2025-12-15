<script lang="ts">
	/** Page de contact avec formulaire et coordonnées. */
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	let loading = false;

	// État pour la gamification
	let formData = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};

	let progress = 0;
	let encouragingMessage = 'Commencez à remplir le formulaire 📝';
	let mascotMood = '😴';
	let showConfetti = false;

	// Messages encourageants selon la progression
	const messages = [
		{ min: 0, max: 25, text: 'Commencez à remplir le formulaire 📝', mood: '😴' },
		{ min: 25, max: 50, text: "C'est un bon début ! Continuez 💪", mood: '🙂' },
		{ min: 50, max: 75, text: 'Vous êtes sur la bonne voie ! 🚀', mood: '😊' },
		{ min: 75, max: 100, text: 'Plus que quelques instants ! 🎯', mood: '🤩' },
		{ min: 100, max: 100, text: 'Parfait ! Prêt à envoyer 🎉', mood: '🥳' }
	];

	// Calculer la progression
	$: if (formData) {
		const fields = Object.values(formData);
		const filledFields = fields.filter((field) => field.trim().length > 0);
		progress = Math.round((filledFields.length / fields.length) * 100);

		// Mettre à jour le message et l'humeur de la mascotte
		const currentMessage = messages.find((msg) => progress >= msg.min && progress <= msg.max);
		if (currentMessage) {
			encouragingMessage = currentMessage.text;
			mascotMood = currentMessage.mood;
		}
	}

	// Fonction pour gérer les changements
	function handleInputChange(field: string, value: string) {
		formData = { ...formData, [field]: value };
	}

	// Fonction pour déclencher les confettis
	function triggerConfetti() {
		showConfetti = true;
		setTimeout(() => {
			showConfetti = false;
		}, 5000);
	}
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

			<!-- Barre de progression et mascotte -->
			<div class="bg-muted/50 rounded-lg p-4 space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-foreground">Progression</span>
					<span class="text-sm text-muted-foreground">{progress}%</span>
				</div>
				<div class="w-full bg-background rounded-full h-3 overflow-hidden">
					<div
						class="h-full bg-linear-to-r from-primary to-primary/70 transition-all duration-500 ease-out rounded-full"
						style="width: {progress}%"
					></div>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-2xl animate-bounce" style="animation-duration: 2s">{mascotMood}</span>
					<span class="text-sm text-muted-foreground">{encouragingMessage}</span>
				</div>
			</div>

			<form
				class="space-y-4"
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						loading = false;
						if (result.type === 'success' && result.data?.success) {
							toast.success('Message envoyé avec succès ! 🎉');
							// Déclencher les confettis
							triggerConfetti();
							// Réinitialiser le formulaire et la gamification
							formData = {
								name: '',
								email: '',
								subject: '',
								message: ''
							};
							document.querySelector('form')?.reset();
						} else if (result.type === 'failure') {
							toast.error(String(result.data?.error ?? 'Une erreur est survenue'));
						}
					};
				}}
			>
				<div class="relative">
					<label for="name" class="block text-sm font-medium text-foreground mb-2"> Nom </label>
					<div class="relative">
						<input
							type="text"
							id="name"
							name="name"
							class="w-full px-3 py-2 pr-10 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
							placeholder="Votre nom"
							required
							bind:value={formData.name}
							oninput={(e) =>
								handleInputChange('name', (e.target as HTMLInputElement)?.value || '')}
						/>
						{#if formData.name.trim().length > 0}
							<div
								class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<div class="relative">
					<label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label>
					<div class="relative">
						<input
							type="email"
							id="email"
							name="email"
							class="w-full px-3 py-2 pr-10 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
							placeholder="votre@email.com"
							required
							bind:value={formData.email}
							oninput={(e) =>
								handleInputChange('email', (e.target as HTMLInputElement)?.value || '')}
						/>
						{#if formData.email.trim().length > 0 && formData.email.includes('@')}
							<div
								class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<div class="relative">
					<label for="subject" class="block text-sm font-medium text-foreground mb-2">
						Sujet
					</label>
					<div class="relative">
						<input
							type="text"
							id="subject"
							name="subject"
							class="w-full px-3 py-2 pr-10 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
							placeholder="Sujet de votre message"
							required
							bind:value={formData.subject}
							oninput={(e) =>
								handleInputChange('subject', (e.target as HTMLInputElement)?.value || '')}
						/>
						{#if formData.subject.trim().length > 0}
							<div
								class="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-pulse"
							>
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>
				</div>

				<div class="relative">
					<label for="message" class="block text-sm font-medium text-foreground mb-2">
						Message
					</label>
					<div class="relative">
						<textarea
							id="message"
							name="message"
							rows="6"
							class="w-full px-3 py-2 pr-10 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical transition-all duration-300"
							placeholder="Votre message..."
							required
							bind:value={formData.message}
							oninput={(e) =>
								handleInputChange('message', (e.target as HTMLTextAreaElement)?.value || '')}
						></textarea>
						{#if formData.message.trim().length > 0}
							<div class="absolute right-3 top-6 text-green-500 animate-pulse">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>
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

			<!-- Carte Email avec animation -->
			<div
				class="group bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
			>
				<div class="flex items-center gap-4">
					<div class="relative">
						<div
							class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
						>
							📧
						</div>
						<div
							class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"
						></div>
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-foreground mb-1">Email</h3>
						<p class="text-muted-foreground">contact@npaulus.website</p>
						<p
							class="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							Réponse sous 24-48h
						</p>
					</div>
				</div>
			</div>

			<!-- Carte Localisation -->
			<div
				class="group bg-linear-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
			>
				<div class="flex items-center gap-4">
					<div class="relative">
						<div
							class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground"
						>
							📍
						</div>
						<div
							class="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center"
						>
							<span class="text-xs">🇧🇪</span>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-foreground mb-1">Localisation</h3>
						<p class="text-muted-foreground">Liège, Belgique</p>
						<p
							class="text-xs text-secondary mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							Disponible pour visio
						</p>
					</div>
				</div>
			</div>

			<!-- Carte Disponibilité -->
			<div
				class="group bg-linear-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
			>
				<div class="flex items-center gap-4">
					<div class="relative">
						<div
							class="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground"
						>
							💼
						</div>
						<div class="absolute -top-1 -right-1">
							<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
					<div class="flex-1">
						<h3 class="font-semibold text-foreground mb-1">Disponibilité</h3>
						<p class="text-muted-foreground">Ouvert aux collaborations</p>
						<p
							class="text-xs text-accent mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							CDI
						</p>
					</div>
				</div>
			</div>

			<div class="bg-muted rounded-lg p-6">
				<h3 class="font-semibold text-foreground mb-3">Réseaux sociaux</h3>
				<div class="flex flex-wrap gap-3">
					<button
						type="button"
						class="group relative px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
						onclick={() => window.open('https://github.com/nclpaulus/', '_blank')}
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						<span class="font-medium">GitHub</span>
					</button>
					<button
						type="button"
						class="group relative px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
						onclick={() => window.open('https://www.linkedin.com/in/nicolaspaulus/', '_blank')}
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
							/>
						</svg>
						<span class="font-medium">LinkedIn</span>
					</button>
					<button
						type="button"
						class="group relative px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
						onclick={() =>
							window.open('https://steamcommunity.com/profiles/76561197978880770/', '_blank')}
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M11.979 14.373c-1.378 0-2.492-1.113-2.492-2.492s1.114-2.492 2.492-2.492 2.492 1.113 2.492 2.492-1.113 2.492-2.492 2.492zm11.475-2.492c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-5-.5c-.028-3.223-2.644-5.839-5.867-5.867v-2.063c4.36.028 7.902 3.57 7.93 7.93h-2.063zm-5.867-3.778c2.2.028 3.978 1.806 4.006 4.006h2.063c-.028-3.337-2.732-6.041-6.069-6.069v2.063z"
							/>
						</svg>
						<span class="font-medium">Steam</span>
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

<!-- Animation de confettis -->
{#if showConfetti}
	<div class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
		<div class="confetti-container">
			{#each Array.from({ length: 50 }, (_, i) => i) as i (i)}
				<div
					class="confetti absolute animate-pulse"
					style="
						left: {Math.random() * 100}%;
						top: -10px;
						animation-delay: {Math.random() * 2}s;
						animation-duration: {2 + Math.random() * 2}s;
					"
				>
					<div
						class="w-3 h-3 rounded-full"
						style="background-color: {[
							'#f87171',
							'#fbbf24',
							'#34d399',
							'#60a5fa',
							'#a78bfa',
							'#f472b6'
						][Math.floor(Math.random() * 6)]}"
					></div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.confetti {
		animation: confetti-fall linear forwards;
	}

	@keyframes confetti-fall {
		to {
			transform: translateY(100vh) rotate(360deg);
			opacity: 0;
		}
	}
</style>
