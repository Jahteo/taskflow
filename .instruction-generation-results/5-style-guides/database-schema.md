# Database Schema Style Guide

## Unique Patterns in TaskFlow

### Prisma Schema Configuration
TaskFlow uses specific Prisma configuration patterns:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../app/generated/prisma"
  engineType = "binary"
}

datasource db {
  provider = "sqlite"
  url      = "file:app.db"
}
```

### Model Relationship Patterns
TaskFlow uses explicit relationship naming for clarity:

```prisma
model User {
  id            Int @id @default(autoincrement())
  email         String @unique
  password      String
  name          String
  sessions      Session[]
  createdTasks  Task[] @relation("CreatedTasks")
  assignedTasks Task[] @relation("AssignedTasks")
}

model Task {
  assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
  creator     User     @relation("CreatedTasks", fields: [creatorId], references: [id])
}
```

### Timestamp Pattern
Consistent timestamp handling:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

### Optional Field Pattern
Optional relationships and fields:

```prisma
dueDate     DateTime?
assigneeId  Int?
assignee    User?    @relation("AssignedTasks", fields: [assigneeId], references: [id])
```