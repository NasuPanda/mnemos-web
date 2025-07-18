from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from config import IMAGES_DIR, ALLOWED_ORIGINS, API_TITLE, API_DESCRIPTION
from routes import items_router, settings_router, upload_router, data_router
from services.data_service import preload_data_from_storage, is_data_ready, initialize_default_data, background_data_loading
import logging
import traceback
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=API_TITLE, description=API_DESCRIPTION)

# Global Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to catch any unhandled exceptions
    and prevent the service from crashing.
    """
    # Log the full error details for debugging
    error_msg = f"Unhandled exception in {request.method} {request.url}"
    logger.error(f"{error_msg}: {exc}", exc_info=True)
    
    # Return user-friendly error response
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong. Please try again later.",
            "path": str(request.url.path)
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Handle HTTP exceptions with proper logging and user-friendly messages.
    """
    logger.warning(f"HTTP {exc.status_code} in {request.method} {request.url}: {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "message": exc.detail,
            "path": str(request.url.path)
        }
    )

# Error Boundary Middleware
@app.middleware("http")
async def error_boundary_middleware(request: Request, call_next):
    """
    Middleware-level error boundary to catch errors during request processing.
    """
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        # Log the error with request context
        logger.error(
            f"Request failed: {request.method} {request.url} - {exc}",
            exc_info=True,
            extra={
                "method": request.method,
                "url": str(request.url),
                "client": request.client.host if request.client else "unknown"
            }
        )
        
        # Return graceful error response
        return JSONResponse(
            status_code=500,
            content={
                "error": "Request processing failed",
                "message": "Unable to process your request. Please try again.",
                "path": str(request.url.path)
            }
        )

@app.on_event("startup")
async def startup_event():
    """Start service quickly with background data loading"""
    logger.info("🚀 Starting Mnemos API - Quick start with background loading...")
    
    # Initialize service immediately with default data
    initialize_default_data()
    
    # Start background data loading (non-blocking)
    asyncio.create_task(background_data_loading())
    
    logger.info("✅ Service started quickly - data loading in background")

# Ensure images directory exists
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Serve static images
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(items_router)
app.include_router(settings_router)
app.include_router(upload_router)
app.include_router(data_router)

@app.get("/")
async def root():
    return {"message": "Mnemos API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring service status"""
    return {
        "status": "healthy" if is_data_ready() else "loading",
        "data_ready": is_data_ready(),
        "message": "Service is ready" if is_data_ready() else "Loading data in background"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)