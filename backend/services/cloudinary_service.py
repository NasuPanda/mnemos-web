import cloudinary
import cloudinary.uploader
import cloudinary.api
import uuid
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class CloudinaryService:
    def __init__(self):
        """Initialize Cloudinary with environment variables"""
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET"),
            secure=True
        )
        
        # Verify configuration
        if not all([
            os.getenv("CLOUDINARY_CLOUD_NAME"),
            os.getenv("CLOUDINARY_API_KEY"), 
            os.getenv("CLOUDINARY_API_SECRET")
        ]):
            logger.warning("Cloudinary credentials not found in environment variables")

    def upload_image(self, file_content: bytes, filename: str) -> str:
        """
        Upload image to Cloudinary with FREE tier optimization
        
        Args:
            file_content: Image file content as bytes
            filename: Original filename for extension detection
            
        Returns:
            Secure HTTPS URL to the uploaded image
            
        Raises:
            Exception: If upload fails or file too large
        """
        try:
            # Pre-upload validation to stay within free tier limits
            if len(file_content) > 5_000_000:  # 5MB limit
                raise Exception("Image too large. Please compress to under 5MB.")
            
            # Generate unique filename
            file_extension = filename.split('.')[-1].lower() if '.' in filename else 'jpg'
            unique_id = str(uuid.uuid4())
            public_id = f"mnemos-images/{unique_id}"
            
            # Upload to Cloudinary with FREE tier optimization
            result = cloudinary.uploader.upload(
                file_content,
                public_id=public_id,
                folder="mnemos-images",
                resource_type="image",
                
                # FREE optimization features (no extra cost)
                quality="auto:good",        # Smart compression
                fetch_format="auto",        # WebP for modern browsers, fallback for others
                width=1200,                 # Max width limit to save storage
                height=1200,                # Max height limit to save storage
                crop="limit",               # Only resize if larger (no upscaling)
                
                # Reduce storage usage (FREE features)
                strip_metadata=True,        # Remove EXIF data
                progressive=True,           # Progressive JPEG loading
                overwrite=False,            # Don't replace existing images
                invalidate=True             # Clear CDN cache
            )
            
            logger.info(f"Successfully uploaded optimized image to Cloudinary: {result['public_id']} "
                       f"(original: {len(file_content)} bytes, optimized: {result.get('bytes', 'unknown')} bytes)")
            return result['secure_url']
            
        except Exception as e:
            logger.error(f"Failed to upload image to Cloudinary: {str(e)}")
            raise Exception(f"Image upload failed: {str(e)}")

    def delete_image(self, public_id: str) -> bool:
        """
        Delete image from Cloudinary
        
        Args:
            public_id: The public ID of the image to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            success = result.get('result') == 'ok'
            
            if success:
                logger.info(f"Successfully deleted image from Cloudinary: {public_id}")
            else:
                logger.warning(f"Failed to delete image from Cloudinary: {public_id}")
                
            return success
            
        except Exception as e:
            logger.error(f"Error deleting image from Cloudinary: {str(e)}")
            return False

    def get_public_id_from_url(self, url: str) -> Optional[str]:
        """
        Extract public_id from Cloudinary URL for deletion
        
        Args:
            url: Full Cloudinary URL
            
        Returns:
            Public ID if URL is valid Cloudinary URL, None otherwise
        """
        try:
            if "res.cloudinary.com" in url and "mnemos-images/" in url:
                # Extract public_id from URL
                # URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456789/mnemos-images/uuid.ext
                parts = url.split("/")
                if len(parts) >= 3:
                    # Find mnemos-images part and get the next part (uuid.ext)
                    for i, part in enumerate(parts):
                        if part == "mnemos-images" and i + 1 < len(parts):
                            filename = parts[i + 1]
                            # Remove extension to get public_id
                            return f"mnemos-images/{filename.split('.')[0]}"
            return None
        except Exception as e:
            logger.error(f"Error extracting public_id from URL: {str(e)}")
            return None

    def get_optimized_url(self, cloudinary_url: str, context: str = "card") -> str:
        """
        Generate optimized URLs for different display contexts to save bandwidth
        
        Args:
            cloudinary_url: Original Cloudinary URL
            context: Display context ("thumbnail", "card", "modal", "fullscreen")
            
        Returns:
            Optimized URL with transformations for the given context
        """
        if not cloudinary_url or "res.cloudinary.com" not in cloudinary_url:
            return cloudinary_url
            
        try:
            base_url = cloudinary_url.split('/upload/')[0] + '/upload/'
            image_path = cloudinary_url.split('/upload/')[1]
            
            # FREE transformations for different contexts
            transformations = {
                "thumbnail": "w_200,h_200,c_fill,q_auto:low,f_auto",     # Card previews
                "card": "w_400,h_400,c_fit,q_auto:good,f_auto",          # ItemCard display  
                "modal": "w_800,h_800,c_fit,q_auto:good,f_auto",         # Modal viewing
                "fullscreen": "w_1200,h_1200,c_fit,q_auto:best,f_auto"  # Full-screen viewing
            }
            
            transformation = transformations.get(context, "")
            if transformation:
                return base_url + transformation + "/" + image_path
            else:
                return cloudinary_url  # Return original for unknown context
                
        except Exception as e:
            logger.error(f"Error generating optimized URL: {str(e)}")
            return cloudinary_url  # Return original on error

    def is_cloudinary_configured(self) -> bool:
        """Check if Cloudinary is properly configured"""
        return all([
            os.getenv("CLOUDINARY_CLOUD_NAME"),
            os.getenv("CLOUDINARY_API_KEY"),
            os.getenv("CLOUDINARY_API_SECRET")
        ])

# Global instance
cloudinary_service = CloudinaryService()