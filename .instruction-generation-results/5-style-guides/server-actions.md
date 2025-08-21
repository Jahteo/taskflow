# Server Actions Style Guide

## Unique Patterns in TaskFlow

### Server Action Declaration Pattern
All server actions start with the `"use server"` directive and follow consistent imports:

```tsx
"use server";

import { getCurrentUser } from "@/app/login/actions";
import { PrismaClient } from "@/app/generated/prisma";
import { revalidatePath } from "next/cache";
import { parseDateString } from "@/lib/date-utils";
```

### Prisma Client Instance Pattern
Each server action file creates its own Prisma client instance:

```tsx
const prisma = new PrismaClient();
```

### Authentication Check Pattern
Protected actions consistently check authentication first:

```tsx
export async function createTask(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false, message: "Not authenticated." };
    
    const creatorId = user.id;
    // ... rest of action logic
}
```

### FormData Extraction Pattern
Server actions extract form data with type assertions:

```tsx
const name = formData.get("title") as string;  // Note: form field is "title" but model field is "name"
const description = formData.get("description") as string;
const priority = formData.get("priority") as string;
const status = formData.get("status") as string;
const dueDate = formData.get("dueDate") as string;
const assigneeIdRaw = formData.get("assigneeId") as string;
const assigneeId = assigneeIdRaw ? parseInt(assigneeIdRaw, 10) : null;
```

### Error Handling Pattern
All server actions return a consistent error/success structure:

```tsx
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
```

### Return Type Pattern
Server actions consistently return this structure:

```tsx
type ActionResult = {
    error: string | null;
    success: boolean;
    message?: string;
}
```

### Data Fetching with Include/Select Pattern
When fetching related data, use Prisma include/select patterns:

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

### Revalidation Pattern
After data mutations, consistently revalidate affected paths:

```tsx
// After create/update/delete operations
revalidatePath("/tasks");
revalidatePath("/dashboard");  // If it affects dashboard metrics
```

### Session Management Pattern
Auth actions use specific session token patterns:

```tsx
// Login: Create session with crypto random token
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
```

### Password Hashing Pattern
Authentication actions use bcryptjs with specific salt rounds:

```tsx
import bcrypt from "bcryptjs";

// Hashing for signup
const hashedPassword = await bcrypt.hash(password, 10);

// Verification for login
const valid = await bcrypt.compare(password, user.password);
```

### Redirect Pattern
Server actions use dynamic imports for redirects:

```tsx
// After successful auth operations
const { redirect } = await import("next/navigation");
redirect("/");  // or redirect("/login");
```

### Validation Pattern
Input validation is done before database operations:

```tsx
if (!name) return { error: "Title is required.", success: false, message: "Title is required." };
if (!email) return { error: "Email is required." };
if (!password) return { error: "Password is required." };
```

### Update Operations Pattern
Update actions include ID validation and similar error handling:

```tsx
export async function updateTask(taskId: number, formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated.", success: false };

    try {
        await prisma.task.update({
            where: { id: taskId },
            data: {
                name: formData.get("title") as string,
                description: formData.get("description") as string,
                // ... other fields
            },
        });
        revalidatePath("/tasks");
        return { error: null, success: true, message: "Task updated successfully!" };
    } catch (e) {
        return { error: "Failed to update task.", success: false };
    }
}
```

### Delete Operations Pattern
Delete actions verify ownership or permissions before deletion:

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