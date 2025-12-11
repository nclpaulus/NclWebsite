import type { PageServerLoad } from './$types';

interface Pokemon {
	id: number;
	name: string;
	url: string;
}

interface PokemonListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Pokemon[];
}

interface PokemonDetails {
	id: number;
	name: string;
	height: number;
	weight: number;
	types: Array<{
		type: {
			name: string;
			url: string;
		};
		slot: number;
	}>;
	stats: Array<{
		base_stat: number;
		effort: number;
		stat: {
			name: string;
			url: string;
		};
	}>;
	sprites: {
		front_default: string;
		other: {
			'official-artwork': {
				front_default: string;
			};
		};
	};
}

interface Type {
	name: string;
	url: string;
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Cache Pokémon data for 1 hour since it rarely changes
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	try {
		// Fetch the first 151 Pokémon (original generation)
		const pokemonListResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');

		if (!pokemonListResponse.ok) {
			throw new Error(`Failed to fetch Pokémon list: ${pokemonListResponse.status}`);
		}

		const pokemonList: PokemonListResponse = await pokemonListResponse.json();

		// Fetch detailed information for each Pokémon
		const pokemonDetails: PokemonDetails[] = await Promise.all(
			pokemonList.results.map(async (pokemon) => {
				const response = await fetch(pokemon.url);
				if (!response.ok) {
					throw new Error(`Failed to fetch ${pokemon.name}: ${response.status}`);
				}
				return response.json();
			})
		);

		// Extract all unique types
		const allTypes = new Set<string>();
		pokemonDetails.forEach((pokemon) => {
			pokemon.types.forEach((typeInfo) => {
				allTypes.add(typeInfo.type.name);
			});
		});

		// Get type information for filtering
		const typeInfo = await Promise.all(
			Array.from(allTypes).map(async (typeName) => {
				const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
				if (!response.ok) return null;
				return response.json();
			})
		);

		const types: Type[] = typeInfo
			.filter(Boolean)
			.map((type: { name: string; url: string }) => ({
				name: type.name,
				url: type.url
			}))
			.sort((a, b) => a.name.localeCompare(b.name));

		return {
			pokemon: pokemonDetails,
			types: types,
			totalCount: pokemonList.count
		};
	} catch (error) {
		console.error('Failed to load Pokémon data:', error);

		// Return empty data if API fails
		return {
			pokemon: [],
			types: [],
			totalCount: 0
		};
	}
};
