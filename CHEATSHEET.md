# Mnemos Web - Docker Cheat Sheet

## 1. Development with Docker

### Quick Start
```bash
# Start development environment
docker-compose up

# Start with build (after code changes)
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Access Points
- **Frontend**: http://localhost:3000 (React dev server)
- **Backend**: http://localhost:8000 (FastAPI)
- **API Docs**: http://localhost:8000/docs (Swagger UI)

### Common Development Tasks
```bash
# View logs
docker-compose logs
docker-compose logs frontend
docker-compose logs backend

# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec frontend sh

# Clean up everything
docker-compose down --volumes --rmi all
```

### Development Workflow
1. **Make code changes** (auto-reload enabled)
2. **View changes** at http://localhost:3000
3. **Test API** at http://localhost:8000/docs
4. **Check logs** if issues occur: `docker-compose logs`

### Troubleshooting Development
```bash
# If containers won't start
docker-compose down
docker-compose up --build

# If ports are busy
docker-compose down
# Wait 30 seconds
docker-compose up

# Check what's running
docker-compose ps
docker ps

# Remove all containers/images (nuclear option)
docker system prune -a
```

## 2. Deployment Testing

### Production Testing (Local)
```bash
# Test production setup locally
docker-compose -f docker-compose.prod.yml up --build

# Run in background
docker-compose -f docker-compose.prod.yml up -d

# Stop production test
docker-compose -f docker-compose.prod.yml down
```

### Google Cloud Run Testing
```bash
# Test Cloud Run configuration locally
docker build -t mnemos-web .
docker run -p 80:80 mnemos-web

# Test with Cloud Run environment variables
docker run -p 80:80 -e PORT=80 mnemos-web
```

### Production Access Points
- **App**: http://localhost (everything)
- **API**: http://localhost/api/* (proxied through nginx)

### Deployment Test Checklist
```bash
# 1. Build successfully
docker-compose -f docker-compose.prod.yml build

# 2. Start services
docker-compose -f docker-compose.prod.yml up -d

# 3. Check health
curl http://localhost/api/data
curl http://localhost

# 4. Check logs
docker-compose -f docker-compose.prod.yml logs

# 5. Test API endpoints
curl -X GET http://localhost/api/items
curl -X POST http://localhost/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","section":"Default","created_date":"2025-06-29T10:30:00Z","last_accessed":"2025-06-29T10:30:00Z"}'

# 6. Clean up
docker-compose -f docker-compose.prod.yml down
```

### Google Cloud Run Deployment Steps
1. **Test locally first**:
   ```bash
   docker build -t mnemos-web .
   docker run -p 80:80 mnemos-web
   ```

2. **Build and push to Google Container Registry**:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/mnemos-web
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy mnemos-web --image gcr.io/PROJECT_ID/mnemos-web --platform managed
   ```

### Debugging Production Issues
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# Check specific service logs
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs backend

# Test nginx config
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Check file permissions and volumes
docker-compose -f docker-compose.prod.yml exec backend ls -la /app/data

# Connect to container for debugging
docker-compose -f docker-compose.prod.yml exec backend bash
```

### Performance Testing
```bash
# Test concurrent requests
for i in {1..10}; do
  curl http://localhost/api/data &
done
wait

# Monitor resource usage
docker stats

# Check response times
time curl http://localhost/api/data
```

## Quick Commands Reference

| Task | Command |
|------|---------|
| Start dev | `docker-compose up` |
| Start prod test | `docker-compose -f docker-compose.prod.yml up` |
| Start Cloud Run test | `docker run -p 80:80 mnemos-web` |
| Rebuild | `docker-compose up --build` |
| Background | `docker-compose up -d` |
| Stop | `docker-compose down` |
| Logs | `docker-compose logs -f` |
| Clean up | `docker-compose down --volumes` |

## File Structure
```
mnemos-web/
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production testing  
├── .gcloudignore              # Google Cloud ignore file
├── Dockerfile                  # Railway single container
├── Dockerfile.backend          # Backend service
├── Dockerfile.frontend         # Frontend service
├── Dockerfile.nginx           # nginx service
└── data/                      # Persistent data volume
```