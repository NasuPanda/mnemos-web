from fastapi import APIRouter
from services.data_service import load_data

router = APIRouter(prefix="/api", tags=["data"])


@router.get("/data")
async def get_data():
    """Get all application data"""
    return load_data()