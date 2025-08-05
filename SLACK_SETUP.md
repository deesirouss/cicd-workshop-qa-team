# Slack GitHub Integration Setup

## Commands to run in your Slack channel:

### 1. Subscribe to your repository
```
/github subscribe lfyagya/cicd-workshop-qa-team workflows:{event:"pull_request","push" branch:"main","team6-yagya"}
```

### 2. Alternative command with more specific events
```
/github subscribe lfyagya/cicd-workshop-qa-team deployments reviews commits:all
```

### 3. Check current subscriptions
```
/github subscriptions
```

### 4. Unsubscribe if needed
```
/github unsubscribe lfyagya/cicd-workshop-qa-team
```

## Webhook URL Setup (Alternative Method)

If you prefer webhook notifications:

1. Go to Slack → Apps → Incoming Webhooks
2. Create a new webhook for your channel
3. Copy the webhook URL
4. Add it as `SLACK_WEBHOOK_URL` secret in GitHub

## Required GitHub Secrets

Add these secrets to your repository:

- `FRONTEND_URL`: Your CloudFront URL (e.g., https://d123456789.cloudfront.net)
- `BACKEND_API_URL`: Your backend API URL (e.g., https://api.yourteam.com)
- `SLACK_WEBHOOK_URL`: Your Slack webhook URL (optional)
- `REACT_APP_API_URL`: Same as BACKEND_API_URL for React build
