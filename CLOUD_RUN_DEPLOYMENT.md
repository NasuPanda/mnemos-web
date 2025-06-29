# Google Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud Account** (free tier available)
2. **Google Cloud CLI** installed on your machine
3. **Docker** installed locally
4. **Git repository** with your code

## Step 1: Setup Google Cloud

### 1.1 Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Click "**New Project**"
3. Project name: `mnemos-web` (or your preference)
4. Note your **Project ID**: `mnemos-web`

### 1.2 Install and Configure Google Cloud CLI

**Install gcloud CLI:**
- **macOS**: `brew install google-cloud-sdk`
- **Windows**: Download from https://cloud.google.com/sdk/docs/install
- **Linux**: `curl https://sdk.cloud.google.com | bash`

**Configure authentication:**
```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Configure Docker to use gcloud
gcloud auth configure-docker
```

### 1.3 Enable Required APIs
```bash
# Enable Cloud Run API (free tier: 2M requests/month)
gcloud services enable run.googleapis.com

# Enable Container Registry API (free tier: 500MB storage)
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build API (free tier: 120 build-minutes/day)
# NOTE: For personal use, building locally is more economical
gcloud services enable cloudbuild.googleapis.com
```

### 1.4 Set IAM Permissions (For Free Tier Usage)

**Option 1: Minimal Permissions (Recommended for Free Tier)**
```bash
# Add only the essential roles
gcloud projects add-iam-policy-binding mnemos-web \
    --member="user:xiyuanjunzhi@gmail.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding mnemos-web \
    --member="user:xiyuanjunzhi@gmail.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding mnemos-web \
    --member="user:xiyuanjunzhi@gmail.com" \
    --role="roles/iam.serviceAccountUser"
```

**Option 2: Owner Role (Simpler, but broader permissions)**
```bash
# For personal projects only
gcloud projects add-iam-policy-binding mnemos-web \
    --member="user:xiyuanjunzhi@gmail.com" \
    --role="roles/owner"
```

## Step 2: Prepare Your Application

### 2.1 Test Locally First
```bash
# Test your Docker build
docker build -t mnemos-web .

# Test the container
docker run -p 80:80 mnemos-web

# Verify at http://localhost
# Frontend should load, API should work at http://localhost/api/data
```

### 2.2 Create .gcloudignore File
```bash
# This file tells Cloud Build what to ignore
cat > .gcloudignore << EOF
node_modules/
.git/
.gitignore
*.md
docs/
design/
data/
.env*
.DS_Store
frontend/node_modules/
frontend/dist/
__pycache__/
*.pyc
.pytest_cache/
EOF
```

### 2.3 Update Dockerfile for Cloud Run (Optional)
Cloud Run provides a `PORT` environment variable. Update your nginx config if needed:

```bash
# Add this to nginx.simple.conf if you want dynamic port support
# (Current setup with port 80 works fine for Cloud Run)
```

## Step 3: Deploy to Google Cloud Run

### Method 1: Using Cloud Build (Recommended)

```bash
# Build and push image to Google Container Registry
gcloud builds submit --tag gcr.io/mnemos-web/mnemos-web

# Deploy to Cloud Run
gcloud run deploy mnemos-web \
  --image gcr.io/mnemos-web/mnemos-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --max-instances 10
```

### Method 2: Build Locally and Push

```bash
# Build image with Google Container Registry tag
docker build -t gcr.io/YOUR_PROJECT_ID/mnemos-web .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/mnemos-web

# Deploy to Cloud Run
gcloud run deploy mnemos-web \
  --image gcr.io/YOUR_PROJECT_ID/mnemos-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --max-instances 10
```

## Step 4: Access Your Application

### 4.1 Get Service URL
After deployment, Cloud Run provides a URL:
```bash
# Get the service URL
gcloud run services describe mnemos-web --region us-central1 --format 'value(status.url)'

# Example output: https://mnemos-web-abcdefg-uc.a.run.app
```

### 4.2 Test Your Deployment
1. **Frontend**: Visit your Cloud Run URL
   - Should show Mnemos interface
2. **API**: Test API endpoints
   - `https://your-service-url.a.run.app/api/data`
   - Should return JSON with application data

## Step 5: Configure Custom Domain (Optional - FREE ✅)

**Cost**: FREE - Only pay for domain registration (to your domain registrar, not Google)

### 5.1 Add Custom Domain
```bash
# Map your domain to the service (FREE)
gcloud run domain-mappings create \
  --service mnemos-web \
  --domain your-domain.com \
  --region us-central1
```

### 5.2 Update DNS
- Follow the instructions provided by Cloud Run to update your domain's DNS records
- **SSL Certificate**: Automatically provided for FREE
- **HTTPS**: Enabled automatically at no cost

## Step 6: Set Up Continuous Deployment (Optional - USES FREE TIER ⚠️)

**Cost Analysis**:
- **GitHub Connection**: FREE ✅
- **Auto-Deploy**: Uses Cloud Build free tier (120 minutes/day)
- **For Personal Use**: Well within limits (~2-5 minutes per build)

### 6.1 Connect to GitHub (FREE ✅)
1. Go to https://console.cloud.google.com/cloud-build/triggers
2. Click "**Create Trigger**"
3. Connect your GitHub repository
4. Configure trigger:
   - **Event**: Push to branch
   - **Branch**: `main`
   - **Configuration**: Dockerfile
   - **Image**: `gcr.io/YOUR_PROJECT_ID/mnemos-web`

