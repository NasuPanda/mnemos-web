from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from models import Item
from services.data_service import load_data, save_data, get_active_items, is_data_ready

router = APIRouter(prefix="/api/items", tags=["items"])


@router.post("")
async def create_item(item: Item):
    """Create a new item"""
    data = load_data()
    
    # Generate ID and timestamps
    item.id = str(uuid.uuid4())
    item.created_date = datetime.now().isoformat()
    item.last_accessed = datetime.now().isoformat()
    
    data.items.append(item)
    
    # Add category if new
    if item.section and item.section not in data.categories:
        data.categories.append(item.section)
    
    await save_data(data)
    return item


@router.get("")
async def get_items():
    """Get all non-archived items - SUPER FAST O(1) operation"""
    if not is_data_ready():
        raise HTTPException(
            status_code=503,
            detail="Service starting up - data loading in background. Please try again in a moment."
        )
    return get_active_items()


@router.delete("/{item_id}")
async def delete_item(item_id: str):
    """Delete an existing item"""
    data = load_data()
    
    # Find and remove item by ID
    original_count = len(data.items)
    data.items = [item for item in data.items if item.id != item_id]
    
    # Check if item was found and removed
    if len(data.items) == original_count:
        raise HTTPException(status_code=404, detail="Item not found")
    
    await save_data(data)
    return {"message": "Item deleted successfully", "id": item_id}


@router.put("/{item_id}")
async def update_item(item_id: str, updated_item: Item):
    """Update an existing item"""
    data = load_data()

    # Find item by ID
    for i, item in enumerate(data.items):
        if item.id == item_id:
            # Preserve original metadata
            updated_item.id = item_id
            updated_item.created_date = item.created_date
            updated_item.last_accessed = datetime.now().isoformat()

            # Add new category if needed
            if updated_item.section and updated_item.section not in data.categories:
                data.categories.append(updated_item.section)

            # Replace item
            data.items[i] = updated_item
            await save_data(data)
            return updated_item

    raise HTTPException(status_code=404, detail="Item not found")