import type { Project } from '$lib/types/content';
import { GARAGE_BASE_PATH } from '$lib/demos/garage';
import { KANBAN_BASE_PATH } from '$lib/demos/kanban';
import { WEATHER_BASE_PATH } from '$lib/demos/weather';

/**
 * Données statiques: liste des projets affichés dans la section Projects/Portfolio.
 */
export const projects: Project[] = [
	{
		slug: 'wecraft',
		title: 'WeCraft',
		description: 'Site portfolio personnel avec système de profils dynamiques et dashboard SaaS',
		context:
			'Projet personnel visant à créer un site web moderne et polyvalent avec gestion multi-profils',
		techStack: ['SvelteKit', 'TypeScript', 'Tailwind CSS v4', 'shadcn-svelte', 'Vite'],
		liveUrl: 'https://www.npaulus.website',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite',
		type: 'real',
		features: [
			'Système de profils dynamiques (professionnel/personnel)',
			'Dashboard SaaS avec statistiques',
			'Animations fluides et transitions',
			'Interface responsive design',
			'Optimisation des performances'
		],
		date: '2024-12-10',
		status: 'completed',
		tags: ['portfolio', 'saas', 'dashboard', 'sveltekit', 'typescript']
	},
	{
		slug: 'gaming-api-dashboard',
		title: 'Gaming API Dashboard',
		description: 'Dashboard interactif pour explorer et gérer des données de jeux via API externes',
		context:
			"Démonstration technique d'intégration d'API gaming avec interface utilisateur avancée",
		techStack: ['SvelteKit', 'TypeScript', 'PokéAPI', 'FreeToGame API', 'Chart.js'],
		liveUrl: '/gaming',
		githubUrl: 'https://github.com/nclpaulus/NclWebsite/tree/main/src/routes/gaming',
		type: 'demo',
		features: [
			'Intégration multiples APIs gaming',
			'Filtrage et recherche en temps réel',
			'Visualisation de données',
			'Pagination optimisée',
			'Gestion des erreurs API'
		],
		date: '2024-12-08',
		status: 'completed',
		tags: ['gaming', 'api', 'dashboard', 'typescript', 'data-visualization'],
		profile: 'gamer'
	},
	{
		slug: 'garage-management-system',
		title: 'Garage Management System',
		description:
			'Système de gestion pour garage automobile avec prise de rendez-vous et suivi des interventions',
		context: 'Projet fictif pour démontrer la capacité à créer une solution business complète',
		client: 'AutoPro Garage (fictif)',
		techStack: ['SvelteKit', 'TypeScript', 'Node.js', 'SQLite', 'Tailwind CSS'],
		liveUrl: GARAGE_BASE_PATH,
		githubUrl: 'https://github.com/nclpaulus/garage-management',
		type: 'mock',
		features: [
			'Prise de rendez-vous en ligne',
			'Suivi des interventions clients',
			'Gestion des stocks de pièces',
			'Facturation automatique',
			'Notifications clients SMS/Email'
		],
		date: '2024-12-05',
		status: 'completed',
		tags: ['business', 'management', 'booking', 'mock-client', 'fullstack']
	},
	{
		slug: 'task-manager-pro',
		title: 'Task Manager Pro',
		description:
			'Application de gestion de tâches collaborative avec tableaux Kanban et temps réel',
		context:
			"Clone simplifié de Trello/ClickUp démontrant les compétences en développement d'applications collaboratives",
		techStack: ['SvelteKit', 'TypeScript', 'WebSocket', 'PostgreSQL', 'Docker'],
		liveUrl: KANBAN_BASE_PATH,
		githubUrl: 'https://github.com/nclpaulus/task-manager',
		type: 'demo',
		features: [
			'Tableaux Kanban drag & drop',
			'Collaboration en temps réel',
			'Filtres et recherche avancés',
			'Export PDF/Excel',
			'API REST complète'
		],
		date: '2024-12-11',
		status: 'completed',
		tags: ['productivity', 'kanban', 'realtime', 'collaboration', 'api']
	},
	{
		slug: 'weather-dashboard',
		title: 'Weather Dashboard',
		description: 'Dashboard météo avec prévisions détaillées et visualisations interactives',
		context: 'Exploration des APIs météo et techniques de data visualization avec SvelteKit',
		techStack: ['SvelteKit', 'TypeScript', 'OpenWeather API', 'D3.js', 'PWA'],
		liveUrl: WEATHER_BASE_PATH,
		githubUrl: 'https://github.com/nclpaulus/weather-dashboard',
		type: 'demo',
		features: [
			'Prévisions sur 7 jours',
			'Cartes météo interactives',
			'Notifications météo PWA',
			'Géolocalisation automatique',
			'Historique des données'
		],
		date: '2024-11-25',
		status: 'completed',
		tags: ['weather', 'api', 'visualization', 'pwa', 'd3js']
	}
];

/** Récupère un projet par son `slug`. */
export function getProjectBySlug(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}

/** Filtre les projets par type (`real`/`demo`/`mock`). */
export function getProjectsByType(type: Project['type']): Project[] {
	return projects.filter((project) => project.type === type);
}

/** Filtre les projets par statut (`completed`, etc.). */
export function getProjectsByStatus(status: Project['status']): Project[] {
	return projects.filter((project) => project.status === status);
}

/** Filtre les projets contenant un tag donné. */
export function getProjectsByTag(tag: string): Project[] {
	return projects.filter((project) => project.tags.includes(tag));
}

/** Renvoie les projets “featured” (actuellement: 3 premiers projets complétés). */
export function getFeaturedProjects(): Project[] {
	return projects.filter((project) => project.status === 'completed').slice(0, 3);
}
