from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.data_service import load_data, save_data, is_data_ready

router = APIRouter(prefix="/api/categories", tags=["categories"])


class CategoryRequest(BaseModel):
    name: str


class CategoryRenameRequest(BaseModel):
    old_name: str
    new_name: str


@router.get("")
async def get_categories() -> List[str]:
    """Get all categories"""
    if not is_data_ready():
        raise HTTPException(
            status_code=503,
            detail="Service starting up - data loading in background. Please try again in a moment."
        )
    data = load_data()
    return data.categories


@router.post("")
async def add_category(request: CategoryRequest) -> dict:
    """Add a new category"""
    if not is_data_ready():
        raise HTTPException(
            status_code=503,
            detail="Service starting up - data loading in background. Please try again in a moment."
        )
    
    category_name = request.name.strip()
    
    # Validation
    if not category_name:
        raise HTTPException(status_code=400, detail="Category name cannot be empty")
    
    if len(category_name) > 100:
        raise HTTPException(status_code=400, detail="Category name cannot exceed 100 characters")
    
    # Reserved names check
    reserved_names = ["all", "none", "default", "new", "add", "delete", "edit", "settings"]
    if category_name.lower() in reserved_names:
        raise HTTPException(status_code=400, detail=f"'{category_name}' is a reserved name")
    
    data = load_data()
    
    # Check for duplicates (case-insensitive)
    if any(existing.lower() == category_name.lower() for existing in data.categories):
        raise HTTPException(status_code=409, detail="Category already exists")
    
    # Add the category
    data.categories.append(category_name)
    await save_data(data)
    
    return {"message": "Category added successfully", "name": category_name}


@router.delete("/{category_name}")
async def delete_category(category_name: str) -> dict:
    """Delete a category"""
    if not is_data_ready():
        raise HTTPException(
            status_code=503,
            detail="Service starting up - data loading in background. Please try again in a moment."
        )
    
    data = load_data()
    
    # Check if category exists
    if category_name not in data.categories:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Safety check: verify category is not in use
    items_with_category = [item for item in data.items if item.section == category_name]
    if items_with_category:
        raise HTTPException(
            status_code=409, 
            detail=f"Cannot delete category '{category_name}' - it is used by {len(items_with_category)} item(s)"
        )
    
    # Remove the category
    data.categories.remove(category_name)
    await save_data(data)
    
    return {"message": "Category deleted successfully", "name": category_name}


@router.put("/{category_name}")
async def rename_category(category_name: str, request: CategoryRequest) -> dict:
    """Rename a category"""
    if not is_data_ready():
        raise HTTPException(
            status_code=503,
            detail="Service starting up - data loading in background. Please try again in a moment."
        )
    
    new_name = request.name.strip()
    
    # Validation
    if not new_name:
        raise HTTPException(status_code=400, detail="New category name cannot be empty")
    
    if len(new_name) > 100:
        raise HTTPException(status_code=400, detail="Category name cannot exceed 100 characters")
    
    # Reserved names check
    reserved_names = ["all", "none", "default", "new", "add", "delete", "edit", "settings"]
    if new_name.lower() in reserved_names:
        raise HTTPException(status_code=400, detail=f"'{new_name}' is a reserved name")
    
    data = load_data()
    
    # Check if old category exists
    if category_name not in data.categories:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if new name already exists (case-insensitive)
    if any(existing.lower() == new_name.lower() for existing in data.categories if existing != category_name):
        raise HTTPException(status_code=409, detail="A category with the new name already exists")
    
    # Update category name in the categories list
    category_index = data.categories.index(category_name)
    data.categories[category_index] = new_name
    
    # Update all items that use this category
    items_updated = 0
    for item in data.items:
        if item.section == category_name:
            item.section = new_name
            items_updated += 1
    
    await save_data(data)
    
    return {
        "message": "Category renamed successfully", 
        "old_name": category_name,
        "new_name": new_name,
        "items_updated": items_updated
    }