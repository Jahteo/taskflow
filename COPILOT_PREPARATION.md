# Copilot Coding Agent Preparation Guide

This document outlines all requirements, potential issues, and preparation steps for a copilot coding agent to work effectively on the TaskFlow repository.

## 🚀 Quick Start for Copilots

### Prerequisites
- Node.js 18 or greater
- npm (comes with Node.js)

### Initial Setup Commands
```bash
# 1. Install dependencies
npm install

# 2. Setup database (create, migrate, and seed)
npm run db:setup

# 3. Start development server
npm run dev
```

### Verification Commands
```bash
# Verify linting passes
npm run lint

# Verify build succeeds
npm run build

# Access the application
# Open http://localhost:3000
# Login with: alice@example.com / password123
```

## 🌐 External URLs for Firewall Allowlist

The following URLs may need to be added to the copilot's firewall allowlist:

### Required for Development
- `https://registry.npmjs.org/` - NPM package registry
- `https://nodejs.org/` - Node.js resources

### Documentation & Resources (Referenced in README)
- `https://www.figma.com/design/TvHxpQ3z4Zq5JWOVUkgLlU/Tasks-Search-and-Filter` - Design mockups
- `https://bitovi-training.atlassian.net/browse/USER-13` - Example Jira ticket
- `https://github.com/bitovi/ai-enablement-prompts` - AI workflow guides
- `https://nextjs.org/telemetry` - Next.js telemetry (optional)

### Optional External Services
- `https://github.com/` - GitHub (for external resources)
- `https://tailwindcss.com/` - Tailwind CSS documentation
- `https://ui.shadcn.com/` - Shadcn/UI documentation

## 🏗️ Build Process & Tools

### Linting
- **Tool**: ESLint with Next.js and TypeScript configurations
- **Command**: `npm run lint`
- **Critical**: Must pass for build to succeed
- **Note**: Generated Prisma files are excluded from linting

### Building
- **Tool**: Next.js build system
- **Command**: `npm run build`
- **Output**: Static and server-rendered pages
- **Critical**: Must succeed for deployment

### Database Operations
- **Tool**: Prisma ORM with SQLite
- **Setup**: `npm run db:setup` (creates, migrates, and seeds)
- **Reset**: `npm run db:reset` (clears and re-seeds)
- **Location**: SQLite file at `prisma/app.db`

## 📁 Project Structure

```
taskflow/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Authenticated routes
│   │   ├── board/              # Kanban board page
│   │   ├── tasks/              # Task management
│   │   │   └── actions.ts      # Server actions
│   │   └── team/               # Team statistics
│   ├── login/                  # Authentication pages
│   ├── signup/
│   └── generated/prisma/       # Generated Prisma client (excluded from linting)
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components (shadcn/ui)
│   └── [feature-components]    # Feature-specific components
├── lib/                        # Utility functions and configurations
├── prisma/                     # Database schema and scripts
│   ├── schema.prisma          # Database schema
│   ├── seed.js               # Database seeding script
│   └── clear.js              # Database clearing script
└── public/                     # Static assets
```

## 🔧 Development Patterns

### Server Actions
- **Pattern**: Use server actions for backend operations
- **Location**: `app/(dashboard)/[feature]/actions.ts`
- **Example**: Task creation, updates, deletions

### Component Structure
- **Base**: Shadcn/ui components in `components/ui/`
- **Features**: Feature-specific components in `components/`
- **Styling**: Tailwind CSS with custom configurations

### Database Operations
- **ORM**: Prisma with SQLite
- **Generated**: Client files in `app/generated/prisma/`
- **Models**: User, Task, Session (see `prisma/schema.prisma`)

## ⚠️ Known Issues & Gotchas

### Build Issues (RESOLVED ✅)
- ~~ESLint errors from generated Prisma files~~ → Fixed with proper ignores
- ~~Unused variable warnings~~ → Cleaned up
- ~~TypeScript `any` types~~ → Fixed with proper types

### Development Considerations
1. **Generated Files**: Prisma generates client files that should not be edited
2. **Database Reset**: Use `npm run db:reset` if database gets corrupted
3. **Port Conflicts**: Default port 3000 may conflict with other services
4. **SQLite Limitations**: Single file database suitable for development only

### Common Copilot Pitfalls
1. **Don't edit generated files** in `app/generated/prisma/`
2. **Always run linting** before building: `npm run lint`
3. **Database schema changes** require Prisma commands: `npx prisma db push`
4. **Environment setup** may need `.env` file (see `.env.example`)

## 🧪 Testing & Validation

### Manual Testing Steps
1. **Start the application**: `npm run dev`
2. **Access**: http://localhost:3000
3. **Login**: alice@example.com / password123
4. **Navigate**: Test /tasks, /board, /team pages
5. **Create Task**: Use "New Task" button
6. **Drag & Drop**: Test Kanban board functionality

### Automated Checks
```bash
# Full validation sequence
npm install
npm run db:setup
npm run lint
npm run build
npm run dev # Manual verification
```

## 🔐 Authentication & Users

### Default Users (Seeded)
- **Primary**: alice@example.com / password123
- **Others**: bob@example.com, charlie@example.com, etc.
- **Password**: All users use "password123"

### Session Management
- **Type**: Simple token-based sessions
- **Storage**: Database sessions table
- **Cookies**: HTTP-only session tokens

## 🎯 Feature Implementation Guidelines

### Adding New Features
1. **Follow existing patterns** in server actions and components
2. **Use Prisma** for database operations
3. **Implement proper error handling** with try/catch blocks
4. **Add proper TypeScript types** to avoid linting errors
5. **Test with seeded data** using existing users and tasks

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js and TypeScript rules
- **Components**: Use shadcn/ui base components
- **Styling**: Tailwind CSS utility classes

## 📝 Environment Configuration

### Required Environment Variables
See `.env.example` for template. Key variables:
- `DATABASE_URL`: SQLite database location
- `NODE_ENV`: Environment mode
- `NEXT_TELEMETRY_DISABLED`: Optional telemetry setting

### Database Configuration
SQLite database requires no additional setup - automatically created during `npm run db:setup`.

## 🚨 Emergency Procedures

### If Build Fails
1. Check linting: `npm run lint`
2. Clear generated files: `rm -rf app/generated/prisma`
3. Regenerate Prisma: `npx prisma generate`
4. Retry build: `npm run build`

### If Database Issues
1. Clear database: `npm run db:clear`
2. Recreate schema: `npx prisma db push`
3. Reseed data: `npm run db:seed`

### If Development Server Won't Start
1. Check port availability (default 3000)
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

## ✅ Readiness Checklist

Before assigning work to a copilot, verify:

- [ ] Repository cloned and dependencies installed
- [ ] `npm run lint` passes without errors
- [ ] `npm run build` completes successfully  
- [ ] `npm run dev` starts development server
- [ ] Database setup completed with `npm run db:setup`
- [ ] Application accessible at http://localhost:3000
- [ ] Login works with alice@example.com / password123
- [ ] All external URLs added to firewall allowlist if needed

## 📞 Support Information

### Key Documentation
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/UI**: https://ui.shadcn.com

### Common Commands Reference
```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run lint            # Run ESLint

# Database
npm run db:setup        # Full database setup
npm run db:clear        # Clear all data
npm run db:seed         # Seed sample data
npm run db:reset        # Clear and re-seed

# Prisma
npx prisma db push      # Push schema changes
npx prisma generate     # Regenerate client
npx prisma studio       # Open database browser
```

---

*This guide ensures copilot coding agents can work effectively on the TaskFlow repository without encountering common setup and configuration issues.*