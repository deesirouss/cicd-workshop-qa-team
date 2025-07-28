#!/bin/bash
set -e

# Login to ECR
echo "🔐 Logging into AWS ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

# Get branch name
branch_name="${GITHUB_REF#refs/heads/}"
echo "🌿 Branch name: $branch_name"

# Navigate to backend directory BEFORE building
echo "📁 Navigating to backend directory..."
cd backend

# Verify we're in the right directory (optional safety check)
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found in backend directory"
    exit 1
fi

# Build Backend Docker Image
echo "🐳 Building Docker image..."
docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY:$branch_name-latest" .

# Push Backend Docker Image to ECR
echo "📤 Pushing image to ECR..."
docker push "$ECR_REGISTRY/$ECR_REPOSITORY:$branch_name-latest"

# Run deployment script on EC2
echo "🚀 Triggering deployment on EC2 instance..."
aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets "[{\"Key\":\"InstanceIds\",\"Values\":[\"$EC2_INSTANCE_ID\"]}]" \
    --parameters "{\"commands\":[\"sudo su - root -c '/root/deployment/deployment_script_team6-yagya.sh'\"]}" \
    --region "$AWS_REGION"

echo "✅ Deployment command sent successfully!"