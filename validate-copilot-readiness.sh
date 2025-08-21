#!/bin/bash

# TaskFlow Copilot Readiness Validation Script
# This script validates that the repository is ready for copilot coding agents

echo "🤖 TaskFlow Copilot Readiness Validation"
echo "========================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall success
OVERALL_SUCCESS=true

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        OVERALL_SUCCESS=false
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

echo ""
print_info "Step 1: Checking Node.js and npm versions..."

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_status 0 "Node.js version $NODE_VERSION (>= 18 required)"
    else
        print_status 1 "Node.js version $NODE_VERSION (< 18, upgrade required)"
    fi
else
    print_status 1 "Node.js not found or not accessible"
fi

# Check npm
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status 0 "npm version $NPM_VERSION"
else
    print_status 1 "npm not found or not accessible"
fi

echo ""
print_info "Step 2: Checking project dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_status 0 "Dependencies installed (node_modules exists)"
else
    print_status 1 "Dependencies not installed (run 'npm install')"
fi

# Check if package.json exists
if [ -f "package.json" ]; then
    print_status 0 "package.json found"
else
    print_status 1 "package.json not found"
fi

echo ""
print_info "Step 3: Checking database setup..."

# Check if Prisma client is generated
if [ -d "app/generated/prisma" ]; then
    print_status 0 "Prisma client generated"
else
    print_status 1 "Prisma client not generated (run 'npm run db:setup')"
fi

# Check if database file exists
if [ -f "prisma/app.db" ]; then
    print_status 0 "SQLite database file exists"
else
    print_status 1 "Database file not found (run 'npm run db:setup')"
fi

echo ""
print_info "Step 4: Running linting check..."

# Run linting
npm run lint > /dev/null 2>&1
print_status $? "ESLint passes without errors"

echo ""
print_info "Step 5: Testing build process..."

# Run build (capture output to avoid flooding console)
npm run build > build_output.tmp 2>&1
BUILD_RESULT=$?
rm -f build_output.tmp
print_status $BUILD_RESULT "Build completes successfully"

echo ""
print_info "Step 6: Checking configuration files..."

# Check ESLint config
if [ -f "eslint.config.mjs" ]; then
    print_status 0 "ESLint configuration found"
else
    print_status 1 "ESLint configuration missing"
fi

# Check Prisma schema
if [ -f "prisma/schema.prisma" ]; then
    print_status 0 "Prisma schema found"
else
    print_status 1 "Prisma schema missing"
fi

# Check environment example
if [ -f ".env.example" ]; then
    print_status 0 "Environment example file found"
else
    print_status 1 "Environment example file missing"
fi

# Check copilot preparation guide
if [ -f "COPILOT_PREPARATION.md" ]; then
    print_status 0 "Copilot preparation guide found"
else
    print_status 1 "Copilot preparation guide missing"
fi

echo ""
print_info "Step 7: Checking for common issues..."

# Check .gitignore includes generated files
if grep -q "app/generated/prisma" .gitignore 2>/dev/null; then
    print_status 0 "Generated Prisma files properly ignored"
else
    print_warning "Generated Prisma files may not be properly ignored"
fi

# Check for .env file (should not be committed)
if [ -f ".env" ]; then
    print_warning ".env file exists (ensure it's not committed to git)"
else
    print_info ".env file not present (expected for clean repository)"
fi

echo ""
echo "🎯 External URLs that may need firewall allowlist:"
echo "   • https://registry.npmjs.org/ (NPM packages)"
echo "   • https://www.figma.com/ (Design resources)"
echo "   • https://bitovi-training.atlassian.net/ (Jira tickets)"
echo "   • https://github.com/bitovi/ (AI workflow guides)"
echo "   • https://nextjs.org/ (Next.js resources)"

echo ""
echo "🚀 Quick start commands for copilot:"
echo "   npm install"
echo "   npm run db:setup"
echo "   npm run dev"
echo "   # Access: http://localhost:3000"
echo "   # Login: alice@example.com / password123"

echo ""
echo "========================================"
if [ "$OVERALL_SUCCESS" = true ]; then
    echo -e "${GREEN}🎉 Repository is ready for copilot coding agents!${NC}"
    exit 0
else
    echo -e "${RED}❌ Repository requires fixes before copilot can work effectively.${NC}"
    echo -e "   📖 See COPILOT_PREPARATION.md for detailed setup instructions."
    exit 1
fi