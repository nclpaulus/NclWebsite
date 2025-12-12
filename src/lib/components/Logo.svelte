<script lang="ts">
	// @ts-expect-error - vite-imagetools query params not recognized by TypeScript
	import logoPng from '$lib/assets/logo.png?w=64;128;256&format=webp;avif;png';

	// Create proper srcset and sizes for responsive images
	const logoSrcset = logoPng
		.map((url: string, index: number) => {
			const widths = [64, 128, 256];
			return `${url} ${widths[index]}w`;
		})
		.join(', ');

	const logoSizes = '(max-width: 640px) 64px, (max-width: 1024px) 128px, 256px';
	const logoSrc = logoPng[0];

	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
		withText?: boolean;
		textClass?: string;
		href?: string;
		ariaLabel?: string;
		fetchPriority?: 'high' | 'low' | 'auto';
		ariaCurrent?: string;
	}

	/**
	 * Logo.
	 *
	 * - Rend un `<img>` responsive (srcset/sizes).
	 * - Si `href` est fourni, enveloppe dans un lien.
	 */

	let {
		size = 'md',
		class: className = '',
		withText = false,
		textClass = '',
		href,
		ariaLabel = 'NPaulusWebsite Logo',
		fetchPriority = 'auto',
		ariaCurrent
	}: Props = $props();

	const sizeClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
		xl: 'w-16 h-16'
	};

	const textSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	};

	const logoClass = $derived(
		`${sizeClasses[size]} transition-all duration-300 hover:scale-110 hover:rotate-3 ${className}`
	);
	const textClassFull = $derived(
		`${textSizeClasses[size]} font-bold text-foreground hover:text-primary transition-colors ${textClass}`
	);

	const Wrapper = $derived(href ? 'a' : 'div');
	const wrapperProps = $derived(
		href
			? {
					href,
					class: 'flex items-center space-x-2',
					'aria-current': ariaCurrent as 'page' | undefined
				}
			: { class: 'flex items-center space-x-2' }
	);
</script>

<svelte:element this={Wrapper} {...wrapperProps} aria-label={ariaLabel}>
	<img
		src={logoSrc}
		srcset={logoSrcset}
		sizes={logoSizes}
		alt="NPaulusWebsite Logo"
		class={logoClass}
		fetchpriority={fetchPriority}
		loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
		decoding="async"
	/>

	{#if withText}
		<span class={textClassFull}>NPaulusWebsite</span>
	{/if}
</svelte:element>
