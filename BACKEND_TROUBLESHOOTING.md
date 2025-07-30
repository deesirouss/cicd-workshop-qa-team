# Backend Service Troubleshooting Guide

## 1. Check Backend Deployment Status

### Docker Container Status:
```bash
# SSH into your EC2 instance
docker ps | grep backend
docker logs <backend-container-id>
```

### Service Health Check:
```bash
# Check if backend service is running
curl -I https://t6-api.cicdws.bibek-mishra.com.np/api/health

# Check nginx configuration
sudo nginx -t
sudo systemctl status nginx
```

## 2. Check Database Connectivity

### PostgreSQL Status:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres
docker logs <postgres-container-id>

# Test database connection
docker exec -it <postgres-container> psql -U cicd_user -d cicd_workshop -c "SELECT 1;"
```

## 3. Restart Services if Needed

### Restart Backend:
```bash
# If using Docker Compose
docker-compose restart backend

# Or restart individual container
docker restart <backend-container-id>
```

### Restart Nginx:
```bash
sudo systemctl restart nginx
```

## 4. Common Issues and Solutions

### Issue 1: Database Connection Failed
**Solution**: Check database environment variables and connection string

### Issue 2: Port Conflicts
**Solution**: Ensure ports 3001 (backend) and 5432 (database) are not in use

### Issue 3: Nginx Configuration
**Solution**: Check nginx proxy_pass configuration for backend upstream

### Issue 4: EC2 Security Groups
**Solution**: Ensure security groups allow traffic on required ports

## 5. Manual Verification Commands

```bash
# Test backend API directly
curl -X GET "https://t6-api.cicdws.bibek-mishra.com.np/api/health"
curl -X GET "https://t6-api.cicdws.bibek-mishra.com.np/api/users"

# Test with verbose output
curl -v "https://t6-api.cicdws.bibek-mishra.com.np/api/health"
```

## 6. Expected API Responses

### Health Check Response:
```json
{
  "status": "OK",
  "timestamp": "2025-07-30T05:59:11.000Z",
  "uptime": 123456
}
```

### Users API Response:
```json
[
  {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2025-07-30T05:59:11.000Z"
  }
]
```
