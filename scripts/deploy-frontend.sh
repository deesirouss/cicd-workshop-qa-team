#!/bin/bash

branch_name="${GITHUB_REF#refs/heads/}"

cd frontend
npm install
npm run build
aws s3 sync build/ s3://$S3_BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
