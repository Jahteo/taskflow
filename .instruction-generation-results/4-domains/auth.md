# Auth Domain Implementation

## Overview
TaskFlow implements custom session-based authentication using database tokens, bcryptjs for password hashing, and httpOnly cookies for secure session storage.

## Authentication Architecture

### Session Management Model
```prisma
// From prisma/schema.prisma
model User {
  id            Int @id @default(autoincrement())
  email         String @unique
  password      String
  name          String
  sessions      Session[]
  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}

model Session {
  id        Int      @id @default(autoincrement())
  token     String   @unique
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

## Authentication Server Actions

### Login Flow
```tsx
// app/login/actions.ts
"use server"

import { cookies } from "next/headers";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Invalid email or password." };
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return { error: "Invalid email or password." };
    }
    
    // Create session with random token
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });
    
    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });
    
    // Redirect to dashboard
    const { redirect } = await import("next/navigation");
    redirect("/");
}
```

### User Registration
```tsx
// app/signup/actions.ts
export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email) return { error: "Email is required." };
    if (!password) return { error: "Password is required." };
    if (!name) return { error: "Name is required." };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "User with this email already exists." };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    // Automatically log in after signup
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });

    const { redirect } = await import("next/navigation");
    redirect("/");
}
```

### Logout Flow
```tsx
export async function logout() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) {
        // Delete session from database
        await prisma.session.deleteMany({ where: { token: sessionToken } });
        // Clear cookie
        cookieStore.set("session", "", { maxAge: 0, path: "/" });
    }
    
    const { redirect } = await import("next/navigation");
    redirect("/login");
}
```

## User Context and Verification

### Current User Retrieval
```tsx
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;
    
    const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
    });
    return session?.user || null;
}
```

### User Listing for Assignment
```tsx
export async function getAllUsers() {
    // Returns all users with id and name for task assignment
    return prisma.user.findMany({ select: { id: true, name: true } });
}
```

## Route Protection

### Layout-Level Authentication
```tsx
// app/(dashboard)/layout.tsx
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

### Server Action Authentication
```tsx
// Pattern used in all protected server actions
export async function createTask(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };
    
    const creatorId = user.id;
    // ... rest of action logic
}
```

## Authentication UI Components

### Login Form
```tsx
// app/login/page.tsx
"use client"

import { useActionState } from "react"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const [state, formAction] = useActionState(login, { error: null })

    return (
        <form action={formAction} className="space-y-4">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            {state.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {state.error}
                </div>
            )}
            <Button type="submit" className="w-full">
                Sign In
            </Button>
        </form>
    )
}
```

### Auth Dropdown Component
```tsx
// components/auth-dropdown.tsx
import { logout } from "@/app/login/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarName } from "@/components/ui/avatar"

export function AuthDropdown({ user }: { user: { name: string } }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarName name={user.name} />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form action={logout}>
                        <button type="submit" className="w-full text-left">
                            Log out
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
```

## Password Security

### Hashing Pattern
```tsx
import bcrypt from "bcryptjs";

// Hash password for storage
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password during login
const valid = await bcrypt.compare(password, user.password);
```

## Session Security

### Token Generation
```tsx
import { randomBytes } from "crypto";

const sessionToken = randomBytes(32).toString("hex");
```

### Cookie Configuration
```tsx
// Set secure httpOnly cookie
cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });

// Clear cookie on logout
cookieStore.set("session", "", { maxAge: 0, path: "/" });
```

## Authentication Constraints

1. **No Global Context**: Authentication state is not stored in React context
2. **Server-Side Checks**: Authentication verification happens on server-side only
3. **Session Tokens**: Use cryptographically secure random tokens for sessions
4. **HttpOnly Cookies**: Session tokens stored in httpOnly cookies for security
5. **Layout Protection**: Route protection implemented at layout level
6. **Action Authentication**: All server actions that modify data must check authentication
7. **Password Hashing**: Use bcryptjs with salt rounds of 10 for password hashing
8. **Database Sessions**: Sessions stored in database for proper logout functionality