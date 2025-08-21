# Copilot Coding Agent Preparation

This document outlines the requirements for running a copilot coding agent on the TaskFlow repository.

## URLs Required for Firewall Allowlist

### GitHub Repositories
- `https://github.com/bitovi/ai-enablement-prompts/*` - AI workflow guides and prompts
- `https://github.com/bitovi/taskflow/*` - Main repository access
- `https://github.com/sponsors/sindresorhus` - Package sponsorship links

### Documentation and External Services
- `https://pris.ly/d/prisma-schema` - Prisma schema documentation
- `https://nextjs.org/docs/*` - Next.js documentation (caching, ESLint, telemetry)
- `https://nextjs.org/telemetry` - Next.js telemetry reporting
- `https://bitovi-training.atlassian.net/browse/USER-13` - Example Jira ticket
- `https://www.figma.com/design/TvHxpQ3z4Zq5JWOVUkgLlU/*` - Design resources

### Package Registry
- `https://registry.npmjs.org/*` - NPM package downloads during installation

### Local Development
- `http://localhost:3000` - Local development server (if agent needs to test UI)

## Build Issues Identified and Fixed

### 1. ESLint Configuration Issues
**Problem**: Build fails due to ESLint errors in generated Prisma client files
**Solution**: Update ESLint config to exclude generated directories

### 2. Code Quality Issues
**Problem**: Unused imports and variables in application code
**Solution**: Clean up unused imports and variables

### 3. TypeScript Issues
**Problem**: Explicit `any` types and empty object types
**Solution**: Fix type annotations where practical

## Dependencies and Setup

The repository requires:
- Node.js version 18 or greater
- SQLite database (automatically created)
- NPM dependencies installation via `npm install`
- Database setup via `npm run db:setup`

## Build Process

1. `npm install` - Install dependencies
2. `npm run db:setup` - Setup database with sample data  
3. `npm run build` - Build the application
4. `npm run dev` - Start development server
5. `npm run lint` - Run linting

## Test Environment Setup

Default test credentials:
- Email: `alice@example.com`
- Password: `password123`

The database is seeded with sample users and tasks for testing.