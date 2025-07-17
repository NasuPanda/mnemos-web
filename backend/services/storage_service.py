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
    """Google Cloud Storage service"""
    
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self._client = None
        self._bucket = None
        logger.info(f"CloudStorageService initialized with bucket: {bucket_name}")
    
    def _get_client(self):
        """Get Google Cloud Storage client (lazy initialization)"""
        if self._client is None:
            try:
                from google.cloud import storage
                # Try to get project from environment, fallback to default
                project = os.getenv("GOOGLE_CLOUD_PROJECT", "mnemos-web")
                client = storage.Client(project=project)
                bucket = client.bucket(self.bucket_name)
                # Only set instance variables if both succeed
                self._client = client
                self._bucket = bucket
                logger.info(f"Google Cloud Storage client initialized for project: {project}")
            except Exception as e:
                logger.error(f"Failed to initialize Cloud Storage client: {e}")
                # Return None instead of raising to prevent service crash
                return None, None
        return self._client, self._bucket
    
    async def download_json(self, filename: str) -> Optional[Dict[Any, Any]]:
        """Download JSON data from Cloud Storage"""
        try:
            client, bucket = self._get_client()
            if client is None or bucket is None:
                logger.warning(f"Cannot download {filename}: Cloud Storage client not available")
                return None
            
            blob = bucket.blob(filename)
            
            # Check if blob exists
            if not blob.exists():
                logger.warning(f"File {filename} not found in Cloud Storage bucket {self.bucket_name}")
                return None
            
            # Download and parse JSON
            json_data = blob.download_as_text()
            data = json.loads(json_data)
            logger.info(f"Successfully downloaded {filename} from Cloud Storage")
            return data
            
        except Exception as e:
            logger.error(f"Failed to download {filename} from Cloud Storage: {e}")
            return None
    
    async def upload_json(self, filename: str, data: Dict[Any, Any]) -> bool:
        """Upload JSON data to Cloud Storage"""
        try:
            client, bucket = self._get_client()
            if client is None or bucket is None:
                logger.warning(f"Cannot upload {filename}: Cloud Storage client not available")
                return False
            
            blob = bucket.blob(filename)
            
            # Convert data to JSON string
            json_data = json.dumps(data, indent=2)
            
            # Upload to Cloud Storage
            blob.upload_from_string(json_data, content_type='application/json')
            logger.info(f"Successfully uploaded {filename} to Cloud Storage")
            return True
            
        except Exception as e:
            logger.error(f"Failed to upload {filename} to Cloud Storage: {e}")
            return False
    
    def is_available(self) -> bool:
        """Check if Cloud Storage is available"""
        try:
            logger.info("🔍 Checking Cloud Storage availability...")
            client, bucket = self._get_client()
            if client is None or bucket is None:
                logger.warning("❌ Cloud Storage client initialization failed")
                return False
            # Test access by checking if bucket exists
            bucket.reload()
            logger.info(f"✅ Cloud Storage is available: bucket '{self.bucket_name}' accessible")
            return True
        except Exception as e:
            logger.warning(f"❌ Cloud Storage health check failed: {e}")
            return False

def get_storage_service():
    """Factory function to get appropriate storage service based on environment"""
    use_cloud_storage = os.getenv("USE_CLOUD_STORAGE", "false").lower() == "true"
    
    logger.info(f"🏭 Storage service factory: USE_CLOUD_STORAGE={use_cloud_storage}")
    
    if use_cloud_storage:
        bucket_name = os.getenv("STORAGE_BUCKET_NAME", "mnemos-data-bucket")
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "unknown")
        logger.info(f"☁️  Creating CloudStorageService: bucket='{bucket_name}', project='{project_id}'")
        return CloudStorageService(bucket_name)
    else:
        logger.info("📁 Creating FileStorageService for local development")
        return FileStorageService()