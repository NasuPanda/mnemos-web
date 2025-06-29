# Technical Architecture

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **JSON File Storage** - Single file-based data storage (no database required)
- **FastAPI StaticFiles** - Static image serving for uploaded content
- **Pydantic** - Data validation (built into FastAPI)
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Inline Styling** - Component-based React styling for maintainability

### Data Storage
- **JSON File** - Single file storage for all application data
- **Local Filesystem** - UUID-based image storage for uploaded content

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

## Image Storage Architecture

### Local File Storage
- **Upload Endpoint**: `/api/upload-image` accepts multipart form data
- **UUID Naming**: Secure unique filenames to prevent conflicts
- **Static Serving**: `/images/` route serves uploaded content
- **File Validation**: Type, size, and extension checking
- **Multiple Images**: Array support for multiple images per problem/answer

### Image Management
```python
# Upload process
1. Validate file (type, size, extension)
2. Generate UUID filename
3. Save to /app/data/images/
4. Return path: /images/{uuid}.{ext}
5. Store path in JSON data arrays
```

## Frontend Architecture

### Component Structure
- **React with TypeScript** for type safety
- **Inline Styling** for component encapsulation
- **Modal-based UI** for item creation/editing/review
- **State Management** via React hooks and local state

### Styling Approach
- **Inline React Styles** - All styling defined within components
- **Design System Colors** - Consistent navy-blue color palette
- **Responsive Design** - Flexible layouts that adapt to content
- **Component Encapsulation** - Styles co-located with components

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