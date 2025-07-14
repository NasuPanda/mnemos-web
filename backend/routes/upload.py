from fastapi import APIRouter, File, UploadFile, HTTPException
import shutil
import uuid
import os
from config import IMAGES_DIR, MAX_FILE_SIZE, ALLOWED_IMAGE_EXTENSIONS, DEFAULT_IMAGE_EXTENSION
from services.cloudinary_service import cloudinary_service

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and return its path"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file size
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File size must be less than {MAX_FILE_SIZE // (1024*1024)}MB")
    
    # Generate unique filename
    file_extension = DEFAULT_IMAGE_EXTENSION
    if file.filename and "." in file.filename:
        file_extension = file.filename.split('.')[-1].lower()
    
    # Validate file extension
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File extension must be one of: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Validate actual file content size (secondary check)
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail=f"File size must be less than {MAX_FILE_SIZE // (1024*1024)}MB")
        
        # Try Cloudinary first (for production)
        if cloudinary_service.is_cloudinary_configured():
            try:
                cloudinary_url = cloudinary_service.upload_image(file_content, file.filename or f"image.{file_extension}")
                return {"image_path": cloudinary_url}
            except Exception as cloudinary_error:
                # Log error 
                print(f"Cloudinary upload failed: {cloudinary_error}")
                # If file is too large for Cloudinary, don't fall back to local storage
                if "too large" in str(cloudinary_error).lower() or "5mb" in str(cloudinary_error).lower():
                    raise HTTPException(status_code=413, detail=str(cloudinary_error))
                # For other Cloudinary errors, fall back to local storage
        
        # Fallback to local storage (for development)
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = IMAGES_DIR / unique_filename
        
        # Save file locally
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Return path relative to server root
        return {"image_path": f"/images/{unique_filename}"}
    
    except HTTPException:
        # Re-raise HTTP exceptions (like file size validation)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")