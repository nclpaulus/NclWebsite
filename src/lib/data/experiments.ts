import type { LabExperiment } from '$lib/types/content';

export const experiments: LabExperiment[] = [
	{
		slug: 'profile-switcher-animation',
		title: 'Profile Switcher Animation',
		description: 'Système de changement de profil avec animations fluides et persistance locale',
		problem:
			'Comment permettre aux utilisateurs de basculer entre différents contextes (professionnel/personnel) avec une expérience utilisateur fluide ?',
		solution:
			"Implémentation d'un sélecteur de profil avec animations CSS personnalisées, stockage local et transitions Svelte",
		techStack: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'localStorage'],
		liveUrl: '/',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'demo',
		date: '2024-12-10',
		difficulty: 'medium',
		tags: ['animation', 'ux', 'svelte', 'state-management']
	},
	{
		slug: 'gaming-api-integration',
		title: 'Gaming API Integration',
		description: 'Intégration de PokéAPI pour afficher des données de jeux en temps réel',
		problem:
			'Comment consommer une API externe (PokéAPI) avec SvelteKit en utilisant les server-side functions ?',
		solution:
			'Utilisation de +page.server.ts pour charger les données côté serveur, gestion des erreurs et affichage conditionnel',
		techStack: ['SvelteKit', 'TypeScript', 'PokéAPI', 'Server Functions'],
		liveUrl: '/gaming',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'poc',
		date: '2024-12-08',
		difficulty: 'easy',
		tags: ['api', 'gaming', 'server-side', 'typescript']
	},
	{
		slug: 'component-library-builder',
		title: 'Component Library Builder',
		description: 'Outil pour créer et prévisualiser des composants UI réutilisables',
		problem:
			'Comment développer rapidement des composants UI avec documentation intégrée et prévisualisation en direct ?',
		solution:
			"Création d'un système de composants avec shadcn-svelte, documentation automatique et playground interactif",
		techStack: ['Svelte', 'Tailwind CSS', 'shadcn-svelte', 'TypeScript'],
		liveUrl: '/',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'tool',
		date: '2024-12-05',
		difficulty: 'hard',
		tags: ['components', 'ui', 'library', 'documentation']
	},
	{
		slug: 'tailwind-v4-migration',
		title: 'Tailwind v4 Migration',
		description: 'Migration complète de Tailwind CSS v3 vers v4 avec nouvelle syntaxe @theme',
		problem:
			'Comment migrer un projet existant de Tailwind v3 à v4 en conservant tous les styles et en adoptant les nouvelles fonctionnalités ?',
		solution:
			'Migration progressive avec @theme inline, optimisation des performances et mise à jour des composants shadcn',
		techStack: ['Tailwind CSS v4', 'PostCSS', 'SvelteKit', 'CSS'],
		liveUrl: '/',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'demo',
		date: '2024-12-01',
		difficulty: 'medium',
		tags: ['tailwind', 'css', 'migration', 'performance']
	},
	{
		slug: 'dynamic-form-generator',
		title: 'Dynamic Form Generator',
		description: 'Générateur de formulaires dynamiques avec validation TypeScript',
		problem:
			'Comment créer des formulaires complexes avec validation sans écrire de code répétitif ?',
		solution:
			'Système de configuration JSON pour générer des formulaires avec validation automatique et types sécurisés',
		techStack: ['Svelte', 'TypeScript', 'Form Validation', 'JSON Schema'],
		liveUrl: '/',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'tool',
		date: '2024-11-28',
		difficulty: 'medium',
		tags: ['forms', 'validation', 'typescript', 'generator']
	}
];

export function getExperimentBySlug(slug: string): LabExperiment | undefined {
	return experiments.find((exp) => exp.slug === slug);
}

export function getExperimentsByType(type: LabExperiment['type']): LabExperiment[] {
	return experiments.filter((exp) => exp.type === type);
}

export function getExperimentsByTag(tag: string): LabExperiment[] {
	return experiments.filter((exp) => exp.tags.includes(tag));
}
