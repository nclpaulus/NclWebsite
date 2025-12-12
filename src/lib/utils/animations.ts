import { onMount } from 'svelte';

export interface ScrollAnimationOptions {
	threshold?: number;
	rootMargin?: string;
	delay?: number;
}

export interface ScrollAnimationItem {
	element: HTMLElement;
	initialClasses: string[];
	activeClasses: string[];
	delay?: number;
}

/**
 * Configure les animations au scroll avec Intersection Observer
 * @param items Éléments à animer avec leurs classes
 * @param options Options de l'observer
 * @returns Fonction de cleanup
 */
export function setupScrollAnimation(
	items: ScrollAnimationItem[],
	options: ScrollAnimationOptions = {}
) {
	const { threshold = 0.1, rootMargin = '0px' } = options;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const item = items.find((i) => i.element === entry.target);
					if (item) {
						setTimeout(() => {
							item.element.classList.add(...item.activeClasses);
						}, item.delay || 0);
						observer.unobserve(entry.target);
					}
				}
			});
		},
		{ threshold, rootMargin }
	);

	// Appliquer les classes initiales et observer
	items.forEach((item) => {
		item.element.classList.add(...item.initialClasses);
		observer.observe(item.element);
	});

	// Retourner la fonction de cleanup
	return () => {
		items.forEach((item) => observer.unobserve(item.element));
	};
}

/**
 * Hook pour gérer les animations au scroll avec Intersection Observer
 * @param items Éléments à animer avec leurs classes
 * @param options Options de l'observer
 */
export function useScrollAnimation(
	items: ScrollAnimationItem[],
	options: ScrollAnimationOptions = {}
) {
	onMount(() => {
		const cleanup = setupScrollAnimation(items, options);
		return cleanup;
	});
}

/**
 * Configure les animations en cascade (staggered)
 * @param elements Éléments à animer
 * @param baseDelay Délai de base entre chaque élément (ms)
 * @param options Options supplémentaires
 * @returns Fonction de cleanup
 */
export function setupStaggeredAnimation(
	elements: HTMLElement[],
	baseDelay = 150,
	options: ScrollAnimationOptions & {
		initialClasses?: string[];
		activeClasses?: string[];
	} = {}
) {
	const {
		initialClasses = ['card-initial'],
		activeClasses = ['animate-in'],
		...observerOptions
	} = options;

	const items: ScrollAnimationItem[] = elements.map((element, index) => ({
		element,
		initialClasses,
		activeClasses,
		delay: index * baseDelay
	}));

	return setupScrollAnimation(items, observerOptions);
}

/**
 * Hook pour les animations en cascade (staggered)
 * @param elements Éléments à animer
 * @param baseDelay Délai de base entre chaque élément (ms)
 * @param options Options supplémentaires
 */
export function useStaggeredAnimation(
	elements: HTMLElement[],
	baseDelay = 150,
	options: ScrollAnimationOptions & {
		initialClasses?: string[];
		activeClasses?: string[];
	} = {}
) {
	onMount(() => {
		const cleanup = setupStaggeredAnimation(elements, baseDelay, options);
		return cleanup;
	});
}
