# Layout Components Style Guide

## Unique Patterns in TaskFlow

### Root Layout Pattern
The root layout establishes global styling and metadata:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground text-xl`}
      >
        {children}
      </body>
    </html>
  );
}
```

### Dashboard Layout with Authentication Pattern
The dashboard layout implements authentication protection and sidebar layout:

```tsx
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}
```

### Sidebar Integration Pattern
Layouts integrate with the sidebar component for navigation:

```tsx
// Sidebar is consistently imported and used
import { Sidebar } from "@/components/sidebar";

// Layout structure with sidebar
<div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
        {children}
    </main>
</div>
```

### Authentication Guard Pattern
Protected layouts check authentication and redirect:

```tsx
// Get current user first
const user = await getCurrentUser();

// Redirect if not authenticated
if (!user) redirect("/login");

// Continue with layout if authenticated
```

### Layout Styling Pattern
Layouts use specific Tailwind classes for structure:

```tsx
// Full height layout
"flex h-screen overflow-hidden"

// Sidebar area (fixed)
// Sidebar component handles its own styling

// Main content area (flexible)
"flex-1 overflow-x-hidden overflow-y-auto bg-background"
```

### Font Application Pattern
Layouts apply fonts using template literals:

```tsx
<body className={`${inter.className} bg-background text-foreground text-xl`}>
```

### Route Group Layout Pattern
Dashboard layouts are placed in route groups:

```
app/
├── layout.tsx           # Root layout
├── (dashboard)/         # Route group
│   ├── layout.tsx      # Dashboard layout
│   ├── page.tsx        # Dashboard home
│   └── tasks/          # Feature routes
└── login/              # Public routes
```

### Import Organization in Layouts
Layouts organize imports in this specific order:

```tsx
// 1. Next.js types and metadata
import type { Metadata } from "next";

// 2. Font imports
import { Inter } from "next/font/google";

// 3. Global styles
import "./globals.css";

// 4. Components
import { Sidebar } from "@/components/sidebar";

// 5. Server actions
import { getCurrentUser } from "@/app/login/actions";

// 6. Next.js utilities
import { redirect } from "next/navigation";
```

### Metadata Definition Pattern
Root layouts define application metadata:

```tsx
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};
```

### Layout Component Type Pattern
All layouts use the same children prop pattern:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout implementation
}
```