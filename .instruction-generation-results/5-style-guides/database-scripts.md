# Database Scripts Style Guide

## Unique Patterns in TaskFlow

### Seed Script Pattern
TaskFlow uses JavaScript (not TypeScript) for database scripts:

```javascript
// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Sample data arrays
const tasks = [
    { name: 'Write unit tests for API endpoints', description: 'Ensure all API endpoints have comprehensive test coverage', priority: 'medium' },
    // ... more tasks
];

const statuses = ['todo', 'in_progress', 'done', 'review'];
const priorities = ['low', 'medium', 'high'];

// Utility functions
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
    // Database seeding logic
}

seedDatabase();
```

### Clear Script Pattern
Simple database clearing script:

```javascript
// prisma/clear.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
    await prisma.session.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    console.log("Database cleared!");
}

clearDatabase();
```

### Script Organization Pattern
- Use CommonJS require syntax
- Include utility functions for data generation
- Handle async operations properly
- Use console.log for feedback