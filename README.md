# NPaulusWebsite

Site web personnel avec SvelteKit, Tailwind CSS v4 et shadcn-svelte.

## 🛠️ Stack

- **Framework**: SvelteKit v2.48.5
- **UI**: Tailwind CSS v4.1.17 + shadcn-svelte v1.1.0
- **Headless**: bits-ui v2.14.4
- **Styling**: class-variance-authority
- **TypeScript**: v5.9.3

## 🎨 Configuration

### Tailwind CSS v4

```css
/* src/app.css */
@import "tailwindcss";
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
    autoprefixer: {},
  },
}
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
  import { Button } from "bits-ui";
  import { buttonVariants } from "./index.js";

  type $$Props = Button.RootProps & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
  };
</script>

<Button.Root class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
  {@render children()}
</Button.Root>
```

### Variants

```javascript
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
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
