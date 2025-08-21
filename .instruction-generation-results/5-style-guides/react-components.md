# React Components Style Guide

## Unique Patterns in TaskFlow

### Client Component Declaration Pattern
TaskFlow uses explicit `"use client"` declarations at the top of interactive components:

```tsx
"use client"

import { useState, useTransition } from "react"
import { useActionState } from "react"
```

This is consistently applied to components that need:
- State management (`useState`, `useTransition`)
- Form handling (`useActionState`, `useFormStatus`)
- Event handlers or drag-and-drop functionality

### Form State Pattern with React 19
TaskFlow uses React 19's `useActionState` hook exclusively for form handling:

```tsx
// Pattern from create-task-form.tsx and edit-task-form.tsx
const [state, formAction] = useActionState(createTask, initialState)

const initialState: ActionState = {
    message: "",
    success: false,
    error: null,
}

type ActionState = {
    error: string | null;
    success: boolean;
    message?: string;
}
```

### Server Action Integration Pattern
Components integrate with server actions using specific patterns:

```tsx
// Form submission pattern
<form action={formAction}>
    {/* Form fields */}
    <SubmitButton />
</form>

// Separate submit button component using useFormStatus
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create Task"}
        </Button>
    )
}
```

### Component Composition with onFinish Callbacks
TaskFlow components use an `onFinish` callback pattern for post-action cleanup:

```tsx
export function CreateTaskForm({ onFinish }: { onFinish?: () => void }) {
    // After successful form submission
    if (state.success && onFinish) {
        onFinish()
    }
}
```

### Drag and Drop Pattern
Kanban components use `@hello-pangea/dnd` with specific state management:

```tsx
"use client"

import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export function KanbanBoard({ initialData }: { initialData: KanbanData }) {
    const [columns, setColumns] = useState(initialData)
    const [isPending, startTransition] = useTransition()

    const onDragEnd = (result: DropResult) => {
        // Optimistic state update
        // Then server action call
        startTransition(() => {
            updateTaskStatus(taskId, newStatus)
        })
    }
}
```

### Chart Component Pattern
Dashboard components use Recharts with specific styling:

```tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

// Consistent chart styling patterns
<ResponsiveContainer width="100%" height={350}>
    <BarChart data={data}>
        <XAxis 
            dataKey="month" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
        />
    </BarChart>
</ResponsiveContainer>
```

### Error State Display Pattern
Components consistently display error states:

```tsx
{state.error && (
    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
        {state.error}
    </div>
)}

{state.success && state.message && (
    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
        {state.message}
    </div>
)}
```

### User Loading Pattern for Forms
Forms that need user data use this loading pattern:

```tsx
const [users, setUsers] = useState<Pick<User, "id" | "name">[]>([])

useEffect(() => {
    getAllUsers().then(setUsers)
}, [])
```

### Component File Organization
Each component file follows this structure:
1. `"use client"` if needed
2. React/Next.js imports
3. UI component imports
4. Server action imports
5. Type definitions
6. Helper functions (if any)
7. Main component export
8. Sub-component definitions (like SubmitButton)