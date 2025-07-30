#!/bin/bash

branch_name="${GITHUB_REF#refs/heads/}"

cd frontend
npm install
export REACT_APP_API_URL=$REACT_APP_API_URL
export REACT_APP_BRANCH_NAME=$branch_name
npm run build
aws s3 sync build/ s3://$S3_BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
