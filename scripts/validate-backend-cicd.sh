#!/bin/bash

echo "🧪 Backend CI/CD Test Validation"
echo "================================"

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "📁 Checking backend directory structure..."

# Check backend structure
if [ -d "backend/tests/unit" ] && [ -d "backend/tests/integration" ]; then
    echo "✅ Test directories found"
else
    echo "❌ Test directories missing"
    exit 1
fi

# Check package.json scripts
echo "📋 Checking package.json test scripts..."
cd backend

if grep -q '"test:unit"' package.json; then
    echo "✅ test:unit script found"
else
    echo "❌ test:unit script missing"
    exit 1
fi

if grep -q '"test:integration"' package.json; then
    echo "✅ test:integration script found"
else
    echo "❌ test:integration script missing"
    exit 1
fi

if grep -q '"migrate"' package.json; then
    echo "✅ migrate script found"
else
    echo "❌ migrate script missing"
    exit 1
fi

# Check test files exist
echo "📄 Checking test files..."
if [ -f "tests/unit/userService.test.js" ]; then
    echo "✅ Unit test file found"
else
    echo "❌ Unit test file missing"
fi

if [ -f "tests/integration/userRoutes.test.js" ]; then
    echo "✅ Integration test file found"
else
    echo "❌ Integration test file missing"
fi

if [ -f "tests/integration/health.test.js" ]; then
    echo "✅ Health test file found"
else
    echo "❌ Health test file missing"
fi

# Check dependencies
echo "📦 Checking test dependencies..."
if grep -q '"jest"' package.json; then
    echo "✅ Jest found in dependencies"
else
    echo "❌ Jest missing from dependencies"
fi

if grep -q '"supertest"' package.json; then
    echo "✅ Supertest found in dependencies"
else
    echo "❌ Supertest missing from dependencies"
fi

echo ""
echo "🎯 CI/CD Validation Summary:"
echo "============================"
echo "✅ Project structure validated"
echo "✅ Test scripts configured"
echo "✅ Dependencies checked"
echo ""
echo "🚀 Ready for CI/CD execution!"
echo "   Push your changes to trigger the pipeline:"
echo "   git add . && git commit -m 'fix: improve backend CI/CD' && git push"
