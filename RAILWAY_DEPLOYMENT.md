# Railway Deployment Guide

## Prerequisites

1. **GitHub Account** (to host your code)
2. **Railway Account** (sign up at https://railway.app)
3. **Git installed** on your machine

## Step 1: Prepare Your Code

### 1.1 Test Deployment Locally First
```bash
# Test the Railway configuration locally
docker-compose -f docker-compose.railway.yml up --build

# Verify everything works at http://localhost
# Frontend should load and API should work at http://localhost/api/data
```

### 1.2 Initialize Git Repository (if not done)
```bash
# In your project root (/Users/ns/projects/2025/mnemos-web)
git init
git add .
git commit -m "Initial commit: Mnemos web app"
```

### 1.3 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `mnemos-web` (or your preferred name)
3. Set to **Public** or **Private** (your choice)
4. **DO NOT** initialize with README (you already have files)
5. Click "Create repository"

### 1.4 Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/mnemos-web.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Railway

### 2.1 Sign Up/Login to Railway
1. Go to https://railway.app
2. Click "Login" or "Start a New Project"
3. Sign in with GitHub (recommended)

### 2.2 Create New Project
1. Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. Choose your `mnemos-web` repository
4. Click "**Deploy**"

### 2.3 Configure Railway Settings

#### Set Root Directory (Important!)
1. In your Railway project dashboard
2. Go to "**Settings**" tab
3. Under "**Deploy**" section:
   - **Root Directory**: Leave empty (uses project root)
   - **Build Command**: (leave empty - Docker handles this)
   - **Start Command**: (leave empty - Docker handles this)

#### Environment Variables
1. Go to "**Variables**" tab
2. Add these variables:
   - `PORT`: `80` (Railway will map this)
   - `DATA_FILE`: `/app/data/mnemos_data.json`

### 2.4 Railway Will Auto-Deploy
- Railway detects your `docker-compose.railway.yml`
- Build process starts automatically
- You'll see build logs in real-time
- Wait for "**Deployed**" status (usually 3-5 minutes)

## Step 3: Access Your App

### 3.1 Get Your App URL
1. In Railway dashboard, you'll see your app URL
2. Format: `https://mnemos-web-production-XXXX.up.railway.app`
3. Click the URL to open your deployed app

### 3.2 Test Your Deployment
1. **Frontend**: Visit your Railway URL
   - Should show Mnemos interface with "Hello! Memory & Knowledge Organization"
2. **API**: Test API endpoints
   - `https://your-app.up.railway.app/api/data`
   - Should return JSON with empty items array

## Step 4: Verify Everything Works

### 4.1 Test Frontend
```bash
# Your app should load at the Railway URL
# Check browser console for any errors
```

### 4.2 Test API Endpoints
```bash
# Replace YOUR_APP_URL with your actual Railway URL
curl https://YOUR_APP_URL.up.railway.app/api/data

# Should return:
# {"items":[],"categories":["Default"],"settings":{"confident_days":7,"medium_days":3,"wtf_days":1},"last_updated":"2025-06-29T..."}
```

## Step 5: Future Deployments

### 5.1 Make Changes
```bash
# Edit your code locally
# Test with: docker-compose up

# When ready to deploy:
git add .
git commit -m "Your change description"
git push origin main
```

### 5.2 Auto-Deploy
- Railway automatically deploys when you push to GitHub
- No manual steps needed
- Check Railway dashboard for deployment status

## Troubleshooting

### If Build Fails

#### Check Build Logs
1. Go to Railway dashboard
2. Click on your service
3. Check "**Deployments**" tab for error logs

#### Common Issues & Fixes

**Docker Build Fails:**
```bash
# Test locally first:
docker-compose -f docker-compose.railway.yml up --build

# If it works locally but fails on Railway, check:
# 1. All files are committed to Git
# 2. .dockerignore doesn't exclude required files
```

**Port Issues:**
- Railway automatically assigns PORT
- Our config uses port 80 internally, Railway maps it externally

**File Permissions:**
```bash
# Ensure start.sh is executable
chmod +x start.sh
git add start.sh
git commit -m "Fix start.sh permissions"
git push origin main
```

### If App Loads But API Doesn't Work

**Check nginx Configuration:**
- API calls to `/api/*` should proxy to FastAPI
- Frontend routes should serve React app

**Check Data Persistence:**
- Railway provides ephemeral storage by default
- Data will reset on each deployment
- For production, consider Railway's persistent volumes

### Environment-Specific Issues

**CORS Errors:**
- Our FastAPI allows all origins (`"*"`)
- Should work on any Railway domain

**Static Files Not Loading:**
- nginx serves React build from `/usr/share/nginx/html`
- Check if build completed successfully in logs

## Production Tips

### Data Persistence
```bash
# Current setup: Data resets on each deploy
# For persistent data, consider:
# 1. Railway Postgres database
# 2. Railway volumes (when available)
# 3. External database service
```

### Monitoring
1. **Railway Dashboard**: Monitor CPU, memory, deployments
2. **Logs**: Check application logs for errors
3. **Uptime**: Railway provides uptime monitoring

### Custom Domain (Optional)
1. Go to Railway project "**Settings**"
2. Under "**Domains**" section
3. Add your custom domain
4. Follow DNS configuration instructions

## Summary

Your Mnemos app is now deployed! 🚀

- **URL**: Check Railway dashboard for your unique URL
- **Auto-Deploy**: Pushes to GitHub automatically deploy
- **Monitoring**: Use Railway dashboard to monitor performance
- **Scaling**: Railway auto-scales based on usage

**Next Steps:**
1. Start using your deployed app
2. Monitor for any issues in Railway dashboard
3. Add more features and push updates to GitHub