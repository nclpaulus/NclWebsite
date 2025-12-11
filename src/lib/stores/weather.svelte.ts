import { writable, get as getStoreValue } from 'svelte/store';

export interface WeatherData {
	temp: number;
	feels_like: number;
	humidity: number;
	pressure: number;
	wind_speed: number;
	wind_deg: number;
	description: string;
	icon: string;
	main: string;
	city: string;
	country: string;
	timestamp: number;
}

export interface ForecastData {
	date: string;
	temp_min: number;
	temp_max: number;
	description: string;
	icon: string;
	humidity: number;
	wind_speed: number;
}

export interface Location {
	lat: number;
	lon: number;
	city?: string;
	country?: string;
}

export interface OpenWeatherForecastItem {
	dt: number;
	main: {
		temp: number;
		humidity: number;
	};
	wind: {
		speed: number;
	};
	weather: Array<{
		description: string;
		icon: string;
	}>;
}

export interface WeatherHistory {
	date: string;
	data: WeatherData;
}

interface WeatherState {
	currentWeather: WeatherData | null;
	forecast: ForecastData[];
	location: Location | null;
	history: WeatherHistory[];
	useCurrentLocation: boolean;
	loading: boolean;
	error: string | null;
	lastFetchTime: number;
}

const initialState: WeatherState = {
	currentWeather: null,
	forecast: [],
	location: null,
	history: [],
	useCurrentLocation: true,
	loading: false,
	error: null,
	lastFetchTime: 0
};

