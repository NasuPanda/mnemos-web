# Mnemos Web

A spaced repetition learning app built with FastAPI + React.

## Quick Start

### Development
```bash
docker-compose up
```
- Frontend: http://localhost:3000 (React dev server with hot reload)
- Backend: http://localhost:8000 (FastAPI with auto-reload)

### Production (Local Testing)
```bash
docker-compose -f docker-compose.prod.yml up
```
- App: http://localhost (nginx serving React + API proxy)

### Google Cloud Run Deployment
```bash
# Build and deploy to Google Cloud Run
docker build -t mnemos-web .
# See CLOUD_RUN_DEPLOYMENT.md for full instructions

## Architecture

- **Development**: Separate containers for frontend/backend
- **Production**: nginx serves React static files + proxies API calls to FastAPI
- **Data**: JSON file storage with volume persistence

## Tech Stack

- Backend: FastAPI + Python
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Deployment: Docker + Google Cloud Run
- Data: JSON file storage