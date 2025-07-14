from fastapi import APIRouter, HTTPException
from models import Settings
from services.data_service import load_data, save_data

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.put("")
async def update_settings(new_settings: Settings):
    """Update global settings"""
    data = load_data()
    
    # Validate settings values
    if new_settings.confident_days <= 0 or new_settings.medium_days <= 0 or new_settings.wtf_days <= 0:
        raise HTTPException(status_code=400, detail="All settings values must be positive integers")
    
    # Update settings
    data.settings = new_settings
    
    await save_data(data)
    return data.settings