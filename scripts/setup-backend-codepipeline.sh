#!/bin/bash

echo "🚀 Backend CodePipeline Setup Script"
echo "====================================="

# Configuration
STACK_NAME="backend-codepipeline-stack"
TEMPLATE_FILE="cloudformation/backend-codepipeline.yml"
REGION="us-east-1"

# Check if required files exist
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ CloudFormation template not found: $TEMPLATE_FILE"
    exit 1
fi

if [ ! -f "backend-buildspec.yml" ]; then
    echo "❌ BuildSpec file not found: backend-buildspec.yml"
    exit 1
fi

echo "✅ Required files found"

# Prompt for parameters
echo ""
echo "📋 Please provide the following parameters:"
echo "==========================================="

read -p "GitHub Owner (default: lfyagya): " GITHUB_OWNER
GITHUB_OWNER=${GITHUB_OWNER:-lfyagya}

read -p "GitHub Repository (default: cicd-workshop-qa-team): " GITHUB_REPO
GITHUB_REPO=${GITHUB_REPO:-cicd-workshop-qa-team}

read -p "GitHub Branch (default: team6-yagya): " GITHUB_BRANCH
GITHUB_BRANCH=${GITHUB_BRANCH:-team6-yagya}

read -s -p "GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

read -p "ECR Repository Name (default: backend-app): " ECR_REPO
ECR_REPO=${ECR_REPO:-backend-app}

read -p "EC2 Instance ID: " EC2_INSTANCE_ID

read -s -p "Slack Webhook URL (optional): " SLACK_WEBHOOK
echo ""

# Validate required parameters
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token is required"
    exit 1
fi

if [ -z "$EC2_INSTANCE_ID" ]; then
    echo "❌ EC2 Instance ID is required"
    exit 1
fi

echo ""
echo "🔍 Configuration Summary:"
echo "========================"
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo "GitHub: $GITHUB_OWNER/$GITHUB_REPO ($GITHUB_BRANCH)"
echo "ECR Repository: $ECR_REPO"
echo "EC2 Instance: $EC2_INSTANCE_ID"
echo "Slack Webhook: ${SLACK_WEBHOOK:+Configured}"
echo ""

read -p "Do you want to proceed? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🚀 Deploying CloudFormation stack..."

# Deploy CloudFormation stack
aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        GitHubOwner="$GITHUB_OWNER" \
        GitHubRepo="$GITHUB_REPO" \
        GitHubBranch="$GITHUB_BRANCH" \
        GitHubToken="$GITHUB_TOKEN" \
        ECRRepository="$ECR_REPO" \
        EC2InstanceId="$EC2_INSTANCE_ID" \
        SlackWebhookUrl="$SLACK_WEBHOOK" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ CloudFormation deployment successful!"
    echo ""
    echo "📊 Getting stack outputs..."
    
    # Get stack outputs
    PIPELINE_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`PipelineName`].OutputValue' \
        --output text)
    
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue' \
        --output text)
    
    echo ""
    echo "🎉 Backend CodePipeline Setup Complete!"
    echo "======================================="
    echo "📍 Pipeline Name: $PIPELINE_NAME"
    echo "🐳 ECR Repository: $ECR_URI"
    echo "🔗 Console: https://$REGION.console.aws.amazon.com/codesuite/codepipeline/pipelines/$PIPELINE_NAME/view"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Commit and push backend-buildspec.yml to trigger the pipeline"
    echo "2. Monitor pipeline execution in AWS Console"
    echo "3. Check Slack for deployment notifications"
    echo ""
    echo "📝 Pipeline will automatically:"
    echo "   ✅ Run unit tests"
    echo "   ✅ Run integration tests with PostgreSQL"
    echo "   ✅ Build Docker image"
    echo "   ✅ Push to ECR"
    echo "   ✅ Deploy to EC2"
    echo "   ✅ Send Slack notifications"
    
else
    echo ""
    echo "❌ CloudFormation deployment failed!"
    echo "Check the AWS CloudFormation console for details."
    exit 1
fi
