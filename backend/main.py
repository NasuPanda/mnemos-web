from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
import uuid

app = FastAPI(title="Mnemos API", description="Spaced repetition learning app")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)