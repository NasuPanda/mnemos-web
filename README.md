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

### Railway Deployment
```bash
docker-compose -f docker-compose.railway.yml up
```
- Single container optimized for Railway

## Architecture

- **Development**: Separate containers for frontend/backend
- **Production**: nginx serves React static files + proxies API calls to FastAPI
- **Data**: JSON file storage with volume persistence

## Tech Stack

- Backend: FastAPI + Python
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Deployment: Docker + Railway
- Data: JSON file storage