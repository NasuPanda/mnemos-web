#!/usr/bin/env python3
"""
Test script for JSON file storage functionality
"""
import json
import os
import sys
from pathlib import Path

# Add the backend directory to Python path to import main.py
sys.path.append(str(Path(__file__).parent))

from main import AppData, Item, load_data, save_data

def test_json_storage():
    """Test JSON file storage functionality"""
    print("🧪 Testing JSON file storage functionality...")
    
    # 1. Test loading dummy data
    print("\n1. Testing load_data() with dummy file...")
    
    # Copy dummy data to expected filename
    dummy_file = "test_dummy_data.json"
    main_file = "mnemos_data.json"
    
    # Backup existing file if it exists
    if os.path.exists(main_file):
        os.rename(main_file, f"{main_file}.backup")
        print(f"   ✅ Backed up existing {main_file}")
    
    # Copy dummy data
    with open(dummy_file, 'r') as src, open(main_file, 'w') as dst:
        data = json.load(src)
        json.dump(data, dst, indent=2)
    print(f"   ✅ Copied {dummy_file} to {main_file}")
    
    # Test loading
    try:
        loaded_data = load_data()
        print(f"   ✅ Loaded AppData with {len(loaded_data.items)} items")
        print(f"   ✅ Categories: {loaded_data.categories}")
        print(f"   ✅ Settings: {loaded_data.settings}")
        
        # Verify item structure
        if loaded_data.items:
            first_item = loaded_data.items[0]
            print(f"   ✅ First item: {first_item.name} (ID: {first_item.id})")
            
    except Exception as e:
        print(f"   ❌ Failed to load data: {e}")
        return False
    
    # 2. Test modifying and saving data
    print("\n2. Testing save_data() functionality...")
    
    try:
        # Add a new test item
        new_item = Item(
            name="Test New Item",
            section="Test Category", 
            side_note="Added during storage test",
            problem_text="This is a test problem",
            answer_text="This is a test answer",
            created_date="2025-07-02T11:00:00.000Z",
            last_accessed="2025-07-02T11:00:00.000Z"
        )
        new_item.id = "test-new-item"
        
        loaded_data.items.append(new_item)
        loaded_data.categories.append("Test Category")
        
        # Save modified data
        save_data(loaded_data)
        print(f"   ✅ Saved data with new item")
        
        # Reload and verify
        reloaded_data = load_data()
        print(f"   ✅ Reloaded data with {len(reloaded_data.items)} items")
        
        # Check if new item exists
        new_item_found = any(item.id == "test-new-item" for item in reloaded_data.items)
        if new_item_found:
            print(f"   ✅ New item found after reload")
        else:
            print(f"   ❌ New item not found after reload")
            return False
            
    except Exception as e:
        print(f"   ❌ Failed to save/reload data: {e}")
        return False
    
    # 3. Test empty file creation
    print("\n3. Testing empty file creation...")
    
    try:
        # Remove data file
        os.remove(main_file)
        print(f"   ✅ Removed {main_file}")
        
        # Load should create new empty data
        empty_data = load_data()
        print(f"   ✅ Created new AppData with {len(empty_data.items)} items")
        print(f"   ✅ Default categories: {empty_data.categories}")
        
    except Exception as e:
        print(f"   ❌ Failed to create empty data: {e}")
        return False
    
    # Cleanup - restore backup if it exists
    print("\n4. Cleanup...")
    if os.path.exists(f"{main_file}.backup"):
        os.rename(f"{main_file}.backup", main_file)
        print(f"   ✅ Restored backup {main_file}")
    elif os.path.exists(main_file):
        os.remove(main_file)
        print(f"   ✅ Removed test {main_file}")
    
    print("\n🎉 All JSON storage tests passed!")
    return True

if __name__ == "__main__":
    success = test_json_storage()
    sys.exit(0 if success else 1)