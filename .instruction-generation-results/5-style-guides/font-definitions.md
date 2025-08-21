# Font Definitions Style Guide

## Unique Patterns in TaskFlow

### Font Import Pattern
TaskFlow centralizes font definitions:

```tsx
// lib/fonts.ts
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

### Font Application Pattern
Fonts are applied at the layout level:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground text-xl`}>
        {children}
      </body>
    </html>
  );
}
```

### Font Usage in Components
Fonts can be imported for specific components:

```tsx
// components/kanban-board.tsx
import { poppins } from "@/lib/fonts"

// Used in component styling
className={cn(poppins.className, "other-classes")}
```

### Font Definition Philosophy
- Use Next.js font optimization
- Define fonts once in lib/fonts.ts
- Apply primary font at layout level
- Import specific fonts for component variations
- Use Google Fonts for web-optimized loading