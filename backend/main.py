from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import IMAGES_DIR, ALLOWED_ORIGINS, API_TITLE, API_DESCRIPTION
from routes import items_router, settings_router, upload_router, data_router
from services.data_service import preload_data_from_storage
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=API_TITLE, description=API_DESCRIPTION)

@app.on_event("startup")
async def startup_event():
    """Load data from Cloud Storage on application startup"""
    logger.info("🚀 Starting Mnemos API - Loading data from storage...")
    try:
        await preload_data_from_storage()
        logger.info("✅ Data successfully loaded from storage during startup")
    except Exception as e:
        logger.error(f"❌ Failed to load data from storage during startup: {e}")
        logger.warning("⚠️  App will start with empty/default data")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)