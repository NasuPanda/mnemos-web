#!/usr/bin/env python3
"""
Test script for PUT /api/items/{id} endpoint
"""
import json
import sys
import requests
import time
from datetime import datetime

def test_update_endpoint():
    """Test PUT endpoint functionality"""
    print("🧪 Testing PUT /api/items/{id} endpoint...")
    
    base_url = "http://localhost:8000"
    
    # 1. Test successful item update
    print("\n1. Testing successful item update...")
    
    try:
        # Get existing items
        response = requests.get(f"{base_url}/api/items")
        if response.status_code == 200:
            items = response.json()
            
            if items:
                # Use first item for update test
                original_item = items[0]
                item_id = original_item["id"]
                print(f"   ✅ Found item to update: {item_id}")
                print(f"   ✅ Original name: '{original_item['name']}'")
                
                # Create updated item data
                updated_data = {
                    "name": "UPDATED - Test Item Name",
                    "section": "Updated Category",
                    "side_note": "This item was updated via API test",
                    "problem_text": "Updated problem text",
                    "problem_url": "https://updated-example.com",
                    "problem_image": None,
                    "answer_text": "Updated answer text", 
                    "answer_url": "https://updated-answer.com",
                    "answer_image": None,
                    "reviewed": True,
                    "next_review_date": "2025-07-05",
                    "review_dates": ["2025-07-02"],
                    "created_date": "2025-07-01T10:00:00.000Z",  # This should be ignored/preserved
                    "last_accessed": "2025-07-01T10:00:00.000Z",  # This should be updated
                    "archived": False
                }
                
                # Send PUT request
                put_response = requests.put(f"{base_url}/api/items/{item_id}", json=updated_data)
                
                if put_response.status_code == 200:
                    updated_item = put_response.json()
                    print(f"   ✅ Update successful")
                    print(f"   ✅ Updated name: '{updated_item['name']}'")
                    
                    # Verify preserved fields
                    if updated_item["id"] == item_id:
                        print(f"   ✅ ID preserved: {updated_item['id']}")
                    else:
                        print(f"   ❌ ID not preserved: expected {item_id}, got {updated_item['id']}")
                        return False
                        
                    if updated_item["created_date"] == original_item["created_date"]:
                        print(f"   ✅ Created date preserved: {updated_item['created_date']}")
                    else:
                        print(f"   ❌ Created date not preserved")
                        return False
                    
                    # Verify updated fields
                    if updated_item["name"] == updated_data["name"]:
                        print(f"   ✅ Name updated correctly")
                    else:
                        print(f"   ❌ Name not updated correctly")
                        return False
                        
                    if updated_item["section"] == updated_data["section"]:
                        print(f"   ✅ Section updated correctly")
                    else:
                        print(f"   ❌ Section not updated correctly")
                        return False
                    
                    # Verify last_accessed was updated (should be different)
                    if updated_item["last_accessed"] != original_item["last_accessed"]:
                        print(f"   ✅ Last accessed timestamp updated")
                    else:
                        print(f"   ⚠️ Last accessed timestamp may not have been updated")
                    
                    # Verify persistence by fetching again
                    verify_response = requests.get(f"{base_url}/api/items/{item_id}")
                    if verify_response.status_code == 404:
                        # Item not found via direct ID (expected since we don't have that endpoint)
                        # Get all items and find the updated one
                        all_items_response = requests.get(f"{base_url}/api/items")
                        if all_items_response.status_code == 200:
                            all_items = all_items_response.json()
                            found_item = next((item for item in all_items if item["id"] == item_id), None)
                            
                            if found_item and found_item["name"] == updated_data["name"]:
                                print(f"   ✅ Changes persisted to storage")
                            else:
                                print(f"   ❌ Changes not persisted to storage")
                                return False
                        else:
                            print(f"   ❌ Could not verify persistence")
                            return False
                    
                else:
                    print(f"   ❌ Update failed: {put_response.status_code} - {put_response.text}")
                    return False
            else:
                print(f"   ⚠️ No items found to update")
                print(f"   💡 Create some test data first")
                return False
        else:
            print(f"   ❌ Failed to get items: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Could not connect to server at {base_url}")
        print(f"   💡 Make sure backend is running: docker-compose up backend")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False
    
    # 2. Test update of non-existent item
    print("\n2. Testing update of non-existent item...")
    
    try:
        fake_id = "non-existent-item-id"
        fake_update = {
            "name": "Fake Item",
            "section": "Fake Category",
            "side_note": "",
            "problem_text": "Fake problem",
            "answer_text": "Fake answer",
            "reviewed": False,
            "next_review_date": None,
            "review_dates": [],
            "created_date": "2025-07-02T10:00:00.000Z",
            "last_accessed": "2025-07-02T10:00:00.000Z",
            "archived": False
        }
        
        response = requests.put(f"{base_url}/api/items/{fake_id}", json=fake_update)
        
        if response.status_code == 404:
            error_data = response.json()
            print(f"   ✅ Correct 404 response: {error_data['detail']}")
        else:
            print(f"   ❌ Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing non-existent item: {e}")
        return False
    
    # 3. Test category addition
    print("\n3. Testing new category addition...")
    
    try:
        # Get current categories
        data_response = requests.get(f"{base_url}/api/data")
        if data_response.status_code == 200:
            app_data = data_response.json()
            original_categories = app_data.get("categories", [])
            print(f"   ✅ Original categories: {original_categories}")
            
            # Update an item with a new category
            items_response = requests.get(f"{base_url}/api/items")
            if items_response.status_code == 200:
                items = items_response.json()
                if items:
                    item_id = items[0]["id"]
                    new_category = "Brand New Test Category"
                    
                    update_with_new_category = {
                        "name": "Item with New Category",
                        "section": new_category,
                        "side_note": "",
                        "problem_text": "Test problem",
                        "answer_text": "Test answer",
                        "reviewed": False,
                        "next_review_date": None,
                        "review_dates": [],
                        "created_date": "2025-07-02T10:00:00.000Z",
                        "last_accessed": "2025-07-02T10:00:00.000Z",
                        "archived": False
                    }
                    
                    update_response = requests.put(f"{base_url}/api/items/{item_id}", json=update_with_new_category)
                    
                    if update_response.status_code == 200:
                        # Check if category was added
                        new_data_response = requests.get(f"{base_url}/api/data")
                        if new_data_response.status_code == 200:
                            new_app_data = new_data_response.json()
                            new_categories = new_app_data.get("categories", [])
                            
                            if new_category in new_categories:
                                print(f"   ✅ New category added: '{new_category}'")
                                print(f"   ✅ Updated categories: {new_categories}")
                            else:
                                print(f"   ❌ New category not added")
                                return False
                        else:
                            print(f"   ❌ Could not fetch updated categories")
                            return False
                    else:
                        print(f"   ❌ Failed to update item with new category")
                        return False
                else:
                    print(f"   ⚠️ No items available for category test")
            else:
                print(f"   ❌ Could not fetch items for category test")
                return False
        else:
            print(f"   ❌ Could not fetch app data")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing category addition: {e}")
        return False
    
    print("\n🎉 All PUT endpoint tests passed!")
    return True

if __name__ == "__main__":
    print("🚀 Starting PUT endpoint tests...")
    print("💡 Make sure backend is running: docker-compose up backend")
    print("⏳ Waiting 3 seconds for you to start the backend...")
    time.sleep(3)
    
    success = test_update_endpoint()
    sys.exit(0 if success else 1)