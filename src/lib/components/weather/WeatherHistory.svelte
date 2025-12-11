<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import type { WeatherHistory } from '$lib/stores/weather.svelte';

	export let history: WeatherHistory[];

	function formatHistoryDate(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
		} else if (diffDays === 1) {
			return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
		} else if (diffDays < 7) {
			return `Il y a ${diffDays} jours`;
		} else {
			return date.toLocaleDateString('fr-FR', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit'
			});
		}
	}

	function getWeatherIcon(iconCode: string): string {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	}

	function clearHistory() {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('weather-history');
			history = [];
		}
	}

	function exportHistory() {
		if (history.length === 0) return;

		const dataStr = JSON.stringify(history, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `weather-history-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	$: averageTemp =
		history.length > 0
			? Math.round(history.reduce((sum, item) => sum + item.data.temp, 0) / history.length)
			: 0;

	$: maxTemp = history.length > 0 ? Math.max(...history.map((item) => item.data.temp)) : 0;

	$: minTemp = history.length > 0 ? Math.min(...history.map((item) => item.data.temp)) : 0;
</script>

<Card class="bg-white dark:bg-gray-800 shadow-lg">
	<div class="p-6">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
				📊 Historique des consultations
			</h3>
			<div class="flex gap-2">
				{#if history.length > 0}
					<Button onclick={exportHistory} variant="outline" size="sm" class="text-xs">
						📥 Exporter
					</Button>
					<Button
						onclick={clearHistory}
						variant="outline"
						size="sm"
						class="text-xs text-red-600 hover:text-red-700"
					>
						🗑️ Effacer
					</Button>
				{/if}
			</div>
		</div>

		{#if history.length === 0}
			<div class="text-center py-8 text-gray-500 dark:text-gray-400">
				<div class="text-4xl mb-3">📝</div>
				<p>Aucun historique disponible</p>
				<p class="text-sm mt-2">Les données météo s'ajouteront automatiquement ici</p>
			</div>
		{:else}
			<!-- Statistics -->
			<div class="grid grid-cols-3 gap-4 mb-6">
				<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
					<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{averageTemp}°C</div>
					<div class="text-xs text-blue-600 dark:text-blue-400">Température moyenne</div>
				</div>
				<div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
					<div class="text-2xl font-bold text-red-600 dark:text-red-400">{maxTemp}°C</div>
					<div class="text-xs text-red-600 dark:text-red-400">Maximum</div>
				</div>
				<div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
					<div class="text-2xl font-bold text-green-600 dark:text-green-400">{minTemp}°C</div>
					<div class="text-xs text-green-600 dark:text-green-400">Minimum</div>
				</div>
			</div>

			<!-- History List -->
			<div class="space-y-3 max-h-96 overflow-y-auto">
				{#each history as item, index (index)}
					<div
						class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					>
						<div class="flex items-center gap-3">
							<div class="text-sm text-gray-500 dark:text-gray-400 font-mono">
								#{history.length - index}
							</div>
							<img
								src={getWeatherIcon(item.data.icon)}
								alt={item.data.description}
								class="w-10 h-10"
							/>
							<div>
								<div class="font-medium text-gray-900 dark:text-white">
									{item.data.city}, {item.data.country}
								</div>
								<div class="text-sm text-gray-600 dark:text-gray-400 capitalize">
									{item.data.description}
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-500">
									{formatHistoryDate(item.date)}
								</div>
							</div>
						</div>
						<div class="text-right">
							<div class="text-2xl font-bold text-gray-900 dark:text-white">
								{item.data.temp}°C
							</div>
							<div class="text-xs text-gray-500 dark:text-gray-400">
								Ressenti {item.data.feels_like}°C
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
				<p class="text-xs text-gray-500 dark:text-gray-400 text-center">
					{history.length} consultation{history.length > 1 ? 's' : ''} enregistrée{history.length >
					1
						? 's'
						: ''}
				</p>
			</div>
		{/if}
	</div>
</Card>
