# Data Layer Domain Implementation

## Overview
TaskFlow uses Prisma ORM exclusively for database operations with SQLite for local development. All data mutations occur through Next.js server actions with a consistent error handling pattern.

## Database Schema

### Prisma Schema Definition
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
  engineType = "binary"
}

datasource db {
  provider = "sqlite"
  url      = "file:app.db"
}

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

model Task {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  priority    String
  status      String
  dueDate     DateTime?
  assigneeId  Int?
  assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creatorId   Int
  creator     User     @relation("CreatedTasks", fields: [creatorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Server Action Patterns

### Client Instance Pattern
Each server action file creates its own Prisma client:

```tsx
// app/(dashboard)/tasks/actions.ts
"use server";

import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();
```

### Error Handling Pattern
All server actions return a consistent error/success pattern:

```tsx
export async function createTask(formData: FormData) {
    try {
        await prisma.task.create({
            data: {
                name,
                description,
                priority,
                status,
                dueDate: dueDate ? parseDateString(dueDate) : null,
                creatorId,
                assigneeId,
            },
        });
        revalidatePath("/tasks");
        return { error: null, success: true, message: "Task created successfully!" };
    } catch (e) {
        return { error: "Failed to create task.", success: false, message: "Failed to create task." };
    }
}
```

### Authentication Integration
Server actions integrate with authentication:

```tsx
export async function createTask(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };
    
    const creatorId = user.id;
    // ... rest of function
}
```

## Data Fetching Patterns

### Include Relationships
Fetch related data using Prisma include/select:

```tsx
export async function getAllTasks() {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assignee: { select: { id: true, name: true, email: true, password: true } },
                creator: { select: { id: true, name: true, email: true, password: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return { tasks, error: null };
    } catch (e) {
        return { tasks: [], error: "Failed to fetch tasks." };
    }
}
```

### Type-Safe Operations
Use generated Prisma types:

```tsx
import type { Task as PrismaTask, User } from "@/app/generated/prisma/client";

type TaskWithProfile = PrismaTask & {
  assignee?: Pick<User, "name"> | null;
};
```

## Database Operations

### Create Operations
```tsx
export async function createTask(formData: FormData) {
    const name = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as string;
    const assigneeIdRaw = formData.get("assigneeId") as string;
    const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;

    await prisma.task.create({
        data: {
            name,
            description,
            priority,
            status,
            dueDate: dueDate ? parseDateString(dueDate) : null,
            creatorId: user.id,
            assigneeId,
        },
    });
}
```

### Update Operations
```tsx
export async function updateTask(taskId: number, formData: FormData) {
    await prisma.task.update({
        where: { id: taskId },
        data: {
            name: formData.get("title") as string,
            description: formData.get("description") as string,
            priority: formData.get("priority") as string,
            status: formData.get("status") as string,
            dueDate: dueDate ? parseDateString(dueDate) : null,
            assigneeId,
        },
    });
}
```

### Delete Operations
```tsx
export async function deleteTask(taskId: number) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };

    try {
        await prisma.task.delete({
            where: { id: taskId },
        });
        revalidatePath("/tasks");
        return { error: null, success: true, message: "Task deleted successfully!" };
    } catch (e) {
        return { error: "Failed to delete task.", success: false };
    }
}
```

## Session Management

### Session Creation
```tsx
export async function login(formData: FormData) {
    const sessionToken = randomBytes(32).toString("hex");
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId: user.id,
        },
    });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, { httpOnly: true, path: "/" });
}
```

### Session Validation
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

## Cache Management

### Revalidation After Mutations
```tsx
import { revalidatePath } from "next/cache";

// After any data mutation
revalidatePath("/tasks");
revalidatePath("/dashboard");
```

## Database Setup Scripts

### Seed Data
```javascript
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedDatabase() {
    // Create users with hashed passwords
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const alice = await prisma.user.create({
        data: {
            email: "alice@example.com",
            password: hashedPassword,
            name: "Alice Johnson",
        },
    });
    
    // Create sample tasks
    const tasks = [
        { name: 'Write unit tests for API endpoints', description: 'Ensure all API endpoints have comprehensive test coverage', priority: 'medium' },
        // ... more tasks
    ];
    
    for (const taskData of tasks) {
        await prisma.task.create({
            data: {
                ...taskData,
                status: getRandomElement(statuses),
                priority: getRandomElement(priorities),
                creatorId: users[Math.floor(Math.random() * users.length)].id,
                assigneeId: Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)].id : null,
                dueDate: Math.random() > 0.5 ? getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) : null,
            },
        });
    }
}
```

## Data Layer Constraints

1. **Prisma Only**: All database operations must use Prisma ORM
2. **Client Generation**: Prisma client generates to `@/app/generated/prisma`
3. **Error Pattern**: Return `{ error, success, message }` from all server actions
4. **Authentication**: Check user authentication in server actions
5. **Revalidation**: Call `revalidatePath()` after mutations
6. **Type Safety**: Use generated Prisma types for type safety
7. **Instance Pattern**: Create new PrismaClient instance in each action file