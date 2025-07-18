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

# Fast item filtering cache
_cached_active_items: Optional[list] = None
_cached_archived_items: Optional[list] = None

# Service state tracking for non-blocking startup
_service_ready: bool = False
_data_loading: bool = False

def get_storage():
    """Get storage service instance (singleton pattern)"""
    global _storage_service
    if _storage_service is None:
        _storage_service = get_storage_service()
    return _storage_service

async def _load_from_storage() -> Optional[AppData]:
    """Load data from storage service"""
    storage = get_storage()
    storage_type = type(storage).__name__
    logger.info(f"🔧 Using storage service: {storage_type}")
    
    try:
        if storage.is_available():
            logger.info("✅ Storage service is available, downloading data...")
            data_dict = await storage.download_json("mnemos_data.json")
            if data_dict:
                logger.info(f"📥 Successfully downloaded data from storage ({len(str(data_dict))} chars)")
                processed_data = _process_data_dict(data_dict)
                logger.info(f"🔄 Processed data: {len(processed_data.items)} items, {len(processed_data.categories)} categories")
                return processed_data
            else:
                logger.warning("⚠️  Storage returned no data (empty/missing file)")
        else:
            logger.warning(f"❌ Storage service {storage_type} is not available")
    except Exception as e:
        logger.error(f"💥 Exception loading from storage: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")
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

def is_data_ready() -> bool:
    """Check if service is ready with data (either default or loaded from storage)"""
    return _service_ready

def initialize_default_data():
    """Initialize service with default data for quick startup"""
    global _cached_data, _service_ready
    logger.info("🏗️  Initializing service with default data for quick startup")
    _cached_data = _create_default_data()
    _rebuild_item_caches()
    _service_ready = True
    logger.info("✅ Service ready with default data")

async def background_data_loading():
    """Load real data from storage in background without blocking startup"""
    global _cached_data, _data_loading, _service_ready
    
    if _data_loading:
        logger.info("📋 Background data loading already in progress")
        return
    
    _data_loading = True
    logger.info("🔄 Starting background data loading from storage...")
    
    try:
        # Try to load from storage service
        loaded_data = await _load_from_storage()
        if loaded_data:
            logger.info(f"✅ Background loading successful: {len(loaded_data.items)} items, {len(loaded_data.categories)} categories")
            _cached_data = loaded_data
            _rebuild_item_caches()
        else:
            logger.info("⚠️  Background loading returned no data - keeping default data")
            
        # Try fallback to local file if storage failed
        if not loaded_data:
            logger.info("🔄 Trying local file fallback...")
            local_data = _load_from_local_file()
            if local_data:
                logger.info(f"✅ Local file fallback successful: {len(local_data.items)} items")
                _cached_data = local_data
                _rebuild_item_caches()
            else:
                logger.info("⚠️  Local file fallback also failed - keeping default data")
                
    except Exception as e:
        logger.error(f"💥 Background data loading failed: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")
    finally:
        _data_loading = False
        logger.info("🏁 Background data loading completed")

def _rebuild_item_caches():
    """Rebuild active/archived item caches - called when data changes"""
    global _cached_active_items, _cached_archived_items, _cached_data
    
    if _cached_data is None:
        _cached_active_items = []
        _cached_archived_items = []
        return
    
    # Split items into active and archived lists (O(n) operation)
    _cached_active_items = [item for item in _cached_data.items if not item.archived]
    _cached_archived_items = [item for item in _cached_data.items if item.archived]
    
    logger.debug(f"⚡ Cache rebuilt: {len(_cached_active_items)} active, {len(_cached_archived_items)} archived items")

def get_active_items() -> list:
    """Get active (non-archived) items - SUPER FAST O(1) operation"""
    global _cached_active_items
    
    if _cached_active_items is None:
        logger.debug("🔄 Building item cache for the first time")
        _rebuild_item_caches()
    
    return _cached_active_items

def get_archived_items() -> list:
    """Get archived items - SUPER FAST O(1) operation"""
    global _cached_archived_items
    
    if _cached_archived_items is None:
        logger.debug("🔄 Building item cache for the first time")
        _rebuild_item_caches()
    
    return _cached_archived_items

async def preload_data_from_storage():
    """Preload data from storage during FastAPI startup"""
    global _cached_data
    
    logger.info("🔍 Attempting to preload data from storage...")
    
    # Try to load from storage service first
    try:
        _cached_data = await _load_from_storage()
        if _cached_data:
            _rebuild_item_caches()  # Build fast cache
            logger.info(f"✅ Data preloaded from storage service - {len(_cached_data.items)} items, {len(_cached_data.categories)} categories")
            return
    except Exception as e:
        logger.warning(f"⚠️  Failed to load from storage service during preload: {e}")

    # Fallback to local file
    try:
        _cached_data = _load_from_local_file()
        if _cached_data:
            _rebuild_item_caches()  # Build fast cache
            logger.info(f"✅ Data preloaded from local file - {len(_cached_data.items)} items, {len(_cached_data.categories)} categories")
            return
    except Exception as e:
        logger.warning(f"⚠️  Failed to load from local file during preload: {e}")

    # Create default data if nothing else works
    logger.info("🏗️  Creating default data (no existing data found)")
    _cached_data = _create_default_data()
    _rebuild_item_caches()  # Build fast cache

def load_data() -> AppData:
    """Load data with memory cache - should be preloaded during startup"""
    global _cached_data
    
    if _cached_data is not None:
        logger.debug("📦 Serving data from memory cache")
        return _cached_data

    # This should not happen if preload worked correctly
    logger.warning("⚠️  Memory cache is empty! This suggests startup preload failed.")
    logger.info("🔄 Attempting fallback synchronous load...")
    
    # Emergency fallback - try local file only (sync)
    _cached_data = _load_from_local_file()
    if _cached_data:
        logger.info("✅ Emergency fallback: loaded from local file")
        return _cached_data

    # Last resort - create default data
    logger.warning("🚨 Last resort: creating default empty data")
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
    
    # 2. Rebuild fast item caches (O(n) but only on data changes)
    _rebuild_item_caches()
    
    # 3. Background save to storage (fire-and-forget)
    storage = get_storage()
    if storage.is_available():
        asyncio.create_task(_async_save_to_storage(data))
    
    # 4. Also save to local file as backup
    _save_to_local_file(data)

async def _async_save_to_storage(data: AppData):
    """Background task to save data to storage"""
    storage = get_storage()
    storage_type = type(storage).__name__
    try:
        logger.info(f"💾 Saving data to {storage_type}...")
        success = await storage.upload_json("mnemos_data.json", data.dict())
        if success:
            logger.info(f"✅ Data successfully saved to {storage_type}")
        else:
            logger.warning(f"❌ Failed to save data to {storage_type}")
    except Exception as e:
        logger.error(f"💥 Error saving to {storage_type}: {e}")
        import traceback
        logger.error(f"📋 Full traceback: {traceback.format_exc()}")

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
