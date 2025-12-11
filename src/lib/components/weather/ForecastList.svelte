<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import type { ForecastData } from '$lib/stores/weather.svelte';

	export let forecasts: ForecastData[];

	function getWeatherIcon(iconCode: string): string {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const today = new Date();
		const tomorrow = new Date(today.getTime() + 86400000);

		if (date.toDateString() === today.toDateString()) {
			return "Aujourd'hui";
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Demain';
		} else {
			return date.toLocaleDateString('fr-FR', {
				weekday: 'long',
				month: 'short',
				day: 'numeric'
			});
		}
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
	{#each forecasts as forecast (forecast.date)}
		<Card class="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
			<div class="p-6">
				<div class="text-center mb-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						{formatDate(forecast.date)}
					</h3>
					<div class="flex justify-center mb-3">
						<img src={getWeatherIcon(forecast.icon)} alt={forecast.description} class="w-16 h-16" />
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-300 capitalize mb-4">
						{forecast.description}
					</p>
				</div>

				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="text-gray-600 dark:text-gray-400">Température</span>
						<div class="text-right">
							<span class="text-2xl font-bold text-gray-900 dark:text-white">
								{forecast.temp_max}°
							</span>
							<span class="text-lg text-gray-500 dark:text-gray-400">
								/{forecast.temp_min}°
							</span>
						</div>
					</div>

					<div class="flex justify-between items-center">
						<span class="text-gray-600 dark:text-gray-400">Humidité</span>
						<span class="font-medium text-gray-900 dark:text-white">
							{forecast.humidity}%
						</span>
					</div>

					<div class="flex justify-between items-center">
						<span class="text-gray-600 dark:text-gray-400">Vent</span>
						<span class="font-medium text-gray-900 dark:text-white">
							{Math.round(forecast.wind_speed * 3.6)} km/h
						</span>
					</div>
				</div>

				<!-- Temperature indicator -->
				<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="absolute h-full bg-linear-to-r from-blue-400 to-red-400 rounded-full"
							style="left: {Math.max(
								0,
								Math.min(100, ((forecast.temp_min + 10) / 50) * 100)
							)}%; width: {Math.max(
								5,
								Math.min(100, ((forecast.temp_max - forecast.temp_min) / 50) * 100)
							)}%"
						></div>
					</div>
				</div>
			</div>
		</Card>
	{/each}
</div>

{#if forecasts.length === 0}
	<Card class="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
		<div class="p-8 text-center">
			<div class="text-gray-500 dark:text-gray-400 text-lg">Aucune prévision disponible</div>
		</div>
	</Card>
{/if}