function createWeatherStore() {
	const { subscribe, update } = writable<WeatherState>(initialState);

	// Get current location
	async function getCurrentLocation(): Promise<Location> {
		console.log('getCurrentLocation called');
		return new Promise((resolve) => {
			if (!navigator.geolocation) {
				console.log('Geolocation not supported, using Liège');
				resolve({ lat: 50.6325, lon: 5.5797, city: 'Liège', country: 'BE' });
				return;
			}

			console.log('Requesting geolocation...');
			const timeoutId = setTimeout(() => {
				console.log('Geolocation timeout, using Liège as fallback');
				resolve({ lat: 50.6325, lon: 5.5797, city: 'Liège', country: 'BE' });
			}, 5000); // 5 second timeout

			navigator.geolocation.getCurrentPosition(
				async (position) => {
					clearTimeout(timeoutId);
					console.log('Geolocation position obtained:', position);
					const { latitude, longitude } = position.coords;
					try {
						console.log('Calling reverseGeocode for:', latitude, longitude);
						const location = await reverseGeocode(latitude, longitude);
						console.log('Reverse geocode result:', location);
						resolve(location);
					} catch (error) {
						console.error('Reverse geocode error:', error);
						// Use Liège as fallback if reverse geocode fails
						resolve({ lat: 50.6325, lon: 5.5797, city: 'Liège', country: 'BE' });
					}
				},
				(error) => {
					clearTimeout(timeoutId);
					console.error('Geolocation error:', error);
					switch (error.code) {
						case error.PERMISSION_DENIED:
							console.error('Permission de géolocalisation refusée, utilisation de Liège');
							break;
						case error.POSITION_UNAVAILABLE:
							console.error('Position indisponible, utilisation de Liège');
							break;
						case error.TIMEOUT:
							console.error("Délai d'attente dépassé, utilisation de Liège");
							break;
					}
					// Always resolve with Liège instead of rejecting
					resolve({ lat: 50.6325, lon: 5.5797, city: 'Liège', country: 'BE' });
				}
			);
		});
	}

	// Save to history
	function saveToHistory(weather: WeatherData) {
		update((state) => {
			const newHistory = [
				{ date: new Date().toISOString(), data: weather },
				...state.history.slice(0, 29) // Keep last 30 entries
			];

			if (typeof window !== 'undefined') {
				localStorage.setItem('weather-history', JSON.stringify(newHistory));
			}

			return { ...state, history: newHistory };
		});
	}

	// Save weather data to cache
	function saveWeatherCache(
		currentWeather: WeatherData,
		forecast: ForecastData[],
		location: Location
	) {
		if (typeof window !== 'undefined') {
			const cache = {
				currentWeather,
				forecast,
				location,
				lastFetchTime: Date.now()
			};
			localStorage.setItem('weather-cache', JSON.stringify(cache));
		}
	}

	// Reverse geocoding
	async function reverseGeocode(lat: number, lon: number): Promise<Location> {
		console.log('API Key value:', import.meta.env.VITE_OPENWEATHER_API_KEY);
		const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
		if (!apiKey) {
			throw new Error('Clé API OpenWeatherMap non configurée');
		}
		const response = await fetch(
			`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
		);

		if (!response.ok) {
			throw new Error('Erreur de géocodage');
		}

		const data = await response.json();
		if (data.length === 0) {
			throw new Error('Position non trouvée');
		}

		return {
			lat,
			lon,
			city: data[0].name,
			country: data[0].country
		};
	}

	// Fetch current weather
	async function fetchCurrentWeather(location: Location): Promise<WeatherData> {
		console.log('fetchCurrentWeather called with:', location);
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=fr`;
		console.log('Fetching from URL:', url.replace(/appid=[^&]+/, 'appid=HIDDEN'));

		try {
			const response = await fetch(url);
			console.log('Response status:', response.status, response.statusText);

			if (!response.ok) {
				console.error('Response not OK:', response.status);
				throw new Error('Erreur lors de la récupération des données météo');
			}

			const data = await response.json();
			console.log('API response data:', data);

			const weatherData = {
				temp: Math.round(data.main.temp),
				feels_like: Math.round(data.main.feels_like),
				humidity: data.main.humidity,
				pressure: data.main.pressure,
				wind_speed: data.wind.speed,
				wind_deg: data.wind.deg,
				description: data.weather[0].description,
				icon: data.weather[0].icon,
				main: data.weather[0].main,
				city: data.name,
				country: data.sys.country,
				timestamp: Date.now()
			};
			console.log('Processed weather data:', weatherData);
			return weatherData;
		} catch (error) {
			console.error('Error in fetchCurrentWeather:', error);
			throw error;
		}
	}

	// Fetch 7-day forecast
	async function fetchForecast(location: Location): Promise<ForecastData[]> {
		console.log('fetchForecast called with location:', location);
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=fr`
		);

		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des prévisions');
		}

		const data = await response.json();
		console.log('API response data:', data);

		// Group by day and get daily forecasts
		const dailyForecasts: { [key: string]: OpenWeatherForecastItem[] } = {};
		console.log('Processing forecast list:', data.list);
		data.list.forEach((item: OpenWeatherForecastItem) => {
			console.log('Processing item:', item);
			const date = new Date(item.dt * 1000).toLocaleDateString();
			if (!dailyForecasts[date]) {
				dailyForecasts[date] = [];
			}
			dailyForecasts[date].push(item);
		});
		console.log('Daily forecasts grouped:', dailyForecasts);

		return Object.entries(dailyForecasts)
			.slice(0, 7)
			.map(([date, items]) => {
				const temps = items.map((item) => item.main.temp);
				const mainItem = items[Math.floor(items.length / 2)]; // Use midday as reference

				return {
					date,
					temp_min: Math.round(Math.min(...temps)),
					temp_max: Math.round(Math.max(...temps)),
					description: mainItem.weather[0].description,
					icon: mainItem.weather[0].icon,
					humidity: mainItem.main.humidity,
					wind_speed: mainItem.wind.speed
				};
			});
	}

	// Initialize weather
	async function initializeWeather() {
		console.log('=== initializeWeather called ===');
		const currentState = getStoreValue(weatherStore);
		const now = Date.now();
		const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

		console.log('Current state:', {
			lastFetchTime: currentState.lastFetchTime,
			currentWeather: !!currentState.currentWeather,
			forecastLength: currentState.forecast.length,
			useCurrentLocation: currentState.useCurrentLocation
		});

		// Check if we have recent cached data
		if (
			currentState.lastFetchTime &&
			now - currentState.lastFetchTime < CACHE_DURATION &&
			currentState.currentWeather &&
			currentState.forecast.length > 0
		) {
			console.log('Using cached weather data');
			return;
		}

		console.log('Fetching fresh weather data');
		update((state) => ({ ...state, loading: true, error: null }));

		try {
			let location: Location;

			if (currentState.useCurrentLocation) {
				console.log('Getting current location...');
				location = await getCurrentLocation();
				console.log('Current location obtained:', location);
			} else {
				console.log('Using default location (Paris)');
				location = { lat: 50.6325, lon: 5.5797 };
			}

			console.log('Location determined:', location);
			update((state) => ({ ...state, location }));

			console.log('Fetching current weather...');
			const currentWeather = await fetchCurrentWeather(location);
			console.log('Current weather fetched:', currentWeather);

			console.log('Fetching forecast...');
			const forecast = await fetchForecast(location);
			console.log('Forecast fetched:', forecast);

			update((state) => ({
				...state,
				currentWeather,
				forecast,
				location,
				loading: false,
				lastFetchTime: now
			}));

			saveToHistory(currentWeather);
			saveWeatherCache(currentWeather, forecast, location);
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur inconnue',
				loading: false
			}));
		}
	}

	// Refresh weather data
	async function refreshWeatherData() {
		const currentState = getStoreValue(weatherStore);
		if (!currentState.location) return;
		await initializeWeather();
	}

	// Toggle location mode
	function toggleLocation() {
		update((state) => ({
			...state,
			useCurrentLocation: !state.useCurrentLocation
		}));
		initializeWeather();
	}

	// Set custom location
	async function setCustomLocation(city: string) {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
			);

			if (!response.ok) {
				throw new Error('Ville non trouvée');
			}

			const data = await response.json();
			if (data.length === 0) {
				throw new Error('Ville non trouvée');
			}

			const location = {
				lat: data[0].lat,
				lon: data[0].lon,
				city: data[0].name,
				country: data[0].country
			};

			update((state) => ({ ...state, location, useCurrentLocation: false }));
			await refreshWeatherData();
		} catch (error) {
			update((state) => ({
				...state,
				error: error instanceof Error ? error.message : 'Erreur lors de la recherche de la ville'
			}));
		}
	}

	return {
		subscribe,
		initializeWeather,
		refreshWeatherData,
		toggleLocation,
		setCustomLocation,
		get: () => getStoreValue(weatherStore)
	};
}

export const weatherStore = createWeatherStore();
