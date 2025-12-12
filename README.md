# WeCraft

![JSDoc Coverage](https://img.shields.io/badge/JSDoc-100%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5-ff3e00)

Site web personnel moderne avec **SvelteKit 5**, **TypeScript** et une documentation complète. Démonstration de bonnes pratiques de développement avec une architecture maintenable et un code 100% documenté.

## ✨ Points Forts

- 📝 **Documentation JSDoc complète** sur tout le codebase
- 🏗️ **Architecture SvelteKit 5** avec les nouvelles runes
- 🔒 **TypeScript strict** pour la sécurité des types
- 🎨 **Design system** avec shadcn/ui et Tailwind CSS
- ⚡ **Performance optimisée** avec SSR et caching
- 📱 **Responsive design** et accessibilité

## 🛠️ Stack Technique

- **Framework**: SvelteKit v2.48.5
- **UI**: Tailwind CSS v4.1.17 + shadcn-svelte v1.1.0
- **Headless**: bits-ui v2.14.4
- **Styling**: class-variance-authority
- **TypeScript**: v5.9.3

## 🎨 Configuration

### Tailwind CSS v4

```css
/* src/app.css */
@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));

:root {
	--background: hsl(0 0% 100%);
	--foreground: hsl(222.2 84% 4.9%);
	--primary: hsl(222.2 47.4% 11.2%);
	--primary-foreground: hsl(210 40% 98%);
	/* ... autres couleurs */
}

@theme inline {
	--color-background: var(--background);
	--color-primary: var(--primary);
	/* ... mapping des couleurs */
}
```

### PostCSS

```javascript
module.exports = {
	plugins: {
		'@tailwindcss/postcss': {},
		autoprefixer: {}
	}
};
```

## 🏗️ Architecture

**bits-ui** = Headless UI (logique sans style)

- Composants fonctionnels : `<Button.Root>`, `<Switch.Root>`
- Gère états, accessibilité, comportements
- Zéro style CSS

**shadcn-svelte** = Layer de style

- `buttonVariants` avec `class-variance-authority`
- Classes CSS : `bg-primary`, `hover:bg-primary/90`
- Zéro logique fonctionnelle

Les deux travaillent ensemble : bits-ui fournit la logique, shadcn-svelte fournit le style.

## 🧩 Composants

### Button

```svelte
<script lang="ts">
	import { Button } from 'bits-ui';
	import { buttonVariants } from './index.js';

	type $$Props = Button.RootProps & {
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
	};
</script>

<Button.Root class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
	{@render children()}
</Button.Root>
```

### Variants

```javascript
import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md font-medium transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
				icon: 'h-10 w-10'
			}
		}
	}
);
```

## 🚀 Utilisation

```svelte
<script>
	import Button from '$lib/components/ui/button.svelte';
</script>

<Button variant="destructive" size="lg">Bouton</Button>
```

## 📦 Dépendances

```json
{
	"dependencies": {
		"bits-ui": "^2.14.4",
		"class-variance-authority": "^0.7.1"
	},
	"devDependencies": {
		"@tailwindcss/postcss": "^4.1.17",
		"shadcn-svelte": "^1.1.0"
	}
}
```

## 🔧 Développement

```bash
npm install
npm run dev
npm run build
npm run check
```

## 📚 Documentation Standards

Ce projet suit des standards de documentation stricts :

### JSDoc Coverage

- **100%** des fonctions publiques documentées
- **100%** des interfaces et types commentés
- **100%** des stores Svelte avec documentation complète

### Exemple de Documentation

```typescript
/** Store Kanban avec persistence IndexedDB et gestion des états. */
export function createKanbanStore(): KanbanStore {
	/** Crée un nouveau tableau et le persiste. */
	async function createBoard(request: CreateBoardRequest): Promise<boolean> {
		// Implementation...
	}
}

/** Tableau Kanban avec colonnes, cartes et permissions. */
export interface Board {
	id: string;
	title: string;
	/** Description optionnelle du tableau */
	description?: string;
	columns: Column[];
	members: User[];
	createdAt: Date;
	updatedAt: Date;
}
```

### Architecture du Code

```
src/
├── lib/              # Bibliothèque partagée
│   ├── components/   # Composants réutilisables
│   ├── stores/       # Stores Svelte 5
│   ├── types/        # Types TypeScript
│   └── utils/        # Utilitaires
├── routes/           # Pages SvelteKit
│   ├── (app)/        # Routes groupées
│   └── api/          # Routes API
└── app.html          # Template HTML
```

## 🏆 Qualité & Performance

- ✅ **TypeScript strict** - Zéro erreur `any`
- ✅ **ESLint configuré** - Code cohérent
- ✅ **Prettier format** - Style uniforme
- ✅ **SSR optimisé** - Fast loading
- ✅ **Cache headers** - Performance réseau

## 🚀 Voir en Action

- **Live Demo**: [votresite.com](https://votresite.com)
- **Architecture**: [votresite.com/architecture](https://votresite.com/architecture)
- **Code Source**: [GitHub Repository](https://github.com/votreusername/WeCraft)

---

_Développé avec ❤️ en utilisant les meilleures pratiques du web moderne_
