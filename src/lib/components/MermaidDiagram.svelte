<script lang="ts">
	/** Composant pour afficher des diagrammes Mermaid. */
	import { onMount } from 'svelte';
	import mermaid from 'mermaid';

	let { diagram, class: className = '' }: { diagram: string; class?: string } = $props();

	let container: HTMLElement;

	onMount(() => {
		mermaid.initialize({ startOnLoad: false, theme: 'default' });
		mermaid.render('mermaid-diagram', diagram).then(({ svg }) => {
			container.innerHTML = svg;
		});
	});
</script>

<div bind:this={container} class={className}></div>
