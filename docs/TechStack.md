# Technical Architecture

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - File-based database (no server setup required)
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation (built into FastAPI)
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling

### Data Storage
- **JSON File** - Single file storage for all application data
- **Local Filesystem** - Image storage for uploaded content

### Deployment
- **Docker** - Containerization for consistent builds and deployment
- **Google Cloud Run** - Serverless container platform with generous free tier

## Architecture Decision: JSON vs Database

**Chosen: Single JSON File**

### Rationale
- Personal use application with small dataset (~hundreds of items)
- Simplicity over scalability for this use case
- Easy backup and portability
- No database setup required
- Fast development iteration

### Data Structure
```json
{
  "items": [...],
  "categories": [...], 
  "settings": {...},
  "last_updated": "2025-06-29T10:30:00Z"
}
```

### File Organization
- One JSON file handles all data
- Cross-date queries and operations simplified
- Easy statistics calculation across all items
- Supports review scheduling and overdue item tracking

## Deployment

### Google Cloud Run (Chosen Platform)
- **Free Tier**: 2 million requests/month forever (no expiry)
- **Auto Scaling**: Scales to zero when not used, unlimited scale up
- **Docker Native**: Direct container deployment from Docker images
- **Global Edge**: Automatic global distribution and HTTPS
- **Pay-per-use**: Only charged for actual compute time (sub-second billing)

### Docker Benefits
- **Consistent Environment**: Same setup locally and in production
- **Multi-stage Builds**: Optimized container size (build React, serve with FastAPI)
- **Full Control**: Custom Python/Node versions and dependencies
- **Cloud Run Compatible**: Direct Docker image deployment

### Deployment Benefits
- **True Serverless**: Zero maintenance, automatic scaling
- **Cost Effective**: Personal apps typically stay within free tier
- **Container Registry**: Google Container Registry included
- **Git Integration**: Deploy from GitHub or local Docker builds

## Development Setup
- Zero infrastructure requirements
- Single JSON data file
- Local file storage for images
- Docker for consistent local/production environment
- Fast development cycle (~10 minute setup)
- One-command deployment to Google Cloud Run via Docker