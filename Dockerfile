# Production Dockerfile for Railway deployment
# Multi-stage build: React build + serve via nginx + FastAPI backend

# Stage 1: Build React frontend  
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm install @tailwindcss/postcss
RUN npm install

COPY frontend/ .
RUN npm run build

# Stage 2: Production with nginx + FastAPI
FROM nginx:alpine

# Install Python and pip (venv is built into Python 3.3+)
RUN apk add --no-cache python3 py3-pip

# Copy built React app to nginx
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.simple.conf /etc/nginx/nginx.conf

# Copy and setup FastAPI backend
WORKDIR /app
COPY backend/requirements.txt .

# Create virtual environment and install dependencies
RUN python3 -m venv /app/venv
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Create data directory
RUN mkdir -p /app/data

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]