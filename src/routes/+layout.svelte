<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Button from '$lib/components/ui/button.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="p-4 space-y-4">
	<div class="flex gap-2 flex-wrap">
		<Button>Default</Button>
		<Button variant="destructive">Destructive</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="link">Link</Button>
	</div>
	
	<div class="flex gap-2 flex-wrap">
		<Button size="sm">Small</Button>
		<Button size="default">Default</Button>
		<Button size="lg">Large</Button>
		<Button size="icon">🔥</Button>
	</div>
	
	<div class="flex gap-2 flex-wrap">
		<Button variant="outline" size="sm">Small Outline</Button>
		<Button variant="destructive" size="lg">Large Destructive</Button>
		<Button variant="secondary" class="px-8">Custom Padding</Button>
	</div>
</div>

{@render children()}
