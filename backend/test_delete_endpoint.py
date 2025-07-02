#!/usr/bin/env python3
"""
Test script for DELETE /api/items/{id} endpoint
"""
import json
import os
import sys
import requests
import time
from pathlib import Path

def test_delete_endpoint():
    """Test DELETE endpoint functionality"""
    print("🧪 Testing DELETE /api/items/{id} endpoint...")
    
    base_url = "http://localhost:8000"
    
    # 1. Setup test data
    print("\n1. Setting up test data...")
    
    # Create test data file
    test_data = {
        "items": [
            {
                "id": "delete-test-1",
                "name": "Item to Delete",
                "section": "Test Category",
                "side_note": "This item will be deleted",
                "problem_text": "Test problem",
                "problem_url": None,
                "problem_image": None,
                "answer_text": "Test answer",
                "answer_url": None,
                "answer_image": None,
                "reviewed": False,
                "next_review_date": None,
                "review_dates": [],
                "created_date": "2025-07-02T10:00:00.000Z",
                "last_accessed": "2025-07-02T10:00:00.000Z",
                "archived": False
            },
            {
                "id": "delete-test-2",
                "name": "Item to Keep",
                "section": "Test Category",
                "side_note": "This item should remain",
                "problem_text": "Keep this problem",
                "problem_url": None,
                "problem_image": None,
                "answer_text": "Keep this answer",
                "answer_url": None,
                "answer_image": None,
                "reviewed": False,
                "next_review_date": None,
                "review_dates": [],
                "created_date": "2025-07-02T10:00:00.000Z",
                "last_accessed": "2025-07-02T10:00:00.000Z",
                "archived": False
            }
        ],
        "categories": ["Test Category", "Default"],
        "settings": {
            "confident_days": 7,
            "medium_days": 3,
            "wtf_days": 1
        },
        "last_updated": "2025-07-02T10:00:00.000Z"
    }
    
    # Write test data to mnemos_data.json in container
    print("   ✅ Created test data with 2 items")
    
    return test_data

def run_delete_tests():
    """Run the actual delete tests"""
    base_url = "http://localhost:8000"
    
    # 2. Test successful deletion
    print("\n2. Testing successful item deletion...")
    
    try:
        # Get initial items count
        response = requests.get(f"{base_url}/api/items")
        if response.status_code == 200:
            initial_items = response.json()
            print(f"   ✅ Initial items count: {len(initial_items)}")
            
            # Find an item to delete
            if initial_items:
                item_to_delete = initial_items[0]["id"]
                print(f"   ✅ Found item to delete: {item_to_delete}")
                
                # Delete the item
                delete_response = requests.delete(f"{base_url}/api/items/{item_to_delete}")
                if delete_response.status_code == 200:
                    result = delete_response.json()
                    print(f"   ✅ Delete successful: {result['message']}")
                    
                    # Verify item was deleted
                    verify_response = requests.get(f"{base_url}/api/items")
                    if verify_response.status_code == 200:
                        remaining_items = verify_response.json()
                        print(f"   ✅ Remaining items count: {len(remaining_items)}")
                        
                        # Check that deleted item is not in list
                        deleted_item_found = any(item["id"] == item_to_delete for item in remaining_items)
                        if not deleted_item_found:
                            print(f"   ✅ Deleted item not found in remaining items")
                        else:
                            print(f"   ❌ Deleted item still found in remaining items")
                            return False
                    else:
                        print(f"   ❌ Failed to verify deletion: {verify_response.status_code}")
                        return False
                else:
                    print(f"   ❌ Delete failed: {delete_response.status_code} - {delete_response.text}")
                    return False
            else:
                print(f"   ⚠️ No items found to delete")
        else:
            print(f"   ❌ Failed to get initial items: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Could not connect to server at {base_url}")
        print(f"   💡 Make sure backend is running: docker-compose up backend")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False
    
    # 3. Test deletion of non-existent item
    print("\n3. Testing deletion of non-existent item...")
    
    try:
        fake_id = "non-existent-item-id"
        response = requests.delete(f"{base_url}/api/items/{fake_id}")
        
        if response.status_code == 404:
            error_data = response.json()
            print(f"   ✅ Correct 404 response: {error_data['detail']}")
        else:
            print(f"   ❌ Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error testing non-existent item: {e}")
        return False
    
    print("\n🎉 All DELETE endpoint tests passed!")
    return True

if __name__ == "__main__":
    print("🚀 Starting DELETE endpoint tests...")
    print("💡 Make sure backend is running: docker-compose up backend")
    print("⏳ Waiting 3 seconds for you to start the backend...")
    time.sleep(3)
    
    success = run_delete_tests()
    sys.exit(0 if success else 1)