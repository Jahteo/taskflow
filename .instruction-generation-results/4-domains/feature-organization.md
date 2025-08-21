# Feature Organization Domain Implementation

## Overview
TaskFlow organizes code using a feature-based architecture where related functionality is colocated. Features are grouped under route segments with dedicated server actions, and components are separated by their purpose and scope.

## Directory Structure

### Feature-Based Organization
```
app/
├── (dashboard)/              # Protected route group
│   ├── layout.tsx           # Dashboard layout with auth
│   ├── page.tsx             # Dashboard overview page
│   ├── tasks/               # Task management feature
│   │   ├── page.tsx         # Task list page
│   │   ├── new/page.tsx     # Create task page
│   │   └── actions.ts       # Task server actions
│   ├── board/               # Kanban board feature
│   │   └── page.tsx         # Board view page
│   └── team/                # Team management feature
│       └── page.tsx         # Team overview page
├── login/                   # Authentication feature
│   ├── page.tsx            # Login form
│   └── actions.ts          # Auth actions
└── signup/                 # Registration feature
    ├── page.tsx           # Signup form
    └── actions.ts         # Registration actions

components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── auth-dropdown.tsx       # Auth-specific component
├── create-task-form.tsx    # Task creation component
├── edit-task-form.tsx      # Task editing component
├── kanban-board.tsx        # Board-specific component
├── sidebar.tsx             # Navigation component
├── task-list.tsx           # Task display component
├── task-overview.tsx       # Dashboard task widget
├── tasks-page-client.tsx   # Client-side task page logic
├── dashboard-charts.tsx    # Analytics components
└── team-stats.tsx          # Team analytics

lib/
├── utils.ts                # Shared utilities
├── types.ts                # Type definitions
├── date-utils.ts           # Date handling utilities
└── fonts.ts                # Font configurations
```

## Feature Colocation Patterns

### Server Actions per Feature
Each feature has its own server actions file:

```tsx
// app/(dashboard)/tasks/actions.ts
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createTask(formData: FormData) {
    // Task creation logic
}

export async function getAllTasks() {
    // Task retrieval logic
}

export async function updateTask(taskId: number, formData: FormData) {
    // Task update logic
}

export async function deleteTask(taskId: number) {
    // Task deletion logic
}

export async function updateTaskStatus(taskId: number, newStatus: string) {
    // Status update logic for kanban
}
```

### Authentication Actions
Authentication is its own feature with centralized actions:

```tsx
// app/login/actions.ts
"use server"

import { cookies } from "next/headers";
import { PrismaClient } from "@/app/generated/prisma";

export async function login(formData: FormData) {
    // Login logic
}

export async function logout() {
    // Logout logic
}

export async function getCurrentUser() {
    // User retrieval logic - used across features
}

export async function getAllUsers() {
    // User listing for assignments
}
```

## Component Organization

### UI Primitives
Base components in `components/ui/` follow shadcn/ui patterns:

```tsx
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

// Generic, reusable button component
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
```

### Feature Components
Feature-specific components in `components/`:

```tsx
// components/create-task-form.tsx
"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { createTask } from "@/app/(dashboard)/tasks/actions"

// Task-specific form component
export function CreateTaskForm({ onFinish }: { onFinish?: () => void }) {
    // Form logic specific to task creation
}
```

### Page Components
Page components are server components that coordinate data and UI:

```tsx
// app/(dashboard)/tasks/page.tsx
import { getCurrentUser } from "@/app/login/actions";
import { getAllTasks } from "./actions";
import { TasksPageClient } from "@/components/tasks-page-client";

export default async function TasksPage() {
    const user = await getCurrentUser();
    const { tasks } = await getAllTasks();

    return <TasksPageClient tasks={tasks} />;
}
```

## Import Organization Patterns

### Consistent Import Structure
All files follow the same import organization:

```tsx
// 1. React and Next.js
import { useState, useTransition } from "react"
import { redirect } from "next/navigation"

// 2. Third-party libraries
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

// 3. UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// 4. Feature components
import { CreateTaskForm } from "@/components/create-task-form"

// 5. Server actions
import { updateTaskStatus } from "@/app/(dashboard)/tasks/actions"

// 6. Utilities and types
import { cn } from "@/lib/utils"
import type { KanbanData } from "@/lib/types"
```

## Type Organization

### Centralized Type Definitions
Shared types are defined in `lib/types.ts`:

```tsx
// lib/types.ts
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};

export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

### Feature-Specific Types
Types used only within a feature are defined inline:

```tsx
// components/create-task-form.tsx
type ActionState = {
    error: string | null;
    success: boolean;
    message?: string;
}

const initialState: ActionState = {
    message: "",
    success: false,
    error: null,
}
```

## Naming Conventions

### File Naming
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)
- **Actions**: `actions.ts` (server actions)
- **Components**: `kebab-case.tsx` (e.g., `create-task-form.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `date-utils.ts`)

### Component Naming
Components use descriptive names that match their purpose:

```tsx
// Feature-specific components
export function CreateTaskForm() {}
export function EditTaskForm() {}
export function TasksPageClient() {}
export function KanbanBoard() {}

// UI components
export function Button() {}
export function Card() {}
export function Input() {}
```

## Utility Organization

### Shared Utilities
Common utilities are centralized in `lib/`:

```tsx
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

// lib/date-utils.ts
export function parseDateString(dateString: string): Date {
    return new Date(dateString);
}

export function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
}
```

### Font Definitions
Font configurations are centralized:

```tsx
// lib/fonts.ts
import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
```

## Cross-Feature Dependencies

### Authentication Dependencies
Most features depend on authentication:

```tsx
// Pattern used across features
import { getCurrentUser } from "@/app/login/actions";

export async function someFeatureAction() {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated." };
    // Feature logic...
}
```

### UI Component Dependencies
Feature components build on UI primitives:

```tsx
// Feature components import from ui/
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Feature Organization Constraints

1. **Feature Colocation**: Group related pages, actions, and logic under feature directories
2. **Server Action Files**: Each feature route should have its own `actions.ts` file
3. **Component Separation**: Separate UI primitives, feature components, and page components
4. **Import Order**: Follow consistent import organization (React, libraries, UI, features, utils, types)
5. **Naming Consistency**: Use descriptive component names and kebab-case for files
6. **Type Centralization**: Shared types in `lib/types.ts`, feature-specific types inline
7. **Utility Organization**: Shared utilities in `lib/`, feature-specific logic in components
8. **Path Aliases**: Use `@/` prefix for all internal imports