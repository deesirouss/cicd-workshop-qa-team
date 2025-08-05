#!/bin/bash

# GitHub Actions Self-Hosted Runner Setup Guide
# This script helps fix the GitHub App connection issue

echo "🔧 GitHub Actions Self-Hosted Runner Setup Guide"
echo "=================================================="

echo ""
echo "🚨 ISSUE: Cannot read properties of undefined (reading 'requiresCommentApproval')"
echo ""

echo "📋 SOLUTION STEPS:"
echo ""

echo "1. 🔗 Fix GitHub App Connection in AWS CodeBuild:"
echo "   - Go to AWS Console → CodeBuild → Settings → Source providers"
echo "   - If you see any GitHub connections, disconnect them"
echo "   - Click 'Connect to GitHub'"
echo "   - Select 'GitHub App' (NOT OAuth)"
echo "   - Click 'Install a new app'"
echo ""

echo "2. 📱 Install AWS CodeBuild GitHub App:"
echo "   - You'll be redirected to GitHub"
echo "   - Install the app on your repository: lfyagya/cicd-workshop-qa-team"
echo "   - Grant these permissions:"
echo "     ✅ Contents (read)"
echo "     ✅ Metadata (read)"
echo "     ✅ Pull requests (read & write)"
echo "     ✅ Checks (write)"
echo "     ✅ Commit statuses (write)"
echo ""

echo "3. 🏗️ Create CodeBuild Project for Self-Hosted Runner:"
echo "   - Project name: team6-yagya-github-runner"
echo "   - Source: GitHub (use the app connection you just created)"
echo "   - Repository: https://github.com/lfyagya/cicd-workshop-qa-team"
echo "   - Environment: Managed image"
echo "   - Operating system: Ubuntu"
echo "   - Runtime: Standard"
echo "   - Image: aws/codebuild/standard:7.0"
echo "   - Enable 'Privileged' mode (for Docker)"
echo ""

echo "4. 🔐 Configure IAM Role:"
echo "   - Service role: Create new or use existing"
echo "   - Add policies:"
echo "     - CodeBuildDeveloperAccess"
echo "     - AmazonEC2FullAccess (for runner management)"
echo ""

echo "5. 📝 Update buildspec.yml:"
cat << 'EOF'

version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
  pre_build:
    commands:
      - echo "Setting up GitHub Actions runner..."
      - mkdir actions-runner && cd actions-runner
      - curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
      - tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz
  build:
    commands:
      - echo "Configuring runner..."
      - ./config.sh --url https://github.com/lfyagya/cicd-workshop-qa-team --token $GITHUB_TOKEN --name codebuild-runner --work _work --labels codebuild,linux,x64
      - echo "Starting runner..."
      - ./run.sh &
      - sleep 30
  post_build:
    commands:
      - echo "Runner setup completed"

EOF

echo ""
echo "6. 🎯 Test the Connection:"
echo "   - Go to GitHub → Settings → Actions → Runners"
echo "   - You should see your self-hosted runner listed"
echo "   - Status should be 'Online'"
echo ""

echo "🔑 IMPORTANT SECRETS TO ADD:"
echo "   - GITHUB_TOKEN: Personal access token with repo permissions"
echo "   - SLACK_WEBHOOK_URL: Your Slack webhook URL"
echo ""

echo "✅ After completing these steps, your self-hosted runner should work!"
