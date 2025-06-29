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
- **Railway** - Cloud platform with free tier

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

### Railway (Chosen Platform)
- **Free Tier**: $5 monthly credit (sufficient for personal use)
- **Always On**: No sleep mode - instant response time
- **Simple Setup**: Connect GitHub repository for automatic deployment
- **Full Stack**: Supports both FastAPI backend and React frontend
- **HTTPS**: Free SSL certificates included

### Docker Benefits
- **Consistent Environment**: Same setup locally and in production
- **Multi-stage Builds**: Optimized container size (build React, serve with FastAPI)
- **Full Control**: Custom Python/Node versions and dependencies
- **Railway Compatible**: Automatic Docker detection and deployment

### Deployment Benefits
- **No Cold Starts**: Unlike other free tiers, Railway keeps apps responsive
- **Cost Effective**: Personal spaced repetition app typically uses $1-2/month
- **Container Registry**: Built-in Docker image storage
- **Git Integration**: Push to deploy workflow with Dockerfile

## Development Setup
- Zero infrastructure requirements
- Single JSON data file
- Local file storage for images
- Docker for consistent local/production environment
- Fast development cycle (~10 minute setup)
- One-click deployment to Railway via Docker