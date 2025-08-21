# TaskFlow Copilot Instructions

## Overview

This file enables AI coding assistants to generate features aligned with TaskFlow's architecture and style conventions. These instructions are based on actual, observed patterns from the codebase—not invented practices.

TaskFlow is a modern task management application built with Next.js 14, React 19, TypeScript, Prisma ORM, and shadcn/ui components. It follows a feature-based architecture with server-side rendering, server actions for data mutations, and session-based authentication.

## File Category Reference

### React Components (`./components/[component-name].tsx`)
**Purpose:** Interactive UI components with client-side state and event handling  
**Examples:** `./components/create-task-form.tsx`, `./components/kanban-board.tsx`  
**Key Conventions:**
- Mark interactive components with `"use client"` directive
- Use React 19's `useActionState` and `useFormStatus` for form handling
- Include `onFinish?: () => void` callback props for post-action cleanup
- Implement separate `SubmitButton` components using `useFormStatus`
- Use `useState` and `useTransition` for local state management
- Import server actions and integrate with forms using `action={formAction}`

### UI Components (`./components/ui/[component-name].tsx`)
**Purpose:** Reusable design system primitives based on shadcn/ui  
**Examples:** `./components/ui/button.tsx`, `./components/ui/card.tsx`  
**Key Conventions:**
- Build on Radix UI primitives with React.forwardRef
- Use class-variance-authority (cva) for component variants
- Support `asChild` prop using Radix Slot component
- Set `displayName` for all forwarded components
- Use semantic color tokens (primary, secondary, destructive, etc.)
- Include TypeScript interfaces extending base HTML element props

### Page Components (`./app/[route]/page.tsx`)
**Purpose:** Server components that fetch data and coordinate UI  
**Examples:** `./app/(dashboard)/page.tsx`, `./app/(dashboard)/tasks/page.tsx`  
**Key Conventions:**
- Server components by default (no "use client")
- Fetch data directly using server actions (e.g., `await getAllTasks()`)
- Process raw data for component consumption (metrics, transformations)
- Delegate interactive functionality to client components
- Follow layout structure: `<div className="flex-1 space-y-4 p-8 pt-6">`
- Handle error states and empty states gracefully

### Server Actions (`./app/[route]/actions.ts`)
**Purpose:** Server-side functions for data mutations and API operations  
**Examples:** `./app/(dashboard)/tasks/actions.ts`, `./app/login/actions.ts`  
**Key Conventions:**
- Start with `"use server"` directive
- Create new `PrismaClient()` instance per file
- Check authentication with `getCurrentUser()` for protected actions
- Return `{ error: string | null, success: boolean, message?: string }` structure
- Extract FormData with type assertions: `formData.get("field") as string`
- Call `revalidatePath("/path")` after data mutations
- Use try/catch with consistent error handling patterns

### Layout Components (`./app/[route]/layout.tsx`)
**Purpose:** Route-specific layouts with authentication and navigation  
**Examples:** `./app/layout.tsx`, `./app/(dashboard)/layout.tsx`  
**Key Conventions:**
- Dashboard layouts check authentication and redirect if needed
- Use `<Sidebar />` component for dashboard navigation
- Apply font classes using template literals: `${inter.className}`
- Structure: `<div className="flex h-screen overflow-hidden">`
- Import order: metadata/fonts, components, server actions, Next.js utilities

### Types (`./lib/types.ts`)
**Purpose:** Shared TypeScript type definitions  
**Key Conventions:**
- Extend Prisma types: `TaskWithProfile = PrismaTask & { assignee?: Pick<User, "name"> | null }`
- Define domain-specific types like `KanbanData` and `KanbanColumn`
- Import from generated Prisma client: `@/app/generated/prisma/client`

### Utility Functions (`./lib/[utility-name].ts`)
**Purpose:** Shared helper functions  
**Examples:** `./lib/utils.ts`, `./lib/date-utils.ts`  
**Key Conventions:**
- Simple, focused utilities (no external utility libraries)
- Class name utility: `cn(...classes)` for conditional styling
- Date utilities for form processing: `parseDateString()`, `formatDateForInput()`

## Feature Scaffold Guide

### Creating a New Feature
When implementing a new feature (e.g., "project management"), create these files:

