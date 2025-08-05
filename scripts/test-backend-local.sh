#!/bin/bash

echo "🧪 Running Backend Tests Locally..."
echo "=================================="

# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm ci

echo "🔬 Running Unit Tests..."
npm run test:unit

if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed!"
    exit 1
fi

echo "✅ Unit tests passed!"

echo "🔗 Running Integration Tests..."
echo "Note: Make sure PostgreSQL is running locally for integration tests"

# Check if PostgreSQL is available
if command -v pg_isready >/dev/null 2>&1; then
    if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        echo "✅ PostgreSQL detected, running integration tests..."
        npm run test:integration
        
        if [ $? -ne 0 ]; then
            echo "❌ Integration tests failed!"
            exit 1
        fi
        
        echo "✅ Integration tests passed!"
    else
        echo "⚠️  PostgreSQL not running locally. Skipping integration tests."
        echo "   Integration tests will run in CI/CD with Docker PostgreSQL service."
    fi
else
    echo "⚠️  PostgreSQL not installed locally. Skipping integration tests."
    echo "   Integration tests will run in CI/CD with Docker PostgreSQL service."
fi

echo ""
echo "🎉 All available tests completed successfully!"
echo "🚀 Ready to push to trigger CI/CD pipeline!"
