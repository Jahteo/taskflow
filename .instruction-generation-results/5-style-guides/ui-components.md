# UI Components Style Guide

## Unique Patterns in TaskFlow

### Radix Primitive Extension Pattern
TaskFlow UI components consistently extend Radix primitives with forwarded refs:

```tsx
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

### Class Variance Authority Integration
All variant-supporting components use `cva` for consistent styling:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        // ... more sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Slot Pattern for Composition
Components support the `asChild` prop using Radix Slot:

```tsx
import { Slot } from "@radix-ui/react-slot"

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
```

### Avatar Component with Name Initials
TaskFlow has a custom `AvatarName` component for displaying user initials:

```tsx
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

### Consistent Focus Ring Pattern
All interactive UI components use the same focus ring pattern:

```tsx
// Focus ring classes consistently applied
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### Disabled State Pattern
Components consistently handle disabled states:

```tsx
"disabled:cursor-not-allowed disabled:opacity-50"
"disabled:pointer-events-none disabled:opacity-50"
```

### Icon Integration Pattern
Icons are consistently sized and styled within components:

```tsx
// In buttons
"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"

// In select triggers
<ChevronDown className="h-4 w-4 opacity-50" />
```

### Display Name Pattern
All forwarded components set displayName:

```tsx
Button.displayName = "Button"
Input.displayName = "Input"
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
```

### Semantic Color Usage
Components use semantic color tokens rather than direct colors:

```tsx
// Use these patterns
"bg-background text-foreground"
"bg-primary text-primary-foreground"
"bg-destructive text-destructive-foreground"
"text-muted-foreground"
"border-input"
"bg-accent text-accent-foreground"
```

### Component Export Pattern
UI components export both the component and any variants:

```tsx
export { Button, buttonVariants }
export { 
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
```