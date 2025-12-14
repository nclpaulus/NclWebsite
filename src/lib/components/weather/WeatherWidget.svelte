<script lang="ts">
	import { weatherStore, type WeatherData } from '$lib/stores/weather.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { slide, scale } from 'svelte/transition';
	import { WEATHER_BASE_PATH } from '$lib/demos/weather';
	import { goto } from '$app/navigation';

	interface Props {
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		size?: 'sm' | 'md' | 'lg';
		autoInitialize?: boolean;
	}

	let { position = 'bottom-right', size = 'md', autoInitialize = true }: Props = $props();

	let isExpanded = $state(false);
	let widgetRef: HTMLDivElement;
	let weatherData = $state<WeatherData | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Position classes
	const positionClasses = {
		'bottom-right': 'fixed bottom-4 right-4',
		'bottom-left': 'fixed bottom-4 left-4',
		'top-right': 'fixed top-4 right-4',
		'top-left': 'fixed top-4 left-4'
	};

	// Size classes
	const sizeClasses = {
		sm: {
			collapsed: 'w-12 h-12',
			expanded: 'w-64',
			icon: 'text-xl'
		},
		md: {
			collapsed: 'w-14 h-14',
			expanded: 'w-80',
			icon: 'text-2xl'
		},
		lg: {
			collapsed: 'w-16 h-16',
			expanded: 'w-96',
			icon: 'text-3xl'
		}
	};

	// Subscribe to weather store
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = weatherStore.subscribe((state) => {
			weatherData = state.currentWeather;
			loading = state.loading;
			error = state.error;
		});

		// Initialize weather if not already loaded and autoInitialize is true
		if (autoInitialize && !weatherData && !loading) {
			weatherStore.initializeWeather();
		}
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	// Toggle expand/collapse
	function toggleWidget(event: MouseEvent) {
		event.stopPropagation();
		if (loading || error) return;
		isExpanded = !isExpanded;
	}

	// Click outside to close
	function handleClickOutside(event: MouseEvent) {
		if (!isExpanded) return;
		if (!widgetRef?.contains(event.target as Node)) {
			isExpanded = false;
		}
	}

	// Keyboard support
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isExpanded) {
			isExpanded = false;
		}
	}

	// Get weather icon URL
	function getWeatherIcon(iconCode: string): string {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	}

	// Format temperature
	function formatTemp(temp: number): string {
		return `${Math.round(temp)}°C`;
	}

	// Go to full weather page
	function goToWeatherPage() {
		window.location.href = WEATHER_BASE_PATH;
	}
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div bind:this={widgetRef} class="{positionClasses[position]} z-50">
	<!-- Collapsed State -->
	{#if !isExpanded}
		<button
			onclick={toggleWidget}
			class="{sizeClasses[size]
				.collapsed} bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-background"
			disabled={loading && !weatherData}
			title={loading
				? 'Chargement...'
				: error
					? 'Erreur météo'
					: weatherData
						? `${weatherData.temp}°C - ${weatherData.description}`
						: 'Météo'}
		>
			{#if loading && !weatherData}
				<div class="animate-spin {sizeClasses[size].icon}">⏳</div>
			{:else if error}
				<div class={sizeClasses[size].icon}>❌</div>
			{:else if weatherData}
				<img
					src={getWeatherIcon(weatherData.icon)}
					alt={weatherData.description}
					class={size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10'}
				/>
			{:else}
				<div class={sizeClasses[size].icon}>🌤️</div>
			{/if}
		</button>
	{/if}

	<!-- Expanded State -->
	{#if isExpanded}
		<div
			class="bg-card border border-border rounded-lg shadow-xl p-4 {sizeClasses[size].expanded}"
			transition:scale={{ duration: 200 }}
		>
			<!-- Header with close button -->
			<div
				class="flex justify-between items-start mb-3"
				transition:slide={{ duration: 150, delay: 50 }}
			>
				{#if loading && !weatherData}
					<!-- Loading skeleton -->
					<div class="flex items-center gap-2">
						<div class="w-10 h-10 bg-muted rounded animate-pulse"></div>
						<div>
							<div class="h-4 w-24 bg-muted rounded animate-pulse mb-1"></div>
							<div class="h-3 w-16 bg-muted rounded animate-pulse"></div>
						</div>
					</div>
				{:else if error}
					<div class="flex items-center gap-2">
						<div class="w-10 h-10 bg-destructive/20 rounded flex items-center justify-center">
							❌
						</div>
						<div>
							<h3 class="font-semibold text-destructive">Erreur</h3>
							<p class="text-sm text-muted-foreground">{error}</p>
						</div>
					</div>
				{:else if weatherData}
					<div class="flex items-center gap-2">
						<img
							src={getWeatherIcon(weatherData.icon)}
							alt={weatherData.description}
							class="w-10 h-10"
						/>
						<div>
							<h3 class="font-semibold text-foreground">
								{weatherData.city}, {weatherData.country}
							</h3>
							<p class="text-sm text-muted-foreground capitalize">{weatherData.description}</p>
						</div>
					</div>
				{/if}

				<button
					onclick={() => (isExpanded = false)}
					class="text-muted-foreground hover:text-foreground transition-colors"
					title="Fermer"
					aria-label="Fermer le widget météo"
					type="button"
				>
					✕
				</button>
			</div>

			<!-- Current weather data -->
			{#if weatherData}
				<div class="grid grid-cols-2 gap-3 mb-4" transition:slide={{ duration: 150, delay: 100 }}>
					<div class="bg-muted/50 rounded p-2 text-center">
						<div class="text-2xl font-bold text-primary">{formatTemp(weatherData.temp)}</div>
						<div class="text-xs text-muted-foreground">Température</div>
					</div>
					<div class="bg-muted/50 rounded p-2 text-center">
						<div class="text-2xl font-bold text-primary">{formatTemp(weatherData.feels_like)}</div>
						<div class="text-xs text-muted-foreground">Ressenti</div>
					</div>
					<div class="bg-muted/50 rounded p-2 text-center">
						<div class="text-lg font-bold text-primary">{weatherData.humidity}%</div>
						<div class="text-xs text-muted-foreground">Humidité</div>
					</div>
					<div class="bg-muted/50 rounded p-2 text-center">
						<div class="text-lg font-bold text-primary">{weatherData.wind_speed} m/s</div>
						<div class="text-xs text-muted-foreground">Vent</div>
					</div>
				</div>

				<!-- Action buttons -->
				<div class="flex gap-2" transition:slide={{ duration: 150, delay: 150 }}>
					<button
						onclick={goToWeatherPage}
						class="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded text-sm font-medium transition-colors"
					>
						📊 Voir détails
					</button>
					<button
						onclick={() => weatherStore.refreshWeatherData()}
						class="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded text-sm font-medium transition-colors"
						title="Actualiser"
					>
						🔄
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
