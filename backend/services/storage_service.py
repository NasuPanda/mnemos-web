import asyncio
import json
import os
import logging
from typing import Optional, Dict, Any
from pathlib import Path

logger = logging.getLogger(__name__)

class FileStorageService:
    """File-based storage service for testing async patterns locally"""
    
    def __init__(self, storage_dir: str = "test_storage"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        logger.info(f"FileStorageService initialized with directory: {self.storage_dir}")
    
    async def download_json(self, filename: str) -> Optional[Dict[Any, Any]]:
        """Download JSON data from file storage (simulates Cloud Storage download)"""
        # Simulate network delay
        await asyncio.sleep(0.05)
        
        file_path = self.storage_dir / filename
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                logger.info(f"Successfully downloaded {filename} from file storage")
                return data
        except FileNotFoundError:
            logger.warning(f"File {filename} not found in storage")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from {filename}: {e}")
            return None
    
    async def upload_json(self, filename: str, data: Dict[Any, Any]) -> bool:
        """Upload JSON data to file storage (simulates Cloud Storage upload)"""
        # Simulate network delay
        await asyncio.sleep(0.1)
        
        file_path = self.storage_dir / filename
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Successfully uploaded {filename} to file storage")
            return True
        except Exception as e:
            logger.error(f"Failed to upload {filename}: {e}")
            return False
    
    def is_available(self) -> bool:
        """Check if storage is available"""
        try:
            # Test write access
            test_file = self.storage_dir / ".health_check"
            test_file.write_text("test")
            test_file.unlink()
            return True
        except Exception as e:
            logger.error(f"Storage health check failed: {e}")
            return False

class CloudStorageService:
    """Google Cloud Storage service (to be implemented later)"""
    
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        logger.info(f"CloudStorageService initialized with bucket: {bucket_name}")
    
    async def download_json(self, filename: str) -> Optional[Dict[Any, Any]]:
        """Download JSON data from Cloud Storage"""
        # TODO: Implement with google-cloud-storage
        raise NotImplementedError("Cloud Storage not yet implemented")
    
    async def upload_json(self, filename: str, data: Dict[Any, Any]) -> bool:
        """Upload JSON data to Cloud Storage"""
        # TODO: Implement with google-cloud-storage
        raise NotImplementedError("Cloud Storage not yet implemented")
    
    def is_available(self) -> bool:
        """Check if Cloud Storage is available"""
        # TODO: Implement with google-cloud-storage
        return False

def get_storage_service():
    """Factory function to get appropriate storage service based on environment"""
    use_cloud_storage = os.getenv("USE_CLOUD_STORAGE", "false").lower() == "true"
    
    if use_cloud_storage:
        bucket_name = os.getenv("STORAGE_BUCKET_NAME", "mnemos-data-bucket")
        return CloudStorageService(bucket_name)
    else:
        # Use file-based storage for local testing
        return FileStorageService()