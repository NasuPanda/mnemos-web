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
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React dev
    "http://localhost:5173",  # Vite dev
    "*"  # Allow all (for development)
]

# API settings
API_TITLE = "Mnemos API"
API_DESCRIPTION = "Spaced repetition learning app"