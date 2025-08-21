# UI Domain Implementation

## Overview
The UI domain in TaskFlow is built on a foundation of shadcn/ui components, Radix UI primitives, and Tailwind CSS. All components are TypeScript-based and follow React 19 patterns.

## Component Architecture Patterns

### Base UI Components
All base UI components are located in `./components/ui/` and follow the shadcn/ui pattern:

```tsx
// Example from ./components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn("cursor-pointer", buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### Feature Components
Feature-specific components are located in `./components/` and use the UI primitives:

```tsx
// Example from ./components/create-task-form.tsx
"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTask } from "@/app/(dashboard)/tasks/actions"

export function CreateTaskForm({ onFinish }: { onFinish?: () => void }) {
    const [state, formAction] = useActionState(createTask, initialState)
    const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])
    
    // Component implementation...
}
```

## Client/Server Component Patterns

### Client Components
Components requiring interactivity are marked with `"use client"`:

```tsx
// Example from ./components/kanban-board.tsx
"use client"

import { useState, useTransition } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
  const [columns, setColumns] = useState(initialData)
  const [isPending, startTransition] = useTransition()
  
  // Interactive drag-and-drop logic...
}
```

### Server Components
Page components are server components by default and handle data fetching:

```tsx
// Example from ./app/(dashboard)/page.tsx
import { getCurrentUser } from "@/app/login/actions";
import { getAllTasks } from "@/app/(dashboard)/tasks/actions";

export default async function IndexPage() {
  const user = await getCurrentUser();
  const { tasks: allTasks } = await getAllTasks();
  
  // Server-side data processing and rendering...
}
```

## Form Handling Patterns

All forms use React 19's useActionState and useFormStatus hooks:

```tsx
// Example pattern from create-task-form.tsx
const [state, formAction] = useActionState(createTask, initialState)

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Task"}
        </Button>
    )
}

return (
    <form action={formAction}>
        {/* Form fields */}
        <SubmitButton />
    </form>
)
```

## Styling Conventions

### Class Name Utility
All conditional styling uses the `cn()` utility:

```tsx
// From ./lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

### Icon Usage
All icons come from lucide-react:

```tsx
import { Plus, Clock, Users, List, CheckCircle } from "lucide-react"
```

### Typography
Font definitions are centralized in `./lib/fonts.ts`:

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
```

## State Management

### Local State
Components use React's built-in hooks for state management:

```tsx
const [columns, setColumns] = useState(initialData)
const [isPending, startTransition] = useTransition()
```

### No Global State
The application does not use Redux, Zustand, or Context for global state. Data flows through server components and props.

## Component Composition Requirements

1. **Import Organization**: React hooks first, Next.js imports, UI components, actions, types
2. **Type Safety**: All components have explicit TypeScript interfaces
3. **Forwarding**: UI components use React.forwardRef with displayName
4. **Variants**: Use class-variance-authority for component variants
5. **Accessibility**: Built on Radix UI primitives for accessibility compliance