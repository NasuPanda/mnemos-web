#!/bin/sh

# Function to handle shutdown signals
shutdown() {
    echo "Shutting down gracefully..."
    # Kill FastAPI process
    kill $FASTAPI_PID 2>/dev/null
    # Stop nginx
    nginx -s quit
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

# Start FastAPI backend in background using virtual environment
cd /app
/app/venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 &
FASTAPI_PID=$!

# Start nginx in foreground
nginx -g "daemon off;" &
NGINX_PID=$!

# Wait for any process to exit
wait $NGINX_PID $FASTAPI_PID