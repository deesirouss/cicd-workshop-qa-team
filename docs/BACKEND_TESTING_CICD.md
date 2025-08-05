# Backend Testing CI/CD Setup

## Overview
This document outlines the backend testing strategy integrated into our CI/CD pipeline.

## Test Structure
```
backend/tests/
├── unit/
│   └── userService.test.js     # Unit tests for business logic
└── integration/
    ├── health.test.js          # Health endpoint tests
    └── userRoutes.test.js      # API endpoint tests
```

## CI/CD Workflows

### 1. Backend Testing Workflow (`.github/workflows/backend-testing.yml`)
**Trigger**: Push/PR to `team6-yagya` branch
**Purpose**: Standalone testing workflow

**Jobs**:
- **Unit Tests**: Fast, isolated tests without external dependencies
- **Integration Tests**: API tests with PostgreSQL database
- **Notifications**: Slack alerts for test results

### 2. Backend Deployment Workflow (`.github/workflows/backend-deployment.yml`)
**Trigger**: Push to `team6-yagya` branch
**Purpose**: Test → Build → Deploy pipeline

**Jobs**:
1. **Test Job**: Run all tests (unit + integration) with PostgreSQL service
2. **Deploy Job**: Deploy only if tests pass

## Test Commands

### Local Testing
```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests (requires PostgreSQL)
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run local test script
./scripts/test-backend-local.sh
```

### CI/CD Testing Environment
- **Node.js**: 20.x
- **Database**: PostgreSQL 13 (Docker service)
- **Test Database**: `testdb`
- **Coverage**: Collected automatically

## Environment Variables for Tests

### Integration Tests Require:
```yaml
NODE_ENV: test
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: testdb
DB_USER: testuser
DB_PASSWORD: testpassword
PORT: 3001
```

## Test Flow in CI/CD

### Backend Testing Workflow
1. **Checkout** code
2. **Setup** Node.js 20
3. **Install** dependencies
4. **Unit Tests** (parallel with integration setup)
5. **Start PostgreSQL** service
6. **Run migrations** on test database
7. **Integration Tests** with real database
8. **Upload** coverage reports
9. **Send** Slack notifications

### Backend Deployment Workflow
1. **Test Phase**:
   - All unit tests must pass
   - All integration tests must pass
   - Database migrations must succeed
2. **Deploy Phase** (only if tests pass):
   - Build Docker image
   - Push to ECR
   - Deploy to EC2
   - Send success/failure notifications

## Test Coverage
- **Location**: `backend/coverage/`
- **Format**: HTML, JSON, LCOV
- **Upload**: Available as GitHub Actions artifacts
- **Threshold**: Configure in `backend/package.json` jest config

## Database Testing Strategy
1. **Unit Tests**: Mock database calls, test business logic
2. **Integration Tests**: Real PostgreSQL database, test API endpoints
3. **Migrations**: Tested in CI with fresh database

## Notifications
Slack notifications include:
- ✅ **Success**: All tests passed, ready for deployment
- ❌ **Failure**: Which test suite failed, link to logs
- 📊 **Coverage**: Test coverage reports in artifacts

## Best Practices
1. **Fast Unit Tests**: No external dependencies
2. **Comprehensive Integration Tests**: Test real API flows
3. **Database Isolation**: Each test run uses fresh database
4. **Fail Fast**: Stop deployment if any tests fail
5. **Clear Notifications**: Immediate feedback on test status

## Monitoring Test Health
- **GitHub Actions**: View test results and logs
- **Artifacts**: Download coverage reports
- **Slack**: Real-time notifications
- **PR Checks**: Tests must pass before merge

## Troubleshooting

### Common Issues:
1. **Database Connection**: Check PostgreSQL service health
2. **Migration Failures**: Verify migration scripts
3. **Timeout Issues**: Increase test timeout in Jest config
4. **Memory Issues**: Configure Node.js memory limits

### Local Debugging:
```bash
# Check test configuration
npm run test -- --verbose

# Run specific test file
npm test userService.test.js

# Debug with logging
DEBUG=* npm test
```

## Next Steps
1. Add more comprehensive test coverage
2. Implement performance testing
3. Add security testing
4. Configure test result dashboards