1. **Feature Route Structure:**
   ```
   app/(dashboard)/projects/
   ├── page.tsx              # Projects list page (server component)
   ├── new/page.tsx          # Create project page
   ├── [id]/page.tsx         # Project detail page
   └── actions.ts            # Project server actions
   ```

2. **Components:**
   ```
   components/
   ├── create-project-form.tsx  # Project creation form (client component)
   ├── edit-project-form.tsx    # Project editing form (client component)
   ├── project-list.tsx         # Project display component
   └── projects-page-client.tsx # Client-side project page logic
   ```

3. **Types (if needed):**
   Add to `./lib/types.ts`:
   ```tsx
   export type ProjectWithTasks = Project & {
     tasks: Task[]
     creator: Pick<User, "name">
   }
   ```

### Server Action Template
```tsx
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createProject(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };

    const name = formData.get("name") as string;
    if (!name) return { error: "Name is required.", success: false };

    try {
        await prisma.project.create({
            data: {
                name,
                creatorId: user.id,
            },
        });
        revalidatePath("/projects");
        return { error: null, success: true, message: "Project created successfully!" };
    } catch (e) {
        return { error: "Failed to create project.", success: false };
    }
}
```

### Form Component Template
```tsx
"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject } from "@/app/(dashboard)/projects/actions"

type ActionState = {
    error: string | null;
    success: boolean;
    message?: string;
}

const initialState: ActionState = { message: "", success: false, error: null }

export function CreateProjectForm({ onFinish }: { onFinish?: () => void }) {
    const [state, formAction] = useActionState(createProject, initialState)

    if (state.success && onFinish) {
        onFinish()
    }

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" name="name" required />
            </div>
            {state.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {state.error}
                </div>
            )}
            <SubmitButton />
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Project"}
        </Button>
    )
}
```

## Integration Rules

### Authentication Requirements
- All dashboard routes protected by layout-level auth checks using `getCurrentUser()`
- Server actions that modify data must verify authentication first
- Use session-based auth with database tokens and httpOnly cookies
- No global auth context—check authentication per page/action

### Data Layer Constraints
- Use Prisma ORM exclusively for database operations
- Create new `PrismaClient()` instance in each server action file
- Import types from `@/app/generated/prisma/client`
- Include related data using Prisma `include`/`select` patterns
- Call `revalidatePath()` after mutations to refresh cached data

### UI Component Rules
- Build interactive components on shadcn/ui + Radix UI primitives
- Use `cn()` utility for conditional class joining
- Apply semantic color tokens, not direct color values
- Use lucide-react for all icons
- Support `asChild` prop for component composition

### Form Handling Requirements
- Use React 19's `useActionState` and `useFormStatus` hooks exclusively
- Server actions receive `FormData` and return `{ error, success, message }`
- Extract form fields with type assertions: `formData.get("field") as string`
- Validate inputs before database operations
- Display error/success states consistently

### Drag and Drop Integration
- Use `@hello-pangea/dnd` for drag-and-drop functionality
- Implement optimistic updates with `useTransition`
- Call server actions to persist state changes
- Handle drag end with `onDragEnd` callback pattern

## Example Prompt Usage

**User Request:** "Create a searchable dropdown that lets users filter tasks by priority"

**Expected AI Response:** Create these files:

1. **UI Component** (`./components/ui/priority-filter.tsx`):
   ```tsx
   "use client"
   
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
   
   export function PriorityFilter({ value, onValueChange }: { 
     value: string
     onValueChange: (value: string) => void 
   }) {
     return (
       <Select value={value} onValueChange={onValueChange}>
         <SelectTrigger className="w-32">
           <SelectValue placeholder="Priority" />
         </SelectTrigger>
         <SelectContent>
           <SelectItem value="all">All</SelectItem>
           <SelectItem value="low">Low</SelectItem>
           <SelectItem value="medium">Medium</SelectItem>
           <SelectItem value="high">High</SelectItem>
         </SelectContent>
       </Select>
     )
   }
   ```

2. **Enhanced Task List** (`./components/task-list.tsx`):
   Add filtering state and integrate with the new filter component using `useState` for filter state.

3. **Server Action Enhancement** (`./app/(dashboard)/tasks/actions.ts`):
   Add filtering capabilities to `getAllTasks()` function with optional priority parameter.

This approach ensures new features follow established patterns for component composition, state management, server integration, and TypeScript usage while maintaining consistency with the existing codebase architecture.