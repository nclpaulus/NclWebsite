<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationId: number;
	let mouse = { x: 0, y: 0 };
	let points: Point[] = [];

	class Point {
		x: number;
		y: number;
		originX: number;
		originY: number;
		vx: number = 0;
		vy: number = 0;
		radius: number = 2;

		constructor(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.originX = x;
			this.originY = y;
		}

		update(mouseX: number, mouseY: number) {
			// Calculer la distance au curseur
			const dx = mouseX - this.x;
			const dy = mouseY - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const maxDistance = 150;

			// Si le point est dans le rayon d'influence
			if (distance < maxDistance) {
				const force = (1 - distance / maxDistance) * 20;
				const angle = Math.atan2(dy, dx);

				// Appliquer une force d'attraction vers le curseur
				this.vx += Math.cos(angle) * force * 0.02;
				this.vy += Math.sin(angle) * force * 0.02;
			}

			// Force de retour vers la position d'origine (ressort)
			const springForce = 0.02;
			const damping = 0.95;

			this.vx += (this.originX - this.x) * springForce;
			this.vy += (this.originY - this.y) * springForce;

			// Appliquer le damping
			this.vx *= damping;
			this.vy *= damping;

			// Mettre à jour la position
			this.x += this.vx;
			this.y += this.vy;
		}

		draw(ctx: CanvasRenderingContext2D) {
			// Calculer la distance du centre de l'écran
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const distanceFromCenter = Math.sqrt(
				Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2)
			);
			const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

			// Double atténuation avec courbe exponentielle
			const normalizedDistance = distanceFromCenter / maxDistance;
			// Première atténuation : courbe exponentielle (plus prononcée)
			const firstAttenuation = Math.pow(normalizedDistance, 2.5);
			// Deuxième atténuation : mapping vers plage d'opacité plus faible
			const opacity = 0.02 + firstAttenuation * 0.25;

			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(148, 163, 184, ${opacity})`; // slate-400 avec double atténuation
			ctx.fill();
		}
	}

	function initCanvas() {
		if (!canvas) return;

		// Initialiser le contexte
		ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Définir la taille du canvas
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			createPoints();
		};

		resize();
		window.addEventListener('resize', resize);

		// Suivi du curseur
		const handleMouseMove = (e: MouseEvent) => {
			// Le canvas est en position fixed, donc on utilise directement les coordonnées de la fenêtre
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Animation loop
		function animate() {
			if (!ctx || !canvas) return;

			// Effacer le canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Mettre à jour et dessiner les points
			points.forEach((point) => {
				point.update(mouse.x, mouse.y);
				if (ctx) point.draw(ctx);
			});

			animationId = requestAnimationFrame(animate);
		}

		animate();

		return () => {
			window.removeEventListener('resize', resize);
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationId);
		};
	}

	function createPoints() {
		points = [];
		const spacing = 30;
		const cols = Math.ceil(canvas.width / spacing) + 2;
		const rows = Math.ceil(canvas.height / spacing) + 2;

		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				const x = i * spacing - spacing;
				const y = j * spacing - spacing;
				points.push(new Point(x, y));
			}
		}
	}

	onMount(() => {
		if (canvas) {
			return initCanvas();
		}
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 pointer-events-none z-0"
	style="width: 100%; height: 100%;"
></canvas>
