<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import type { Map, LeafletMouseEvent } from 'leaflet';

	export let latitude: number;
	export let longitude: number;

	let mapContainer: HTMLDivElement;
	let map: Map | null = null;
	let L: typeof import('leaflet');

	onMount(async () => {
		try {
			// Dynamically import Leaflet to avoid SSR issues
			const leafletModule = await import('leaflet');
			L = leafletModule.default;

			// Import CSS
			await import('leaflet/dist/leaflet.css');

			// Fix for default markers
			delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl:
					'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
				iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
			});

			// Initialize map
			map = L.map(mapContainer).setView([latitude, longitude], 10);

			// Add tile layer
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors'
			}).addTo(map);

			// Add weather layers
			const weatherLayers = {
				Précipitations: L.tileLayer(
					`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
					{
						attribution: '© OpenWeatherMap'
					}
				),
				Température: L.tileLayer(
					`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
					{
						attribution: '© OpenWeatherMap'
					}
				),
				Nuages: L.tileLayer(
					`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
					{
						attribution: '© OpenWeatherMap'
					}
				),
				Pression: L.tileLayer(
					`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
					{
						attribution: '© OpenWeatherMap'
					}
				),
				Vent: L.tileLayer(
					`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
					{
						attribution: '© OpenWeatherMap'
					}
				)
			};

			// Add layer control
			L.control
				.layers(
					weatherLayers,
					{},
					{
						position: 'topright'
					}
				)
				.addTo(map);

			// Add current location marker
			const marker = L.marker([latitude, longitude]).addTo(map);
			marker
				.bindPopup(
					`<b>Position actuelle</b><br>Lat: ${latitude.toFixed(4)}<br>Lon: ${longitude.toFixed(4)}`
				)
				.openPopup();

			// Add click handler for getting weather at clicked location
			map.on('click', async (e: LeafletMouseEvent) => {
				const { lat, lng } = e.latlng;
				await getWeatherForLocation(lat, lng);
			});
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});

	async function getWeatherForLocation(lat: number, lon: number) {
		try {
			// This would integrate with your weather store to get weather for clicked location
			console.log(`Getting weather for ${lat}, ${lon}`);
			// You could emit an event or call a callback here
		} catch (error) {
			console.error('Error getting weather for location:', error);
		}
	}

	function getCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude: lat, longitude: lng } = position.coords;
					if (map) {
						map.setView([lat, lng], 12);
						// Update marker position
						L.marker([lat, lng])
							.addTo(map)
							.bindPopup(
								`<b>Nouvelle position</b><br>Lat: ${lat.toFixed(4)}<br>Lon: ${lng.toFixed(4)}`
							)
							.openPopup();
					}
				},
				(error) => {
					console.error('Error getting location:', error);
				}
			);
		}
	}
</script>

<Card class="bg-white dark:bg-gray-800 shadow-lg">
	<div class="p-6">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Carte Météo Interactive</h3>
			<button
				onclick={getCurrentLocation}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
			>
				📍 Ma position
			</button>
		</div>

		<div class="relative">
			<div
				bind:this={mapContainer}
				class="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
			></div>

			<div
				class="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700"
			>
				<p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
					<strong>Cliquez</strong> sur la carte pour obtenir la météo
				</p>
				<p class="text-xs text-gray-600 dark:text-gray-400">
					<strong>Layers:</strong> Utilisez le contrôle en haut à droite
				</p>
			</div>
		</div>

		<div
			class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400"
		>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-blue-500 rounded"></div>
				<span>Précipitations</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-red-500 rounded"></div>
				<span>Température</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-gray-500 rounded"></div>
				<span>Nuages</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded"></div>
				<span>Vent</span>
			</div>
		</div>
	</div>
</Card>
