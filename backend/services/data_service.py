import json
import os
from datetime import datetime
from models import AppData, Settings
from config import DATA_FILE


def load_data() -> AppData:
    """Load data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            
            # Handle backward compatibility: convert dict settings to Settings model
            if isinstance(data.get("settings"), dict):
                settings_dict = data["settings"]
                data["settings"] = Settings(**settings_dict)
            
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