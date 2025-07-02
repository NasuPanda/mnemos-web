from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os
import shutil
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import uuid
from pathlib import Path

app = FastAPI(title="Mnemos API", description="Spaced repetition learning app")

# Ensure images directory exists
IMAGES_DIR = Path("/app/data/images")
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Serve static images
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],  # React dev + production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Item(BaseModel):
    id: Optional[str] = None
    name: str
    section: str
    side_note: str = ""
    
    problem_text: Optional[str] = None
    problem_url: Optional[str] = None
    problem_image: Optional[str] = None
    
    answer_text: Optional[str] = None
    answer_url: Optional[str] = None
    answer_image: Optional[str] = None
    
    reviewed: bool = False
    next_review_date: Optional[str] = None
    review_dates: List[str] = []
    
    created_date: str
    last_accessed: str
    archived: bool = False

class AppData(BaseModel):
    items: List[Item] = []
    categories: List[str] = []
    settings: dict = {
        "confident_days": 7,
        "medium_days": 3,
        "wtf_days": 1
    }
    last_updated: str

# Data file path
DATA_FILE = "mnemos_data.json"

def load_data() -> AppData:
    """Load data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            return AppData(**data)
    else:
        # Create initial data
        return AppData(
            items=[],
            categories=["Default"],
            last_updated=datetime.now().isoformat()
        )

def save_data(data: AppData):
    """Save data to JSON file"""
    data.last_updated = datetime.now().isoformat()
    with open(DATA_FILE, 'w') as f:
        json.dump(data.dict(), f, indent=2)

@app.get("/")
async def root():
    return {"message": "Mnemos API is running"}

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return its path"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size (max 10MB)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 10MB")
    
    # Generate unique filename
    file_extension = "jpg"  # Default extension
    if file.filename and "." in file.filename:
        file_extension = file.filename.split('.')[-1].lower()
    
    # Validate file extension
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'}
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"File extension must be one of: {', '.join(allowed_extensions)}")
    
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = IMAGES_DIR / unique_filename
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return path relative to server root
        return {"image_path": f"/images/{unique_filename}"}
    
    except Exception as e:
        # Clean up file if it was partially created
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

@app.get("/api/data")
async def get_data():
    """Get all application data"""
    return load_data()

@app.post("/api/items")
async def create_item(item: Item):
    """Create a new item"""
    data = load_data()
    
    # Generate ID and timestamps
    item.id = str(uuid.uuid4())
    item.created_date = datetime.now().isoformat()
    item.last_accessed = datetime.now().isoformat()
    
    data.items.append(item)
    
    # Add category if new
    if item.section and item.section not in data.categories:
        data.categories.append(item.section)
    
    save_data(data)
    return item

@app.get("/api/items")
async def get_items():
    """Get all items"""
    data = load_data()
    return data.items

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: str):
    """Delete an existing item"""
    data = load_data()
    
    # Find and remove item by ID
    original_count = len(data.items)
    data.items = [item for item in data.items if item.id != item_id]
    
    # Check if item was found and removed
    if len(data.items) == original_count:
        raise HTTPException(status_code=404, detail="Item not found")
    
    save_data(data)
    return {"message": "Item deleted successfully", "id": item_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)