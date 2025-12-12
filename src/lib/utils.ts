import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine className avec clsx et tailwind-merge (shadcn/ui).
 *
 * @param inputs - Classes CSS (string, object, array).
 * @returns Chaîne de classes合并ée et dédupliquée.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Étend un type avec une propriété `ref` optionnelle pour éléments DOM. */
export type WithElementRef<T = object> = T & { ref?: HTMLElement | null | undefined };
