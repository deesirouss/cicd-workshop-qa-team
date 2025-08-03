#!/bin/bash

# Exit on any error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
npm run build

# Sync build files to S3
echo "Syncing files to S3 bucket $S3_BUCKET..."
aws s3 sync ./frontend/dist s3://"$S3_BUCKET" --delete --region "$AWS_REGION"

# Invalidate CloudFront cache
echo "Invalidating CloudFront distribution $CLOUDFRONT_DISTRIBUTION_ID..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*" --region "$AWS_REGION"

echo "Frontend deployment completed successfully."