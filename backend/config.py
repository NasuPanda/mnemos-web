import os
from pathlib import Path

# File paths
DATA_FILE = os.getenv("DATA_FILE", "../data/mnemos_data.json")
IMAGES_DIR = Path("/app/data/images")

# File upload settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'}
DEFAULT_IMAGE_EXTENSION = "jpg"

# CORS settings
def get_allowed_origins():
    """Get allowed origins based on environment"""
    # Development origins
    dev_origins = [
        "http://localhost:3000",  # React dev
        "http://localhost:5173",  # Vite dev
    ]
    
    # Check if we're in production (Cloud Storage enabled)
    use_cloud_storage = os.getenv("USE_CLOUD_STORAGE", "false").lower() == "true"
    
    if use_cloud_storage:
        # Production: allow same-origin requests and development origins
        # In Cloud Run, requests come through nginx proxy from same domain
        return dev_origins + ["*"]
    else:
        # Development: allow all for convenience
        return dev_origins + ["*"]

ALLOWED_ORIGINS = get_allowed_origins()

# API settings
API_TITLE = "Mnemos API"
API_DESCRIPTION = "Spaced repetition learning app"