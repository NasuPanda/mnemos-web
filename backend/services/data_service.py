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

            # Handle backward compatibility: migrate single images to arrays
            if "items" in data:
                for item in data["items"]:
                    # Migrate problem_image to problem_images
                    if "problem_image" in item and item["problem_image"] and "problem_images" not in item:
                        item["problem_images"] = [item["problem_image"]]
                    elif "problem_images" not in item:
                        item["problem_images"] = []

                    # Migrate answer_image to answer_images
                    if "answer_image" in item and item["answer_image"] and "answer_images" not in item:
                        item["answer_images"] = [item["answer_image"]]
                    elif "answer_images" not in item:
                        item["answer_images"] = []

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

    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

    with open(DATA_FILE, 'w') as f:
        json.dump(data.dict(), f, indent=2)
