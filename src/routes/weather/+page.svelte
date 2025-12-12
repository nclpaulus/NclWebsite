<script lang="ts">
	/** Page météo avec widget, prévisions, historique et gestion API key. */
	import { onMount } from 'svelte';
	import WeatherCard from '$lib/components/weather/WeatherCard.svelte';
	import ForecastList from '$lib/components/weather/ForecastList.svelte';
	import WeatherMap from '$lib/components/weather/WeatherMap.svelte';
	import WeatherHistory from '$lib/components/weather/WeatherHistory.svelte';
	import { weatherStore } from '$lib/stores/weather.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';

	let loading = true;
	let error: string | null = null;
	let apiKeyMissing = false;

	onMount(async () => {
		// Check if API key is configured
		if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
			apiKeyMissing = true;
			loading = false;
			return;
		}

		try {
			await weatherStore.initializeWeather();
		} catch (err) {
			console.error('Error in initializeWeather:', err);
			error = err instanceof Error ? err.message : 'Erreur lors du chargement des données météo';
		} finally {
			loading = false;
		}
	});

	async function refreshWeather() {
		if (apiKeyMissing) return;

		loading = true;
		error = null;
		try {
			await weatherStore.refreshWeatherData();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur lors du rafraîchissement';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Météo Interactive - NPaulusWebsite</title>
	<meta
		name="description"
		content="Explorez les prévisions météo sur 7 jours, cartes interactives, et historique des données avec géolocalisation automatique."
	/>
</svelte:head>

<section
	class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900"
>
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
				🌤️ Météo Interactive
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
				Prévisions sur 7 jours, cartes interactives et historique des données
			</p>
		</div>

		{#if loading}
			<div class="flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		{:else if apiKeyMissing}
			<Card class="max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
				<div class="p-8 text-center">
					<div class="text-yellow-600 text-4xl mb-4">🔑</div>
					<h2 class="text-2xl font-bold text-yellow-800 mb-4">Clé API OpenWeatherMap requise</h2>
					<div class="text-yellow-700 mb-6 space-y-3">
						<p>Pour utiliser la section météo, vous devez configurer une clé API OpenWeatherMap.</p>
						<div class="bg-yellow-100 rounded-lg p-4 text-left">
							<ol class="list-decimal list-inside space-y-2 text-sm">
								<li>
									Créez un compte gratuit sur <a
										href="https://openweathermap.org/api"
										target="_blank"
										class="underline text-yellow-800 hover:text-yellow-900">OpenWeatherMap</a
									>
								</li>
								<li>Obtenez votre clé API (1000 appels/jour gratuits)</li>
								<li>
									Créez un fichier <code class="bg-yellow-200 px-1 rounded">.env</code> à la racine du
									projet
								</li>
								<li>
									Ajoutez votre clé: <code class="bg-yellow-200 px-1 rounded"
										>VITE_OPENWEATHER_API_KEY=votre_clé_ici</code
									>
								</li>
								<li>Redémarrez le serveur de développement</li>
							</ol>
						</div>
					</div>
					<Button
						onclick={() => window.location.reload()}
						class="bg-yellow-600 hover:bg-yellow-700"
					>
						🔄 Actualiser après configuration
					</Button>
				</div>
			</Card>
		{:else if error}
			<Card class="max-w-md mx-auto bg-red-50 border-red-200">
				<div class="p-6 text-center">
					<div class="text-red-600 text-xl mb-2">⚠️ Erreur</div>
					<p class="text-red-700">{error}</p>
					<Button onclick={refreshWeather} class="mt-4">Réessayer</Button>
				</div>
			</Card>
		{:else}
			<!-- Current Weather -->
			{#if $weatherStore.currentWeather}
				<div class="mb-8">
					<WeatherCard weather={$weatherStore.currentWeather} />
				</div>
			{/if}

			<!-- Controls -->
			<div class="flex justify-center gap-4 mb-8">
				<Button onclick={refreshWeather} variant="outline">🔄 Rafraîchir</Button>
				<Button onclick={() => weatherStore.toggleLocation()} variant="outline">
					📍 {$weatherStore.useCurrentLocation ? 'Changer de ville' : 'Utiliser ma position'}
				</Button>
			</div>

			<!-- 7-day Forecast -->
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
					📅 Prévisions sur 7 jours
				</h2>
				<ForecastList forecasts={$weatherStore.forecast} />
			</div>

			<!-- Interactive Map -->
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
					🗺️ Carte Météo Interactive
				</h2>
				<WeatherMap
					latitude={$weatherStore.location?.lat || 48.8566}
					longitude={$weatherStore.location?.lon || 2.3522}
				/>
			</div>

			<!-- Weather History -->
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
					📊 Historique des données
				</h2>
				<WeatherHistory history={$weatherStore.history} />
			</div>
		{/if}
	</div>
</section>