### 6.2 Auto-Deploy Configuration (Uses Build Minutes ⚠️)

**Free Tier Impact**: Each auto-deploy uses ~3 minutes of your 120 free minutes/day

```yaml
# cloudbuild.yaml (uses ~3 minutes per deployment)
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mnemos-web', '.']

  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mnemos-web']

  # Deploy container image to Cloud Run (free tier optimized)
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'mnemos-web'
      - '--image'
      - 'gcr.io/$PROJECT_ID/mnemos-web'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '256Mi'
      - '--max-instances'
      - '3'

images:
  - 'gcr.io/$PROJECT_ID/mnemos-web'
```

### 6.3 Alternative: Manual Deployment (COMPLETELY FREE ✅)

**Recommended for Personal Use**: Save build minutes by deploying manually

```bash
# Manual deployment when you want to update (FREE)
docker build -t gcr.io/mnemos-web/mnemos-web .
docker push gcr.io/mnemos-web/mnemos-web
gcloud run deploy mnemos-web --image gcr.io/mnemos-web/mnemos-web --region us-central1
```

**Free Tier Budget**:
- **120 minutes/day** = ~40 auto-deployments per day
- **Personal use**: Maybe 1-2 deployments per week
- **Verdict**: Auto-deploy is fine for personal projects ✅

## Monitoring and Management

### View Logs
```bash
# View service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=mnemos-web" --limit 50 --format json

# Stream logs in real-time
gcloud run services logs tail mnemos-web --region us-central1
```

### Monitor Performance
1. Go to https://console.cloud.google.com/run
2. Click on your `mnemos-web` service
3. View metrics: requests, latency, errors, container utilization

### Update Deployment
```bash
# To update your app, just rebuild and redeploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mnemos-web
gcloud run deploy mnemos-web --image gcr.io/YOUR_PROJECT_ID/mnemos-web --region us-central1
```

## Free Tier Optimization

### Free Tier Limits (Always Free)
- **Cloud Run**: 2 million requests/month + 360,000 GB-seconds compute time
- **Container Registry**: 500MB storage (enough for ~10 image versions)
- **Cloud Build**: 120 build-minutes/day (use local builds to save this)
- **Network Egress**: 1GB/month (plenty for personal use)

### Recommended Settings for Free Tier
```bash
# Optimize for free tier usage
gcloud run services update mnemos-web \
  --memory 256Mi \
  --cpu 1000m \
  --max-instances 3 \
  --concurrency 100 \
  --min-instances 0 \
  --region us-central1

# Monitor your usage
gcloud logging read "resource.type=cloud_run_revision" --limit 10 --format json
```

### Free Tier Calculator for Personal Use
- **256Mi memory + 1 CPU**: ~1,400 requests stay within free tier
- **Your usage estimate**: ~50 requests/day = well within limits
- **Storage**: Single app image ~50MB = 10x smaller than 500MB limit

### Cost Monitoring (Stay Free)
```bash
# Check current usage (should be $0 for personal use)
gcloud billing accounts list
gcloud billing budgets list --billing-account YOUR_BILLING_ACCOUNT_ID

# Set up billing alerts at $1 (optional safety net)
# This ensures you'll know if you somehow exceed free tier
```

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format 'value(id)')

# Test locally first
docker build -t mnemos-web .
docker run -p 80:80 mnemos-web
```

**Service Won't Start:**
```bash
# Check service logs
gcloud run services logs tail mnemos-web --region us-central1

# Common issues:
# 1. Port not exposed correctly (should be 80)
# 2. Container not listening on 0.0.0.0
# 3. Health check failing
```

**API Not Working:**
```bash
# Check nginx configuration
# Ensure /api/* routes proxy to localhost:8000
# Verify FastAPI is running on 127.0.0.1:8000
```

**Cold Start Issues:**
```bash
# Set minimum instances to reduce cold starts
gcloud run services update mnemos-web \
  --min-instances 1 \
  --region us-central1

# Note: This may incur costs outside free tier
```

## Security Best Practices

### Limit Access (Optional)
```bash
# Remove public access and require authentication
gcloud run services remove-iam-policy-binding mnemos-web \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region us-central1

# Add specific users
gcloud run services add-iam-policy-binding mnemos-web \
  --member="user:your-email@gmail.com" \
  --role="roles/run.invoker" \
  --region us-central1
```

### Environment Variables
```bash
# Set environment variables securely
gcloud run services update mnemos-web \
  --set-env-vars="DATA_FILE=/app/data/mnemos_data.json" \
  --region us-central1
```

## Summary

Your Mnemos app is now deployed on Google Cloud Run! 🚀

- **URL**: Get from `gcloud run services describe mnemos-web`
- **Auto-scaling**: Scales to zero when not used
- **Free tier**: 2M requests/month free forever
- **Global**: Automatically distributed worldwide
- **HTTPS**: SSL certificate included

**Next Steps:**
1. Test your deployed application thoroughly
2. Set up monitoring and alerts
3. Consider adding a custom domain
4. Monitor usage to stay within free tier limits

**For updates:**
Just push to your Git repository (if auto-deploy is configured) or run the deploy commands again.
