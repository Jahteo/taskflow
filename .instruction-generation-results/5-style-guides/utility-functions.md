# Utility Functions Style Guide

## Unique Patterns in TaskFlow

### Class Name Utility Pattern
TaskFlow uses a simple, custom class name utility instead of libraries like clsx:

```tsx
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

Usage throughout components:
```tsx
className={cn(
  "base-classes",
  variant && "variant-classes",
  disabled && "disabled-classes",
  className
)}
```

### Date Utility Pattern
Date handling utilities are centralized for form processing:

```tsx
// lib/date-utils.ts
export function parseDateString(dateString: string): Date {
    return new Date(dateString);
}

export function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
}
```

Usage in server actions:
```tsx
dueDate: dueDate ? parseDateString(dueDate) : null
```

Usage in form components:
```tsx
defaultValue={task.dueDate ? formatDateForInput(task.dueDate) : ""}
```

### Minimal Utility Philosophy
TaskFlow keeps utilities minimal and focused:
- No complex object manipulation utilities
- No external utility libraries (lodash, ramda, etc.)
- Simple, single-purpose functions only
- Focus on project-specific needs rather than general utilities

### Utility Import Pattern
Utilities are imported using the path alias:

```tsx
import { cn } from "@/lib/utils"
import { parseDateString } from "@/lib/date-utils"
```