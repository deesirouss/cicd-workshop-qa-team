# Quick Backend Test Fix

## Run this to test locally (if you have PostgreSQL):

```bash
# Set test environment variables
export NODE_ENV=test
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=your_test_db
export DB_USER=your_user
export DB_PASSWORD=your_password

# Run tests
cd backend
npm run test:unit    # Should work without database
npm run test:integration  # Needs PostgreSQL
```

## Or just push to CI/CD:

The GitHub Actions workflow includes a PostgreSQL service that will handle the database setup automatically.

## Files created for Backend CI/CD:

1. `.github/workflows/backend-testing.yml` - Standalone testing
2. `.github/workflows/backend-deployment.yml` - Enhanced with testing
3. `scripts/test-backend-local.sh` - Local testing script
4. `docs/BACKEND_TESTING_CICD.md` - Complete documentation

## Push to test:

```bash
git add .
git commit -m "Add backend testing CI/CD"
git push origin team6-yagya
```

This will trigger both workflows and you'll see:
- Real-time progress in GitHub Actions
- Slack notifications (if webhook configured)
- Test results and coverage reports
- Deployment only if tests pass
