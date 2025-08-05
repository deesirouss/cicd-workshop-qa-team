# Backend CI/CD Deployment Guide

## Overview
This guide explains the complete backend CI/CD pipeline with unit and integration testing.

## 🏗️ Pipeline Architecture

### Workflow Execution Order
1. **Backend Testing** (`backend-testing.yml`) - Runs on push/PR
2. **Backend Deployment** (`backend-deployment.yml`) - Runs on push to team6-yagya

## 🧪 Testing Strategy

### Unit Tests
- **Location**: `backend/tests/unit/`
- **Purpose**: Test business logic without external dependencies
- **Execution**: Fast, isolated, no database required
- **Command**: `npm run test:unit`

### Integration Tests
- **Location**: `backend/tests/integration/`
- **Purpose**: Test API endpoints with real database
- **Execution**: Uses PostgreSQL Docker service
- **Command**: `npm run test:integration`

## 🔄 CI/CD Workflow Details

### Backend Testing Workflow
```yaml
Triggers: Push/PR to team6-yagya
Jobs:
  1. unit-tests (parallel)
  2. integration-tests (depends on unit-tests)
  3. send-notifications (depends on both)
```

### Backend Deployment Workflow
```yaml
Triggers: Push to team6-yagya
Jobs:
  1. test (unit + integration + migrations)
  2. deploy (only if tests pass)
```

## 🐘 Database Testing Setup

### PostgreSQL Service Configuration
```yaml
services:
  postgres:
    image: postgres:13
    env:
      POSTGRES_PASSWORD: testpassword
      POSTGRES_USER: testuser
      POSTGRES_DB: testdb
    ports:
      - 5432:5432
```

### Environment Variables
```yaml
NODE_ENV: test
DB_HOST: localhost
DB_PORT: 5432
DB_NAME: testdb
DB_USER: testuser
DB_PASSWORD: testpassword
```

## 🚀 Deployment Process

### Test Phase (Required)
1. **Install Dependencies**: `npm ci`
2. **Unit Tests**: Run all unit tests
3. **PostgreSQL Setup**: Start database service
4. **Database Migrations**: Apply schema changes
5. **Integration Tests**: Test API endpoints
6. **Coverage Collection**: Generate test reports

### Deploy Phase (Only if tests pass)
1. **Environment Validation**: Check required secrets
2. **Docker Build**: Create container image
3. **ECR Push**: Upload to registry
4. **EC2 Deployment**: Update running containers
5. **Health Verification**: Confirm deployment success

## 📊 Test Coverage & Artifacts

### Coverage Reports
- **Format**: HTML, JSON, LCOV
- **Location**: `backend/coverage/`
- **Access**: GitHub Actions artifacts

### Artifacts Available
- Unit test coverage
- Integration test coverage
- Test execution logs
- Deployment logs

## 🔔 Notifications

### Slack Integration
- **Success**: All tests passed, deployment successful
- **Failure**: Which stage failed, link to logs
- **Coverage**: Test coverage reports available

### Notification Conditions
- Tests pass/fail
- Deployment success/failure
- Environment validation errors

## 🛠️ Local Development

### Pre-CI/CD Validation
```bash
# Validate CI/CD setup
./scripts/validate-backend-cicd.sh

# Run tests locally
./scripts/test-backend-local.sh
```

### Required Local Setup
1. **Node.js 20+**
2. **PostgreSQL** (optional for integration tests)
3. **Git** for version control

## 🔧 Troubleshooting

### Common Issues

#### Test Failures
- Check test file syntax
- Verify database connectivity
- Review environment variables

#### Deployment Failures
- Validate AWS credentials
- Check ECR repository exists
- Verify EC2 instance accessibility

#### Database Issues
- Ensure PostgreSQL service is healthy
- Check migration scripts
- Verify connection parameters

### Debug Commands
```bash
# Check test configuration
npm run test -- --verbose

# Run specific test
npm test userService.test.js

# View coverage report
npm test -- --coverage

# Debug database connection
PGPASSWORD=testpassword psql -h localhost -U testuser -d testdb
```

## 📈 Pipeline Monitoring

### GitHub Actions
- Real-time workflow progress
- Step-by-step execution logs
- Artifact downloads

### Success Indicators
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ Database migrations succeed
- ✅ Deployment completes successfully
- ✅ Health checks pass

### Failure Indicators
- ❌ Test failures with error details
- ❌ Database connection issues
- ❌ Deployment script errors
- ❌ Environment validation failures

## 🎯 Best Practices

### Test Organization
1. Keep unit tests fast and isolated
2. Use real database for integration tests
3. Clean up test data after execution
4. Mock external dependencies in unit tests

### CI/CD Optimization
1. Use dependency caching for faster builds
2. Run unit tests before integration tests
3. Fail fast on critical errors
4. Provide clear error messages

### Deployment Safety
1. Require all tests to pass before deployment
2. Validate environment before deploying
3. Use health checks after deployment
4. Maintain rollback capabilities

## 🚀 Getting Started

1. **Ensure all files are committed**:
   ```bash
   git add .
   git commit -m "feat: improve backend CI/CD with comprehensive testing"
   ```

2. **Push to trigger pipeline**:
   ```bash
   git push origin team6-yagya
   ```

3. **Monitor execution**:
   - GitHub Actions: Real-time progress
   - Slack: Notifications (if configured)
   - Artifacts: Coverage reports

4. **Verify deployment**:
   - Check backend health endpoint
   - Verify new features work
   - Monitor application logs

The pipeline will ensure your backend is thoroughly tested before deployment! 🎉
