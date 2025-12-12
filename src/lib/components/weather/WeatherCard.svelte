<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import type { WeatherData } from '$lib/stores/weather.svelte';

	export let weather: WeatherData;

	function getWeatherIcon(iconCode: string): string {
		return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
	}

	function getWindDirection(deg: number): string {
		const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		const index = Math.round(deg / 45) % 8;
		return directions[index];
	}

	function formatTime(timestamp: number): string {
		return new Date(timestamp).toLocaleTimeString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<Card class="bg-linear-to-br from-blue-400 to-blue-600 text-white shadow-xl">
	<div class="p-8">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-3xl font-bold mb-2">
					{weather.city}, {weather.country}
				</h2>
				<p class="text-blue-100">{formatTime(weather.timestamp)}</p>
			</div>
			<div class="text-right">
				<div class="text-5xl font-bold">{weather.temp}°C</div>
				<p class="text-blue-100 mt-1">Ressenti {weather.feels_like}°C</p>
			</div>
		</div>

		<div class="flex items-center justify-center mb-6">
			<img src={getWeatherIcon(weather.icon)} alt={weather.description} class="w-24 h-24" />
			<div class="ml-4">
				<p class="text-2xl font-semibold capitalize">{weather.description}</p>
				<p class="text-blue-100 capitalize">{weather.main}</p>
			</div>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="bg-white/20 rounded-lg p-3 text-center">
				<div class="text-blue-100 text-sm mb-1">Humidité</div>
				<div class="text-xl font-semibold">{weather.humidity}%</div>
			</div>
			<div class="bg-white/20 rounded-lg p-3 text-center">
				<div class="text-blue-100 text-sm mb-1">Pression</div>
				<div class="text-xl font-semibold">{weather.pressure} hPa</div>
			</div>
			<div class="bg-white/20 rounded-lg p-3 text-center">
				<div class="text-blue-100 text-sm mb-1">Vent</div>
				<div class="text-xl font-semibold">
					{Math.round(weather.wind_speed * 3.6)} km/h
				</div>
				<div class="text-sm text-blue-100">{getWindDirection(weather.wind_deg)}</div>
			</div>
			<div class="bg-white/20 rounded-lg p-3 text-center">
				<div class="text-blue-100 text-sm mb-1">Direction</div>
				<div class="text-xl font-semibold">{weather.wind_deg}°</div>
			</div>
		</div>
	</div>
</Card>
