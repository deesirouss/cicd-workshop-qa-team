#!/bin/bash
set -e

echo "🚀 Starting Frontend Deployment to S3..."

# Navigate to frontend directory
echo "📁 Navigating to frontend directory..."
cd frontend

# Verify we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build React application
echo "� Building React application..."
npm run build

# Verify build directory exists
if [[ ! -d "build" ]]; then
    echo "❌ Error: Build directory not found"
    exit 1
fi

# Deploy to S3
echo "📤 Deploying to S3 bucket: $S3_BUCKET_NAME"
aws s3 sync build/ s3://"$S3_BUCKET_NAME"/ --delete

# Invalidate CloudFront cache
echo "� Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*"

echo "✅ Frontend deployment completed successfully!"