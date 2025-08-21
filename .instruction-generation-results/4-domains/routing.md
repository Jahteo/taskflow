# Routing Domain Implementation

## Overview
TaskFlow uses Next.js 14 App Router with file-based routing, route groups, and nested layouts for authentication and dashboard structure.

## Route Structure

### App Directory Layout
```
app/
├── layout.tsx                 # Root layout
├── globals.css               # Global styles
├── (dashboard)/              # Route group for authenticated pages
│   ├── layout.tsx           # Dashboard layout with auth protection
│   ├── page.tsx             # Dashboard home (/dashboard)
│   ├── tasks/               # Tasks feature
│   │   ├── page.tsx         # Tasks list page
│   │   ├── new/page.tsx     # Create task page
│   │   └── actions.ts       # Task-related server actions
│   ├── board/               # Kanban board feature
│   │   └── page.tsx         # Board page
│   └── team/                # Team management
│       └── page.tsx         # Team page
├── login/                   # Authentication
│   ├── page.tsx            # Login page
│   └── actions.ts          # Auth actions
└── signup/                 # User registration
    ├── page.tsx           # Signup page
    └── actions.ts         # Registration actions
```

## Route Groups Pattern

### Dashboard Route Group
Protected routes are grouped under `(dashboard)`:

```tsx
// app/(dashboard)/layout.tsx
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

## Authentication Flow

### Route Protection
Authentication is handled at the layout level:

```tsx
// Authentication check in dashboard layout
const user = await getCurrentUser();
if (!user) redirect("/login");
```

### Login Redirect
After successful authentication:

```tsx
// From app/login/actions.ts
export async function login(formData: FormData) {
    // ... authentication logic
    const { redirect } = await import("next/navigation");
    redirect("/");  // Redirects to dashboard
}
```

### Logout Flow
Logout clears session and redirects:

```tsx
// From app/login/actions.ts
export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (sessionToken) {
        await prisma.session.deleteMany({ where: { token: sessionToken } });
        cookieStore.set("session", "", { maxAge: 0, path: "/" });
    }
    const { redirect } = await import("next/navigation");
    redirect("/login");
}
```

## Page Component Patterns

### Server Components (Default)
Pages are server components that can fetch data:

```tsx
// app/(dashboard)/page.tsx
export default async function IndexPage() {
  const user = await getCurrentUser();
  const { tasks: allTasks } = await getAllTasks();
  
  // Server-side data processing
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'done').length;
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Component JSX */}
    </div>
  );
}
```

### Client Components for Interactivity
When client-side features are needed:

```tsx
// components/tasks-page-client.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function TasksPageClient({ children }: { children: React.ReactNode }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    
    return (
        <div className="container mx-auto py-6">
            {/* Interactive UI logic */}
        </div>
    )
}
```

## Navigation Patterns

### Programmatic Navigation
Use Next.js navigation for redirects:

```tsx
import { redirect } from "next/navigation";

// Server-side redirect
redirect("/login");
```

### Client-side Navigation
For client components, use router hook:

```tsx
import { useRouter } from "next/navigation"

const router = useRouter()
// Usage: router.push("/path")
```

## Route-Specific Server Actions

### Feature-based Actions
Each route feature has its own actions file:

```tsx
// app/(dashboard)/tasks/actions.ts
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTask(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };
    
    // Task creation logic...
    revalidatePath("/tasks");
    return { error: null, success: true, message: "Task created successfully!" };
}
```

## Metadata and SEO

### Page Metadata
Root layout defines app metadata:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};
```

## Routing Constraints

1. **Authentication**: All dashboard routes require authentication at layout level
2. **Server Actions**: Route-specific server actions in dedicated `actions.ts` files
3. **Route Groups**: Use parentheses for grouping without affecting URL structure
4. **Redirects**: Use Next.js `redirect()` for server-side redirects
5. **Revalidation**: Call `revalidatePath()` after data mutations to refresh pages
6. **Feature Organization**: Group related routes under feature directories