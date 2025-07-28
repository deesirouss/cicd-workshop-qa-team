# 🚀 CI/CD Workshop - Complete Setup Guide

## 📋 Prerequisites Check

Before starting, ensure you have installed:
- ✅ **Node.js 20+** - [Download here](https://nodejs.org/)
- ✅ **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- ✅ **Git** - [Download here](https://git-scm.com/)

## 🛠️ Setup Methods

### Method 1: Docker Setup (Recommended - Easiest) 🐳

This method uses Docker to run everything in containers.

#### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (you should see "Docker Desktop is running" in the system tray)

#### Step 2: Clean up any existing containers
```bash
# Stop any existing PostgreSQL containers
docker stop cicd-postgres

# Remove if exists
docker rm cicd-postgres
```

#### Step 3: Fix line endings (Windows users only)
```bash
dos2unix backend/entrypoint.sh
```

#### Step 4: Start all services
```bash
# Build and start all services
docker compose up --build -d

# Check if all services are running
docker compose ps
```

#### Step 5: Verify setup
Visit these URLs in your browser:
- **Frontend**: http://localhost:3000
- **Backend API Health**: http://localhost:3001/api/health
- **Backend API Users**: http://localhost:3001/api/users

### Method 2: Local Development Setup 💻

This method runs services locally on your machine.

#### Step 1: Start PostgreSQL Database
```bash
# Start PostgreSQL container
docker run -itd --rm --name cicd-postgres \
  -e POSTGRES_DB=cicd_workshop \
  -e POSTGRES_USER=cicd_user \
  -e POSTGRES_PASSWORD=cicd_password \
  -p 5432:5432 postgres:15-alpine
```

#### Step 2: Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start backend server
npm run dev
```

#### Step 3: Setup Frontend (New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

#### Step 4: Setup E2E Tests (Optional)
```bash
# Navigate to e2e-tests
cd e2e-tests

# Install dependencies
npm install
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Frontend Tests
```bash
cd frontend

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### E2E Tests (Cypress)
```bash
cd e2e-tests

# Run E2E tests in headless mode
npm run cypress:run

# Open Cypress interactive mode
npm run cypress:open

# Run all E2E tests
npm run test:e2e
```

## 🌐 Application URLs

After successful setup:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **Users API**: http://localhost:3001/api/users

## 📊 Database Access

**PostgreSQL Connection Details:**
- Host: localhost
- Port: 5432
- Database: cicd_workshop
- Username: cicd_user
- Password: cicd_password

## 🔧 Troubleshooting

### Docker Issues
1. **Docker not starting**: Ensure Docker Desktop is running
2. **Port conflicts**: Stop any services using ports 3000, 3001, or 5432
3. **Permission errors**: Run terminal as administrator on Windows

### Node.js Issues
1. **Module not found**: Run `npm install` in the respective directory
2. **Port in use**: Kill any processes using the required ports
3. **Database connection**: Ensure PostgreSQL is running

### Common Commands
```bash
# Stop all Docker containers
docker compose down

# Rebuild and restart
docker compose up --build -d

# View logs
docker compose logs -f

# Check running containers
docker compose ps

# Clean up everything
docker compose down -v
docker system prune -f
```

## 🎯 What You Should See

### Successful Setup Indicators:
1. ✅ Frontend loads at http://localhost:3000
2. ✅ You can add/delete users
3. ✅ Backend health check returns "OK"
4. ✅ All tests pass
5. ✅ Database contains initial sample data

### Sample API Responses:

**Health Check** (GET /api/health):
```json
{
  "status": "OK",
  "timestamp": "2025-01-28T...",
  "uptime": 123.456,
  "database": {
    "connected": true
  }
}
```

**Users List** (GET /api/users):
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-28T...",
    "updated_at": "2025-01-28T..."
  }
]
```

## 🎉 Success!

If you can see the user management interface and successfully add/delete users, your setup is complete!

The application demonstrates:
- React frontend with user management
- Node.js/Express REST API
- PostgreSQL database
- Full test coverage (Unit, Integration, E2E)
- Docker containerization
- CI/CD ready structure
