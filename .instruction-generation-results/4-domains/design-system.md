# Design System Domain Implementation

## Overview
TaskFlow uses a design system built on shadcn/ui components, Radix UI primitives, class-variance-authority for variants, and Tailwind CSS for styling. All components follow consistent patterns for theming, spacing, and accessibility.

## Component Variant System

### Variant Definition Pattern
Components use class-variance-authority (cva) for variant management:

```tsx
// Example from components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"

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
```

### Component Interface Pattern
All UI components extend their base HTML element interfaces with variant props:

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

## Radix UI Integration

### Primitive Components
Components are built on Radix UI primitives for accessibility:

```tsx
// Example from components/ui/select.tsx
import * as SelectPrimitive from "@radix-ui/react-select"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Trigger>
))
```

### Slot Pattern for Composition
Components support the asChild prop using Radix Slot:

```tsx
import { Slot } from "@radix-ui/react-slot"

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
```

## Color System

### Semantic Color Tokens
The design system uses semantic color names for theming:

```css
/* From app/globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --primary: 240 9% 17%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --ring: 240 10% 3.9%;
  --radius: 0.5rem;
}
```

### Badge Color Mapping
Priority-based color mapping for badges:

```tsx
// From components/task-overview.tsx
const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
}

<Badge variant={priorityVariant[task.priority || "Medium"]}>
  {task.priority}
</Badge>
```

## Typography System

### Font Configuration
Font definitions are centralized:

```tsx
// lib/fonts.ts
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Used in layout.tsx
<body className={`${inter.className} bg-background text-foreground text-xl`}>
```

### Typography Classes
Consistent typography using Tailwind classes:

```tsx
// Common patterns
<CardTitle className="text-sm font-medium">  // Small titles
<div className="text-2xl font-bold">         // Large metrics
<p className="text-xs text-foreground-muted"> // Small descriptive text
<p className="text-sm font-medium leading-5"> // Regular content
```

## Spacing and Layout

### Consistent Spacing
Standardized spacing patterns throughout the app:

```tsx
// Container patterns
<div className="flex-1 space-y-4 p-8 pt-6">        // Main content areas
<div className="container mx-auto py-6">           // Page containers
<div className="space-y-4">                       // Vertical spacing
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> // Grid layouts
```

### Card Component Pattern
Consistent card structure for content containers:

```tsx
// From components/ui/card.tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))

// Usage pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Icon System

### Lucide React Integration
All icons use lucide-react for consistency:

```tsx
import { Plus, Clock, Users, List, CheckCircle, Search, Filter } from "lucide-react"

// Usage patterns
<CheckCircle className="h-4 w-4 text-foreground-muted" />
<Button size="icon">
  <Plus className="h-4 w-4" />
</Button>
```

## Component Forwarding Pattern

### forwardRef Implementation
All UI components use React.forwardRef:

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
```

## Avatar System

### Custom Avatar Component
Handles both initials and images:

```tsx
// From components/ui/avatar.tsx
const AvatarName = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    name: string
  }
>(({ className, name, ...props }, ref) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
})
```

## Utility Functions

### Class Name Utility
Simple conditional class joining:

```tsx
// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```

## Design System Constraints

1. **Radix Primitives**: All interactive components must build on Radix UI primitives
2. **Variant System**: Use class-variance-authority for component variants
3. **Color Tokens**: Use semantic color tokens, not direct color values
4. **forwardRef**: All UI components must use React.forwardRef with displayName
5. **asChild Support**: Interactive components should support asChild prop using Slot
6. **Consistent Spacing**: Use Tailwind spacing utilities consistently
7. **Icon Standards**: Use lucide-react icons exclusively
8. **Typography**: Use centralized font definitions from lib/fonts.ts