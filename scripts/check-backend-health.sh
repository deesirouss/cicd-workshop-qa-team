#!/bin/bash

# Backend Health Check Script
# This script should be run before Cypress tests

echo "🔍 Checking Backend Service Health..."

BACKEND_URL="https://t6-api.cicdws.bibek-mishra.com.np"
MAX_ATTEMPTS=30
WAIT_TIME=10

echo "Backend URL: $BACKEND_URL"

for i in $(seq 1 $MAX_ATTEMPTS); do
  echo "Attempt $i/$MAX_ATTEMPTS: Checking backend health..."
  
  # Check if backend is responding
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health" || echo "000")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Backend is healthy! (HTTP $HTTP_CODE)"
    exit 0
  else
    echo "❌ Backend not ready (HTTP $HTTP_CODE). Waiting ${WAIT_TIME}s..."
    sleep $WAIT_TIME
  fi
done

echo "❌ Backend failed to become healthy after $((MAX_ATTEMPTS * WAIT_TIME)) seconds"
echo "🔧 Please check:"
echo "   1. Backend deployment status"
echo "   2. Docker container logs"
echo "   3. Database connectivity"
echo "   4. Load balancer/nginx configuration"
exit 1
