# Slack Integration Setup for AWS CodeBuild

## 1. Create Slack Webhook URL

### Step 1: Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Enter App Name: "CICD Workshop Notifications"
4. Select your workspace

### Step 2: Create Incoming Webhook
1. In your Slack app, go to "Incoming Webhooks"
2. Turn on "Activate Incoming Webhooks"
3. Click "Add New Webhook to Workspace"
4. Choose your channel (e.g., #cicd-notifications)
5. Copy the webhook URL

### Step 3: Add GitHub Integration (Alternative)
```
# In your Slack channel, run these commands:
/github subscribe lfyagya/cicd-workshop-qa-team workflows:{event:"pull_request","push" branch:"main","team6-yagya"}
/github subscribe lfyagya/cicd-workshop-qa-team deployments reviews commits:all
```

## 2. Store Slack Webhook in AWS Parameter Store

### AWS CLI Commands:
```bash
# Store webhook URL securely
aws ssm put-parameter \
  --name "/cicd-workshop/slack-webhook-url" \
  --value "https://hooks.slack.com/services/YOUR/WEBHOOK/URL" \
  --type "SecureString" \
  --region us-east-1

# Store other required parameters
aws ssm put-parameter \
  --name "/cicd-workshop/backend-api-url" \
  --value "https://t6-api.cicdws.bibek-mishra.com.np/api" \
  --type "String" \
  --region us-east-1

aws ssm put-parameter \
  --name "/cicd-workshop/frontend-url" \
  --value "https://t6.cicdws.bibek-mishra.com.np" \
  --type "String" \
  --region us-east-1
```

## 3. CodeBuild IAM Role Permissions

Add these permissions to your CodeBuild service role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters"
      ],
      "Resource": [
        "arn:aws:ssm:us-east-1:*:parameter/cicd-workshop/*"
      ]
    }
  ]
}
```

## 4. Test Slack Notification

### Manual Test:
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🧪 Test notification from CICD Workshop!"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## 5. Expected Slack Messages

### Success Message:
```
✅ E2E Tests Successful! 🎉
📍 Build: cicd-workshop-build-123
🌐 Frontend: https://t6.cicdws.bibek-mishra.com.np
🔗 Backend: https://t6-api.cicdws.bibek-mishra.com.np/api
```

### Failure Message:
```
❌ E2E Tests Failed!
📍 Build: cicd-workshop-build-123
🔍 Check: https://console.aws.amazon.com/codesuite/codebuild/...
📸 Screenshots and videos available in artifacts
```
