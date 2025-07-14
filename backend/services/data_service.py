import json
import os
import asyncio
import logging
from datetime import datetime
from typing import Optional
from models import AppData, Settings
from config import DATA_FILE
from .storage_service import get_storage_service

logger = logging.getLogger(__name__)

# Global memory cache
_cached_data: Optional[AppData] = None
_storage_service = None

def get_storage():
    """Get storage service instance (singleton pattern)"""
    global _storage_service
    if _storage_service is None:
        _storage_service = get_storage_service()
    return _storage_service

async def _load_from_storage() -> Optional[AppData]:
    """Load data from storage service"""
    storage = get_storage()
    try:
        if storage.is_available():
            data_dict = await storage.download_json("mnemos_data.json")
            if data_dict:
                return _process_data_dict(data_dict)
    except Exception as e:
        logger.warning(f"Failed to load from storage: {e}")
    return None

def _load_from_local_file() -> Optional[AppData]:
    """Load data from local file as fallback"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                data_dict = json.load(f)
                return _process_data_dict(data_dict)
        except Exception as e:
            logger.warning(f"Failed to load from local file: {e}")
    return None

def _process_data_dict(data_dict: dict) -> AppData:
    """Process raw data dictionary into AppData model"""
    # Handle backward compatibility: convert dict settings to Settings model
    if isinstance(data_dict.get("settings"), dict):
        settings_dict = data_dict["settings"]
        data_dict["settings"] = Settings(**settings_dict)

    # Handle backward compatibility: migrate single images to arrays
    if "items" in data_dict:
        for item in data_dict["items"]:
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

    return AppData(**data_dict)

def _create_default_data() -> AppData:
    """Create default data when no data source is available"""
    return AppData(
        items=[],
        categories=["Default"],
        last_updated=datetime.now().isoformat()
    )

def load_data() -> AppData:
    """Load data with memory cache - try storage first, fallback to local file"""
    global _cached_data
    
    if _cached_data is not None:
        logger.debug("Serving data from memory cache")
        return _cached_data

    logger.info("Loading data for the first time")
    
    # Try to load from storage service first
    try:
        # Try to get existing event loop, or create new one if none exists
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # Event loop is running, skip async storage for initial load
                logger.info("Event loop running, skipping storage service for initial load")
            else:
                _cached_data = loop.run_until_complete(_load_from_storage())
                if _cached_data:
                    logger.info("Data loaded from storage service")
                    return _cached_data
        except RuntimeError:
            # No event loop exists, create new one
            _cached_data = asyncio.run(_load_from_storage())
            if _cached_data:
                logger.info("Data loaded from storage service")
                return _cached_data
    except Exception as e:
        logger.warning(f"Failed to load from storage service: {e}")

    # Fallback to local file
    _cached_data = _load_from_local_file()
    if _cached_data:
        logger.info("Data loaded from local file")
        return _cached_data

    # Create default data if nothing else works
    logger.info("Creating default data")
    _cached_data = _create_default_data()
    return _cached_data

async def save_data(data: AppData):
    """Save data with async storage backup"""
    global _cached_data
    
    # Update timestamp
    data.last_updated = datetime.now().isoformat()
    
    # 1. Update memory cache immediately (fast response)
    _cached_data = data
    logger.debug("Data updated in memory cache")
    
    # 2. Background save to storage (fire-and-forget)
    storage = get_storage()
    if storage.is_available():
        asyncio.create_task(_async_save_to_storage(data))
    
    # 3. Also save to local file as backup
    _save_to_local_file(data)

async def _async_save_to_storage(data: AppData):
    """Background task to save data to storage"""
    storage = get_storage()
    try:
        success = await storage.upload_json("mnemos_data.json", data.dict())
        if success:
            logger.info("Data successfully saved to storage")
        else:
            logger.warning("Failed to save data to storage")
    except Exception as e:
        logger.error(f"Error saving to storage: {e}")

def _save_to_local_file(data: AppData):
    """Save data to local file as backup"""
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data.dict(), f, indent=2)
        logger.debug("Data saved to local file")
    except Exception as e:
        logger.warning(f"Failed to save to local file: {e}")

# Synchronous wrapper for compatibility with existing code
def save_data_sync(data: AppData):
    """Synchronous wrapper for save_data - converts to async call"""
    try:
        loop = asyncio.get_event_loop()
        loop.run_until_complete(save_data(data))
    except RuntimeError:
        # No event loop running, create a new one
        asyncio.run(save_data(data))
