from fastapi import APIRouter
from services.data_service import load_data, get_active_items

router = APIRouter(prefix="/api", tags=["data"])


@router.get("/data")
async def get_data():
    """Get all application data with non-archived items only - SUPER FAST O(1) operation"""
    data = load_data()
    # Create a copy with pre-filtered active items from cache
    filtered_data = data.copy()
    filtered_data.items = get_active_items()
    return filtered_data