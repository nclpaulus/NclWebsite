import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

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
		back_default: string;
		other: {
			'official-artwork': {
				front_default: string;
			};
		};
	};
	abilities: Array<{
		ability: {
			name: string;
			url: string;
		};
		is_hidden: boolean;
		slot: number;
	}>;
	moves: Array<{
		move: {
			name: string;
			url: string;
		};
		version_group_details: Array<{
			level_learned_at: number;
			move_learn_method: {
				name: string;
				url: string;
			};
			version_group: {
				name: string;
				url: string;
			};
		}>;
	}>[];
	evolution_chain?: {
		url: string;
	};
}

interface TypeInfo {
	name: string;
	damage_relations: {
		double_damage_from: Array<{
			name: string;
		}>;
		double_damage_to: Array<{
			name: string;
		}>;
		half_damage_from: Array<{
			name: string;
		}>;
		half_damage_to: Array<{
			name: string;
		}>;
		no_damage_from: Array<{
			name: string;
		}>;
		no_damage_to: Array<{
			name: string;
		}>;
	};
}

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	// Cache Pokémon data for 1 hour
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});

	const pokemonName = params.name.toLowerCase();

	try {
		// Fetch Pokémon details
		const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

		if (!pokemonResponse.ok) {
			if (pokemonResponse.status === 404) {
				throw error(404, `Pokémon "${pokemonName}" non trouvé`);
			}
			throw error(500, `Erreur lors du chargement du Pokémon: ${pokemonResponse.status}`);
		}

		const pokemon: PokemonDetails = await pokemonResponse.json();

		// Fetch type information for weaknesses/resistances
		const typePromises = pokemon.types.map(async (typeInfo) => {
			const response = await fetch(typeInfo.type.url);
			if (!response.ok) return null;
			return response.json();
		});

		const typeData = await Promise.all(typePromises);
		const types: TypeInfo[] = typeData.filter(Boolean);

		// Fetch evolution chain if available
		let evolutionChain = null;
		if (pokemon.evolution_chain) {
			const evolutionResponse = await fetch(pokemon.evolution_chain.url);
			if (evolutionResponse.ok) {
				evolutionChain = await evolutionResponse.json();
			}
		}

		return {
			pokemon,
			types,
			evolutionChain
		};
	} catch (err) {
		console.error('Failed to load Pokémon details:', err);
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		throw error(500, 'Erreur serveur lors du chargement du Pokémon');
	}
};
