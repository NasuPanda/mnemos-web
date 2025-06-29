#!/bin/sh

# Start FastAPI backend in background using virtual environment
cd /app
/app/venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 &

# Start nginx in foreground
nginx -g "daemon off;"