# Configuration Style Guide

## Unique Patterns in TaskFlow

### Next.js Configuration Pattern
TaskFlow uses minimal Next.js configuration:

```tsx
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### TypeScript Configuration Pattern
Standard TypeScript configuration with path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint Configuration Pattern
Uses ESLint flat config with Next.js presets:

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### PostCSS Configuration Pattern
Simple PostCSS setup for Tailwind:

```javascript
// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

### Package.json Scripts Pattern
Standard development scripts:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:setup": "npx prisma db push && npm run db:reset",
  "db:clear": "node prisma/clear.js",
  "db:seed": "node prisma/seed.js",
  "db:reset": "npm run db:clear && npm run db:seed"
}
```

### Configuration Philosophy
- Minimal configuration files
- Use framework defaults where possible
- Database scripts for easy setup
- ESLint and TypeScript for code quality