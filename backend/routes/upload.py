from fastapi import APIRouter, File, UploadFile, HTTPException
import shutil
import uuid
from config import IMAGES_DIR, MAX_FILE_SIZE, ALLOWED_IMAGE_EXTENSIONS, DEFAULT_IMAGE_EXTENSION

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