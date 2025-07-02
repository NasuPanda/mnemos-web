# Backend Implementation Tasks

## Current Status
✅ **Completed:**
- Item model with all required fields
- AppData model (items, categories, settings)
- JSON file storage (load_data/save_data functions)
- POST /api/upload-image (image upload)
- GET /api/data (returns complete AppData)
- POST /api/items (create new item)
- GET /api/items (get all items)

❌ **Missing Tasks:**
- Create dummy JSON file and test JSON file storage functionality
- PUT /api/items/{id} - Update existing item
- DELETE /api/items/{id} - Delete item
- PUT /api/settings - Update global settings

## Implementation Proposals

### 1. PUT /api/items/{id} - Update Item

```python
@app.put("/api/items/{item_id}")
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
            save_data(data)
            return updated_item

    raise HTTPException(status_code=404, detail="Item not found")
```

**Logic:** Personal app - single JSON file, find by ID, preserve creation date, update categories.

### 2. DELETE /api/items/{id} - Delete Item

*To be proposed*

### 3. PUT /api/settings - Update Settings

*To be proposed*

## Notes
- Personal app (single user)
- No authentication needed
- Single JSON file storage
- Frontend handles date filtering
