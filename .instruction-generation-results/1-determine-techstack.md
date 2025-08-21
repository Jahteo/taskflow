# Tech Stack Analysis - TaskFlow

## Core Technology Analysis

**Programming language(s):**
- TypeScript (primary)
- JavaScript (configuration and seed files)

**Primary framework:**
- Next.js 14 with App Router

**Secondary/tertiary frameworks:**
- React 19.1.0 (UI library)
- Prisma ORM (database layer)
- Tailwind CSS 4 (styling)
- shadcn/ui + Radix UI (component library)

**State management approach:**
- React server components with server actions
- No global client-side state management (no Redux, Zustand, etc.)
- Form state managed through React 19 useFormState and useFormStatus hooks
- Database state through Prisma ORM

**Other relevant technologies:**
- SQLite database for local development
- bcryptjs for password hashing
- Lucide React for icons
- Recharts for data visualization
- @hello-pangea/dnd for drag-and-drop functionality
- ESLint for code linting
- date-fns for date utilities

## Domain Specificity Analysis

**Problem domain:**
Task management application - a modern, comprehensive solution for managing tasks and projects with Kanban board functionality.

**Core business concepts:**
- Task lifecycle management (todo, in_progress, review, done)
- Priority levels (low, medium, high)
- User assignment and collaboration
- Project organization
- Dashboard analytics and reporting

**User interactions supported:**
- Task creation, editing, and deletion
- Drag-and-drop task reordering on Kanban boards
- User authentication (login/signup)
- Dashboard analytics viewing
- Task filtering and management
- Team collaboration workflows

**Primary data types and structures:**
- Task entities (name, description, status, priority, due dates)
- User profiles (authentication, assignment relationships)
- Project structures
- Task-user assignment relationships
- Dashboard metrics and analytics data

## Application Boundaries

**Features clearly within scope:**
- Task CRUD operations
- Kanban board interface
- User authentication and profiles
- Dashboard analytics with charts
- Task assignment to team members
- Priority and status management
- Due date tracking
- Team collaboration features

**Features that would be architecturally inconsistent:**
- Real-time collaborative editing (no WebSocket infrastructure)
- Complex workflow automation (simple task states only)
- Advanced permissions/roles beyond basic user assignment
- File storage/upload system (no storage infrastructure)
- Third-party integrations (no API integration patterns)
- Mobile-specific features (web-focused architecture)

**Domain constraints:**
- Feature-based file structure organized around task management
- Server-side rendering with React Server Components
- Form submissions through server actions
- Database operations through Prisma ORM only
- UI components must use shadcn/ui + Radix + Tailwind patterns
- Authentication handled through custom form-based system