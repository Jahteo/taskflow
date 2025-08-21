# Types Style Guide

## Unique Patterns in TaskFlow

### Prisma Type Extension Pattern
TaskFlow extends Prisma-generated types for component usage:

```tsx
// lib/types.ts
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client"

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

### Kanban-Specific Type Definitions
Custom types for kanban board functionality:

```tsx
export type KanbanColumn = {
  id: "todo" | "in_progress" | "review" | "done"
  title: string
  tasks: TaskWithProfile[]
}

export type KanbanData = {
  [key in "todo" | "in_progress" | "review" | "done"]: KanbanColumn
}
```

### Type Import Pattern
Types are imported from the generated Prisma client:

```tsx
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";
```

### Inline Type Definitions
Simple, component-specific types are defined inline:

```tsx
// In components
type ActionState = {
    error: string | null;
    success: boolean;
    message?: string;
}
```

### Type Organization Philosophy
- Shared types in `lib/types.ts`
- Prisma types imported from generated client
- Simple component types defined inline
- Avoid complex type transformations