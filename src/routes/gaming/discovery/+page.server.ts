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

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache the response for 1 hour
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	try {
		const response = await fetch('https://www.freetogame.com/api/games');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

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
		console.error('Failed to fetch games:', error);

		// Return empty data if API fails
		return {
			games: [],
			allGames: [],
			genres: [],
			platforms: []
		};
	}
};
