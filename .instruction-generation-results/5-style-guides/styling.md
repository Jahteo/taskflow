# Styling Style Guide

## Unique Patterns in TaskFlow

### Global CSS Pattern
TaskFlow uses minimal global CSS with Tailwind directives:

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS variables for theming */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  /* ... more CSS variables */
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    /* ... dark mode variables */
  }
}

/* Base layer customizations */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Tailwind Usage Pattern
- Use semantic color variables instead of direct colors
- Apply consistent spacing with Tailwind utilities
- Use responsive design classes (md:, lg:)
- Apply focus states consistently
- Use Tailwind's arbitrary value notation sparingly

### Color System Pattern
TaskFlow uses semantic color naming:
- `bg-background` / `text-foreground` for main content
- `bg-primary` / `text-primary-foreground` for primary actions
- `bg-secondary` / `text-secondary-foreground` for secondary content
- `bg-destructive` / `text-destructive-foreground` for destructive actions
- `text-muted-foreground` for subtle text
- `border-input` for form borders