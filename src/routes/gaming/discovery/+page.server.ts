import type { PageServerLoad } from './$types';

interface Game {
	id: number;
	title: string;
	thumbnail: string;
	short_description: string;
	game_url: string;
	genre: string;
	platform: string;
	publisher: string;
	developer: string;
	release_date: string;
	freetogame_profile_url: string;
}

// Fallback games data when API fails
const fallbackGames: Game[] = [
	{
		id: 1,
		title: 'League of Legends',
		thumbnail: 'https://www.freetogame.com/g/1/thumbnail.jpg',
		short_description: 'A multiplayer online battle arena game.',
		game_url: 'https://www.freetogame.com/open/league-of-legends',
		genre: 'MOBA',
		platform: 'PC (Windows)',
		publisher: 'Riot Games',
		developer: 'Riot Games',
		release_date: '2009-10-27',
		freetogame_profile_url: 'https://www.freetogame.com/league-of-legends'
	},
	{
		id: 2,
		title: 'Fortnite',
		thumbnail: 'https://www.freetogame.com/g/2/thumbnail.jpg',
		short_description: 'A battle royale game with building mechanics.',
		game_url: 'https://www.freetogame.com/open/fortnite',
		genre: 'Battle Royale',
		platform: 'PC (Windows)',
		publisher: 'Epic Games',
		developer: 'Epic Games',
		release_date: '2017-07-25',
		freetogame_profile_url: 'https://www.freetogame.com/fortnite'
	},
	{
		id: 3,
		title: 'Apex Legends',
		thumbnail: 'https://www.freetogame.com/g/3/thumbnail.jpg',
		short_description: 'A free-to-play battle royale game.',
		game_url: 'https://www.freetogame.com/open/apex-legends',
		genre: 'Battle Royale',
		platform: 'PC (Windows)',
		publisher: 'Electronic Arts',
		developer: 'Respawn Entertainment',
		release_date: '2019-02-04',
		freetogame_profile_url: 'https://www.freetogame.com/apex-legends'
	}
];

// Retry function with exponential backoff
async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<Response> {
	for (let i = 0; i < maxRetries; i++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			const response = await fetch(url, {
				signal: controller.signal,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
				}
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response;
		} catch (error) {
			console.log(`Attempt ${i + 1} failed:`, error);

			if (i === maxRetries - 1) {
				throw error;
			}

			// Exponential backoff: wait 1s, 2s, 4s...
			const delay = Math.pow(2, i) * 1000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw new Error('Max retries exceeded');
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache the response for 1 hour
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	try {
		const response = await fetchWithRetry('https://www.freetogame.com/api/games');

		const allGames: Game[] = await response.json();

		// Get 15 random games
		const shuffled = [...allGames].sort(() => 0.5 - Math.random());
		const randomGames = shuffled.slice(0, 15);

		// Get unique genres for filtering
		const genres = [...new Set(allGames.map((game) => game.genre))].sort();

		// Get unique platforms for filtering
		const platforms = [...new Set(allGames.map((game) => game.platform))].sort();

		return {
			games: randomGames,
			allGames,
			genres,
			platforms
		};
	} catch (error) {
		console.error('Failed to fetch games after retries, using fallback data:', error);

		// Return fallback data if API fails
		const genres = [...new Set(fallbackGames.map((game) => game.genre))].sort();
		const platforms = [...new Set(fallbackGames.map((game) => game.platform))].sort();

		return {
			games: fallbackGames,
			allGames: fallbackGames,
			genres,
			platforms,
			usingFallback: true
		};
	}
};
