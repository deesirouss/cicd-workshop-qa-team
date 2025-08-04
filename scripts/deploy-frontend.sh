#!/bin/bash
set -e

echo " Building frontend..."
cd frontend
npm install
npm run build

echo " Deploying to S3..."
aws s3 sync build/ s3://$S3_BUCKET_NAME --delete

echo " Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*"
