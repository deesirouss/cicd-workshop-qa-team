#!/bin/bash
set -e

echo "🚀 Starting Frontend Docker Deployment..."

# Login to ECR
echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Get branch name
branch_name="${GITHUB_REF#refs/heads/}"
echo "🌿 Branch name: $branch_name"

# Navigate to frontend directory
echo "📁 Navigating to frontend directory..."
cd frontend

# Verify we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found in frontend directory"
    exit 1
fi

# Build Frontend Docker Image
echo "🐳 Building Docker image..."
docker build -t "$ECR_REGISTRY/$ECR_FRONTEND_REPOSITORY:$branch_name-latest" .

# Push Frontend Docker Image to ECR
echo "📤 Pushing image to ECR..."
docker push "$ECR_REGISTRY/$ECR_FRONTEND_REPOSITORY:$branch_name-latest"

# Deploy to ECS or EC2 (depending on your infrastructure)
echo "🚀 Triggering frontend deployment..."
# Add your specific deployment commands here

echo "✅ Frontend Docker deployment completed successfully!"