#!/bin/bash
set -e	

echo "Logging into Amazon ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

branch_name="$BRANCH_NAME"
echo "Deploying branch: $branch_name"

cd backend
echo "Building Docker image: $ECR_REGISTRY/$ECR_REPOSITORY:$branch_name-latest"
docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY:$branch_name-latest" .

echo "Pushing Docker image to ECR..."
docker push "$ECR_REGISTRY/$ECR_REPOSITORY:$branch_name-latest"

echo "Triggering deployment on EC2 via SSM..."
aws ssm send-command \
    --document-name "AWS-RunShellScript" \
    --targets "Key=InstanceIds,Values=$EC2_INSTANCE_ID" \
    --parameters "commands=[\"sudo su - root -c '/root/deployment/deployment_script_${branch_name}.sh'\"]" \
    --region "$AWS_REGION" \
    --comment "Triggered by GitHub Actions for $branch_name"
